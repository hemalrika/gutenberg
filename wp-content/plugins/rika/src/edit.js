/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data'
import { RawHTML } from '@wordpress/element';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { format, dateI18n, __experimentalGetSettings } from '@wordpress/date'
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl , QueryControls, RangeControl} from '@wordpress/components';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes, setAttributes}) {
	const blockProps = useBlockProps();
	const {postsPerPage, isVisibleFeaturedImage, order, orderby, categories} = attributes;
	const catId = categories && categories.length > 0 ? categories.map(cat => cat.id ): [];
	const posts = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'post', { "per_page": postsPerPage, _embed: true, order, orderby: orderby, categories: catId } );
	}, [postsPerPage, order, orderby, catId] );
	const allCats = useSelect((select) => {
		return select('core').getEntityRecords("taxonomy", "category", {per_page: -1});
	});
	const catSugessions = {};
	if(allCats) {
		for (let i = 0; i < allCats.length; i++) {
			const cat = allCats[i];
			catSugessions[cat.name] = cat;
			
		}
	}
	function onDisplayFeaturedImageChange(value) {
		setAttributes({isVisibleFeaturedImage: value})
	}
	function onNumberOfChange(value) {
		setAttributes({postsPerPage: value});
	}
	function onChangeCategory(values) {
		const hasNoSugessions = values.some((value) => typeof value === 'string' && !catSugessions[value]);
		if (hasNoSugessions) return;
		
		const updatedCats = values.map((token) => {
			return typeof token === "string" ? catSugessions[token]: token;
		})
		console.log(values);
		setAttributes({categories: updatedCats})
	}
	return (
		<>
		<InspectorControls>
			<PanelBody>
				<ToggleControl label="display featured image" checked={isVisibleFeaturedImage} onChange={onDisplayFeaturedImageChange} />
				<QueryControls numberOfItems={postsPerPage} onNumberOfItemsChange={onNumberOfChange} orderBy={orderby} onOrderByChange={(value) => setAttributes({orderby: value})} order={order} onOrderChange={(value) => setAttributes({order: value})}  maxItems={10} minItems={2} /*categoriesList={allCats} */ categorySuggestions={catSugessions} 
				selectedCategories={categories}
				onCategoryChange={onChangeCategory} />
			</PanelBody>
		</InspectorControls>
			<ul { ...useBlockProps() }>
				{
					posts && posts.map((post) => {
						const featuredImage = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0 && post._embedded['wp:featuredmedia'][0];
						return(
							<li key={post.id}>
								<h5><a href={post.link}>{post.title.rendered ? post.title.rendered: ''}</a></h5>
								{post.content.rendered && 
								<RawHTML>
									{post.content.rendered ? post.content.rendered: 'No content'}
								</RawHTML>}
								{post.date_gmt && <time dateTime={format('c', post.date_gmt)}>
									{
										dateI18n(
											__experimentalGetSettings().formats
											.date,
											post.date_gmt
										)
									}
								</time>}
									{post.excerpt.rendered && <RawHTML>{post.excerpt.rendered}</RawHTML>}
								<img alt={isVisibleFeaturedImage && featuredImage && featuredImage.alt_text && featuredImage.alt_text} src={isVisibleFeaturedImage && featuredImage && featuredImage.media_details.sizes.full.source_url} />
							</li>
						)
					})
				}
			</ul>
		</>

	);
}
