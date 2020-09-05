const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
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
  this.totalDuration = 0;
  this.exercises.forEach(exercise => this.totalDuration += exercise.duration);
}

module.exports = Workout;