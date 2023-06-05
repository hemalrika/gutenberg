<?php
/**
 * Plugin Name:       Rika
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       rika
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_dynamic_frontint_block($attributes) {
	$args = array(
		'posts_per_page'=> $attributes['postsPerPage'],
		'status' => 'publish',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderby'],
	);
	if(isset($attributes['category'])) {
		$args['category__in'] = array_column($attributes['category__in'], 'id');
	}
	$posts = get_posts($args);
	if(!empty($posts)) :
	foreach($posts as $post) {?>
		<div class="post-single" style="border-bottom: 1px solid #ddd;margin-bottom: 30px;padding-bottom: 30px;">
			<?php if($attributes['isVisibleFeaturedImage']) : ?>
			<?php echo get_the_post_thumbnail($post); ?>
			<?php endif; ?>
			<h1><a href="<?php echo get_the_permalink($post); ?>"><?php echo get_the_title($post); ?></a></h1>
			<p><?php echo get_the_excerpt($post); ?></p>
		</div>
	<?php }
	endif;
}
function create_block_rika_block_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'create_dynamic_frontint_block'
	) );
}
add_action( 'init', 'create_block_rika_block_init' );
