# DocMan 준비 사항

> 근거 문서: `docs/ROADMAP.md` (확정)
> 개발 의뢰자가 직접 준비해야 하는 항목이다. **Phase 1~3은 준비 없이 바로 시작할 수 있고, Phase 4 시작 전까지 2~3번을 끝내면 된다.**

## 준비 현황 요약

| # | 항목 | 필요한 시점 | 상태 |
|---|---|---|---|
| 1 | 개발 도구 (Node.js, Git, GitHub CLI) | Phase 1 | ✅ 설치됨 (Node v26.9.0, Git 2.55.0, gh 2.101.0) |
| 2 | Google Cloud 프로젝트와 OAuth 클라이언트 ID | Phase 4 | ✅ 완료 (`.env.local`에 저장) |
| 3 | Gemini API 키 | Phase 4 | ⬜ |
| 4 | GitHub 저장소 | Phase 5 (원하면 더 일찍) | ⬜ (gh는 `tksong-sogang` 계정으로 로그인되어 있음) |
| 5 | 안드로이드 폰 (Chrome) | Phase 4-6, 5 | ⬜ |

---

## 1. 개발 도구 — 준비 완료

이 PC에 이미 설치되어 있다. 따로 할 일은 없다.

---

## 2. Google Cloud 프로젝트와 OAuth 클라이언트 ID

DocMan이 본인 Google Drive에 접근하려면 필요하다. 무료다.
(Google Cloud 콘솔 메뉴 이름은 바뀔 수 있다. 아래에 적힌 이름이 안 보이면 비슷한 이름의 메뉴를 찾으면 된다.)

1. https://console.cloud.google.com 에 DocMan에서 쓸 Google 계정으로 로그인한다.
2. 새 프로젝트를 만든다. 이름 예: `DocMan`
3. **API 및 서비스 → 라이브러리**에서 **Google Drive API**를 찾아 **사용**을 누른다.
4. **Google 인증 플랫폼(Google Auth Platform)** 을 설정한다. (예전의 'OAuth 동의 화면'이 이 메뉴로 바뀌었다)
   - 들어가는 곳: 왼쪽 메뉴 **API 및 서비스 → OAuth 동의 화면**, 또는 주소 https://console.cloud.google.com/auth/overview
   - 처음이면 **시작하기(Get started)** 버튼을 누르고 순서대로 입력한다
     1. 앱 정보: 앱 이름 `DocMan`, 사용자 지원 이메일 = 본인 이메일
     2. 대상: **외부(External)**
     3. 연락처 정보: 본인 이메일
     4. 정책 동의 → **만들기**
   - 만든 뒤 왼쪽 메뉴 **대상(Audience)** (https://console.cloud.google.com/auth/audience) 에서
     - 게시 상태가 **테스트 중(Testing)** 인지 확인한다 (그대로 둔다, 구글 검수가 필요 없다)
     - **테스트 사용자 → Add users**로 본인 Google 계정을 추가한다
   - 범위(Scope)는 따로 추가하지 않아도 된다 (앱이 로그인할 때 `drive.file`을 요청한다)
   - 참고: 테스트 상태에서는 로그인 승인이 7일마다 만료될 수 있다. 다시 로그인하면 된다.
5. 왼쪽 메뉴 **클라이언트(Clients) → 클라이언트 만들기** (https://console.cloud.google.com/auth/clients)
   - 애플리케이션 유형: **웹 애플리케이션**
   - **승인된 JavaScript 원본**에 아래 두 개를 추가한다
     - `http://localhost:5173` (개발용)
     - `https://tksong-sogang.github.io` (배포용, 4번에서 다른 계정을 쓰면 그 계정 이름으로)
   - 리디렉션 URI는 비워 둔다
6. 만들어진 **클라이언트 ID**(`…apps.googleusercontent.com`으로 끝나는 값)를 복사해 둔다.
   - 클라이언트 ID는 공개돼도 되는 값이라 채팅으로 알려줘도 된다. AI가 `.env.local`에 넣고, 이 파일은 GitHub에 올리지 않는다.
   - **클라이언트 보안 비밀번호(Client Secret)는 쓰지 않는다. 알려주지 않아도 된다.**

---

## 3. Gemini API 키

문서와 사진 분석에 쓴다. 무료 사용량 안에서 쓸 수 있다.

1. https://aistudio.google.com 에 로그인한다.
2. **Get API key → API 키 만들기**를 누른다 (2번에서 만든 `DocMan` 프로젝트를 골라도 된다).
3. 키를 안전한 곳에 보관한다.
   - **이 키는 비밀값이다. 채팅, 코드, GitHub에 올리지 않는다.**
   - 앱이 완성되면 DocMan의 **설정(P05)** 화면에 직접 입력한다. 키는 그 브라우저에만 저장된다.
   - PC와 폰에서 각각 한 번씩 입력해야 한다.

**알아둘 점**
- 무료 사용량에는 분당·하루 요청 수 한도가 있다. 혼자 쓰는 정도면 보통 충분하다.
- 무료 사용량으로 보낸 내용은 Google이 서비스 개선에 쓸 수 있다 (Gemini API 약관 기준). 민감한 문서를 다룬다면 이 점을 고려하고, 필요하면 나중에 유료 사용량으로 바꿀 수 있다.

---

## 4. GitHub 저장소

코드 보관과 무료 배포(GitHub Pages)에 쓴다.

- 정할 것
  - **저장소 이름**: 기본 제안은 `DocMan` → 배포 주소는 `https://tksong-sogang.github.io/DocMan/`
  - **공개 여부**: 무료 계정에서 GitHub Pages를 쓰려면 **공개(Public)** 저장소여야 한다. 코드에는 비밀값이 들어가지 않으므로 공개해도 된다.
- 저장소 만들기와 첫 업로드는 AI가 `gh`로 할 수 있다. 할 때 다시 확인을 받는다.

---

## 5. 안드로이드 폰

- Chrome 브라우저가 필요하다.
- Phase 4-6(카메라 촬영)에서 개발 중인 앱을 폰으로 열어 봐야 한다. 이때 PC와 폰을 같은 Wi-Fi에 연결한다. 방법은 그 단계에서 안내한다.
- 폰에서도 2번의 테스트 사용자로 등록한 Google 계정으로 로그인해야 한다.

---

## AI에게 알려줄 정보

| 정보 | 언제 | 비고 |
|---|---|---|
| OAuth 클라이언트 ID | Phase 4 시작 전 | 채팅으로 알려줘도 된다 |
| 저장소 이름·공개 여부 확인 | Phase 5 전 (또는 git 초기화 때) | 기본값: `DocMan`, 공개 |
| Gemini API 키 | **알려주지 않는다** | 앱 설정 화면에 직접 입력 |
