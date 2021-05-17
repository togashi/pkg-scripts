import fs from 'fs'
import { promisify } from 'util'
const fsp = {
    stat: promisify(fs.stat)
}

export async function get(spec: string): Promise<string> {
    const s = await fsp.stat(spec)
    if (s.isDirectory()) {
        return get(`${spec}/package.json`.replace(/\/\//g, '/'))
    }
    if (s.isFile()) {
        return spec
    }
    return ''
}

const target = {
    get
}

export default target
