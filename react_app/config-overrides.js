const { WordpressShortcodeWebpackPlugin } = require('wordpress-shortcode-webpack-plugin');

module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...
    if(env == "production") {
        config.plugins.push(new WordpressShortcodeWebpackPlugin({
            // The name of the plugin in Wordpress. Should be kebab-cased
            wordpressPluginName: 'react-app-shortcode',
            // Any additional fields to put in the plugin header.
            headerFields: {
                author: 'ETS student worker',
                description: 'Converts react app into a wordpress plugin which can be used as a shortcode',
                version: '1.2.5'
            }
          }))
    }
    return config
}