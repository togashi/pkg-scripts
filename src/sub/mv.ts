#!/usr/bin/env node

import target from './lib/target'
import pkgJson from './lib/package-json'
import type { Scripts } from './lib/package-json'

async function main(oldName: string, newName: string, options: Options) {
    const filePath = await target.get(options.package)
    const pj = await pkgJson.load(filePath)
    const newScripts: Scripts = {}
    const renamed = Object.keys(pj.scripts).map(name => (name === oldName) ? newName : name)
    const duplicated = renamed.find((v, i, a) => a.indexOf(v) !== i)
    if (duplicated) {
        process.stderr.write('ERROR: script name duplicated due to the rename operation\n')
        process.exit(255)
    }
    for (const name of options.sort ? renamed.sort() : renamed) {
        newScripts[name] = pj.scripts[(name === newName) ? oldName : name]
    }
    pj.scripts = newScripts
    await pkgJson.save(filePath, pj, options.dryRun)
}

import { Command } from 'commander'
const cli = new Command()

cli.description('rename script')
    .arguments('<old-name> <new-name>')
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
