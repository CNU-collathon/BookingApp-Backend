const express = require('express');
const router = express.Router();
const fs = require('fs');
const shortHash = require("short-hash");
const SelfEmployed = require("../../schemas/self_employed");
const WorkPlace = require("../../schemas/workplace");
const Reservation = require("../../schemas/reservation_transaction");
const Menu = require("../../schemas/menu");

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
  selfemployed.PhoneNumber = req.body.PhoneNumber;
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

// workplace lookup by id
router.get("/account/workplace/:id", (req, res) => {
  WorkPlace.find({ SelfEmployedID: req.params.id }, (err, workplaces) => {
    if(err) res.status(500).json({error: "database failure"});
    if(workplaces.length === 0) {
      res.json({
        result: 0
      })
    }
    else {
      res.json(workplaces);
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

  if(req.files === undefined) {
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
    return;
  }
  
  const fileObj = req.files[0];
  const orgFileName = fileObj.originalname;
  const filesize = fileObj.size;

  if(filesize > 1024*1000*16) {
    console.log("File Size Over 16MB");
    return;
  }

  fs.open(fileObj.path, "r", (err, fd) => {
    const buffer = new Buffer.alloc(filesize, 'base64');
    fs.read(fd, buffer, 0, buffer.length, null, (err, bytes, buffer) => {
      workplace.Image = {
        File: buffer,
        FileName: orgFileName,
        Size: filesize
      }

      fs.unlinkSync(fileObj.path, () => {
      });

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
  })
})

// delete workplace
router.delete("/workplace/delete/:workplaceID", (req, res) => {
  WorkPlace.deleteOne({ WorkPlaceID: req.params.workplaceID }, (err) => {
    if(err) res.status(500).json({error: "database failure"});

    res.json({ message: "WorkPlace Deleted"})

    res.status(204).end();
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
        Category: workplace.Category,
        Image: workplace.Image
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
  WorkPlace.findOne({ WorkPlaceID: req.params.workplaceID }, (err, workplace) => {
    if(err) res.status(500).json({error: "database failure"});
    if(!workplace) return res.status(404).json({error: "WorkPlace not found"});
    
    if(req.body.Address) workplace.Address = req.body.Address;
    if(req.body.WorkPlaceInfo) workplace.WorkPlaceInfo = req.body.WorkPlaceInfo;
    if(req.body.Name) workplace.Name = req.body.Name;
    if(req.body.Category) workplace.Category = req.body.Category;
    if(req.files[0] !== undefined) {
      const fileObj = req.files[0];
      const orgFileName = fileObj.originalname;
      const filesize = fileObj.size;

      if(filesize > 1024*1000*16) {
        console.log("File Size Over 16MB");
        return;
      }
        
      fs.open(fileObj.path, "r", (err, fd) => {
        const buffer = new Buffer.alloc(filesize);
        fs.read(fd, buffer, 0, buffer.length, null, (err, bytes, buffer) => {
          workplace.Image = {
            File: buffer,
            FileName: orgFileName,
            Size: filesize
          }
    
          fs.unlinkSync(fileObj.path, () => {
          });
    
          workplace.save((err) => {
            if(err) res.status(500).json({error: 'falied to update'});
            res.json({message: 'WorkPlace updated'});
          })
        })
      })  
    }
    else {
      workplace.save((err) => {
        if(err) res.status(500).json({error: 'falied to update'});
        res.json({message: 'WorkPlace updated'});
      })
    }
  })
})

// register menu
router.post("/menu", (req, res, next) => {
  let menu = new Menu();
  menu.WorkPlaceID = req.body.WorkPlaceID;
  menu.Name = req.body.Name;
  menu.Desc = req.body.Desc;
  menu.Price = req.body.Price;

  const fileObj = req.files[0];
  if(fileObj === undefined) {
    menu.save((err) => {    

      if(err) {
        console.log(err);
        res.json({result: 0});
        return;
      }

      res.json({
        result: 1
      });
    })
    return;
  }
  const orgFileName = fileObj.originalname;
  const filesize = fileObj.size;

  if(filesize > 1024*1000*16) {
    console.log("File Size Over 16MB");
    return;
  }

  fs.open(fileObj.path, "r", (err, fd) => {
    const buffer = new Buffer.alloc(filesize);
    fs.read(fd, buffer, 0, buffer.length, null, (err, bytes, buffer) => {
      menu.Image = {
        File: buffer,
        FileName: orgFileName,
        Size: filesize
      }

      fs.unlinkSync(fileObj.path, () => {
      });

      menu.save((err) => {    

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
  })
});

// get menu
router.get("/menu/:workplaceID", (req, res, next) => {
  Menu.find({ WorkPlaceID: req.params.workplaceID }, (err, menu) => {
    if(err) return res.status(500).send({error: 'database failure'});

      if(menu.length === 0) {
        res.json({
          result: 0
        })
      }
      else {
        res.json(menu)
      }
  })
})

// modify menu
router.put("/menu/update/:workplaceID/:menuName", (req, res, next) => {
  Menu.findOne({ WorkPlaceID: req.params.workplaceID, Name: req.params.menuName }, (err, menu) => {
    if(err) res.status(500).json({error: "database failure"});
    if(!menu) return res.status(404).json({error: "WorkPlace not found"});
    
    if(req.body.WorkPlaceID) workplace.WorkPlaceID = req.body.WorkPlaceID;
    if(req.body.Desc) workplace.Desc = req.body.Desc;
    if(req.body.Name) workplace.Name = req.body.Name;
    if(req.body.Price) workplace.Price = req.body.Price;
    if(req.files[0] !== undefined) {
      const fileObj = req.files[0];
      const orgFileName = fileObj.originalname;
      const filesize = fileObj.size;

      if(filesize > 1024*1000*16) {
        console.log("File Size Over 16MB");
        return;
      }
        
      fs.open(fileObj.path, "r", (err, fd) => {
        const buffer = new Buffer.alloc(filesize);
        fs.read(fd, buffer, 0, buffer.length, null, (err, bytes, buffer) => {
          menu.Image = {
            File: buffer,
            FileName: orgFileName,
            Size: filesize
          }
    
          fs.unlinkSync(fileObj.path, () => {
          });
    
          menu.save((err) => {
            if(err) res.status(500).json({error: 'falied to update'});
            res.json({message: 'Menu updated'});
          })
        })
      })  
    }
    else {
      menu.save((err) => {
        if(err) res.status(500).json({error: 'falied to update'});
        res.json({message: 'Menu updated'});
      })
    }
  })
})

// delete menu
router.delete("/menu/delete/:workplaceID/:menuName", (req, res) => {
  Menu.deleteOne({ WorkPlaceID: req.params.workplaceID, Name: req.params.menuName }, (err) => {
    if(err) res.status(500).json({error: "database failure"});

    res.json({ message: "Menu Deleted"})

    res.status(204).end();
  })
})

module.exports = router;
