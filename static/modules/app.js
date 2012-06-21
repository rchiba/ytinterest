if(typeof YT === 'undefined'){
    var YT = {};
}

$(YT).unbind('arrange');
$(YT).bind('arrange', function(event, params){
    console.log('arrange');
    //$('#videoHolder').css('opacity','0');
    $('#videoHolder').isotope('destroy');
    $('#videoHolder').imagesLoaded( function(){
        console.log('in here');
        $('#videoHolder').isotope({
            itemSelector : '.box',
            masonry:{
                columnWidth:300
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

// Application Hook
$(document).ready(function(){
    YT.App = new YT.AppRouter();
    Backbone.history.start();
});