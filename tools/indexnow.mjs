/**
 * 사이트맵의 주소를 IndexNow로 네이버·빙에 알린다.
 *
 * 키 파일(public/{32자리 키}.txt, 내용 = 키)이 배포된 뒤에 실행해야 한다.
 * CI는 배포 단계 다음에 이 스크립트를 돌린다.
 * 사용: node tools/indexnow.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';

const HOST = 'subsidy.itfinancelab.com';
// api.indexnow.org는 빙 등 참여 엔진에 공유되고, 네이버는 자체 주소로도 받는다.
const ENDPOINTS = [
  'https://searchadvisor.naver.com/indexnow',
  'https://api.indexnow.org/indexnow',
];

const keyFile = readdirSync('public').find((name) => /^[0-9a-f]{32}\.txt$/.test(name));
if (!keyFile) throw new Error('public/ 에 IndexNow 키 파일이 없습니다.');
const key = keyFile.slice(0, -4);

const urlList = [...readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1]);

let failed = 0;
for (const endpoint of ENDPOINTS) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
  });
  // 200·202 모두 접수다. 202는 키 확인을 기다리는 상태다.
  const ok = res.status === 200 || res.status === 202;
  if (!ok) failed += 1;
  console.log(`${endpoint} → HTTP ${res.status}${ok ? ' 접수' : ` 실패 ${(await res.text()).slice(0, 200)}`}`);
}
console.log(`주소 ${urlList.length}개 제출`);
if (failed === ENDPOINTS.length) process.exit(1);
