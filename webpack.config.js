var webpack = require("webpack");

// Pass in the build configuration as environment variables
const CONFIG   = process.env.BUILD_CONFIG
const PLATFORM = process.env.BUILD_PLATFORM;

// Modify the webpack settings based on the configuration
var plugins = [];
var defines = {
    DEBUG            : false,
    PLATFORM_NODE    : false,
    PLATFORM_BROWSER : false,
    API_CONFORMANCE_CHECKS : false,
};

var bundlePlatform = "";
var bundleSuffix = "";
var libraryTarget = "";
var target = "";
var devtool = undefined;

switch (CONFIG) {
    case "debug":
        defines.DEBUG = true;
        defines.API_CONFORMANCE_CHECKS = true;
        bundleSuffix = "-debug";
        devtool = "source-map";
        break;

    case "prod":
        plugins.push(new webpack.optimize.DedupePlugin());
        break;

    default:
        console.error("Unexpected BUILD_CONFIG!");
        process.exit(1);
}

switch (PLATFORM) {
    case "node":
        bundlePlatform = "-node";
        bundleSuffix = (CONFIG == 'debug') ? '-debug' : '';
        defines.PLATFORM_NODE = true;
        target = "node";
        libraryTarget = "commonjs2";

        if (CONFIG === "debug") {
            plugins.push(new webpack.BannerPlugin('require("source-map-support").install();', {
                raw: true,
                entryOnly: false
            }));
        }
        break;

    case "browser":
        bundlePlatform = "-browser";
        bundleSuffix = (CONFIG == 'debug') ? '' : '.min';
        defines.PLATFORM_BROWSER = true;
        target = "web";
        libraryTarget = "var";
        break;

    default:
        console.error("Unexpected BUILD_PLATFORM!");
        process.exit(1);
}

//
// Webpack configuration
//
var bundleName = "opentracing" + bundlePlatform + bundleSuffix;

module.exports = {
    entry   : "./src/index.js",
    target  : target,
    devtool : devtool,
    output  : {
        path          : "dist/",
        filename      : bundleName + ".js",
        library       : "Tracer",
        libraryTarget : libraryTarget,
    },
    plugins :[
        new webpack.DefinePlugin(defines),
    ].concat(plugins),
    module  : {
        loaders : [
            {
                test    : /\.js$/,
                loader  : "babel",
                include : /src\//,
                exclude : /node_modules/,
                query   : {
                    cacheDirectory : true,
                    presets : [ ],
                    plugins : [
                        "add-module-exports",
                        'babel-plugin-transform-dead-code-elimination',

                        // Manually specify the *subset* of the ES2015 preset
                        // to use. This reduces the output file size and improves
                        // interoperability (e.g. Symbol on IE).
                        'babel-plugin-transform-es2015-template-literals',
                        'babel-plugin-transform-es2015-literals',
                        //'babel-plugin-transform-es2015-function-name',
                        //'babel-plugin-transform-es2015-arrow-functions',
                        'babel-plugin-transform-es2015-block-scoped-functions',
                        //'babel-plugin-transform-es2015-classes',
                        //'babel-plugin-transform-es2015-object-super',
                        // 'babel-plugin-transform-es2015-shorthand-properties',
                        'babel-plugin-transform-es2015-duplicate-keys',
                        'babel-plugin-transform-es2015-computed-properties',
                        // 'babel-plugin-transform-es2015-for-of',
                        'babel-plugin-transform-es2015-sticky-regex',
                        'babel-plugin-transform-es2015-unicode-regex',
                        'babel-plugin-check-es2015-constants',
                        'babel-plugin-transform-es2015-spread',
                        'babel-plugin-transform-es2015-parameters',
                        'babel-plugin-transform-es2015-destructuring',
                        'babel-plugin-transform-es2015-block-scoping',
                        //'babel-plugin-transform-es2015-typeof-symbol',
                        'babel-plugin-transform-es2015-modules-commonjs',
                    ],
                }
            },
        ]
    },
};
