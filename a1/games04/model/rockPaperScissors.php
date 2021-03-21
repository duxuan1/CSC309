<?php

class rockPaperScissors {
	public $secretNumber = 1;
	public $history = array();
	public $state = "";
	public $player_win = 0;
	public $computer_win = 0;
	public $tie = 0;
	public $num_played = 0;
	public $last_turn = "";

	public function __construct() {
        	$this->secretNumber = rand(1,3);
    	}

	public function getState(){
		return $this->state;
	}

	public function rock(){
		$this->num_played++;
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
	}

	public function paper(){
		$this->num_played++;
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
	}

	public function scissor() {
		$this->num_played++;
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
	}

	public function end() {
		$this->state = "end";
	}
}
?>
