import assert from 'node:assert/strict';
import { test } from 'node:test';
import library from '../src/data/library.json' with { type: 'json' };
import poetry from '../src/data/poetry.json' with { type: 'json' };

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function checkIds(entries) {
  const ids = entries.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
  for (const id of ids) assert.match(id, slug);
  return ids;
}

test('library module IDs are unique and the poetry module is available', () => {
  checkIds(library.modules);
  assert.equal(library.modules.find(({ id }) => id === 'poetry')?.status, 'available');
  for (const module of library.modules) {
    assert.ok(module.title.trim());
    assert.ok(['available', 'planned'].includes(module.status));
  }
});

test('poem IDs and lines support sharing and recitation', () => {
  const ids = checkIds(poetry.poems);
  assert.ok(ids.includes(poetry.featuredPoemId));

  for (const poem of poetry.poems) {
    for (const field of ['title', 'author', 'dynasty', 'form', 'scene', 'meaning', 'memoryCue']) {
      assert.ok(poem[field]?.trim(), `${poem.id} requires ${field}`);
    }
    assert.ok(poem.lines.length >= 2);
    for (const line of poem.lines) {
      assert.match(line, /^\p{Script=Han}{2,}[，。！？；]$/u, `${poem.id} requires one verse per line`);
    }
  }
});

test('each poem has a named, directly linkable source', () => {
  for (const poem of poetry.poems) {
    assert.ok(poem.sources.length > 0, `${poem.id} requires sources`);
    for (const source of poem.sources) {
      assert.ok(source.label.trim());
      assert.equal(new URL(source.url).protocol, 'https:');
    }
  }
});

test('main catalogue requires distinct works and chapter links', () => {
  const verified = poetry.poems.filter(({ novelUses }) => novelUses !== undefined);
  assert.ok(verified.some(({ id }) => id === poetry.featuredPoemId));
  for (const { id, novelUses } of verified) {
    assert.ok(novelUses.length >= 2, `${id} requires at least two works`);
    const workNames = new Set();
    const chapterLinks = new Set();
    for (const use of novelUses) {
      for (const field of ['work', 'chapter', 'scene', 'url']) {
        assert.ok(use[field]?.trim(), `${id} requires a novel-use ${field}`);
      }
      workNames.add(use.work.trim());
      chapterLinks.add(new URL(use.url).href);
      assert.equal(new URL(use.url).protocol, 'https:');
    }
    assert.equal(workNames.size, novelUses.length, `${id} repeats a work`);
    assert.equal(chapterLinks.size, novelUses.length, `${id} repeats a chapter link`);
  }
});
