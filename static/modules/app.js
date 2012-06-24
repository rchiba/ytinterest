if(typeof YT === 'undefined'){
    var YT = {};
}

// column width
YT.colWidth = 232;

$(YT).unbind('arrange');
$(YT).bind('arrange', function(event, params){
    //console.log('arrange');
    //$('#videoHolder').css('opacity','0');
    $('#videoHolder').isotope('destroy');
    $('#videoHolder').imagesLoaded( function(){
        $('#videoHolder').isotope({
            itemSelector : '.box',
            masonry:{
                columnWidth:YT.colWidth
            }
        }, function(items){
            //console.log('callback');
            //items.fadeTo('fast', 1);
            //$('#videoHolder').fadeTo('fast', 1);
        });
    });
    
});

$(YT).unbind('arrangeAppend');
$(YT).bind('arrangeAppend', function(event, params){
    //console.log('arrangeAppend');
    // check to see if we have any appended hypes,
    // since otherwise isotope callback won't fire
    var appended = $('.box').not('.isotope-item');
    $('#videoHolder').isotope('appended', appended, function(items){
        // fade in the newly arranged items
        //items.fadeTo('fast', 1);
        //$('#hypeBottomLoading').fadeOut();
    });
});

$(YT).unbind('arrangeReload');
$(YT).bind('arrangeReload', function(event, params){
    $('#videoHolder').imagesLoaded( function(){
        $('#videoHolder').isotope('reLayout');
    });
});

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
    this.FluidWidth = new YT.FluidWidthModule();
    YT.App = new YT.AppRouter();
    Backbone.history.start();
});