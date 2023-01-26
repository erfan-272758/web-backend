const { default: axios, AxiosError } = require("axios");
const { default: mongoose } = require("mongoose");
const { requestModel, urlModel } = require("./model");
const { timeConvertor } = require("./utils");

async function job({ user, url: { id: url_id, address: url_address } }) {
  try {
    const res = await axios.get(url_address);
    await requestModel.create({
      url: new mongoose.Types.ObjectId(url_id),
      status: res.status,
    });
  } catch (err) {
    await requestModel.create({
      url: new mongoose.Types.ObjectId(url_id),
      status: err.response?.status || err.code,
    });
    await urlModel.updateOne(
      { _id: new mongoose.Types.ObjectId(url_id) },
      {
        $inc: {
          failed_count: 1,
        },
      }
    );
  }
}

const urlWatcher = urlModel.watch([{ $match: { operationType: "insert" } }]);

urlWatcher.on("change", (cs) => {
  if (!cs.fullDocument) return;
  const period = timeConvertor(process.env.HTTP_PERIOD);
  setInterval(() => {
    job({
      user: String(cs.fullDocument.user),
      url: {
        id: String(cs.fullDocument._id),
        address: cs.fullDocument.address,
      },
    });
  }, period);
});
