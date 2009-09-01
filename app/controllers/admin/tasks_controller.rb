class Admin::TasksController < ApplicationController

	before_filter :is_superadmin?

	def index
		
	end

 def run_task
   if params[:job] == 'xapian'
     system("rake xapian:update_index RAILS_ENV=#{RAILS_ENV}")
   end
   if params[:job] == 'feeds'
     system("ruby script/runner -e #{RAILS_ENV} 'FeedSource.update_feed_source'")
   end
   if params[:job] == 'newsletter'
     Delayed::Job.enqueue(NewsletterJob.new)
   end
   if params[:job] == 'restart_server'
     system "touch #{RAILS_ROOT}/tmp/restart.txt" # tells passenger to restart the
     message = "Server restarted successfully"
   end
   render :update do |page|
     page.call 'alert', message.nil? ? "#{params[:job]} Updated Sucessfully " : message
   end
 end

end
