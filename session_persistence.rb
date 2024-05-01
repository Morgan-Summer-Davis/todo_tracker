class SessionPersistence
  def initialize(session)
    @session = session
    @session[:lists] ||= []
  end

  def find_list(id)
    @session[:lists].find { |list| list[:id] == id }
  end

  def all_lists
    @session[:lists]
  end

  def create_list(list_name)
    id = next_item_id(all_lists)
    @session[:lists] << { id: id, name: list_name, todos: [] }
  end

  def delete_list(id)
    @session[:lists].reject! { |list| list[:id] == id }
  end

  def update_name(id, new_name)
    find_list(id)[:name] = new_name
  end

  def create_todo(list_id, todo_name)
    list = find_list(list_id)
    id = next_item_id(list[:todos])
    list[:todos] << { id: id, name: todo_name, completed: false }
  end

  def delete_todo_from_list(list_id, todo_id)
    find_list(list_id)[:todos].reject! { |todo| todo[:id] == todo_id }
  end

  def update_todo_status(list_id, todo_id, new_status)
    todo = find_list(list_id)[:todos].find { |t| t[:id] == todo_id }
    todo[:completed] = new_status
  end

  def complete_all_todos(list_id)
    find_list(list_id)[:todos].each { |todo| todo[:completed] = true }
  end

  private

  def next_item_id(items)
    (items.map { |item| item[:id] }.max || 0) + 1
  end
end