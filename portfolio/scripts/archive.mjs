import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(project, '..');
const destination = resolve(project, 'public/archive');
// Only the original website's tracked files; never copy Git metadata or the new project.
const roots = new Set(['bio','css','font','img','js','models','projects','textures','work']);
const files = execFileSync('git', ['ls-files','-z'], {cwd:repo,encoding:'utf8'}).split('\0').filter(Boolean).filter(p => (p==='index.html'||roots.has(p.split('/')[0])) && !p.endsWith('.DS_Store'));
let count=0;
for(const file of files){
 const source=resolve(repo,file), target=resolve(destination,file);
 if(!existsSync(source)) throw new Error(`Missing original file: ${file}`);
 mkdirSync(dirname(target),{recursive:true});
 if(['.html','.css','.js'].includes(extname(file))){
  const original=readFileSync(source,'utf8');
  // Prefix only known website roots and exact home links; preserve external URLs and relative paths.
  let transformed=original.replace(/(["'(])\/(?!\/)(?=(?:bio|css|font|img|js|models|projects|textures|work)(?:\/|["')?#]))/g,'$1/archive/').replace(/(href\s*=\s*["'])\/(["'])/gi,'$1/archive/$2');
  if (extname(file) === '.html') transformed = transformed.replace(/(href\s*=\s*["'])(\/archive\/[^"'?#]*)([?#][^"']*)?(["'])/gi, (match, prefix, url, suffix = '', quote) => {
    const local = resolve(repo, url.slice('/archive/'.length), 'index.html');
    return !url.endsWith('/') && existsSync(local) ? prefix + url + '/' + suffix + quote : match;
  });
  if (file === 'index.html') {
    // Restore the original homepage navigation, which was commented out in the source.
    transformed = transformed.replace(/<!--\s*(<header class="site-header">[\s\S]*?<\/header>)\s*-->/, '$1');
  }
  writeFileSync(target,transformed);
 } else copyFileSync(source,target);
 count++;
}
console.log(`Archive prepared: ${count} files. Original sources unchanged.`);
