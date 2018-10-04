//Initiallising node modules
var express = require("express");
var https = require('https');
const { Pool, Client } = require('pg');
var app = express();



//const ELITE_SECRET = 'elite_secret';
const basicAuth = require('express-basic-auth');

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
//express basic auth
app.use(basicAuth({
    users: {
        'admin': '',
        'conver': ''
    }
}));

// initializing postgresql connection credentials
const pool = new Pool({
	user: '',
	host: '',
	database: '',
	password: '',
	port: 5432,
	max: 20,
	idleTimeoutMillis: 10000,
	connectionTimeoutMillis: 2000
  });

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err);
});

//execute query and send response back
var executePooledPgQuery = function(res, query){
	pool.connect((err, pgClient, release) => {
		if (err) {
			  console.error('Error acquiring client', err.stack);
			  res.status(500).send(err);
		} else {
			pgClient.query(query, (err, resultset) => {
				release();
				if (err) {   
					console.log("Error while querying database :- " + err);
					res.status(500).send(err);
				}
				else {
					console.log('Response Sent\n');
					res.send(resultset);
				}
			});
		}
	  });
}
var server = app.listen(process.env.PORT || 3588, function () {
	var port = server.address().port;
	console.log("College Football app now running on port", port);
});

app.get("/api/test", function(req , res){
	console.log("request received");
	res.status(200).send({ auth: true, message: 'all ok' });
});

app.put("/api/test", function(req , res){
	console.log("request received");
	res.status(200).send({ auth: true, message: 'all ok' });
});


app.get("/api/list_schools", function(req , res){
	var query = "select distinct school_name from collegefootball.football_detail order by school_name";
	executePooledPgQuery(res, query);
});

app.put("/api/list_schools", function(req , res){
	var query = "select distinct school_name from collegefootball.football_detail order by school_name";
	executePooledPgQuery(res, query);
});

app.get("/api/get_school_logo", function(req , res){
	executePooledPgQuery(res, query);
});

app.put("/api/get_school_logo", function(req , res){
	var query = "select school_name, logo_link from collegefootball.football_teamlogos WHERE school_name LIKE \'" + req.query.school_name + "%\' order by school_name"
	executePooledPgQuery(res, query);
});

app.get("/api/get_school_details", function(req , res){
    var query = "select * from collegefootball.football_detail WHERE school_name LIKE \'" + req.query.school_name + "%\' order by year_id desc";
    console.log(query);
	executePooledPgQuery(res, query);
});

app.put("/api/get_school_details", function(req , res){
    var query = "select * from collegefootball.football_detail WHERE school_name LIKE \'" + req.query.school_name + "%\' order by year_id desc";
    console.log(query);
	executePooledPgQuery(res, query);
});
// DELETE API
/*
app.delete("/api/user/:email", function(req , res){
	var query = "DELETE FROM [dbo].[APP_USER] WHERE [User_Id]=" + req.params.id;
	executeQuery (res, query);
});
*/