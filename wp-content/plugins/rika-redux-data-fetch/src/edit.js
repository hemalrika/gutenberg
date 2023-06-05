import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data'
import { useState } from '@wordpress/element'
import { CheckboxControl } from '@wordpress/components'
import './editor.scss';
import { TextControl } from '@wordpress/components';
import { Button } from '@wordpress/components';

export default function Edit() {
	const [newTodo, setnewTodo] = useState('');
	const [addingTodo, setaddingTodo] = useState(false);
	const todos = useSelect((select) => {
		const todoStore = select("block-course/todos")
		return todoStore && todoStore.getTodos()
	}, []);
	const actions = useDispatch('block-course/todos');
	const addTodo = actions && actions.addTodo
	return (
		<div { ...useBlockProps() }>
			{
				!todos &&
				<p>Please make sure rika todo list plugin has installed and activated!</p>
			}
			<ul>
				{
					todos &&
					todos.map((todo) => (
						<li key={todo.id} className={todo.completed ? 'todo-completed': ''}>
							<CheckboxControl label={todo.title} checked={todo.completed} onChange={(e) => {console.log(e)}}/>
						</li>
					))
				}
			</ul>
			<form onSubmit={async (e) => {
				setaddingTodo(true);
				e.preventDefault();
				if(addTodo) {
					await addTodo(newTodo);
					setnewTodo('');
					setaddingTodo(false);
				}
				console.log(e);
			}} className='addtodo-form'>
				<TextControl value={newTodo} onChange={(e) => {setnewTodo(e)}} />
				<Button disabled={addingTodo} type='submit' isPrimary>Add Todo</Button>
			</form>
		</div>
	);
}
