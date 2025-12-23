document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     PERGUNTAS
  ====================== */

  const perguntasPorModalidade = {
    "Estética Facial": [
      "Tipo de pele", "Acne", "Manchas", "Uso de ácidos",
      "Sensibilidade", "Rosácea", "Rotina de skincare"
    ],
    "Estética Corporal": [
      "Flacidez", "Celulite", "Estrias",
      "Retenção líquida", "Atividade física", "Cirurgias prévias"
    ],
    "Podologia": [
      "Diabetes", "Unhas encravadas", "Calos",
      "Fissuras", "Micoses", "Uso de palmilhas"
    ],
    "Pré e Pós-Cirúrgico": [
      "Tipo de cirurgia", "Data da cirurgia",
      "Edema", "Drenos", "Liberação médica"
    ],
    "Visagismo": [
      "Formato do rosto", "Estilo pessoal",
      "Profissão", "Preferência de cores"
    ],
    "Massagem Corporal": [
      "Dores musculares", "Estresse",
      "Uso de medicamentos", "Objetivo da massagem"
    ],
    "Maquiagem Profissional": [
      "Evento", "Tipo de pele",
      "Alergias", "Estilo desejado"
    ],
    "Estética Capilar": [
      "Queda capilar", "Oleosidade",
      "Química", "Caspa", "Sensibilidade no couro cabeludo"
    ],
    "Depilação": [
      "Método preferido", "Sensibilidade",
      "Foliculite", "Alergias"
    ],
    "Cosmetologia": [
      "Uso contínuo de cosméticos",
      "Alergias", "Tratamentos em andamento"
    ]
  };

  window.renderModalidade = function (mod) {
    const box = document.getElementById("perguntas");
    box.innerHTML = "";
    if (!perguntasPorModalidade[mod]) return;

    perguntasPorModalidade[mod].forEach(p => {
      box.innerHTML += `
        <div>
          <label class="text-sm text-purple-700">${p}</label>
          <input class="input" name="${p}">
        </div>`;
    });
  };

  /* ======================
     NAVEGAÇÃO
  ====================== */

  window.showSection = function (id) {
    ["cliente", "profissional", "verFicha"].forEach(sec =>
      document.getElementById(sec).classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
    if (id === "profissional") renderLista();
  };

  /* ======================
     ASSINATURA
  ====================== */

  const sigCanvas = document.getElementById("signaturePad");
  const sigCtx = sigCanvas.getContext("2d");
  let drawing = false;

  sigCtx.lineWidth = 2;
  sigCtx.lineCap = "round";
  sigCtx.strokeStyle = "#6b21a8";

  function pos(e) {
    const r = sigCanvas.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    }
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  sigCanvas.addEventListener("mousedown", e => {
    drawing = true;
    const p = pos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(p.x, p.y);
  });

  sigCanvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    const p = pos(e);
    sigCtx.lineTo(p.x, p.y);
    sigCtx.stroke();
  });

  ["mouseup", "mouseleave"].forEach(ev =>
    sigCanvas.addEventListener(ev, () => drawing = false)
  );

  sigCanvas.addEventListener("touchstart", e => {
    e.preventDefault();
    drawing = true;
    const p = pos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(p.x, p.y);
  });

  sigCanvas.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!drawing) return;
    const p = pos(e);
    sigCtx.lineTo(p.x, p.y);
    sigCtx.stroke();
  });

  sigCanvas.addEventListener("touchend", () => drawing = false);

  window.clearSignature = function () {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  };

  function hasSignature() {
    const blank = document.createElement("canvas");
    blank.width = sigCanvas.width;
    blank.height = sigCanvas.height;
    return sigCanvas.toDataURL() !== blank.toDataURL();
  }

  /* ======================
     FORM
  ====================== */

  document.getElementById("formAnamnese").addEventListener("submit", e => {
    e.preventDefault();
    if (!hasSignature()) {
      alert("Assinatura obrigatória.");
      return;
    }

    const data = Object.fromEntries(new FormData(e.target));
    data.assinatura = sigCanvas.toDataURL();

    const db = JSON.parse(localStorage.getItem("pacientes") || "[]");
    db.push(data);
    localStorage.setItem("pacientes", JSON.stringify(db));

    e.target.reset();
    clearSignature();
    alert("Ficha salva com sucesso!");
  });

  /* ======================
     LISTA / VER FICHA
  ====================== */

  function renderLista() {
    const lista = document.getElementById("listaPacientes");
    const db = JSON.parse(localStorage.getItem("pacientes") || "[]");
    lista.innerHTML = "";

    db.forEach((p, i) => {
      lista.innerHTML += `
        <div class="bg-white p-4 rounded-xl shadow">
          <p class="font-semibold">${p.nome}</p>
          <p class="text-sm">${p.modalidade}</p>
          <button onclick="verFicha(${i})" class="text-purple-600 mt-2">
            Ver ficha
          </button>
        </div>`;
    });
  }

  window.verFicha = function (i) {
    const db = JSON.parse(localStorage.getItem("pacientes"));
    const p = db[i];
    let html = `<h3 class="text-xl font-semibold mb-4">Ficha de ${p.nome}</h3>`;
    Object.entries(p).forEach(([k, v]) => {
      if (k !== "assinatura") html += `<p><strong>${k}:</strong> ${v}</p>`;
    });
    html += `<h4 class="mt-4 font-semibold">Assinatura</h4>
             <img src="${p.assinatura}" class="mt-2 border rounded max-w-xs">`;
    document.getElementById("conteudoFicha").innerHTML = html;
    showSection("verFicha");
  };

  /* ======================
     TELEFONE
  ====================== */

  document.getElementById("telefone").addEventListener("input", e => {
    e.target.value = e.target.value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  });

  /* ======================
     FUNDO
  ====================== */

  const bg = document.getElementById("bgCanvas");
  const ctx = bg.getContext("2d");
  bg.width = innerWidth;
  bg.height = innerHeight;

  let hearts = Array.from({ length: 30 }, () => ({
    x: Math.random() * bg.width,
    y: Math.random() * bg.height,
    s: Math.random() * 18 + 8,
    v: Math.random() * 0.8 + 0.3
  }));

  function drawHeart(x, y, s) {
    ctx.fillStyle = "rgba(200,180,255,0.4)";
    ctx.beginPath();
    ctx.moveTo(x, y + s / 4);
    ctx.bezierCurveTo(x - s / 2, y - s / 4, x - s, y, x - s / 2, y + s / 2);
    ctx.bezierCurveTo(x - s / 2.5, y + s, x, y + s, x, y + s);
    ctx.bezierCurveTo(x, y + s, x + s / 2.5, y + s, x + s / 2, y + s / 2);
    ctx.bezierCurveTo(x + s, y, x + s / 2, y - s / 4, x, y + s / 4);
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, bg.width, bg.height);
    hearts.forEach(h => {
      drawHeart(h.x, h.y, h.s);
      h.y += h.v;
      if (h.y > bg.height) {
        h.y = -20;
        h.x = Math.random() * bg.width;
      }
    });
    requestAnimationFrame(animate);
  }

  animate();

});
