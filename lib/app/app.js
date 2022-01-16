#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
exports.default = (function () {
    var root = process.cwd();
    var config = require("".concat(root, "/build/project.config.js"));
    var app = express();
    config.root = root;
    return {
        app: app,
        staticServer: express.static,
        config: config
    };
});
