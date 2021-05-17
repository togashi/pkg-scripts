import fs from 'fs/promises'

export interface Scripts {
    [name: string]: string
}

export interface PackageJson {
    scripts: Scripts
    [other: string]: unknown
}

export async function load(path: string): Promise<PackageJson> {
    const data = await fs.readFile(path).then(buffer => buffer.toString('utf8'))
    return JSON.parse(data) as PackageJson
}

export async function save(path: string, pkgJson: PackageJson | unknown, dryRun: boolean): Promise<void> {
    const json = JSON.stringify(pkgJson, null, 2)
    if (dryRun) {
        process.stdout.write(json)
        process.stdout.write('\n')
        return
    }
    await fs.writeFile(path, json)
}

const packageJson = {
    load,
    save
}

export default packageJson
