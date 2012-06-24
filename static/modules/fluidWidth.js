YT.FluidWidthModule = (function (window) {
    
    var defaults = {
        header : $('.navbar .container'),
        stage: $('.stage'),
        // how wide the masonry columns are
        colWidth: YT.colWidth,
        // how many columns can fit on the current page
        colsFit:-1,
        // how much extra space we want on the sides
        buffer: 50
    };

    // constructor
    var module = function (options) {
        this.o = {};
        $.extend(this.o, defaults, options);
        this.init();
        this.bind();
    };

    function numColsFit(){
        return Math.floor( ( $(window).width() - this.o.buffer * 2 ) / this.o.colWidth );
    }
    
    // resize elements as necessary to fit colsFit number of columns
    function resize(){
        var newWidth = this.o.colsFit * this.o.colWidth;
        this.o.header.css('width', newWidth+'px');
        this.o.stage.css('width', newWidth+'px');
        // this is to notify any elements that need to disappear at a certain size
        YT.windowWidth = newWidth;
        $(YT).trigger('windowResize', [newWidth]);
    }

    // functions
    function init(){
        // determine initial screen configuration
        this.o.colWidth = YT.colWidth;
        this.o.colsFit = this.numColsFit();
        this.resize();
    }

    function bind(){
        var that = this;
        function determineIfWeNeedToCallResize(){
            if(that.o.colsFit !== that.numColsFit()){
                that.o.colsFit = that.numColsFit();
                that.resize();
            }
        }
        $(window).resize(determineIfWeNeedToCallResize);

        // trigger for calling it from modules
        //$(YT).bind('resize', that.resize.bind(that));
    }
    
    module.prototype = {
        constructor: module,
        bind: bind,
        init: init,
        resize: resize,
        numColsFit: numColsFit
    };
    
    return module;
}(window));