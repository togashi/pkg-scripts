#!/usr/bin/env node

import target from './lib/target'
import pkgJson from './lib/package-json'
import type { Scripts } from './lib/package-json'

async function main(newName: string, commandLine: string, options: Options) {
    const filePath = await target.get(options.package)
    const pj = await pkgJson.load(filePath)
    const names = [...Object.keys(pj.scripts), newName]
    const newScripts: Scripts = {}
    for (const name of options.sort ? names.sort() : names) {
        newScripts[name] = (name === newName) ? commandLine : pj.scripts[name]
    }
    pj.scripts = newScripts
    await pkgJson.save(filePath, pj, options.dryRun)
}

import { Command } from 'commander'
const cli = new Command()

cli.description('put script')
    .arguments('<name> <command-line>')
    .option('-p, --package <location>', 'package directory or actual package.json', './package.json')
    .option('-s, --sort', 'sort scripts by name', false)
    .option('-D, --dry-run')
    .action(main)

cli.parseAsync(process.argv)

interface Options {
    package: string
    sort: boolean
    dryRun: boolean
    [more: string]: unknown
}
