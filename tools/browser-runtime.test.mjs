/**
 * PURPOSE
 * Keep theme-storage failures from disabling the independent role controls.
 * SUMMARY
 * - Execute the real inline script with available and denied storage.
 * - Exercise click, keyboard, theme and reduced platform API fallbacks.
 * DETAILS
 * A small DOM fixture tests behavior; visual layout is verified in a browser.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];

function boot({ denied = false, stored = null, observer = true } = {}) {
  const classes = (...initial) => {
    const values = new Set(initial);
    return { add: (...xs) => xs.forEach(x => values.add(x)), remove: x => values.delete(x),
      contains: x => values.has(x), toggle: (x, yes = !values.has(x)) => yes ? values.add(x) : values.delete(x) };
  };
  const element = (role, active = false) => ({ dataset: { role }, classList: classes(...active ? ['active'] : []),
    attrs: {}, style: {}, listeners: {}, setAttribute(k, v) { this.attrs[k] = String(v); },
    addEventListener(k, fn) { this.listeners[k] = fn; }, focus() { document.activeElement = this; },
    closest() { return this; } });
  const tabs = ['analyst', 'consultant', 'manager'].map((r, i) => element(r, !i));
  const panels = tabs.map((t, i) => element(t.dataset.role, !i));
  const toggle = element(), progress = element(), list = element();
  list.querySelectorAll = () => tabs;
  const document = { activeElement: tabs[0], documentElement: { classList: classes(), scrollHeight: 2000 },
    querySelector: () => list,
    querySelectorAll: selector => selector === '.day-content' ? panels : [],
    getElementById: id => id === 'theme-toggle' ? toggle : id === 'progress-bar' ? progress : panels.find(p => 'day-' + p.dataset.role === id) };
  let preference = stored;
  const mq = { matches: false, addEventListener(type, fn) { this.changed = fn; } };
  const window = { scrollY: 0, innerHeight: 800, matchMedia: () => mq, addEventListener() {} };
  const Observer = class { observe() {} unobserve() {} };
  if (observer) window.IntersectionObserver = Observer;
  const localStorage = { getItem() { if (denied) throw Error('Storage denied'); return preference; },
    setItem(k, value) { if (denied) throw Error('Storage denied'); preference = value; } };
  vm.runInNewContext(script, { window, document, localStorage, IntersectionObserver: Observer, requestAnimationFrame: fn => fn() });
  return { tabs, panels, list, toggle, mq, document, preference: () => preference };
}

for (const denied of [false, true]) {
  test(`role navigation works with storage ${denied ? 'denied' : 'available'}`, () => {
    const app = boot({ denied });
    app.list.listeners.click({ target: app.tabs[1] });
    assert.equal(app.tabs[1].attrs['aria-selected'], 'true');
    assert.equal(app.panels[1].classList.contains('active'), true);
    assert.equal(app.panels.filter(p => p.classList.contains('active')).length, 1);
    const key = value => app.list.listeners.keydown({ key: value, preventDefault() {} });
    key('ArrowRight'); assert.equal(app.document.activeElement, app.tabs[2]);
    key('ArrowRight'); assert.equal(app.document.activeElement, app.tabs[0]);
    key('End'); assert.equal(app.document.activeElement, app.tabs[2]);
    key('Home'); assert.equal(app.document.activeElement, app.tabs[0]);
    key('ArrowLeft'); assert.equal(app.document.activeElement, app.tabs[2]);
    assert.equal(app.tabs.filter(t => t.attrs.tabindex === '0').length, 1);
  });
  test(`theme switching works with storage ${denied ? 'denied' : 'available'}`, () => {
    const app = boot({ denied });
    app.toggle.listeners.click();
    assert.equal(app.document.documentElement.classList.contains('light'), true);
    assert.equal(app.toggle.attrs['aria-label'], 'Switch to dark mode');
    app.mq.changed({ matches: false });
    assert.equal(app.document.documentElement.classList.contains('light'), true);
    if (!denied) assert.equal(app.preference(), 'light');
  });
}
test('stored theme wins over system preference', () => {
  assert.equal(boot({ stored: 'light' }).document.documentElement.classList.contains('light'), true);
});
test('role tabs initialise without IntersectionObserver', () => {
  assert.equal(boot({ observer: false }).document.documentElement.classList.contains('js-ready'), true);
});
