# 엘펜그라운드

엘펜 축구 동아리 부원이 톡방에 흩어진 훈련·경기·대회 일정을, 한 링크에서 보게 하는 서비스입니다.

이번 3주 초점: **오늘/다음 훈련·경기 시간·장소**를 바로 보고, **다가오는 대회**도 같은 화면에서 확인합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173) 을 엽니다.

## 화면

| 경로 | 화면 |
|------|------|
| `/` | 오늘/다음 카드 + 갱신 시각 + 다가오는 대회 1~2줄 |
| `/calendar` | 한 달 달력 (훈련·경기·대회 표시) |
| `/tournaments` | 다가오는 대회 목록 |
| `/events/:id` | 그 일정의 시간·장소 상세 |
| `/edit` | 운영 비밀번호를 아는 사람만 일정 추가·수정·삭제 |

## 일정 고치는 법 (담당 1명)

톡에 올리기 **전에** 사이트에서 먼저 고칩니다. 다시 배포하지 않아도 부원 화면에 바로 반영됩니다.

1. 오른쪽 위 **운영** 또는 `/edit` 으로 들어갑니다.
2. 운영 비밀번호를 입력합니다.
3. 일정을 저장하고, 홈에서 확인한 뒤 톡에 올립니다.

주 1회, 화면의 갱신 시각이 최근에 바뀌었는지 확인합니다.

## Vercel 배포

Vercel에서 이 저장소를 import 한 뒤, 아래만 맞추면 됩니다.

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   값은 로컬 `.env.local` 과 동일하게 넣습니다.
4. SPA 라우팅 때문에 `refresh`(예: `/calendar`, `/edit`)가 안 되면, Vercel의 **Rewrites/Redirects**에서 아래 rewrite를 추가합니다.
   - `/*` → `/index.html`

## 앱으로 설치

스토어 없이 홈 화면에 둘 수 있습니다. HTTPS(Vercel)에서만 설치 버튼이 뜹니다.

- **Android / Chrome**: 화면 위 **설치하기**, 또는 브라우저 메뉴의 앱 설치
- **iPhone**: Safari에서 공유 → **홈 화면에 추가**

## 이번에 안 하는 것

로그인, 알림, 지도 앱, 일정 복사, 결과·소개·부원 목록, 카톡 자동 발송.

자세한 범위는 [docs/MVP.md](docs/MVP.md) 를 봅니다.
