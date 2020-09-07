process.env.NODE_ENV = process.env.NODE_ENV || "test";

describe("Fitness tracker application", function() {
    require("./html-controller.test.js");
    require("./Workout_model.test.js");
});