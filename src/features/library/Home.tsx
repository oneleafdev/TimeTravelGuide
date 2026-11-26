import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Calculator, Compass } from 'lucide-react';
import { Link } from 'react-router';
import { accountingPath, methods } from '../accounting/model';
import { featuredPoem, verifiedPoems } from '../poetry/model';
import { poemPath, poetryPath } from '../poetry/paths';
import { topics, wildernessPath } from '../wilderness/model';
import { accountingModule, modules, poetryModule, siteTitle, wildernessModule } from './model';

const volumeEntries: Record<string, { path: string; icon: typeof BookOpen; count: string }> = {
  [poetryModule.id]: { path: poetryPath, icon: BookOpen, count: `${verifiedPoems.length} 篇` },
  [wildernessModule.id]: { path: wildernessPath, icon: Compass, count: `${topics.length} 篇` },
  [accountingModule.id]: { path: accountingPath, icon: Calculator, count: `${methods.length} 种方法` },
};

export function Home() {
  return (
    <>
      <section className="hero section" aria-labelledby="hero-title" data-enter>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">{siteTitle.slice(0, 2)}<span>{siteTitle.slice(2)}</span></h1>
            <p className="hero-subtitle">{poetryModule.title}</p>
            <Link className="button button-primary" to={poetryPath}>
              翻开第一卷 <ArrowRight size={20} />
            </Link>
          </div>
          <div className="hero-visual" data-visual>
            <Link className="hero-poem" to={poemPath(featuredPoem.id)}>
              <div className="hero-poem-heading">
                <span>{featuredPoem.dynasty} · {featuredPoem.author}</span>
                <ArrowUpRight size={23} aria-hidden="true" />
              </div>
              <p className="hero-poem-title">{featuredPoem.title}</p>
              <div className="hero-verses">
                {featuredPoem.lines.slice(0, 4).map((line, index) => <span key={index}>{line}</span>)}
                {featuredPoem.lines.length > 4 && <span aria-hidden="true">⋯</span>}
              </div>
            </Link>
          </div>
        </div>
        <div className="wrap hero-bottom">
          <a className="text-link" href="#/?section=library">卷目 <ArrowDown size={16} /></a>
        </div>
      </section>

      <section id="library" className="library section" aria-labelledby="library-title" tabIndex={-1}>
        <div className="wrap">
          <h2 id="library-title" className="section-title">卷目</h2>
          <ul className="volume-grid">
            {modules.map((module) => {
              const entry = volumeEntries[module.id];
              if (module.status !== 'available' || !entry) {
                return (
                  <li key={module.id}>
                    <article className="volume volume-planned">
                      <span className="volume-top"><Compass size={29} aria-hidden="true" /></span>
                      <div><span className="volume-meta">筹备中</span><h3>{module.title}</h3></div>
                    </article>
                  </li>
                );
              }
              const { path, icon: Icon, count } = entry;
              return (
                <li key={module.id}>
                  <Link to={path} className={`volume volume-${module.id}`}>
                    <span className="volume-top">
                      <Icon size={29} aria-hidden="true" />
                      <ArrowUpRight size={24} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="volume-meta">{module.volume} · {count}</span>
                      <h3>{module.title}</h3>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

export function MissingPage() {
  return (
    <div className="wrap page missing-page">
      <h1>这一页没有找到</h1>
      <Link className="button button-primary" to="/">
        返回{siteTitle} <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}
