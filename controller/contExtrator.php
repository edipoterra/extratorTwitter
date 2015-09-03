<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    require_once('../twitteroauth/twitteroauth/twitteroauth.php');
    
	$consumer_key = 'VBCid3lqhzpP2g0SgWwmkBP0X';  
    $consumer_secret = '0mFEUlOSxVlaPW3p0xSldLUUALGLOCMEpJ7VnSAy2ahoER5HUC';  
    $oauth_token = '90736366-ovMXKViSjqSWR6WqNPj6jS7MgIMyMFwVwkxpFG70x';  
    $oauth_token_secret = 'TiHVeB6doRimKaIn6U5cBvpgliozZ8eNB2DwyQ1oget1t';  
        
    // Busca os parametros infomados no cadastro da coordenada
	try {
	    $mongo = new MongoClient();
	    $db = $mongo->twitterdb;
	    $collection = $db->createCollection('coordenada');
	    $dados = $collection->find();
	    $latitude = "";
	    $longitude = "";

	    foreach ($dados as $document){
	        $latitude = $document['latitude'];
	        $longitude = $document['longitude'];
	    }

	    $connection = new TwitterOAuth(
	        $consumer_key,
	        $consumer_secret,
	        $oauth_token,
	        $oauth_token_secret
	    );

	    $collection = $db->createCollection('termo');
	    $cont =  (int) (350 / $collection->count());
	    $dados = $collection->find();

	    $posts = "";
	    foreach ($dados as $document){
	        $termoBusca = $document['termos'];

	        $result = $connection->get('search/tweets',
	            array(
	                "q" => "$termoBusca", 
	                "geocode" => "$latitude,$longitude,200km", 
	                "count" => "$cont"
	            ));

			if ($result){
	          	foreach($result as $node){
	               	foreach ($node as $subnode){
	                   	if (is_object($subnode)){
	                       	$texto = $subnode->text;
	                       	$texto = iconv("utf-8", "ascii//TRANSLIT", $texto);
	                       	$texto = preg_replace('/[^A-Za-z0-9\-:\\ \/\.]/', '', $texto);
	                       	$usuario = $subnode->user->screen_name;
	                       	$dataHora = $subnode->created_at;

	                       	$collData = $db->createCollection('mensagem');
	                       	$mesData = $collData->findOne( array( 'texto' => $texto ));

	                       	// aqui estou simplesmente efetuando a gravacao das informacoes no banco
	                       	if ($mesData == NULL){
	                           	$mongo->selectDB( 'twitterdb' )->selectCollection( 'mensagem' )->insert( array( 'texto' => $texto, 'datahora' => $dataHora ));
	                       	}
	                   	}
	               	}
	           	}
			}
		}


	    $collData = $db->createCollection('mensagem');
	    $quantidade = $collData->count();
	    $posts = "<h2>Coletadas $quantidade mensagens.</h2>";

	    echo $posts;		
	}
	catch (Exception $e) {
		echo '<center><h3>Não foi possível conectar no servidor Mongo DB.';
		echo '<center><h3>Verifique a disponibilidade do banco de dados</h3></center>';
	}


?>
