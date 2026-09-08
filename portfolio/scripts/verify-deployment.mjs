import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(project, '..');
const dist = resolve(project, 'dist');
for (const path of ['index.html','work/index.html','me/index.html','archive/index.html','archive/work/index.html','archive/bio/index.html']) {
  assert(existsSync(resolve(dist,path)), `Missing page: ${path}`);
}
const roots = new Set(['bio','css','font','img','js','models','projects','textures','work']);
const originals = execFileSync('git',['ls-files','-z'],{cwd:repo,encoding:'utf8'}).split('\0').filter(p => p && (p==='index.html'||roots.has(p.split('/')[0])) && !p.endsWith('.DS_Store'));
assert(originals.length > 400, 'Archive source unexpectedly incomplete');
for (const path of originals) assert(existsSync(resolve(dist,'archive',path)), `Missing archive file: ${path}`);
const archive = readFileSync(resolve(dist,'archive/index.html'),'utf8');
assert(archive.includes('<header class="site-header">'), 'Archive header missing');
for (const path of ['/archive/work/','/archive/bio/','/archive/models/upDownLaying.fbx','/archive/textures/waternormals.jpg']) assert(archive.includes(path), `Missing archive path: ${path}`);
const work = JSON.parse(readFileSync(resolve(project,'src/data/work.json'),'utf8'));
assert.equal(work.length,18);
assert.equal(work[0].title,'Workshop XR');
assert.equal(work[9].title,'Weill Cornell Wellness Center LIC');
for (const item of work) assert(existsSync(resolve(dist,item.image.slice(1))), `Missing project image: ${item.title}`);
for (const path of ['index.html','work/index.html','me/index.html']) {
 const html=readFileSync(resolve(dist,path),'utf8');
 assert(html.includes('href="/work/"') && html.includes('href="/me/"') && html.includes('href="/archive/"'), `Navigation missing: ${path}`);
}
console.log(`Verified three new pages, ${originals.length} archive files, navigation, and 18 project images.`);
