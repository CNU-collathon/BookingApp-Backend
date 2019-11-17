const express = require('express');
const router = express.Router();
const SelfEmployed = require("../../schemas/self_employed");

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

module.exports = router;
