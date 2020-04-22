let express = require('express'),
    router = express.Router();

router.route('/')
    .get(function (req, res) {
        try {
            res.sendFile('index.html', {root: './public/'});
        } catch (e) {
            consol.log( "ERROR " + e + e.stack);
        }
    });

router.route('/api')
	.get(function (req, res) {
		try {
			res.json({test: true});
		} catch (e) {
			consol.log( "ERROR " + e + e.stack);
		}
	});

module.exports = router;
