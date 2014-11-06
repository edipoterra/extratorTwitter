(function($){
  $(document).ready(function(){
    $.ajaxSetup({
      cache: false,
      beforeSend: function() {
        $('#posts').hide();
        $('#loading').show();
      },
      complete: function(){
        $('#loading').hide();
        $('#posts').show();
      },
      success: function(){
        $('#loading').hide();
        $('#posts').show();
      }
    });
    var $container = $('#posts');
    $container.load("controller/contExtrator.php");
    var refreshId = setInterval(function(){
      $container.load("controller/contExtrator.php");
    }, 300000);
  });
})(jQuery);

