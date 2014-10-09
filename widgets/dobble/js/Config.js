define([
        "jquery",
        "knockout",
        "dobble/js/Word",
        "dobble/js/Items",
        "dobble/js/config/Matrices",
        "dobble/js/config/predefinedItemsLists/Marvel",
        "dobble/js/config/predefinedItemsLists/Legumes",
        "dobble/js/config/predefinedItemsLists/Fruits"
    ], function($, ko, Word, Items, Matrices, marvel, legumes, fruits) {

    return function Config() {
        var self = this;

        /***************
         * Observables *
         ***************/
        self.availableNbCards = ko.observableArray([7, 13, 21, 31, 57]);
        self.nbCards          = ko.observable(21);
        self.lists            = ko.observableArray([legumes, fruits, marvel]);
        self.list             = ko.observable();
        self.newListName      = ko.observable("");
        self.viewCards        = ko.observable(false);

        self.zoom             = ko.observable(1);
        self.cols             = ko.observable(2);
        self.rows             = ko.observable(3);

        /*******************
         * Non-Observables *
         *******************/
        self.matrices  = Matrices;

        /************
         * Services *
         ************/
        self.toggleViewCards = function() {
            self.viewCards(!self.viewCards());
        };

        self.createNewList = function() {
            var list = new Items(self.newListName(), []);
            list.edit(true);
            list.shuffle(false);
            $.each(self.lists(), function(i, l) {l.edit(false)});
            self.lists.push(list);
            self.list(list);
            self.newListName("");
        };

        self.increment = function() {
            console.log(arguments);
        };

        self.decrement = function() {
            console.log(arguments);
        };

        /*****************
         * Data Computed *
         *****************/
        self.matrice = ko.computed(function() {
            return self.matrices["nb-cards-" + self.nbCards()];
        });

        self.hasEnoughWords = ko.computed(function() {
            return self.list() && self.list().preparedItems().length >= self.nbCards();
        });

        self.nbMissingCards = ko.computed(function() {
            if (!self.list() || self.hasEnoughWords()) return 0;
            return self.nbCards() - self.list().preparedItems().length;
        });

        /********************
         * Service Computed *
         ********************/
        self.items = ko.computed(function() {
            if (!self.list()) return [];
            return self.list().preparedItems().splice(0, self.nbCards());
        });
    };
});