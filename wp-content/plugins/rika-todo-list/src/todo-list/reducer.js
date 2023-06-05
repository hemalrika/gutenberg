import { ADD_TODO, POPULATE_TODOS } from "./type";

const DEFAULT_DATA = {
    items: []
}

const reducer = (state = DEFAULT_DATA, action) => {
    switch (action.type) {
        case ADD_TODO:
            return { ...state, items: [...state.items, action.todo] }
            break;
        case POPULATE_TODOS:
            return { ...state, items: action.todos };
        default:
            return state;
            break;
    }
    return state;
}
export default reducer;