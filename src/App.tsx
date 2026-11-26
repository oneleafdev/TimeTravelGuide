import { useEffect, useRef } from 'react';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { Link, NavLink, Route, Routes, matchPath, useLocation } from 'react-router';
import { AccountingGuide } from './features/accounting/Guide';
import { accountingPath } from './features/accounting/model';
import { Home, MissingPage } from './features/library/Home';
import { accountingModule, poetryModule, siteTitle, wildernessModule } from './features/library/model';
import { Directory } from './features/poetry/Directory';
import { Reader } from './features/poetry/Reader';
import { featuredPoem, findPoem, verifiedPoems } from './features/poetry/model';
import { poemPath, poetryPath } from './features/poetry/paths';
import { useProgress } from './features/poetry/progress';
import { WildernessDirectory, WildernessReader } from './features/wilderness/Guide';
import { findTopic, topicRoute, wildernessPath } from './features/wilderness/model';

const readerPath = `${poetryPath}/:poemId`;

export function App() {
  const { pathname, search } = useLocation();
  const previousPath = useRef(pathname);
  const { memorized, toggleMemorized } = useProgress();
  const practicePoem = !memorized.has(featuredPoem.id) ? featuredPoem
    : verifiedPoems.find((poem) => !memorized.has(poem.id)) ?? featuredPoem;
  const section = pathname === '/' ? new URLSearchParams(search).get('section') : null;
  const titles: Record<string, string> = {
    [poetryPath]: poetryModule.title,
    [wildernessPath]: wildernessModule.title,
    [accountingPath]: accountingModule.title,
  };
  const viewTitle = pathname === '/' ? null : titles[pathname]
    ?? findPoem(matchPath(readerPath, pathname)?.params.poemId)?.title
    ?? findTopic(matchPath(topicRoute, pathname)?.params.topicId)?.title
    ?? '页面未找到';

  useEffect(() => {
    document.title = viewTitle ? `${viewTitle} · ${siteTitle}` : siteTitle;
  }, [viewTitle]);

  useEffect(() => {
    const navigated = previousPath.current !== pathname;
    previousPath.current = pathname;

    if (section === 'library') {
      const library = document.getElementById(section);
      library?.focus({ preventScroll: true });
      library?.scrollIntoView();
    } else if (navigated) {
      window.scrollTo(0, 0);
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  }, [pathname, section]);

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById('main-content');
          main?.focus({ preventScroll: true });
          main?.scrollIntoView();
        }}
      >
        跳到正文
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark"><Sparkles size={19} aria-hidden="true" /></span>
            {siteTitle}
          </Link>
          <nav aria-label="主导航" className="main-nav">
            <NavLink className="nav-link" to={poetryPath}>
              <BookOpen size={17} aria-hidden="true" /> 诗词目录
            </NavLink>
            <Link className="button nav-practice" to={poemPath(practicePoem.id, true)}>
              开始背诵 <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={poetryPath} element={<Directory memorized={memorized} />} />
          <Route path={readerPath} element={<Reader memorized={memorized} onToggle={toggleMemorized} />} />
          <Route path={wildernessPath} element={<WildernessDirectory />} />
          <Route path={topicRoute} element={<WildernessReader />} />
          <Route path={accountingPath} element={<AccountingGuide />} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <Link to="/" className="footer-brand">{siteTitle}</Link>
          <a className="text-link" href="https://github.com/oneleafdev/TimeTravelGuide">
            GitHub <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
