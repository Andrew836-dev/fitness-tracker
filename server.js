const express = require("express");
const mongoose = require("mongoose");
const db = require("./models");
const logger = require("morgan");
const { join } = require("path");

const STATIC_PATH = join(__dirname, "public");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/workout";
const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

app.get("/:path", ({ params }, res) => {
    let target = "";
    const validPaths = ["exercise", "stats"]
    if (validPaths.some(validPath => validPath === params.path)) {
        target = params.path;
    }
    res.sendFile(join(STATIC_PATH, target + ".html"));
});

app.get("/api/workouts", (req, res) => {
    console.log("workouts query", req.query);
    db.Workout.find().then(dbWorkouts => {

        // this segment is to make the seeds display properly in the browser
        dbWorkouts.forEach(workout => {
            if (workout.totalDuration === 0) {
                workout.exercises.forEach(({ duration }) => {
                    workout.totalDuration += duration;
                });
            }
        });
        res.json(dbWorkouts);
    });
});

app.get("/api/workouts/range", (req, res) => {
    console.log(req.body);
    db.Workout.find().then(dbWorkouts => {
        res.json(dbWorkouts);
    });
});

app.post("/api/workouts", (req, res) => {
    const newWorkout = new db.Workout;
    newWorkout.save()
        .then(dbWorkout => {
            res.json(dbWorkout);
        });
});

app.put("/api/workouts/:id", ({ params, body }, res) => {
    const { id } = params;
    const exercises = body;
    console.log(id, exercises)
    db.Workout.findByIdAndUpdate(id, { $push: { exercises: exercises } }, { new: true })
      .then(dbWorkout => {
          res.json(dbWorkout);
      });
});

app.listen(PORT, () => {
    console.log("Listening on https://localhost:" + PORT);
});