<?php
	ini_set('display_errors', 'On');
	require_once "lib/lib.php";
	require_once "model/something.php";
	require_once "model/GuessGame.php";
	require_once "model/rockPaperScissors.php";
	require_once "model/LinkControl.php";
	require_once "model/frogs.php";

	session_save_path("sess");
	session_start(); 

	$dbconn = db_connect();

	$errors=array();
	$view="";

	/* controller code */

	/* local actions, these are state transforms */
	if(!isset($_SESSION['state'])){
		$_SESSION['state']='login';
	}

	if(!isset($_SESSION['link'])){
		$_SESSION['link']=new LinkControl();
	}

	if(!isset($_SESSION['GuessGame'])){
		$_SESSION['GuessGame']=new GuessGame();
	}

	if(!isset($_SESSION['rockPaperScissors'])){
		$_SESSION['rockPaperScissors']=new rockPaperScissors();
	}

	if(!isset($_SESSION['frogs'])){
		$_SESSION['frogs']=new frogs();
	}

	switch($_SESSION['state']){
		case "login":
			// the view we display by default
			$view="login.php";

			// check if submit or not
			if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="login"){
				break;
			}

			// validate and set errors
			if(empty($_REQUEST['user']))$errors[]='user is required';
			if(empty($_REQUEST['password']))$errors[]='password is required';
			if(!empty($errors))break;

			// perform operation, switching state and view if necessary
			if(!$dbconn){
				$errors[]="Can't connect to db";
				break;
			}
			$query = "SELECT * FROM appuser WHERE userid=$1 and password=$2;";
                	$result = pg_prepare($dbconn, "", $query);

                	$result = pg_execute($dbconn, "", array($_REQUEST['user'], $_REQUEST['password']));
                	if($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)){
				$_SESSION['user']=$_REQUEST['user'];

				
				$_SESSION['state']='stats';
				$view="stats.php";
			} else {
				$errors[]="invalid login";
			}
			break;

		case "play_guess":
			// the view we display by default
			$view="play_guess.php";

			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}

			// check if submit or not
			if(empty($_REQUEST['submit'])||$_REQUEST['submit']!="guess"){
				break;
			}

			// validate and set errors
			if(!is_numeric($_REQUEST["guess"]))$errors[]="Guess must be numeric.";
			if(!empty($errors))break;

			// perform operation, switching state and view if necessary
			$_SESSION["GuessGame"]->makeGuess($_REQUEST['guess']);
			if($_SESSION["GuessGame"]->getState()=="correct"){
				$_SESSION['state']="won_guess";
				$view="won_guess.php";
			}
			$_REQUEST['guess']="";

			break;

		case "won_guess":
			// the view we display by default
			$view="play_guess.php";

			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}

			// check if submit or not
			if(empty($_REQUEST['submit'])||$_REQUEST['submit']!="start again"){
				$errors[]="Invalid request";
				$view="won_guess.php";
			}

			// validate and set errors
			if(!empty($errors))break;
 
			// perform operation, switching state and view if necessary
			$_SESSION["GuessGame"]=new GuessGame();
			$_SESSION['state']="play_guess";
			$view="play_guess.php";

			break;

		case "play_rps": 
			// the view we display by default
			$view="play_rps.php";

			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}

			if(!empty($errors))break;

			// handle different input button
			if (isset($_POST["End"])){
				$_SESSION["state"]="won_rps";
				$view="won_rps.php";	
			}

			if (isset($_POST["rock"])){
				$_SESSION["rockPaperScissors"]->rock();
				break;
			}

			if (isset($_POST["paper"])){
				$_SESSION["rockPaperScissors"]->paper();
				break;
			}
			
			if (isset($_POST["scissor"])){
				$_SESSION["rockPaperScissors"]->scissor();
				break;
			}

			break;

		case "won_rps": 
			// the view we display by default
			$view="won_rps.php";

			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}

			// check if submit or not
			if(empty($_REQUEST['submit'])||$_REQUEST['submit']!="start again"){
				$errors[]="Invalid request";
				$view="won_rps.php";
			}

			// validate and set errors
			if(!empty($errors))break;


			// perform operation, switching state and view if necessary
			$_SESSION["rockPaperScissors"]=new rockPaperScissors();
			$_SESSION['state']="play_rps";
			$view="play_rps.php";
			break;

		case "play_frogs": 
			// the view we display by default
			$view="play_frogs.php";
			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}

			// handle different input button
			if (isset($_POST["reset"])){
				$i = $_SESSION['frogs']->reset();
				break;
			}

			if (isset($_POST["0"])){	
				$_SESSION['frogs']->onclick(0);
			} else if (isset($_POST["1"])){	
				$_SESSION['frogs']->onclick(1);
			} else if (isset($_POST["2"])){	
				$_SESSION['frogs']->onclick(2);
			} else if (isset($_POST["3"])){	
				$_SESSION['frogs']->onclick(3);
			} else if (isset($_POST["4"])){	
				$_SESSION['frogs']->onclick(4);
			} else if (isset($_POST["5"])){	
				$_SESSION['frogs']->onclick(5);
			} else if (isset($_POST["6"])){	
				$_SESSION['frogs']->onclick(6);
			}

			break;

		case "won_frogs": 
			// the view we display by default
			$view="won_frogs.php";
			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}
			break;

		case "profile": 
			// the view we display by default
			$view="profile.php";
			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}
			break;

		case "stats": 
			// the view we display by default
			$view="stats.php";
			// change link when receive get request
			$state = $_SESSION['link']->change_link();
			if ($state != "") {
				$_SESSION['state']=$state;
				$view=$state . ".php";
			}
			break;
	}
	require_once "view/$view";
?>
