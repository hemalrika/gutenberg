import { useBlockProps } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import {useSelect} from '@wordpress/data'

export default function edit() {
    const title = useSelect((select) => {
        return select('core/editor').getEditedPostAttribute('title');
    });
    const { editPost } = useDispatch('core/editor');
    return(
        <div { ...useBlockProps() }>
            <h2>{title}</h2>
            <input value={title} onChange={(e) => {editPost({title: e.target.value})}} />
        </div>
    )
}