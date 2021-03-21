<?php

class rockPaperScissors {
	public $secretNumber = 1;
	public $history = array();
	public $state = "Not won yet";
	public $player_win = 0;
	public $computer_win = 0;
	public $tie = 0;
	public $last_turn = "";

	public function getState() {return $this->state;}
	public function get_player_win() {return $this->player_win;}
	public function get_computer_win() {return $this->computer_win;}
	public function get_tie() {return $this->tie;}

	public function rps_button_handler($dbconn) {
		if (isset($_POST["rock"])){
			return $this->rock($dbconn);
		} else if (isset($_POST["paper"])){
			return $this->paper($dbconn);
		} else if (isset($_POST["scissor"])){
			return $this->scissor($dbconn);
		}
		return 0;
	}
	
	public function rock($dbconn){
		$this->secretNumber = rand(1,3);
		if ($this->secretNumber == 1) {
			$this->history[] = "you: rock vs rock :computer, tie";
			$this->tie++;
		} else if ($this->secretNumber == 2) {
			$this->history[] = "you: rock vs paper :computer, you lose";
			$this->computer_win++;
		} else {
			$this->history[] = "you: rock vs scissor :computer, you win";
			$this->player_win++;
		}
		if ($this->won($dbconn)) {
			return 1;
		}
		return 0;
	}

	public function paper($dbconn){
		$this->secretNumber = rand(1,3);
		if ($this->secretNumber == 1) {
			$this->history[] = "you: paper vs rock :computer, you win";
			$this->player_win++;
		} else if ($this->secretNumber == 2) {
			$this->history[] = "you: paper vs paper :computer, tie";
			$this->tie++;
		} else {
			$this->history[] = "you: paper vs scissor :computer, you lose";
			$this->computer_win++;
		}
		if ($this->won($dbconn)) {
			return 1;
		}
		return 0;
	}

	public function scissor($dbconn) {
		$this->secretNumber = rand(1,3);
		if ($this->secretNumber == 1) {
			$this->history[] = "you: scissor vs rock :computer, you lose";
			$this->computer_win++;
		} else if ($this->secretNumber == 2) {
			$this->history[] = "you: scissor vs paper :computer, you win";
			$this->player_win++;
		} else {
			$this->history[] = "you: scissor vs scissor :computer, tie";
			$this->tie++;
		}
		if ($this->won($dbconn)) {
			return 1;
		}
		return 0;
	}

	public function end() {
		$this->state = "end";
	}

	public function won($dbconn) {
		if ($this->player_win == 10) {
			$this->state = "You won!";
			$solved = $_SESSION["profile"]->get_rpssolved() + 1;
			$query = "UPDATE appuser SET rpssolved=$1 WHERE userid=$2";
			$result = pg_prepare($dbconn, "", $query);
			$result = pg_execute($dbconn, "", array($solved, $_SESSION['user']));	
			$_SESSION["profile"]->rpssolved++;
			return 1;
		}
		return 0;
	}
}
?>
