const app = require("express")();
const mongoose = require("mongoose");
// const db = require("../models");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/test"

const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-http"));

require("../controllers")(app);

describe("API routes", function () {
    // This is used to have a consistent _id and to check that the totalDuration increases as expected
    const currentTestObject = {};

    this.timeout(30000);
    this.beforeAll(done => {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {
            mongoose.connection.dropDatabase();
            done();
        });
    });

    this.afterAll(() => {
        mongoose.disconnect();
    });

    it("Returns a JSON array on the GET '/api/workouts' route", function (done) {
        chai.request(app)
            .get("/api/workouts")
            .then(response => {
                expect(response.status).to.equal(200);
                expect(response.type).to.be.string("application/json");
                expect(response.body).to.be.an("Array");
                done();
            });
    });

    it("Returns a JSON array on the GET '/api/workouts/range' route", function (done) {
        chai.request(app)
            .get("/api/workouts/range")
            .then(response => {
                expect(response.status).to.equal(200);
                expect(response.type).to.be.string("application/json");
                expect(response.body).to.be.an("Array");
                done();
            });
    });

    it("Posts a new workout on POST '/api/workouts'", function (done) {
        chai.request(app)
            .post("/api/workouts")
            .then(({ status, type, body }) => {
                expect(status).to.equal(200);
                expect(type).to.be.string("application/json");
                expect(body).to.be.an("Object");
                expect(body._id).to.not.be.undefined;
                currentTestObject.workout = body;
                done();
            });
    });

    it("Increases the totalDuration when you add an exercise with PUT /api/workouts/:id", function (done) {
        const duration = 10;
        const workoutData = {
            type: "cardio",
            name: "Running",
            distance: 10,
            duration: duration
        };
        chai.request(app)
            .put("/api/workouts/" + currentTestObject.workout._id)
            .send(workoutData)
            .then(({ status, type, body }) => {
                expect(status).to.equal(200);
                expect(type).to.be.string("application/json");
                expect(body).to.be.an("Object");
                expect(body.exercises.length).to.equal(1);
                expect(body.totalDuration).to.equal(duration);
                currentTestObject.workout = body;
                done();
            });
    });
});
