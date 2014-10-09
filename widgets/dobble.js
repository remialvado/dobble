requirejs.config({
    baseUrl: 'widgets',
    vendor: '../vendor',
    waitSeconds: 200,
    config: {
        text: {
            useXhr: function(url, protocol, hostname, port) {
                //Override function for determining if XHR should be used.
                //url: the URL being requested
                //protocol: protocol of page text.js is running on
                //hostname: hostname of page text.js is running on
                //port: port of page text.js is running on
                //Use protocol, hostname, and port to compare against the url
                //being requested.
                //Return true or false. true means "use xhr", false means
                //"fetch the .js version of this resource".
                return true;
            }
        }
    },
    shim: {
        'knockoutTemplatingPlugin': ['knockout'],
        'bootstrap': ["jquery"],
        'dobble/widget': ["snap"]
    },
    paths: {
        'jquery': 'vendor/jquery-2.1.1.min',
        'knockout': 'vendor/knockout-3.1.0',
        'knockoutTemplatingPlugin': 'vendor/StringInterpolatingBindingProvider',
        'bootstrap':                'vendor/bootstrap-3.1.0.min',
        'snap':                     'vendor/snap.svg',
        'text':                     'vendor/text',
        'css':                      'vendor/css'
    }
});
require(["jquery", "dobble/widget"]);
