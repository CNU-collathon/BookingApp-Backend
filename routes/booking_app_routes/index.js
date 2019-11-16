const express = require('express');
const router = express.Router();
const shortHash = require('short-hash');
const WorkPlace = require('../../schemas/workplace');
const Reservation = require('../../schemas/reservation_transaction');


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

//reservation transaction
router.post('/reservation', (req, res, next) => {
  let reservation = new Reservation();
  reservation.WorkPlaceID = req.body.WorkPlaceID;
  reservation.MenuName = req.body.MenuName;
  reservation.ReservedDateTime = new Date();
  reservation.Personnel = req.body.Personnel;
  reservation.Detail = req.body.Detail;
  reservation.ID = shortHash(reservation.Detail.PhoneNum + req.body.ReservedDateTime);

  reservation.save((err) => {
    if(err) {
      console.log(err);
      res.json({result: 0});
      return;
    }

    res.json({
      result: 1,
      ID : reservation.ID
    });
  })
})

module.exports = router;
