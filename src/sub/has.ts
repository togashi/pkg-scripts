#!/usr/bin/env node

import target from './lib/target'
import pkgJson from './lib/package-json'

async function main(args: string[], options: Options) {
    const filePath = await target.get(options.package)
    const pj = await pkgJson.load(filePath)
    const nonExists = args.filter(name => !(name in pj.scripts))
    if (options.inverse) {
        process.exit(nonExists.length === args.length ? 0 : 1)
    } else {
        process.exit(nonExists.length == 0 ? 0 : 1)
    }
}

import { Command } from 'commander'
const cli = new Command()

cli.description('check existency')
    .arguments('name <names...>')
    .option('-p, --package <location>', 'package directory or actual package.json', './package.json')
    .option('-i, --inverse', 'return error if exists')
    .action(main)

cli.parseAsync(process.argv)

interface Options {
    package: string
    [more: string]: unknown
}
