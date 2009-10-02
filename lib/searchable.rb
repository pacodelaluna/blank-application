# This module is defining the methods and scopes allowing to retrieve objects list from a model.
#
module Searchable
  module ModelMethods
    
    def self.included(base)
      base.extend ClassMethods
    end
    
    module ClassMethods
			# This mixin method is :
			# - setting the fields to index with Xapian and defining the scope to search on taht index if the arg is given
			# - defining a scope for filtering
			# - defining a scope for paginating
			# - defining the method 'get_da_objects_list'
			def acts_as_searchable(*args)
				options = args.extract_options!
				
				if options[:full_text_fields]
					acts_as_xapian :texts => options[:full_text_fields]
					# Retrieve the results matching with Xapian indewes and ordered by weight
					named_scope :searching_text_with_xapian,
						lambda { |text| { :conditions => ["#{self.class_name.underscore.pluralize}.id in (?)", ActsAsXapian::Search.new([self.class_name.classify.constantize], text, :limit => 100000).results.sort{ |x, y| x[:weight] <=> y[:weight]}.collect{|x| x[:model].id}] }
					}
				end
				
#				# Retrieve the results matching the Hash conditions passed
#				named_scope :advanced_on_fields,
#					lambda { |condition| { :conditions => condition.delete_if{ |k, e| !condition_fields_tabs.include?(k.to_s) } }	}

#				# TODO todo
#				named_scope :in_workspaces,
#					lambda { |workspace_ids| { :select => "DISTINCT *", :joins => "LEFT JOIN items_workspaces ON (items_workspaces.itemable_type = '#{self.class_name}' AND items_workspaces.workspace_id IN ['1'])" } }

				# Scope ordering the results with the params
				named_scope :filtering_on,
					lambda { |field_name, way|
          if (field_name!='weight')
            { :order => "#{self.class_name.underscore.pluralize}.#{field_name} #{way}" }
          else
            {  }
          end
        }

				# Scope paginating the results with the params
				named_scope :paginating_with,
					lambda { |limit, offset| { :limit => limit, :offset => offset }
				}

				# Method returning the objects list scoping the params
				#
				# This method is using the scope defining above and also the scope defined by SearchLogic
				# thanks to the params conditions[].
				# A control is done in order to be sure that just the fields allowed are tested.
				# TODO the stuff sayed above ...
				def get_da_objects_list(*args)
					options = args.extract_options!
					req = self
					# 1. text if there
					req = req.searching_text_with_xapian(options[:full_text]) if options[:full_text]
					# 2. workspaces & permissions
					req = req.matching_user_with_permission_in_workspaces(options[:user], 'show', options[:workspace_ids])
					# 3. condition if there
          if !options[:conditions].nil?
            req = req.created_at_gte(options[:conditions][:created_at_after].to_date)  if !options[:conditions][:created_at_after].blank?
            req = req.created_at_lte(options[:conditions][:created_at_before].to_date) if !options[:conditions][:created_at_before].blank?
          end
					#req = req.filtering_on(options[:filter][:field], options[:filter][:way])
					#req = req.paginating_with(options[:pagination][:per_page].to_i, ((options[:pagination][:page].to_i - 1) * options[:pagination][:per_page].to_i))
					req = req.paginate(:per_page => options[:pagination][:per_page].to_i, :page => options[:pagination][:page].to_i, :order => options[:filter][:field]+' '+options[:filter][:way]) if !options[:skip_pag]
          return req
				end

				include Searchable::ModelMethods::InstanceMethods
      end

    end
    
    module InstanceMethods
      
    end
  end
end