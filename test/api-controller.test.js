const express = require("express");
const app = express();

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/test"

const chai = require("chai");
const expect = chai.expect;
const http = require("chai-http");
chai.use(http);

require("../controllers")(app);

describe("API routes", function () {
    // This is used to have a consistent _id and to check that the totalDuration increases as expected
    let currentTestWorkout = {};

    this.timeout(30000);
    this.beforeAll(done => {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {
            mongoose.connection.dropCollection("workouts");
            done();
        });
    });

    this.afterAll(() => {
        mongoose.disconnect();
    });

    it("Returns a new workout on POST '/api/workouts'", function (done) {
        chai.request(app)
            .post("/api/workouts")
            .then(({ status, type, body }) => {
                expect(status).to.equal(200);
                expect(type).to.be.string("application/json");
                expect(body).to.be.an("Object");
                expect(body.exercises.length).to.equal(0);
                expect(body._id).to.not.be.undefined;
                currentTestWorkout = body;
                done();
            });
    });

    it("Increases the totalDuration when you add an exercise with PUT /api/workouts/:id", function (done) {
        const duration = 10;
        const testExercise = {
            type: "cardio",
            name: "Running",
            distance: 10,
            duration: duration
        };
        chai.request(app)
            .put("/api/workouts/" + currentTestWorkout._id)
            .send(testExercise)
            .then(({ status, type, body }) => {
                expect(status).to.equal(200);
                expect(type).to.be.string("application/json");
                expect(body).to.be.an("Object");
                expect(body.exercises.length).to.equal(1);
                expect(body.totalDuration).to.equal(duration);
                currentTestWorkout = body;
                done();
            });
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

    it("GET '/api/workouts' orders the JSON array by the newest 'day' last", function (done) {
        chai.request(app)
            .post("/api/workouts")
            .then(postResponse => {
                expect(postResponse.status).to.equal(200);
                chai.request(app)
                    .get("/api/workouts")
                    .then(getResponse => {
                        expect(getResponse.status).to.equal(200);
                        const lastIndex = getResponse.body.length - 1;
                        getResponse.body.forEach((workout, index) => {
                            if (index < lastIndex) {
                                expect(Date.parse(getResponse.body[lastIndex].day)).to.be.greaterThan(Date.parse(workout.day));
                            }
                        });
                        done();
                    });
            });
    })

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

});
