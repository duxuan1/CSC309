<?php
    $state = $_SESSION["state"];
?>
<nav>
    <ul>
        <?php if ($state == "stats") { ?>
            <li> <a class="selected" href="?state=stats">All Stats</a> </li>
        <?php } else { ?>
            <li> <a href="?state=stats">All Stats</a> </li>
        <?php } ?>

        <?php if ($state == "play_guess" || $state == "won_guess") { ?>
            <li> <a class="selected" href="?state=play_guess">Guess Game</a> </li>
        <?php } else { ?>
            <li> <a href="?state=play_guess">Guess Game</a> </li>
        <?php } ?>

        <?php if ($state == "play_rps" || $state == "won_rps") { ?>
            <li> <a class="selected" href="?state=play_rps">Rock Paper Scissors</a> </li>
        <?php } else { ?>
            <li> <a href="?state=play_rps">Rock Paper Scissors</a> </li>
        <?php } ?>

        <?php if ($state == "play_frogs" || $state == "won_frogs") { ?>
            <li> <a class="selected" href="?state=play_frogs">Frogs</a> </li>
        <?php } else { ?>
            <li> <a href="?state=play_frogs">Frogs</a> </li>
        <?php } ?>

        <?php if ($state == "profile") { ?>
            <li> <a class="selected" href="?state=profile">Profile</a> </li>
        <?php } else { ?>
            <li> <a href="?state=profile">Profile</a> </li>
        <?php } ?>

        <?php if ($state == "login") { ?>
            <li> <a class="selected" href="?state=login">Logout</a> </li>
        <?php } else { ?>
            <li> <a href="?state=login">Logout</a> </li>
        <?php } ?>
    </ul>
</nav>
