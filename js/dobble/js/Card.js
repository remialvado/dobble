define(["jquery", "knockout"], function($, ko) {
    return function Card(items) {
        var self = this;

        /***************
         * Observables *
         ***************/
        self.items = ko.observableArray(items || []);

        /***********
         * Service *
         ***********/
        self.pushItem = function(item) {
            self.items.push(item);
        }
    }
});