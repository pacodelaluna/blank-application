# The priority is based upon order of creation: first created -> highest priority.

# Sample of regular route:
#   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
# Keep in mind you can assign values other than :controller and :action

# Sample of named route:
#   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
# This route can be invoked with purchase_url(:id => product.id)

# Sample resource route (maps HTTP verbs to controller actions automatically):
#   map.resources :products

# Sample resource route with options:
#   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

# Sample resource route with sub-resources:
#   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller

# Sample resource route with more complex sub-resources
#   map.resources :products do |products|
#     products.resources :comments
#     products.resources :sales, :collection => { :recent => :get }
#   end

# Sample resource route within a namespace:
#   map.namespace :admin do |admin|
#     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
#     admin.resources :products
#   end

# You can have the root of your site routed with map.root -- just remember to delete public/index.html.
# map.root :controller => "welcome"

# See how all your routes lay out with "rake routes"

# Install the default routes as the lowest priority.
# Note: These default routes make all actions in every controller accessible via GET requests. You should
# consider removing the them or commenting them out if you're using named routes and resources.
ActionController::Routing::Routes.draw do |map|

  # Blank Specific Routes
  # Routes Related to SuperAdministrator
	map.namespace :superadmin do |sa|
		sa.resources :general_settings, :only => [:index], :collection => { :updating => :put }
		sa.resources :user_interfaces, :only => [:index], :collection => { :updating => :put, :check_color => :get, :colors_changing => :get }
		sa.resources :tasks, :only => [:index], :collection => { :run_task => :get }
		sa.resources :translations, :only => [:index], :collection => { :updating => :put, :context_switching => :get, :translation_new => :any }
    sa.resources :mailer_settings, :only => [:index], :collection => { :updating => :put }
    # Routes for Roles and Permissions in BA
    sa.resources :roles, :collection => {:validate => :post}
    sa.resources :permissions, :collection => {:validate => :post}
	end

  map.namespace :admin do |admin|
    # Generated by Restful Authentification
    admin.logout '/logout', :controller => 'sessions', :action => 'destroy'
    admin.login '/login', :controller => 'sessions', :action => 'new'
    admin.signup '/signup', :controller => 'users', :action => 'new'
    admin.activate '/activate/:activation_code', :controller => 'users', :action => 'activate'
    admin.forgot_password '/forgot_password', :controller => 'users', :action => 'forgot_password'
    admin.reset_password '/reset_password/:password_reset_code', :controller => 'users', :action => 'reset_password'
    admin.resources :users, :member => { :locking => :any, :resend_activation_mail_or_activate_manually => :post },
      :collection => {:autocomplete_on => :any, :validate => :any }
    admin.resource :session

    # Routes for People
    admin.resources :people, :collection => {:export_people => :any, :import_people => :any, :get_empty_csv => :get, :validate => :any ,:filter => :get }

    # Route for HomePage
    admin.resources :home, :only => [:index], :collection => { :autocomplete_on => :any }

    # Routes for Comments
    admin.resources :comments, :only => [:index, :edit, :update, :destroy], :member => { :change_state => :any, :add_reply => :any}, :collection => {:validate => :post}
    # Routes for ratings
    admin.resources :ratings, :only => [:index]
    # Route for HomePage
    admin.root :controller => 'home', :action => 'index'

    # Items are CMS component types
    # Those items may be scoped to different resources
    def items_resources(parent)
      (ITEMS).each do |name|
        member_to_set = {
          :rate => :any,
          :add_comment => :any,
          :redirect_to_content => :any
        }
        member_to_set.merge!({:remove_file => :any}) if name=='article'
        member_to_set.merge!({:get_video_progress => :any}) if name=='video'
        member_to_set.merge!({:get_audio_progress => :any}) if name=='audio'
        member_to_set.merge!({:send_to_a_group => :any}) if name=='newsletter'
        member_to_set.merge!({:export_to_csv => :any}) if name=='group'
        member_to_set.merge!({:download => :any}) if ['audio', 'video', 'cms_file', 'image'].include?(name)
        collection_to_set = {
          :validate => :post
        }
        collection_to_set.merge!({:filtering_contacts => :get}) if name=='group'
        parent.resources name.pluralize.to_sym, :member => member_to_set, :collection => collection_to_set
      end
      parent.content '/content/:item_type', :controller => 'content', :action => 'index'
      parent.ajax_content '/ajax_content/:item_type', :controller => 'content', :action => 'ajax_index'
      parent.content_popup '/content_for_popup/:selected_item', :controller => 'content', :action => 'display_item_in_pop_up'
    end

    # Newsletter related routes
    admin.unsubscribe_for_newsletter 'admin/unsubscribe_for_newsletter', :controller => 'workspace_contacts', :action => 'unsubscribe'

    # FCKTools route for utilities methods for FCK editor
    admin.connect '/ck_uploads', :controller => 'ck_tools', :action => 'upload_from_ck'
    admin.connect '/ck_config', :controller => 'ck_tools', :action => 'config_file'

    # Items created outside any workspace are private or fully public.
    # Items may be acceded by a list that gives all items the user can consult.
    # => (his items, the public items, and items in workspaces he has permissions)
    items_resources(admin)

    CONTAINERS.each do |container|
      admin.resources "#{container.pluralize}".to_sym, :member => { :add_new_user => :any, :subscription => :any, :unsubscription => :any, :question => :any }, :collection => {:validate => :post} do |con|
        items_resources(con)
        if container == 'workspace'
          con.resources :people, :collection => { :export_people => :any, :import_people => :any, :get_empty_csv => :get, :validate => :post ,:filter => :get }
          con.resources :workspace_contacts, :as => 'contacts', :except => :all, :collection => { :select => [:post, :get], :list => [:post, :get], :subscribe => :get}
        end
      end
    end

    # Search related routes
    admin.resources :searches, :collection => { :print_advanced => :any, :validate => :post }

    # Catch Errors and show custom message, avoid SWW
    admin.error 'admin/error/:status' , :controller => 'home', :action => 'error'

    #################################################################################

    # Add Project Specific Routes here!
    # Default Home
    map.root :controller => "admin/home", :action => 'index'


  end
end
