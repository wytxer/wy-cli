#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs");
var utils_1 = require("./utils");
var config_1 = require("./config");
exports.default = (function (dir, cmd) {
    var _a = cmd, address = _a.address, port = _a.port, proxy = _a.proxy, open = _a.open, showFolder = _a.showFolder;
    var order = "".concat(config_1.rootFolder, "/node_modules/.bin/http-server");
    if (dir) {
        order += " ".concat(dir);
    }
    if (address) {
        order += " -a ".concat(address);
    }
    if (port) {
        order += " -p ".concat(port);
    }
    if (proxy) {
        order += " -P ".concat(proxy);
    }
    if (open) {
        order += ' -o';
    }
    if (showFolder) {
        order += "-d ".concat(showFolder);
    }
    try {
        shell.exec(order);
    }
    catch (error) {
        utils_1.log.error(error);
    }
});
