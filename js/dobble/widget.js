define(["jquery", "knockout", "dobble/js/Config", "dobble/js/Card", "text!dobble/template/main.html", "css!dobble/css/main.css", "knockoutTemplatingPlugin"],
    function($, ko, Config, Card, template) {
        function myViewModel() {
            var self = this;

            /***************
             * Observables *
             ***************/
            self.config = ko.observable(new Config());
            self.cards  = ko.observableArray([]);

            /************
             * Computed *
             ************/
            self.generateCards = ko.computed(function() {
                var items = self.config().words();
                self.cards([]);
                $.each(self.config().matrice(), function(i, cardItems) {
                    var items = [];
                    $.each(cardItems, function(j, itemIndex) {
                        items.push(self.config().words()[itemIndex]);
                    });
                    self.cards.push(new Card(items));
                });
            });

            /************
             * Services *
             ************/
        };

        $('#main').prepend(template);
        ko.applyBindings(new myViewModel(), $('#main')[0]);
    }
);