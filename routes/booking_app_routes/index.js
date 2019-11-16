var express = require('express');
var router = express.Router();
var WorkPlace = require('../../schemas/workplace');


// store selector api
router.get('/stores/:category', (req, res, next) => {
  WorkPlace.find({"Category": req.params.category}, (err, workplaces) => {
    if(err) return res.status(500).send({error: 'database failure'});
    res.json(workplaces);
  })
});
// store page api
router.get('/store/:store_id', (req, res, next) => {
  WorkPlace.find({"WorkPlaceID" : req.params.store_id}, (err, workplaces) => {
    if(err) return res.status(500).send({error: 'database failure'});
    res.json(workplaces);
  })
});

module.exports = router;
