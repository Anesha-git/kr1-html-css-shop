// ---------- Тёмная тема ----------
const themeBtn = document.getElementById("theme-btn");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", function () {
  document.body.classList.add("theme-anim");
  document.body.classList.toggle("dark");
  setTimeout(function () {
    document.body.classList.remove("theme-anim");
  }, 450);
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// ---------- Подписка (главная) ----------
const subForm = document.getElementById("sub-form");
if (subForm) {
  subForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Спасибо за подписку!");
    subForm.reset();
  });
}

// ---------- Фильтр новостей ----------
const filterButtons = document.querySelectorAll(".filters button");
const posts = document.querySelectorAll(".post");
const searchInput = document.getElementById("search");
let currentCat = "all";

// показываем только те посты, которые подходят и под категорию, и под поиск
function showPosts() {
  let query = "";
  if (searchInput) {
    query = searchInput.value.toLowerCase();
  }

  posts.forEach(function (post) {
    const title = post.querySelector("h3").textContent.toLowerCase();
    let okCat = currentCat === "all" || post.dataset.cat === currentCat;
    if (currentCat === "fav") {
      okCat = getFavs().includes(post.querySelector("h3").textContent);
    }
    const okSearch = title.includes(query);

    if (okCat && okSearch) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
}

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");

    currentCat = btn.dataset.cat;
    showPosts();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", showPosts);
}

// ---------- Кнопки "Читать далее" ----------
document.querySelectorAll(".more-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const full = btn.parentElement.querySelector(".full");
    full.classList.toggle("open");

    if (full.classList.contains("open")) {
      btn.textContent = "Свернуть";
    } else {
      btn.textContent = "Читать далее";
    }
  });
});

// ---------- Конвертер валют ----------
// сколько единиц валюты в одном долларе (курсы примерные)
const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.77,
  CZK: 23.5,
  RUB: 95
};

const convForm = document.getElementById("conv-form");
if (convForm) {
  convForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const amount = Number(document.getElementById("conv-amount").value);
    const from = document.getElementById("conv-from").value;
    const to = document.getElementById("conv-to").value;

    // сначала переводим в доллары, потом в нужную валюту
    const inUsd = amount / currencyRates[from];
    const result = inUsd * currencyRates[to];

    document.getElementById("conv-result").textContent =
      amount + " " + from + " = " + result.toFixed(2) + " " + to;
  });
}

// ---------- График цены (Chart.js) ----------
// данные для каждой валюты (значения примерные)
const chartSets = {
  BTC: { label: "BTC, $", data: [66200, 66900, 67500, 66800, 67900, 68100, 68400] },
  ETH: { label: "ETH, $", data: [2380, 2410, 2440, 2395, 2430, 2465, 2450] },
  SOL: { label: "SOL, $", data: [152, 155, 158, 154, 161, 163, 165] },
  BNB: { label: "BNB, $", data: [572, 575, 581, 578, 585, 588, 590] },
  XRP: { label: "XRP, $", data: [0.52, 0.53, 0.54, 0.53, 0.56, 0.56, 0.55] },
  EUR: { label: "EUR за 1 $", data: [0.921, 0.919, 0.922, 0.918, 0.92, 0.921, 0.92] },
  CZK: { label: "CZK за 1 $", data: [23.7, 23.6, 23.55, 23.6, 23.5, 23.45, 23.5] },
  RUB: { label: "RUB за 1 $", data: [96.0, 95.8, 95.5, 95.2, 95.4, 95.1, 95.0] }
};

const chartCanvas = document.getElementById("price-chart");
const chartSelect = document.getElementById("chart-asset");

if (chartCanvas && typeof Chart !== "undefined") {
  const priceChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: ["29 окт", "30 окт", "31 окт", "1 ноя", "2 ноя", "3 ноя", "4 ноя"],
      datasets: [{
        label: chartSets.BTC.label,
        data: chartSets.BTC.data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        fill: true,
        tension: 0.3
      }]
    }
  });

  // при выборе другой валюты меняем данные и обновляем график
  chartSelect.addEventListener("change", function () {
    const chosen = chartSets[chartSelect.value];
    priceChart.data.datasets[0].label = chosen.label;
    priceChart.data.datasets[0].data = chosen.data;
    priceChart.update();
  });
}

// ---------- Калькулятор сложного процента ----------
const calcForm = document.getElementById("calc-form");
if (calcForm) {
  calcForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const start = Number(document.getElementById("start").value);
    const rate = Number(document.getElementById("rate").value);
    const years = Number(document.getElementById("years").value);

    // формула: сумма * (1 + процент/100) ^ годы
    const total = start * Math.pow(1 + rate / 100, years);

    document.getElementById("result").textContent =
      "Итого: " + total.toFixed(2) + " $";
  });
}

