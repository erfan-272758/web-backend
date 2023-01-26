const express = require("express");
const { default: mongoose } = require("mongoose");
const { guard } = require("./auth");
const { urlModel, requestModel } = require("./model");

const router = express.Router();

router.post("/url", guard, async (req, res) => {
  const count = await urlModel.find({ user: req.user._id }).count();
  if (count >= 20) return res.status(403).send("Already created 20 urls");
  const url = await urlModel.create({
    address: req.body.address,
    threshold: req.body.threshold,
    user: req.user._id,
    failed_time: 0,
  });
  return res.status(201).json(url);
});

router.get("/url", guard, async (req, res) => {
  const urls = await urlModel.find(
    { user: req.user._id },
    {
      id: "$_id",
      _id: false,
      address: 1,
      failed_count: 1,
      threshold: 1,
      createdAt: 1,
    }
  );
  return res.status(200).json(urls);
});

router.get("/url/:id/stats", guard, async (req, res) => {
  try {
    const url = await urlModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      user: req.user._id,
    });
    if (!url) return res.status(404).send("Not Found");
    const requests = await requestModel.find(
      {
        url: new mongoose.Types.ObjectId(req.params.id),
      },
      { status: 1, createdAt: 1, _id: false }
    );
    const ok = requests.filter((r) => r.status < 300 && r.status >= 200).length;
    return res.status(200).json({
      address: url.address,
      ok,
      error: requests.length - ok,
      requests,
    });
  } catch (err) {
    return res.status(400).send("Invalid Inputs");
  }
});

router.get("/url/alerts", guard, async (req, res) => {
  const urls = await urlModel.aggregate([
    {
      $match: {
        user: req.user._id,
        $expr: {
          $gt: ["$failed_count", "$threshold"],
        },
      },
    },
    {
      $project: {
        threshold: 1,
        address: 1,
        failed_count: 1,
      },
    },
  ]);
  return res.status(200).json(urls);
});

exports.urlRouter = router;
