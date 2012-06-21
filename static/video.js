YT.Video = Backbone.Model.extend({
    idAttribute: 'comment_id'
});
YT.VideoCollection = Backbone.Collection.extend({
    model: YT.Video
});


HM.VideoHolderView = Backbone.View.extend({

    el: $('#videoHolder'),
    initialize: function() {
        this.model.bind("change", this.render, this);
        var that = this;
        

    },

    render: function(eventName) {

        // clear
        $(this.el).empty();

        _.each(this.model.models, function(vid, index) {
            $(this.el).append(new HM.VideoView({model: vid}).render().el);
        }, this);

        // call isotope

        return this;
    }

});

HM.VideoView = Backbone.View.extend({

    tagName: 'div',
    template: _.template($('#videoTemplate').html()),
    initialize: function() {
        this.model.bind("change", this.render, this);
    },

    render: function(eventName) {

        // clear
        $(this.el).empty();

        // render
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    }

});