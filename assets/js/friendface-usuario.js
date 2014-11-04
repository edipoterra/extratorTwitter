$(document).ready(function() {
	$('#upload_target').hide();	
	
	getPosts();
	
	$("#action").click(function() {
	    window.location.reload();
	});
	
		
});

function getPosts(){
	$.get("../controller/contUsuario.php", {func: "get"},
		function(data){
			$("#posts").html(data);
		}
	, "html");				
}
