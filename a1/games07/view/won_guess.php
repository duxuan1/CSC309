<!DOCTYPE html>
<html lang="en">
	<head>
        <title>Games</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<link rel="stylesheet" type="text/css" href="./style/style.css" />
	</head>
	<body>
		<header>
			<?php include("./nav/nav.php"); ?>
		</header>
        <main>
            <section>
                <h1>Welcome to GuessGame</h1>
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

            <section class='stats'>
                <h1>Stats</h1>
                <?php 
                    echo("correct guess: " . $_SESSION['GuessGame']->correct_guess);
                ?>
            </section>
		</main>
		<footer>
			A project by Xuan
		</footer>
	</body>
</html>

