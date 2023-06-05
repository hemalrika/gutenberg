import {
	useBlockProps,
	RichText,
	BlockControls,
	AlignmentToolbar,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';
import { TextareaControl } from '@wordpress/components';
import { ToggleControl } from '@wordpress/components';
import { AnglePickerControl } from '@wordpress/components';
import { ColorPicker } from '@wordpress/components';
export default function edit( { attributes, setAttributes } ) {
	const { text, alignment, backgroundColor, textColor } = attributes;
	const onChangeText = ( newText ) => {
		setAttributes( { text: newText } );
	};
	const onAlignment = ( newAlignment ) => {
		setAttributes( { alignment: newAlignment } );
	};
	const OnBackgroundColorChange = ( newBgColor ) => {
		setAttributes( { backgroundColor: newBgColor } );
	};
	const OnTextColorChange = ( newTextColor ) => {
		setAttributes( { textColor: newTextColor } );
	};
    console.log(text);
	return (
		<>
			<InspectorControls>
				<PanelBody
					title="color settings"
					icon="admin-appearance"
					initialOpen
				>
					{ /* <TextControl label="Input Label" value={text} onChange={onChangeText} help="help" />
                    <TextareaControl label="Input Label" value={text} onChange={onChangeText} help="help" />
                    <ToggleControl label="toggle label" checked={true} onChange={(value) => {console.log(value)}} />
                    <AnglePickerControl/>
                    <ColorPicker value={'f00'} onChange={(value) => {console.log(value)}} />
                    <ColorPalette colors={[{name: 'red', color: '#f00'}, {name: 'blue', color: '#00f'}, {name: 'green', color: '0f0'}]} onChange={(value) => {console.log(value)}} /> */ }
					<ColorPalette
						colors={ [
							{ name: 'red', color: '#f00' },
							{ name: 'blue', color: '#00f' },
							{ name: 'green', color: '0f0' },
						] }
                        style={
                            backgroundColor
                        }
						onChange={ OnBackgroundColorChange }
						value={ backgroundColor }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<AlignmentToolbar onChange={ onAlignment } />
			</BlockControls>
			<RichText
				{ ...useBlockProps( {
					className: `text-align-${ alignment }`,
				} ) }
				placeholder="Your text"
				tagName="h2"
				onChange={ onChangeText }
				value={ text }
				// allowedFormats={['core/bold']}
				allowedFormats={ [] }
			/>
		</>
	);
}
