"""Check the static guide before publishing so broken structure and links do not ship."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Guide(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.ids, self.links, self.errors = [], set(), [], []
        self.headings = 0
    def handle_starttag(self, tag, attrs):
        names = [key for key, value in attrs]
        if len(names) != len(set(names)):
            self.errors.append(f'Duplicate attribute on {tag}')
        data = dict(attrs)
        if 'id' in data:
            if data['id'] in self.ids:
                self.errors.append(f'Duplicate ID: {data["id"]}')
            self.ids.add(data['id'])
        for attr in ('href', 'src'):
            if data.get(attr):
                self.links.append(data[attr])
        if tag == 'h1': self.headings += 1
        if tag not in VOID: self.stack.append(tag)
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f'Unexpected closing tag: {tag}')
        else:
            self.stack.pop()
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)

html = (ROOT / 'index.html').read_text(encoding='utf-8')
page = Guide()
page.feed(html)
assert not page.errors, page.errors
assert not page.stack, page.stack
assert page.headings == 1, 'Expected a single main heading'
for href in page.links:
    url = urlsplit(href)
    if url.scheme or url.netloc: continue
    if url.path: assert (ROOT / unquote(url.path)).is_file(), href
    elif url.fragment: assert unquote(url.fragment) in page.ids, href
for doc in [ROOT / 'README.md', *ROOT.glob('docs/*.md')]:
    for href in re.findall(r'\]\(([^)]+)\)', doc.read_text(encoding='utf-8')):
        url = urlsplit(href)
        if url.scheme or url.netloc or not url.path: continue
        assert (doc.parent / unquote(url.path)).is_file(), f'{doc.name}: {href}'
for image in re.findall(r'<meta property="og:image" content="([^"]+)"', html):
    assert (ROOT / urlsplit(image).path.removeprefix('/esgpath/')).is_file(), image
scripts = re.findall(r'<script>(.*?)</script>', html, re.S)
assert scripts, 'No application script found'
with tempfile.TemporaryDirectory(prefix='esgpath-check-') as folder:
    for i, script in enumerate(scripts):
        target = Path(folder) / f'inline-{i}.js'
        target.write_text(script, encoding='utf-8')
        subprocess.run(['node', '--check', str(target)], check=True)
print(f'PASS: HTML structure, {len(page.ids)} unique IDs, {len(page.links)} asset/anchor links, documentation links and {len(scripts)} script syntax check(s).')
