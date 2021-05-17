#!/usr/bin/env node

import { Command } from 'commander'
const cli = new Command()

cli.version('20210517')
    .description('script manager for package.json')
    .command('list', 'list scripts', { executableFile: 'dist/sub/ls.js' }).alias('ls')
    .command('has', 'check existency', { executableFile: 'dist/sub/has.js' })
    .command('put', 'put script', { executableFile: 'dist/sub/put.js' }).alias('add')
    .command('rename', 'rename script', { executableFile: 'dist/sub/mv.js' }).alias('mv')
    .command('remove', 'remove script', { executableFile: 'dist/sub/rm.js' }).alias('rm')
    .command('copy', 'copy script', { executableFile: 'dist/sub/cp.js' }).alias('cp')

cli.parse(process.argv)
