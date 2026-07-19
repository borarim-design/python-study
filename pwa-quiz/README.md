# 파이썬 학습 퀴즈 📱🐍

매일 밤 9시에 "공부하세요!" 알림이 오고(그날 다 풀었으면 안 옴), 폰 홈 화면에 앱처럼 설치되고, 내가 배운 내용을 문제로 계속 추가할 수 있는 나만의 학습 앱입니다.

전부 **무료**이고, 신용카드 없이 **GitHub 하나로** 굴러갑니다.

---

## 🎯 완성하면 이렇게 됩니다
- 안드로이드 홈 화면에 "Py 퀴즈" 앱 아이콘이 생김 (오프라인에서도 열림)
- 매일 밤 9시에 학습 알림 (그날 이미 다 풀었으면 잔소리 대신 조용한 응원)
- "＋ 내 문제 추가"로 폰에서 직접 문제 등록
- 섹션별 최고 점수 + 🔥 연속 학습일 기록

---

## 🗂 폴더 구성
```
pwa-quiz/
├─ index.html              앱 화면 (퀴즈 본체)
├─ content.js              ← 문제 은행. 여기에 계속 문제를 추가하세요!
├─ sw.js                   서비스워커 (오프라인 + 푸시 수신)
├─ manifest.webmanifest    앱 설치 정보
├─ icons/                  앱 아이콘
├─ server/
│  ├─ send-push.js         알림 발송 스크립트
│  └─ package.json
├─ .github/workflows/
│  └─ daily-reminder.yml   매일 밤 9시 자동 실행
└─ README.md               이 파일
```

---

## 🔑 내 VAPID 키 (이미 만들어 뒀어요)

푸시 알림 인증에 쓰는 키입니다. 아래 5번에서 GitHub 시크릿에 넣을 거예요.

- **VAPID_PUBLIC_KEY**
  ```
  BIEqpiL2lC_xunEm3Ppu7ZPEnz3OHTX9-yGLDv9ElYQzyFC9TXqL6-2QjzUJWzagQh7gHRf5r8LPZznEL1Hf1Gs
  ```
- **VAPID_PRIVATE_KEY** (⚠️ 절대 남에게 공개 금지)
  ```
  k-ujibf-n8012rtmWyKj3LA_xsGc5eOATNZneeCwBjU
  ```
- **VAPID_SUBJECT**: `mailto:` 뒤에 본인 이메일 (예: `mailto:me@gmail.com`)

> 공개키(PUBLIC)는 이미 `index.html` 안에도 넣어놨어요. 두 곳이 같아야 알림이 동작합니다.

---

## 📝 단계별 설정 (약 15분)

### 1) GitHub 가입
[github.com](https://github.com) → **Sign up** → 이메일/비밀번호/아이디 입력 → 무료 플랜 선택.

### 2) 새 저장소(repository) 만들기
오른쪽 위 **＋ → New repository**
- Repository name: `python-quiz` (아무거나 OK)
- **Public** 선택 (GitHub Pages 무료 호스팅에 필요)
- **Create repository**

### 3) 파일 업로드
만든 저장소 화면에서 **Add file → Upload files** 를 누르고,
이 `pwa-quiz` 폴더 **안의 내용물 전체**(index.html, content.js, sw.js, icons 폴더, server 폴더, .github 폴더 등)를 드래그해서 올린 뒤 **Commit changes**.

> 💡 `.github` 폴더가 안 보이면, 파일 탐색기에서 숨김 파일 보기를 켜거나, 업로드 시 폴더째 끌어다 놓으세요. 이 폴더가 있어야 매일 알림이 동작합니다.

### 4) GitHub Pages 켜기 (앱을 인터넷에 공개)
저장소 상단 **Settings → 왼쪽 메뉴 Pages**
- **Source**: `Deploy from a branch`
- **Branch**: `main` / `(root)` → **Save**
- 1~2분 뒤 새로고침하면 주소가 나옵니다:
  `https://<내아이디>.github.io/python-quiz/`
  → 이게 **앱 주소**예요. 폰 크롬으로 접속!

### 5) 시크릿(비밀 값) 4개 등록
저장소 **Settings → 왼쪽 Secrets and variables → Actions → New repository secret**
아래 4개를 각각 추가하세요 (Name 정확히 일치해야 함):

| Name | Value |
|---|---|
| `VAPID_PUBLIC_KEY` | 위 공개키 |
| `VAPID_PRIVATE_KEY` | 위 개인키 |
| `VAPID_SUBJECT` | `mailto:본인이메일` |
| `PUSH_SUBSCRIPTION` | (아래 6번에서 얻는 값) |

### 6) 폰에서 앱 설치 + 알림 구독
1. 안드로이드 **크롬**으로 4번의 앱 주소 접속
2. 주소창 메뉴(⋮) → **홈 화면에 추가** → 아이콘 생성 (앱 설치 완료!)
3. 앱을 열고 상단 **🔔 매일 알림 켜기** → **알림 허용하고 구독 만들기** → 알림 권한 **허용**
4. 화면에 나오는 **구독 정보**를 **📋 복사**
5. 그 값을 5번의 `PUSH_SUBSCRIPTION` 시크릿에 붙여넣고 저장

### 7) 알림 테스트
저장소 **Actions 탭 → "매일 학습 알림" → Run workflow** (수동 실행)
→ 초록 체크가 뜨면 폰에 알림이 도착합니다. 🎉
이제부터 매일 밤 9시에 자동으로 와요.

---

## ➕ 문제 계속 추가하기
- **폰에서 간단히**: 앱의 "＋ 내 문제 추가" 버튼 (이 폰에만 저장됨)
- **영구적으로 / 여러 기기 공유**: `content.js` 파일을 열어 맨 아래 배열에 새 문제·섹션 추가 후 GitHub에 다시 업로드. (파일 맨 위에 작성법이 주석으로 있어요.)

## ⏰ 알림 시간 바꾸기
`.github/workflows/daily-reminder.yml`의 `cron: "0 12 * * *"` 를 수정.
값은 **UTC 기준**이라 한국시간에서 9를 빼세요. 예) 아침 8시(KST) → UTC 23:00 → `"0 23 * * *"`.

---

## ⚠️ 솔직한 한계 (알아두면 좋아요)
- **"오늘 다 풀면 알림 건너뛰기"**는 앱(폰) 안에서 판단해요. 안드로이드는 조용한 알림이 반복되면 가끔 기본 알림을 대신 띄울 수 있어, 여기서는 완전 무음 대신 아주 짧은 "학습 완료!" 응원 알림으로 처리했어요.
- 이걸 진짜 완벽하게(다 풀면 아예 발송 안 함) 하려면, "오늘 학습함" 상태를 기억하는 작은 서버(API)를 붙이면 됩니다. → **다음 단계 학습 프로젝트로 딱 좋아요.**
- GitHub Actions 예약은 정확히 9시가 아니라 몇 분 늦을 수 있어요.

## 🚀 다음 단계 (FDE 연습)
1. 상태 저장 API 만들기 (Cloudflare Workers/Vercel + KV) → 다 풀면 알림 완전 스킵
2. 여러 사람 구독 받기 (구독 정보를 DB에 저장)
3. 오답 문제만 다시 모아 복습해주는 기능
```
```
즐겁게 공부하세요! 💪
