$(document).ready(function() {
    $('#upload_target').hide();    
    
    $("#post").click(function() {
        getPosts();
    });
});


function getPosts(){
    $.get("../controller/contCoordenadas.php", {function: "get"},
        function(data){
            $("#posts").html(data);
        }
    , "html");                
}


$(window).load(function() {
    getPosts();  
  }
);
