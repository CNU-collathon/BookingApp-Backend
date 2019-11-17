const express = require('express');
const router = express.Router();
const shortHash = require("short-hash");
const SelfEmployed = require("../../schemas/self_employed");
const WorkPlace = require("../../schemas/workplace");
const Reservation = require("../../schemas/reservation_transaction");

// SelfEmployed ID duplication check
router.get("/selfemployed/:id", (req, res, next) => {
  SelfEmployed.find({ ID: req.params.id } ,(err, data) => {
    if(err) return res.status(500).send({error: 'database failure'});
    if(data.length > 0) {
        res.json({
            isDuplicated: "true"
        });
    }
    else {
        res.json({
            isDuplicated: "false"
        })
    }
  })
})

// account check
router.post("/login", (req, res, next) => {
  SelfEmployed.find(
    { 
      ID: req.body.ID,
      PW: req.body.PW
    },
    (err, data) => {
      if(err) return res.status(500).send({error: 'database failure'});

      if(data.length === 0) {
        res.json({
          result: 0
        })
      }
      else {
        res.json({
          result: 1
        })
      }
    })
})

// sign up
router.post("/signup", (req, res, next) => {
  let selfemployed = new SelfEmployed();
  selfemployed.ID = req.body.ID;
  selfemployed.PW = req.body.PW;
  selfemployed.Email = req.body.Email;
  selfemployed.PhoneNumber = req.body.Email;
  selfemployed.save((err) => {
    if(err) {
      console.log(err);
      res.json({result: 0});
      return;
    }

    res.json({
      result: 1
    });
  })
})

// SelfEmployed modify
router.put("/account/:id", (req, res, next) => {
  SelfEmployed.update({ ID: req.params.id }, {$set: req.body}, (err, output) => {
    if(err) res.status(500).json({error: "database failure"});
    console.log(output);
    if(!output.n) return res.status(404).json({error: "Account not found"});
    res.json({ messgae: "Account Updated"});
  })
})

// account data check
router.get("/account/data/:id", (req, res, next) => {
  SelfEmployed.findOne({ ID: req.params.id }, (err, account) => {
    if(err) res.status(500).json({error: "database failure"});
    if(account === null) {
      res.json({
        result: 0
      })
    }
    else {
      res.json({
        Email: account.Email,
        PhoneNumber: account.PhoneNumber
      });
    }
  })
})


// workplace register
router.post("/workplace", (req, res, next) => {
  let workplace = new WorkPlace();
  workplace.SelfEmployedID = req.body.SelfEmployedID;
  workplace.WorkPlaceID = shortHash(req.body.Address);
  workplace.Address = req.body.Address;
  workplace.WorkPlaceInfo = req.body.WorkPlaceInfo;
  workplace.Name = req.body.Name;
  workplace.Category = req.body.Category;
  workplace.save((err) => {
    if(err) {
      console.log(err);
      res.json({result: 0});
      return;
    }

    res.json({
      result: 1
    });
  })
})

// workplace lookup
router.get("/workplace/:workplaceID", (req, res, next) => {
  WorkPlace.findOne({ WorkPlaceID: req.params.workplaceID }, (err, workplace) => {
    if(err) res.status(500).json({error: "database failure"});

    if(workplace === null) {
      res.json({
        result: 0
      })
    }
    else {
      res.json({
        Address: workplace.Address,
        WorkPlaceInfo: workplace.WorkPlaceInfo,
        Name: workplace.Name,
        Category: workplace.Category
      });
    }
  })
})

// workplace reservation find
router.get("/workplace/reservation/:workplaceID", (req, res, next) => {
  Reservation.find({ WorkPlaceID: req.params.workplaceID }, (err, reservations) => {
    if(err) res.status(500).json({error: "database failure"});

    if(reservations.length === 0) {
      res.json({
        result: 0
      })
    }
    else {
      res.json(reservations);
    }
  })
})

// workplace modify
router.put("/workplace/update/:workplaceID", (req, res, next) => {
  WorkPlace.update({ WorkPlaceID: req.params.workplaceID }, { $set: req.body }, (err, output) => {
    if(err) res.status(500).json({error: "database failure"});
    console.log(output);
    if(!output.n) return res.status(404).json({error: "WorkPlace not found"});
    res.json({ messgae: "WorkPlace Updated"});
  })
})

module.exports = router;
