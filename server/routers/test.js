var express = require('express');
var router = express.Router();

router.get('/*', function(req, res) {
 console.log('test middleware');
});

module.exports = router;