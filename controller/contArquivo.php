<?php
    header("Content-Type: text/html; charset=ISO-8859-1", true);

    error_reporting(E_ALL|E_STRICT);
    ini_set('display_errors', 1);

    if (!empty($_GET['function'])){
        switch($_GET['function']){
        case 'export':
            export();
            break;
        }
    }

    function export(){
      try{
	        $mongo = new MongoClient('mongodb://edipo:edipo@localhost:27017');

	        $db = $mongo->twitterdb;
	        $collection = $db->createCollection("mensagem");
	        $dados = $collection->find();
	        $isEmpty = true;

			    $tempo = time();

			$fp = fopen("../assets/files/analise_" . $tempo . ".csv","w");

			$cabecalho  = "Dia_Semana,Periodo,Ocorrencia,automovel,bicicleta,caminhao,caminhonete,moto,onibus,pedestre";

	        $termos = $db->createCollection("termo");
	        $dadosTermos = $termos->find();

			fputs($fp, $cabecalho . "\n");

	        foreach ($dados as $document){
				$datahora = strtotime($document['datahora']);
				$diaSemana = date('N', $datahora) + 1;
				if ($diaSemana > 7){
					$diaSemana = 1;
				}
				$dia = verificarDiaSemana($diaSemana);
				$faixaHorario = verificarHorario($datahora);
				$eFeriado = verificarFeriado(date("d-m-Y",$datahora));
				$ocorrencia = verificarOcorrencia($document['texto']);

				$veiculo = verificarVeiculo($document['texto']);

				//$datahora = date('d/m/Y H:i:s', $datahora);

				//	@attribute weekday {dom,seg,ter,qua,qui,sex,sab}
				//	@attribute day-range {3-6,6-8,8-11,11-14,14-17,17-19,19-21,21-23,23-3}
				//	@attribute ocorrency {acidente,atropelamento,bloqueio,engarrafamento,engavetamento}
				//	@attribute feriado 	{sim,nao}
				//	@attribute carro {sim,nao}
				//	@attribute bicicleta {sim,nao}
				//	@attribute caminhao {sim,nao}
				//	@attribute moto {sim,nao}
				//	@attribute caminhonete{sim,nao}
				//	@attribute onibus {sim,nao}
				//	@attribute pedestre {sim,nao}

				fputs($fp, $dia 					. "," . 	// dia da semana
						   $faixaHorario            . "," .    	// faixa horario
						   $ocorrencia              . "," .     // tipo de ocorrencia
						   //$eFeriado 	            . "," .     // � feriado
						   $veiculo 	            .     		// tipo de ve�culo
						   		// carro
								// bicicleta
								// caminhao
								// moto
								// caminhonete
								// onibus
								// pedestre
						   "\n");
	        }

			fclose($fp);
			echo "<center><h3>Arquivo gerado</h3></center>";

			echo "<Center><a href='../assets/files/analise_" . $tempo . ".csv'>Baixar Arquivo</a></center>";
		}
		catch(Exception $e){
			echo '<h3>N�o foi possivel conectar no banco de dados.</h3>';
		}

    }

	function verificarFeriado($dataHora){

		try{
			$mongo = new MongoClient('mongodb://edipo:edipo@localhost:27017');

	        $db = $mongo->twitterdb;
	        $collection = $db->createCollection("data");
	        $dados = $collection->find();

	        foreach ($dados as $document){
				$data = date("d-m-Y", strtotime(str_replace("/", "-", $document["data"])));
				$diaSem = date("N", strtotime(str_replace("/", "-", $document["data"])));

				// Inicializa a data inicial e final
				$dataIni = $data;
				$dataFim = $data;

				// semana comeca na segunda, quarta � dia 3. A semana comeca no dia 1
				if ($diaSem < 3){ // Feriado no inicio da semana, considera feriadao do dia do feriado at� dia 1
					$qtdeDias = $diaSem + 1;

					$d = new Datetime($data);
					$d->modify("-" . $qtdeDias . " days");
					$dataIni = date("d-m-Y", strtotime($d->format('d-m-Y')));
				}
				else {
					if ($diaSem > 3){ // Feriado no Fim da semana, condidera feriado do dia 7 at� o dia do feriado
						$qtdeDias = 7 - $diaSem;

						$d = new Datetime($data);
						$d->modify("+" . $qtdeDias . " days");
						$dataFim = date("d-m-Y", strtotime($d->format("d-m-Y")));
					}
				}

				if (strtotime($dataHora) >= strtotime($dataIni) && strtotime($dataHora) <= strtotime($dataFim)){
					return "sim";
				}
	        }
			return "nao";
		}
		catch(Exception $e){
			echo '<h3>N�o foi possivel conectar no banco de dados.</h3>';
			return "nao";
		}

	}

	function verificarVeiculo($texto){
		$texto = strtolower($texto);
		$veiculo = "";

		/* Verifica se algum autom�vel se envolveu */
		if (auxiliarTestes($texto, "automovel")
			|| auxiliarTestes($texto,"carro")
			|| auxiliarTestes($texto, "automoveis")
			|| auxiliarTestes($texto, "taxi")
			|| auxiliarTestes($texto, "motorista")
			|| auxiliarTestes($texto, "veiculo")){
			$veiculo .= "sim,";
		}
		else{
			$veiculo .= "?,";
		}

		/* Verifica se alguma bicicleta est� envolvida */
		if (auxiliarTestes($texto, "bicicleta")
		    || auxiliarTestes($texto, "bicicletista")
		    || auxiliarTestes($texto, "ciclista")
		    || auxiliarTestes($texto, "bicicleteiro")){
			$veiculo .= "sim,";
		}
		else {
			$veiculo .= "?,";
		}

		/* Verifica se algum caminh�o est� envolvido */
		if (auxiliarTestes($texto, "caminhao")
		    || auxiliarTestes($texto, "caminhoes")
			|| auxiliarTestes($texto,"carreta")
			|| auxiliarTestes($texto, "bitrem")
			|| auxiliarTestes($texto, "bitrens")
			|| auxiliarTestes($texto, "caminhoneiro")
			|| auxiliarTestes($texto, "carreteiro")){
			$veiculo .= "sim,";
		}
		else {
			$veiculo .= "?,";
		}

		/* Verifica se alguma caminhonete est� envolvida */
		if (auxiliarTestes($texto, "caminhonete")
			|| auxiliarTestes($texto, "camionete")
			|| auxiliarTestes($texto, "camioneta")
			|| auxiliarTestes($texto, "picape")
			|| auxiliarTestes($texto, "SUV")
			|| auxiliarTestes($texto, "pick up")
			|| auxiliarTestes($texto, "jipe")){
			$veiculo .= "sim,";
		}
		else {
			$veiculo .= "?,";
		}

		/* Verifica se alguma moto est� envolvida */
		if (auxiliarTestes($texto, "moto")
			|| auxiliarTestes($texto, "motocicleta")
			|| auxiliarTestes($texto, "motoca")
			|| auxiliarTestes($texto, "motociclista")
			|| auxiliarTestes($texto, "motoqueiro")){
			$veiculo .= "sim,";
		}
		else {
			$veiculo .= "?,";
		}

		/* Verifica se algum onibus est� envolvido */
		if (auxiliarTestes($texto, "onibus")
			|| auxiliarTestes($texto, "van")
			|| auxiliarTestes($texto, "microonibus")
			|| auxiliarTestes($texto, "besta")
			|| auxiliarTestes($texto, "furgao")   ){
			$veiculo .= "sim,";
		}
		else {
			$veiculo .= "?,";
		}

		/* Verifica se algum pedestre est� envolvido */
		if (auxiliarTestes($texto, "atropelamento") || auxiliarTestes($texto, "pedestre")){
			$veiculo .= "sim";
		}
		else {
			$veiculo .= "?";
		}

		return $veiculo;
	}

	function verificarOcorrencia($texto){
		$texto = strtolower($texto);

		try{
			$mongo = new MongoClient('mongodb://edipo:edipo@localhost:27017');

	        $db = $mongo->twitterdb;
	        $collection = $db->createCollection("termo");
	        $dados = $collection->find();
			$temOcorrencia = false;
			$ocorrencia = "";

	        foreach ($dados as $document){
				if (auxiliarTestes($texto, $document['termos'])){
					return $document['termos'];
				}
	        }

			// Verificar aqui se todos os anteriores estiverem zerados, colocar 1, senao colocar 0

			return "Nenhum";
		}
		catch(Exception $e){
			echo '<h3>N�o foi possivel conectar no banco de dados.</h3>';
			return "Nenhum";
		}
	}

	function auxiliarTestes($texto, $termo){
		$posicao = strpos($texto, $termo);
		$posicao++;

		return $posicao;
	}

	function verificarHorario($datahora){
			$hora = date('d/m/Y H:i', $datahora);
			$horaDec = (float) str_replace(":", ".", substr($hora, 11, 5));

			if ($horaDec >= 3 && $horaDec < 6){
				return "3-6";
			}

			if ($horaDec >= 6 && $horaDec < 8){
				return "6-8";
			}

			if ($horaDec >= 8 && $horaDec < 11){
				return "8-11";
			}

			if ($horaDec >= 11 && $horaDec < 14){
				return "11-14";
			}

			if ($horaDec >= 14 && $horaDec < 17){
				return "14-17";
			}

			if ($horaDec >= 17 && $horaDec < 19){
				return "17-19";
			}

			if ($horaDec >= 19 && $horaDec < 21){
				return "19-21";
			}

			if ($horaDec >= 21 && $horaDec < 23){
				return "21-23";
			}

			if ($horaDec >= 23 || $horaDec < 3){
				return "23-3";
			}

			return "";
	}

	function verificarDiaSemana($diaSemana){
		$diasSemana = "";

		switch ($diaSemana) {
			case 1:
				return "dom";
				break;

			case 2:
				return "seg";
				break;

			case 3:
				return "ter";
				break;

			case 4:
				return "qua";
				break;

			case 5:
				return "qui";
				break;

			case 6:
				return "sex";
				break;

			case 7:
				return "sab";
				break;
		}

		return "?";
	}

?>
