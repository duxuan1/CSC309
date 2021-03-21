<?php
$map = $_SESSION['frogs']->get_map();
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<link rel="stylesheet" type="text/css" href="./view/style.css" />
		<title>Games</title>
	</head>
	<body>
		<header>
            <?php include("lib/nav.php"); ?>
		</header>
		<main>
			<section>
				<h1>Frogs Puzzle</h1>
				<h3>Win Condition: All yellow frogs at the right/buttom most and all green frogs at the left/top most</h3>
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
				<p><?php echo $_SESSION['frogs']->get_message() ?></p>
				<p><?php echo "Moves you made: " . $_SESSION['frogs']->get_move() ?></p>
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
			A project by ME
		</footer>
	</body>
</html>
