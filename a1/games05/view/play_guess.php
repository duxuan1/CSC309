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
				<h1>Welcome to GuessGame</h1>
				<?php if($_SESSION["GuessGame"]->getState()!="correct"){ ?>
					<form method="post">
						<input type="text" name="guess" value="<?php echo($_REQUEST['guess']); ?>" /> <input type="submit" name="submit" value="guess" />
					</form>  
				<?php } ?>
				
				<?php echo(view_errors($errors)); ?> 

				<?php 
					foreach($_SESSION['GuessGame']->history as $key=>$value){
						echo("<br/> $value");
					}
					if($_SESSION["GuessGame"]->getState()=="correct"){ 
				?>
					<form method="post">
						<input type="text" name="guess" value="<?php echo($_REQUEST['guess']); ?>" /> <input type="submit" name="submit" value="guess" />
					</form>
				<?php 
					} 
				?>
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

