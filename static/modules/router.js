// Router
YT.AppRouter = Backbone.Router.extend({
    routes: {
        ""                     : "trending",
        "!/toprated"          : "toprated",
        "!/topfavorites"      : "topfavorites",
        "!/mostviewed"        : "mostviewed",
        "!/mostpopular"       : "mostpopular",
        "!/recentlyfeatured"  : "recentlyfeatured",
        "!/search"            : "search"
    },

    trending: function() {
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').removeClass('active').val('');
        $('li.trending').addClass('active');

        this.show('normal');

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.trending);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');

    },

    toprated: function() {
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').removeClass('active').val('');
        $('li.toprated').addClass('active');

        this.show('normal');

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.topRated);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    topfavorites: function() {
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').removeClass('active').val('');
        $('li.topfavorites').addClass('active');

        this.show('normal');

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.topFavorites);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    mostviewed: function() {
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').removeClass('active').val('');
        $('li.mostviewed').addClass('active');

        this.show('normal');

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.mostViewed);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    mostpopular: function() {
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').removeClass('active').val('');
        $('li.mostpopular').addClass('active');

        this.show('normal');

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.mostPopular);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');


    },

    recentlyfeatured: function() {
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').removeClass('active').val('');
        $('li.recentlyfeatured').addClass('active');

        this.show('normal');

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.addToModels(YT.recentlyFeatured);
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        $(YT).trigger('arrange');

    },

    search: function(){
        $('ul.nav li.active').removeClass('active');
        $('input.search-query').addClass('active');
        this.show('search');

        if( !this.VideoCollection ){
            this.VideoCollection = new YT.VideoCollection();
        }

        if( !this.VideoHolderView ){
            this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();
        }

    },

    show: function( type ){
        if( type === 'normal' ){
            $('.containerTitle').fadeOut();
        } else if ( type === 'search' ){
            $('.containerTitle').fadeIn();
        }
    }
});