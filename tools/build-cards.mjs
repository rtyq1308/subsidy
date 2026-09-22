// script.js의 items를 읽어 카드 마크업을 index.html에 미리 렌더링한다.
// 크롤러가 JS 없이도 제도 23개를 읽을 수 있게 하기 위한 단계다.
// 사용: node tools/build-cards.mjs
import { readFileSync, writeFileSync } from 'node:fs';

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

// 카드 3개마다 그리드 안에 인피드 광고를 넣는다(벤치마크와 같은 3:1 비율).
// 모바일은 1열이라 카드 사이에 세로로, 데스크톱은 한 줄을 통째로 차지한다.
const AD_EVERY = 3;
const adUnit = () => '<aside class="ad-slot in-grid" aria-label="광고">'
  + '<ins class="adsbygoogle" style="display:block"'
  + ' data-ad-client="ca-pub-8832347985556850"'
  + ' data-ad-slot="3755490673"'
  + ' data-ad-format="auto"'
  + ' data-full-width-responsive="true"></ins>'
  + '<script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>'
  + '</aside>';

const cardList = items.map((x) => {
  const cta = `<span class="cta">지금 바로 신청하기 <span aria-hidden="true">→</span></span>`;
  return `<a class="card" href="https://sub.itfinancelab.com/저장소/${x.wp}" aria-label="${esc(x.name)} 신청 안내 글 보기"><div class="card-top"><span class="tag ${tagClassOf(x.category)}">${esc(x.category)}</span><span class="status">${esc(x.status || '조건 확인')}</span></div><h3>${esc(x.name)}</h3><p class="benefit">${esc(x.benefit)}</p><div class="card-actions">${cta}</div></a>`;
});

const cards = cardList.reduce((out, card, index) => {
  out.push(card);
  const placed = index + 1;
  if (placed % AD_EVERY === 0 && placed < cardList.length) out.push(adUnit());
  return out;
}, []).join('');

let html = readFileSync('public/index.html', 'utf8');
// 결과가 이미 최신이어도 성공해야 한다. 변경 여부가 아니라 패턴 일치 여부로 판단한다.
let hitCards = 0;
let hitCount = 0;
html = html.replace(/(<div class="cards" id="cards">)[\s\S]*?(<\/div>\s*<div class="empty")/,
  (_m, open, tail) => { hitCards += 1; return `${open}${cards}${tail}`; });
html = html.replace(/(<p class="count" id="result-count">)[\s\S]*?(<\/p>)/,
  (_m, open, close) => { hitCount += 1; return `${open}${items.length}개 제도${close}`; });
if (!hitCards) throw new Error('index.html에서 카드 영역을 찾지 못했습니다.');
if (!hitCount) throw new Error('index.html에서 결과 개수 영역을 찾지 못했습니다.');
writeFileSync('public/index.html', html);
console.log(`카드 ${items.length}개를 index.html에 렌더링했습니다.`);
