import { ArrowLeft, ArrowUpRight, Grape, Wheat } from 'lucide-react';
import { Link } from 'react-router';
import { brewingModule } from '../library/model';
import { brewingTopics } from './model';
import './guide.css';

const icons: Record<string, typeof Grape> = { 'grape-wine': Grape, wuliangye: Wheat };

export function BrewingGuide() {
  return (
    <article className="wrap page brewing">
      <nav className="reader-breadcrumb" aria-label="当前位置">
        <Link className="text-link" to="/?section=library"><ArrowLeft size={18} aria-hidden="true" /> 卷目</Link>
      </nav>
      <header className="guide-heading brewing-heading">
        <h1>{brewingModule.title}</h1>
        <p>发酵产生酒精；蒸馏把已经产生的酒精分离、浓缩。</p>
      </header>
      <div className="brewing-grid">
        {brewingTopics.map(({ id, title, type, steps, detail, sources }) => {
          const Icon = icons[id] ?? Wheat;
          return (
            <section key={id} aria-labelledby={id} className="brewing-card" data-drink={id}>
              <header className="brewing-card-heading">
                <Icon size={27} aria-hidden="true" />
                <h2 id={id}>{title}</h2>
                <span>{type}</span>
              </header>
              <ol className="brewing-steps">
                {steps.map((step) => (
                  <li key={step.title}><h3>{step.title}</h3><p>{step.body}</p></li>
                ))}
              </ol>
              <div className="brewing-detail">
                <h3>{detail.title}</h3><p>{detail.body}</p>
              </div>
              <details className="sources brewing-sources">
                <summary>参考资料</summary>
                <ul>{sources.map(({ label, url }) => (
                  <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} aria-hidden="true" /></a></li>
                ))}</ul>
              </details>
            </section>
          );
        })}
      </div>
      <p className="brewing-safety">这是工艺科普，不是自酿配方。不要把正在发酵的酒液封在无法泄压的容器里，也不要用自制设备蒸馏饮用酒。</p>
    </article>
  );
}
