<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    //ini_set('display_errors', 1);

    if (!empty($_GET['function'])){
        switch($_GET['function']){
        case 'insert':
            $latitude_inicial   = $_POST['latitude_inicial'];
            $longitude_inicial  = $_POST['longitude_inicial'];
            $latitude_final     = $_POST['latitude_final'];
            $longitude_final    = $_POST['longitude_final'];

            insert($latitude_inicial, $longitude_inicial, $latitude_final, $longitude_final);
            break;
        case 'get':
            get();
            break;
        case 'delete':
            delete($_POST);
            break;
        }
    }

    function insert($latitude_inicial, $longitude_inicial, $latitude_final, $longitude_final){
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

                $mongo->selectDB('twitterdb')->selectCollection('coordenada')->insert(array('latitude_inicial' => $latitude_inicial, 'longitude_inicial' => $longitude_inicial, 'latitude_final' => $latitude_final, 'longitude_final' => $longitude_final));
	        }
		}
		catch(Exception $e){
			//Dar mensagem de erro?
            echo "Algum erro ocorreu com o Banco de Dados. Tente novamente mais tarde.<br />";
		}
        header("Location: ../view/viewCoordenadas.php");
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

	        $latitude_inicial = "";
	        $longitude_inicial = "";
            $latitude_final = "";
	        $longitude_final = "";
	        $disabled = "";

	        foreach ($dados as $document){
	            $latitude_inicial = $document['latitude_inicial'];
	            $longitude_inicial = $document['longitude_inicial'];
                $latitude_final = $document['latitude_final'];
                $longitude_final = $document['latitude_final'];
	            $disabled = "disabled";
	        }

	        $posts = '<form class="modal-form form-horizontal" id="termosBusca" method="post" action="../controller/contCoordenadas.php?function=insert">';
	        $posts .= '<fieldset>';
	        $posts .= '<div class="modal-body">';
	        $posts .= '<div id="aboutText">';
	        $posts .= '<h3>Latitude Inicial:</h3>';
	        $posts .= '<input type="text" name="latitude_inicial" value="' . $latitude_inicial . '" ' . $disabled . '/>';
	        $posts .= '<br/><br/>';
	        $posts .= '<h3>Longitude Inicial:</h3>';
	        $posts .= '<input type="text" name="longitude_inicial" value="' . $longitude_inicial . '" ' . $disabled . '/>';
	        $posts .= '<br/><br/><br/>';
            $posts .= '<h3>Latitude Final:</h3>';
	        $posts .= '<input type="text" name="latitude_final" value="' . $latitude_final . '" ' . $disabled . '/>';
	        $posts .= '<br/><br/>';
	        $posts .= '<h3>Longitude Final:</h3>';
	        $posts .= '<input type="text" name="longitude_final" value="' . $longitude_final . '" ' . $disabled . '/>';
	        $posts .= '<br/><br/>';
	        $posts .= '<button class="btn" type="submit" id="post" ' . $disabled . '>Salvar</button>';
	        $posts .= '</div>';
	        $posts .= '</div>';
	        $posts .= '</fieldset>';
	        $posts .= '</form>';
	        echo $posts;
		}
		catch(Exception $e){
			echo '<center><h3>Deu erro</h3></center>';
		}
    }

?>
