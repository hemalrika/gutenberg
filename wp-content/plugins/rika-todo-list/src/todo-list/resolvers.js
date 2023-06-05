import { dispatch } from "@wordpress/data";
import { populateTodos } from "./actions";
import { fetchtodos } from "./controls";
export function* getTodos() {
    try {
        const todos = yield fetchtodos();
        console.log(todos);
        return populateTodos(todos);
    } catch(error) {
        return dispatch('core/notices').createErrorNotice(error.message || 'could not fetch todos');

    }
}