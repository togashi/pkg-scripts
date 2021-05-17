import fs from 'fs/promises'

export async function get(spec: string): Promise<string> {
    const s = await fs.stat(spec)
    if (s.isDirectory()) {
        return await get(`${spec}/package.json`.replace(/\/\//g, '/'))
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
