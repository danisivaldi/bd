var express = require('express');
var router = express.Router();
var db = require('../db');
var oracledb = require('oracledb');
var toBRL = require('../brl')

// Funcionários
router.get('/', function (req, res, next) {
    // OBS.: callback é o código que será executado após rodar a query
    let query = "SELECT 'Fotógrafo(a)' AS função, cpf, nome, contato, valor FROM Fotografos UNION ALL\
                 SELECT 'Técnico(a)' AS função, cpf, nome, contato, valor FROM Tecnicos UNION ALL\
                 SELECT 'Monitor(a)' AS função, cpf, nome, contato, valor FROM Monitores";
    let params = {};
    let options = {};
    let callback = function (result) {
        if (typeof result.rows !== 'undefined') {
            result.rows.forEach((row) => {
                row.VALOR = toBRL(row.VALOR);
            });
        }

        res.render('funcionarios/index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

// New
router.get('/new', function (req, res, next) {
    res.render('funcionarios/new');
});

// Edit
router.get('/:funcao/:cpf/edit', function (req, res, next) {
    let funcao;
    switch (req.params.funcao) {
        case 'F':
            funcao = 'Fotografos';
            break;
        case 'T':
            funcao = 'Tecnicos';
            break;
        case 'M':
            funcao = 'Monitores';
            break;
    }

    let query = `SELECT * FROM ${funcao} WHERE cpf = :cpf`;
    let params = {
        cpf: req.params.cpf
    };

    db.executeQuery(query, params, {}, function (result) {
        
        res.render('funcionarios/edit', { funcionario: result.rows[0], funcao: funcao });
    });
});

// Update
router.post('/:funcao/:cpf', function (req, res, next) {
    if (req.body.method == 'DELETE') {
        next();
        return;
    }

    let query = `UPDATE ${req.params.funcao} SET nome = :nome, contato = :contato, valor = :valor WHERE cpf = :cpf`; 
    let params = {
        cpf: req.params.cpf,
        nome: req.body.nome,
        contato: req.body.contato,
        valor: req.body.valor
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/funcionarios');
    });
});

// Create
router.post('/', function (req, res, next) {
    let query = `INSERT INTO ${req.body.funcao} VALUES (:cpf, :nome, :contato, :valor)`;
    let params = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        contato: req.body.contato,
        valor: req.body.valor
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/funcionarios');
    });
});

// Delete
router.post('/:funcao/:cpf', function (req, res, next) {
    if (req.body.method === 'DELETE') {
        let funcao;
        switch (req.params.funcao) {
            case 'F':
                funcao = 'Fotografos';
                break;
            case 'T':
                funcao = 'Tecnicos';
                break;
            case 'M':
                funcao = 'Monitores';
                break;
        }

        let params = { cpf: req.params.cpf };
        let options = { autoCommit: true };
        db.executeQuery(`DELETE FROM ${funcao} WHERE cpf = :cpf`, params, options, function (result) {
            res.redirect('/funcionarios');
        });
    } else {
        res.redirect(404);
    }
});

module.exports = router;
