// setting up test requirements
const chai = require("chai");
chai.use(require("chai-http"));
const expect = chai.expect;

// setting up server requirements
const app = require("express")();
require("../controllers")(app);

module.exports = describe("HTML routes", function () {
    it("Sends '404' on a bad request", function (done) {
        chai.request(app)
            .get("/love")
            .then(response => {
                expect(response.error).to.not.be.undefined;
                expect(response.error.status).to.equal(404);
                done();
            });
    });

    it("Has a static folder", function (done) {
        chai.request(app)
            .get("/index.js")
            .end((err, { status, type }) => {
                expect(status).to.equal(200);
                expect(type).to.have.string("application/javascript");
                done();
            });
    });

    it("Has a route for '/stats'", function (done) {
        chai.request(app)
            .get("/stats")
            .then(response => {
                expect(response.status).to.equal(200);
                expect(response.type).to.have.string("text/html");
                done();
            });
    });
});