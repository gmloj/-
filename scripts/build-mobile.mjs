import { build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
await build({plugins:[viteSingleFile()],build:{outDir:'dist-mobile',assetsInlineLimit:10000000}});
const html = await readFile('dist-mobile/index.html','utf8');
await mkdir('mobile/generated',{recursive:true});
await writeFile('mobile/generated/web.json',JSON.stringify({html}));
console.log('Offline mobile interface generated:',html.length,'characters');
