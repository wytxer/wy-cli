#!/usr/bin/env node

import { Command } from 'commander'
import * as shell from 'shelljs'
import { log } from './utils'
import { rootFolder } from './config'

export default (dir: string, cmd: Command): void => {
  const { address, port, proxy, open, showFolder } = cmd as any
  // http-server 命令路径
  let order = `${rootFolder}/node_modules/.bin/http-server`

  // 拼接服务目录
  if (dir) {
    order += ` ${dir}`
  }
  // 如果指定了访问地址
  if (address) {
    order += ` -a ${address}`
  }
  // 如果指定了端口号
  if (port) {
    order += ` -p ${port}`
  }
  // 如果指定了代理服务器的地址
  if (proxy) {
    order += ` -P ${proxy}`
  }
  // 如果指定了自动打开窗口
  if (open) {
    order += ' -o'
  }
  // 显示文件夹列表
  if (showFolder) {
    order += `-d ${showFolder}`
  }

  try {
    shell.exec(order)
  } catch (error) {
    log.error(error)
  }
}
