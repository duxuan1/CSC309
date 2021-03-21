<?php

class user_activities {
	public $userid;

	public function write_to_member($dbconn) {
		$file = fopen("../members.txt", "w") or die("Unable to open file!");
		$query = "SELECT * FROM appuser";
		$result=pg_query($dbconn, $query);
		// Go through all rows returned by the query
		while ($row = pg_fetch_row($result)) {
			$text = $row[0] . " | " .$row[1] . " | " . $row[2] . " | " .  $row[3] . 
			" | " . $row[4] . " | " .  $row[5] . " | " . $row[6] . " | " . $row[7] . "\n";
			fwrite($file, $text);
		}
		fclose($file);
	}
	
    public function login($dbconn) {
		$query = "SELECT * FROM appuser WHERE userid=$1 and password=$2;";
		$result = pg_prepare($dbconn, "", $query);
		$result = pg_execute($dbconn, "", array($_REQUEST['user'], $_REQUEST['password']));
		if($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)){
            return 1;
		} 
        return 0;
    }

    public function register($dbconn) {
		$query = "SELECT * FROM appuser WHERE userid=$1;";
		$result = pg_prepare($dbconn, "", $query);
		$result = pg_execute($dbconn, "", array($_REQUEST['user']));
		// check if userid being used
		if($row = !pg_fetch_array($result, NULL, PGSQL_ASSOC)){
			// insert to database
			$insert_user_query="INSERT INTO appuser 
				(userid, password, email, gender, favourite, guesssolved, 
				rpssolved, frogssolved) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);";
			$result = pg_prepare($dbconn, "", $insert_user_query);
			$result = pg_execute($dbconn, "", array($_REQUEST['user'], 
				$_REQUEST['password'], $_REQUEST["email"], $_POST["gender"], 
				$_POST["favourite"], 0, 0, 0)); 
            return 1;
		}
        return 0;
    }

    public function refill($dbconn) {
        $query = "SELECT * FROM appuser WHERE userid=$1;";
		$result = pg_prepare($dbconn, "", $query);
		$result = pg_execute($dbconn, "", array($_SESSION['user']));
		// check if userid being used
		if($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)){
			$query = "UPDATE appuser SET password=$1, email=$2, gender=$3, 
				favourite=$4 WHERE userid=$5";
			$result = pg_prepare($dbconn, "", $query);
			$result = pg_execute($dbconn, "", array($_REQUEST["password"], 
				$_REQUEST["email"], $_POST["gender"], $_POST["favourite"], 
				$_SESSION['user']));	
                return 1;
		}
        return 0;  
    }
}
?>
