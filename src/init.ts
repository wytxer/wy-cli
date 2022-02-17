#!/usr/bin/env node

import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import * as _ from 'lodash'
import * as ora from 'ora'
import { checkFolder, initGit, log, fileDisplay, defaultProjectTips } from './utils'
import { templates, packageInfo } from './config'

export default (folder: string): void => {
  const root = process.cwd()
  // 工程目录
  const projectFolder = folder ? `${root}/${folder}` : root
  // 工程名称
  const projectName = folder || root.split('/').pop()
  // 清空判断
  checkFolder(projectFolder, () => {
    // 工程类型
    inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择工程类型：',
      choices: templates
    }).then(project => {
      // 变量替换
      inquirer.prompt(packageInfo).then(pkg => {
        const spinner = ora('工程初始化中，请稍等').start()
        initGit(project.type, projectFolder, () => {
          spinner.text = '下载完成，开始生成 package.json'

          // 替换 package.json 中 version、description 和 name 的值
          const pkgPath = `${projectFolder}/package.json`
          fs.writeFileSync(
            pkgPath,
            JSON.stringify({ ...require(pkgPath), ...pkg, name: projectName }, null, 2)
          )

          // 如果是 template-vue2-manage 脚手架，删除里面的模板库
          if (project.type === 'template-vue2-manage') {
            const deleteFiles = [
              '/.git',
              '/.vscode',
              '/src/router/template.js',
              '/src/views/template',
              '/src/views/test'
            ]
            deleteFiles.forEach(file => {
              try {
                fs.removeSync(projectFolder + file)
              } catch (error) {
                console.error(error)
              }
            })
            // 删除对 template.js 的引用，简单点，先通过字符串匹配删除好了
            const replaceFiles = ['/src/router/route-static.js', '/src/router/route-dynamic.js']
            const replaceStrings = [{
              test: /import template from '\.\/template'$/,
              // 插入一个标识，后面替换完了用来删除换行
              value: '$<br>$'
            }, {
              test: /rootRoute\.children = rootRoute\.children\.concat\(template, common\)$/,
              value: 'rootRoute.children = rootRoute.children.concat(common)'
            }]
            // 代码片段替换
            replaceFiles.forEach(file => {
              try {
                const content = fs.readFileSync(projectFolder + file)
                  .toString()
                  .split('\r')
                  .filter(s => s)
                  .map(s => {
                    const rs = replaceStrings.find(str => str.test.test(s))
                    if (rs) {
                      return s.replace(rs.test, rs.value)
                    }
                    return s
                  })
                  // 删除因为替换而多出来的空行
                  .filter(s => !s.includes('$<br>$'))
                  .join('\r')
                fs.writeFileSync(projectFolder + file, content)
              } catch (error) {
                log.error(error)
              }
            })
            // 删除路由里面对模板库的路由配置
            const routerPath = `${projectFolder}/src/router/common.js`
            const routerContent = fs.readFileSync(routerPath).toString().replace(/\/\/ <test>[\s\S]+\/\/ <\/test>/, '')
            fs.writeFileSync(routerPath, routerContent)
          }

          // 如果是组件模板，进行 component-name 的变量替换
          if (project.type.includes('-component')) {
            spinner.text = '开始进行变量替换'
            // 模板变量
            const vars = {
              ComponentName: _.upperFirst(_.camelCase(projectName)),
              componentName: _.camelCase(projectName),
              'component-name': projectName.toLocaleLowerCase()
            }
            fileDisplay(projectFolder, (file: string) => {
              // 过滤以点开头的隐藏文件和资源文件
              const filename = file.split('/').pop()
              if (/(^\..+)|(\.svg|png|jpeg|jpg)/.test(filename)) {
                return
              }
              // 获取文件内容
              let filePath = file
              let content = fs.readFileSync(file).toString()
              Object.keys(vars).forEach(key => {
                const reg = new RegExp(`${key}`, 'g')
                // 文件内容里面的模板变量替换
                if (reg.test(content)) {
                  content = content.replace(reg, vars[key])
                }
                // 文件名修改
                if (reg.test(file)) {
                  filePath = file.replace(reg, `${vars[key]}`)
                  fs.renameSync(file, filePath)
                }
              })
              fs.writeFileSync(filePath, content)
            }, (folder: string) => {
              // 获取文件内容
              let filePath = folder
              Object.keys(vars).forEach(key => {
                const reg = new RegExp(`${key}`, 'g')
                // 文件名修改
                if (reg.test(folder)) {
                  filePath = folder.replace(reg, `${vars[key]}`)
                  fs.renameSync(folder, filePath)
                }
              })
              return filePath
            })
          }

          spinner.stop()
          log.ok('工程初始化成功', false)
          defaultProjectTips(folder)
        })
      })
    })
  })
}
