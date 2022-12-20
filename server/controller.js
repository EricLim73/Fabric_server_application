const { constants } = require('crypto');
var sdk = require('./sdk.js');

module.exports = function(app) {

    app.get('/asd', function (req, res) {
        var issuer = req.query.issuer;
        var time = req.query.time;
        var institute = req.query.institute

        let args = [issuer, time, institute];
        
    });

 

}