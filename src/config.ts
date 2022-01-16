#!/usr/bin/env node

import * as path from 'path'
import * as os from 'os'

// 工程所在的根目录
export const rootFolder = path.join(__dirname, '..')
// 模板缓存的根目录
export const templateRootFolder = path.join(os.homedir(), '.wy')
// 脚手架模板列表
export const templates = [{
  name: '后台管理系统（Vue.js 2.x + Vue Router + Vuex + Ant Design Vue）',
  value: 'template-vue2-manage'
}, {
  name: '组件（Vue.js 2.x + Vue Router + Vuex）',
  value: 'template-vue2-component'
}, {
  name: '示例（Vue.js 2.x + Vue Router + Vuex）',
  value: 'template-vue2-demo'
}, {
  name: '后台（Node.js + Egg.js + Sequelize）',
  value: 'template-node-egg'
}, {
  name: '命令行工具（Node.js + TypeScript + Commander）',
  value: 'template-node-cli'
}]

// 需要动态写入的 package.json 信息
export const packageInfo = [{
  type: 'input',
  name: 'version',
  message: '请输入项目版本号',
  default: '1.0.0'
}, {
  type: 'input',
  name: 'description',
  message: '请填写项目描述',
  default: '项目描述'
}]
