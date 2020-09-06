const db = require("../models");

module.exports = app => {
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