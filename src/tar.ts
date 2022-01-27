#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as shell from 'shelljs'
import * as ora from 'ora'
import * as archiver from 'archiver'
import { log, exec } from './utils'

export default async (cmd: Command): Promise<any> => {
  shell.config.silent = true
  // 检查是否安装了 yarn
  try {
    shell.exec('yarn -h')
  } catch (error) {
    log.error('请先全局安装 yarn 依赖')
    process.exit()
  }

  const { build, clean } = cmd as any
  const root = process.cwd()
  // 检查 tar 目录是否存在
  const tarFolder = `${root}/tar`
  if (!fs.existsSync(tarFolder)) {
    fs.mkdirSync(tarFolder)
  }

  const spinning = ora('开始创建临时目录').start()

  // 创建临时目录
  const pkg = require(`${root}/package.json`)
  // 项目名
  const pkgName = pkg.name.split('/').pop()
  // 包目录名
  const tarFolderName = `${pkgName}-${pkg.version}`
  // 包名
  const tarName = `${tarFolderName}.zip`
  // 临时目录
  const cacheTarFolder = `${tarFolder}/${tarFolderName}`
  // 如果存在旧的版本包，先删除
  if (fs.existsSync(cacheTarFolder)) {
    fs.emptyDirSync(cacheTarFolder)
    fs.removeSync(tarName)
  } else {
    fs.mkdirSync(cacheTarFolder)
  }

  // 打包 dist
  if (build) {
    spinning.text = '开始打包 dist，请稍等'
    await exec('yarn build')
  }

  // 复制文件过去
  const files = ['config', 'server', 'mock', 'dist', 'package.json', '.env', '.env.production']
  shell.cp('-R', files, cacheTarFolder)

  // 安装依赖
  spinning.text = '开始安装依赖'
  shell.cd(cacheTarFolder)
  // 如果维护了 nodejs 依赖的包，取出来替换掉 dependencies
  if (pkg.serverDependencies) {
    pkg.dependencies = pkg.serverDependencies
    delete pkg.serverDependencies
    try {
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    } catch (error) {
      log.error(error)
      process.exit(1)
    }
  }
  await exec('yarn install --production')

  // 打包
  shell.cd(tarFolder)

  const output = fs.createWriteStream(tarName)
  const archive = archiver('zip')

  output.on('close', () => {
    // 打包完成，删除缓存目录
    if (clean === 'y') {
      shell.rm('-rf', cacheTarFolder)
    }

    spinning.text = '打包完成'
    spinning.stop()
    log.ok(`打包成功，程序包大小 ${(archive.pointer() / 1024 / 1024).toFixed(2)} M`)
  })

  // 抛出打包错误
  archive.on('error', err => {
    log.error(err.toString())
    process.exit(1)
  })
  archive.pipe(output)

  // 设置打包目录
  archive.directory(cacheTarFolder, false)
  archive.finalize()
}
