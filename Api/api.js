const { query } = require("express");
const express = require("express");
const router = express.Router();
// const crypto = require("crypto");
const atob = require("atob");
const btoa = require("btoa");
require("dotenv").config();
const referModal = require("../model/Refer");

// user create
router.post("/user-exist", async (req, res) => {
  let { userAccount } = req.body;
  referModal.findOne({ account: userAccount }, (err, data) => {
    if (err) {
      res.json(err);
    }
    if (data === null) {
      res.status(200).json({ isExist: false });
    } else {
      res.status(200).json({ isExist: true });
    }
  });
});

router.post("/user-create", async (req, res) => {
  let { userAccount } = req.body;
  let referLink = btoa(userAccount);
  console.log(userAccount, referLink);
  let newRefer = new referModal({ referLink: referLink, account: userAccount });
  newRefer.save();
  res.json(newRefer);
});

router.post("/check-refer", async (req, res) => {
  let { referLink, userAccount } = req.body;
  console.log(referLink, userAccount);
  referModal.findOne({ account: userAccount }, (err, result) => {
    if (err) {
      res.json({
        status: false,
        message: "Something went wrong",
      });
    } else {
      if (result) {
        let status = false;
        result.referUser.map((data) => {
          console.log(data);
          if (data === atob(referLink)) {
            status = true;
          }
        });
        if (status) {
          res.json({
            status: true,
            message: "Refer Link is already created",
            isExist: true,
          });
        } else {
          res.json({
            status: false,
            message: "Refer Link is not created",
            isExist: false,
          });
        }
      }
    }
  });
});

// CReate refer Link
router.post("/referCreate", async (req, res) => {
  let { account } = req.body;
  const hash = btoa(account);
  let data = new referModal({ account: account, referLink: hash });
});

router.post("/refer/:link", async (req, res, next) => {
  const { userAccount } = req.body;
  let referLink = atob(req.params.link);
  console.log(referLink);
  const result = await referModal.findOneAndUpdate(
    {
      account: userAccount,
    },
    {
      $addToSet: { referUser: referLink },
    },
    { upsert: true }
  );
  res.status(200).json(result);
});

router.post("/refer-update", async (req, res) => {
  let { referAccount } = req.body;

  await referModal.findOne({ account: referAccount }, (err, data) => {
    let result = data.referCount;
    console.log(result);
    let count = result + 1;
    let percentage = 2.5;
    if (result === 1) {
      percentage = 2.5;
    }
    if (2 <= result && result <= 10) {
      percentage = 3;
    }
    if (11 <= result && result <= 50) {
      percentage = 3.5;
    }
    if (50 <= result) {
      percentage = 4;
    }
    referModal
      .findOneAndUpdate(
        {
          account: referAccount,
        },
        { referCount: count, referPercentage: percentage }
      )
      .then((data) => res.json(data));
  });
});
module.exports = router;