// ---------- Сортировка таблицы по цене ----------
const sortBtn = document.getElementById("sort-price");
if (sortBtn) {
  let ascending = false;

  sortBtn.addEventListener("click", function () {
    const tbody = document.querySelector("#assets tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort(function (a, b) {
      const priceA = Number(a.dataset.price);
      const priceB = Number(b.dataset.price);
      return ascending ? priceA - priceB : priceB - priceA;
    });

    ascending = !ascending;
    rows.forEach(function (row) {
      tbody.appendChild(row);
    });
  });
}

// ---------- Форма обратной связи ----------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Сообщение отправлено!");
    contactForm.reset();
  });
}

// ---------- Избранное ----------
function getFavs() {
  try {
    return JSON.parse(localStorage.getItem("favs")) || [];
  } catch (e) {
    return [];
  }
}

function saveFavs(list) {
  try {
    localStorage.setItem("favs", JSON.stringify(list));
  } catch (e) {}
}

// счётчик в шапке (есть на всех страницах)
function updateFavCount() {
  const el = document.getElementById("fav-count");
  if (el) {
    el.textContent = getFavs().length;
  }
}
updateFavCount();

// звёздочка на каждой статье
posts.forEach(function (post) {
  const title = post.querySelector("h3").textContent;
  const star = document.createElement("button");
  star.className = "fav-btn";
  star.title = "В избранное";
  post.appendChild(star);

  function draw() {
    star.textContent = getFavs().includes(title) ? "★" : "☆";
  }
  draw();

  star.addEventListener("click", function () {
    let list = getFavs();
    if (list.includes(title)) {
      list = list.filter(function (t) {
        return t !== title;
      });
    } else {
      list.push(title);
    }
    saveFavs(list);
    draw();
    updateFavCount();
    // если открыт фильтр "Избранное", сразу обновляем список
    if (currentCat === "fav") {
      showPosts();
    }
  });
});

// ---------- Анимация счётчиков на главной ----------
document.querySelectorAll(".count").forEach(function (el) {
  const target = Number(el.dataset.target);
  const step = Math.max(1, Math.ceil(target / 40));
  let value = 0;

  const timer = setInterval(function () {
    value += step;
    if (value >= target) {
      value = target;
      clearInterval(timer);
    }
    el.textContent = value;
  }, 40);
});

// ---------- Слайдер с советами ----------
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(n) {
  slides.forEach(function (s) {
    s.classList.remove("active");
  });
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  document.getElementById("slide-num").textContent =
    currentSlide + 1 + " / " + slides.length;
}

if (slides.length > 0) {
  document.getElementById("prev").addEventListener("click", function () {
    showSlide(currentSlide - 1);
  });
  document.getElementById("next").addEventListener("click", function () {
    showSlide(currentSlide + 1);
  });
  // автопрокрутка раз в 6 секунд
  setInterval(function () {
    showSlide(currentSlide + 1);
  }, 6000);
}

// ---------- Модальное окно подписки ----------
const modal = document.getElementById("modal");
if (modal) {
  // кнопок открытия несколько: в блоке на главной и в футере
  document.querySelectorAll(".open-modal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      modal.classList.add("open");
    });
  });

  function closeModal() {
    modal.classList.remove("open");
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);

  // клик по тёмному фону тоже закрывает окно
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  document.getElementById("modal-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("m-name").value;
    alert("Спасибо, " + name + "! Вы подписались на рассылку.");
    e.target.reset();
    closeModal();
  });
}

// ---------- Калькулятор прибыли от сделки ----------
const profitForm = document.getElementById("profit-form");
if (profitForm) {
  profitForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const buy = Number(document.getElementById("p-buy").value);
    const sell = Number(document.getElementById("p-sell").value);
    const amount = Number(document.getElementById("p-amount").value);
    const fee = Number(document.getElementById("p-fee").value);

    const spent = buy * amount;
    const received = sell * amount;
    // комиссия берётся и при покупке, и при продаже
    const fees = (spent + received) * fee / 100;
    const profit = received - spent - fees;
    const percent = profit / spent * 100;

    const result = document.getElementById("profit-result");
    let sign = "";
    if (profit > 0) {
      sign = "+";
    }
    result.textContent =
      "Результат: " + sign + profit.toFixed(2) + " $ (" + sign + percent.toFixed(2) + "%)";

    if (profit >= 0) {
      result.className = "up";
    } else {
      result.className = "down";
    }
  });
}

