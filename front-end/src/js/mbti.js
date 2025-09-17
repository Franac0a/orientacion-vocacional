const TOTAL = 16;

const FORM = document.getElementById("mbtiForm");
const OUT = document.getElementById("result");
const TYPE = document.getElementById("type");
const SUMM = document.getElementById("summary");
const SAVE = document.getElementById("saveBtn");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const savedList = document.getElementById("savedList");
const refreshBtn = document.getElementById("refreshBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

const DESCS = {
  ISTJ: "Práctico, responsable y organizado.",
  ISFJ: "Confiable, orientado al servicio y al detalle.",
  INFJ: "Idealista, estratégico y empático.",
  INTJ: "Analítico, independiente y planificador.",
  ISTP: "Lógico y resolutivo, aprende haciendo.",
  ISFP: "Práctico y sensible, busca armonía.",
  INFP: "Creativo y guiado por valores.",
  INTP: "Analítico y curioso de sistemas.",
  ESTP: "Enérgico, directo y orientado a la acción.",
  ESFP: "Sociable, espontáneo y práctico.",
  ENFP: "Creativo, entusiasta y motivador.",
  ENTP: "Ingenioso, desafía supuestos.",
  ESTJ: "Organizado, resultados y liderazgo.",
  ESFJ: "Colaborativo, comunicativo y cuidadoso.",
  ENFJ: "Líder empático, desarrollo del grupo.",
  ENTJ: "Decidido, estratégico y ambicioso.",
};

/* ---------- MODO PASO A PASO ---------- */
const questions = [...FORM.querySelectorAll(".q")];
let step = 0;

function hasAnswer(i) {
  const inputs = questions[i].querySelectorAll('input[type="radio"]');
  return [...inputs].some((r) => r.checked);
}

function renderProgress() {
  const answeredCount = [...new FormData(FORM).keys()].length;
  const current = Math.max(answeredCount, step + 1);
  const pct = Math.round((current / TOTAL) * 100);
  progressText.textContent = `${current} / ${TOTAL}`;
  progressFill.style.width = `${pct}%`;
}

function showStep(i) {
  questions.forEach(
    (q, idx) => (q.style.display = idx === i ? "block" : "none")
  );
  prevBtn.disabled = i === 0;
  nextBtn.disabled = !hasAnswer(i);
  nextBtn.classList.toggle("hidden", i === questions.length - 1);
  submitBtn.classList.toggle("hidden", i !== questions.length - 1);
  renderProgress();
}

// eventos de navegación y cambios
FORM.addEventListener("change", () => {
  if (hasAnswer(step)) nextBtn.disabled = false;
});
prevBtn.addEventListener("click", () => {
  step = Math.max(0, step - 1);
  showStep(step);
});
nextBtn.addEventListener("click", () => {
  if (!hasAnswer(step)) return;
  step = Math.min(questions.length - 1, step + 1);
  showStep(step);
});
FORM.addEventListener("reset", () => {
  setTimeout(() => {
    step = 0;
    showStep(step);
  }, 0);
});

/* ---------- SUBMIT ---------- */
FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(FORM);
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  for (const [, v] of data.entries()) counts[v]++;

  const ei = counts.E >= counts.I ? "E" : "I";
  const sn = counts.S >= counts.N ? "S" : "N";
  const tf = counts.T >= counts.F ? "T" : "F";
  const jp = counts.J >= counts.P ? "J" : "P";
  const code = `${ei}${sn}${tf}${jp}`;

  TYPE.textContent = code;
  SUMM.textContent = DESCS[code] || "Tipo mixto.";
  OUT.classList.remove("hidden");

  const record = {
    code,
    counts,
    answers: Object.fromEntries(data),
    ts: Date.now(),
  };
  const history = JSON.parse(localStorage.getItem("mbti_history") || "[]");
  history.unshift(record);
  localStorage.setItem("mbti_history", JSON.stringify(history.slice(0, 10)));
  localStorage.setItem("mbti_result", JSON.stringify(record));

  const token = localStorage.getItem("token");
  if (token) {
    fetch("http://localhost:3000/api/mbti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: code, counts, answers: record.answers }),
    }).catch(console.error);
  }
  renderSaved();
});

/* ---------- HISTORIAL ---------- */
function fmtDate(ts) {
  return new Date(ts).toLocaleString();
}
function renderSaved(remoteList = []) {
  const local = JSON.parse(localStorage.getItem("mbti_history") || "[]");
  const seen = new Set(local.map((r) => r.ts));
  const merged = [...local];

  for (const r of remoteList) {
    const key = r._id || r.ts;
    if (!seen.has(key)) {
      merged.push({
        code: r.type,
        ts: new Date(r.createdAt).getTime(),
        counts: r.counts || {},
      });
      seen.add(key);
    }
  }

  if (!merged.length) {
    savedList.classList.add("empty");
    savedList.textContent = "Sin resultados aún.";
    return;
  }
  savedList.classList.remove("empty");
  savedList.innerHTML = merged
    .slice(0, 5)
    .map(
      (r) => `
    <div class="saved-item">
      <span class="saved-type">${r.code}</span>
      <span class="saved-date">${fmtDate(r.ts)}</span>
    </div>
  `
    )
    .join("");
}

async function fetchRemote() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return renderSaved();
    const res = await fetch("http://localhost:3000/api/mbti/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    renderSaved(Array.isArray(data) ? data : []);
  } catch {
    renderSaved();
  }
}

if (refreshBtn) refreshBtn.addEventListener("click", fetchRemote);

/* init */
showStep(0);
fetchRemote();
