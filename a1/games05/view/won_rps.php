<!DOCTYPE html>
<html lang="en">
	<head>
        <title>Games</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<link rel="stylesheet" type="text/css" href="./old/style.css" />
	</head>
	<body>
        <header>
			<?php include("./nav/nav.php"); ?>
		</header>
        <main>

            <section>
                <h1>Welcome to Rock Paper Scissor</h1>
                <form method="post">
                    <input type="submit" name="submit" value="start again" />
                </form>
                <h3>Game Statistics</h3>
                <?php 
                    $tie = $_SESSION['rockPaperScissors']->tie;
                    $computer_win = $_SESSION['rockPaperScissors']->computer_win;
                    $player_win = $_SESSION['rockPaperScissors']->player_win;
                    echo("<br/> player_win : $player_win");
                    echo("<br/> computer_win: $computer_win");
                    echo("<br/> tie: $tie");
                    echo("<br/>");
                    echo("<br/> Game History:");
                    foreach($_SESSION['rockPaperScissors']->history as $key=>$value){
                        echo("<br/> $value");
                    }
                ?>
            </section>

            <?php echo(view_errors($errors)); ?>
		</main>
		<footer>
			A project by Xuan
		</footer>
	</body>
</html>
