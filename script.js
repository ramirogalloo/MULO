const expos = document.querySelectorAll('.expo');
const background = document.getElementById('background-layer');
const initialMessage = document.getElementById('initial-message');

let timers = [];
let firstHoverDone = false;

expos.forEach(square => {
  // Agregar título de una vez y ocultarlo
  const titleEl = document.createElement('div');
  titleEl.classList.add('expo-title');
  titleEl.textContent = square.dataset.title;
  square.appendChild(titleEl);

  square.addEventListener('mouseenter', () => {
    // Ocultar mensaje de inicio al primer hover
    if (!firstHoverDone) {
      firstHoverDone = true;
      initialMessage.classList.add('hidden');
    }

    timers.forEach(clearTimeout);
    timers = [];

    expos.forEach(s => {
      s.classList.remove('expanded');
      s.style.backgroundColor = 'black';
      const t = s.querySelector('.expo-title');
      t.classList.remove('visible');
    });

    background.style.opacity = '0';
    background.style.backgroundImage = 'none';
    document.body.style.backgroundColor = 'white';

    const color = square.dataset.color || 'red';
    const image = square.dataset.image;
    const title = square.querySelector('.expo-title');

    // Paso 1: expandir
    square.classList.add('expanded');

    // Paso 2: fondo a color
    timers.push(setTimeout(() => {
      document.body.style.backgroundColor = color;
    }, 250));

    // Paso 3: cuadrado a color
    timers.push(setTimeout(() => {
      square.style.backgroundColor = color;
    }, 500));

    // Paso 4: imagen
    timers.push(setTimeout(() => {
      background.style.backgroundImage = `url(${image})`;
      background.style.opacity = '1';
      title.classList.add('visible')
    }, 750));

  });

  square.addEventListener('mouseleave', () => {
    timers.forEach(clearTimeout);
    timers = [];

    const title = square.querySelector('.expo-title');
    title.classList.remove('visible');

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