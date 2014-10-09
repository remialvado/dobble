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

        self.createNewList = function() {
            var list = new Items(self.newListName(), []);
            list.edit(true);
            list.shuffle(false);
            $.each(self.lists(), function(i, l) {l.edit(false)});
            self.lists.push(list);
            self.list(list);
            self.newListName("");
        };

        self.increment = function(model) {
            self[model](self[model]() + 1);
        };

        self.decrement = function(model) {
            self[model](Math.max(1, self[model]() - 1));
        };

        /*****************
         * Data Computed *
         *****************/
        self.matrice = ko.computed(function() {
            return self.matrices["nb-cards-" + self.nbCards()];
        });

        self.nbItemsPerCard = ko.computed(function() {
            return self.matrice()[0].length;
        });

        self.hasEnoughWords = ko.computed(function() {
            return self.list() && self.list().preparedItems().length >= self.nbCards();
        });

        self.nbMissingCards = ko.computed(function() {
            if (!self.list() || self.hasEnoughWords()) return 0;
            return self.nbCards() - self.list().preparedItems().length;
        });

        self.error = ko.computed(function() {
            if (!self.hasEnoughWords()) return "Il vous manque " + self.nbMissingCards() + " mots pour ce jeu.";
            if (self.rows() * self.cols() < self.nbItemsPerCard()) return "Il faut rajouter des lignes ou des colonnes.";
            return undefined;
        });

        self.hasError = ko.computed(function() {
            return self.error() !== undefined;
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