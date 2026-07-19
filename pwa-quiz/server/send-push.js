/* 매일 학습 알림 발송기
   GitHub Actions가 매일 밤 9시(KST)에 이 스크립트를 실행합니다.
   필요한 환경변수(= GitHub 시크릿):
     VAPID_PUBLIC_KEY   공개키 (앱 index.html에 있는 것과 동일)
     VAPID_PRIVATE_KEY  개인키 (절대 공개 금지)
     VAPID_SUBJECT      연락처 (예: "mailto:you@example.com")
     PUSH_SUBSCRIPTION   앱에서 복사한 구독 정보(JSON 문자열)
*/
const webpush = require("web-push");

const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_SUBJECT = "mailto:example@example.com",
  PUSH_SUBSCRIPTION
} = process.env;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !PUSH_SUBSCRIPTION) {
  console.error("❌ 필요한 환경변수(VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / PUSH_SUBSCRIPTION)가 없습니다.");
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const subscription = JSON.parse(PUSH_SUBSCRIPTION);

// 알림 문구 (원하면 자유롭게 바꾸세요). 여러 개면 랜덤으로 하나 선택.
const messages = [
  { title: "🐍 파이썬 공부할 시간!", body: "오늘 30분, 퀴즈 한 판 어때요? 연속 기록을 이어가세요 🔥" },
  { title: "🔥 스트릭 지키기!", body: "딱 한 섹션만 풀어도 오늘 학습 완료. 지금 시작해요!" },
  { title: "👩‍💻 FDE로 한 걸음", body: "매일의 30분이 쌓입니다. 오늘 퀴즈 풀러 가볼까요?" }
];
const payload = JSON.stringify(messages[Math.floor(Math.random() * messages.length)]);

webpush.sendNotification(subscription, payload)
  .then(() => console.log("✅ 알림 발송 성공"))
  .catch((err) => {
    console.error("❌ 발송 실패:", err.statusCode, err.body);
    process.exit(1);
  });
