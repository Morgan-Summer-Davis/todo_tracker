require 'pg'

class DatabasePersistence
  def initialize(logger)
    @db = if Sinatra::Base.production?
            PG.connect(ENV['DATABASE_URL'])
          else
            PG.connect(dbname: "todos")
          end
    @logger = logger
  end

  def find_list(id)
    tuple = query(<<~SQL,
      SELECT lists.*,
             COUNT(todos.id) AS todos_count,
             COUNT(NULLIF(todos.status, true)) AS todos_remaining_count
    	FROM lists
    	LEFT OUTER JOIN todos ON lists.id = todos.list_id
    	WHERE lists.id = $1
    	GROUP BY lists.id
    	ORDER BY lists.name;
    SQL
    id).first

    tuple_to_list_hash(tuple)
  end

  def all_lists
    query_result = query(
    <<~SQL
      SELECT lists.*,
             COUNT(todos.id) AS todos_count,
             COUNT(NULLIF(todos.status, true)) AS todos_remaining_count
    	FROM lists
    	LEFT OUTER JOIN todos ON lists.id = todos.list_id
    	GROUP BY lists.id
    	ORDER BY lists.name;
    SQL
    )

    query_result.map do |tuple|
      tuple_to_list_hash(tuple)
    end
  end

  def create_list(list_name)
    query('INSERT INTO lists VALUES (DEFAULT, $1)', list_name)
  end

  def delete_list(id)
    query('DELETE FROM lists WHERE id = $1', id)
  end

  def update_name(id, new_name)
    query('UPDATE lists SET name = $1 WHERE id = $2', new_name, id)
  end

  def create_todo(list_id, todo_name)
    query('INSERT INTO todos VALUES (DEFAULT, $1, $2)', list_id, todo_name)
  end

  def delete_todo_from_list(list_id, todo_id)
    query('DELETE FROM todos WHERE id = $1 AND list_Id = $2', todo_id, list_id)
  end

  def update_todo_status(list_id, todo_id, new_status)
    query('UPDATE todos SET status = $1 WHERE id = $2 AND list_id = $3',
          new_status, todo_id, list_id)
  end

  def complete_all_todos(list_id)
    query('UPDATE todos SET status = true WHERE list_id = $1', list_id)
  end

  def disconnect
    @db.close
  end

  def find_todos_for_list(list_id)
    query('SELECT * FROM todos WHERE list_id = $1', list_id).map do |todo|
      { id: todo['id'].to_i,
        name: todo['name'],
        completed: todo['status'] == 't' }
    end
  end

  private

  def query(sql, *args)
    @logger.info "#{sql}: #{args}"
    @db.exec_params(sql, args)
  end

  def tuple_to_list_hash(tuple)
    { id: tuple['id'].to_i,
      name: tuple['name'],
      todos_count: tuple['todos_count'].to_i,
      todos_remaining_count: tuple['todos_remaining_count'].to_i }
  end
end