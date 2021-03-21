<?php
$map = $_SESSION['frogs']->get_map();
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<link rel="stylesheet" type="text/css" href="./style/style.css" />
		<title>Games</title>
	</head>
	<body>
		<header>
            <?php include("./nav/nav.php"); ?>
		</header>
		<main>
			<section>
				<h1>Frogs Puzzle</h1>
				<form method="post">
				<button type="image" name="0"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(0) ?>></img></button><br>
				<button type="image" name="1"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(1) ?>></img></button><br>
				<button type="image" name="2"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(2) ?>></img></button><br>
				<button type="image" name="3"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(3) ?>></img></button><br>
				<button type="image" name="4"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(4) ?>></img></button><br>
				<button type="image" name="5"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(5) ?>></img></button><br>
				<button type="image" name="6"><img width="50" height="50" src=<?php echo $_SESSION['frogs']->get_image(6) ?>></img></button><br>
				<input type="submit" name="reset" value="reset" />
				</form>
				<?php 
					echo $_SESSION['frogs']->get_message();
				?>
			</section>

			<section class='stats'>
				<h1>Stats</h1>
				<?php 
					echo "Moves you made: " . $_SESSION['frogs']->get_move();
				?>
			</section>
		</main>
		<footer>
			A project by ME
		</footer>
	</body>
</html>
