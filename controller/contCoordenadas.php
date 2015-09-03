<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    error_reporting(E_ALL|E_STRICT);
    ini_set('display_errors', 1);

    if (!empty($_GET['function'])){
        switch($_GET['function']){
        case 'insert':
            $latitude = $_POST['latitude'];
            $longitude = $_POST['longitude'];
            insert($latitude, $longitude);
            break;
        case 'get':
            get();
            break;
        case 'delete':
            delete($_POST);
            break;
        }
    }

    function insert($latitude, $longitude){
        // efetua o cadastramento das coordenadas no sistema. Nao permite cadastra mais que um par de coordenadas
        try{
			$mongo = new MongoClient('mongodb://edipo:edipo@localhost:27017');

	        $db = $mongo->twitterdb;
	        $collection = $db->createCollection("coordenada");
	        $dados = $collection->find();

	        $isEmpty = true;
	        foreach ($dados as $document){
	            $isEmpty = false;
	            break;
	        }

	        if ($isEmpty) {
	            $mongo->selectDB('twitterdb')->selectCollection('coordenada')->insert(array('latitude' => $latitude, 'longitude' => $longitude));
	        }			
		}
		catch(Exception $e){
			//Dar mensagem de erro?
		}
        header("Location: ../view/viewTermos.php");
    }

    function delete(){
        // efetua a exclusao das coordenadas no sistema
    }

    function get(){
		try{
	        $mongo = new MongoClient();
	        $db = $mongo->twitterdb;
	        $collection = $db->createCollection('coordenada');
	        $dados = $collection->find();
	        $latitude = "";
	        $longitude = "";
	        $disabled = "";

	        foreach ($dados as $document){
	            $latitude = $document['latitude'];
	            $longitude = $document['longitude'];
	            $disabled = "disabled";
	        }

	        $posts = '<form class="modal-form form-horizontal" id="termosBusca" method="post" action="../controller/contCoordenadas.php?function=insert">';
	        $posts .= '<fieldset>';
	        $posts .= '<div class="modal-body">';
	        $posts .= '<div id="aboutText">';
	        $posts .= '<h3>Latitude:</h3>';
	        $posts .= '<input type="text" name="latitude" value="' . $latitude . '" ' . $disabled . '/>';
	        $posts .= '<br/><br/>';
	        $posts .= '<h3>Longitude:</h3>';
	        $posts .= '<input type="text" name="longitude" value="' . $longitude . '" ' . $disabled . '/>';
	        $posts .= '<br/><br/>';
	        $posts .= '<button class="btn" type="submit" id="post" ' . $disabled . '>Salvar</button>';
	        $posts .= '</div>';
	        $posts .= '</div>';
	        $posts .= '</fieldset>';
	        $posts .= '</form>';
	        echo $posts;			
		}
		catch(Exception $e){
			echo '<h3>Deu erro</h3>';
		}
    }

?>
