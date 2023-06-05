
import { getTodos }  from './selectors';
import { addTodo } from './actions';
import reducer from './reducer';
import { createReduxStore } from '@wordpress/data';
import { register } from '@wordpress/data';
import * as resolvers from './resolvers';
import controls from './controls';

const store = createReduxStore('block-course/todos', {
    reducer,
    actions: { addTodo },
    selectors: { getTodos },
    resolvers,
    controls
})
register(store);