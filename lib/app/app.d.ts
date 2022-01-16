#!/usr/bin/env node
import * as express from 'express';
import * as serveStatic from 'serve-static';
export interface App {
    app: express.Application;
    staticServer: typeof serveStatic;
    config: {
        [propName: string]: any;
    };
}
declare const _default: () => App;
export default _default;
