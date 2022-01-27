#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageInfo = exports.templates = exports.templateRootFolder = exports.rootFolder = void 0;
var path = require("path");
var os = require("os");
exports.rootFolder = path.join(__dirname, '..');
exports.templateRootFolder = path.join(os.homedir(), '.wy');
exports.templates = [{
        name: '中后台前端脚手架（Vue.js 2.x + Vue Router + Vuex + Ant Design Vue）',
        value: 'template-vue2-manage'
    }, {
        name: '组件（Vue.js 2.x + Vue Router + Vuex）',
        value: 'template-vue2-component'
    }, {
        name: '示例（Vue.js 2.x + Vue Router + Vuex）',
        value: 'template-vue2-demo'
    }, {
        name: '后台脚手架（Node.js + Egg.js + Sequelize）',
        value: 'template-node-egg'
    }, {
        name: '命令行工具（Node.js + TypeScript + Commander）',
        value: 'template-node-cli'
    }];
exports.packageInfo = [{
        type: 'input',
        name: 'version',
        message: '请输入项目版本号',
        default: '1.0.0'
    }, {
        type: 'input',
        name: 'description',
        message: '请填写项目描述',
        default: '项目描述'
    }];
