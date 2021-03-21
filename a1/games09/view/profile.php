<?php
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
			<form action="index.php" method="post">
			<table>

			<tr><th><p><?php echo "your userid = " . $_SESSION["profile"]->get_userid(); ?></p>
			<tr><th><p><?php echo "your email = " . $_SESSION["profile"]->get_email(); ?></p>
			<tr><th><p><?php echo "your gender = " . $_SESSION["profile"]->get_gender(); ?></p>
			<tr><th><p><?php echo "your favourite game= " . $_SESSION["profile"]->get_favourite(); ?></p>
			<tr><th><p> You can refill your information here </p>

			<!-- Trick below to re-fill the user form field -->
			<tr><th><label for="password">Change Password</label></th><td> <input type="password" name="password" /></td></tr>
			<tr><th><label for="email">Change Email</label></th><td> <input type="email" name="email" /></td></tr>
			
			<tr><th><p>Reselect your gender:</p></th></tr>
			<tr><th><label for="male">Male</label><br></th><td><input type="radio" id="male" name="gender" value="male"></td></tr>
			<tr><th><label for="female">Female</label><br></th><td><input type="radio" id="female" name="gender" value="female"></td></tr>
			<tr><th><label for="other">Other</label></th><td><input type="radio" id="other" name="gender" value="other"></td></tr>
			<tr><th><p></p></th></tr>
			
			<tr><th><label for="favourite">Rechoose your favourite game:</label></th>
			<td><select name="favourite" id="favourite">
				<option value="GuessGame">GuessGame</option>
				<option value="RockPaperScissors">RockPaperScissors</option>
				<option value="Frogs">Frogs</option>
			</select></td></tr>
			<br><br>

			<tr><th><label for="validation">You have filled Password</label><br>
			<td><input type="checkbox" id="validation" name="validation" value="validation">

			<tr><th>&nbsp;</th><td><input type="submit" name="submit" value="register" /></td></tr>
			<tr><th>&nbsp;</th><td><?php echo(view_errors($errors)); ?></td></tr>
			</table>
			</form>
			</section>
		</main>
		<footer>
			A project by ME
		</footer>
	</body>
</html>