const { join } = require("path");

const STATIC_PATH = join(__dirname, "..", "public");

function isValidPath(target) {
    const validPaths = ["exercise", "stats"];
    return validPaths.includes(target);
}

module.exports = app => {
    app.get("/:path", ({ params }, res) => {
        let target = "";
        if (isValidPath(params.path)) {
            target = params.path;
        }
        res.sendFile(join(STATIC_PATH, target + ".html"));
    });

    app.get("*", (req, res, next) => {
        res.status(404).send("404, path not found");
    });
}