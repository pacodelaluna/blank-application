class UsersController < ApplicationController
  acts_as_ajax_validation

  make_resourceful do
    actions :all
		belongs_to :account
		
    before :new, :create do permit("admin") end
    before :edit, :update do permit("admin or owner of user") end

    response_for :index do |format|
      format.html { render :layout => false }
    end
  end
 
  def create
    # logout_keeping_session!
    @user = User.new(params[:user])
    success = @user && @user.save
    if success && @user.errors.empty?
      # Protects against session fixation attacks, causes request forgery
      # protection if visitor resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset session
      # self.current_user = @user # !! now logged in
      # redirect_back_or_default('/')
      flash[:notice] = "Nouvel utilisateur créé"
			redirect_to user_url(@user)
    else
      flash[:error]  = "Ce compte n'a pu être créé, ressayez ou contactez l'administrateur."
      render :action => 'new'
    end
  end
  
  def current_objects
     conditions = if params['login']
       ["login LIKE :login OR firstname LIKE :login OR lastname LIKE :login", 
         { :login => "%#{params['login']}%"}]
     else
       {}
     end
     @current_objects ||= current_model.find(:all, :conditions => conditions)
   end
  
end
