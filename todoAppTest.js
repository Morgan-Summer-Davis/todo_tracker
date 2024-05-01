let { Todo, todoList, todoManager } = require('./todoApp.js');

let todoData1;
let todoData2;
let todoData3;
let todoData4;
let todoSet;

function resetTestData() {
  todoData1 = {
    title: 'Buy Milk',
    month: '1',
    year: '2017',
    description: 'Milk for baby',
  };

  todoData2 = {
    title: 'Buy Apples',
    month: '1',
    year: '2017',
    description: 'An apple a day keeps the doctor away',
  };

  todoData3 = {
    title: 'Buy chocolate',
    month: '1',
    year: '',
    description: 'For the cheat day',
  };

  todoData4 = {
    title: 'Buy Veggies',
    month: '',
    year: '',
    description: 'For the daily fiber needs',
  };

  todoSet = [todoData1, todoData2, todoData3, todoData4];
  todoList.initialize();
}

resetTestData();

console.log('Todo constructor creates a todo object when passed valid data');
console.log('-------------');
let testTodo = new Todo(todoData1);
console.log(testTodo instanceof Todo);


console.log('\nTodo constructor throws an error when provided invalid data');
console.log('-------------');
try {
  todoData1.title = 1;
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

try {
  todoData1.month = undefined;
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

try {
  todoData1.month = 13;
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

try {
  todoData1.month = 13;
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

try {
  todoData1.year = {};
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

try {
  todoData1.year = '--1';
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

try {
  todoData1.description = 13;
  new Todo(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();

console.log('\nTodo.lastID returns last-created id');
console.log('-------------');
console.log(Todo.lastID() === 1);


console.log('\nTodo.#generateID increments Todo.lastID with each instantiation');
console.log('-------------');
new Todo(todoData1);
console.log(Todo.lastID() === 2);
new Todo(todoData1);
new Todo(todoData1);
console.log(Todo.lastID() === 4);


console.log('\nTodo.validTodo returns true if passed valid data, false otherwise');
console.log('-------------');
console.log(Todo.validTodo(todoData2) === true);
console.log(Todo.validTodo(...Object.values(todoData2)) === true);
todoData2.title = 3;
console.log(Todo.validTodo(todoData2) === false);
console.log(Todo.validTodo('1', '1', '1') === false);


console.log('\nisWithinMonthYear works only with both correct month and year');
console.log('-------------');
console.log(testTodo.isWithinMonthYear(1, 2017) === true);
console.log(testTodo.isWithinMonthYear('1', '2017') === true);
console.log(testTodo.isWithinMonthYear(2, 2017) === false);
console.log(testTodo.isWithinMonthYear(1, 2018) === false);
console.log(testTodo.isWithinMonthYear(1) === false);


console.log('\nTodo ids are read-only');
console.log('-------------');
resetTestData();
testTodo = new Todo(todoData3);
try {
  testTodo.id = 13;
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();


console.log('\ntodoList.initialize populates its private todos array');
console.log('-------------');
console.log(todoList.findByID(6) === undefined);
todoList.initialize(todoSet);
console.log(todoList.findByID(6) instanceof Todo);
console.log(todoList.findByID(7) instanceof Todo);
console.log(todoList.findByID(8) instanceof Todo);
console.log(todoList.findByID(9) instanceof Todo);
console.log(todoList.findByID(10) === undefined);

console.log('\ntodoList.initialize resets its todos if already initialized');
console.log('-------------');
todoList.initialize();
console.log(todoList.findByID(6) === undefined);
console.log(todoList.findByID(10) === undefined);


console.log('\ntodoList.findByID returns a Todo object');
console.log('-------------');
todoList.initialize(todoData4);
console.log(todoList.findByID(10) instanceof Todo);


console.log('\ntodoList.findByID returns undefined when todo is not in list');
console.log('-------------');
console.log(todoList.findByID(11) === undefined);


console.log('\ntodoList.findByID returns a new object');
console.log('-------------');
todoList.findByID(10).title = 'test';
console.log(todoList.findByID(10).title !== 'test');


console.log('\ntodoList.add creates todo and adds it to collection');
console.log('-------------');
todoList.add(todoData1);
console.log(todoList.findByID(11).title === 'Buy Milk');


console.log('\ntodoList.add throws error when passed invalid data');
console.log('-------------');
try {
  todoData1.title = 3;
  todoList.add(todoData1);
  console.log(false);
} catch {
  console.log(true);
}

resetTestData();


console.log('\ntodoList.remove removes the prompted todo from its collection');
console.log('-------------');
todoList.remove(todoList.findByID(10));
console.log(todoList.findByID(10) === undefined);
todoList.remove(11);
console.log(todoList.findByID(11) === undefined);


console.log('\ntodoList.remove returns undefined, whether successful or not');
console.log('-------------');
todoList.add(todoData2);
console.log(todoList.remove(12) === undefined);
console.log(todoList.remove(100) === undefined);


console.log('\ntodoList.update updates the prompted todo in the collection');
console.log('-------------');
todoList.add(todoData3);
todoList.update(13, { completed: true });
console.log(todoList.findByID(13).completed === true);

console.log('\ntodoList.update throws an error when the todo is not found');
console.log('-------------');
try {
  todoList.update(100, { title: 'title' });
  console.log(false);
} catch {
  console.log(true);
}

console.log('\ntodoList.update throws an error when passed invalid data');
console.log('-------------');
try {
  todoList.update(13, { completed: 13 });
  console.log(false);
} catch {
  console.log(true);
}


console.log('\ntodoList.update cannot modify id');
console.log('-------------');
todoList.update(13, { id: 100 });
console.log(todoList.findByID(13) instanceof Todo);
console.log(todoList.findByID(100) === undefined);


console.log("\ntodoManager.todos returns all todos in the list's collection");
console.log('-------------');
todoList.initialize(todoSet);
console.log(todoManager.todos(todoList).length === 4);


console.log('\ntodoManager.completedTodos returns all completed todos in list');
console.log('-------------');
todoList.update(15, { completed: true });
console.log(todoManager.completedTodos(todoList).length === 1);
console.log(todoManager.completedTodos(todoList)[0].id === 15);


console.log('\ntodoManager.todosWithinMonthYear returns all todos in list ' +
            'with both correct month and year');
console.log('-------------');
console.log(todoManager.todosWithinMonthYear(todoList, 1, 2017).length === 2);
console.log(todoManager.todosWithinMonthYear(todoList, 1, 2017)[0].id === 14);
console.log(todoManager.todosWithinMonthYear(todoList, 1, 2017)[1].id === 15);


console.log('\ntodoManager.completedTodosWithinMonthYear returns all ' +
            'completed todos in list with both correct month and year');
console.log('-------------');
console.log(todoManager.completedTodosWithinMonthYear(todoList,
  1, 2017).length === 1);
console.log(todoManager.completedTodosWithinMonthYear(todoList,
  1, 2017)[0].id === 15);