document.addEventListener("DOMContentLoaded", () => {

  const perguntasPorModalidade = {
    "Estética Facial": [
      "Tipo de pele","Acne","Manchas","Uso de ácidos",
      "Sensibilidade","Rosácea","Rotina de skincare"
    ],
    "Estética Corporal": [
      "Flacidez","Celulite","Estrias",
      "Retenção líquida","Atividade física","Cirurgias prévias"
    ],
    "Podologia": [
      "Diabetes","Unhas encravadas","Calos",
      "Fissuras","Micoses","Uso de palmilhas"
    ],
    "Pré e Pós-Cirúrgico": [
      "Tipo de cirurgia","Data da cirurgia",
      "Edema","Drenos","Liberação médica"
    ],
    "Visagismo": [
      "Formato do rosto","Estilo pessoal",
      "Profissão","Preferência de cores"
    ],
    "Massagem Corporal": [
      "Dores musculares","Estresse",
      "Uso de medicamentos","Objetivo da massagem"
    ],
    "Maquiagem Profissional": [
      "Evento","Tipo de pele",
      "Alergias","Estilo desejado"
    ],
    "Estética Capilar": [
      "Queda capilar","Oleosidade",
      "Química","Caspa","Sensibilidade no couro cabeludo"
    ],
    "Depilação": [
      "Método preferido","Sensibilidade",
      "Foliculite","Alergias"
    ],
    "Cosmetologia": [
      "Uso contínuo de cosméticos",
      "Alergias","Tratamentos em andamento"
    ]
  };

  window.renderModalidade = mod => {
    const box = document.getElementById("perguntas");
    box.innerHTML = "";
    if (!perguntasPorModalidade[mod]) return;

    perguntasPorModalidade[mod].forEach(p => {
      box.innerHTML += `
        <div>
          <label class="label">${p}</label>
          <input class="input" name="${p}">
        </div>`;
    });
  };

  window.showSection = id => {
    ["cliente","profissional","verFicha"].forEach(s =>
      document.getElementById(s).classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
    if (id === "profissional") renderLista();
  };

  const sigCanvas = document.getElementById("signaturePad");
  const ctx = sigCanvas.getContext("2d");
  let drawing = false;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#6b21a8";

  const pos = e => {
    const r = sigCanvas.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    }
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  ["mousedown","touchstart"].forEach(ev =>
    sigCanvas.addEventListener(ev, e => {
      e.preventDefault();
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
    })
  );

  ["mousemove","touchmove"].forEach(ev =>
    sigCanvas.addEventListener(ev, e => {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
    })
  );

  ["mouseup","mouseleave","touchend"].forEach(ev =>
    sigCanvas.addEventListener(ev, () => drawing = false)
  );

  window.clearSignature = () =>
    ctx.clearRect(0,0,sigCanvas.width,sigCanvas.height);

  const hasSignature = () => {
    const blank = document.createElement("canvas");
    blank.width = sigCanvas.width;
    blank.height = sigCanvas.height;
    return sigCanvas.toDataURL() !== blank.toDataURL();
  };

  document.getElementById("formAnamnese").addEventListener("submit", e => {
    e.preventDefault();
    if (!hasSignature()) return alert("Assinatura obrigatória.");

    const data = Object.fromEntries(new FormData(e.target));
    data.assinatura = sigCanvas.toDataURL();

    const db = JSON.parse(localStorage.getItem("pacientes") || "[]");
    db.push(data);
    localStorage.setItem("pacientes", JSON.stringify(db));

    e.target.reset();
    clearSignature();
    alert("Ficha salva com sucesso!");
  });

  function renderLista() {
    const lista = document.getElementById("listaPacientes");
    const db = JSON.parse(localStorage.getItem("pacientes") || "[]");
    lista.innerHTML = "";
    db.forEach((p,i) => {
      lista.innerHTML += `
        <div class="card">
          <strong>${p.nome}</strong>
          <p>${p.modalidade}</p>
          <button class="link" onclick="verFicha(${i})">Ver ficha</button>
        </div>`;
    });
  }

  window.verFicha = i => {
    const p = JSON.parse(localStorage.getItem("pacientes"))[i];
    let html = `<h3 class="title">${p.nome}</h3>`;
    Object.entries(p).forEach(([k,v]) => {
      if (k !== "assinatura") html += `<p><strong>${k}:</strong> ${v}</p>`;
    });
    html += `<img src="${p.assinatura}" class="signature-img">`;
    document.getElementById("conteudoFicha").innerHTML = html;
    showSection("verFicha");
  };

});

const bg = document.getElementById("bgCanvas");
const bctx = bg.getContext("2d");

bg.width = innerWidth;
bg.height = innerHeight;

let hearts = Array.from({ length: 40 }, () => ({
  x: Math.random() * bg.width,
  y: Math.random() * bg.height,
  s: Math.random() * 20 + 10,
  v: Math.random() * 0.8 + 0.3
}));

function drawHeart(x, y, s) {
  bctx.fillStyle = "rgba(180,160,255,0.4)";
  bctx.beginPath();
  bctx.moveTo(x, y + s / 4);
  bctx.bezierCurveTo(x - s / 2, y - s / 4, x - s, y, x - s / 2, y + s / 2);
  bctx.bezierCurveTo(x - s / 2.5, y + s, x, y + s, x, y + s);
  bctx.bezierCurveTo(x, y + s, x + s / 2.5, y + s, x + s / 2, y + s / 2);
  bctx.bezierCurveTo(x + s, y, x + s / 2, y - s / 4, x, y + s / 4);
  bctx.fill();
}

function animateBg() {
  bctx.clearRect(0, 0, bg.width, bg.height);
  hearts.forEach(h => {
    drawHeart(h.x, h.y, h.s);
    h.y += h.v;
    if (h.y > bg.height) {
      h.y = -20;
      h.x = Math.random() * bg.width;
    }
  });
  requestAnimationFrame(animateBg);
}

animateBg();
