import { dispatch } from "@wordpress/data";
import { createTodo, toggleTodo as toggleTodoControl } from "./controls"
import { POPULATE_TODOS } from "./type"

export function* addTodo(title) {
    const todo = yield createTodo(title);
    try {
        return {
            'type': 'ADD_TODO',
            todo
        }
    } catch(err) {
        return dispatch("core/notices").createErrorNotice(err.message || 'Could not create todos');
    }
}
export function* toggleTodo(todo) {
    try {
        const updatedTodo = yield toggleTodoControl(todo);
        console.log(updatedTodo);
    } catch(err) {
        return dispatch("core/notices").createErrorNotice(err.message || 'Could not update todos');
    }
}

export const populateTodos = (todos) => {
    return {
        type: POPULATE_TODOS,
        todos
    }
}