#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path'
import * as apiMocker from 'mocker-api'
import * as history from 'connect-history-api-fallback'
import * as dotenv from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware'
import getApp from './app'
import { log } from '../utils'

// 导入环境变量
dotenv.config()

// todo：日志服务、多域名代理支持

export default (): void => {
  const { app, staticServer, config } = getApp()
  const { port, proxy } = config.server

  // 使用 history 解决刷新后报 404 的问题
  app.use(history())

  // 启动静态资源服务
  app.use(staticServer(path.join(config.root, './dist')))

  if (process.env.VUE_APP_USE_MOCKER === 'true') {
    // 临时写法，先跳过签名
    const mocker = apiMocker as any
    // 启动 mock 服务
    mocker(app, path.join(config.root, './mock/index.js'), {
      proxy: {
        '^/mock': '/mock'
      },
      changeHost: true
    })
  }

  // 启动代理服务
  Object.entries(proxy).forEach(([baseUrl, options]) => {
    app.use(baseUrl, createProxyMiddleware(options))
  })

  // 启动自定义的中间件
  try {
    const middleware = require(`${config.root}/server/index.js`)
    if (middleware) {
      middleware(app)
    }
  } catch (error) {
    log.error(error)
  }

  // 启动
  app.listen(port, () => {
    log.ok(`服务启动成功：http://0.0.0.0:${port}`)
  })
}
