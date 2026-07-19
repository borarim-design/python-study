/* 매일 학습 알림 발송기 */
const webpush = require("web-push");

// 시크릿에 실수로 딸려온 앞뒤 공백/줄바꿈을 자동으로 제거(trim)
const VAPID_PUBLIC_KEY = (process.env.VAPID_PUBLIC_KEY || "").trim();
const VAPID_PRIVATE_KEY = (process.env.VAPID_PRIVATE_KEY || "").trim();
const VAPID_SUBJECT = (process.env.VAPID_SUBJECT || "mailto:example@example.com").trim();
const PUSH_SUBSCRIPTION = (process.env.PUSH_SUBSCRIPTION || "").trim();

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !PUSH_SUBSCRIPTION) {
  console.error("❌ 필요한 환경변수가 없습니다.");
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const subscription = JSON.parse(PUSH_SUBSCRIPTION);

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
