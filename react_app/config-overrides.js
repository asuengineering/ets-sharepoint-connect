const { WordpressShortcodeWebpackPlugin } = require('wordpress-shortcode-webpack-plugin');

module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...
    if(env == "production") {
        config.plugins.push(new WordpressShortcodeWebpackPlugin({
            // The name of the plugin in Wordpress. Should be kebab-cased
            wordpressPluginName: 'my-awesome-plugin',
            // Any additional fields to put in the plugin header.
            headerFields: {
                author: 'Tom Lagier',
                description: 'An awesome plugin that does many cool things',
                // Note: Defining a version isn't necessary for Wordpress cache-busting
                // if you're using [contenthash] tokens in your output. It can still be
                // nice to set a version for communicating changes to users.
                version: '1.2.3'
            }
          }))
    }
    return config
}