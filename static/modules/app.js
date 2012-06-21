if(typeof YT === 'undefined'){
    var YT = {};
}

$(YT).unbind('arrange');
$(YT).bind('arrange', function(event, params){
    $('#hypeHolderInner').imagesLoaded( function(){
        $('#hypeHolder').css('display', 'block');
        $('#hypeHolderInner').isotope({
            itemSelector : '.contentColBox',
            isFitWidth: true,
            masonry:{
                columnWidth:250
            }
        }, function(items){
            //console.log('here here');
            //console.log(items);
            items.fadeTo('fast', 1);
            $('.contentColBox').fadeTo('fast', 1);
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