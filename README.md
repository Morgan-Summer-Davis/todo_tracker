You will notice that a separate test file is included, but no `package.json`--
the test file is just regular JavaScript that loads `todoApp.js` in as a module.
It can just be run using node. `todoApp.js` itself can of course be run with
node but will have no output. I opted to do this to make `todoApp.js` more
readable because the test suite ended up quite long.

The following are my assumptions that are not explicit specifications in the
prompt:
1.  `todo` objects should be able to be created from objects, as that is how the
    data is presented in the assignment.
2.  `todo` `id`s start at 1 and increment by 1 each time a new one is created.
    They should not be able to be changed once set.
3.  `month`s and `year`s should be accepted as either number strings (since that
    is how they are presented in the assignment) or as numbers. `title` and
    `description` must be strings.
4.  If a `month` is a number or numeric string, it must be an integer between 1
    and 12, inclusive.
5.  `month`s can be non-numeric strings to allow using the month name instead of
    its number. They can also be empty strings.
6.  `year`s must only be integers, integer strings (including negatives), or
    empty strings.
7.  `isWithinMonthYear` should return `true` if both the passed `month` and
    `year` match both the calling `todo`'s `month` and `year`, `false` otherwise.
8.  Attempting to create an invalid `todo` should throw an error.
9.  `todoList` should be able to be initialized from an array (since that is how
    they are presented in the assignment) or as a comma-seperated list of todos.
10. `todoList` can be initialized using either extant `todo` objects or
    non-`todo` objects with the correct data, but either scenario will create a
    new `todo` and add it to the list.
11. `intiailize` clears `todoList`'s collection if it isn't empty.
12. The `remove` and `update` methods may receive an `id` or an object with an
    `id` property in the list as their first argument. `update` should receive a
    second argument in the form of an object and updates any of the extant
    `todo`'s properties that match the second object's (other than `id`). The
    add method can receive either an object with the correct keys or raw `todo`
    data, as with `todoList.initialize`.
13. If an object used to update a `todo` has a relevant inherited property (ie,
    an inherited `title` property), it should not be used--only own properties
    should be used to update the given `todo`.
14. All of the input validation that happens on `todo` creation should happen on
    `todoList.update`.
15. Attempting to update a `todo` not found in `todoList` should throw an error.
    However, attempting to delete a `todo` not found in `todoList` should simply
    return `undefined`.
16. Deep cloning of `todo`s by `todoList` when returning them isn't necessary,
    since `todo`s can only store primitive values.
17. Since "The `todoList` maintains the integrity of the collection by returning
    only a copy of the collection anytime that a method returns all or a subset
    of it" and "The `todoManager` interfaces with the `todoList` object," the
    values returned by the `todoManager` are also copies.
18. The `todoList` and `todoManager` objects cannot have any methods other than
    those listed. For instance, `todoList` cannot have a method which returns
    its entire collection (or their `id`s), which `todoManager` could just
    piggyback off of.
19. "The todo *objects [`Todo`] creates* can only have the [given] properties
    and shared methods" but the class can have static methods and variables.
20. Extant `todo`s cannot be added to the `todoList`, only a new copy of them
    with a new `id`. This is because `todoList`, when queried, returns a copy of
    the `todo` to prevent mutation, meaning if that copy were then inserted back
    into the list (or a hypethetical second list), there would be `todo` objects
    with duplicate `id`s.