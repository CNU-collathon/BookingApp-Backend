var express = require('express');
var router = express.Router();

/* get Category Data */
router.get('/', (req, res, next) => {
  res.json({
    name : "Dummny",
    color: '#1abc9c'
  })
});


router.get('/second', (req, res, next) => {
    res.json({
      name : 'Second',
      color: '#1abc9c'
    })
});


// store page api


// store selector api

module.exports = router;
