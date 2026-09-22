/**
 * script.js의 items로 분야별 정적 페이지를 만든다.
 *
 * 필터를 자바스크립트가 아니라 실제 페이지 이동으로 처리한다.
 *   - 페이지가 6개로 늘어 네이버에 색인될 주소가 늘어난다
 *   - 페이지 이동이 생기므로 애드센스 전면광고가 트리거될 수 있다
 *   - 크롤러가 JS 없이도 제도 내용을 읽는다
 *
 * public/index.html을 템플릿으로 삼아 나머지 페이지를 파생시킨다.
 * 사용: node tools/build-cards.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://subsidy.itfinancelab.com';
const AD_EVERY = 3;

const CATEGORIES = [
  { slug: '', name: '전체', label: '전체',
    title: '지원금 모음 | 나에게 맞는 정부지원금 찾기',
    desc: '지원금 모음에서 청년·중장년·가족·생활·일자리 지원금과 신청 정보를 한눈에 확인하세요.' },
  { slug: 'senior', name: '중장년', label: '40·50·60대',
    title: '40·50·60대 지원금 모음 | 실업급여·연금·일자리',
    desc: '40대 이후 받을 수 있는 실업급여, 국민연금, 주택연금, 노인일자리 등 중장년 지원 제도를 정리했습니다.' },
  { slug: 'youth', name: '청년·주거', label: '청년·주거',
    title: '청년 지원금 모음 | 월세·적금·주거 지원',
    desc: '청년월세 지원, 청년미래적금, 청년내일저축계좌 등 청년 대상 지원 제도를 정리했습니다.' },
  { slug: 'job', name: '일자리', label: '일자리',
    title: '일자리 지원금 모음 | 구직·훈련 지원',
    desc: '국민취업지원제도, 국민내일배움카드 등 구직과 직업훈련 지원 제도를 정리했습니다.' },
  { slug: 'family', name: '가족', label: '가족',
    title: '가족·육아 지원금 모음 | 부모급여·장려금',
    desc: '부모급여, 첫만남이용권, 자녀장려금 등 가족과 육아 지원 제도를 정리했습니다.' },
  { slug: 'life', name: '생활·의료', label: '생활·의료',
    title: '생활·의료 지원금 모음 | 의료비·주거급여',
    desc: '근로장려금, 주거급여, 기초연금, 재난적의료비 등 생활과 의료 지원 제도를 정리했습니다.' },
];

const js = readFileSync('public/script.js', 'utf8');
const literal = js.slice(js.indexOf('['), js.indexOf('];') + 1);
const items = new Function(`return ${literal}`)();

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const tagClassOf = (category) => category === '가족' ? 'family'
  : category === '생활·의료' ? 'life'
  : category === '일자리' ? 'job'
  : category === '중장년' ? 'middle' : '';

const adUnit = () => '<aside class="ad-slot in-grid" aria-label="광고">'
  + '<ins class="adsbygoogle" style="display:block"'
  + ' data-ad-client="ca-pub-8832347985556850"'
  + ' data-ad-slot="3755490673"'
  + ' data-ad-format="auto"'
  + ' data-full-width-responsive="true"></ins>'
  + '<script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>'
  + '</aside>';

const cardOf = (x) => {
  const cta = '<span class="cta">지금 바로 신청하기 <span aria-hidden="true">→</span></span>';
  return `<a class="card" href="https://sub.itfinancelab.com/저장소/${x.wp}" aria-label="${esc(x.name)} 신청 안내 글 보기">`
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

// 템플릿에 이전 주입이 남아 있으면 지운다. 빌드를 여러 번 돌려도 결과가 같아야 한다.
const template = readFileSync('public/index.html', 'utf8')
  .replace(/\s*<script>window\.CATEGORY=[^<]*<\/script>/g, '');
let made = 0;

for (const category of CATEGORIES) {
  const list = category.name === '전체'
    ? items
    : items.filter((x) => x.category === category.name);
  if (!list.length) continue;

  const url = category.slug ? `${SITE}/${category.slug}/` : `${SITE}/`;
  let html = template;

  html = html.replace(/(<div class="cards" id="cards">)[\s\S]*?(<\/div>\s*<div class="empty")/,
    (_m, open, tail) => `${open}${gridOf(list)}${tail}`);
  html = html.replace(/(<p class="count" id="result-count">)[\s\S]*?(<\/p>)/,
    (_m, open, close) => `${open}${list.length}개 제도${close}`);
  html = html.replace(/(<div class="filters" id="filters"[^>]*>)[\s\S]*?(<\/div>)/,
    (_m, open, close) => `${open}${filtersOf(category.name)}${close}`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(category.title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(category.desc)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(category.desc)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = html.replace('<script src="/script.js" defer></script>',
    `<script>window.CATEGORY=${JSON.stringify(category.name)};<\/script>\n  <script src="/script.js" defer></script>`);

  if (category.slug) {
    mkdirSync(`public/${category.slug}`, { recursive: true });
    writeFileSync(`public/${category.slug}/index.html`, html);
  } else {
    writeFileSync('public/index.html', html);
  }
  made += 1;
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + CATEGORIES.map((c) => {
      const url = c.slug ? `${SITE}/${c.slug}/` : `${SITE}/`;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n`
        + `    <changefreq>weekly</changefreq>\n    <priority>${c.slug ? '0.8' : '1.0'}</priority>\n  </url>`;
    }).join('\n')
  + '\n</urlset>\n';
writeFileSync('public/sitemap.xml', sitemap);

console.log(`페이지 ${made}개, sitemap ${CATEGORIES.length}개 주소 생성`);
