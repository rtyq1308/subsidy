/**
 * script.js의 items로 분야별 정적 페이지를 만든다.
 *
 * 필터를 자바스크립트가 아니라 실제 페이지 이동으로 처리한다.
 *   - 분야별 페이지를 만들어 네이버에 색인될 주소를 늘린다
 *   - 페이지 이동이 생기므로 애드센스 전면광고가 트리거될 수 있다
 *   - 크롤러가 JS 없이도 제도 내용을 읽는다
 *
 * 분야마다 H1·소개 문단·비교표·구조화 데이터를 따로 넣는다.
 * 같은 카드만 잘라 보여주면 검색엔진이 홈의 중복 페이지로 본다.
 *
 * public/index.html을 템플릿으로 삼아 나머지 페이지를 파생시킨다.
 * 사이트맵과 RSS도 여기서 같이 만든다.
 * 사용: node tools/build-cards.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { DETAILS } from './details.mjs';

const SITE = 'https://subsidy.itfinancelab.com';
const SITE_NAME = '지원금 모음';
// 운영 주체. 전체 노드는 홈과 운영 안내에만 싣고 다른 페이지는 @id 로 참조한다 (같은 엔티티가 페이지마다 갈라지지 않게).
const ORG_ID = `${SITE}/#organization`;
const ORG = {
  '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: `${SITE}/`, email: 'rtyq1308@gmail.com',
  logo: `${SITE}/og-benefit-v2.png`,
  sameAs: ['https://www.threads.com/@jiwongeum_moeum', 'https://www.instagram.com/jiwongeum_moeum/'],
};
const WEBSITE = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: SITE_NAME, inLanguage: 'ko-KR',
  publisher: { '@id': ORG_ID } };
// 카드 6개마다 광고 1개. 3개마다 넣던 때는 홈에 광고가 14개라 본문보다 광고가 많아 보였다.
const AD_EVERY = 6;

const CATEGORIES = [
  { slug: '', name: '전체', label: '전체',
    title: '지원금 모음 | 나에게 맞는 정부지원금 찾기',
    desc: '청년월세·청년미래적금·기초연금·실업급여·부모급여 등 정부 지원 제도 40개의 대상과 혜택을 분야별로 비교하고, 조건과 신청 방법을 공식 자료 기준으로 확인하세요.',
    h1: '지원금 모음,<br><em>나에게 맞는 혜택 찾기.</em>',
    intro: '청년·중장년·가족·생활·일자리 지원을 한곳에 모았습니다. 조건을 먼저 읽고, 필요한 제도의 상세 안내로 이동하세요.' },
  { slug: 'finance', name: '대출·환급', label: '대출·환급',
    title: '정책대출·환급 모음 | 보금자리론·디딤돌·버팀목',
    desc: '보금자리론·디딤돌대출·청년전용 버팀목전세자금 같은 주택 정책대출과 소상공인 정책자금, 종합소득세 경정청구의 대상과 조건을 한눈에 비교하세요.',
    h1: '정책대출·세금 환급,<br><em>조건부터 확인하기.</em>',
    intro: '보금자리론·디딤돌대출·청년전용 버팀목전세자금 같은 주택 정책대출과 소상공인 정책자금, 종합소득세 경정청구를 모았습니다. 정책대출은 소득·주택가격·무주택 여부에 따라 한도와 금리가 달라지니 제도별 조건을 먼저 비교하세요.' },
  { slug: 'senior', name: '중장년', label: '40·50·60대',
    title: '40·50·60대 지원금 모음 | 실업급여·연금·일자리',
    desc: '40·50·60대가 받을 수 있는 실업급여(1일 최대 68,100원), 국민연금 실업크레딧, 주택연금, 노인일자리 등 중장년 지원 제도의 대상과 혜택을 비교하세요.',
    h1: '40·50·60대 지원금,<br><em>퇴직 전후로 챙기기.</em>',
    intro: '실업급여, 국민연금 실업크레딧, 주택연금, 노인일자리, 중장년내일센터처럼 퇴직·재취업·노후 준비에 필요한 제도를 모았습니다. 나이 기준과 고용보험 가입 이력에 따라 받을 수 있는 제도가 다르고, 사업주가 신청하는 제도는 카드에 따로 표시했습니다.' },
  { slug: 'youth', name: '청년·주거', label: '청년·주거',
    title: '청년 지원금 모음 | 월세·적금·주거 지원',
    desc: '청년월세 지원(월 최대 20만 원), 청년미래적금, 청년내일저축계좌, 청년도약계좌 갈아타기까지 청년 지원 제도의 조건과 일정을 공식 자료 기준으로 정리했습니다.',
    h1: '청년 지원금,<br><em>월세·적금 한 번에.</em>',
    intro: '청년월세 지원, 청년내일저축계좌, 청년미래적금, 청년도약계좌, 청년형 ISA처럼 청년의 주거비와 목돈 마련을 돕는 제도를 모았습니다. 대부분 나이와 본인·가구 소득 기준이 있으니, 비슷한 적금 상품끼리 함께 가입할 수 있는지도 같이 확인하세요.' },
  { slug: 'job', name: '일자리', label: '일자리',
    title: '일자리 지원금 모음 | 구직·훈련 지원',
    desc: '국민취업지원제도(최대 360만 원), 국민내일배움카드, 청년도전지원사업, 청년내일채움공제 등 구직·직업훈련 지원 제도의 대상과 혜택을 비교하세요.',
    h1: '일자리 지원금,<br><em>구직·훈련·취업 수당.</em>',
    intro: '국민취업지원제도, 취업성공수당, 국민내일배움카드, 청년도전지원사업, 청년내일채움공제처럼 구직과 직업훈련을 돕는 제도를 모았습니다. 구직자가 신청하는 제도와 사업주가 신청하는 고용장려금이 섞여 있으니 카드의 대상 표시를 확인하세요.' },
  { slug: 'family', name: '가족', label: '가족',
    title: '가족·육아 지원금 모음 | 부모급여·장려금',
    desc: '부모급여(0세 월 최대 100만 원), 첫만남이용권, 자녀장려금, 양육비 선지급 등 출산·육아 지원 제도의 대상과 지급액을 한눈에 비교하세요.',
    h1: '가족·육아 지원금,<br><em>출산부터 양육까지.</em>',
    intro: '부모급여, 첫만남이용권, 자녀장려금, 양육비 선지급처럼 출산과 양육 단계별로 받을 수 있는 제도를 모았습니다. 아이 나이와 가구 소득에 따라 지급액과 신청 시기가 다르니 제도별 조건을 확인하세요.' },
  { slug: 'life', name: '생활·의료', label: '생활·의료',
    title: '생활·의료 지원금 모음 | 의료비·주거급여',
    desc: '근로장려금, 기초연금, 주거급여, 재난적의료비, K-패스, 에너지바우처 등 생활비·의료비를 덜어주는 지원 제도의 대상과 혜택을 한눈에 비교하세요.',
    h1: '생활·의료 지원금,<br><em>병원비·교통비·생계비.</em>',
    intro: '근로장려금, 기초연금, 주거급여, 재난적의료비, 본인부담상한제, K-패스, 에너지바우처, 긴급복지 생계지원처럼 생활비와 의료비 부담을 덜어주는 제도를 모았습니다. 소득·재산 기준이 있는 제도가 많으니 조건을 먼저 확인하세요.' },
];

// 분야 페이지가 아닌 정적 페이지. 사이트맵과 RSS에만 들어간다.
const EXTRA_PAGES = [
  { path: '/about/', title: '운영 안내 | 지원금 모음',
    desc: '지원금 모음이 정보를 모으고 확인하는 기준, 이용 시 주의할 점, 광고 게재 안내입니다.' },
];

const js = readFileSync('public/script.js', 'utf8');
const literal = js.slice(js.indexOf('['), js.indexOf('];') + 1);
const items = new Function(`return ${literal}`)();

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const wpUrl = (x) => `https://sub.itfinancelab.com/저장소/${x.wp}`;
// 조건 요약 페이지가 있는 제도는 비교표와 목록 데이터에서 그 페이지로 보낸다. 카드는 계속 워드프레스 글로 간다.
const detailOf = (x) => DETAILS.find((d) => d.wp === x.wp);
const detailPath = (d) => `/${d.category}/${d.slug}/`;
const infoUrl = (x) => (detailOf(x) ? `${SITE}${detailPath(detailOf(x))}` : wpUrl(x));
const pageUrl = (c) => (c.slug ? `${SITE}/${c.slug}/` : `${SITE}/`);

const tagClassOf = (category) => category === '가족' ? 'family'
  : category === '생활·의료' ? 'life'
  : category === '일자리' ? 'job'
  : category === '중장년' ? 'middle'
  : category === '대출·환급' ? 'finance' : '';

const adUnit = () => '<aside class="ad-slot in-grid" aria-label="광고">'
  + '<ins class="adsbygoogle" style="display:block"'
  + ' data-ad-client="ca-pub-8832347985556850"'
  + ' data-ad-slot="3755490673"'
  + ' data-ad-format="auto"'
  + ' data-full-width-responsive="true"></ins>'
  + '<script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>'
  + '</aside>';

// 카드는 공식 신청 창구가 아니라 해설 글로 간다. 버튼 문구도 그에 맞춘다.
const cardOf = (x) => {
  const cta = '<span class="cta">조건·신청 방법 보기 <span aria-hidden="true">→</span></span>';
  return `<a class="card" href="${wpUrl(x)}" aria-label="${esc(x.name)} 조건·신청 방법 글 보기">`
    + `<div class="card-top"><span class="tag ${tagClassOf(x.category)}">${esc(x.category)}</span>`
    + `<span class="status">${esc(x.status || '조건 확인')}</span></div>`
    + `<h3>${esc(x.name)}</h3><p class="benefit">${esc(x.benefit)}</p>`
    + `<div class="card-actions">${cta}</div></a>`;
};

const gridOf = (list) => list.reduce((out, x, index) => {
  out.push(cardOf(x));
  const placed = index + 1;
  if (placed % AD_EVERY === 0 && placed < list.length) out.push(adUnit());
  return out;
}, []).join('');

const filtersOf = (current) => CATEGORIES.map((c) => {
  const href = c.slug ? `/${c.slug}/` : '/';
  const pressed = c.name === current ? 'true' : 'false';
  return `<a href="${href}" data-category="${esc(c.name)}" aria-pressed="${pressed}">${esc(c.label)}</a>`;
}).join('');

// 카드에서 지운 요약을 표로 다시 보여준다. 크롤러가 읽을 본문이 되고, 제도끼리 비교하기도 쉽다.
const compareOf = (category, list) => {
  const heading = category.slug ? `${category.label} 제도 한눈에 비교` : '전체 제도 한눈에 비교';
  const rows = list.map((x) => `<tr><th scope="row"><a href="${detailOf(x) ? detailPath(detailOf(x)) : wpUrl(x)}">${esc(x.name)}</a>`
    + `${x.status ? `<span class="row-note">${esc(x.status)}</span>` : ''}</th>`
    + `<td>${esc(x.benefit)}</td><td>${esc(x.summary)}</td></tr>`).join('');
  return '<section class="compare" aria-labelledby="compare-title">'
    + `<h2 id="compare-title">${esc(heading)}</h2>`
    + `<p class="compare-desc">${list.length}개 제도의 혜택과 확인할 점입니다. 제도 이름을 누르면 조건을 정리한 페이지나 신청 방법 글로 이동합니다.</p>`
    + '<div class="table-wrap"><table><thead><tr><th scope="col">제도</th><th scope="col">혜택</th>'
    + `<th scope="col">확인할 점</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
};

const jsonLdOf = (category, list) => {
  const url = pageUrl(category);
  const graph = [
    WEBSITE,
    ...(category.slug ? [] : [ORG]),
    { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: category.title,
      description: category.desc, inLanguage: 'ko-KR', isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: { '@id': `${url}#list` } },
    { '@type': 'ItemList', '@id': `${url}#list`, numberOfItems: list.length,
      itemListElement: list.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: infoUrl(x) })) },
  ];
  if (category.slug) {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: category.label, item: url },
    ] });
  }
  // </script> 조기 종료를 막는다.
  const body = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${body}</script>`;
};

// 템플릿에 이전 주입이 남아 있으면 지운다. 빌드를 여러 번 돌려도 결과가 같아야 한다.
const template = readFileSync('public/index.html', 'utf8')
  .replace(/\s*<script>window\.CATEGORY=[^<]*<\/script>/g, '');
let made = 0;

for (const category of CATEGORIES) {
  const list = category.name === '전체'
    ? items
    : items.filter((x) => x.category === category.name);
  if (!list.length) continue;

  const url = pageUrl(category);
  let html = template;

  html = html.replace(/(<div class="cards" id="cards">)[\s\S]*?(<\/div>\s*<div class="empty")/,
    (_m, open, tail) => `${open}${gridOf(list)}${tail}`);
  html = html.replace(/(<p class="count" id="result-count">)[\s\S]*?(<\/p>)/,
    (_m, open, close) => `${open}${list.length}개 제도${close}`);
  html = html.replace(/(<div class="filters" id="filters"[^>]*>)[\s\S]*?(<\/div>)/,
    (_m, open, close) => `${open}${filtersOf(category.name)}${close}`);
  html = html.replace(/(<h1 id="page-title">)[\s\S]*?(<\/h1>)/, (_m, open, close) => `${open}${category.h1}${close}`);
  html = html.replace(/(<p class="intro-desc">)[\s\S]*?(<\/p>)/, (_m, open, close) => `${open}${esc(category.intro)}${close}`);
  html = html.replace(/(<!-- compare:start -->)[\s\S]*?(<!-- compare:end -->)/,
    (_m, open, close) => `${open}${compareOf(category, list)}${close}`);
  html = html.replace(/(<!-- ld:start -->)[\s\S]*?(<!-- ld:end -->)/,
    (_m, open, close) => `${open}${jsonLdOf(category, list)}${close}`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(category.title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(category.desc)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(category.desc)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  // 홈의 og:title은 Threads 링크 카드용 문구라 그대로 둔다. 분야 페이지만 제목을 맞춘다.
  if (category.slug) {
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(category.title)}$2`);
    html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(category.title)}$2`);
  }
  html = html.replace('<script src="/script.js" defer></script>',
    `<script>window.CATEGORY=${JSON.stringify(category.name)};<\/script>\n  <script src="/script.js" defer></script>`);

  if (category.slug) {
    mkdirSync(`public/${category.slug}`, { recursive: true });
    writeFileSync(`public/${category.slug}/index.html`, html.trimEnd() + '\n');
  } else {
    writeFileSync('public/index.html', html.trimEnd() + '\n');
  }
  made += 1;
}

// ── 제도별 조건 요약 페이지 ─────────────────────────────────────────────
const AD_CLIENT = 'ca-pub-8832347985556850';
const korDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${y}년 ${m}월 ${d}일`; };
const FOOTER = '<footer><span>지원금 모음</span><nav class="footer-nav" aria-label="분야별 지원금">'
  + '<a href="/youth/">청년 지원금</a><a href="/senior/">40·50·60대 지원금</a><a href="/family/">가족·육아 지원금</a>'
  + '<a href="/job/">일자리 지원금</a><a href="/life/">생활·의료 지원금</a><a href="/finance/">정책대출·환급</a>'
  + '<a href="/about/">운영 안내</a></nav></footer>';

const detailHtml = (d) => {
  const cat = CATEGORIES.find((c) => c.slug === d.category);
  const url = `${SITE}${detailPath(d)}`;
  const related = DETAILS.filter((o) => o.category === d.category && o.slug !== d.slug);
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
    WEBSITE,
    { '@type': 'WebPage', '@id': `${url}#page`, url, name: d.title, description: d.desc, inLanguage: 'ko-KR',
      dateModified: d.checked, isPartOf: { '@id': `${SITE}/#website` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: cat.label, item: pageUrl(cat) },
      { '@type': 'ListItem', position: 3, name: d.name, item: url },
    ] },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: d.notes.map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${esc(d.desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="google-adsense-account" content="${AD_CLIENT}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(d.title)}">
  <meta property="og:description" content="${esc(d.desc)}">
  <meta property="og:image" content="${SITE}/og-benefit-v2.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f7f7f2">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-EZWW0615H1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-EZWW0615H1');
  </script>
  <title>${esc(d.title)}</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME}" href="${SITE}/rss.xml">
  <script type="application/ld+json">${ld}</script>
</head>
<body>
  <header class="site-header">
    <a class="logo" href="/" aria-label="지원금 모음 홈"><span class="logo-mark" aria-hidden="true">₩</span><span>지원금 모음</span></a>
    <span class="header-note">지원 제도 안내</span>
  </header>
  <main class="detail">
    <nav class="crumbs" aria-label="현재 위치"><a href="/">지원금 모음</a> › <a href="/${cat.slug}/">${esc(cat.label)}</a> › <span>${esc(d.name)}</span></nav>
    <h1>${esc(d.name)} 조건 한눈에 보기</h1>
    <p class="checked">정보 확인: ${korDate(d.checked)} · 공식 자료 기준</p>
    <p class="status status-${d.status.tone}">${esc(d.status.text)}</p>
    <p class="detail-lead">${esc(d.lead)}</p>

    <section aria-labelledby="facts-title">
      <h2 id="facts-title">핵심 조건</h2>
      <div class="table-wrap"><table class="facts"><tbody>
        ${d.rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n        ')}
      </tbody></table></div>
    </section>

    <aside class="ad-slot" aria-label="광고"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="3755490673" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></aside>

    <section aria-labelledby="check-title">
      <h2 id="check-title">나도 받을 수 있을까? 체크해 보기</h2>
      <ul class="checklist">
        ${d.checks.map((c) => `<li>${esc(c)}</li>`).join('\n        ')}
      </ul>
      <p class="hint">모두 해당하면 신청 대상일 가능성이 높습니다. 최종 대상 여부는 신청 기관의 심사로 정해집니다.</p>
    </section>

    <section aria-labelledby="faq-title">
      <h2 id="faq-title">자주 헷갈리는 점</h2>
      ${d.notes.map(([q, a]) => `<div class="qa"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('\n      ')}
    </section>

    <div class="detail-actions">
      <a class="detail-cta" href="${wpUrl(d)}" data-benefit="${esc(d.name)}">자세한 신청 방법 보기 <span aria-hidden="true">→</span></a>
      ${d.official ? `<a class="detail-official" href="${d.official.url}" target="_blank" rel="noopener" data-benefit="${esc(d.name)}">${esc(d.official.label)} ↗</a>` : ''}
    </div>

    <section aria-labelledby="src-title">
      <h2 id="src-title">공식 출처</h2>
      <ul class="sources">
        ${d.sources.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join('\n        ')}
      </ul>
      <p class="hint">지원 내용은 해마다 바뀝니다. 신청 전에 해당 연도 공고를 꼭 확인하세요.</p>
    </section>
${related.length ? `
    <section aria-labelledby="rel-title">
      <h2 id="rel-title">${esc(cat.label)} 다른 제도</h2>
      <ul class="related">
        ${related.map((o) => `<li><a href="${detailPath(o)}">${esc(o.name)}</a><span>${esc((items.find((x) => x.wp === o.wp) || {}).benefit || '')}</span></li>`).join('\n        ')}
      </ul>
      <p class="hint"><a href="/${cat.slug}/">${esc(cat.label)} 제도 전체 보기 →</a></p>
    </section>
` : ''}  </main>
  ${FOOTER}
  <script src="/script.js" defer></script>
</body>
</html>
`;
};

for (const d of DETAILS) {
  if (!items.some((x) => x.wp === d.wp)) throw new Error(`details.mjs의 ${d.name}(wp ${d.wp})가 script.js items에 없습니다.`);
  mkdirSync(`public${detailPath(d)}`, { recursive: true });
  writeFileSync(`public${detailPath(d)}index.html`, detailHtml(d));
}

const today = new Date().toISOString().slice(0, 10);
const pages = [
  ...CATEGORIES.map((c) => ({ url: pageUrl(c), title: c.title, desc: c.desc, priority: c.slug ? '0.8' : '1.0' })),
  ...DETAILS.map((d) => ({ url: `${SITE}${detailPath(d)}`, title: d.title, desc: d.desc, priority: '0.7' })),
  ...EXTRA_PAGES.map((p) => ({ url: `${SITE}${p.path}`, title: p.title, desc: p.desc, priority: '0.3' })),
];

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + pages.map((p) => `  <url>\n    <loc>${p.url}</loc>\n    <lastmod>${today}</lastmod>\n`
    + `    <changefreq>weekly</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n')
  + '\n</urlset>\n';
writeFileSync('public/sitemap.xml', sitemap);

// AI 검색·답변 엔진용 안내서 (GEO). 페이지 목록과 데이터 정책을 사이트맵과 같은 원본에서 만든다.
const llms = [
  `# ${SITE_NAME}`, '',
  '> 청년·중장년·가족·일자리·생활·정책대출 분야 정부 지원 제도의 대상·혜택·신청 일정을 공식 자료 기준으로 정리한 안내 사이트입니다. 신청 접수나 자격 판정은 하지 않습니다.', '',
  '## 제도별 조건 요약', '',
  ...DETAILS.map((d) => `- [${d.name} 조건 한눈에 보기](${SITE}${detailPath(d)}): ${d.desc} (정보 확인 ${d.checked})`), '',
  '## 분야별 지원금 모음', '',
  ...CATEGORIES.map((c) => `- [${c.title.split(' | ')[0]}](${pageUrl(c)}): ${c.desc}`), '',
  '## 데이터 정책', '',
  '- 출처: 정책브리핑(korea.kr), 복지로, 정부24, 금융위원회 등 소관 부처·기관 공고. 각 조건 요약 페이지에 출처 링크와 확인 날짜를 적는다.',
  '- 지원 제도는 해마다 바뀐다. 새 공고가 나오면 다시 확인해 고친다.',
  `- 운영 안내: ${SITE}/about/ · 문의: rtyq1308@gmail.com`, '',
].join('\n');
writeFileSync('public/llms.txt', llms);

// 네이버 서치어드바이저는 RSS로 새 문서를 더 빨리 가져간다.
const pubDate = new Date(`${today}T00:00:00+09:00`).toUTCString();
const rss = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<rss version="2.0">\n<channel>\n'
  + `  <title>${SITE_NAME}</title>\n  <link>${SITE}/</link>\n`
  + `  <description>${esc(CATEGORIES[0].desc)}</description>\n  <language>ko</language>\n`
  + `  <lastBuildDate>${pubDate}</lastBuildDate>\n`
  + pages.map((p) => `  <item>\n    <title>${esc(p.title)}</title>\n    <link>${p.url}</link>\n`
    + `    <guid isPermaLink="true">${p.url}</guid>\n    <description>${esc(p.desc)}</description>\n`
    + `    <pubDate>${pubDate}</pubDate>\n  </item>`).join('\n')
  + '\n</channel>\n</rss>\n';
writeFileSync('public/rss.xml', rss);

console.log(`분야 페이지 ${made}개, 조건 요약 페이지 ${DETAILS.length}개, sitemap·RSS ${pages.length}개 주소 생성`);
