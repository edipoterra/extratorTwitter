;(function( $ ){
    $.fn.showPopover = function(popoverData) {
        return this.unbind("mouseover").hidePopover().popover(popoverData).popover("show");
    };
    
    $.fn.hidePopover = function() {
        $(".popover").remove(); 
        return this.popover("hide").data("popover", null);
    };
})( jQuery );
