<?php

class LinkControl {
    public $state = "";

	public function change_link() {
        if (!empty($_GET["state"])) {
            if ($_GET["state"] == "stats") {
                $this->state = "stats";
            } else if ($_GET["state"] == "play_guess") {
                $this->state = "play_guess";
            } else if ($_GET["state"] == "play_rps") {
                $this->state = "play_rps";
            } else if ($_GET["state"] == "play_frogs") {
                $this->state = "play_frogs";
            } else if ($_GET["state"] == "profile") {
                $this->state = "profile";
            } else if ($_GET["state"] == "login") {
                $this->state = "login";
            } else if ($_GET["state"] == "register") {
                $this->state = "register";
            }
        }
        return $this->state;
    }
}
?>
