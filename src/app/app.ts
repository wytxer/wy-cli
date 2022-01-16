#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import * as express from 'express'
import * as serveStatic from 'serve-static'

export interface App {
  app: express.Application;
  staticServer: typeof serveStatic;
  config: {
    [propName: string]: any;
  };
}

export default (): App => {
  const root = process.cwd()
  const config = require(`${root}/build/project.config.js`)
  const app = express()

  // 将当前的 cwd() 地址内置进去
  config.root = root

  return {
    app,
    staticServer: express.static as any,
    config
  }
}
