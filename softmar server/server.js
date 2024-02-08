const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://webconnect:webconnect123@cluster0.tnchb.mongodb.net/softmarDB"
);
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const system_key = "kugdiu43287tiurgo34r824rgoiuhewoihfw";

const reportSchema = new mongoose.Schema({
  reportNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  reportDateTime: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  avgSpeed: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  stoppageHours: {
    type: Number,
  },
  stoppageNotes: {
    type: String,
  },
  distanceToGo: {
    type: Number,
  },
  nextPort: {
    type: String,
  },
  nextPortETA: {
    type: String,
  },
  shipIMO: {
    type: Number,
  },
  voyageNumber: {
    type: Number,
  },
});

const Report = mongoose.model("Report", reportSchema);

//*********** Middleware **************************/
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});


async function removeDuplicateRecords() {
  try {
    const result = await Report.aggregate([
      {
        $group: {
          _id: "$reportNumber",
          duplicates: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    const duplicateIds = result.map(group => group.duplicates.slice(1)).flat();
    
    if (duplicateIds.length > 0) {
      await Report.deleteMany({ _id: { $in: duplicateIds } });
      console.log("Duplicate records removed successfully");
    } else {
      console.log("No duplicate records found");
    }
  } catch (error) {
    console.error("Error removing duplicate records:", error.message);
  }
}


app.get("/", (req, res) => {
  res.send("Softmar Backend API");
});

app.post("/save/report", (req, res) => {
  const receivedKey = req.body.unique_key;

  if (receivedKey === system_key) {
    const reportData = req.body.reportData;

    // Check if a report with the same reportNumber already exists
    Report.findOne({ reportNumber: req.body.reportNumber })
      .then(existingReport => {
        if (existingReport) {
          // Report with the same reportNumber already exists
          res.status(400).send("Report with the same reportNumber already exists");
          console.log("Already exists");
        } else {
          // Create a new Report instance
          const report = new Report({
            reportNumber: req.body.reportNumber,
            reportDateTime: reportData.reportDateTime,
            latitude: reportData.latitude,
            longitude: reportData.longitude,
            avgSpeed: reportData.avgSpeed,
            distance: reportData.distance,
            stoppageHours: reportData.stoppageHours,
            stoppageNotes: reportData.stoppageNotes,
            distanceToGo: reportData.distanceToGo,
            nextPort: reportData.nextPort,
            nextPortETA: reportData.nextPortETA,
            shipIMO: reportData.shipIMO,
            voyageNumber: reportData.voyageNumber,
          });

          console.log("Saving");

          // Save the new report
          report.save()
            .then(() => {
              res.status(200).send("Report saved successfully");
            })
            .catch((error) => {
              res.status(500).send("Error saving report: " + error.message);
            });
        }
      })
      .catch((error) => {
        res.status(500).send("Error checking for existing report: " + error.message);
      });
  } else {
    res.status(403).send("Invalid system key");
  }
});


app.get("/fetch/report", async (req, res) => {
  try {
    await removeDuplicateRecords();
    const reports = await Report.find().sort({ reportNumber: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).send("Error fetching and sorting reports: " + error.message);
  }
});


app.listen(process.env.PORT || 5000, function () {
  console.log("Server running at 🚀: http://localhost:5000/");
});
