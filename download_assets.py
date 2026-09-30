from pathlib import Path
import re, json, subprocess, concurrent.futures
root = Path(__file__).parent
assets = root / 'assets'
assets.mkdir(exist_ok=True)
manifest = {}
jobs = {}
for file in (root / 'design').glob('*.txt'):
    entries = {}
    for name, url in re.findall(r'const (img\w*) = "(https://www\.figma\.com/api/mcp/asset/[^\"]+)"', file.read_text()):
        dest = assets / url.rsplit('/',1)[-1]
        jobs[url] = dest
        entries[name] = 'assets/' + dest.name
    manifest[file.stem] = entries
def download(job):
    url, dest = job
    if not dest.exists() or dest.stat().st_size == 0:
        subprocess.run(['curl', '-fLsS', '--max-time', '45', '-o', str(dest), url], check=True)
        if dest.stat().st_size == 0:
            raise RuntimeError('Empty asset: '+url)
    return dest.name
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    for name in pool.map(download, jobs.items()):
        pass
(root / 'assets.js').write_text('export const assets = '+json.dumps(manifest, indent=2)+';\n')
print(f'Downloaded {len(jobs)} assets for {len(manifest)} design references')
