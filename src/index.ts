#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { Command } from 'commander'
import * as updater from 'update-notifier'

import init from './init'
import server from './server'
import tar from './tar'
import app from './app'

const program = new Command()

// 自动更新提示
const pkg = require('../package.json')
updater({ pkg }).notify()

program
  .command('init [dir]')
  .description('初始化工程')
  .action(init)

program
  .command('server [dir]')
  .description('启动一个 HTTP 静态资源服务')
  .option('-a, --address <address>', '访问地址')
  .option('-p, --port <port>', '服务端口号')
  .option('-P, --proxy <proxy>', '代理服务器的地址')
  .option('-o, --open <open>', '启动服务后自动打开窗口')
  .option('-d, <showFolder>', '显示文件夹列表')
  .action(server)

program
  .command('tar')
  .description('打包')
  .option('-b, --build', '重新打包')
  .option('-c, --clean <clean>', '打包完成后是否删除缓存目录', 'y')
  .action(tar)

program
  .command('app')
  .description('启动部署服务')
  .action(app)

program.parse(process.argv)
