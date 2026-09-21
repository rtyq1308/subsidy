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

const cards = items.map((x) => {
  const destination = `<a class="wp-link" href="https://sub.itfinancelab.com/저장소/${x.wp}" target="_blank" rel="noopener noreferrer" aria-label="${esc(x.name)} 신청 안내 글 새 창에서 보기">지금 바로 신청하기 <span aria-hidden="true">→</span></a>`;
  return `<article class="card"><div class="card-top"><span class="tag ${tagClassOf(x.category)}">${esc(x.category)}</span><span class="status">${esc(x.status || '조건 확인')}</span></div><h3>${esc(x.name)}</h3><p class="benefit">${esc(x.benefit)}</p><p class="summary">${esc(x.summary)}</p><div class="card-actions">${destination}</div></article>`;
}).join('');

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
