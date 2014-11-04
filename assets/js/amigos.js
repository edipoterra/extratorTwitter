$(document).ready(function() {
	
	$("#pesquisar").click(function() {		
	var nome = $("#nome").val();		 				
		
	pesquisa(nome);				
	
	});
	
		
});

function pesquisa(pnome){	
	
	//$("#search").html("Diego");
	$.post("../controller/contSearch.php", {nome: pnome, func: "pesquisa"},
	
	
	function(data){			
		$("#search").html(data);					
		}
	, "html");
}

function getPosts(pidusuario){
	$.get("controller/contAmigos.php", {idusuario: pidusuario, func: "get"},
		function(data){
			$("#posts").html(data);
		}
	, "html");				
}

$(window).load(function() {
   getPosts(1);
  }
);