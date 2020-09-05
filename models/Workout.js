const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: Date,
  exercises: [
    {
      type: Object
    }
  ],
  totalDuration: {
    type: Number,
    default: 0
  }
});

const Workout = mongoose.model("Workout", WorkoutSchema);

WorkoutSchema.methods.setTotalWorkoutDuration = function () {
  this.totalDuration = this.exercises.reduce((exerciseA, exerciseB) => exerciseA.duration + exerciseB.duration);
}

module.exports = Workout;