#!/usr/bin/env node

import { Command } from 'commander'
const cli = new Command()

function getPath(suffix: string): string {
    return `${__dirname}/${suffix}`
}

cli.version('20210517')
    .description('script manager for package.json')
    .command('list', 'list scripts', { executableFile: getPath('sub/ls.js') }).alias('ls')
    .command('has', 'check existency', { executableFile: getPath('sub/has.js') })
    .command('put', 'put script', { executableFile: getPath('sub/put.js') }).alias('add')
    .command('rename', 'rename script', { executableFile: getPath('sub/mv.js') }).alias('mv')
    .command('remove', 'remove script', { executableFile: getPath('sub/rm.js') }).alias('rm')
    .command('copy', 'copy script', { executableFile: getPath('sub/cp.js') }).alias('cp')

console.debug(getPath('sub/ls.js'))

cli.parse(process.argv)
