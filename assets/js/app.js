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

  // ── id로 용어를 찾는 색인 (관련 용어 링크용) ──
  var byId = {};
  terms.forEach(function (t) { byId[t.id] = t; });

  // ── 카테고리 목록 (등장 순서 유지) ──
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

  // ── 검색 대상 텍스트 모으기 ──
  function haystack(t) {
    var parts = [t.term, t.en, t.tldr || "", t.analogy || ""];
    (t.sections || []).forEach(function (s) { parts.push(s.h, s.p); });
    (t.unlocks || []).forEach(function (u) { parts.push(u); });
    if (t.punchline) parts.push(t.punchline);
    return parts.join(" ").toLowerCase();
  }

  // ── 필터링 ──
  function getFiltered() {
    return terms.filter(function (t) {
      var matchCat = state.category === "전체" || t.category === state.category;
      if (!matchCat) return false;
      if (!state.query) return true;
      return haystack(t).indexOf(state.query) !== -1;
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
        (t.tldr ? '<p class="card-tldr">' + esc(t.tldr) + "</p>" : "") +
        '<p class="card-analogy">' + esc(t.analogy) + "</p>";
      card.addEventListener("click", function () { openModal(t); });
      grid.appendChild(card);
    });
  }

  // ── 모달 본문 만들기 ──
  function modalHTML(t) {
    var html =
      '<span class="modal-cat">' + esc(t.category) + "</span>" +
      '<h2 class="modal-term" id="modal-term">' + esc(t.term) + "</h2>" +
      '<p class="modal-en">' + esc(t.en) + "</p>";

    if (t.tldr) html += '<p class="modal-tldr">' + esc(t.tldr) + "</p>";
    html += '<p class="modal-analogy">' + esc(t.analogy) + "</p>";

    (t.sections || []).forEach(function (s) {
      html +=
        '<h3 class="modal-sec-h">' + esc(s.h) + "</h3>" +
        '<p class="modal-sec-p">' + esc(s.p) + "</p>";
    });

    if (t.unlocks && t.unlocks.length) {
      html += '<p class="modal-label">이걸로 할 수 있어요</p><ul class="modal-unlocks">';
      t.unlocks.forEach(function (u) { html += "<li>" + esc(u) + "</li>"; });
      html += "</ul>";
    }

    if (t.punchline) html += '<p class="modal-punch">' + esc(t.punchline) + "</p>";

    if (t.related && t.related.length) {
      var chips = t.related
        .filter(function (id) { return byId[id]; })
        .map(function (id) {
          return '<button class="rel-chip" data-rel="' + esc(id) + '">' +
            esc(byId[id].term) + "</button>";
        });
      if (chips.length) {
        html += '<p class="modal-label">관련 용어</p>' +
          '<div class="modal-related">' + chips.join("") + "</div>";
      }
    }
    return html;
  }

  // ── 모달 ──
  function openModal(t) {
    modalBody.innerHTML = modalHTML(t);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalBody.scrollTop = 0;
    if (modal.querySelector(".modal-panel")) {
      modal.querySelector(".modal-panel").scrollTop = 0;
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) { closeModal(); return; }
    var rel = e.target.getAttribute("data-rel");
    if (rel && byId[rel]) openModal(byId[rel]);
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
    var lead = t.tldr ? '<p class="featured-tldr">' + esc(t.tldr) + "</p>" : "";
    var more = (t.sections && t.sections[0]) ? esc(t.sections[0].p) : "";
    box.insertAdjacentHTML(
      "beforeend",
      '<h3 class="featured-term">' + esc(t.term) + "</h3>" +
        '<p class="featured-en">' + esc(t.en) + "</p>" +
        lead +
        '<p class="featured-analogy">' + esc(t.analogy) + "</p>" +
        '<p class="featured-desc">' + more + "</p>"
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

  // ── 히어로 통계 ──
  var statEl = document.getElementById("hero-stat");
  if (statEl) {
    statEl.innerHTML =
      "<b>" + terms.length + "개</b> 용어 · <b>" + (categories.length - 1) + "개</b> 주제";
  }

  // ── 시작 ──
  renderWordOfDay();
  render();
})();
