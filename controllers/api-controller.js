const db = require("../models");

module.exports = app => {
    app.get("/api/workouts", (req, res) => {
        // res.json({message: "This is the /api/workouts route"});
        db.Workout.find()
            .sort({ day: 1 })
            .then(dbWorkouts => {
                res.json(dbWorkouts);
            }).catch(error => {
                console.error(error);
                res.status(500).json({ message: "Server error" });
            });
    });

    app.get("/api/workouts/range", (req, res) => {
        db.Workout.find()
            .then(dbWorkouts => {
                res.json(dbWorkouts);
            }).catch(error => {
                console.error(error);
                res.status(500).json({ message: "Server error" });
            });
    });

    app.post("/api/workouts", (req, res) => {
        const newWorkout = new db.Workout;
        newWorkout.save()
            .then(dbWorkout => {
                res.json(dbWorkout);
            }).catch(error => {
                console.log(error);
                res.status(500).json({ message: "Server error" });
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
        }).catch(error => {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        });
    });
}