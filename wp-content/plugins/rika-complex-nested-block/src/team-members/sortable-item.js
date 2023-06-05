import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n'

export default function SortableItem(props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return <li className={props.selectedLink === props.index ? 'is-selected': null} ref={setNodeRef} style={style} { ...attributes } { ...listeners }>
        <button onClick={() => props.setSelectedLink(props.index)} aria-label={__('edit social link', 'rika')}>
            <Icon icon={props.icon} />
        </button>
    </li>
}