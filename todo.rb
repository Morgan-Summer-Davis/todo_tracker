require "sinatra"
require "sinatra/content_for"
require "tilt/erubis"

require_relative "database_persistence"

configure do
  enable :sessions
  set :session_secret, 'secret'
  set :erb, :escape_html => true
end

configure (:development) do
  require "sinatra/reloader"
  also_reload "database_persistence.rb"
end

helpers do
  def list_complete?(list)
    list[:todos_count] > 0 && list[:todos_remaining_count] == 0
  end

  def list_class(list)
    "complete" if list_complete?(list)
  end

  def sort_lists(lists, &block)
    complete_lists, incomplete_lists = lists.partition { |list| list_complete?(list) }
    (incomplete_lists + complete_lists).each(&block)
  end

  def sort_todos(todos, &block)
    complete_todos, incomplete_todos = todos.partition { |todo| todo[:completed] }

    (incomplete_todos + complete_todos).each { |todo| yield todo, todos.index(todo) }
  end
end

before do
  @storage = DatabasePersistence.new(logger)
end

after do
  @storage.disconnect
end

def load_list(id)
  list = @storage.find_list(id)
  return list if list

  session[:error] = "The specified list was not found."
  redirect "/lists"
end

get "/" do
  redirect "/lists"
end

# View list of lists
get "/lists" do
  @lists = @storage.all_lists
  erb :lists, layout: :layout
end

# Render the new list form
get "/lists/new" do
  erb :new_list, layout: :layout
end

# Return an error if the name is invalid, otherwise return nil.
def error_for_list_name(name)
  if !(1..100).cover? name.length
    "List name must be between 1 and 100 characters"
  elsif @storage.all_lists.any? { |list| list[:name] == name }
    "The list name must be unique."
  end
end

# Return an error if the name is invalid, otherwise return nil.
def error_for_todo(name)
  if !(1..100).cover? name.length
    "Todo must be between 1 and 100 characters"
  end
end

# Create a new list
post "/lists" do
  list_name = params[:list_name].strip

  error = error_for_list_name(list_name)
  if error
    session[:error] = error
    erb :new_list, layout: :layout
  else
    @storage.create_list(list_name)
    session[:success] = "#{list_name} has been created."
    redirect "/lists"
  end
end

# Display a single todo list
get "/lists/:id" do
  @list_id = params[:id].to_i
  @list = load_list(@list_id)
  @todos = @storage.find_todos_for_list(@list_id)
  erb :list, layout: :layout
end

# Edit an existing todo list
get "/lists/:id/edit" do
  id = params[:id].to_i
  @list = load_list(id)
  erb :edit_list, layout: :layout
end

# Update an existing todo list
post "/lists/:id" do
  list_name = params[:list_name].strip
  id = params[:id].to_i
  @list = load_list(id)

  error = error_for_list_name(list_name) unless list_name == @list[:name]
  if error
    session[:error] = error
    erb :edit_list, layout: :layout
  else
    old_name = @list[:name]
    @storage.update_name(id, list_name)
    session[:success] = "#{old_name} has been updated to #{list_name}."
    redirect "/lists/#{id}"
  end
end

# Delete a todo list
post "/lists/:id/delete" do
  id = params[:id].to_i
  list_name = @storage.delete_list(id)

  if env['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest"
    "/lists"
  else
    session[:success] = "#{list_name} has been deleted."
    redirect "/lists"
  end
end

# Add a new todo to a list
post "/lists/:list_id/todos" do
  @list_id = params[:list_id].to_i
  @list = load_list(@list_id)
  text = params[:todo].strip

  error = error_for_todo(text)
  if error
    session[:error] = error
    erb :list, layout: :layout
  else
    @storage.create_todo(@list_id, text)

    session[:success] = "#{text} has been added to #{@list[:name]}."
    redirect "/lists/#{@list_id}"
  end
end

# Delete a todo from a list
post "/lists/:list_id/todos/:id/delete" do
  @list_id = params[:list_id].to_i
  @list = load_list(@list_id)

  todo_id = params[:id].to_i
  @storage.delete_todo_from_list(@list_id, todo_id)

  if env['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest"
    status 204
  else
    session[:success] = "#{todo[:name]} has been deleted from #{@list[:name]}."
    redirect "/lists/#{@list_id}"
  end
end

# Update the status of a todo
post "/lists/:list_id/todos/:id" do
  @list_id = params[:list_id].to_i
  @list = load_list(@list_id)


  todo_id = params[:id].to_i
  is_completed = params[:completed] == "true"

  @storage.update_todo_status(@list_id, todo_id, is_completed)

  todo = @storage.find_list(@list_id)[:todos].find { |t| t[:id] == todo_id }
  session[:success] = "#{todo[:name]} has been updated."
  redirect "/lists/#{@list_id}"
end

# Complete all todos in a list
post "/lists/:id/complete_all" do
  @list_id = params[:id].to_i
  @list = load_list(@list_id)

  @storage.complete_all_todos(@list_id)
  session[:success] = "All todos have been completed."
  redirect "/lists/#{@list_id}"
end

not_found do
  status 404
  session[:error] = 'Page not found'
end