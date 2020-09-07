process.env.NODE_ENV = process.env.NODE_ENV || "test";

describe("Fitness tracker web app", function() {
    require("./Workout_model.test.js");
    require("./html-controller.test.js");
    require("./api-controller.test.js");
});