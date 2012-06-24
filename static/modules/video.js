YT.Video = Backbone.Model.extend({

});

YT.VideoCollection = Backbone.Collection.extend({
    model: YT.Video,
    runningRequest: false, // keeps track of whether search is in progress or not
    initialize: function(params){
        
    },

    // called with initial data on load
    // creates models out of this initial data
    // string json -> models
    // replaceModels - a bool used to determine whether I should append or replace the models
    addToModels: function(data, callback, replaceModels){
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

        // replace models if needed
        if( replaceModels ){
            this.models = [];
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

            var numLikes, numDislikes, favoriteCount, viewCount;
            if( typeof entry['yt$rating'] !== 'undefined' ){
                numLikes = entry['yt$rating'].numLikes;
                numDislikes = entry['yt$rating'].numDislikes;
            }

            if( typeof entry['yt$statistics'] !== 'undefined' ){
                favoriteCount = entry['yt$statistics'].favoriteCount;
                viewCount= entry['yt$statistics'].viewCount;
            }

            var video = new YT.Video({
                'id': entry.id.$t,
                'published': entry.published.$t,
                'title': entry.title.$t,
                'authorName': entry.author[0].name.$t,
                'authorURI': entry.author[0].uri.$t,
                'favoriteCount': favoriteCount,
                'viewCount': viewCount,
                'url': entry['media$group']['media$player'].url,
                'thumbnail': thumbnail.url,
                'likes': numLikes,
                'dislikes': numDislikes,
                'embedCode': that.videoUrlToEmbedCode(entry['media$group']['media$player'].url)
            });
            that.models.push(video);
            
        });

        if( typeof callback === 'function' ){
            callback();
        }

    },

    // uses this.next url to call server and add to models
    callServer: function(callback){
        var that = this;

        $.ajax({
            type:"GET",
            url:this.next,
            dataType:"jsonp",
            success:function(responseData,textStatus,XMLHttpRequest){
                //console.log('response data is ');
                //console.log(responseData);
                that.addToModels(responseData, callback);
            }
        });
    },

    // replaces all models in collection with whatever the server returns for the query in the input
    searchServer: function(query, callback){

        var that = this;

        //Abort opened requests to speed it up
        if(this.runningRequest){
            this.request.abort();
        }

        this.runningRequest=true;
        var searchUrl = '\
https://gdata.youtube.com/feeds/api/videos?\
q='+encodeURIComponent(query.trim())+'\
&orderby=relevance\
&max-results=25\
&v=2\
&alt=json';
        //console.log('searchUrl: '+searchUrl);
        this.request = $.ajax({
            type: "GET",
            url: searchUrl,
            dataType:"jsonp",
            success:function(responseData,textStatus,XMLHttpRequest){
                //console.log('search returned with ');
                //console.log(responseData);
                that.addToModels(responseData, callback, true);
                that.runningRequest=false;
            }
        });
    },

    // helper function to convert url to embed code
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
    lock: true, // keeps us from making more than one call at a time
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

        // used to keep track of where to start in renderAppend
        YT.lastModelCount = this.model.models.length;

        this.bind();

        return this;
    },

    // called by callback given to bind
    renderAppend: function(eventName){

        for(var i = YT.lastModelCount; i < this.model.models.length; i++){
            var vid = this.model.models[i];
            $(this.el).append(new YT.VideoView({model: vid}).render().el);
        }
        YT.lastModelCount = this.model.models.length;
        
        $(YT).trigger('arrangeAppend');

        return this;
    },

    bind: function(){
        var that = this;

        $(window).unbind('scroll').scroll(function(){
            if( that.windowAtBottom() ){
                if( that.lock ){
                    that.lock = false;
                    $('#bottomLoader').fadeIn();
                    that.model.callServer(function(){
                        that.lock = true;
                        that.renderAppend();
                        $(YT).trigger('arrangeAppend');
                        $('#bottomLoader').fadeOut();
                    });
                }
            }
        });

       // Search
       $('input.search-query').unbind('keyup').keyup(function(e){
            e.preventDefault();
            // check if box is empty or if backspace key was pressed
            var $q = $(this);
            if($q.val() === '' || e.keyCode == 8){
                return false;
            }

            // switch the url to reflect page
            window.location.href = "#!/search";

            // edit the title
            $('.containerTitle').html("Search results for '<b>"+$q.val()+"</b>'");

            // ask collection to replace models with search query results
            $('#bottomLoader').fadeIn();
            that.model.searchServer($q.val(), function(){
                that.render();
                $(YT).trigger('arrange');
                $('#bottomLoader').fadeOut();
            });

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