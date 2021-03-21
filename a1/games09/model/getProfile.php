<?php

class profile {
	public $userid;
    public $password;
    public $email;
    public $gender;
    public $favourite;

    public function get_userid() {
        return $this->userid;
    }

    public function get_password() {
        return $this->userid;
    }
    public function get_email() {
        return $this->email;
    }
    public function get_gender() {
        return $this->gender;
    }
    public function get_favourite() {
        return $this->favourite;
    }
    public function get_profile($dbconn) {
        $query="SELECT userid, password, email, gender, 
            favourite FROM appuser WHERE userid = '" . $_SESSION['user'] . "';";
        $result = pg_query($dbconn, $query);
        $row = pg_fetch_row($result);

        $this->userid = $row[0];
        $this->email = $row[2];
        $this->gender = $row[3];
        $this->favourite = $row[4];
    }

}
?>
