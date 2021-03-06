const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'mydb',
});

connection.connect(function (err) {
    if (err) {
        console.error('erro conectando banco: ' + err.stack);
        return;
    }
    console.log('Banco conectado');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/listar', function (req, res) {
    connection.query('select * from produtos',
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json(results);
            console.log('executou a listagem!');
        });
});




app.get('/listarVendas', function (req, res) {
    connection.query('select vendas.data_hora, itens.* from vendas inner join itens',
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json(results);
            console.log('executou a listagem de vendas!');
        });
});



app.get('/buscarPer/:inicio/:final', function (req, res) {
    let i = req.params.inicio
let f = req.params.final
    connection.query(`select vendas.data_hora, itens.* from vendas
    join itens 
    WHERE  vendas.data_hora >= date('${i}')
      AND  vendas.data_hora <= date('${f}')
      group by itens.id` ,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json(results);
            console.log('executou a busca por periodo!', results);
        });
});


app.get('/buscaPorId/:id', function (req, res) {
    let idd = req.params.id;
    console.log(idd);
    connection.query(`select nome, valor, id from produtos where id = ${idd}` ,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json(results);
            console.log('executou a busca por id!', results);
        });
});


app.post('/cadVenda', function (req, res) {
    connection.query(`insert into vendas(data_hora) values (now())` ,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
            console.log('Venda Cadastrada!');
        });
});

app.post('/cadastroItens', function (req, res) {
    connection.query(`insert into itens(qt, vendas_id, produtos_id) values(${req.body.quantidadedoProduto}, LAST_INSERT_ID(), ${req.body.idProduto})` ,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
            console.log('Itens!');
        });
});

app.post('/enviar', function (req, res) {
    console.log(req.body)
    connection.query(`insert into produtos(nome, valor) values( '${req.body.nome} ',' ${req.body.valor} ')`,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json({ "nome": "1" });
            console.log('executou o envio!');
        });
});

app.delete('/deletar', function (req, res) {
    console.log(req.body)
    connection.query(`delete from produtos where id = ${req.body.id}`,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json({ "ID": "1" });
            console.log('deletou!');
        });
});

app.put('/up/:idup/:nup/:vup', function (req, res) {
    let idups = req.params.idup;
    let nomeNovo = req.params.nup;
    let valorNovo = req.params.vup;
    console.log(idups, nomeNovo, valorNovo);
    
    connection.query(`update produtos set nome='${nomeNovo}', valor='${valorNovo}' where id=${idups}`,
        function (error, results, fields) {
            if (error)
                res.json(error);
            else
                res.json(results);
            console.log('Atualizado!');
        });
});


app.use(express.static(__dirname + '/public'));
const PORT = 80;
app.listen(PORT);
console.log('server on ' + PORT);

// app.listen(PORT, function (res) {
//     console.log('Banco conectado na porta 80:');

// });
