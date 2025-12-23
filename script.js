const perguntasPorModalidade = {
  "Estética Facial": [
    "Tipo de pele?",
    "Possui acne?",
    "Usa cosméticos diariamente?",
    "Já fez peeling?",
    "Sensibilidade na pele?",
    "Uso de ácidos?"
  ],
  "Estética Corporal": [
    "Possui flacidez?",
    "Celulite?",
    "Estrias?",
    "Retenção de líquido?",
    "Pratica atividade física?",
    "Cirurgias anteriores?"
  ],
  "Podologia": [
    "Diabetes?",
    "Unhas encravadas?",
    "Calos?",
    "Fissuras nos pés?",
    "Uso de calçados apertados?"
  ],
  "Pré e Pós-Cirúrgico": [
    "Tipo de cirurgia?",
    "Data da cirurgia?",
    "Uso de drenos?",
    "Edema?",
    "Liberação médica?"
  ],
  "Visagismo": [
    "Formato do rosto?",
    "Estilo pessoal?",
    "Profissão?",
    "Preferência de cores?"
  ],
  "Massagem Corporal": [
    "Tensão muscular?",
    "Dores crônicas?",
    "Uso de medicamentos?",
    "Objetivo da massagem?"
  ],
  "Maquiagem Profissional": [
    "Evento?",
    "Tipo de pele?",
    "Alergias?",
    "Preferência de estilo?"
  ],
  "Estética Capilar": [
    "Queda de cabelo?",
    "Oleosidade?",
    "Uso de química?",
    "Caspa?"
  ],
  "Depilação": [
    "Método preferido?",
    "Sensibilidade?",
    "Foliculite?"
  ],
  "Cosmetologia": [
    "Uso contínuo de cosméticos?",
    "Alergias?",
    "Tratamentos em andamento?"
  ]
};

function showSection(id) {
  ["cliente", "profissional", "verFicha"].forEach(sec =>
    document.getElementById(sec).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
  if (id === "profissional") renderLista();
}

function renderModalidade(mod) {
  const box = document.getElementById("perguntas");
  box.innerHTML = "";
  if (!perguntasPorModalidade[mod]) return;

  perguntasPorModalidade[mod].forEach(p => {
    box.innerHTML += `
      <div>
        <label class="text-sm text-purple-700">${p}</label>
        <input class="input" name="${p}">
      </div>
    `;
  });
}

document.getElementById("formAnamnese").onsubmit = e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const db = JSON.parse(localStorage.getItem("pacientes") || "[]");
  db.push(data);
  localStorage.setItem("pacientes", JSON.stringify(db));
  e.target.reset();
  alert("Ficha salva com sucesso!");
};

function renderLista() {
  const lista = document.getElementById("listaPacientes");
  const db = JSON.parse(localStorage.getItem("pacientes") || "[]");
  lista.innerHTML = "";

  db.forEach((p, i) => {
    lista.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <p class="font-semibold">${p.nome}</p>
        <p class="text-sm">${p.modalidade}</p>
        <button onclick="verFicha(${i})" class="text-purple-600 mt-2">Ver ficha</button>
      </div>
    `;
  });
}

function verFicha(i) {
  const db = JSON.parse(localStorage.getItem("pacientes"));
  const p = db[i];
  let html = `<h3 class="text-xl font-semibold mb-4">Ficha de ${p.nome}</h3>`;
  Object.entries(p).forEach(([k, v]) => {
    html += `<p><strong>${k}:</strong> ${v}</p>`;
  });
  document.getElementById("conteudoFicha").innerHTML = html;
  showSection("verFicha");
}

/* Máscara telefone */
document.getElementById("telefone").addEventListener("input", e => {
  e.target.value = e.target.value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
});

/* Animação de fundo - Corações */
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let hearts = Array.from({ length: 50 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 20 + 10,
  speed: Math.random() * 1 + 0.5,
}));

function drawHeart(x, y, size) {
  ctx.fillStyle = "rgba(180,160,255,0.5)";
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y - size / 4, x - size, y, x - size / 2, y + size / 2);
  ctx.bezierCurveTo(x - size / 2.5, y + size / 1.2, x, y + size, x, y + size);
  ctx.bezierCurveTo(x, y + size, x + size / 2.5, y + size / 1.2, x + size / 2, y + size / 2);
  ctx.bezierCurveTo(x + size, y, x + size / 2, y - size / 4, x, y + size / 4);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(heart => {
    drawHeart(heart.x, heart.y, heart.size);
    heart.y += heart.speed;
    if (heart.y > canvas.height) {
      heart.y = -10;
      heart.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animate);
}
animate();
