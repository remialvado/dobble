define(["jquery", "knockout", "dobble/js/Config", "dobble/js/Card", "text!dobble/template/main.html", "css!dobble/css/main.css", "knockoutTemplatingPlugin"],
    function($, ko, Config, Card, template) {
        function myViewModel() {
            var self = this;

            /***************
             * Observables *
             ***************/
            self.config = ko.observable(new Config());

            /************
             * Services *
             ************/
            self.getCard_rectangle = function(config) {
                var width = 200 * config.zoom;
                var height = width / 2;
                var fontSize = 8 * config.zoom;
                var fontPixel = fontSize + "px";
                var wordBox = {width: width / config.cols, height: height / config.rows};
                var words = [];
                for (var i = 0; i < config.words.length; i++) {
                    var row = Math.floor(i / config.rows);
                    var col = i % config.rows;
                    var topLeft = {x: config.topLeft.x + row * wordBox.width, y: config.topLeft.y + col * wordBox.height};
                    words.push({x: topLeft.x + wordBox.width/2, y: topLeft.y + wordBox.height / 2 + fontSize / 2, word: config.words[i], size: fontPixel});
                }
                return {rect: {width: width, height: height, x: config.topLeft.x, y: config.topLeft.y}, words: words};
            };

            /*****************
             * Data Computed *
             *****************/
            self.pages = ko.computed(function() {
                var pages = [];

                // generate words lists
                var wordsLists = [];
                if (self.config().items().length < self.config().nbCards()) {
                    return pages;
                }

                $.each(self.config().matrice(), function(i, indexes) {
                    var words = [];
                    $.each(indexes, function(j, index) {
                        words.push(self.config().items()[index]);
                    });
                    wordsLists.push(words);
                });

                var pageDimension = {width: 500, height: 300};
                var topLeft = {x: 10, y: 10};
                var currentPage = [];
                $.each(wordsLists, function(index, words) {
                    // create cardMatrix
                    var card = self.getCard_rectangle({
                        topLeft: {x: topLeft.x, y: topLeft.y},
                        zoom: self.config().zoom(),
                        rows : self.config().rows(),
                        cols: self.config().cols(),
                        words: words
                    });

                    currentPage.push(card);
                    if (topLeft.x + card.rect.width * 2 + 10 <= pageDimension.width) {
                        // stay on the same line
                        topLeft.x += card.rect.width + 10;
                    }
                    else if (topLeft.y + card.rect.height * 2 + 10 <= pageDimension.height) {
                        // jump to next line
                        topLeft.x = 10;
                        topLeft.y += card.rect.height + 10;
                    }
                    else {
                        // jump to next document;
                        pages.push(currentPage);
                        currentPage = [];
                        topLeft = {x: 10, y: 10};
                    }
                });
                if (currentPage.length > 0) {
                    pages.push(currentPage);
                }

                return pages;
            });

            /********************
             * Service Computed *
             ********************/
            self.drawSvg = ko.computed(function() {
                $("svg").remove();
                if (self.config().hasError()) return;
                $.each(self.pages(), function(index, cards) {
                    $("#svg-container").append('<svg id="svg-' + index + '"></svg>');
                    var s = Snap("#svg-" + index);
                    $.each(cards, function(index2, card) {
                        var rect = s.rect(card.rect.x, card.rect.y, card.rect.width, card.rect.height, 5, 5);
                        rect.attr({fill: "none", stroke: "#555", strokeWidth: 2});
                        $.each(card.words, function(index3, word) {
                            var text = s.text(word.x, word.y, word.word.value());
                            text.attr({"textAnchor": "middle", "fontSize": word.size});
                        });
                    });
                });
            });
        };

        $('#main').prepend(template);
        ko.applyBindings(new myViewModel(), $('#main')[0]);
    }
);