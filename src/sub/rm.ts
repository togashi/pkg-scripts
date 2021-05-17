#!/usr/bin/env node

import target from './lib/target'
import pkgJson from './lib/package-json'
import { Scripts } from './lib/package-json'

async function main(args: string[], options: Options) {
    const filePath = await target.get(options.package)
    const pj = await pkgJson.load(filePath)
    const pats = args.map(arg => arg.includes('*') ? RegExp(arg.replace(/\*+/g, '.*')) : arg)
    const tobeDeleted = Object.keys(pj.scripts).filter(name => pats.find(pat => pat instanceof RegExp && pat.test(name) || (pat === name)))
    tobeDeleted.forEach(name => {
        delete pj.scripts[name]
    })
    if (options.sort) {
        const sorted: Scripts = {}
        for (const name of Object.keys(pj.scripts).sort()) {
            sorted[name] = pj.scripts[name]
        }
        pj.scripts = sorted
    }
    await pkgJson.save(filePath, pj, options.dryRun)
}

import { Command } from 'commander'
const cli = new Command()

cli.description('remove script')
    .arguments('name <names...>')
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
