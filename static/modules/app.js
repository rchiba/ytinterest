if(typeof YT === 'undefined'){
    var YT = {};
}

// column width
YT.colWidth = 232;

$(YT).unbind('arrange');
$(YT).bind('arrange', function(event, params){
    console.log('arrange');
    //$('#videoHolder').css('opacity','0');
    $('#videoHolder').isotope('destroy');
    $('#videoHolder').imagesLoaded( function(){
        $('#videoHolder').isotope({
            itemSelector : '.box',
            masonry:{
                columnWidth:YT.colWidth
            }
        }, function(items){
            console.log('callback');
            //items.fadeTo('fast', 1);
            //$('#videoHolder').fadeTo('fast', 1);
        });
    });
    
});

$(YT).unbind('arrangeReload');
$(YT).bind('arrangeReload', function(event, params){
    $('#hypeHolderInner').isotope('reLayout');
});


// IE BUG
if (typeof console == "undefined") {
    this.console = {log: function() {}};
}

// Getting a url parameter
YT.getParameter = function(paramName, url) {

    try{

        var searchString = url.split('?')[1],
            i, val, params = searchString.split("&");

        for (i=0;i<params.length;i++) {
            val = params[i].split("=");
            if (val[0] == paramName) {
                return unescape(val[1]);
            }
        }
        return null;

    } catch(e){
        return null;
    }
};


// Application Hook
$(document).ready(function(){
    YT.App = new YT.AppRouter();
    Backbone.history.start();
    this.FluidWidth = new YT.FluidWidthModule();
});