<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    //error_reporting(E_ALL|E_STRICT);
    //ini_set('display_errors', 1);


    if (!empty($_GET['function'])){
        switch($_GET['function']){
            case 'insert':
                insert($_POST['data'], $_POST['desc']);
                break;
            case 'get':
                get();
                break;
            case 'delete':
                delete($_GET['data']);
                break;
        }
    }

    function insert($data, $desc){

        //conecta com o banco mongodb
		try{
	        $mongo = new MongoClient('mongodb://edipo:edipo@localhost:27017');

	        $mongo->selectDB( 'twitterdb' )->selectCollection( 'data' )->insert( array( 'data' => $data , 'desc' => $desc));   
			
		}
		catch(Exception $e){
			echo '<h3>Opa deu erro!</h3>';
		}
        header("Location: ../view/viewDatasCom.php");
    }

    function get(){
		try{
	        $mongo = new MongoClient();
	        $db = $mongo->twitterdb;
	        $collection = $db->createCollection("data");
	        $dados = $collection->find();

	        $posts = '<table class="zebra-striped">';
	        $posts .= '<thead>';
	        $posts .= '<th>Data</th>';
			$posts .= '<th>Descrição</th>';
	        $posts .= '<th>Excluir</th>';
	        $posts .= '</thead>';
	        $posts .= '<tbody>';
	        foreach ($dados as $document){
	            $posts .= '<tr>';
	            $posts .= "<td>" . $document['data'] . "</td>";
				$posts .= "<td>" . $document['desc'] . "</td>";
	            $posts .= "<td>" . "<a href='../controller/contDatasCom.php?function=delete&data=" . $document['data'] . "'>excluir</a>" . "</td>";
	            $posts .= '</tr>';
	        }
	        $posts .= '</tbody>';
	        $posts .= '<table/>';
	        echo $posts;						
		}
		catch(Exception $e){
			echo '<h3>Opa deu erro!!!</h3>';
		}
    }

    function delete($data){
		try{
	        $mongo = new MongoClient();
	        $db = $mongo->twitterdb;
	        $collection = $db->data;
	        $collection->remove(array('data' => $data));

	        header("Location: ../view/viewDatasCom.php");			
		}
		catch(Exception $e){
			echo '<h3>Opa deu erro!!!</h3>';
		}
    }
?>
