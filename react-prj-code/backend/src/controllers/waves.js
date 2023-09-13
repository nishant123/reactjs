const models = require("../models");

const UpdateName = async (req, res) => {
  //TODO: attach Gdrive related renaming.
  const updatedWaveName = req.params.NewWaveName;
  try {
    await models.sequelize.transaction(async (t) => {
      //console.log("Transaction");
      await models.WaveSpecs.update(
        { WaveName: updatedWaveName },
        {
          where: {
            id: req.params.WaveId,
          },
          transaction: t,
        }
      ).catch((ex) => {
        // console.log("F1");
        //console.log("Error is: " + ex);
        throw ex;
      });
    });

    await res.status(200).json({ message: "SUCCESS: Wave Name Updated." });
  } catch (ex) {
    res.status(500).json({
      message: "ERROR: Something Went Wrong While Updating Wave Name.",
      error: ex.toString(),
    });
  }
};

module.exports = {
  UpdateName: UpdateName,
};
