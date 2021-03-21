<?php
$top_guess_query="select userid, guesssolved from appuser order by guesssolved DESC;";
$top_rps_query = "select userid, rpssolved from appuser order by rpssolved DESC;";
$top_frogs_query = "select userid, frogssolved from appuser order by frogssolved DESC;";
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

		<table>
		<?php $_SESSION["profile"]->get_profile($dbconn); ?>
		
		<tr><th><p><?php echo "top 3 guess player: " . $_SESSION["profile"]->get_top_players($dbconn, $top_guess_query); ?></p>
		<tr><th><p><?php echo "top 3 rps player: " . $_SESSION["profile"]->get_top_players($dbconn, $top_rps_query); ?></p>
		<tr><th><p><?php echo "top 3 frogs player: " . $_SESSION["profile"]->get_top_players($dbconn, $top_frogs_query); ?></p>
		<tr><th><p><?php echo "your userid: " . $_SESSION["profile"]->get_userid(); ?></p>
		<tr><th><p><?php echo "Number of guess game solved: " . $_SESSION["profile"]->get_guesssolved(); ?></p>
		<tr><th><p><?php echo "Number of rock paper scissors solved: " . $_SESSION["profile"]->get_rpssolved(); ?></p>
		<tr><th><p><?php echo "Number of frogs game solved: " . $_SESSION["profile"]->get_frogssolved(); ?></p>
		</table>

		</main>
		<footer>
			A project by ME
		</footer>
	</body>
</html>