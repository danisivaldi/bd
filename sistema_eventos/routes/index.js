var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
    let query = "SELECT TO_CHAR(F.data_hora, 'YYYY-MM') AS Periodo, SUM(J.gasto_energia) AS Gasto_Energia\
                 FROM Festas F, Festa_Jogos FJ, Jogos J\
                 WHERE F.id = FJ.festa_id AND FJ.JOGO = J.nome\
                 GROUP BY TO_CHAR(F.DATA_HORA, 'YYYY-MM')";
    
    var gastoEnergia;            
    db.executeQuery(query, {}, {}, function (result) {
        
        gastoEnergia = result.rows;
        var totalCasamento;
        let query =     "SELECT C.festa_id, SUM(AL.preco + AL.valor + TEC.Custo + AM.Custo) AS CustoTotal\
                        FROM Casamentos C\
                        LEFT JOIN   (SELECT A.festa_id, CASE\
                                                        WHEN A.preco IS NULL THEN 0\
                                                        ELSE A.preco\
                                                        END AS preco,\
                                                        CASE\
                                                        WHEN F.valor IS NULL THEN 0\
                                                        ELSE F.valor\
                                                        END AS valor\
                                    FROM Album A\
                                    LEFT JOIN Fotos FT ON FT.festa_id = A.festa_id\
                                    LEFT JOIN Fotografos F ON FT.fotografo = F.CPF\
                                    GROUP BY A.festa_id, preco, valor) AL ON AL.festa_id = C.festa_id\
                        LEFT JOIN   (SELECT c.festa_id AS ID, SUM(T.VALOR) AS Custo\
                                    FROM Casamentos C \
                                    LEFT JOIN Realizacao R ON R.festa_id = C.festa_id\
                                    LEFT JOIN Tecnicos T ON R.TECNICO = T.CPF\
                                    GROUP BY C.festa_id) TEC ON TEC.ID = C.festa_id\
                        LEFT JOIN   (SELECT C.festa_id AS ID, SUM(AM.Custo) AS Custo\
                                    FROM Casamentos C\
                                    LEFT JOIN Apresentacoes AP ON AP.festa_id = C.festa_id\
                                    LEFT JOIN Atracoes_Musicais AM ON AP.nome_artistico = AM.nome_artistico\
                                    GROUP BY C.festa_id) AM ON AM.ID = C.festa_id\
                        GROUP BY C.festa_id";
        
        db.executeQuery(query, {}, {}, function (result) {
            totalCasamento = result;
            var fabricante;
            let query = "SELECT F.MODELO, F.FABRICANTE, F.PRECO\
            FROM FOGOS_ARTIFICIOS F JOIN ARTIFICIOS_SHOW A\
            ON A.MOD_FOGOS = F.MODELO AND A.FAB_FOGOS = F.FABRICANTE\
            GROUP BY F.FABRICANTE, F.MODELO, F.PRECO\
            ORDER BY F.FABRICANTE, F.PRECO"
            
            db.executeQuery(query, {}, {}, function (result) {
                fabricante = result;
                var totalInfantil;
                let query = "select fe.ID, SUM(al.preco + al.valor + brinq.Custo) as CustoTotal\
                            from Festas fe\
                            left join   (select a.Festa_Id, case\
                                                         when a.preco IS NULL then 0\
                                                         else a.preco\
                                                         end as preco,\
                                                         case\
                                                         when f.valor is NULL then 0\
                                                         else f.valor\
                                                         end as valor\
                                        from Album a\
                                        left join Fotos ft on ft.FESTA_ID = a.FESTA_ID\
                                        left join Fotografos f on ft.fotografo = f.CPF\
                                        Group by a.FESTA_ID, preco, valor) al on al.Festa_Id = fe.Id\
                            left join   (select f.id, SUM(m.valor + b.valor) as Custo from Festas f \
                                        left join Aluguel_Brinquedo ab on f.ID = ab.FESTA_ID\
                                        join Monitor_aluguel_Brinquedo mab on mab.Aluguel_Brinquedo = ab.ID\
                                        join Monitores m on m.cpf = mab.Monitor\
                                        join Brinquedos b on(b.NOME = ab.NOM_BRINQUEDO AND b.MODELO = ab.MOD_BRINQUEDO)\
                                        group by f.id) brinq on brinq.ID = fe.ID\
                            where fe.tipo = 'INFANTIL'\
                            group by fe.Id"

                db.executeQuery(query, {}, {}, function (result) {
                    res.render('index', { gastoEnergia: gastoEnergia, totalCasamento: totalCasamento, fabricante: fabricante, totalInfantil: result });
                });
            });
        });
    });
});

router.get('/testes', function (req, res, next) {
    res.render('testes');
});

router.post('/testes', function (req, res, next) {
    db.executeQuery(req.body.query, {}, {}, function (result) {
        res.render('testes', { result: result });
    });
});

module.exports = router;


