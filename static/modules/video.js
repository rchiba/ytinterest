YT.Video = Backbone.Model.extend({

});

YT.VideoCollection = Backbone.Collection.extend({
    model: YT.Video,
    initialize: function(params){
        
    },

    pull: function(url){
        this.url = url;
        // call the google endpoint, populate internal models array
        console.log('initialized with url :'+this.url);
        var that = this;
        $.get(this.url, {}, function(xml){
            $('entry', xml).each(function(i){
                var video = new YT.Video({
                    'id': $(this).find('id').text(),
                    'published': $(this).find('published').text(),
                    'title': $(this).find('title').text(),
                    'authorName': $(this).find('author name').text(),
                    'authorURI': $(this).find('author uri').text(),
                    'favoriteCount': $(this).find('[nodeName="yt:statistics"],statistics').attr('favoriteCount'),
                    'viewCount': $(this).find('[nodeName="yt:statistics"],statistics').attr('viewCount'),
                    'playerUrl': $(this).find('[nodeName="media:player"],player').attr('url'),
                    'thumbnail': $(this).find('[nodeName="media:thumbnail"],thumbnail').attr('url')
                });
                that.models.push(video);
            });
            that.trigger('change');

        });
    }
});


YT.VideoHolderView = Backbone.View.extend({

    el: $('#videoHolder'),
    initialize: function() {
        this.model.bind("change", this.render, this);
        var that = this;
        

    },

    render: function(eventName) {

        // clear
        $(this.el).empty();

        var collection = this.model.models;

        // render
        _.each(this.model.models, function(vid, index) {
            $(this.el).append(new YT.VideoView({model: vid}).render().el);
        }, this);

        $(YT).trigger('arrange');
        return this;
    }

});

YT.VideoView = Backbone.View.extend({

    tagName: 'div',
    className: 'box',
    templateName: '#videoTemplate',
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.template = _.template($(this.templateName).html());
    },

    render: function(eventName) {

        // clear
        $(this.el).empty();

        // render
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    }

});