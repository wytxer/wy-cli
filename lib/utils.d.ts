#!/usr/bin/env node
export declare const log: {
    info: (text: string, br?: boolean) => void;
    ok: (text: string, br?: boolean) => void;
    error: (text: string, key?: boolean, br?: boolean) => void;
    cmd: (text: string) => void;
};
export declare const defaultProjectTips: (filename?: string) => void;
export declare const checkFolder: (filePath: string, fn: () => void) => boolean;
export declare const fileDisplay: (filePath: string, handleFile: (file: string) => void, handleFolder: (folder: string) => string) => void;
export declare const initGit: (templateName: string, projectFolder: string, fn: () => void) => Promise<void>;
export declare const exec: (cmd: string, options?: {}) => Promise<any>;
