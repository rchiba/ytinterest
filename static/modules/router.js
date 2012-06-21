// Router
YT.AppRouter = Backbone.Router.extend({
    routes: {
        ""                     : "index"
    },

    index: function() {

        this.VideoCollection = new YT.VideoCollection();
        this.VideoCollection.pull('https://gdata.youtube.com/feeds/api/standardfeeds/top_rated?time=today');
        this.VideoHolderView = new YT.VideoHolderView({model: this.VideoCollection}).render();

    }
});