<?php

class frogs {
    public $map = array(1, 1, 1, 0, -1, -1, -1);

    public $message = "";

    public $move = 0;

    public function get_map() {
        return $this->map;
    }

    public function get_message() {
        return $this->message;
    }

    public function get_move() {
        return $this->move;
    }

    public function get_image($i) {
        if ($this->map[$i] == 1) { 
            return "images/yellowFrog.gif";
        } else if ($this->map[$i] == 0) {
            return "images/empty.gif";
        } else if ($this->map[$i] == -1) {;
            return "images/greenFrog.gif";
        } 
    }

    public function win_condition() {
        $win = array(-1, -1, -1, 0, 1, 1, 1);
        if ($this->map == $win) {
            return 1;
        }
        return 0;
    }

    public function reset() {
        $this->map = array(1, 1, 1, 0, -1, -1, -1);
        $this->message = "";
        $this->move = 0;
    }
    public function onclick($i) {
        $this->message = "";
        $this->move++;
        if ($this->map[$i] == 1) {
            $j = $i + 1;
            $k = $i + 2;
            if ($j < 7) {
                if ($this->map[$j] == 0) {
                    $this->map[$i] = 0;
                    $this->map[$j] = 1;
                } else if ($this->map[$j] == -1 && $this->map[$k] == 0) {
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
                } else if ($this->map[$j] == 1 && $this->map[$k] == 0) {
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

        if ($this->win_condition() == 1) {
            $this->message = "You Won! You can restart the game below";
        }
    }
}
?>
