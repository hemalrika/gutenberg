// var registerBlockType = wp.blocks.registerBlockType;
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import edit from './edit';
import save from './save';

registerBlockType( 'blocks-course/firstblock', {
	icon: {
		src: 'text-page',
		background: '#f03',
		foreground: '#fff',
	},
	edit,
	save,
} );
