// https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/
// https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1
// https://www.sohamkamani.com/blog/2018/05/30/understanding-how-expressjs-works/

var port = 8000; 
var express = require('express');
var app = express();

const { Pool } = require('pg')
const pool = new Pool({
    user: 'webdbuser',
    host: 'localhost',
    database: 'webdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser'); // we used this middleware to parse POST bodies

function isObject(o){ return typeof o === 'object' && o !== null; }
function isNaturalNumber(value) { return /^\d+$/.test(value); }

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw()); // support raw bodies

// Non authenticated route. Can visit this without credentials
app.post('/api/test', function (req, res) {
	res.status(200); 
	res.json({"message":"got here"}); 
});

/** 
 * This is middleware to restrict access to subroutes of /api/auth/ 
 * To get past this middleware, all requests should be sent with appropriate
 * credentials. Now this is not secure, but this is a first step.
 *
 * Authorization: Basic YXJub2xkOnNwaWRlcm1hbg==
 * Authorization: Basic " + btoa("arnold:spiderman"); in javascript
**/
app.use('/api/auth', function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: 'No credentials sent!' });
  	}
	try {
		// var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var m = /^Basic\s+(.*)$/.exec(req.headers.authorization);

		var user_pass = Buffer.from(m[1], 'base64').toString()
		m = /^(.*):(.*)$/.exec(user_pass); // probably should do better than this

		var username = m[1];
		var password = m[2];
		//console.log("trying to login");
		//console.log("username: " + username + " password: " + password);

		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
        pool.query(sql, [username, password], (err, pgRes) => {
  			if (err){
                res.status(403).json({ error: 'Not authorized'});
			} else if(pgRes.rowCount == 1){
				next(); 
			} else {
				res.status(403).json({ error: 'Not authorized'});
			}
		});
	} catch(err) {
        res.status(403).json({ error: 'Not authorized'});
	}
});

// All routes below /api/auth require credentials 
app.post('/api/auth/login', function (req, res) {
	res.status(200); 
	res.json({"message":"authentication success"}); 
});

app.post('/api/auth/play', function (req, res) {
	res.status(200); 
	res.json({"message":"authenticated to play"}); 
});

app.post('/api/auth/instruction', function (req, res) {
	res.status(200); 
	res.json({"message":"get instructions"}); 
});

app.get('/api/auth/stats', function (req, res) {
	let sql = "SELECT username, gamescore, difficulty, to_char(endtime, 'yyyy-mm-dd HH24:MI:SS') as endtime FROM ftdgames ORDER BY gamescore DESC";
	pool.query(sql, [], (err, pgRes) => {
		if (err) {
		  res.status(500).json({ error: 'DB error'});
		} else {
			res.status(200);
			res.json(pgRes.rows);
	  	} 
  	});
});

app.post('/api/auth/stats/:userName', function (req, res) {
	var userName = req.params.userName;
	var reqdata = req.body;
	var gamescore = reqdata.gamescore;
	var difficulty = reqdata.difficulty;
	var endtime = reqdata.endtime;

	//console.log(reqdata);

	let sql = "INSERT INTO ftdgames VALUES($1, $2, $3, $4)";
	pool.query(sql, [userName, gamescore, difficulty, endtime], (err, pgRes) => {
		if (err) {
		  res.status(500).json({ error: 'DB error'});
		} else {
			res.status(200);
			res.json({"message":"Game result saved"}); 
	  	} 
  	});
});

app.get('/api/auth/profile/:userName', function (req, res) {
	var userName = req.params.userName;
	let sql = "SELECT *, to_char(birthday, 'yyyy-mm-dd') as birthdayRe FROM ftduser WHERE username=$1";
	pool.query(sql, [userName], (err, pgRes) => {
  		if (err) {
			res.status(500).json({ error: 'DB error'});
  		} else {
			res.json(pgRes.rows[0]);
			res.status(200);
		} 
	});
});

app.delete('/api/auth/profile/:userName', function (req, res) {
	var userName = req.params.userName;
	//console.log(userName);
	let sql = "DELETE FROM ftduser WHERE username=$1";
	pool.query(sql, [userName], (err, pgRes) => {
  		if (err) {
			res.status(500).json({ error: 'DB error'});
  		} else {
			res.json({"message":"profile deleted"});
			res.status(200);
		} 
	});
});

app.put('/api/auth/profile/:userName', function (req, res) {
	var reqdata = req.body;
	var birthday = reqdata.birthday;
	var skill = reqdata.skill;
	var prefer = reqdata.prefer_time;
	var newUsername = reqdata.newUsername;
	var oriUsername = reqdata.originalUsername;
	var password = "";
	var sql = "";

	if(reqdata.changePass){
		password = reqdata.newpassword;
		sql = "UPDATE ftduser SET username=$1, password=sha512($2), birthday=$3, skill=$4, prefer_time=$5 WHERE username=$6";
		pool.query(sql, [newUsername, password, birthday, skill, prefer, oriUsername], (err) => {
			if (err){
				res.status(403).json({ error: err});
			} else {
				res.status(200);
				res.json({"message":"profile update success"});
			}
			return;
		});
	}else{
		sql = "UPDATE ftduser SET username=$1, birthday=$2, skill=$3, prefer_time=$4 WHERE username=$5";
		pool.query(sql, [newUsername, birthday, skill, prefer, oriUsername], (err) => {
			if (err){
				res.status(403).json({ error: err});
			} else {
				res.status(200);
				res.json({"message":"profile update success"});
			}
			return;
		});
	}

	//console.log("trying to update profile for" + oriUsername);
	//console.log(sql);
	//console.log("username: " + newUsername + " password: " + password + " birthday: " + birthday + " skill: " + skill + "prefer: " + prefer);
});

app.post('/api/auth/logout', function (req, res) {
	res.status(200); 
	res.json({"message":"log out"}); 
});

app.post('/api/register', function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: 'No credentials sent!' });
  	}
	try {
		// var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var m = /^Basic\s+(.*)$/.exec(req.headers.authorization);

		var user_pass = Buffer.from(m[1], 'base64').toString()
		m = /^(.*):(.*)$/.exec(user_pass); // probably should do better than this

		//console.log(req.body);
		var reqdata = req.body;
		var birthday = reqdata.birthday;
		var skill = reqdata.skill;
		var prefer = reqdata.prefer_time;

		var username = m[1];
		var password = m[2];
		//console.log("trying to register");
		//console.log("username: " + username + " password: " + password + " birthday: " + birthday + " skill: " + skill);

		let sql = "INSERT INTO ftduser VALUES($1, sha512($2), $3, $4, $5)";
        pool.query(sql, [username, password, birthday, skill, prefer], (err) => {
			if (err){
                res.status(403).json({ error: 'DB error'});
			} else {
				res.status(200).json({"message":"authentication success"}); 
			}
			return;
		});
	} catch(err) {
        res.status(403).json({ error: 'Not authorized'});
	}
});

app.post('/api/go_register', function (req, res) {
	res.status(200); 
	res.json({"message":"authentication success"}); 
});

app.post('/api/go_login', function (req, res) {
	res.status(200); 
	res.json({"message":"authentication success"}); 
});

app.post('/api/auth/test', function (req, res) {
	res.status(200); 
	res.json({"message":"got to /api/auth/test"}); 
});


app.use('/',express.static('static_content'));

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

