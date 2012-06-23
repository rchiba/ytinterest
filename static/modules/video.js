YT.Video = Backbone.Model.extend({

});

YT.VideoCollection = Backbone.Collection.extend({
    model: YT.Video,
    initialize: function(params){
        
    },

    // called with initial data on load
    // creates models out of this initial data
    // string json -> models
    addToModels: function(data){
        var that = this;
        this.data = data;

        // save the next url for infinite scroll
        var links = data.feed.link;
        this.next = null;
        for( var i = 0; i < links.length; i++ ){
            if( links[i].rel === 'next' ){
                that.next = links[i].href.replace('json-in-script', 'json');
            }
        }

        // load all the data as models
        _.each(data.feed.entry, function(entry, index){

            // get the largest thumbnail
            var thumbs = entry['media$group']['media$thumbnail'];
            var thumbnail = null;
            var maxSize = 0;
            _.each(thumbs, function(thumb, index){
                var size = thumb.height * thumb.width;
                if(size > maxSize){
                    thumbnail = thumb;
                    maxSize = size;
                }
            });


            var video = new YT.Video({
                'id': entry.id.$t,
                'published': entry.published.$t,
                'title': entry.title.$t,
                'authorName': entry.author[0].name.$t,
                'authorURI': entry.author[0].uri.$t,
                'favoriteCount': entry['yt$statistics'].favoriteCount,
                'viewCount': entry['yt$statistics'].viewCount,
                'url': entry['media$group']['media$player'].url,
                'thumbnail': thumbnail.url,
                'likes': entry['yt$rating'].numLikes,
                'dislikes': entry['yt$rating'].numDislikes,
                'embedCode': that.videoUrlToEmbedCode(entry['media$group']['media$player'].url)
            });
            that.models.push(video);
        });

    },

    // sets url for future calls
    setUrl: function(url){
        this.url = url;
    },

    videoUrlToEmbedCode: function(url){

        var matches = [];
        var youtubeRegex = /youtube.com\/watch\?.*v=.*/g;
        var vimeoRegex = /vimeo.com\/[\d\w]+/g;
        var youtubeMatches = youtubeRegex.exec( url );
        var vimeoMatches =vimeoRegex.exec( url );
        var embedCode = '';
        if( youtubeMatches !== null ){

            match = youtubeMatches[0];
            var id = YT.getParameter('v', match);
            embedCode = '\
                <iframe \
                title="YouTube video player" \
                class="youtube-player" \
                type="text/html" \
                width="640" \
                height="312" \
                src="http://www.youtube.com/embed/'+id+'" \
                frameborder="0" allowFullScreen>\
                </iframe>';
            return embedCode;

        } else if ( vimeoMatches !== null ){

            match = vimeoMatches[0];
            var vimeoid = match.split('/')[1];
            embedCode = '\
                <iframe \
                src="http://player.vimeo.com/video/'+vimeoid+'" \
                width="640" \
                height="312" \
                frameborder="0" \
                webkitAllowFullScreen \
                mozallowfullscreen \
                allowFullScreen>\
                </iframe>\
                ';
            return embedCode;

        } else {

            return null;

        }


    }
});


YT.VideoHolderView = Backbone.View.extend({

    el: $('#videoHolder'),
    buffer: 200, // pixels from bottom before we fetch
    initialize: function() {
        this.model.bind("change", this.render, this);
        return this;
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

        this.bind();

        return this;
    },

    bind: function(){
        var that = this;

        $(window).unbind('scroll').scroll(function(){
            if( that.windowAtBottom() ){
                if( that.lock ){
                    that.getLinks(function(){
                        that.renderAppend();
                        that.bind();
                    });
                    
                }
            }
        });
    },

    // the condition that determines when to call server
    windowAtBottom: function(){
        var w = $(window);
        return (w.scrollTop() >= $(document).height() - w.height() - this.buffer);
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
        //$(this.el).css('background-image', "url('"+this.model.get('thumbnail')+"')")

        return this;
    },

    events:{
        'click .box-image-overlay': 'loadModal'
    },

    // renders the modal
    loadModal: function(){
        var videoModal = new YT.VideoModal({model: this.model});
        var vmel = videoModal.render().el;
        console.log(vmel);
        $('body').append(vmel);
        videoModal.show();
    }

});

YT.VideoModal = Backbone.View.extend({
    tagName: 'div',
    templateName: '#videoModalTemplate',
    
    initialize: function(){
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
        this.template = _.template($(this.templateName).html());
    },
    
    render: function() {
        


        var json = this.model.toJSON();
        $(this.el).append(this.template(json));

        // programatically generate iframe from model url
        // http://stackoverflow.com/questions/4825251/how-to-get-the-embed-html-code-for-a-video-hosted-in-youtube-programmatically
        // http://developer.vimeo.com/player/embedding
        var embedCode = this.model.get('embedCode');
        

        $(this.el).find('.videoModalContent').append(embedCode);
        $(this.el).find('.videoModalContent').css('height', '308px');

        var that = this;
        $('#overlay').unbind('click').click(function(){
            that.close();
        });

        return this;
    },

    events:{
        'click .close': 'close'
    },

    show: function(){
        $('#overlay').fadeIn(200);
        $('.videoModal').fadeIn(200);
        return this;
    },

    close: function(){
        console.log('close clicked');
        $('#overlay').fadeOut(200);
        $(this.el).remove();
        return this;
    }


});