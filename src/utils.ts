#!/usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import * as ora from 'ora'
import * as shell from 'shelljs'
import { templateRootFolder } from './config'

interface ExecException extends Error {
  cmd?: string;
  killed?: boolean;
  code?: number;
  signal?: NodeJS.Signals;
}

// 统一的日志输出
export const log = {
  info: (text: string, br = true): void => {
    console.log()
    console.log(chalk.blue('info：') + text)
    if (br) console.log()
  },
  ok: (text: string, br = true): void => {
    console.log()
    console.log(chalk.green('Success：') + text)
    if (br) console.log()
  },
  error: (text: string, key = true, br = true): void => {
    console.log()
    console.log(chalk.red(key ? `Error：${text}` : text))
    if (br) console.log()
  },
  cmd: (text: string): void => {
    console.log(`${chalk.gray('$')} ${chalk.cyan(text)}`)
  }
}

// 默认的工程脚本提示
export const defaultProjectTips = (filename?: string): void => {
  console.log()
  if (filename) {
    log.cmd(`cd ${filename} && yarn install`)
  } else {
    log.cmd('yarn install')
  }
  log.cmd('yarn run dev')
  log.cmd('yarn run build')
  console.log()
}

// 判断目录是否为空
export const checkFolder = (filePath: string, fn: () => void): boolean => {
  let cover = false
  fs.readdir(filePath, (error: NodeJS.ErrnoException, files: string[]) => {
    if (error && error.code !== 'ENOENT') {
      log.error(error.toString(), true)
      process.exit()
    }
    // 确认是否清空
    if (!(!files || !files.length)) {
      inquirer.prompt({
        message: '检测到该文件夹下有文件，是否要清空？',
        type: 'confirm',
        name: 'status',
        default: false
      }).then(res => {
        cover = res.status
        if (cover) {
          const spinner = ora(`正在删除 ${chalk.cyan(filePath.split('/').pop())} 中，请稍等`).start()
          try {
            fs.emptyDirSync(filePath)
          } catch (error) {
            log.error(error)
            process.exit()
          }
          spinner.stop()
        }
        fn()
      })
    } else {
      fn()
    }
  })
  return cover
}

// 递归获取所有文件并进行操作
export const fileDisplay = (
  filePath: string,
  handleFile: (file: string) => void,
  handleFolder: (folder: string) => string
): void => {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (error: NodeJS.ErrnoException, files: string[]) => {
    if (error) {
      log.error(error.toString(), false)
      process.exit()
    } else {
      // 遍历读取到的文件列表
      files.forEach((filename: string) => {
        // 获取当前文件的绝对路径
        const file = path.join(filePath, filename)
        // 根据文件路径获取文件信息
        fs.stat(file, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
          if (err) {
            log.error(err.toString(), false)
            process.exit()
          } else {
            const isFile = stats.isFile()
            const isFolder = stats.isDirectory()
            if (isFile) {
              handleFile(file)
            }
            if (isFolder) {
              fileDisplay(handleFolder(file), handleFile, handleFolder)
            }
          }
        })
      })
    }
  })
}

// 初始化远程 git 仓库
export const initGit = async (templateName: string, projectFolder: string, fn: () => void): Promise<void> => {
  // 检查 git 命令是否存在
  shell.config.silent = true
  try {
    shell.exec('git -h')
  } catch (error) {
    log.error('请先安装 git 命令')
    process.exit()
  }
  // 检查模板根路径是否存在
  if (!fs.existsSync(templateRootFolder)) {
    fs.mkdirSync(templateRootFolder)
  }

  // git 仓库地址
  const gitRemote = `git@github.com:wytxer/${templateName}.git`
  // 本地缓存地址
  const localFolder = path.join(templateRootFolder, templateName)
  // 如果本地不存在模板，重新 clone 下来
  if (!fs.existsSync(localFolder)) {
    console.log()
    console.log('初始化模板中，有点慢请稍等~')
    shell.cd(templateRootFolder)
    try {
      shell.exec(`git clone ${gitRemote}`)
    } catch (error) {
      log.error('模板初始化失败')
      console.error(error)
      process.exit()
    }
  }

  // 到目标目录
  shell.cd(localFolder)
  // 拉取一下
  shell.exec('git pull')

  // 复制到目标目录
  try {
    fs.copySync(localFolder, projectFolder, {
      overwrite: true
    })
    // 删除 .git 文件
    fs.removeSync(path.join(projectFolder, '/.git/'))
  } catch (error) {
    log.error('模板初始化失败')
    console.error(error)
    process.exit()
  }
  fn()
}

// 异步的 exec，将子进程转成同步进程
export const exec = (cmd: string, options = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stdout = shell.exec(cmd, options, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(error)
      }
      resolve({ error, stdout, stderr })
    })
    stdout.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
      resolve({ code, signal })
    })
  })
}
