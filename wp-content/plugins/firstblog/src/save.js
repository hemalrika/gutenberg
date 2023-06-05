import { RichText, useBlockProps } from '@wordpress/block-editor';
import './style.scss';
export default function save( { attributes } ) {
	const { text, alignment } = attributes;
	return (
		<RichText.Content
			{ ...useBlockProps.save( {
				className: `text-align-${ alignment }`,
			} ) }
			tagName="h5"
			value={ text }
		/>
	);
}
