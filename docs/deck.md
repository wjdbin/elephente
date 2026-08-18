---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  section {
    background: #fffbf7;
    color: #1a2744;
    font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    padding: 52px 64px;
  }
  h1, h2, h3 { color: #1a2744; font-weight: 800; }
  h1 { font-size: 56px; }
  h2 { font-size: 36px; margin-bottom: 28px; }
  strong { color: #f5821f; }
  em { font-style: normal; color: #64708a; }
  footer { color: #64708a; font-size: 14px; }
  .brand { letter-spacing: 0.18em; color: #f5821f; font-size: 14px; font-weight: 700; }
  .muted { color: #64708a; }
  .phones { display: flex; gap: 18px; justify-content: center; align-items: flex-start; }
  .phones img {
    height: 430px;
    border-radius: 18px;
    box-shadow: 0 10px 28px rgba(26, 39, 68, 0.16);
    background: #fff;
  }
  .stack { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
  .chip {
    background: #fff1e3;
    color: #1a2744;
    border-radius: 999px;
    padding: 10px 18px;
    font-weight: 700;
    font-size: 22px;
  }
  .nums { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 8px; }
  .num {
    background: #fff;
    border: 1px solid #ead9c8;
    border-radius: 20px;
    padding: 22px 18px;
    text-align: center;
  }
  .num b { display: block; font-size: 28px; margin-top: 8px; }
  .next { display: flex; align-items: center; justify-content: space-between; gap: 32px; }
  .next img { width: 220px; height: 220px; background: #fff; padding: 10px; border-radius: 16px; }
---

<!-- ① 표지 · 10초 -->

![bg left:38% w:280](slides/logo.png)

# 엘펜그라운드

엘펜 부원이 톡방에 흩어진 일정을,
**한 링크에서** 본다

조정빈 · FC ELEPHENTE

---

<!-- ② 문제 · 30초 · 페르소나 -->

## 오늘 어디야?

2학년 김민재. 수업이 끝나 운동장에 갔는데, **오늘은 다른 구장**이었다.

톡은 쌓여 있고, 공지는 찾기 싫다.
그래서 동기에게 또 묻는다. *“오늘 어디야?”*

---

<!-- ③ 해결 · 20초 · Must -->

## 열자마자 오늘이 보이게

Must는 **오늘 카드** 하나다.

링크만 열면 다음 정모의 **시간·장소**가 맨 위.
가입도, 알림도 없다. 헛걸음이 여기서 끝난다.

---

<!-- ④ 데모 · 60초 -->

## 오늘 · 달력 · 대회

<div class="phones">

![home](slides/home.png)

![calendar](slides/calendar.png)

![tournaments](slides/tournaments.png)

</div>

---

<!-- ⑤ 기술 · 20초 -->

## 이렇게 만들었다

<div class="stack">
<span class="chip">React</span>
<span class="chip">Vite</span>
<span class="chip">TypeScript</span>
<span class="chip">Tailwind</span>
<span class="chip">Supabase</span>
<span class="chip">Vercel</span>
<span class="chip">PWA</span>
</div>

일정은 Supabase, 화면은 Vercel.
고치면 다시 배포하지 않아도 부원 화면에 바로 반영된다.

---

<!-- ⑥ 숫자 · 20초 · 오늘 밤 마케팅 후 기입 -->

## 오늘 밤 숫자로 확인

동아리 톡에 링크를 올리고, GA로 본다.

<div class="nums">
<div class="num">사용자<br><b>　명</b></div>
<div class="num">유입<br><b>톡 링크</b></div>
<div class="num">반응<br><b>　</b></div>
</div>

---

<!-- ⑦ 배운 점 · 15초 -->

## 막힌 곳

달력을 올리면 **날짜가 헤더 글자와 겹쳤다.**
둘 다 같은 레이어에 있어서였다.

헤더를 위로 올리고 배경을 불투명하게 바꿨다.
스크롤해도 이름이 가려지지 않는다.

---

<!-- ⑧ 다음 · 5초 · Won't + QR -->

## 다음은 알림이 아니다

알림·로그인은 안 한다.
홈 화면에 두고, **이 링크로 오늘만** 확인한다.

<div class="next">
<div>

elephente.vercel.app

</div>

![QR](slides/qr.png)

</div>
