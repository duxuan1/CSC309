<?php
	// So I don't have to deal with uninitialized $_REQUEST['guess']
	$_REQUEST['guess']=!empty($_REQUEST['guess']) ? $_REQUEST['guess'] : '';
?>
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
				<h3>Win Condition: win computer player by 10 times</h3>

				<?php if($_SESSION["rockPaperScissors"]->getState()!="end"){ ?>
					<form method="post">
						<input type="submit" name="rock" value="rock" />
						<input type="submit" name="paper" value="paper" />
						<input type="submit" name="scissor" value="scissor" />
						<br/>
						<input type="submit" name="End" value="End Game" />
					</form>
				<?php } ?>
				<p><?php echo("computer beaten: " . $_SESSION['profile']->get_rpssolved())?></p>
                <p><?php echo("player_win : " . $_SESSION['rockPaperScissors']->get_player_win())?></p>
                <p><?php echo("computer_win: " . $_SESSION['rockPaperScissors']->get_computer_win())?></p>
                <p><?php echo("tie: " . $_SESSION['rockPaperScissors']->get_tie())?></p>
				<?php 
					$array = $_SESSION['rockPaperScissors']->history;
					$array_len = count($array);
					
					if ($array_len != 0) {
						$last_turn = $array[$array_len - 1];
						echo("<br/> last turn: $last_turn");
					} 

					if($_SESSION["rockPaperScissors"]->getState()=="end"){ 
				?>
						<form method="post">
							<input type="submit" name="submit" value="start again" />
						</form>
				<?php 
					} 
				?>
			</section>
			
			<?php echo(view_errors($errors)); ?> 

			<section class='stats'>
				<h1>Stats</h1>
				<?php $_SESSION["profile"]->get_profile($dbconn); ?>
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

