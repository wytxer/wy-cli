#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var updater = require("update-notifier");
var init_1 = require("./init");
var server_1 = require("./server");
var tar_1 = require("./tar");
var app_1 = require("./app");
var program = new commander_1.Command();
var pkg = require('../package.json');
updater({ pkg: pkg }).notify();
program
    .command('init [dir]')
    .description('初始化工程')
    .action(init_1.default);
program
    .command('server [dir]')
    .description('启动一个 HTTP 静态资源服务')
    .option('-a, --address <address>', '访问地址')
    .option('-p, --port <port>', '服务端口号')
    .option('-P, --proxy <proxy>', '代理服务器的地址')
    .option('-o, --open <open>', '启动服务后自动打开窗口')
    .option('-d, <showFolder>', '显示文件夹列表')
    .action(server_1.default);
program
    .command('tar')
    .description('打包')
    .option('-b, --build', '重新打包')
    .action(tar_1.default);
program
    .command('app')
    .description('启动部署服务')
    .action(app_1.default);
program.parse(process.argv);
