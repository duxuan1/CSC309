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
		<link rel="stylesheet" type="text/css" href="./old/style.css" />
	</head>

	<body>
		<header>
			<?php include("./nav/nav.php"); ?>
		</header>

		<main>
			<section>
				<h1>Welcome to Rock Paper Scissor</h1>
				<h3> Select your choice </h3>

				<?php if($_SESSION["rockPaperScissors"]->getState()!="end"){ ?>
					<form method="post">
						<input type="submit" name="rock" value="rock" />
						<input type="submit" name="paper" value="paper" />
						<input type="submit" name="scissor" value="scissor" />
						<br/>
						<input type="submit" name="End" value="End Game" />
					</form>
				<?php } ?>
			</section>
			
			<section class='stats'>
				<h1>Stats</h1>
				<?php 
					$tie = $_SESSION['rockPaperScissors']->tie;
					$computer_win = $_SESSION['rockPaperScissors']->computer_win;
					$player_win = $_SESSION['rockPaperScissors']->player_win;
					echo("<br/> player_win : $player_win");
					echo("<br/> computer_win: $computer_win");
					echo("<br/> tie: $tie");
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
		</main>
		<footer>
			A project by Xuan
		</footer>
	</body>


</html>

