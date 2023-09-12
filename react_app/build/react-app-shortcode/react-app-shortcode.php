<?php
  /**
   * Plugin Name: React App Shortcode
   * Description: Converts react app into a wordpress plugin which can be used as a shortcode
   * Version: 1.2.5
   * Author: ETS student worker
   */

  $manifest = [
		'main' => [
			'static/css/main.a97a8c06.css',
			'static/js/main.735df63f.js',
		],
	];

  function create_main_app() {
    enqueue_assets('main');

    return '<div id="root"></div>';
  }

  function register_react_app-shortcode_entries() {
		add_shortcode('react-app-shortcode-main', 'create_main_app');
		register_assets('main');
  }

  add_action('init', 'register_react_app-shortcode_entries');

/**
 * Loader utils
 */
if (! function_exists('str_ends_with')) {
  function str_ends_with( $haystack, $needle ) {
    $length = strlen( $needle );
    if( !$length ) {
        return true;
    }
    return substr( $haystack, -$length ) === $needle;
  }
}

function is_js($path) {
  return str_ends_with($path, "js");
}

function is_css($path) {
  return str_ends_with($path, "css");
}

function get_js_for_entrypoint($entrypoint) {
  global $manifest;
  $assets = $manifest[$entrypoint];
  $js = array_filter($assets, "is_js");
  return $js;
}

function get_css_for_entrypoint($entrypoint) {
  global $manifest;
  $assets = $manifest[$entrypoint];
  $css = array_filter($assets, "is_css");
  return $css;
}

function register_assets($entrypoint) {
  $js = get_js_for_entrypoint($entrypoint);

  foreach ($js as &$script) {
    wp_register_script($script, plugins_url('react-app-shortcode/assets/' . $script));
  }

  $css = get_css_for_entrypoint($entrypoint);

  foreach ($css as &$style) {
    wp_register_style($style, plugins_url('react-app-shortcode/assets/' . $style));
  }
}

function enqueue_assets($entrypoint) {
  $js = get_js_for_entrypoint($entrypoint);

  foreach ($js as &$script) {
    wp_enqueue_script($script);
  }

  $css = get_css_for_entrypoint($entrypoint);

  foreach ($css as &$style) {
    wp_enqueue_style($style);
  }
}
?>