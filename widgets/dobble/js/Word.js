define(["jquery", "knockout"], function($, ko) {
    return function Word(value) {
        var self = this;

        /***************
         * Observables *
         ***************/
        self.value = ko.observable(value);
    }
});