// ---------- Поиск по словарю терминов ----------
const termSearch = document.getElementById("term-search");
if (termSearch) {
  termSearch.addEventListener("input", function () {
    const query = termSearch.value.toLowerCase();
    document.querySelectorAll("#terms tbody tr").forEach(function (row) {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}

// ---------- Кнопка "наверх" ----------
const toTop = document.createElement("button");
toTop.id = "to-top";
toTop.textContent = "▲";
toTop.title = "Наверх";
document.body.appendChild(toTop);

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
});

toTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Мини-тесты ----------
// небольшой помощник: создаёт элемент с текстом (безопаснее, чем innerHTML)
function make(tag, text, className) {
  const node = document.createElement(tag);
  if (text) {
    node.textContent = text;
  }
  if (className) {
    node.className = className;
  }
  return node;
}

const quizBox = document.getElementById("quiz-box");
if (quizBox) {
  let quiz = null;
  let quizKey = "";
  let step = 0;
  let score = 0;

  function startQuiz(key) {
    quizKey = key;
    quiz = QUIZZES[key];
    step = 0;
    score = 0;
    showQuestion();
  }

  function showQuestion() {
    const q = quiz.questions[step];
    const total = quiz.questions.length;
    quizBox.style.display = "block";
    quizBox.innerHTML = "";
    quizBox.appendChild(make("small", "Тест «" + quiz.title + "» · вопрос " + (step + 1) + " из " + total));
    quizBox.appendChild(make("h3", q.q));

    const buttons = [];
    const note = make("p", "", "quiz-note");
    const nextBtn = make("button", step === total - 1 ? "Показать результат" : "Дальше", "btn");
    nextBtn.style.display = "none";

    // перемешиваем варианты, чтобы верный ответ не был всегда первым
    const options = q.options.map(function (text, i) {
      return { text: text, correct: i === q.answer };
    });
    options.sort(function () {
      return Math.random() - 0.5;
    });

    let rightBtn = null;
    options.forEach(function (opt) {
      const btn = make("button", opt.text, "quiz-option");
      buttons.push(btn);
      if (opt.correct) {
        rightBtn = btn;
      }

      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.disabled = true;
        });
        if (opt.correct) {
          score++;
          btn.classList.add("right");
          note.textContent = "Верно! " + q.explain;
        } else {
          btn.classList.add("wrong");
          rightBtn.classList.add("right");
          note.textContent = "Не совсем. " + q.explain;
        }
        nextBtn.style.display = "inline-block";
      });
      quizBox.appendChild(btn);
    });

    nextBtn.addEventListener("click", function () {
      step++;
      if (step < total) {
        showQuestion();
      } else {
        showResult();
      }
    });
    quizBox.appendChild(note);
    quizBox.appendChild(nextBtn);
  }

  function showResult() {
    quizBox.innerHTML = "";
    quizBox.appendChild(make("h3", "Ваш результат: " + score + " из " + quiz.questions.length));

    let comment = "Стоит почитать наши статьи и попробовать ещё раз.";
    if (score >= 4) {
      comment = "Отличный результат!";
    } else if (score === 3) {
      comment = "Неплохо, но есть что повторить.";
    }
    quizBox.appendChild(make("p", comment, "quiz-note"));

    const again = make("button", "Пройти ещё раз", "btn");
    again.addEventListener("click", function () {
      startQuiz(quizKey);
    });
    quizBox.appendChild(again);
  }

  // выбор темы теста
  document.querySelectorAll(".quiz-topics button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".quiz-topics button").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      startQuiz(btn.dataset.quiz);
    });
  });
}

// ---------- Калькулятор инфляции ----------
// подбирает правильную форму слова: 1 год, 2 года, 5 лет
function yearsWord(n) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) {
    return "год";
  }
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return "года";
  }
  return "лет";
}

const inflForm = document.getElementById("infl-form");
if (inflForm) {
  inflForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const sum = Number(document.getElementById("i-sum").value);
    const rate = Number(document.getElementById("i-rate").value);
    const years = Number(document.getElementById("i-years").value);

    // во сколько раз вырастут цены за срок
    const factor = Math.pow(1 + rate / 100, years);
    const future = sum * factor; // столько будет стоить то, что сегодня стоит sum
    const worth = sum / factor; // столько сегодняшних денег будет стоить sum через годы
    const lost = (1 - 1 / factor) * 100;

    const money = function (n) {
      return Math.round(n).toLocaleString("ru-RU") + " ₽";
    };
    const period = years + " " + yearsWord(years);

    const result = document.getElementById("infl-result");
    result.innerHTML = "";
    result.appendChild(make("p", "Через " + period + " то, что сегодня стоит " + money(sum) + ", будет стоить около " + money(future) + "."));
    result.appendChild(make("p", "Ваши " + money(sum) + " через " + period + " будут равны по покупательной способности примерно " + money(worth) + " в сегодняшних ценах (потеря " + lost.toFixed(1) + "%)."));
  });
}

