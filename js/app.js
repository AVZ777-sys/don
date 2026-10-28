// Main Application Controller for Bilingual Engineering Course
(function () {
  let currentLang = localStorage.getItem("eng_ai_lang") || "ru";
  let currentFilter = "all";
  let searchQuery = "";
  let currentCaseId = "case_concrete";
  let activeLayers = {
    roleGuided: true,
    cot: true,
    rag: false,
    react: false
  };

  function init() {
    bindEvents();
    renderAll();
  }

  function bindEvents() {
    document.getElementById("btn-lang-ru").addEventListener("click", () => setLanguage("ru"));
    document.getElementById("btn-lang-hy").addEventListener("click", () => setLanguage("hy"));

    document.getElementById("search-input").addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderTechniques();
    });

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.getAttribute("data-filter");
        renderFilters();
        renderTechniques();
      });
    });

    document.getElementById("sandbox-case-select").addEventListener("change", (e) => {
      currentCaseId = e.target.value;
      renderSandbox();
    });

    ["roleGuided", "cot", "rag", "react"].forEach((layerKey) => {
      const checkbox = document.getElementById(`toggle-${layerKey}`);
      if (checkbox) {
        checkbox.addEventListener("change", (e) => {
          activeLayers[layerKey] = e.target.checked;
          renderSandbox();
        });
      }
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("eng_ai_lang", lang);
    document.documentElement.lang = lang;
    renderAll();
  }

  function renderAll() {
    const ui = window.COURSE_DATA.ui[currentLang];

    // Toggle active state on language buttons
    const ruBtn = document.getElementById("btn-lang-ru");
    const hyBtn = document.getElementById("btn-lang-hy");
    if (currentLang === "ru") {
      ruBtn.className = "px-3 py-1.5 rounded-md text-xs font-semibold bg-sky-500 text-slate-950 shadow";
      hyBtn.className = "px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-white";
    } else {
      hyBtn.className = "px-3 py-1.5 rounded-md text-xs font-semibold bg-sky-500 text-slate-950 shadow";
      ruBtn.className = "px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-white";
    }

    // Populate static text nodes
    document.getElementById("hero-badge").textContent = ui.badge;
    document.getElementById("hero-title").textContent = ui.title;
    document.getElementById("hero-subtitle").textContent = ui.subtitle;
    document.getElementById("nav-arch").textContent = ui.navArch;
    document.getElementById("nav-catalog").textContent = ui.navCatalog;
    document.getElementById("nav-sandbox").textContent = ui.navSandbox;
    document.getElementById("nav-quiz").textContent = ui.navQuiz;

    document.getElementById("arch-title").textContent = ui.archTitle;
    document.getElementById("arch-subtitle").textContent = ui.archSubtitle;
    document.getElementById("search-input").placeholder = ui.searchPlaceholder;

    document.getElementById("sandbox-title").textContent = ui.sandboxTitle;
    document.getElementById("sandbox-subtitle").textContent = ui.sandboxSubtitle;
    document.getElementById("select-case-label").textContent = ui.selectCaseLabel;
    document.getElementById("layers-title").textContent = ui.layersTitle;
    document.getElementById("reliability-label").textContent = ui.reliabilityLabel;
    document.getElementById("prompt-preview-title").textContent = ui.promptPreviewTitle;
    document.getElementById("output-preview-title").textContent = ui.outputPreviewTitle;

    document.getElementById("quiz-title").textContent = ui.quizTitle;
    document.getElementById("quiz-subtitle").textContent = ui.quizSubtitle;
    document.getElementById("footer-note").textContent = ui.footerNote;

    renderChapters();
    renderFilters();
    renderTechniques();
    renderSandboxSelector();
    renderSandbox();
    renderQuiz();
  }

  function renderChapters() {
    const container = document.getElementById("chapters-grid");
    container.innerHTML = "";

    const colorMap = {
      sky: "border-sky-500/40 bg-sky-950/20 hover:border-sky-400",
      amber: "border-amber-500/40 bg-amber-950/20 hover:border-amber-400",
      emerald: "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400"
    };
    const badgeColor = {
      sky: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    };

    window.COURSE_DATA.chapters.forEach((ch) => {
      const t = ch[currentLang];
      const isSelected = currentFilter === ch.id;
      const card = document.createElement("div");
      card.className = `p-5 rounded-xl border transition cursor-pointer card-hover ${colorMap[ch.color]} ${
        isSelected ? "ring-2 ring-sky-400" : ""
      }`;
      card.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono uppercase px-2.5 py-0.5 rounded border ${badgeColor[ch.color]}">${ch.code}</span>
          <span class="text-xs text-slate-400 font-mono">${t.metrics}</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">${t.title}</h3>
        <p class="text-sm text-slate-300 leading-relaxed">${t.desc}</p>
      `;
      card.addEventListener("click", () => {
        currentFilter = currentFilter === ch.id ? "all" : ch.id;
        renderChapters();
        renderFilters();
        renderTechniques();
      });
      container.appendChild(card);
    });
  }

  function renderFilters() {
    const ui = window.COURSE_DATA.ui[currentLang];
    const labels = {
      all: ui.filterAll,
      ch1: ui.filterCh1,
      ch2: ui.filterCh2,
      ch3: ui.filterCh3
    };
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      const f = btn.getAttribute("data-filter");
      btn.textContent = labels[f];
      if (f === currentFilter) {
        btn.className = "filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-slate-950 shadow transition";
      } else {
        btn.className = "filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition";
      }
    });
  }

  function renderTechniques() {
    const container = document.getElementById("techniques-grid");
    const ui = window.COURSE_DATA.ui[currentLang];
    container.innerHTML = "";

    const chBadge = {
      ch1: { label: "CH 1 • PROMPT", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
      ch2: { label: "CH 2 • CONTEXT", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
      ch3: { label: "CH 3 • HARNESS", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }
    };

    const filtered = window.COURSE_DATA.techniques.filter((item) => {
      const matchesChapter = currentFilter === "all" || item.chapter === currentFilter;
      const t = item[currentLang];
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery) ||
        t.title.toLowerCase().includes(searchQuery) ||
        t.essence.toLowerCase().includes(searchQuery) ||
        t.useCase.toLowerCase().includes(searchQuery);
      return matchesChapter && matchesSearch;
    });

    filtered.forEach((item) => {
      const t = item[currentLang];
      const badge = chBadge[item.chapter];
      const card = document.createElement("div");
      card.className = "bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between card-hover";
      card.innerHTML = `
        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span class="text-xs font-mono font-semibold px-2.5 py-0.5 rounded border ${badge.cls}">
              #${String(item.id).padStart(2, "0")} • ${badge.label}
            </span>
            <span class="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded">${item.tag}</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-3">${t.title}</h3>
          <div class="space-y-2.5 text-sm mb-4">
            <p class="text-slate-300"><strong class="text-sky-400">${ui.essenceLabel}</strong> ${t.essence}</p>
            <p class="text-slate-300"><strong class="text-emerald-400">${ui.useCaseLabel}</strong> ${t.useCase}</p>
            <p class="text-slate-400 text-xs"><strong class="text-amber-400">${ui.limitLabel}</strong> ${t.limit}</p>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-slate-800/80">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-mono text-slate-400">${ui.templateLabel}</span>
            <button class="copy-prompt-btn text-xs font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 transition">
              ${ui.copyBtn}
            </button>
          </div>
          <pre class="bg-slate-950 border border-slate-800/90 rounded-lg p-3 text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap">${t.template}</pre>
        </div>
      `;

      const copyBtn = card.querySelector(".copy-prompt-btn");
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(t.template);
        copyBtn.textContent = ui.copiedBtn;
        setTimeout(() => {
          copyBtn.textContent = ui.copyBtn;
        }, 1800);
      });

      container.appendChild(card);
    });
  }

  function renderSandboxSelector() {
    const select = document.getElementById("sandbox-case-select");
    select.innerHTML = "";
    window.COURSE_DATA.sandboxCases.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c[currentLang].name;
      if (c.id === currentCaseId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function renderSandbox() {
    const caseObj = window.COURSE_DATA.sandboxCases.find((c) => c.id === currentCaseId);
    const cData = caseObj[currentLang];

    let score = 25;
    let promptParts = [];
    let outputParts = [];

    if (currentLang === "ru") {
      promptParts.push(`[БАЗОВЫЙ ЗАПРОС (Zero-Shot)]:
${cData.basePrompt}`);
      if (activeLayers.roleGuided) {
        score += 20;
        promptParts.push(
          `+ [CH 1 • ROLE & GUIDED SCHEMA]:
Роль: Главный специалист технадзора. Формат вывода: строгий JSON { "defect_class", "normative_clause", "prescribed_action", "stop_work": bool }.`
        );
      }
      if (activeLayers.cot) {
        score += 15;
        promptParts.push(
          `+ [CH 1 • CHAIN-OF-THOUGHT (CoT)]:
Требование трассировки: Шаг 1 (Оценка влияния на несущую способность) -> Шаг 2 (Проверка защитного слоя и анкеровки) -> Шаг 3 (Вывод).`
        );
      }
      if (activeLayers.rag) {
        score += 20;
        promptParts.push(
          `+ [CH 2 • CONTEXT / RAG INJECTION]:
Инжектированы верифицированные фрагменты ՀՀՇՆ 20.04-2020 (Сейсмостойкое строительство) и ՀՀՇՆ 52-01 (Железобетонные конструкции). Запрет на использование внешних неподтвержденных норм.`
        );
      }
      if (activeLayers.react) {
        score += 20;
        promptParts.push(
          `+ [CH 3 • HARNESS / ReAct & VALIDATION]:
Вызов детерминированного модуля: Action -> verify_structural_tolerance(rebar_diam=28, seismic_zone=3) + валидация выходного JSON через Pydantic.`
        );
      }

      outputParts.push(`• Статус надежности: ${score}%`);
      if (!activeLayers.roleGuided && !activeLayers.cot && !activeLayers.rag && !activeLayers.react) {
        outputParts.push(`
Ответ модели (Неструктурированный текст):
"${cData.baseOutput}"

⚠️ Риск: Нет ссылок на пункты ՀՀՇՆ, нет машиночитаемой структуры, нет расчетной проверки.`);
      } else {
        if (activeLayers.cot) {
          outputParts.push(`
[Трасса рассуждений CoT]:
1. Выявлено нарушение целостности конструктивного элемента.
2. Проведена сверка граничных условий эксплуатации.`);
        }
        if (activeLayers.rag) {
          outputParts.push(`[Grounding RAG]: Подтверждена прямая ссылка на ՀՀՇՆ 20.04-2020 (п. 7.4.12 — ограничения стыков арматуры в пластических шарнирах колонн).`);
        }
        if (activeLayers.react) {
          outputParts.push(`[Harness Execution]: Вызван расчетный скрипт -> Детерминированная проверка пройдена. Схема JSON валидна.`);
        }
        if (activeLayers.roleGuided) {
          outputParts.push(
            `
{
  "defect_class": "CRITICAL_STRUCTURAL",
  "normative_clause": "${
              activeLayers.rag ? "ՀՀՇՆ 20.04-2020, п. 7.4" : "Требуется уточнение (RAG отключен)"
            }",
  "stop_work": true,
  "verified_by_harness": ${activeLayers.react}
}`
          );
        }
      }
    } else {
      promptParts.push(`[ԲԱԶԱՅԻՆ ՀԱՐՑՈՒՄ (Zero-Shot)].
${cData.basePrompt}`);
      if (activeLayers.roleGuided) {
        score += 20;
        promptParts.push(
          `+ [CH 1 • ROLE & GUIDED SCHEMA].
Դեր՝ Տեխնիկական հսկողության գլխավոր մասնագետ։ Ելքի ձևաչափ՝ խիստ JSON { "defect_class", "normative_clause", "prescribed_action", "stop_work": bool }։`
        );
      }
      if (activeLayers.cot) {
        score += 15;
        promptParts.push(
          `+ [CH 1 • CHAIN-OF-THOUGHT (CoT)].
Դատողությունների հետագիծ՝ Քայլ 1 (Կրողունակության վրա ազդեցության գնահատում) -> Քայլ 2 (Պաշտպանիչ շերտի և խարսխման ստուգում) -> Քայլ 3 (Եզրակացություն)։`
        );
      }
      if (activeLayers.rag) {
        score += 20;
        promptParts.push(
          `+ [CH 2 • CONTEXT / RAG INJECTION].
Ներարկվել են ՀՀՇՆ 20.04-2020 (Սեյսմակայուն շինարարություն) և ՀՀՇՆ 52-01 (Երկաթբետոնե կոնստրուկցիաներ) վերիֆիկացված հատվածները։`
        );
      }
      if (activeLayers.react) {
        score += 20;
        promptParts.push(
          `+ [CH 3 • HARNESS / ReAct & VALIDATION].
Դետերմինացված մոդուլի կանչ՝ Action -> verify_structural_tolerance(rebar_diam=28, seismic_zone=3) + ելքային JSON-ի վավերացում Pydantic-ով։`
        );
      }

      outputParts.push(`• Հուսալիության ինդեքս՝ ${score}%`);
      if (!activeLayers.roleGuided && !activeLayers.cot && !activeLayers.rag && !activeLayers.react) {
        outputParts.push(`
Մոդելի պատասխան (Անկառուցվածք տեքստ).
"${cData.baseOutput}"

⚠️ Ռիսկ. Բացակայում են ՀՀՇՆ կետերի հղումները, մեքենայական կառուցվածքը և հաշվարկային ստուգումը։`);
      } else {
        if (activeLayers.cot) {
          outputParts.push(`
[CoT դատողությունների հետագիծ].
1. Հայտնաբերվել է կոնստրուկտիվ տարրի ամբողջականության խախտում։
2. Կատարվել է շահագործման սահմանային պայմանների համադրում։`);
        }
        if (activeLayers.rag) {
          outputParts.push(`[Grounding RAG]. Հաստատվել է ուղիղ հղումը ՀՀՇՆ 20.04-2020-ին (սյուների պլաստիկ հոդերի գոտում ամրանների միացման սահմանափակումներ)։`);
        }
        if (activeLayers.react) {
          outputParts.push(`[Harness Execution]. Գործարկվել է հաշվարկային սկրիպտը -> Դետերմինացված ստուգումն անցած է։ JSON սխեման վավեր է։`);
        }
        if (activeLayers.roleGuided) {
          outputParts.push(
            `
{
  "defect_class": "CRITICAL_STRUCTURAL",
  "normative_clause": "${
              activeLayers.rag ? "ՀՀՇՆ 20.04-2020, կետ 7.4" : "Պահանջվում է ճշգրտում (RAG-ն անջատված է)"
            }",
  "stop_work": true,
  "verified_by_harness": ${activeLayers.react}
}`
          );
        }
      }
    }

    document.getElementById("reliability-bar").style.width = `${score}%`;
    document.getElementById("reliability-value").textContent = `${score}%`;
    document.getElementById("sandbox-prompt-box").textContent = promptParts.join("\n\n");
    document.getElementById("sandbox-output-box").textContent = outputParts.join("\n");
  }

  function renderQuiz() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    window.COURSE_DATA.quiz.forEach((qItem) => {
      const qData = qItem[currentLang];
      const block = document.createElement("div");
      block.className = "bg-slate-900/90 border border-slate-800 rounded-xl p-6";

      let optionsHtml = "";
      qData.options.forEach((optText, idx) => {
        optionsHtml += `
          <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition bg-slate-950/60">
            <input type="radio" name="quiz-${qItem.id}" value="${idx}" class="mt-1 accent-sky-500" />
            <span class="text-sm text-slate-200">${optText}</span>
          </label>
        `;
      });

      block.innerHTML = `
        <h4 class="text-base font-bold text-white mb-4">${qData.question}</h4>
        <div class="space-y-2.5 mb-4">${optionsHtml}</div>
        <div class="quiz-feedback hidden p-3.5 rounded-lg text-sm font-medium"></div>
      `;

      const radios = block.querySelectorAll(`input[name="quiz-${qItem.id}"]`);
      const feedback = block.querySelector(".quiz-feedback");

      radios.forEach((r) => {
        r.addEventListener("change", (e) => {
          const selected = parseInt(e.target.value, 10);
          feedback.classList.remove("hidden");
          if (selected === qData.correct) {
            feedback.className = "quiz-feedback p-3.5 rounded-lg text-sm bg-emerald-950/70 border border-emerald-500/40 text-emerald-200";
            feedback.textContent = qData.explanation;
          } else {
            feedback.className = "quiz-feedback p-3.5 rounded-lg text-sm bg-rose-950/70 border border-rose-500/40 text-rose-200";
            feedback.textContent =
              currentLang === "ru"
                ? "Не совсем так. Подумайте, какой архитектурный слой отвечает за эту функцию, и попробуйте еще раз."
                : "Ոչ այնքան։ Մտածեք, թե որ ճարտարապետական շերտն է պատասխանատու այս գործառույթի համար և փորձեք կրկին։";
          }
        });
      });

      container.appendChild(block);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
