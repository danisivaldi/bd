var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
    let query = 'SELECT * FROM Clientes';
    let params = {};
    let options = {};
    let callback = function (result) {
        res.render('clientes/index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

router.get('/new', function (req, res, next) {
    res.render('clientes/new');
});

router.get('/:cpf/edit', function (req, res, next) {
    let query = 'SELECT * FROM Clientes WHERE cpf = :cpf';
    let params = {
        cpf: req.params.cpf
    };

    db.executeQuery(query, params, {}, function (result) {
        res.render('clientes/edit', { cliente: result.rows[0] });
    });
});

router.post('/', function (req, res, next) {
    let query = 'INSERT INTO Clientes VALUES (:cpf, :nome, :contato)';
    let params = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        contato: req.body.contato
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/clientes');
    });
});

router.post('/:cpf', function (req, res, next) {
    let query = 'UPDATE Clientes SET nome = :nome, contato = :contato WHERE cpf = :cpf';
    let params = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        contato: req.body.contato
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/clientes');
    });
});

module.exports = router;
