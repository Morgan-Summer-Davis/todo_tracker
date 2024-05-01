'use strict';

class Todo {
  constructor(title, month, year, description) {
    if (typeof title === 'object' && title !== null) {
      let objData = title;
      return new Todo(objData.title, objData.month, objData.year,
        objData.description);
    } else if (!Todo.validTodo(title, month, year, description)) {
      throw new Error('Todo created with one or more invalid arguments');
    }

    Object.defineProperty(this, 'id', { value: Todo.#generateID(), enumerable: true });
    this.title       = title;
    this.completed   = false;
    this.month       = String(month);
    this.year        = String(year);
    this.description = description;
  }

  static #currentID = 0;

  static #generateID() {
    Todo.#currentID += 1;
    return Todo.#currentID;
  }

  static lastID() {
    return Todo.#currentID;
  }

  static validTodo(title, month, year, description, completed = false) {
    if (typeof title === 'object' && title !== null) {
      let objData = title;
      return Todo.validTodo(objData.title, objData.month, objData.year,
        objData.description, objData.completed || false);
    } else {
      return (Todo.#validTitle(title) && Todo.#validMonth(month) &&
              Todo.#validYear(year)   && Todo.#validDescription(description) &&
              Todo.#validCompleted(completed));
    }
  }

  static #validTitle(title) {
    return typeof title === 'string';
  }

  static #validCompleted(completed) {
    return typeof completed === 'boolean';
  }

  static #validMonth(month) {
    return (typeof month === 'string' || typeof month === 'number') &&
           ((parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12 &&
           Number.isInteger(Number(month))) ||
           Number.isNaN(parseInt(month, 10)));
  }

  static #validYear(year) {
    return (typeof year === 'string' || typeof year === 'number') &&
           /(^-{0,1}\d+$|^$)/.test(String(year));
  }

  static #validDescription(description) {
    return typeof description === 'string';
  }

  isWithinMonthYear(month, year) {
    return this.month === String(month) && this.year === String(year);
  }
}

let todoList = (function() {
  let todos = [];

  function findMatchingTodo(todoData) {
    let id = (typeof todoData === 'object' && todoData !== null) ? todoData.id : todoData;

    return todos.find(todo => todo.id === id);
  }

  return {
    initialize(...args) {
      if (Array.isArray(args[0])) args = args[0].flat();

      todos = [];
      args.forEach(todo => this.add(todo));
    },

    add(todo) {
      todos.push(new Todo(todo));
    },

    remove(todo) {
      todo = findMatchingTodo(todo);

      if (todos.includes(todo)) {
        todos.splice(todos.indexOf(todo), 1);
      }
    },

    update(todo, newData) {
      todo = findMatchingTodo(todo);
      if (!todo) throw new Error('Todo not found in list');

      let validKeys = {};
      let todoCopy = Object.assign({}, todo);
      ['title', 'month', 'year', 'description', 'completed'].forEach(key => {
        if (newData.hasOwnProperty(key)) validKeys[key] = newData[key];
      });

      if (Todo.validTodo(Object.assign(todoCopy, validKeys))) {
        Object.assign(todo, validKeys);
      } else {
        throw new Error('Todo update passed invalid argument(s)');
      }
    },

    findByID(id) {
      let todo = findMatchingTodo({id});
      if (!todo) return undefined;

      todo = Object.assign({}, todo);
      Object.setPrototypeOf(todo, Todo.prototype);
      return todo;
    },
  };
})();

let todoManager = {
  todos(list) {
    let foundTodos = [];
    for (let id = 1; id <= Todo.lastID(); id += 1) {
      let todo = list.findByID(id);
      if (todo) foundTodos.push(todo);
    }

    return foundTodos;
  },

  completedTodos(list) {
    return this.todos(list).filter(todo => todo.completed);
  },

  todosWithinMonthYear(list, month, year) {
    return this.todos(list).filter(todo => todo.isWithinMonthYear(month, year));
  },

  completedTodosWithinMonthYear(list, month, year) {
    return this.todosWithinMonthYear(list, month, year).filter(todo => {
      return todo.completed;
    });
  },
};

module.exports = { Todo, todoList, todoManager };