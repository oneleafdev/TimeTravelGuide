import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';
import { MissingPage } from '../library/Home';
import { findPoem, poems } from './model';
import type { Poem } from './model';
import { poemPath, poetryPath } from './paths';

function Verses({ poem, recite }: { poem: Poem; recite: boolean }) {
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(new Set());

  function toggleLine(index: number) {
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <ol className="verses" aria-label={recite ? '逐句背诵' : '诗词原文'}>
      {poem.lines.map((line, index) => {
        const visible = revealed.has(index);
        const [first, ...rest] = Array.from(line);

        return (
          <li key={index}>
            {recite ? (
              <button
                type="button"
                className="verse-toggle"
                aria-label={visible ? `第 ${index + 1} 句，${line} 收起` : `显示第 ${index + 1} 句，首字是${first}`}
                aria-pressed={visible}
                onClick={() => toggleLine(index)}
              >
                {visible ? line : (
                  <span aria-hidden="true">
                    {first}<span className="verse-mask">{'□'.repeat(Math.max(0, rest.length - 1))}</span>{rest.at(-1)}
                  </span>
                )}
                {visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            ) : line}
          </li>
        );
      })}
    </ol>
  );
}

export function Reader({
  memorized,
  onToggle,
}: {
  memorized: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const { poemId } = useParams();
  const [params] = useSearchParams();
  const location = useLocation();
  const directoryLocation: string = location.state?.directoryLocation ?? poetryPath;
  const recite = params.get('mode') === 'recite';
  const poem = findPoem(poemId);
  if (!poem) return <MissingPage />;

  const index = poems.indexOf(poem);
  const previous = poems[index - 1];
  const next = poems[index + 1];
  const learned = memorized.has(poem.id);
  const returnState = { directoryLocation };

  return (
    <article className="wrap page reader">
      <nav className="reader-breadcrumb" aria-label="当前卷">
        <Link className="text-link" to={directoryLocation}><ArrowLeft size={18} /> 诗词目录</Link>
        <span>{index + 1} / {poems.length}</span>
      </nav>

      <div className="reader-grid">
        <div className="reader-sheet">
          <header className="poem-heading">
            <p className="eyebrow">{poem.dynasty} · {poem.author} / {poem.form}</p>
            <h1>{poem.title}</h1>
          </header>
          <div className="mode-switch" aria-label="学习模式">
            <Link to={poemPath(poem.id)} replace state={returnState} aria-current={recite ? undefined : 'true'}>读原文</Link>
            <Link to={poemPath(poem.id, true)} replace state={returnState} aria-current={recite ? 'true' : undefined}>练背诵</Link>
          </div>
          <Verses key={`${poem.id}:${recite}`} poem={poem} recite={recite} />
          <button className="button mark-button" type="button" onClick={() => onToggle(poem.id)} aria-pressed={learned}>
            <Check size={19} aria-hidden="true" /> {learned ? '已背会' : '标记背会'}
          </button>
        </div>

        <div className="poem-notes">
          {recite ? (
            <details className="memory-cue">
              <summary><Lightbulb size={19} aria-hidden="true" /> 背诵提示</summary>
              <p>{poem.memoryCue}</p>
            </details>
          ) : (
            <>
              <section className="note-block">
                <h2>穿越情境</h2>
                <p>{poem.scene}</p>
              </section>
              <section className="note-block">
                <h2>释义</h2>
                <p>{poem.meaning}</p>
              </section>
              <section className="note-block">
                <h2>背诵提示</h2>
                <p>{poem.memoryCue}</p>
              </section>
            </>
          )}
          <section className="note-block sources">
            <h2>参考资料</h2>
            <ul>
              {poem.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <nav className="poem-pagination" aria-label="切换篇目">
        {previous && (
          <Link className="button previous" to={poemPath(previous.id, recite)} state={returnState}>
            <ArrowLeft size={18} aria-hidden="true" /> {previous.title}
          </Link>
        )}
        {next && (
          <Link className="button next" to={poemPath(next.id, recite)} state={returnState}>
            {next.title} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
        {!next && (
          <Link className="button next" to={directoryLocation}>
            返回目录 <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
}
