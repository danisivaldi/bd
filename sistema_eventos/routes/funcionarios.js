var express = require('express');
var router = express.Router();
var db = require('../db');
var oracledb = require('oracledb');
var toBRL = require('../brl')

/* GET home page. */
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
                row['VALOR'] = toBRL(row['VALOR']);
            });
        }

        res.render('funcionarios/index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

router.get('/new', function (req, res, next) {
    res.render('funcionarios/new');
});

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

module.exports = router;
