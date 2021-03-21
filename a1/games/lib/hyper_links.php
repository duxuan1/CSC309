<?php
    // change link when receive get request
    $state = $_SESSION['link']->change_link();
    if ($state != "") {
        $_SESSION['state']=$state;
        $view=$state . ".php";
    }
?>
