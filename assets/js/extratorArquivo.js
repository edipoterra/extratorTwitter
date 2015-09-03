function getPosts(){
    $.get("../controller/contArquivo.php", {function: "export"},
        function(data){
            $("#posts").html(data);
        }
    , "html");                
}


$(window).load(function() {
    getPosts();  
  }
);
