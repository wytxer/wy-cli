#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var apiMocker = require("mocker-api");
var history = require("connect-history-api-fallback");
var http_proxy_middleware_1 = require("http-proxy-middleware");
var app_1 = require("./app");
var utils_1 = require("../utils");
exports.default = (function () {
    var _a = (0, app_1.default)(), app = _a.app, staticServer = _a.staticServer, config = _a.config;
    var _b = config.server, port = _b.port, production = _b.proxyHost.production;
    app.use(history());
    app.use(staticServer(path.join(config.root, './dist')));
    if (config.client.env.MOCKER) {
        var mocker = apiMocker;
        mocker(app, path.join(config.root, './mock/index.js'), {
            proxy: {
                '^/mock': '/mock'
            },
            changeHost: true
        });
    }
    Object.entries(production).forEach(function (_a) {
        var baseUrl = _a[0], options = _a[1];
        app.use(baseUrl, (0, http_proxy_middleware_1.createProxyMiddleware)(options));
    });
    try {
        var middleware = require("".concat(config.root, "/server/index.js"));
        if (middleware) {
            middleware(app);
        }
    }
    catch (error) {
        utils_1.log.error(error);
    }
    app.listen(port, function () {
        utils_1.log.ok("\u670D\u52A1\u542F\u52A8\u6210\u529F\uFF1Ahttp://127.0.0.1:".concat(port));
    });
});
