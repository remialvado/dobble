define(["jquery", "knockout", "dobble/js/Word"], function($, ko, Word) {
    return function Items(name, items) {
        var self = this;

        /***************
         * Observables *
         ***************/
        self.name        = ko.observable(name);
        self.items       = ko.observableArray(items || []);
        self.edit        = ko.observable(false);
        self.shuffle     = ko.observable(true);
        self.newItemName = ko.observable();

        /************
         * Computed *
         ************/
        self.preparedItems = ko.computed(function() {
            var o = self.items().slice(0);
            if (self.shuffle()) {
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            }
            return o;
        });

        /************
         * Services *
         ************/
        self.toggleEdit = function() {
            self.edit(!self.edit());
        };

        self.addNewItem = function() {
            self.items.push(new Word(self.newItemName()));
            self.newItemName("");
        };
    }
});