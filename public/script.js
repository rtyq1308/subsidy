const items = [
  {name:'근로장려금',category:'생활·의료',benefit:'가구 유형별 최대 330만 원',summary:'일을 하지만 소득이 적은 가구를 위한 장려금. 가구 구성·소득·재산 요건을 확인하세요.',wp:901,terms:'소득 근로 자녀 장려금'},
  {name:'자녀장려금',category:'가족',benefit:'18세 미만 자녀 1인당 최대 100만 원',summary:'부부합산 총소득 등 요건을 충족하는 가구를 지원합니다.',wp:937,terms:'양육 근로 장려금'},
  {name:'국민취업지원제도',category:'일자리',benefit:'최대 360만 원 (월 60만 원 × 6개월)',summary:'취업지원 서비스와 수당을 함께 제공합니다. 유형별 소득·취업 요건이 다릅니다.',wp:909,terms:'청년 취준 취업 구직'},
  {name:'국민내일배움카드',category:'일자리',benefit:'최대 500만 원 (기본 300만 원 + 추가 200만 원)',summary:'직업훈련 비용을 지원하는 카드입니다. 일부 대상은 발급에서 제외됩니다.',wp:387,terms:'직업 교육 훈련 청년'},
  {name:'주거급여',category:'생활·의료',benefit:'소득인정액 기준 중위소득 48% 이하',summary:'임차 가구의 임차료 등을 지원합니다. 실제 지원액은 지역·가구별로 다릅니다.',wp:2224,terms:'월세 임대 주거'},
  {name:'재난적의료비 지원',category:'생활·의료',benefit:'본인부담 의료비 일부 지원',summary:'큰 의료비를 지출한 가구를 돕습니다. 소득·재산과 진료비 기준을 확인하세요.',wp:2230,terms:'병원비 의료비 환급'},
  {name:'본인부담상한제',category:'생활·의료',benefit:'개인별 상한액 초과 본인부담금 지급',summary:'건강보험 적용 본인부담금이 개인별 상한액을 넘었는지 확인하는 제도입니다.',wp:2232,terms:'의료비 병원비 환급'},
  {name:'기초연금',category:'생활·의료',benefit:'월 최대 34만 9,700원',summary:'본인과 배우자의 소득·재산에 따른 선정기준을 확인하세요.',wp:1198,terms:'노인 어르신 연금'},
  {name:'문화누리카드',category:'생활·의료',benefit:'문화·여행·체육 분야 이용권',summary:'대상 여부와 가맹점, 사용 기한을 확인하고 이용하세요.',wp:2226,terms:'바우처 문화 여행'},
  {name:'청년월세 지원',category:'청년·주거',benefit:'최대 480만 원 (월 20만 원 × 24개월)',summary:'2026년 신규 신청은 5월 29일 종료됐습니다. 다음 모집 공고를 확인하세요.',wp:2186,terms:'청년 월세 주거',status:'2026년 접수 종료'},
  {name:'청년내일저축계좌',category:'청년·주거',benefit:'최대 1,440만 원 (월 10만 원 × 3년)',summary:'2026년 모집은 종료됐습니다. 근로·소득 요건을 확인하고 다음 공고를 기다리세요.',wp:2188,terms:'청년 적금 자산 저축',status:'2026년 접수 종료'},
  {name:'청년미래적금',category:'청년·주거',benefit:'납입액에 정부기여금 6% 또는 12% 매칭',summary:'3년 만기 상품으로, 소득 등 가입 조건에 따라 지원이 다릅니다.',wp:2190,terms:'청년 적금 자산 저축'},
  {name:'부모급여',category:'가족',benefit:'월 최대 100만 원 (0세 기준)',summary:'아동 연령과 돌봄서비스 이용 여부에 따라 지급 방식이 달라집니다.',wp:2192,terms:'육아 출산 아이 아동'},
  {name:'첫만남이용권',category:'가족',benefit:'최대 300만 원 (둘째 이상)',summary:'출생 아동에게 국민행복카드 이용권을 지급합니다. 사용 기한을 확인하세요.',wp:2194,terms:'출산 아기 바우처'},
  {name:'실업급여',category:'중장년',benefit:'1일 최대 68,100원',summary:'퇴직 사유와 고용보험 가입기간 등 수급 요건, 신청 절차와 지급기간을 확인하세요.',wp:1196,terms:'40대 50대 60대 퇴직 구직 고용보험'},
  {name:'국민연금 수령·추납',category:'중장년',benefit:'수령 시기·예상 연금액·가입기간 확인',summary:'노후 준비를 위해 예상 수령액과 가입기간, 추후납부 가능 여부를 함께 살펴보세요.',wp:1230,terms:'40대 50대 60대 노후 연금 추납'},
  {name:'주택연금',category:'중장년',benefit:'부부 중 1명이 만 55세 이상이면 가입 검토',summary:'보유 주택을 바탕으로 매월 연금을 받는 제도입니다. 주택가격과 지급방식별 조건을 확인하세요.',wp:2228,terms:'50대 60대 노후 집 연금'},
  {name:'노인일자리',category:'중장년',benefit:'공익활동 월 최대 29만 원',summary:'공익활동형·역량활용형 등 사업 유형에 따라 연령과 선발 기준이 다릅니다.',wp:917,terms:'60대 시니어 어르신 취업 일자리'},
  {name:'고령자고용지원금',category:'중장년',benefit:'60세 이상 근로자를 고용한 사업주 지원',summary:'고령자 고용을 늘린 사업주가 대상입니다. 근로자 수와 고용기간 등 요건을 확인하세요.',wp:31,terms:'60대 고령자 계속고용 사업주',status:'사업주 대상'},
  {name:'소상공인 폐업·재기지원',category:'중장년',benefit:'점포 철거·재취업·재창업 지원 확인',summary:'폐업을 준비하거나 폐업한 소상공인이 받을 수 있는 분야별 재기 지원을 확인하세요.',wp:1160,terms:'40대 50대 60대 자영업 폐업 철거 재취업 재창업'},
  {name:'중장년내일센터',category:'중장년',benefit:'만 40세 이상 생애경력설계·전직 지원',summary:'재직자와 퇴직 예정자, 구직자를 위한 경력설계와 재취업 지원 내용을 확인하세요.',wp:2196,terms:'40대 50대 60대 재취업 전직 경력 상담'},
  {name:'국민연금 실업크레딧',category:'중장년',benefit:'연금보험료 최대 75% 지원',summary:'구직급여 수급자가 신청할 수 있으며, 생애 최대 12개월까지 가입기간으로 인정됩니다.',wp:2198,terms:'40대 50대 실직 구직급여 국민연금 보험료'},
  {name:'중장년 경력지원제',category:'중장년',benefit:'중장년의 경력 전환·직무 경험 지원',summary:'참여 연령과 모집 직무, 운영기관별 참여 조건과 신청 기간을 확인하세요.',wp:2200,terms:'50대 60대 재취업 경력 전환 직무 경험'},
  {name:'K-패스',category:'생활·의료',benefit:'대중교통비 최대 53.3% 환급',summary:'월 15회 이상 대중교통 이용 시 환급합니다. 일반 20%, 청년 30%, 저소득 53.3%입니다.',wp:2204,terms:'교통비 버스 지하철 환급 청년'},
  {name:'청년도전지원사업',category:'일자리',benefit:'참여수당 최대 350만 원',summary:'구직을 중단한 청년의 사회 복귀와 취업을 돕는 사업입니다.',wp:2206,terms:'청년 구직 니트 참여수당'},
  {name:'청년내일채움공제',category:'일자리',benefit:'만기 시 최대 1,200만 원',summary:'중소기업 취업 청년의 자산 형성을 돕는 공제입니다.',wp:2208,terms:'청년 중소기업 공제 목돈 적립'},
  {name:'청년문화예술패스',category:'생활·의료',benefit:'공연·전시 관람비 지원',summary:'청년의 문화예술 관람을 지원합니다. 대상 연령과 사용처를 확인하세요.',wp:2210,terms:'청년 공연 전시 문화 관람'},
  {name:'청년형 ISA',category:'청년·주거',benefit:'비과세 혜택 최대 400만 원',summary:'청년 대상 개인종합자산관리계좌입니다. 소득 요건을 확인하세요.',wp:2212,terms:'청년 절세 계좌 비과세 투자'},
  {name:'청년도약계좌',category:'청년·주거',benefit:'만기 목돈 최대 5,000만 원',summary:'청년의 중장기 자산 형성을 돕는 계좌입니다. 소득 구간별 기여금이 다릅니다.',wp:2218,terms:'청년 적금 자산 목돈 기여금'},
  {name:'전기차 보조금',category:'생활·의료',benefit:'최대 680만 원',summary:'전기차 구매 시 국비와 지방비를 함께 지원합니다. 지자체별로 금액이 다릅니다.',wp:2214,terms:'전기차 구매 보조금 자동차 친환경'},
  {name:'중증장애인 신규고용장려금',category:'일자리',benefit:'연 최대 1,080만 원',summary:'중증장애인을 새로 고용한 사업주를 지원합니다.',wp:2216,terms:'장애인 고용 사업주 장려금',status:'사업주 대상'},
  {name:'긴급복지 생계지원',category:'생활·의료',benefit:'최대 330만 원',summary:'갑작스러운 위기로 생계가 어려워진 가구를 지원합니다.',wp:2220,terms:'위기 생계 긴급 지원 실직 질병'},
  {name:'에너지바우처',category:'생활·의료',benefit:'최대 71만 원',summary:'냉난방 에너지 비용을 지원합니다. 소득과 세대원 요건을 확인하세요.',wp:2222,terms:'전기 가스 난방 냉방 에너지 바우처'},
];
// 카드와 광고는 빌드 시점에 페이지에 박힌다. 이 파일은 데이터 원본과 추적만 담당한다.
// 예전처럼 innerHTML을 다시 쓰면 그리드 광고가 지워지므로 렌더링을 하지 않는다.

// 어떤 제도가 실제로 눌리는지 본다.
document.addEventListener('click', event => {
  const link = event.target.closest('a.card');
  if (!link || typeof gtag !== 'function') return;
  gtag('event', 'benefit_click', {
    benefit_name: link.querySelector('h3').textContent.trim(),
    benefit_category: link.querySelector('.tag').textContent.trim(),
    wp_url: link.href,
  });
});

const filterBar = document.querySelector('#filters');
if (filterBar) {
  filterBar.addEventListener('click', event => {
    const link = event.target.closest('a[data-category]');
    if (!link || typeof gtag !== 'function') return;
    gtag('event', 'filter_select', { filter_category: link.dataset.category });
  });
}

// 막대가 상단에 붙었을 때만 그림자를 준다.
const finderBar = document.querySelector('.finder-bar');
if (finderBar && 'IntersectionObserver' in window) {
  const sentinel = document.createElement('div');
  finderBar.parentNode.insertBefore(sentinel, finderBar);
  new IntersectionObserver(
    ([entry]) => finderBar.classList.toggle('is-stuck', !entry.isIntersecting),
    {threshold: 1}
  ).observe(sentinel);
}
