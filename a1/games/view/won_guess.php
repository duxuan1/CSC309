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
                <h1>Welcome to GuessGame</h1>
				<h3>Game finished!</h3>
                <?php echo(view_errors($errors)); ?>
                <?php 
                    foreach($_SESSION['GuessGame']->history as $key=>$value){
                        echo("<br/> $value");
                    }
                ?>
                <form method="post">
                    <input type="submit" name="submit" value="start again" />
                </form>
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

