# 쉬운말 기술사전 📖

비개발자를 위한 한국어 IT 용어집. 어려운 기술 용어를 **식당·도서관·택배 같은 일상의 비유**로 풀어 설명합니다.
(영문 사이트 [nontechnical.dev](https://nontechnical.dev/)에서 영감을 받아, 한국어 콘텐츠와 독자적인 따뜻한 에디토리얼 무드로 새로 만들었습니다.)

## ✨ 특징

- **카테고리별 분류** — 기초 · 웹 · 데이터 · 협업 · AI · 보안 · 인프라
- **즉시 검색** — 용어/영문/설명을 한 번에 검색
- **오늘의 한 단어** — 날짜에 따라 매일 바뀌는 추천 용어
- **빌드 불필요** — 순수 HTML/CSS/JS 정적 사이트 (GitHub Pages에 그대로 배포)

## 📂 구조

```
.
├── index.html              # 메인 페이지
├── assets/
│   ├── css/style.css       # 따뜻한 에디토리얼 테마
│   └── js/
│       ├── terms.js        # 용어 데이터 (여기에 단어 추가)
│       └── app.js          # 검색·필터·모달 로직
└── .nojekyll               # GitHub Pages가 그대로 서빙하도록 지정
```

## ➕ 용어 추가하기

`assets/js/terms.js`의 배열에 항목을 추가하면 끝입니다.

```js
{
  id: "고유-id",
  term: "용어 (한글)",
  en: "English Name",
  category: "기초",          // 기초·웹·데이터·협업·AI·보안·인프라
  analogy: "한 줄 비유",
  desc: "조금 더 자세한 설명"
}
```

새 카테고리를 쓰면 필터 칩도 자동으로 생성됩니다.

## 🚀 GitHub Pages 배포

이 저장소는 아직 GitHub에 연결되어 있지 않습니다. 나중에 연결한 뒤:

1. GitHub에 저장소를 만들고 푸시합니다.
2. **Settings → Pages** 로 이동합니다.
3. **Source** 를 `Deploy from a branch` 로 두고, 배포할 브랜치와 `/ (root)` 폴더를 선택합니다.
4. 잠시 후 `https://<사용자명>.github.io/<저장소명>/` 에서 사이트가 열립니다.

> 별도의 빌드 과정이 없으므로 추가 설정 없이 바로 서빙됩니다.

## 🖥 로컬에서 미리보기

```bash
# 아무 정적 서버나 사용하면 됩니다
python3 -m http.server 8000
# → http://localhost:8000
```

---

made with ☕ · 일상의 말로 풀어 쓰는 IT 용어집
