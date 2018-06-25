var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var db = require('../db');
var moment = require('moment');

// Index
router.get('/', function (req, res, next) {
    let query = "SELECT id, TO_CHAR(data_hora, 'DD/MM/YYYY - HH24:MI') AS Horário, local, C.nome AS cliente, tipo FROM Festas JOIN Clientes C ON cliente = C.cpf";
    let params = {};
    let options = {};
    let callback = function (result) {
        res.render('festas/index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

// New
router.get('/new', function (req, res, next) {
    db.executeQuery('SELECT cpf, nome FROM Clientes', {}, {}, (result) => {
        res.render('festas/new', { clientes: result });
    });
});

// Edit
router.get('/:id/edit', function (req, res, next) {
    db.executeQuery('SELECT cpf, nome FROM Clientes', {}, {}, (result) => {
        var clientes = result;

        let query = 'SELECT * FROM Festas WHERE id = :id';
        let params = {
            id: req.params.id
        };

        db.executeQuery(query, params, {}, function (result) {
            let festa = result.rows[0];
            festa.DATA_HORA = moment(festa.DATA_HORA);
            res.render('festas/edit', { festa: festa, clientes: clientes });
        });
    });
});

// Create
router.post('/', function (req, res, next) {
    let query = `INSERT INTO Festas (data_hora, local, cliente, tipo) VALUES (:data_hora, :local, :cliente, :tipo)`;
    let params = {
        data_hora: new Date(moment(`${req.body.data} ${req.body.horario}`, 'DD/MM/YYYY kk:mm').format()),
        local: req.body.local,
        cliente: req.body.cliente,
        tipo: req.body.tipo
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/festas');
    });
});

// Update
router.post('/:id', function (req, res, next) {
    if (req.body.method == 'DELETE') {
        next();
        return;
    }

    let query = 'UPDATE Festas SET data_hora = :data_hora, local = :local, cliente = :cliente, tipo = :tipo WHERE id = :id';
    let params = {
        id: req.body.id,
        data_hora: new Date(moment(`${req.body.data} ${req.body.horario}`, 'DD/MM/YYYY kk:mm').format()),
        local: req.body.local,
        cliente: req.body.cliente,
        tipo: req.body.tipo
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/festas');
    });
});

// Delete
router.post('/:id', function (req, res, next) {
    if (req.body.method === 'DELETE') {
        let params = { id: req.params.id };
        let options = { autoCommit: true };
        db.executeQuery('DELETE FROM Festas WHERE id = :id', params, options, function (result) {
            res.redirect('/festas');
        });
    } else {
        res.redirect(404);
    }
});


module.exports = router;
