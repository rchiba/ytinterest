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
                // title was weird, it was duplicated
                var titleText = $(this).find('title').text();
                var title = titleText.substring(0,titleText.length/2);
                var video = new YT.Video({
                    'id': $(this).find('id').text(),
                    'published': $(this).find('published').text(),
                    'title': title,
                    'authorName': $(this).find('author name').text(),
                    'authorURI': $(this).find('author uri').text(),
                    'favoriteCount': $(this).find('[nodeName="yt:statistics"],statistics').attr('favoriteCount'),
                    'viewCount': $(this).find('[nodeName="yt:statistics"],statistics').attr('viewCount'),
                    'url': $(this).find('[nodeName="media:player"],player').attr('url'),
                    'thumbnail': $(this).find('[nodeName="media:thumbnail"],thumbnail').attr('url'),
                    'embedCode': that.videoUrlToEmbedCode( $(this).find('[nodeName="media:player"],player').attr('url') )
                });
                that.models.push(video);
            });
            //console.log(that.models);
            that.trigger('change');

        });
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