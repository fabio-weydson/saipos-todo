var fs = require('fs'),
  http = require('http'),
  express = require('express');
 

var app = express();

//APP SERVER
http.createServer(function (req, res) {
  fs.readFile('app'+ req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(80);

//API SERVER
http.createServer(function (req, res) {
const mysql = require('mysql');
const connection = mysql.createConnection('mysql://jmkb1oyk4uo4sxa4:sqjx4hy3ilc29gca@frwahxxknm9kwy6c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/kwra425tj8sw9n3w');


connection.connect((err) => {
  if (err) throw err;
  console.log('conexao ok!');
});
app.get('/', function (req, res) {
  res.send('Bem vindo!');
});
app.get('/getAll', function (req, res) {
  connection.query('SELECT * FROM tasks', (err,rows) => {
    if(err) throw err;
    res.send(JSON.stringify(rows));
  });
});

}).listen(9090);