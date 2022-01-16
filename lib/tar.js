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
        while (_) try {
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
var fs = require("fs-extra");
var shell = require("shelljs");
var ora = require("ora");
var archiver = require("archiver");
var utils_1 = require("./utils");
exports.default = (function (cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var build, root, tarFolder, spinning, pkg, pkgName, tarFolderName, tarName, cacheTarFolder, files, output, archive;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                shell.config.silent = true;
                try {
                    shell.exec('yarn -h');
                }
                catch (error) {
                    utils_1.log.error('请先全局安装 yarn 依赖');
                    process.exit();
                }
                build = cmd.build;
                root = process.cwd();
                tarFolder = "".concat(root, "/tar");
                if (!fs.existsSync(tarFolder)) {
                    fs.mkdirSync(tarFolder);
                }
                spinning = ora('开始创建临时目录').start();
                pkg = require("".concat(root, "/package.json"));
                pkgName = pkg.name.split('/').pop();
                tarFolderName = "".concat(pkgName, "-").concat(pkg.version);
                tarName = "".concat(tarFolderName, ".zip");
                cacheTarFolder = "".concat(tarFolder, "/").concat(tarFolderName);
                if (fs.existsSync(cacheTarFolder)) {
                    fs.emptyDirSync(cacheTarFolder);
                    fs.removeSync(tarName);
                }
                else {
                    fs.mkdirSync(cacheTarFolder);
                }
                shell.cd(root);
                if (!build) return [3, 2];
                spinning.text = '开始打包 dist，请稍等';
                return [4, shell.exec('yarn run build')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                files = ['build', 'server', 'mock', 'dist', 'package.json'];
                shell.cp('-R', files, cacheTarFolder);
                spinning.text = '开始安装依赖';
                shell.cd(cacheTarFolder);
                if (pkg.nodeApp) {
                    pkg.dependencies = pkg.nodeApp;
                    delete pkg.nodeApp;
                    try {
                        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
                    }
                    catch (error) {
                        utils_1.log.error(error);
                        process.exit(1);
                    }
                }
                return [4, shell.exec('yarn install --production')];
            case 3:
                _a.sent();
                shell.cd(tarFolder);
                output = fs.createWriteStream(tarName);
                archive = archiver('zip');
                output.on('close', function () {
                    shell.rm('-rf', tarFolderName);
                    spinning.text = '打包完成';
                    spinning.stop();
                    utils_1.log.ok("\u6253\u5305\u6210\u529F\uFF0C\u7A0B\u5E8F\u5305\u5927\u5C0F ".concat((archive.pointer() / 1024 / 1024).toFixed(2), " M"));
                });
                archive.on('error', function (err) {
                    utils_1.log.error(err.toString());
                    process.exit(1);
                });
                archive.pipe(output);
                archive.directory(cacheTarFolder, false);
                archive.finalize();
                return [2];
        }
    });
}); });