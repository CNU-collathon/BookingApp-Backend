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

// reservation lookup
router.get('/reservation/lookup/:reservationID', (req, res, next) => {
  Reservation.findOne({ ID: req.params.reservationID }, (err, reservation) => {
    if(err) return res.status(500).send({error: 'database failure'});
    if(reservation === null) {
      res.json({
        result: 0
      })
    }
    else {
      WorkPlace.findOne({ WorkPlaceID: reservation.WorkPlaceID }, (err, workplace) => {
        if(workplace === null) {
          res.json({
            result: 0
          })
        }
        else {
          let result = JSON.parse(JSON.stringify(reservation));
          result.Address = workplace.Address;
          result.WorkPlaceInfo = workplace.WorkPlaceInfo;
          res.json(result);
        }
      })
    }
  })
})

//reservation transaction
router.post('/reservation', (req, res, next) => {
  let reservation = new Reservation();
  reservation.WorkPlaceID = req.body.WorkPlaceID;
  reservation.ReservedDateTime = new Date(req.body.ReservedDateTime);
  if(req.body.EndDateTime !== "") {
    reservation.EndDateTime = new Date(req.body.EndDateTime);
  }
  reservation.Detail = req.body.Detail;
  reservation.Menu = req.body.Menus;
  reservation.ID = shortHash(reservation.Detail.PhoneNum + Date.now());

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

//reservation modify
router.put('/reservation/:reservationID', (req, res, next) => {
  Reservation.update({ ID: req.params.reservationID }, {$set: req.body}, (err, output) => {
    if(err) res.status(500).json({error: "database failure"});
    console.log(output);
    if(!output.n) return res.status(404).json({error: "Reservation not found"});
    res.json({ messgae: "Reservation Updated"});
  })
})

// cancel reservation
router.delete('/reservation/cancel/:reservationID', (req, res, net) => {
  Reservation.deleteOne({ ID: req.params.reservationID }, (err) => {
    if(err) res.status(500).json({error: "database failure"});

    res.json({ message: "Reservation Canceled"})

    res.status(204).end();
  })
})

module.exports = router;
