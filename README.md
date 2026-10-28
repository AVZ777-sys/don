# 🏗 Prompt, Context & Harness Engineering для инженеров (RU / ՀԱՅ)

Интерактивный билингвальный (Русский / Հայերեն) образовательный веб-модуль по применению технологий искусственного интеллекта и больших языковых моделей (LLM) в задачах градостроительства, технического надзора, экспертизы проектов и нормоконтроля (**СНиП / ՀՀՇՆ**).

---

## 📂 Структура репозитория

Проект спроектирован по принципу **Zero-Dependency Static Architecture** (чистый HTML5, CSS3, Vanilla JS) и полностью готов к размещению на **GitHub Pages** без необходимости сборки (Node.js/Webpack не требуются):

```text
prompt-engineering-for-engineers/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml   # Автоматический CI/CD деплой на GitHub Pages
├── css/
│   └── styles.css             # Инженерная сетка (Blueprint Grid) и кастомные стили
├── js/
│   ├── data.js                # Полная билингвальная база данных (RU / HY): 15 техник, кейсы, тесты
│   └── app.js                 # Логика фильтрации, локализации, симулятора (Sandbox) и квиза
├── index.html                 # Главная страница приложения
├── .gitignore                 # Исключения для Git
├── LICENSE                    # Лицензия MIT
└── README.md                  # Документация проекта
```

---

## 🎯 Архитектурная концепция курса

Все 15 ключевых техник со слайда курса систематизированы по трем инженерным главам:

1. **Глава 1. Prompt Engineering (Локальная спецификация)**
   * `Zero-Shot`, `One-Shot`, `Few-Shot`, `Chain-of-Thought (CoT)`, `Multimodal Prompting`, `Meta-Prompting`, `Guided & Role Prompting`.
2. **Глава 2. Context Engineering (Информационная среда и память)**
   * `System Prompting & Context Length Management`, `Dynamic & Adaptive Prompting`, `Retrieval-Augmented Generation (RAG)`.
3. **Глава 3. Harness Engineering (Программная обвязка и верификация)**
   * `ReAct (Reasoning + Acting)`, `Self-Consistency`, `Prompt Chaining`, `Self-Prompting`, `Tree of Thought (ToT)`.

---

## 🚀 Быстрый запуск локально

Вы можете открыть `index.html` напрямую в браузере или запустить локальный HTTP-сервер одной командой:

```bash
# Вариант 1: Через встроенный модуль Python 3
python3 -m http.server 8080

# Вариант 2: Через Node.js (npx)
npx serve .
```
После запуска откройте в браузере `http://localhost:8080`.

---

## 🌐 Загрузка на GitHub и публикация в GitHub Pages

Выполните следующие команды в терминале внутри папки проекта:

```bash
git init
git add .
git commit -m "feat: initial bilingual Prompt, Context & Harness Engineering course module (RU/HY)"
git branch -M main
git remote add origin https://github.com/<ВАШ_ЛОГИН>/<ИМЯ_РЕПОЗИТОРИЯ>.git
git push -u origin main
```

### Включение GitHub Pages:
1. Перейдите в ваш репозиторий на GitHub $ightarrow$ вкладка **Settings** $ightarrow$ раздел **Pages**.
2. В блоке **Build and deployment** в выпадающем списке **Source** выберите **GitHub Actions**.
3. Файл `.github/workflows/deploy-pages.yml` автоматически опубликует сайт при каждом `git push` в ветку `main`.
