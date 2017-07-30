var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.sendfile("public/index.html");
});
 router.get('/post', (req, res) => {
  res.sendfile("public/para.html");
}); 



module.exports = router;
