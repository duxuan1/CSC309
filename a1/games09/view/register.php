<?php
// So I don't have to deal with unset $_REQUEST['user'] when refilling the form
// You can also take a look at the new ?? operator in PHP7

$_REQUEST['user']=!empty($_REQUEST['user']) ? $_REQUEST['user'] : '';
$_REQUEST['password']=!empty($_REQUEST['password']) ? $_REQUEST['password'] : '';
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
    <div class="header">
        <h2>Register</h2>
    </div>

    <section>	
    <form action="index.php" method="post">
    <table>
    <!-- Trick below to re-fill the user form field -->
    <tr><th><label for="user">User</label></th><td><input type="text" name="user" value="<?php echo($_REQUEST['user']); ?>" /></td></tr>
    <tr><th><label for="password">Password</label></th><td> <input type="password" name="password" /></td></tr>

    
    <tr><th><label for="email">Email(Optional)</label></th><td> <input type="email" name="email" /></td></tr>
    
    <tr><th><p>Please select your gender:</p></th></tr>
    <tr><th><label for="male">Male</label><br></th><td><input type="radio" id="male" name="gender" value="male"></td></tr>
    <tr><th><label for="female">Female</label><br></th><td><input type="radio" id="female" name="gender" value="female"></td></tr>
    <tr><th><label for="other">Other</label></th><td><input type="radio" id="other" name="gender" value="other"></td></tr>
    <tr><th><p></p></th></tr>
    
    <tr><th><label for="favourite">Choose your favourite game:</label></th>
    <td><select name="favourite" id="favourite">
        <option value="GuessGame">GuessGame</option>
        <option value="RockPaperScissors">RockPaperScissors</option>
        <option value="Frogs">Frogs</option>
    </select></td></tr>
    <br><br>

    <tr><th><label for="validation">You have filled User and Password</label><br>
    <td><input type="checkbox" id="validation" name="validation" value="validation">

    <tr><th>&nbsp;</th><td><input type="submit" name="submit" value="register" /></td></tr>
    <tr><th>&nbsp;</th><td><?php echo(view_errors($errors)); ?></td></tr>
    </table>
    </form>

    <a href="?state=login">Go back to Login Page</a>
    </section>
        
    <section>
    </section>
    <footer>
        A project by ME
    </footer>
    
    </body>
</html>