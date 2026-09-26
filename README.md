# DocMan

문서(.pdf, .docx, .md, .txt)나 사진을 올리면 Gemini가 제목·주제·키워드·핵심 내용을 뽑아 주고, 원본과 분석 결과를 내 Google Drive의 `DocMan` 폴더에 정리하는 1인용 웹앱입니다. PC 브라우저와 안드로이드 폰(홈 화면에 설치)에서 씁니다.

- 주소: https://tksong-sogang.github.io/DocMan/
- 서버가 없습니다. 브라우저가 Google Drive와 Gemini API를 직접 부릅니다.
- 기획 문서: [docs/](docs/) (Plan → PRD → ROADMAP → Prepare)

## 사용 방법

1. 주소를 열고 **Google로 로그인** → Drive에 `DocMan` 폴더가 만들어집니다.
2. **설정**에서 Gemini API 키를 입력합니다 (그 브라우저에만 저장됩니다. PC와 폰에서 각각 입력).
3. **업로드**에서 파일을 끌어다 놓거나 선택하거나(폰은 **카메라**로 촬영) → 분석 결과 확인 → **저장**.
4. **대시보드**에서 최근 자료·검색, **그래프**에서 주제 연관 관계를 봅니다. 항목을 누르면 요약과 **원문 보기**가 나옵니다.

**폰에 설치**: Chrome에서 주소를 열고 메뉴 → **홈 화면에 추가**(또는 **앱 설치**).

**제한**
- 파일은 14MB까지, 한 번에 1개. HWP는 PDF로 바꿔서 올립니다.
- Gemini 무료 사용량 한도를 넘으면 잠시 뒤 다시 시도해야 합니다.
- 로그인은 약 1시간 유지됩니다. 테스트 상태의 Google 앱이라 7일마다 다시 승인할 수 있습니다.

## 개발

필요한 것: Node.js, `docs/Prepare.md`의 OAuth 클라이언트 ID

```bash
npm install
```

`.env.local` 파일을 만들고 클라이언트 ID를 넣습니다 (저장소에 올라가지 않습니다).

```
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

| 명령 | 내용 |
|---|---|
| `npm run dev` | 개발 서버 http://localhost:5173/DocMan/ (실제 Google 로그인) |
| `npm run dev:mock` | 더미 데이터로 실행 (로그인·API 키 불필요) |
| `npm test` | 단위 테스트 |
| `npm run lint` | 린트 |
| `npm run build` | 타입 검사 + 배포용 빌드 |

## 배포

`main`에 push하면 GitHub Actions([deploy.yml](.github/workflows/deploy.yml))가 테스트 후 GitHub Pages에 배포합니다. 저장소 설정 두 가지가 필요합니다.

- **Settings → Pages → Source**: GitHub Actions
- **Settings → Secrets and variables → Actions → Variables**: `VITE_GOOGLE_CLIENT_ID`
