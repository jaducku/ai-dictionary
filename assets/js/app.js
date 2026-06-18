// 쉬운말 기술사전 — 인터랙션
(function () {
  "use strict";

  var terms = window.TERMS || [];
  var grid = document.getElementById("grid");
  var filtersEl = document.getElementById("filters");
  var searchEl = document.getElementById("search");
  var countEl = document.getElementById("count");
  var emptyEl = document.getElementById("empty");
  var modal = document.getElementById("modal");
  var modalBody = document.getElementById("modal-body");

  var state = { query: "", category: "전체" };

  // ── 카테고리 목록 ──
  var categories = ["전체"];
  terms.forEach(function (t) {
    if (categories.indexOf(t.category) === -1) categories.push(t.category);
  });

  // ── 필터 칩 렌더 ──
  categories.forEach(function (cat) {
    var btn = document.createElement("button");
    btn.className = "chip" + (cat === "전체" ? " active" : "");
    btn.textContent = cat;
    btn.setAttribute("role", "tab");
    btn.addEventListener("click", function () {
      state.category = cat;
      Array.prototype.forEach.call(filtersEl.children, function (c) {
        c.classList.toggle("active", c === btn);
      });
      render();
    });
    filtersEl.appendChild(btn);
  });

  // ── 검색 ──
  searchEl.addEventListener("input", function () {
    state.query = searchEl.value.trim().toLowerCase();
    render();
  });

  // ── 필터링 ──
  function getFiltered() {
    return terms.filter(function (t) {
      var matchCat = state.category === "전체" || t.category === state.category;
      if (!matchCat) return false;
      if (!state.query) return true;
      var hay = (t.term + " " + t.en + " " + t.analogy + " " + t.desc).toLowerCase();
      return hay.indexOf(state.query) !== -1;
    });
  }

  // ── 카드 렌더 ──
  function render() {
    var list = getFiltered();
    grid.innerHTML = "";

    if (list.length === 0) {
      emptyEl.hidden = false;
      countEl.textContent = "";
      return;
    }
    emptyEl.hidden = true;
    countEl.textContent = list.length + "개의 용어";

    list.forEach(function (t) {
      var card = document.createElement("button");
      card.className = "term-card";
      card.innerHTML =
        '<span class="card-cat">' + esc(t.category) + "</span>" +
        '<h3 class="card-term">' + esc(t.term) + "</h3>" +
        '<p class="card-en">' + esc(t.en) + "</p>" +
        '<p class="card-analogy">' + esc(t.analogy) + "</p>";
      card.addEventListener("click", function () { openModal(t); });
      grid.appendChild(card);
    });
  }

  // ── 모달 ──
  function openModal(t) {
    modalBody.innerHTML =
      '<span class="modal-cat">' + esc(t.category) + "</span>" +
      '<h2 class="modal-term" id="modal-term">' + esc(t.term) + "</h2>" +
      '<p class="modal-en">' + esc(t.en) + "</p>" +
      '<p class="modal-analogy">' + esc(t.analogy) + "</p>" +
      '<p class="modal-label">자세히</p>' +
      '<p class="modal-desc">' + esc(t.desc) + "</p>";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // ── 오늘의 용어 (날짜 기반으로 매일 고정) ──
  function renderWordOfDay() {
    var box = document.getElementById("word-of-day");
    if (!box || terms.length === 0) return;
    var now = new Date();
    var dayIndex = Math.floor(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000
    );
    var t = terms[dayIndex % terms.length];
    box.insertAdjacentHTML(
      "beforeend",
      '<h3 class="featured-term">' + esc(t.term) + "</h3>" +
        '<p class="featured-en">' + esc(t.en) + "</p>" +
        '<p class="featured-analogy">' + esc(t.analogy) + "</p>" +
        '<p class="featured-desc">' + esc(t.desc) + "</p>"
    );
    box.style.cursor = "pointer";
    box.addEventListener("click", function () { openModal(t); });
  }

  // ── 유틸 ──
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ── 시작 ──
  renderWordOfDay();
  render();
})();
