#!/usr/bin/env node

import target from './lib/target'
import pkgJson from './lib/package-json'
import { PackageJson, Scripts } from './lib/package-json'

class DestinationEntry {
    spec: string
    path = ''
    names: string[] = []
    data: PackageJson = {
        scripts: {}
    }

    constructor(spec: string) {
        this.spec = spec
    }

    async parse(): Promise<void> {
        const [, p,, n] = RegExp(`([^:]+)?(:(.*))?`).exec(this.spec) as string[]
        this.path = await target.get(p)
        this.data = await pkgJson.load(this.path)
        this.getNames(n)
    }

    getNames(nameSpec?: string | null) {
        if (!nameSpec) {
            this.names = []
        } else {
            this.names = [nameSpec]
        }
    }
}

class SourceEntry extends DestinationEntry {
    getNames(nameSpec?: string | null) {
        if (nameSpec && nameSpec.includes('*')) {
            const pat = RegExp(nameSpec.replace(/\*+/i, '.*'))
            this.names = Object.keys(this.data.scripts).filter(k => pat.test(k))
        } else if (!nameSpec) {
            this.names = Object.keys(this.data.scripts)
        } else {
            this.names = [nameSpec]
        }
    }
}

async function main(src: string, dst: string, options: Options) {
    dst = dst || './'
    const s = new SourceEntry(src)
    await s.parse()
    if (s.names.length < 1) {
        process.stderr.write('ERROR: no scripts found to copy.\n')
        process.exit(255)
    }
    const d = new DestinationEntry(dst)
    await d.parse()
    if (s.names.length === 1) {
        if (d.names.length > 1) {
            process.stderr.write('ERROR: too much dst script names specified.\n')
            process.exit(255)
        } else if (d.names.length === 0) {
            d.names = s.names
        }
    } else if (s.names.length > 1) {
        if (d.names.length > 0) {
            process.stderr.write('ERROR: too much dst script names specified.\n')
            process.exit(255)
        } else {
            d.names = s.names
        }
    }
    s.names.forEach((sn, i) => {
        const dn = d.names[i]
        d.data.scripts[dn] = s.data.scripts[sn]
    })
    if (options.sort) {
        const sorted: Scripts = {}
        Object.keys(d.data.scripts).sort().forEach(v => {
            sorted[v] = d.data.scripts[v]
        })
        d.data.scripts = sorted
    }
    await pkgJson.save(d.path, d.data, options.dryRun)
}

import { Command } from 'commander'
const cli = new Command()

cli.description('copy script')
    .arguments('<src> [dst]')
    .option('-s, --sort', 'sort scripts by name', false)
    .option('-D, --dry-run')
    .action(main)

cli.parseAsync(process.argv)

interface Options {
    sort: boolean
    dryRun: boolean
    [more: string]: unknown
}
