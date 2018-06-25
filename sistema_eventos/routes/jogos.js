var express = require('express');
var router = express.Router();
var db = require('../db');

// Index
router.get('/', function (req, res, next) {
    let query = 'SELECT * FROM Jogos';
    let params = {};
    let options = {};
    let callback = function (result) {
        res.render('jogos/index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

// New
router.get('/new', function (req, res, next) {
    res.render('clientes/new');
});

// Edit
router.get('/:cpf/edit', function (req, res, next) {
    let query = 'SELECT * FROM Clientes WHERE cpf = :cpf';
    let params = {
        cpf: req.params.cpf
    };

    db.executeQuery(query, params, {}, function (result) {
        res.render('clientes/edit', { cliente: result.rows[0] });
    });
});

// Create
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

// Update
router.post('/:cpf', function (req, res, next) {
    if (req.body.method == 'DELETE') {
        next();
        return;
    }

    let query = 'UPDATE Clientes SET cpf = :cpf, nome = :nome, contato = :contato WHERE cpf = :cpf';
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

// Delete
router.post('/:cpf', function (req, res, next) {
    if (req.body.method === 'DELETE') {
        let params = { cpf: req.params.cpf };
        let options = { autoCommit: true };
        db.executeQuery('DELETE FROM Clientes WHERE cpf = :cpf', params, options, function (result) {
            res.redirect('/clientes');
        });
    } else {
        res.redirect(404);
    }
});

module.exports = router;
