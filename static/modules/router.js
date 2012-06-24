// Router
YT.AppRouter = Backbone.Router.extend({
    routes: {
        ""                     : "trending",
        "!/toprated"          : "toprated",
        "!/topfavorites"      : "topfavorites",
        "!/mostviewed"        : "mostviewed",
        "!/mostpopular"       : "mostpopular",
        "!/recentlyfeatured"  : "recentlyfeatured"
    },

    trending: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.trending').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.trending);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');

    },

    toprated: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.toprated').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.topRated);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    topfavorites: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.topfavorites').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.topFavorites);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    mostviewed: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.mostviewed').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.mostViewed);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    mostpopular: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.mostpopular').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.mostPopular);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    recentlyfeatured: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.recentlyfeatured').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.recentlyFeatured);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    }
});