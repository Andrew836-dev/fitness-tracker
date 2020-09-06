const db = require("../models");
const { join } = require("path");

const STATIC_PATH = join(__dirname, "public");

module.exports = app => {
    app.get("/:path", ({ params }, res) => {
        let target = "";
        const validPaths = ["exercise", "stats"]
        if (validPaths.some(validPath => validPath === params.path)) {
            target = params.path;
        }
        res.sendFile(join(STATIC_PATH, target + ".html"));
    });

    app.get("/api/workouts", (req, res) => {
        db.Workout.find()
            .then(dbWorkouts => {
                res.json(dbWorkouts);
            });
    });

    app.get("/api/workouts/range", (req, res) => {
        db.Workout.find()
            .then(dbWorkouts => {
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
        db.Workout.findByIdAndUpdate(
            id, {
            $push: { exercises: exercises },
            $inc: { totalDuration: exercises.duration }
        }, { 
            new: true 
        }).then(dbWorkout => {
            res.json(dbWorkout);
        });
    });
}