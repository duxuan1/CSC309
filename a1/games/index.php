<?php
ini_set('display_errors', 'On');

// import all required files
include("lib/imports.php");
session_save_path("sess");
session_start(); 
$dbconn = db_connect();
$errors=array();
$view="";

/* controller code */
/* local actions, these are state transforms */
// init all required models
include("lib/init_models.php");
// write to members.txt
$_SESSION['user_activities']->write_to_member($dbconn);

switch($_SESSION['state']){

	case "login":
		// the view we display by default
		$view="login.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// check if submit or not
		if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="login"){
			break;
		}
		// validate and set errors
		if(empty($_REQUEST['user']))$errors[]='user is required';
		if(empty($_REQUEST['password']))$errors[]='password is required';
		if(!empty($errors))break;
		if(!$dbconn){
			$errors[]="Can't connect to db";
			break;
		}
		// login
		if ($_SESSION['user_activities']->login($dbconn)) {
			$_SESSION['user']=$_REQUEST['user'];
			$_SESSION['state']='stats';
			$view="stats.php";
		} else {
			$errors[]="invalid login";
		}
		break;
	
	case "register":
		// the view we display by default
		$view = "register.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// check if submit or not
		if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="register"){
			break;
		}
		// validate and set errors
		if(empty($_REQUEST['user']))$errors[]='user is required';
		if(empty($_REQUEST['password']))$errors[]='password is required';
		if(!isset($_POST['gender'])) $errors[]='gender is required';
		if(!isset($_POST["validation"])) $errors[]='checkbox not confirmed';
		if(!empty($errors))break;
		if(!$dbconn){
			$errors[]="Can't connect to db";
			break;
		}
		// user registeration 
		if ($_SESSION['user_activities']->register($dbconn)) {
			$errors[]="You are successful registed to games!";
		} else {
			$errors[]="This userid has been taken";
		}
		break;

	case "play_guess":
		// the view we display by default
		$view="play_guess.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// check if submit or not
		if(empty($_REQUEST['submit'])||$_REQUEST['submit']!="guess"){
			break;
		}
		// validate and set errors
		if(!is_numeric($_REQUEST["guess"]))$errors[]="Guess must be numeric.";
		if(!empty($errors))break;
		// perform operation, switching state and view if necessary
		$_SESSION["GuessGame"]->makeGuess($_REQUEST['guess'], $dbconn);
		if($_SESSION["GuessGame"]->getState()=="correct"){
			$_SESSION['state']="won_guess";
			$view="won_guess.php";
		}
		$_REQUEST['guess']="";
		break;

	case "won_guess":
		// the view we display by default
		$view="play_guess.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// check if submit or not
		if(empty($_REQUEST['submit'])||$_REQUEST['submit']!="start again"){
			$errors[]="Invalid request";
			$view="won_guess.php";
			break;
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
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		if(!empty($errors))break;
		// handle different input button
		if (isset($_POST["End"]) || 
			$_SESSION["rockPaperScissors"]->rps_button_handler($dbconn)){
			$_SESSION["state"]="won_rps";
			$view="won_rps.php";
		}
		break;

	case "won_rps": 
		// the view we display by default
		$view="won_rps.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
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
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// play controller
		if ($_SESSION['frogs']->frogs_button_handler($dbconn)){
			$_SESSION['state']="won_frogs";
			$view="won_frogs.php";
		}
		break;
	
	case "won_frogs":
		// the view we display by default
		$view="won_frogs.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// check if submit or not
		if(empty($_REQUEST['submit'])||$_REQUEST['submit']!="start again"){
			$errors[]="Invalid request";
			$view="won_frogs.php";
		}
		// validate and set errors
		if(!empty($errors))break;
		// perform operation, switching state and view if necessary
		$_SESSION["frogs"]=new frogs();
		$_SESSION['state']="play_frogs";
		$view="play_frogs.php";
		break;

	case "profile": 
		// the view we display by default
		$view="profile.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		// check if submit or not
		if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="refill"){
			break;
		}
		// validate and set errors
		if(empty($_REQUEST['password'])) $errors[]='password is required';
		if(!isset($_POST['gender'])) $errors[]='gender is required';
		if(!isset($_POST["validation"])) $errors[]='checkbox not confirmed';
		if(!empty($errors))break;
		// perform operation, switching state and view if necessary
		if(!$dbconn){
			$errors[]="Can't connect to db";
			break;
		}
		if ($_SESSION['user_activities']->refill($dbconn)){
			$errors[]="You have sucesfully changed your information";
		} else {
			$errors[]="user not exist";
		}
		break;

	case "stats": 
		// the view we display by default
		$view="stats.php";
		// hyper link handler -> change states when receive href request
		include("lib/hyper_links.php");
		break;
}
require_once "view/$view";
?>
