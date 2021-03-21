<?php

class frogs {
    public $map = array(1, 1, 1, 0, -1, -1, -1);
    public $message = "";
    public $move = 0;
    public $state = "";

    public function get_map() {return $this->map;}
    public function get_message() {return $this->message;}
    public function get_move() {return $this->move;}
    public function getState() {return $this->state;}

    public function get_image($i) {
        if ($this->map[$i] == 1) { 
            return "images/yellowFrog.gif";
        } else if ($this->map[$i] == 0) {
            return "images/empty.gif";
        } else if ($this->map[$i] == -1) {;
            return "images/greenFrog.gif";
        } 
    }

    public function win_condition($dbconn) {
        $win = array(-1, -1, -1, 0, 1, 1, 1);
        if ($this->map == $win) {
            $this->state = "won";

			$solved = $_SESSION["profile"]->get_frogssolved() + 1;
			$query = "UPDATE appuser SET frogssolved=$1 WHERE userid=$2";
			$result = pg_prepare($dbconn, "", $query);
			$result = pg_execute($dbconn, "", array($solved, $_SESSION['user']));	

			$_SESSION["profile"]->frogssolved++;
            return 1;
        }
        return 0;
    }

    public function frogs_button_handler($dbconn) {
		// handle different input button
		if (isset($_POST["reset"])){
			$this->reset();
			return 0;
		}

        if (isset($_POST["0"])){	
			$this->onclick(0, $dbconn);
		} else if (isset($_POST["1"])){	
			$this->onclick(1, $dbconn);
		} else if (isset($_POST["2"])){	
			$this->onclick(2, $dbconn);
		} else if (isset($_POST["3"])){	
			$this->onclick(3, $dbconn);
		} else if (isset($_POST["4"])){	
			$this->onclick(4, $dbconn);
		} else if (isset($_POST["5"])){	
			$this->onclick(5, $dbconn);
		} else if (isset($_POST["6"])){	
			$this->onclick(6, $dbconn);
		}

        if ($this->win_condition($dbconn)) {
            return 1;
        }
        return 0;
    }

    public function reset() {
        $this->map = array(1, 1, 1, 0, -1, -1, -1);
        $this->message = "";
        $this->move = 0;
    }
    
    public function onclick($i, $dbconn) {
        $this->message = "";
        $this->move++;

        if ($this->map[$i] == 1) {
            $j = $i + 1;
            $k = $i + 2;
            if ($j < 7) {
                if ($this->map[$j] == 0) {
                    $this->map[$i] = 0;
                    $this->map[$j] = 1;
                } else if ($k < 7 && $this->map[$j] == -1 && $this->map[$k] == 0) {
                    $this->map[$i] = 0;
                    $this->map[$k] = 1;
                } else {
                    $this->message = "You Move is invalid!";
                }
            } else {
                $this->message = "You Move is invalid!";
            }
        } else if ($this->map[$i] == -1) {
            $j = $i - 1;
            $k = $i - 2;
            if ($j >= 0) {
                if ($this->map[$j] == 0) {
                    $this->map[$i] = 0;
                    $this->map[$j] = -1;
                } else if ($k >= 0 && $this->map[$j] == 1 && $this->map[$k] == 0) {
                    $this->map[$i] = 0;
                    $this->map[$k] = -1;
                } else {
                    $this->message = "You Move is invalid!";
                }
            } else {
                $this->message = "You Move is invalid!";
            }
        } else {
            $this->message = "You Move is invalid!";
        }

        if ($this->win_condition($dbconn)) {
            return 1;
        }
        return 0;
    }
}
?>
