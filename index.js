const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');


const connection = mysql.createConnection({
    host      : 'localhost',
    port      : '3306',
    user      : 'root',
    password  : '',
    database  : 'loja',
});

connection.connect(function(err) {
    if(err){
        console.error('erro conectando banco: ' + err.stack);
        return;
    }
    console.log('Banco conectado');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// app.use("/", function(req, res) {
//     res.sendFile(path.join(__dirname + '/public/'))
// });

app.get('/listar', function(req, res) {
    connection.query('select * from produtos',
    function(error, results, fields) {
        if(error)
        res.json(error);
        else
            res.json(results);
            connection.end();
            console.log('executou a listagem!');   
    }); 
});
 


app.use(express.static(__dirname + '/public'));
const PORT=80;
app.listen(PORT);
console.log('server on ' + PORT);

// app.listen(PORT, function (res) {
//     console.log('Banco conectado na porta 80:');
    
// });
