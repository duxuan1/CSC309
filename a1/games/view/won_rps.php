<!DOCTYPE html>
<html lang="en">
	<head>
        <title>Games</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<link rel="stylesheet" type="text/css" href="./view/style.css" />
	</head>
	<body>
        <header>
            <?php include("lib/nav.php"); ?>
		</header>
        <main>
            <section>
                <h1>Welcome to Rock Paper Scissor</h1>
                <form method="post">
                    <input type="submit" name="submit" value="start again" />
                </form>
                <h3>Game finished!</h3>
                <p><?php echo("computer beaten: " . $_SESSION['profile']->get_rpssolved())?></p>
                <p><?php echo("player_win : " . $_SESSION['rockPaperScissors']->get_player_win())?></p>
                <p><?php echo("computer_win: " . $_SESSION['rockPaperScissors']->get_computer_win())?></p>
                <p><?php echo("tie: " . $_SESSION['rockPaperScissors']->get_tie())?></p>
                <p>Game History:</p>
                <?php 
                foreach($_SESSION['rockPaperScissors']->history as $key=>$value) {
                    echo("<br/> $value");
                }
                ?>
            </section>

            <?php echo(view_errors($errors)); ?>
            
			<section class='stats'>
				<h1>Stats</h1>
				<?php $_SESSION["profile"]->get_profile($dbconn); ?>
				<tr><th><p><?php echo "your userid = " . $_SESSION["profile"]->get_userid(); ?></p>
				<tr><th><p><?php echo "Number of guess game solved = " . $_SESSION["profile"]->get_guesssolved(); ?></p>
				<tr><th><p><?php echo "Number of rock paper scissors solved = " . $_SESSION["profile"]->get_rpssolved(); ?></p>
				<tr><th><p><?php echo "Number of frogs game solved = " . $_SESSION["profile"]->get_frogssolved(); ?></p>
			</section>
            
		</main>
		<footer>
			A project by Xuan
		</footer>
	</body>
</html>
