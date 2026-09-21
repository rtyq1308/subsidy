# 지원금 사이트 벤치마크·연결 조사

확인일: 2026-09-21 KST. 공개 페이지와 `sub.itfinancelab.com`의 WordPress 공개 REST API를 확인했다. 계정 인사이트나 비공개 분석값은 사용하지 않았다.

## 참고 계정의 공개 게시물 표본

`@kkbenefit`의 공개 프로필은 짧은 경험형 도입 → 여러 지원 제도 나열 → 별도 답글 또는 연결 글의 사이트 링크 구조를 반복한다. 아래는 직접 연 게시물에서 확인한 누적 조회수 순서다. 게시 시점과 경과시간이 달라 소재별 우열을 뜻하지 않는다. 계정 전체 게시물의 순위도 아니다.

| 게시물 | 주요 소재 | 확인한 누적 조회수 |
|---|---|---:|
| [2026-09-13 게시물](https://www.threads.com/@kkbenefit/post/DdOuarEDix0) | 청년 공제·교통비·도전지원 | 약 3.1천 |
| [2026-09-15 게시물](https://www.threads.com/@kkbenefit/post/DdQqAI1E16h) | 취업지원·주거급여·교통비 | 약 2.7천 |
| [2026-09-16 게시물](https://www.threads.com/@kkbenefit/post/DdSRFmikpoO) | 월세·도전지원·교통비 | 약 2.2천 |
| [2026-09-12 게시물](https://www.threads.com/@kkbenefit/post/DdNHgCMD9bg) | 공제·적금·교통비 | 약 1.7천 |
| [2026-09-13 게시물](https://www.threads.com/@kkbenefit/post/DdOFRyHAgWi) | 취업지원·공공임대·문화패스 | 857 |
| [2026-09-14 게시물](https://www.threads.com/@kkbenefit/post/DdQA3TajkK8) | 기본소득·일경험·청약 | 785 |
| [2026-09-21 게시물](https://www.threads.com/@kkbenefit/post/DdfyQLiDk4w) | 미래적금·문화패스·취업지원 | 580 |
| [2026-09-12 게시물](https://www.threads.com/@kkbenefit/post/DdNcAqKiovH) | 월세·주거급여·공공임대 | 573 |
| [2026-09-21 게시물](https://www.threads.com/@kkbenefit/post/DdgbbtkkXbm) | 월세·취업지원·문화패스 | 554 |
| [2026-09-14 게시물](https://www.threads.com/@kkbenefit/post/DdPsPLkEzIa) | 신용회복·마음건강 | 214 |
| [2026-09-13 게시물](https://www.threads.com/@kkbenefit/post/DdOZ5mrggUn) | 보증료·창업대출·월세 | 179 |
| [2026-09-12 게시물](https://www.threads.com/@kkbenefit/post/DdNwpagj3Js) | 응시료·일경험·취업지원 | 61 |

참고 [fund.ulalamom.com](https://fund.ulalamom.com/)은 목록 카드 → 개별 지원 페이지 구조다. 메인에 근거를 밝히지 않은 수령 평균·누락률·상시 마감 카운트다운이 있어 초안에는 적용하지 않았다. 참고 계정 글에도 현재 모집이 종료된 항목이나 별도 확인이 필요한 명칭·금액이 보인다. 문구나 사례를 복제하지 않고 공식 자료로 확인한 개별 제도만 소개한다.

## WordPress 연결 기준

공개 REST API에서 게시물 1,041개를 읽고 제목상 지원금·급여·환급 등 후보 122개를 추렸다. 본문을 검토해 초안에 연결한 ID는 901, 937, 233, 1198, 1410이다. 연결 전 각 번호가 HTTP 200으로 존재함을 확인했다.

| 제도 | 기존 글 | 판단 |
|---|---:|---|
| 근로장려금 | [901](https://sub.itfinancelab.com/저장소/901) | 연결. 최대액은 [국세청 기준](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7781&mi=2450)으로 표시 |
| 자녀장려금 | [937](https://sub.itfinancelab.com/저장소/937) | 연결. 1인당 최대액은 [국세청 기준](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7782&mi=6594) |
| 주거급여 | [233](https://sub.itfinancelab.com/저장소/233) | 연결. 선정기준은 [보건복지부](https://www.mohw.go.kr/menu.es?mid=a10708010300) 확인 |
| 기초연금 | [1198](https://sub.itfinancelab.com/저장소/1198) | 연결. 개인별 수급액은 표시하지 않음 |
| 문화누리카드 | [1410](https://sub.itfinancelab.com/저장소/1410) | 연결. 사용처·기한 중심 |
| 국민취업지원제도 | [909](https://sub.itfinancelab.com/저장소/909) | 보류. 제도명·Ⅰ/Ⅱ유형 구분을 명확히 하고 검증되지 않은 후기 표현 삭제 필요 |
| 국민내일배움카드 | [387](https://sub.itfinancelab.com/저장소/387) | 보류. 모든 훈련비 전액 지원처럼 읽히는 버튼 문구와 발급 제외 요건 수정 필요 |
| 재난적의료비 | [923](https://sub.itfinancelab.com/저장소/923) | 보류. 온라인 접수 가능 주장과 최신 구비서류·기한 확인 필요 |
| 본인부담상한제 | [1923](https://sub.itfinancelab.com/저장소/1923) | 보류. 누구나 환급받는다는 표현과 환급 대상 판정 설명 수정 필요 |
| 청년월세 지원 | 없음 | 신규 글 필요. [2026년 접수 종료](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004661) 표시 |
| 청년내일저축계좌 | 없음 | 신규 글 필요. [2026년 접수 종료](https://www.korea.kr/news/policyNewsView.do?newsId=148963836) 표시 |
| 청년미래적금 | 없음 | 신규 글 필요. [금융위원회 안내](https://www.korea.kr/news/policyNewsView.do?newsId=148966909) |
| 부모급여 | 없음 | 신규 글 필요. [복지로 안내](https://m.bokjiro.go.kr/ssis-tem/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004657) |
| 첫만남이용권 | 없음 | 신규 글 필요. [보건복지부 안내](https://www.mohw.go.kr/menu.es?mid=a10711020100) |

기존 글 [1803](https://sub.itfinancelab.com/저장소/1803)은 근로장려금 맞벌이 최대 360만 원·소득 기준 5,200만 원을 주장하지만, 현재 [국세청 안내](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7781&mi=2450)는 최대 330만 원·4,400만 원 미만이다. [198](https://sub.itfinancelab.com/저장소/198)의 기한 후 신청 10% 감액도 [2026년 국세청 발표](https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350768)의 5% 감액과 다르다. 두 글은 연결하지 않았다.

## 우선 제작 순서

1. 큰 수요의 상시 안내: 근로·자녀장려금, 주거급여, 기초연금, 국민취업지원제도, 국민내일배움카드.
2. 청년 관심 소재: 청년월세 지원, 청년내일저축계좌, 청년미래적금. 접수 종료 여부를 먼저 보이게 한다.
3. 가족·의료: 부모급여, 첫만남이용권, 재난적의료비, 본인부담상한제.

이 순서는 참고 계정의 표본 조회수와 혜택 규모·대상 범위를 함께 본 편집 우선순위다. 개별 지원금의 실제 검색량 순위나 조회수 순위로 주장하지 않는다.
