#!/usr/bin/env node

import target from './lib/target'
import pkgJson from './lib/package-json'

async function main(options: Options) {
    const filePath = await target.get(options.package)
    const { scripts } = await pkgJson.load(filePath)
    const names = Object.keys(scripts)
    const maxLength = names.reduce((p: number, c: string) => c.length > p ? c.length : p, 0)
    for (const name of options.sort ? names.sort() : names) {
        const padded = name.padEnd(maxLength, ' ')
        process.stdout.write(`${padded} : ${scripts[name]}\n`)
    }
}

import { Command } from 'commander'
const cli = new Command()

cli.description('list script names and command-lines')
    .option('-p, --package <location>', 'package directory or actual package.json', './package.json')
    .option('-s, --sort', 'sort scripts by name', false)
    .action(main)

cli.parseAsync(process.argv)

interface Options {
    package: string
    sort: boolean
    [more: string]: unknown
}
