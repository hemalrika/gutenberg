import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import './editor.scss';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({attributes, setAttributes}) {
	const {columns} = attributes

	const onChangeColumn = (newColumn) => {
		setAttributes({columns: newColumn})
	}

	return (
		<div { ...useBlockProps({
			className: `has-${columns}-columns`
		}) }>
			<InspectorControls>
				<PanelBody>
					<RangeControl label={__('Column', 'rika')}
					min={1}
					max={6}
					onChange={onChangeColumn}
					value={columns}
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks allowedBlocks={["create-block/team-member"]}
			template={[
				// [
				// 	'create-block/team-member', {
				// 		name: 'Name 1',
				// 		bio: 'bio 1'
				// 	}
				// ],
				[ 'create-block/team-member' ],
				[ 'create-block/team-member' ],
				[ 'create-block/team-member' ],
				
			]}
			// templateLock="all"
			// templateLock="insert"
			/>
		</div>
	);
}
