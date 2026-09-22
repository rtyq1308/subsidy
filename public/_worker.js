// pages.dev 기본 주소로 들어온 요청을 커스텀 도메인으로 넘긴다.
//
// Cloudflare Pages는 커스텀 도메인을 붙여도 <프로젝트>.pages.dev를 계속 서빙한다.
// 같은 HTML을 그대로 내보내므로 애드센스에 등록되지 않은 도메인에 광고가 게재되고,
// 같은 내용이 두 주소에 존재하게 된다. 그래서 정식 주소로 영구 이동시킨다.
const CANONICAL_HOST = 'subsidy.itfinancelab.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.endsWith('.pages.dev')) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
