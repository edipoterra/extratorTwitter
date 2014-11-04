<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    error_reporting(E_ALL|E_STRICT);
    ini_set('display_errors', 1);


    if (!empty($_GET['function'])){
        switch($_GET['function']){
            case 'insert':
                insert($_POST['termo']);
                break;
            case 'get':
                get();
                break;
            case 'delete':
                delete($_GET['termo']);
                break;
        }
    }

    function insert($termo){

        //conecta com o banco mongodb
        $mongo = new MongoClient('mongodb://edipo:edipo@localhost:27017');

        $mongo->selectDB( 'twitterdb' )->selectCollection( 'termo' )->insert( array( 'termos' => $termo ));   

        header("Location: ../view/viewTermos.php");
    }

    function get(){
        $mongo = new MongoClient();
        $db = $mongo->twitterdb;
        $collection = $db->createCollection("termo");
        $dados = $collection->find();

        $posts = '<table class="table">';
        $posts .= '<thead>';
        $posts .= '<th>Termos</th>';
        $posts .= '<th>Excluir</th>';
        $posts .= '</thead>';
        $posts .= '<tbody>';
        foreach ($dados as $document){
            $posts .= '<tr>';
            $posts .= "<td>" . $document['termos'] . "</td>";
            $posts .= "<td>" . "<a href='../controller/contTermos.php?function=delete&termo=" . $document['termos'] . "'>excluir</a>" . "</td>";
            $posts .= '</tr>';
        }
        $posts .= '</tbody>';
        $posts .= '<table/>';
        echo $posts;
    }

    function delete($termo){
        $mongo = new MongoClient();
        $db = $mongo->twitterdb;
        $collection = $db->termo;
        $collection->remove(array('termos' => $termo));

        header("Location: ../view/viewTermos.php");
    }
?>
