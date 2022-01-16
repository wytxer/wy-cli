#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var inquirer = require("inquirer");
var _ = require("lodash");
var ora = require("ora");
var utils_1 = require("./utils");
var config_1 = require("./config");
exports.default = (function (folder) {
    var root = process.cwd();
    var projectFolder = folder ? "".concat(root, "/").concat(folder) : root;
    var projectName = folder || root.split('/').pop();
    (0, utils_1.checkFolder)(projectFolder, function () {
        inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择工程类型：',
            choices: config_1.templates
        }).then(function (project) {
            inquirer.prompt(config_1.packageInfo).then(function (pkg) {
                var spinner = ora('工程初始化中，请稍等').start();
                (0, utils_1.initGit)(project.type, projectFolder, function () {
                    spinner.text = '下载完成，开始生成 package.json';
                    var pkgPath = "".concat(projectFolder, "/package.json");
                    fs.writeFileSync(pkgPath, JSON.stringify(__assign(__assign(__assign({}, require(pkgPath)), pkg), { name: projectName }), null, 2));
                    if (project.type === 'template-vue2-manage') {
                        var deleteFiles = [
                            '/.git',
                            '/.vscode',
                            '/src/router/template.js',
                            '/src/views/template',
                            '/src/views/test'
                        ];
                        deleteFiles.forEach(function (file) {
                            try {
                                fs.removeSync(projectFolder + file);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        });
                        var replaceFiles = ['/src/router/route-static.js', '/src/router/route-dynamic.js'];
                        var replaceStrings_1 = [{
                                test: /import template from '\.\/template'$/,
                                value: '$<br>$'
                            }, {
                                test: /rootRoute\.children = rootRoute\.children\.concat\(template, common\)$/,
                                value: 'rootRoute.children = rootRoute.children.concat(common)'
                            }];
                        replaceFiles.forEach(function (file) {
                            try {
                                var content = fs.readFileSync(projectFolder + file)
                                    .toString()
                                    .split('\r')
                                    .filter(function (s) { return s; })
                                    .map(function (s) {
                                    var rs = replaceStrings_1.find(function (str) { return str.test.test(s); });
                                    if (rs) {
                                        return s.replace(rs.test, rs.value);
                                    }
                                    return s;
                                })
                                    .filter(function (s) { return !s.includes('$<br>$'); })
                                    .join('\r');
                                fs.writeFileSync(projectFolder + file, content);
                            }
                            catch (error) {
                                utils_1.log.error(error);
                            }
                        });
                        var routerPath = "".concat(projectFolder, "/src/router/common.js");
                        var routerContent = fs.readFileSync(routerPath).toString().replace(/\/\/ <test>[\s\S]+\/\/ <\/test>/, '');
                        fs.writeFileSync(routerPath, routerContent);
                    }
                    if (project.type.includes('-component')) {
                        spinner.text = '开始进行变量替换';
                        var vars_1 = {
                            ComponentName: _.upperFirst(_.camelCase(projectName)),
                            componentName: _.camelCase(projectName),
                            'component-name': projectName.toLocaleLowerCase()
                        };
                        (0, utils_1.fileDisplay)(projectFolder, function (file) {
                            var filename = file.split('/').pop();
                            if (/(^\..+)|(\.svg|png|jpeg|jpg)/.test(filename)) {
                                return;
                            }
                            var filePath = file;
                            var content = fs.readFileSync(file).toString();
                            Object.keys(vars_1).forEach(function (key) {
                                var reg = new RegExp("".concat(key), 'g');
                                if (reg.test(content)) {
                                    content = content.replace(reg, vars_1[key]);
                                }
                                if (reg.test(file)) {
                                    filePath = file.replace(reg, "".concat(vars_1[key]));
                                    fs.renameSync(file, filePath);
                                }
                            });
                            fs.writeFileSync(filePath, content);
                        }, function (folder) {
                            var filePath = folder;
                            Object.keys(vars_1).forEach(function (key) {
                                var reg = new RegExp("".concat(key), 'g');
                                if (reg.test(folder)) {
                                    filePath = folder.replace(reg, "".concat(vars_1[key]));
                                    fs.renameSync(folder, filePath);
                                }
                            });
                            return filePath;
                        });
                    }
                    spinner.stop();
                    utils_1.log.ok('工程初始化成功', false);
                    (0, utils_1.defaultProjectTips)(folder);
                });
            });
        });
    });
});
