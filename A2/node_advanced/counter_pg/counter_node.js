/**
 * read    GET - Safe, Idempotent, Cachable
 * update  PUT - Idempotent
 * delete  DELETE - Idempotent
 * create  POST
 *
 * https://restfulapi.net/http-methods/
 * https://restfulapi.net/http-status-codes/
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * https://restfulapi.net/rest-put-vs-post/
 **/


var port = 8000; 
var express = require('express');
var app = express();

// https://node-postgres.com/
// https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/
const { Pool } = require('pg')
const pool = new Pool({
    user: 'webdbuser',
    host: 'localhost',
    database: 'webdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser'); // we used this middleware to parse POST bodies

function isObject(o){
        return typeof req.body === 'object' && yourVariable !== null;
}
function isNaturalNumber(value) {
        return /^\d+$/.test(value);
}

// https://stackabuse.com/get-http-post-body-in-express-js/
//
// support encoded bodies with
// Content-Type: application/x-www-form-urlencoded
// username=arnold&password=spiderman&value=7
app.use(bodyParser.urlencoded({ extended: true }));

// support json encoded bodies
// Content-Type: application/json
// {"username":"arnold","password":"spiderman","value":7}
app.use(bodyParser.json());

// app.use(bodyParser.raw()); // support raw bodies

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content'));

// retrieve all counters (idempotent)
app.get('/api/counter/', function (req, res) {
	let sql = 'SELECT * FROM counter ORDER BY counterName;';
	pool.query(sql, [], (err, pgRes) => {
  		if (err) {
			res.status(500);
			res.json({"error":err.message});
			return;
  		} 
		var result={};
		pgRes.rows.forEach((row) => { 
			result[row.countername]=row.countervalue;
		});
		res.json(result);
	});
});

// retrieve specific counter (idempotent)
app.get('/api/counter/:counterName/', function (req, res) {
        var counterName = req.params.counterName;

	let sql = 'SELECT * FROM counter WHERE counterName=$1';
        pool.query(sql, [counterName], (err, pgRes) => {
  		if (err) {
			res.status(500);
			res.json({"error":err.message});
			return;
  		} 
        	if(pgRes.rows.length !=0){
			res.status(200);
                	res.json(pgRes.rows[0]);
			return;
        	} else {
                	res.status(404);
                	res.json({ "error":`${counterName} not found` });
			return;
        	}
        });
});

// create a new counter (idempotent) initial value specified in the post body
// Content-Type: application/json
// {"value":"7"}
//
// if initial value is not specified, it defaults to 0
app.post('/api/counter/:counterName/', function (req, res) {
        var counterName = req.params.counterName;
        console.log(JSON.stringify(req.body));

        if("value" in req.body && ! isNaturalNumber(req.body.value)){
                res.status(400);
                res.json({"error":'post expects body like {"value":6}'});
                return;
        }

        var value = 0;
        if("value" in req.body)value=parseInt(req.body.value);

	let sql = 'INSERT INTO counter(counterName, counterValue) VALUES ($1,$2);';
        pool.query(sql, [counterName, value], (err, pgRes) => {
		if(err && err.code==23505){ // pg duplicate key error
               		res.status(409);
               		res.json({"error":`${counterName} is already in database`});
               		return;
		}
  		if (err) {
			res.status(500);
			res.json({"error":err.message});
			return;
  		} 
        	if(pgRes.rowCount == 1){
			res.status(200);
        		res.json({[counterName]: value});
			return;
        	} else {
			res.status(500);
			res.json({"error":`couldn't add ${counterName}`});
			return;
        	}
	});
});

/** Exercise: complete the route as specified below:
 * update a counter (not idempotent)
 * Example: ------------------------------------ 
 * Request: 
 * PUT /api/counter/numThings
 * body: {"amount":6}
 * 
 * Response: 
 * statusCode: 200 
 * body: {"counterName":"numThings", "before":20, "after":26}
 * 
 * Example: ------------------------------------
 * Request: 
 * PUT /api/counter/nummmThings
 * body: {"amount":12}
 *
 * Response: 
 * statusCode: 404
 * body: {"error":"nummmThings is not in database"}
 *
 * Example: ------------------------------------
 * Request: 
 * PUT /api/counter/numThings
 * body: {"amountz":"stuff"}
 *
 * Response: 
 * statusCode: 400
 * body: {"error":"put expects body like {amount:6}"}
 *
 * YOUR CODE DOES THE FOLLOWING
 *
 * 1) If malformed request body, return a 404 and {"error":'put expects body like {"amount":6}'}
 * 2) If counterName is not in database, return a 400 and {"error":`${counterName} is not in database`}
 * 3) Otherwise:
 *    a) Find the counter in the database
 *    b) increment it by amount
 *    c) return a 200 and {"counterName":"numThings", "before":20, "after":26}
 *
app.VERB('ROUTE', function(req, res) {
});

 **/

// delete a counter (idempotent)
app.delete('/api/counter/:counterName/', function (req, res) {
        var counterName = req.params.counterName;

	let sql = 'DELETE FROM counter WHERE counterName=$1;';
        pool.query(sql, [counterName], (err, pgRes) => {
                if (err) {
                        res.status(500);
                        res.json({"error":err.message});
                        return;
                }
                if(pgRes.rowCount != 1){
                        res.status(200);
                	res.json({"counterName":counterName, "before":"not in database", "after":"not in database"});
                        return;
                } else {
                        res.status(200);
                	res.json({"counterName":counterName, "before":"in database", "after":"not in database"});
                        return;
                }
        });

});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

