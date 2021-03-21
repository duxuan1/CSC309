<?php
	if(!isset($_SESSION['user'])) {
		$_SESSION['user'] = "";
	}

	if (!isset($_SESSION["user_activities"])) {
		$_SESSION["user_activities"]=new user_activities();
	}

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

	if(!isset($_SESSION['profile'])){
		$_SESSION['profile']=new profile();
	}
?>
