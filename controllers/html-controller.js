const { join } = require("path");

const STATIC_PATH = join(__dirname, "..", "public");

function isValidPath(target) {
    const validPaths = ["", "exercise", "stats"];
    return validPaths.includes(target);
}

module.exports = app => {
    app.get("/:path", ({ params }, res) => {
        let target = "";
        if (isValidPath(params.path)) {
            target = params.path;
        } else {
            return res.status(404).send("Cannot /GET " + params.path);
        }
        res.sendFile(join(STATIC_PATH, target + ".html"));
    });
}