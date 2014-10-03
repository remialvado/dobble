define(["jquery", "knockout", "dobble/js/Config", "dobble/js/Card", "text!dobble/template/main.html", "css!dobble/css/main.css", "knockoutTemplatingPlugin"],
    function($, ko, Config, Card, template) {
        function myViewModel() {
            var self = this;

            /***************
             * Observables *
             ***************/
            self.config = ko.observable(new Config());

            /************
             * Computed *
             ************/
            self.cards = ko.computed(function() {
                var cards = [];
                if (self.config().items().length < self.config().nbCards()) {
                    return cards;
                }

                $.each(self.config().matrice(), function(i, indexes) {
                    var cardItems = [];
                    $.each(indexes, function(j, index) {
                        cardItems.push(self.config().items()[index]);
                    });
                    cards.push(new Card(cardItems));
                });
                return cards;
            }).extend({ rateLimit: { timeout: 250, method: "notifyWhenChangesStop" } });

            /************
             * Services *
             ************/
        };

        $('#main').prepend(template);
        ko.applyBindings(new myViewModel(), $('#main')[0]);
    }
);