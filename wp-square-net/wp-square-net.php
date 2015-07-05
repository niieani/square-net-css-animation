<?php
/**
 * Plugin Name: Square Net
 * Plugin URI: 
 * Description: Square Net Generator.
 * Version: 1.0.0
 * Author: Bazyli Brzóska
 * Author URI: http://invent.life
 * License: MIT
 */

class squareNet {

	function squareNet() {
		add_action('wp_enqueue_scripts', array($this, 'register_squarenet_scripts'));
		// add_action('pre_get_posts', array($this, 'add_scripts'));
	}

	public function register_squarenet_scripts() {
		wp_register_script( 'lifetree-polyfill', plugins_url( '/assets/vendor/browser-polyfill.min.js' , __FILE__ ), null, false, true );
		wp_register_script( 'lifetree', plugins_url( '/assets/lifetree.js' , __FILE__ ), null, false, true );
		wp_register_script( 'lifetree-run', plugins_url( '/assets/lifetree-run.js' , __FILE__ ), null, false, true );
		wp_register_style( 'lifetree-styles', plugins_url( '/assets/lifetree.css' , __FILE__ ), null, false, false );
		// if (is_home())
		// {
			wp_enqueue_style( 'lifetree-styles' );
			wp_enqueue_script( 'lifetree-polyfill' );
			wp_enqueue_script( 'lifetree' );
			wp_enqueue_script( 'lifetree-run' );
		// }
	}
	// function add_scripts( $query ) {
	// }
}
$squareNet = new squareNet();