// ---------- Календарь событий: ответ даёт нейросеть через server.js ----------
const dayForm = document.getElementById("day-form");
if (dayForm) {
  const dayInput = document.getElementById("day-date");
  const dayResult = document.getElementById("day-result");

  // по умолчанию сегодняшняя дата, дату из будущего выбрать нельзя
  const now = new Date();
  const todayIso =
    now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  dayInput.max = todayIso;
  dayInput.value = todayIso;

  function showDay(data) {
    dayResult.innerHTML = "";
    const niceDate = new Date(data.date + "T00:00:00").toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    dayResult.appendChild(make("h3", "События " + niceDate));

    const list = make("ul");
    data.events.forEach(function (text) {
      list.appendChild(make("li", text));
    });
    dayResult.appendChild(list);

    if (data.fresh && data.sources.length > 0) {
      dayResult.appendChild(make("small", "Использованы материалы из интернета:"));
      data.sources.forEach(function (s) {
        if (/^https?:\/\//.test(s.url)) {
          const link = make("a", s.title || s.url);
          link.href = s.url;
          link.target = "_blank";
          link.rel = "noopener";
          dayResult.appendChild(link);
        }
      });
    }
    dayResult.appendChild(
      make("p", "Ответ сформирован нейросетью GigaChat, возможны неточности: важные даты стоит проверять в других источниках.", "day-note")
    );
  }

  dayForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const button = dayForm.querySelector("button");
    button.disabled = true;
    dayResult.textContent = "Нейросеть собирает события выбранного дня… это может занять до 30 секунд.";

    fetch("/api/day?date=" + encodeURIComponent(dayInput.value))
      .then(function (r) {
        return r.json().then(function (data) {
          return { ok: r.ok, data: data };
        });
      })
      .then(function (res) {
        if (!res.ok) {
          const err = new Error("server");
          err.serverMessage = res.data.message;
          throw err;
        }
        showDay(res.data);
      })
      .catch(function (err) {
        // если сервер ответил сам, показываем его сообщение
        dayResult.textContent =
          err.serverMessage ||
          "Нейросеть сейчас недоступна. Запустите сайт через server.js с ключом GigaChat (инструкция в README.md).";
      })
      .then(function () {
        button.disabled = false;
      });
  });
}

// ---------- Вопрос эксперту: ответ даёт нейросеть через server.js ----------
const askForm = document.getElementById("ask-form");
if (askForm) {
  const askInput = document.getElementById("ask-q");
  const askResult = document.getElementById("ask-result");

  askForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const button = askForm.querySelector("button");
    button.disabled = true;
    askResult.textContent = "Эксперт думает… это может занять до 30 секунд.";

    fetch("/api/ask?q=" + encodeURIComponent(askInput.value))
      .then(function (r) {
        return r.json().then(function (data) {
          return { ok: r.ok, data: data };
        });
      })
      .then(function (res) {
        if (!res.ok) {
          const err = new Error("server");
          err.serverMessage = res.data.message;
          throw err;
        }
        askResult.innerHTML = "";
        res.data.answer.split(/\n+/).forEach(function (line) {
          if (line.trim()) askResult.appendChild(make("p", line.trim()));
        });
        if (res.data.fresh && res.data.sources.length > 0) {
          askResult.appendChild(make("small", "Использованы материалы из интернета:"));
          res.data.sources.forEach(function (s) {
            if (/^https?:\/\//.test(s.url)) {
              const link = make("a", s.title || s.url);
              link.href = s.url;
              link.target = "_blank";
              link.rel = "noopener";
              askResult.appendChild(link);
            }
          });
        }
        askResult.appendChild(
          make("p", "Ответ сформирован нейросетью GigaChat и не является инвестиционной рекомендацией. Возможны неточности.", "day-note")
        );
      })
      .catch(function (err) {
        askResult.textContent =
          err.serverMessage ||
          "Нейросеть сейчас недоступна. Запустите сайт через start.bat с ключом GigaChat.";
      })
      .then(function () {
        button.disabled = false;
      });
  });
}
