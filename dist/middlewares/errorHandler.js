"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const shared_modules_1 = require("../utils/shared-modules");
function default_1(err, req, res, next) {
    const statusCode = err.status || 500;
    if (err instanceof shared_modules_1.TransactionError)
        console.log(err.getErrorDetail());
    else
        console.log(err);
    res.status(statusCode).send(err.message);
}
;
