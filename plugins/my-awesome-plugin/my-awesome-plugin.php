<?php
  /**
   * Plugin Name: My Awesome Plugin
   * Description: An awesome plugin that does many cool things
   * Version: 1.2.3
   * Author: Tom Lagier
   */

  $manifest = [
		'main' => [
			'static/css/main.eac48bc3.css',
			'static/js/main.704b69a1.js',
		],
	];

  function create_main_app() {
    enqueue_assets('main');

    return '<div style="max-width: fit-content; min-width: -webkit-fill-available;" id="root"></div>';
  }

  function register_my_awesome_plugin_entries() {
		add_shortcode('my-awesome-plugin-main', 'create_main_app');
		register_assets('main');
  }

  add_action('init', 'register_my_awesome_plugin_entries');

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
    wp_register_script($script, plugins_url('assets/' . $script, __FILE__));
  }

  $css = get_css_for_entrypoint($entrypoint);

  foreach ($css as &$style) {
    wp_register_style($style, plugins_url('assets/' . $style, __FILE__));
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