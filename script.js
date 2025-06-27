const expos = document.querySelectorAll('.expo');
const background = document.getElementById('background-layer');
const initialMessage = document.getElementById('initial-message');

let timers = [];
let firstHoverDone = false;
let lockedSquare = null;

const barrios = ["Palermo", "Recoleta", "San Telmo", "Villa Crespo", "Chacarita"];
const today = new Date("2025-06-27");

// Rango de fechas para generar fechas equidistantes según el número de expos
const startDate = new Date(2024, 0, 1).getTime();
const endDate = new Date(2026, 11, 31).getTime();
const exposCount = expos.length;

expos.forEach((square, index) => {
  const expoNumber = String(index + 1).padStart(2, '0');
  const titleText = `EXP_${expoNumber}`;

  // Calcular fecha ordenada
  const timeFraction = index / (exposCount - 1); // va de 0 a 1
  const randomOffset = Math.random() * (endDate - startDate) / exposCount; // para no ser exactos
  const timestamp = startDate + timeFraction * (endDate - startDate) + randomOffset;
  const randomDate = new Date(Math.min(timestamp, endDate)); // evitar pasarse del rango

  const formattedDate = `${randomDate.getDate().toString().padStart(2, '0')}/${(randomDate.getMonth() + 1).toString().padStart(2, '0')}/${randomDate.getFullYear()}`;
  const estado = randomDate > today ? "Futuro" : "Pasada";
  const visitantes = Math.floor(Math.random() * 4700 + 300);
  const ubicacion = barrios[Math.floor(Math.random() * barrios.length)];

  const titleEl = document.createElement('div');
  titleEl.classList.add('expo-title');
  titleEl.textContent = titleText;
  square.appendChild(titleEl);

  const plusEl = document.createElement('div');
  plusEl.classList.add('expo-plus');
  plusEl.textContent = '+';
  square.appendChild(plusEl);

  const panelEl = document.createElement('div');
  panelEl.classList.add('expo-panel');
  panelEl.innerHTML = `
    <strong>Fecha:</strong> ${formattedDate}<br>
    <strong>Ubicación:</strong> ${ubicacion}<br>
    <strong>Visitantes:</strong> ${visitantes}<br>
    <strong>Estado:</strong> ${estado}
  `;
  square.appendChild(panelEl);

  plusEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const color = square.dataset.color || 'black';
    if (lockedSquare === square) {
      square.classList.remove('locked');
      plusEl.textContent = '+';
      lockedSquare = null;
    } else {
      expos.forEach(s => {
        s.classList.remove('locked');
        s.querySelector('.expo-plus').textContent = '+';
      });
      square.classList.add('locked');
      plusEl.textContent = '×';
      panelEl.style.backgroundColor = color;
      lockedSquare = square;
    }
  });

  square.addEventListener('mouseenter', () => {
    if (lockedSquare && lockedSquare !== square) {
      lockedSquare.classList.remove('locked');
      lockedSquare.querySelector('.expo-plus').textContent = '+';
      lockedSquare = null;
    }

    if (lockedSquare) return;

    if (!firstHoverDone) {
      firstHoverDone = true;
      initialMessage.classList.add('hidden');
    }

    timers.forEach(clearTimeout);
    timers = [];

    expos.forEach(s => {
      s.classList.remove('expanded');
      s.style.backgroundColor = 'black';
      s.querySelector('.expo-title').classList.remove('visible');
      s.querySelector('.expo-plus').classList.remove('visible');
    });

    background.style.opacity = '0';
    background.style.backgroundImage = 'none';
    document.body.style.backgroundColor = 'white';

    const color = square.dataset.color || 'red';
    const image = square.dataset.image;
    const title = square.querySelector('.expo-title');
    const plus = square.querySelector('.expo-plus');

    square.classList.add('expanded');

    timers.push(setTimeout(() => {
      document.body.style.backgroundColor = color;
    }, 250));

    timers.push(setTimeout(() => {
      square.style.backgroundColor = color;
    }, 500));

    timers.push(setTimeout(() => {
      background.style.backgroundImage = `url(${image})`;
      background.style.opacity = '1';
      title.classList.add('visible');
      plus.classList.add('visible');
    }, 500));
  });

  square.addEventListener('mouseleave', () => {
    if (lockedSquare) return;

    timers.forEach(clearTimeout);
    timers = [];

    const title = square.querySelector('.expo-title');
    const plus = square.querySelector('.expo-plus');
    title.classList.remove('visible');
    plus.classList.remove('visible');

    background.style.opacity = '0';

    setTimeout(() => {
      square.style.backgroundColor = 'black';
    }, 250);

    setTimeout(() => {
      document.body.style.backgroundColor = 'white';
      background.style.backgroundImage = 'none';
    }, 500);

    setTimeout(() => {
      square.classList.remove('expanded');
    }, 750);
  });
});
