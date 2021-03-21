<?php

class GuessGame {
	public $secretNumber = 5;
	public $numGuesses = 0;
	public $history = array();
	public $state = "";
	public $correct_guess = 0;

	public function __construct() {
        	$this->secretNumber = rand(1,10);
    	}
	
	public function makeGuess($guess, $dbconn){
		$this->numGuesses++;
		if($guess>$this->secretNumber){
			$this->state="too high";
		} else if($guess<$this->secretNumber){
			$this->state="too low";
		} else {
			$this->state="correct";
			$this->correct_guess++;
			
			$solved = $_SESSION["profile"]->get_guesssolved() + 1;
			$query = "UPDATE appuser SET guesssolved=$1 WHERE userid=$2";
			$result = pg_prepare($dbconn, "", $query);
			$result = pg_execute($dbconn, "", array($solved, $_SESSION['user']));	
			$errors[]="You have sucesfully changed your information";

			$_SESSION["profile"]->guesssolved++;
		}
		$this->history[] = "Guess #$this->numGuesses was $guess and was $this->state.";
	}

	public function getState(){
		return $this->state;
	}

	public function getGuess() {
		return $this->correct_guess;
	}
}
?>
