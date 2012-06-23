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
        this.VideoCollection.setUrl('https://gdata.youtube.com/feeds/api/standardfeeds/on_the_web?v=2&alt=json&format=5');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    },

    toprated: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.toprated').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.pull('https://gdata.youtube.com/feeds/api/standardfeeds/top_rated?time=today&v=2&alt=json&format=5');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    },

    topfavorites: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.topfavorites').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.pull('https://gdata.youtube.com/feeds/api/standardfeeds/top_favorites?time=today&v=2&alt=json&format=5');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    },

    mostviewed: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.mostviewed').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.pull('https://gdata.youtube.com/feeds/api/standardfeeds/most_viewed?time=today&v=2&alt=json&format=5');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    },

    mostpopular: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.mostpopular').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.pull('https://gdata.youtube.com/feeds/api/standardfeeds/most_popular?time=today&v=2&alt=json&format=5');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    },

    recentlyfeatured: function() {
        $('ul.nav li.active').removeClass('active');
        $('li.recentlyfeatured').addClass('active');
        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.pull('https://gdata.youtube.com/feeds/api/standardfeeds/recently_featured?v=2&alt=json&format=5');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    }
});