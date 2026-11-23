import { ArrowRight, Check, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { poetryModule } from '../library/model';
import { dynasties, hasNovelEvidence, poems, verifiedPoems } from './model';
import type { Poem } from './model';
import { poemPath, poetryPath } from './paths';

export function Directory({ memorized }: { memorized: ReadonlySet<string> }) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const selectedDynasty = params.get('era');
  const dynasty = dynasties.find((item) => item === selectedDynasty);
  const needle = query.trim().toLowerCase();
  const filtered = poems.filter((poem) =>
    (!dynasty || poem.dynasty === dynasty) &&
    [poem.title, poem.author, ...poem.lines].some((text) => text.toLowerCase().includes(needle)),
  );

  const matchedVerified = filtered.filter(hasNovelEvidence);
  const pending = filtered.filter((poem) => !hasNovelEvidence(poem));
  const verifiedProgress = verifiedPoems.filter((poem) => memorized.has(poem.id)).length;

  function setSearch(text: string) {
    const nextParams = new URLSearchParams(params);
    if (text) nextParams.set('q', text);
    else nextParams.delete('q');
    setParams(nextParams, { replace: true });
  }

  function selectDynasty(era: string | undefined) {
    const nextParams = new URLSearchParams(params);
    if (era) nextParams.set('era', era);
    else nextParams.delete('era');
    setParams(nextParams, { replace: true });
  }

  const directoryLocation = `${poetryPath}${params.size > 0 ? `?${params}` : ''}`;

  return (
    <article className="wrap page directory">
      <div className="directory-header">
        <div>
          <p className="eyebrow">{poetryModule.volume} · {verifiedPoems.length} 篇诗词</p>
          <h1>{poetryModule.title}</h1>
        </div>
        <div className="progress">
          <label htmlFor="memorized-progress">已背会 <strong>{verifiedProgress} / {verifiedPoems.length}</strong></label>
          <progress id="memorized-progress" value={verifiedProgress} max={verifiedPoems.length} />
        </div>
      </div>

      <div className="directory-tools">
        <div className="filters" role="group" aria-label="按朝代筛选">
          {[undefined, ...dynasties].map((era) => (
            <button
              className="filter"
              key={era ?? 'all'}
              type="button"
              aria-pressed={dynasty === era}
              onClick={() => selectDynasty(era)}
            >
              {era ?? '全部'}
            </button>
          ))}
        </div>
        <div className="search">
          <Search size={19} aria-hidden="true" />
          <input
            aria-label="搜索篇名、作者或原文"
            type="search"
            value={query}
            placeholder="搜篇名、作者或原文"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <p className="sr-only" role="status">找到 {matchedVerified.length} 篇，另有 {pending.length} 篇待核</p>

      {filtered.length ? (
        <>
          {matchedVerified.length > 0 && (
            <PoemGrid entries={matchedVerified} memorized={memorized} directoryLocation={directoryLocation} />
          )}
          {pending.length > 0 && (
            <details className="pending-poems" open={Boolean(needle || dynasty) || undefined}>
              <summary>待核篇目（{pending.length}）</summary>
              <PoemGrid entries={pending} memorized={memorized} directoryLocation={directoryLocation} />
            </details>
          )}
        </>
      ) : (
        <div className="empty-results">
          <p>没有找到符合条件的篇目。</p>
          <button className="button" onClick={() => setParams({}, { replace: true })} type="button">
            <X size={18} aria-hidden="true" /> 清除筛选
          </button>
        </div>
      )}
    </article>
  );
}

function PoemGrid({ entries, memorized, directoryLocation }: {
  entries: readonly Poem[];
  memorized: ReadonlySet<string>;
  directoryLocation: string;
}) {
  return (
    <ul className="poem-grid">
      {entries.map((poem) => (
        <li key={poem.id}>
          <Link
            to={poemPath(poem.id)}
            state={{ directoryLocation }}
            className="poem-card"
            data-dynasty={poem.dynasty}
          >
            <div className="poem-card-top">
              <span>{poem.dynasty} · {poem.author}</span>
              {memorized.has(poem.id) && <span className="learned"><Check size={14} aria-hidden="true" />已背会</span>}
            </div>
            <h2>{poem.title}</h2>
            <div className="poem-card-bottom">
              <p>{poem.lines[0]}</p>
              <ArrowRight size={21} aria-hidden="true" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
