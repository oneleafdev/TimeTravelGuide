import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, Droplets, Flame, Radio, Sun, Waves } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { MissingPage } from '../library/Home';
import { wildernessModule } from '../library/model';
import { findTopic, topicPath, topics, wildernessPath } from './model';

const icons: Record<string, typeof Compass> = {
  'desert-water': Sun,
  'island-salt': Waves,
  'water-treatment': Droplets,
  campfire: Flame,
  'lost-and-rescue': Radio,
  'coastal-shelter': Compass,
};

export function WildernessDirectory() {
  return (
    <article className="wrap page wilderness">
      <div className="directory-header">
        <div>
          <p className="eyebrow">{wildernessModule.volume} · {topics.length} 篇</p>
          <h1>{wildernessModule.title}</h1>
        </div>
      </div>
      <ul className="poem-grid wilderness-grid">
        {topics.map(({ id, title }) => {
          const Icon = icons[id] ?? Compass;
          return (
            <li key={id}>
              <Link className="poem-card guide-card" data-topic={id} to={topicPath(id)}>
                <div className="volume-top"><Icon size={29} aria-hidden="true" /><ArrowRight size={20} aria-hidden="true" /></div>
                <h2>{title}</h2>
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export function WildernessReader() {
  const { topicId } = useParams();
  const topic = findTopic(topicId);
  if (!topic) return <MissingPage />;
  const Icon = icons[topic.id] ?? Compass;
  return (
    <article className="wrap page wilderness">
      <nav className="reader-breadcrumb" aria-label="当前卷">
        <Link className="text-link" to={wildernessPath}><ArrowLeft size={18} aria-hidden="true" /> 指南目录</Link>
      </nav>
      <header className="guide-heading" data-topic={topic.id}>
        <Icon size={30} aria-hidden="true" />
        <h1>{topic.title}</h1>
        <p>{topic.priority}</p>
      </header>
      <div className="reader-grid guide-body">
        <section className="poem-notes note-block guide-steps" aria-label="做法">
          <ol>
            {topic.steps.map(({ title, body }) => (
              <li key={title}><h2>{title}</h2><p>{body}</p></li>
            ))}
          </ol>
        </section>
        <div className="poem-notes">
          <section className="note-block guide-cautions">
            <h2>别这样做</h2>
            <ul>{topic.avoid.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="note-block sources">
            <h2>参考资料</h2>
            <ul>{topic.sources.map(({ label, url }) => (
              <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} aria-hidden="true" /></a></li>
            ))}</ul>
          </section>
        </div>
      </div>
    </article>
  );
}
