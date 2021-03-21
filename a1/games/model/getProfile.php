<?php

class profile {
	public $userid;
    public $password;
    public $email;
    public $gender;
    public $favourite;
    public $guesssolved;
    public $rpssolved;
    public $frogssolved;

    public function get_userid() {return $this->userid;}
    public function get_password() {return $this->userid;}
    public function get_email() {return $this->email;}
    public function get_gender() {return $this->gender;}
    public function get_favourite() {return $this->favourite;}
    public function get_guesssolved() {return $this->guesssolved;}
    public function get_rpssolved() {return $this->rpssolved;}
    public function get_frogssolved() {return $this->frogssolved;}

    public function get_top_players($dbconn, $query) {
        $result = pg_query($dbconn, $query);    
        $message = "| ";
        $i = 0;
        while ($i < 3 && $row = pg_fetch_row($result)) {
            $message = $message . $row[0] . " (" . $row[1] . " times) | ";
            $i++;
        }
        while ($i < 3) {
            $message = $message . " Waiting for more players | ";
            $i++;
        }
        return $message;
    }

    public function get_profile($dbconn) {
        $query="SELECT * 
            FROM appuser WHERE userid=" . "'" . $_SESSION['user'] . "';" ;
        $result = pg_query($dbconn, $query);
        $row = pg_fetch_row($result);
        $this->userid = $row[0];
        $this->email = $row[2];
        $this->gender = $row[3];
        $this->favourite = $row[4];
        $this->guesssolved= $row[5];
        $this->rpssolved = $row[6];
        $this->frogssolved = $row[7];
    }
}
?>
