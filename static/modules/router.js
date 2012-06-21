// Router
HM.AppRouter = Backbone.Router.extend({
    routes: {
        ""                     : "index"
    },

    index: function() {

        this.HypeCollection = new HM.HypeCollection();
        this.HypeCollection.url = '/api/home';
        this.HypeHolderView = new HM.HypeHolderView({model: this.HypeCollection});
        this.HypeCollection.fetch();

        // track index page load time
        HM.startTime = new Date().getTime();
        $(HM).one('arrangeAllHypes', function(){
            var endTime = new Date().getTime();
            var timeSpent = endTime - HM.startTime;
            _gaq.push(['_trackTiming', 'Core', 'Home Feed Load Time', timeSpent, 'Home Feed', 100]);
            console.log('Home Feed Load Time: ' + timeSpent+'ms');
        });

        _gaq.push(['_trackEvent', 'Router', 'Index Viewed']);

    }
};