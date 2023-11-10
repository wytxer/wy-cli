#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.initGit = exports.fileDisplay = exports.checkFolder = exports.defaultProjectTips = exports.log = void 0;
var fs = require("fs-extra");
var path = require("path");
var inquirer = require("inquirer");
var chalk = require("chalk");
var ora = require("ora");
var shell = require("shelljs");
var config_1 = require("./config");
exports.log = {
    info: function (text, br) {
        if (br === void 0) { br = true; }
        console.log();
        console.log(chalk.blue('info：') + text);
        if (br)
            console.log();
    },
    ok: function (text, br) {
        if (br === void 0) { br = true; }
        console.log();
        console.log(chalk.green('Success：') + text);
        if (br)
            console.log();
    },
    error: function (text, key, br) {
        if (key === void 0) { key = true; }
        if (br === void 0) { br = true; }
        console.log();
        console.log(chalk.red(key ? "Error\uFF1A".concat(text) : text));
        if (br)
            console.log();
    },
    cmd: function (text) {
        console.log("".concat(chalk.gray('$'), " ").concat(chalk.cyan(text)));
    }
};
var defaultProjectTips = function (filename) {
    console.log();
    if (filename) {
        exports.log.cmd("cd ".concat(filename, " && yarn install"));
    }
    else {
        exports.log.cmd('yarn install');
    }
    exports.log.cmd('yarn run dev');
    exports.log.cmd('yarn run build');
    console.log();
};
exports.defaultProjectTips = defaultProjectTips;
var checkFolder = function (filePath, fn) {
    var cover = false;
    fs.readdir(filePath, function (error, files) {
        if (error && error.code !== 'ENOENT') {
            exports.log.error(error.toString(), true);
            process.exit();
        }
        if (!(!files || !files.length)) {
            inquirer.prompt({
                message: '检测到该文件夹下有文件，是否要清空？',
                type: 'confirm',
                name: 'status',
                default: false
            }).then(function (res) {
                cover = res.status;
                if (cover) {
                    var spinner = ora("\u6B63\u5728\u5220\u9664 ".concat(chalk.cyan(filePath.split('/').pop()), " \u4E2D\uFF0C\u8BF7\u7A0D\u7B49")).start();
                    try {
                        fs.emptyDirSync(filePath);
                    }
                    catch (error) {
                        exports.log.error(error);
                        process.exit();
                    }
                    spinner.stop();
                }
                fn();
            });
        }
        else {
            fn();
        }
    });
    return cover;
};
exports.checkFolder = checkFolder;
var fileDisplay = function (filePath, handleFile, handleFolder) {
    fs.readdir(filePath, function (error, files) {
        if (error) {
            exports.log.error(error.toString(), false);
            process.exit();
        }
        else {
            files.forEach(function (filename) {
                var file = path.join(filePath, filename);
                fs.stat(file, function (err, stats) {
                    if (err) {
                        exports.log.error(err.toString(), false);
                        process.exit();
                    }
                    else {
                        var isFile = stats.isFile();
                        var isFolder = stats.isDirectory();
                        if (isFile) {
                            handleFile(file);
                        }
                        if (isFolder) {
                            (0, exports.fileDisplay)(handleFolder(file), handleFile, handleFolder);
                        }
                    }
                });
            });
        }
    });
};
exports.fileDisplay = fileDisplay;
var initGit = function (templateName, projectFolder, fn) { return __awaiter(void 0, void 0, void 0, function () {
    var gitRemote, localFolder;
    return __generator(this, function (_a) {
        shell.config.silent = true;
        try {
            shell.exec('git -h');
        }
        catch (error) {
            exports.log.error('请先安装 git 命令');
            process.exit();
        }
        if (!fs.existsSync(config_1.templateRootFolder)) {
            fs.mkdirSync(config_1.templateRootFolder);
        }
        gitRemote = "https://github.com/wytxer/".concat(templateName, ".git");
        localFolder = path.join(config_1.templateRootFolder, templateName);
        if (!fs.existsSync(localFolder)) {
            console.log();
            console.log('初始化模板中，有点慢请稍等~');
            shell.cd(config_1.templateRootFolder);
            try {
                shell.exec("git clone ".concat(gitRemote));
            }
            catch (error) {
                exports.log.error('模板初始化失败');
                console.error(error);
                process.exit();
            }
        }
        shell.cd(localFolder);
        shell.exec('git pull');
        try {
            fs.copySync(localFolder, projectFolder, {
                overwrite: true
            });
            fs.removeSync(path.join(projectFolder, '/.git/'));
        }
        catch (error) {
            exports.log.error('模板初始化失败');
            console.error(error);
            process.exit();
        }
        fn();
        return [2];
    });
}); };
exports.initGit = initGit;
var exec = function (cmd, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var stdout = shell.exec(cmd, options, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            resolve({ error: error, stdout: stdout, stderr: stderr });
        });
        stdout.on('exit', function (code, signal) {
            resolve({ code: code, signal: signal });
        });
    });
};
exports.exec = exec;
