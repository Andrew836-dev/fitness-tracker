const Workout = require("../models/Workout");
const { expect } = require("chai");

describe("The Workout model", function () {
    it("Sets totalDuration to 0 on creation", function() {
        const newWorkout = new Workout;
        expect(newWorkout.totalDuration).to.equal(0);
    });
});