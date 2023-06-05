<?php
/***
* Plugin Name: First Block
* Plugin URI: https://www.hemal.com
* Description: My first Block
* Author: MD Hemal Akhand
* Author URI: https://www.hemal.com
*/

function block_course_firstblock_init() {
	register_block_type_from_metadata(__DIR__);
}
add_action('init', 'block_course_firstblock_init');