<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    error_reporting(E_ALL|E_STRICT);
    ini_SET('display_errors', 1);

    require_once('../twitteroauth/twitteroauth/twitteroauth.php');

    if (!empty($_GET['function'])){
        switch($_GET['function']){
        case 'get':
            get();
            break;
        }
    }

    function get(){
        
        $consumer_key = 'VBCid3lqhzpP2g0SgWwmkBP0X';  
        $consumer_secret = '0mFEUlOSxVlaPW3p0xSldLUUALGLOCMEpJ7VnSAy2ahoER5HUC';  
        $oauth_token = '90736366-ovMXKViSjqSWR6WqNPj6jS7MgIMyMFwVwkxpFG70x';  
        $oauth_token_secret = 'TiHVeB6doRimKaIn6U5cBvpgliozZ8eNB2DwyQ1oget1t';  
        
        // Busca os parametros infomados no cadastro da coordenada
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
        $dados = $collection->find();

        $posts = "";
        foreach ($dados as $document){
            $termoBusca = $document['termos'];

            $result = $connection->get('search/tweets',
                array(
                    "q" => "$termoBusca", 
                    "geocode" => "$latitude,$longitude,300km", 
                    "count" => "10"
                ));

            foreach($result as $node){
                foreach ($node as $subnode){
                    if (is_object($subnode)){
                        $texto = $subnode->text;
                        $usuario = $subnode->user->screen_name;
                        $dataHora = $subnode->created_at;
                        $posts .= "<b>@$usuario</b> <br/> $texto <br/>$dataHora<br/><hr/>";
                    }
                }
            }
        }
        echo $posts;
    }
?>
