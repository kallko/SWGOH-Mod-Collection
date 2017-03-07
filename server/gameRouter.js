/**
 * Created by kalko on 04.03.17.
 */
var express = require('express'),
    router = express.Router();

router.route('/')
    .get(function (req, res) {
        //console.log("req.session.login", req);
        try {
            // req.session.login = req.query.curuser;
            // var time = timestmpToStr(new Date());
            // var date = ("" + new Date()).substring(0,10);
            // var obj = {
            //     login : req.session.login,
            //     date : date,
            //     time : time
            // };
            // log.logger('login-log ' + date + ".txt", obj, true);
            res.sendFile('index.html', {root: './public/'});
        } catch (e) {
            consol.log( "Ошибка "+ e + e.stack);
        }
    });

module.exports = router;