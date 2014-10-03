define(["jquery", "knockout"], function($, ko) {
    return function Card(items) {
        var self = this;

        /***************
         * Observables *
         ***************/
        self.items = ko.observableArray(items || []);
    }
});