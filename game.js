import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';

// ==========================================
// 1. КОНСТАНТИ, КОЛЬОРИ ТА КАТАЛОГ ДЕТАЛЕЙ
// ==========================================
const STUD_SIZE = 1.0;
const PLATE_HEIGHT = 0.4;

const LEGO_COLORS = [
  { name: 'Яскраво-червоний', hex: '#E3000B' },
  { name: 'Яскраво-синій', hex: '#006CB7' },
  { name: 'Яскраво-жовтий', hex: '#FFD500' },
  { name: 'Зелений', hex: '#00A850' },
  { name: 'Темно-зелений', hex: '#005A2B' },
  { name: 'Помаранчевий', hex: '#FF6F00' },
  { name: 'Білий', hex: '#F4F4F4' },
  { name: 'Чорний', hex: '#1B1D21' },
  { name: 'Світло-сірий', hex: '#A3A8AD' },
  { name: 'Темно-сірий', hex: '#5C6166' },
  { name: 'Пісочний', hex: '#DEC69B' },
  { name: 'Коричневий', hex: '#6B3E26' },
  { name: 'Фіолетовий', hex: '#7A288A' },
  { name: 'Рожевий', hex: '#FF69B4' },
  { name: 'Блакитний', hex: '#36AEBF' },
  { name: 'Лаймовий', hex: '#A5CA18' },
  { name: 'Золотий металік', hex: '#D4AF37' },
  { name: 'Срібний металік', hex: '#C0C5CE' },
  { name: 'Прозоре скло', hex: '#88D8FF', transparent: true, glow: true },
  { name: 'Неоновий вогонь', hex: '#FF5500', transparent: true, glow: true }
];

const BASE_PARTS = [
  // КУБИКИ
  { id: 'b_1x1', name: 'Кубик 1×1', cat: 'bricks', w: 1, d: 1, hPlates: 3, shape: 'brick' },
  { id: 'b_1x2', name: 'Кубик 1×2', cat: 'bricks', w: 1, d: 2, hPlates: 3, shape: 'brick' },
  { id: 'b_1x3', name: 'Кубик 1×3', cat: 'bricks', w: 1, d: 3, hPlates: 3, shape: 'brick' },
  { id: 'b_1x4', name: 'Кубик 1×4', cat: 'bricks', w: 1, d: 4, hPlates: 3, shape: 'brick' },
  { id: 'b_1x6', name: 'Кубик 1×6', cat: 'bricks', w: 1, d: 6, hPlates: 3, shape: 'brick' },
  { id: 'b_1x8', name: 'Кубик 1×8', cat: 'bricks', w: 1, d: 8, hPlates: 3, shape: 'brick' },
  { id: 'b_2x2', name: 'Кубик 2×2', cat: 'bricks', w: 2, d: 2, hPlates: 3, shape: 'brick' },
  { id: 'b_2x3', name: 'Кубик 2×3', cat: 'bricks', w: 2, d: 3, hPlates: 3, shape: 'brick' },
  { id: 'b_2x4', name: 'Кубик 2×4', cat: 'bricks', w: 2, d: 4, hPlates: 3, shape: 'brick' },
  { id: 'b_2x6', name: 'Кубик 2×6', cat: 'bricks', w: 2, d: 6, hPlates: 3, shape: 'brick' },
  { id: 'b_2x8', name: 'Кубик 2×8', cat: 'bricks', w: 2, d: 8, hPlates: 3, shape: 'brick' },
  { id: 'b_cyl1', name: 'Циліндр 1×1', cat: 'bricks', w: 1, d: 1, hPlates: 3, shape: 'cylinder' },
  { id: 'b_cyl2', name: 'Колона 2×2', cat: 'bricks', w: 2, d: 2, hPlates: 6, shape: 'cylinder' },
  { id: 'b_cone', name: 'Конус 2×2', cat: 'bricks', w: 2, d: 2, hPlates: 4, shape: 'cone' },

  // ПЛАСТИНИ І ПЛИТКИ
  { id: 'p_1x1', name: 'Пластина 1×1', cat: 'plates', w: 1, d: 1, hPlates: 1, shape: 'plate' },
  { id: 'p_1x2', name: 'Пластина 1×2', cat: 'plates', w: 1, d: 2, hPlates: 1, shape: 'plate' },
  { id: 'p_1x4', name: 'Пластина 1×4', cat: 'plates', w: 1, d: 4, hPlates: 1, shape: 'plate' },
  { id: 'p_2x2', name: 'Пластина 2×2', cat: 'plates', w: 2, d: 2, hPlates: 1, shape: 'plate' },
  { id: 'p_2x4', name: 'Пластина 2×4', cat: 'plates', w: 2, d: 4, hPlates: 1, shape: 'plate' },
  { id: 'p_4x4', name: 'Пластина 4×4', cat: 'plates', w: 4, d: 4, hPlates: 1, shape: 'plate' },
  { id: 'p_6x6', name: 'Пластина 6×6', cat: 'plates', w: 6, d: 6, hPlates: 1, shape: 'plate' },
  { id: 'p_8x8', name: 'Пластина 8×8', cat: 'plates', w: 8, d: 8, hPlates: 1, shape: 'plate' },
  { id: 't_1x2', name: 'Гладка плитка 1×2', cat: 'plates', w: 1, d: 2, hPlates: 1, shape: 'tile' },
  { id: 't_2x2', name: 'Гладка плитка 2×2', cat: 'plates', w: 2, d: 2, hPlates: 1, shape: 'tile' },
  { id: 't_2x4', name: 'Гладка плитка 2×4', cat: 'plates', w: 2, d: 4, hPlates: 1, shape: 'tile' },

  // СКОСИ І ДАХИ
  { id: 's_1x2', name: 'Скіс 45° 1×2', cat: 'slopes', w: 1, d: 2, hPlates: 3, shape: 'slope' },
  { id: 's_2x2', name: 'Скіс 45° 2×2', cat: 'slopes', w: 2, d: 2, hPlates: 3, shape: 'slope' },
  { id: 's_2x3', name: 'Скіс даху 2×3', cat: 'slopes', w: 2, d: 3, hPlates: 3, shape: 'slope' },
  { id: 's_2x4', name: 'Скіс даху 2×4', cat: 'slopes', w: 2, d: 4, hPlates: 3, shape: 'slope' },
  { id: 'r_2x2', name: 'Гребінь даху 2×2', cat: 'slopes', w: 2, d: 2, hPlates: 3, shape: 'roof' },
  { id: 'r_2x4', name: 'Гребінь даху 2×4', cat: 'slopes', w: 2, d: 4, hPlates: 3, shape: 'roof' },
  { id: 'a_1x4', name: 'Арка 1×4', cat: 'slopes', w: 1, d: 4, hPlates: 3, shape: 'arch' },

  // ВІКНА, ДВЕРІ, КОЛЕСА, ДЕКОР
  { id: 'd_win', name: 'Вікно зі склом 1×2×2', cat: 'details', w: 1, d: 2, hPlates: 6, shape: 'window' },
  { id: 'd_win4', name: 'Панорамне вікно 1×4×2', cat: 'details', w: 1, d: 4, hPlates: 6, shape: 'window' },
  { id: 'd_door', name: 'Двері з рамою 1×3×3', cat: 'details', w: 1, d: 3, hPlates: 9, shape: 'door' },
  { id: 'd_wheel', name: 'Колесо з шиною 2×2', cat: 'details', w: 2, d: 2, hPlates: 3, shape: 'wheel' },
  { id: 'd_fence', name: 'Парканчик 1×4', cat: 'details', w: 1, d: 4, hPlates: 3, shape: 'fence' },
  { id: 'dec_tree', name: 'Ялинка LEGO 2×2', cat: 'details', w: 2, d: 2, hPlates: 9, shape: 'tree' },
  { id: 'dec_flag', name: 'Прапор 1×2', cat: 'details', w: 1, d: 2, hPlates: 6, shape: 'flag' }
];

// ==========================================
// 2. ГЕНЕРАТОР 132 УНІКАЛЬНИХ 3D-МІНІФІГУРОК
// ==========================================
function generate132Minifigures() {
  const themes = [
    {
      subCat: 'city',
      roles: [
        'Будівельник', 'Поліцейський', 'Пожежник', 'Лікар-хірург', 'Шеф-кухар',
        'Пілот лайнера', 'Гонщик Формули', 'Автомеханік', 'Детектив', 'Рок-зірка',
        'Диджей', 'Телеведучий', 'Бізнесмен', 'Турист', 'Фермер',
        'Листоноша', 'Машиніст поїзда', 'Капітан корабля', 'Водолаз', 'Архітектор',
        'Скейтбордист', 'Мер міста'
      ],
      torsos: ['#FF6F00', '#16284C', '#E3000B', '#36AEBF', '#F4F4F4', '#006CB7', '#FFD500', '#5C6166'],
      legs: ['#006CB7', '#1B1D21', '#5C6166', '#6B3E26', '#F4F4F4'],
      hats: ['builder', 'police', 'cap', 'hair', 'tophat', 'visor'],
      faces: ['smile', 'glasses', 'mustache', 'beard'],
      accs: ['wrench', 'radio', 'none', 'torch']
    },
    {
      subCat: 'space',
      roles: [
        'Космонавт NASA', 'Командир Марсу', 'Кіборг X-9', 'Зелений Прибулець', 'Синій Прибулець',
        'Космічний Рейнджер', 'Астро-інженер', 'Зоряний Пілот', 'Бойовий Дроїд', 'Галактичний Імператор',
        'Дослідник Місяця', 'Оператор Лазера', 'Біолог Екзопланет', 'Квантовий Мандрівник', 'Кібер-Медик',
        'Пілот Шаттла', 'Захисник Орбіти', 'Космічний Шахтар', 'Навігатор Зірок', 'Астро-Кадет',
        'Галактичний Мисливець', 'Робот-Синтетик'
      ],
      torsos: ['#F4F4F4', '#E3000B', '#006CB7', '#1B1D21', '#FF6F00', '#A5CA18', '#7A288A', '#C0C5CE'],
      legs: ['#F4F4F4', '#1B1D21', '#5C6166', '#006CB7', '#A3A8AD'],
      hats: ['astro', 'cyber', 'alien', 'visor'],
      faces: ['smile', 'visor', 'alien', 'robot', 'glasses'],
      accs: ['blaster', 'jetpack', 'scanner', 'saber_blue']
    },
    {
      subCat: 'castle',
      roles: [
        'Золотий Король', 'Королева Ельфів', 'Лицар Дракона', 'Лицар Лева', 'Темний Лорд',
        'Великий Чарівник', 'Вікінг Берсерк', 'Паладин Світла', 'Ельф-Лучник', 'Королівський Гвардієць',
        'Алхімік', 'Скелет-Воїн', 'Зомбі-Лицар', 'Коваль Зброї', 'Хранитель Вежі',
        'Принц Півночі', 'Лісовий Рейнджер', 'Барон Замку', 'Воєвода', 'Маг Вогню',
        'Маг Льоду', 'Лицар Фенікса'
      ],
      torsos: ['#A3A8AD', '#5C6166', '#D4AF37', '#E3000B', '#005A2B', '#7A288A', '#1B1D21', '#006CB7'],
      legs: ['#5C6166', '#1B1D21', '#6B3E26', '#A3A8AD', '#D4AF37'],
      hats: ['crown', 'knight', 'wizard', 'viking', 'hood'],
      faces: ['beard', 'smile', 'skeleton', 'zombie', 'mustache'],
      accs: ['sword', 'staff', 'axe', 'shield']
    },
    {
      subCat: 'ninja',
      roles: [
        'Ніндзя Вогню', 'Ніндзя Блискавки', 'Ніндзя Льоду', 'Ніндзя Землі', 'Зелений Майстер',
        'Золотий Сенсей', 'Тіньовий Ніндзя', 'Самурай-Сьогун', 'Майстер Катани', 'Ніндзя Вітру',
        'Ніндзя Води', 'Кібер-Ніндзя', 'Воїн Клану Змії', 'Червоний Ронін', 'Нічний Асасин',
        'Майстер Спінджитцу', 'Дракон-Самурай', 'Учень Додзьо', 'Нефритовий Воїн', 'Білий Сьогун',
        'Примарний Ніндзя', 'Хранитель Сувою'
      ],
      torsos: ['#E3000B', '#006CB7', '#F4F4F4', '#1B1D21', '#00A850', '#D4AF37', '#7A288A', '#FF6F00'],
      legs: ['#1B1D21', '#E3000B', '#006CB7', '#F4F4F4', '#005A2B'],
      hats: ['ninja', 'samurai', 'wizard'],
      faces: ['ninja', 'beard', 'robot'],
      accs: ['katana', 'saber_green', 'staff', 'sword']
    },
    {
      subCat: 'pirate',
      roles: [
        'Капітан Чорна Борода', 'Рудий Корсар', 'Адмірал Флоту', 'Боцман', 'Шукач Скарбів',
        'Золотий Фараон', 'Давня Мумія', 'Ковбой Дикого Заходу', 'Шериф Містечка', 'Дослідник Джунглів',
        'Капітан Привидів', 'Юнга Вітрильника', 'Стрілець Мушкета', 'Конкістадор', 'Вождь Племені',
        'Мисливець за Золотом', 'Пірат-Канонір', 'Наглядач Маяка', 'Морський Вовк', 'Губернатор Острова',
        'Шаман', 'Легендарний Капер'
      ],
      torsos: ['#E3000B', '#16284C', '#6B3E26', '#DEC69B', '#D4AF37', '#1B1D21', '#005A2B', '#F4F4F4'],
      legs: ['#1B1D21', '#6B3E26', '#DEC69B', '#F4F4F4', '#16284C'],
      hats: ['pirate', 'cowboy', 'crown', 'tophat', 'hair'],
      faces: ['eyepatch', 'beard', 'mustache', 'skeleton', 'smile'],
      accs: ['cutlass', 'torch', 'blaster', 'staff']
    },
    {
      subCat: 'hero',
      roles: [
        'Залізний Воїн', 'Капітан Блискавка', 'Темний Месник', 'Неоновий Самурай', 'Кібер-Хакер',
        'Супер-Швидкість', 'Титановий Страж', 'Лазерний Захисник', 'Громовержець', 'Агент Тінь',
        'Біо-Мутант', 'Ультра-Робот', 'Хроно-Лицар', 'Плазмовий Герой', 'Сонячний Титан',
        'Атомний Рейнджер', 'Кібер-Панк 2099', 'Сталевий Кулак', 'Зоряний Захисник', 'Мега-Інженер',
        'Фантом', 'Абсолютний Чемпіон'
      ],
      torsos: ['#E3000B', '#1B1D21', '#006CB7', '#7A288A', '#FF6F00', '#00A850', '#D4AF37', '#36AEBF'],
      legs: ['#1B1D21', '#E3000B', '#006CB7', '#5C6166', '#D4AF37'],
      hats: ['cyber', 'knight', 'ninja', 'hair', 'visor'],
      faces: ['glasses', 'visor', 'robot', 'smile'],
      accs: ['saber_red', 'saber_blue', 'shield', 'blaster']
    }
  ];

  const list = [];
  let counter = 1;

  themes.forEach(theme => {
    theme.roles.forEach((roleName, i) => {
      const torsoColor = theme.torsos[i % theme.torsos.length];
      const legColor = theme.legs[(i * 2) % theme.legs.length];
      const hatType = theme.hats[i % theme.hats.length];
      const faceType = theme.faces[i % theme.faces.length];
      const accessory = theme.accs[i % theme.accs.length];

      let headColor = '#FFD500';
      if (faceType === 'alien') headColor = i % 2 === 0 ? '#A5CA18' : '#36AEBF';
      if (faceType === 'skeleton') headColor = '#F4F4F4';
      if (faceType === 'zombie') headColor = '#8FA876';
      if (faceType === 'robot') headColor = '#C0C5CE';

      const hasCape = (theme.subCat === 'castle' || theme.subCat === 'hero' || i % 5 === 0);
      const capeColor = i % 2 === 0 ? '#E3000B' : '#16284C';

      list.push({
        id: `mf_${String(counter++).padStart(3, '0')}`,
        name: roleName,
        cat: 'minifigs',
        subCat: theme.subCat,
        w: 2,
        d: 1,
        hPlates: 9,
        shape: 'minifig',
        mfConfig: {
          torsoColor,
          legColor,
          headColor,
          hatType,
          faceType,
          accessory,
          hasCape,
          capeColor,
          subCat: theme.subCat
        }
      });
    });
  });

  return list;
}

const MINIFIG_CATALOG = generate132Minifigures();
const PARTS_CATALOG = [...BASE_PARTS, ...MINIFIG_CATALOG];

// ==========================================
// 3. ЗВУКОВИЙ СИНТЕЗАТОР КЛАЦАННЯ LEGO
// ==========================================
class LegoAudio {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playSnap(pitch = 1.0) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(1500 * pitch, now + 0.032);
    osc.frequency.exponentialRampToValueAtTime(290 * pitch, now + 0.072);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.078);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
  playRemove() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }
}
const audio = new LegoAudio();

// ==========================================
// 4. ГЕНЕРАТОР РЕАЛІСТИЧНОГО ABS-ПЛАСТИКУ ТА 3D-ДЕТАЛЕЙ
// ==========================================
function createMaterial(colorObj, isGhost = false) {
  const isGlow = Boolean(colorObj.glow);
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorObj.hex),
    roughness: 0.22,
    metalness: colorObj.name && colorObj.name.includes('металік') ? 0.65 : 0.04,
    clearcoat: 0.35,
    clearcoatRoughness: 0.18,
    transparent: isGhost || Boolean(colorObj.transparent),
    opacity: isGhost ? 0.56 : (colorObj.transparent ? 0.64 : 1.0),
    emissive: isGlow ? new THREE.Color(colorObj.hex) : new THREE.Color('#000000'),
    emissiveIntensity: isGlow ? 0.45 : 0.0
  });
  mat.userData.isGlow = isGlow;
  return mat;
}

function addStudsToGroup(group, w, d, topY, material, skipFilter = null) {
  const studGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.18, 16);
  const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 14);
  for (let ix = 0; ix < w; ix++) {
    for (let iz = 0; iz < d; iz++) {
      if (skipFilter && skipFilter(ix, iz)) continue;
      const sx = -w / 2 + 0.5 + ix;
      const sz = -d / 2 + 0.5 + iz;
      const stud = new THREE.Mesh(studGeo, material);
      stud.position.set(sx, topY + 0.09, sz);
      stud.castShadow = true;
      stud.receiveShadow = true;
      group.add(stud);

      const cap = new THREE.Mesh(capGeo, material);
      cap.position.set(sx, topY + 0.185, sz);
      group.add(cap);
    }
  }
}

function createTorsoTexture(cfg) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = cfg.torsoColor;
  ctx.fillRect(0, 0, 128, 128);

  // Пояс
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 112, 128, 16);
  ctx.fillStyle = '#FFD500';
  ctx.fillRect(54, 114, 20, 12);

  // Тематична емблема на грудях
  if (cfg.subCat === 'city') {
    ctx.fillStyle = '#FFD500';
    ctx.beginPath();
    ctx.arc(44, 48, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(72, 42, 24, 12);
  } else if (cfg.subCat === 'space') {
    ctx.strokeStyle = '#36AEBF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(64, 56, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#FFD500';
    ctx.beginPath();
    ctx.arc(64, 56, 9, 0, Math.PI * 2);
    ctx.fill();
  } else if (cfg.subCat === 'castle') {
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.moveTo(64, 30);
    ctx.lineTo(86, 54);
    ctx.lineTo(64, 82);
    ctx.lineTo(42, 54);
    ctx.closePath();
    ctx.fill();
  } else if (cfg.subCat === 'ninja') {
    ctx.strokeStyle = '#FFD500';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(98, 100);
    ctx.moveTo(98, 20);
    ctx.lineTo(30, 100);
    ctx.stroke();
  } else if (cfg.subCat === 'pirate') {
    ctx.fillStyle = '#F4F4F4';
    ctx.beginPath();
    ctx.arc(64, 54, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(56, 66, 16, 10);
  } else if (cfg.subCat === 'hero') {
    ctx.fillStyle = '#36AEBF';
    ctx.beginPath();
    ctx.moveTo(64, 32);
    ctx.lineTo(88, 60);
    ctx.lineTo(64, 88);
    ctx.lineTo(40, 60);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createFaceTexture(cfg) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = cfg.headColor;
  ctx.fillRect(0, 0, 256, 128);

  if (cfg.faceType === 'ninja') {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 256, 44);
    ctx.fillRect(0, 82, 256, 46);
  }

  // Очі
  if (cfg.faceType === 'glasses') {
    ctx.fillStyle = '#111';
    ctx.fillRect(92, 46, 30, 18);
    ctx.fillRect(134, 46, 30, 18);
    ctx.fillRect(122, 50, 12, 4);
  } else if (cfg.faceType === 'visor' || cfg.faceType === 'robot') {
    ctx.fillStyle = '#E3000B';
    ctx.fillRect(92, 48, 72, 14);
  } else {
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(106, 56, 7, 0, Math.PI * 2);
    ctx.arc(150, 56, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(104, 54, 2.3, 0, Math.PI * 2);
    ctx.arc(148, 54, 2.3, 0, Math.PI * 2);
    ctx.fill();

    if (cfg.faceType === 'alien') {
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(128, 36, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    if (cfg.faceType === 'eyepatch') {
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(150, 56, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(90, 36);
      ctx.lineTo(168, 66);
      ctx.stroke();
    }
  }

  // Борода / Вуса / Посмішка
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3.5;
  if (cfg.faceType === 'beard') {
    ctx.fillStyle = '#4A2E1B';
    ctx.beginPath();
    ctx.arc(128, 72, 22, 0, Math.PI);
    ctx.fill();
  } else if (cfg.faceType === 'mustache') {
    ctx.fillStyle = '#3B2314';
    ctx.fillRect(110, 68, 36, 7);
  } else if (cfg.faceType === 'skeleton') {
    ctx.fillStyle = '#111';
    ctx.fillRect(112, 74, 32, 10);
  } else if (cfg.faceType !== 'ninja') {
    ctx.beginPath();
    ctx.arc(128, 70, 17, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMinifigMesh(part, customColorObj, isGhost = false) {
  const group = new THREE.Group();
  const hTotal = part.hPlates * PLATE_HEIGHT;
  const cfg = part.mfConfig || {
    torsoColor: customColorObj.hex,
    legColor: '#006CB7',
    headColor: '#FFD500',
    hatType: 'builder',
    faceType: 'smile',
    accessory: 'none',
    hasCape: false,
    capeColor: '#E3000B',
    subCat: 'city'
  };

  const headMat = createMaterial({ name: 'Head', hex: cfg.headColor }, isGhost);
  const legMat = createMaterial({ name: 'Legs', hex: cfg.legColor }, isGhost);

  // 1. Ноги та пояс
  const hipMesh = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.28, 0.68), legMat);
  hipMesh.position.y = 1.25;
  group.add(hipMesh);

  const legGeo = new THREE.BoxGeometry(0.62, 1.12, 0.66);
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.36, 0.56, 0);
  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.36, 0.56, 0);
  group.add(leftLeg, rightLeg);

  // 2. Торс із принтом
  const torsoMat = new THREE.MeshPhysicalMaterial({
    map: createTorsoTexture(cfg),
    roughness: 0.24,
    clearcoat: 0.3,
    transparent: isGhost,
    opacity: isGhost ? 0.58 : 1.0
  });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.34, 1.25, 0.66), torsoMat);
  torso.position.y = 2.02;
  group.add(torso);

  // Плащ (якщо є)
  if (cfg.hasCape) {
    const capeMat = createMaterial({ name: 'Cape', hex: cfg.capeColor }, isGhost);
    const cape = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.85, 0.06), capeMat);
    cape.position.set(0, 1.65, -0.38);
    cape.rotation.x = 0.14;
    group.add(cape);
  }

  // 3. Руки та кисті
  const armMat = createMaterial({ name: 'Arm', hex: cfg.torsoColor }, isGhost);
  const armGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.0, 12);
  const handGeo = new THREE.TorusGeometry(0.16, 0.06, 8, 14, Math.PI * 1.45);

  [-0.84, 0.84].forEach((sideX, idx) => {
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(sideX, 2.05, 0.08);
    arm.rotation.z = idx === 0 ? 0.16 : -0.16;
    arm.rotation.x = -0.22;
    group.add(arm);

    const hand = new THREE.Mesh(handGeo, headMat);
    hand.position.set(sideX * 1.06, 1.54, 0.2);
    hand.rotation.x = Math.PI / 2;
    group.add(hand);
  });

  // 4. Аксесуар у правій руці
  if (cfg.accessory && cfg.accessory !== 'none') {
    const accGroup = new THREE.Group();
    accGroup.position.set(0.92, 1.58, 0.35);

    if (cfg.accessory === 'sword' || cfg.accessory === 'katana' || cfg.accessory === 'cutlass') {
      const bladeMat = createMaterial({ name: 'Steel', hex: '#C0C5CE' }, isGhost);
      const hiltMat = createMaterial({ name: 'Gold', hex: '#D4AF37' }, isGhost);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.45, 0.18), bladeMat);
      blade.position.y = 0.72;
      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.44), hiltMat);
      accGroup.add(blade, guard);
      accGroup.rotation.x = 0.55;
    } else if (cfg.accessory.startsWith('saber')) {
      const saberHex = cfg.accessory === 'saber_red' ? '#FF1E1E' : (cfg.accessory === 'saber_green' ? '#00FF55' : '#00B4FF');
      const beamMat = createMaterial({ name: 'Beam', hex: saberHex, glow: true }, isGhost);
      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 10), createMaterial({ name: 'Hilt', hex: '#5C6166' }, isGhost));
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 12), beamMat);
      beam.position.y = 0.85;
      accGroup.add(hilt, beam);
      accGroup.rotation.x = 0.5;
    } else if (cfg.accessory === 'staff') {
      const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.5, 10), createMaterial({ name: 'Wood', hex: '#6B3E26' }, isGhost));
      staff.position.y = 0.4;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), createMaterial({ name: 'Orb', hex: '#36AEBF', glow: true }, isGhost));
      orb.position.y = 1.72;
      accGroup.add(staff, orb);
    } else if (cfg.accessory === 'blaster' || cfg.accessory === 'wrench') {
      const toolMat = createMaterial({ name: 'Tool', hex: '#27272A' }, isGhost);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.65), toolMat);
      body.position.set(0, 0.1, 0.2);
      accGroup.add(body);
    } else if (cfg.accessory === 'shield') {
      const shield = new THREE.Mesh(
        new THREE.CylinderGeometry(0.68, 0.68, 0.12, 18),
        createMaterial({ name: 'Shield', hex: '#D4AF37' }, isGhost)
      );
      shield.rotation.x = Math.PI / 2;
      shield.position.set(-1.82, 0.25, 0.15);
      accGroup.add(shield);
    }
    group.add(accGroup);
  }

  // 5. Голова
  const faceMat = new THREE.MeshPhysicalMaterial({
    map: createFaceTexture(cfg),
    roughness: 0.24,
    clearcoat: 0.3,
    transparent: isGhost,
    opacity: isGhost ? 0.6 : 1
  });
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.72, 24), faceMat);
  head.position.y = 3.04;
  head.rotation.y = -Math.PI / 2;
  group.add(head);

  // 6. Головний убір / Шолом
  const ht = cfg.hatType;
  if (ht === 'builder' || ht === 'cap') {
    const hMat = createMaterial({ name: 'Hat', hex: ht === 'builder' ? '#FFD500' : '#006CB7' }, isGhost);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.47, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hMat);
    dome.position.y = 3.26;
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.07, 18), hMat);
    brim.position.set(0, 3.28, 0.08);
    group.add(dome, brim);
  } else if (ht === 'knight' || ht === 'samurai') {
    const steelMat = createMaterial({ name: 'Steel', hex: ht === 'samurai' ? '#E3000B' : '#A3A8AD' }, isGhost);
    const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.82, 18), steelMat);
    helm.position.y = 3.12;
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.6), createMaterial({ name: 'Gold', hex: '#FFD500' }, isGhost));
    crest.position.y = 3.62;
    group.add(helm, crest);
  } else if (ht === 'astro') {
    const spaceMat = createMaterial({ name: 'Space', hex: cfg.torsoColor }, isGhost);
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.54, 20, 16), spaceMat);
    helm.position.y = 3.08;
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 16, 12, -0.7, 1.4, 0.9, 1.1),
      createMaterial({ name: 'Gold', hex: '#D4AF37' }, isGhost)
    );
    visor.position.y = 3.08;
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.35), spaceMat);
    pack.position.set(0, 2.08, -0.46);
    group.add(helm, visor, pack);
  } else if (ht === 'ninja') {
    const hoodMat = createMaterial({ name: 'Hood', hex: cfg.torsoColor }, isGhost);
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.47, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hoodMat);
    hood.position.y = 3.25;
    group.add(hood);
  } else if (ht === 'crown') {
    const crownMat = createMaterial({ name: 'Crown', hex: '#FFD500' }, isGhost);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.44, 0.32, 8), crownMat);
    crown.position.y = 3.5;
    group.add(crown);
  } else if (ht === 'wizard') {
    const wizMat = createMaterial({ name: 'Wizard', hex: '#7A288A' }, isGhost);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.07, 18), wizMat);
    brim.position.y = 3.36;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.95, 18), wizMat);
    cone.position.y = 3.84;
    group.add(brim, cone);
  } else if (ht === 'pirate' || ht === 'cowboy' || ht === 'tophat') {
    const hatMat = createMaterial({ name: 'Hat', hex: ht === 'cowboy' ? '#6B3E26' : '#1B1D21' }, isGhost);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 18), hatMat);
    brim.position.y = 3.38;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.45, 18), hatMat);
    top.position.y = 3.62;
    group.add(brim, top);
  } else if (ht === 'viking') {
    const vMat = createMaterial({ name: 'Viking', hex: '#5C6166' }, isGhost);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.47, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), vMat);
    dome.position.y = 3.26;
    const hornMat = createMaterial({ name: 'Horn', hex: '#F4F4F4' }, isGhost);
    [-0.52, 0.52].forEach((hx, idx) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.48, 10), hornMat);
      horn.position.set(hx, 3.55, 0);
      horn.rotation.z = idx === 0 ? 0.65 : -0.65;
      group.add(horn);
    });
    group.add(dome);
  } else if (ht === 'cyber' || ht === 'visor') {
    const cMat = createMaterial({ name: 'Cyber', hex: '#1B1D21' }, isGhost);
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.49, 18, 14), cMat);
    helm.position.y = 3.16;
    group.add(helm);
  } else {
    const hairMat = createMaterial({ name: 'Hair', hex: '#4A2E1B' }, isGhost);
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
    hair.position.y = 3.24;
    group.add(hair);
  }

  // Верхній шип на голові
  const topStud = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 16), headMat);
  topStud.position.y = hTotal + 0.08;
  group.add(topStud);

  group.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = !isGhost;
      obj.receiveShadow = !isGhost;
    }
  });
  return group;
}

function createPartMesh(part, colorObj, isGhost = false) {
  if (part.shape === 'minifig') {
    return createMinifigMesh(part, colorObj, isGhost);
  }

  const group = new THREE.Group();
  const mat = createMaterial(colorObj, isGhost);
  const w = part.w * STUD_SIZE;
  const d = part.d * STUD_SIZE;
  const h = part.hPlates * PLATE_HEIGHT;
  const gap = 0.02;

  if (part.shape === 'brick' || part.shape === 'plate' || part.shape === 'tile') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, d - gap), mat);
    body.position.y = h / 2;
    group.add(body);
    if (part.shape !== 'tile') {
      addStudsToGroup(group, part.w, part.d, h, mat);
    }
  } else if (part.shape === 'cylinder') {
    const r = (w - gap) / 2;
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), mat);
    cyl.position.y = h / 2;
    group.add(cyl);
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'cone') {
    const rBot = (w - gap) / 2;
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.35, rBot, h, 24), mat);
    cone.position.y = h / 2;
    group.add(cone);
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.18, 16), mat);
    stud.position.y = h + 0.09;
    group.add(stud);
  } else if (part.shape === 'slope') {
    const shape2D = new THREE.Shape();
    shape2D.moveTo(-d / 2, 0);
    shape2D.lineTo(d / 2, 0);
    shape2D.lineTo(d / 2, 0.25);
    shape2D.lineTo(-d / 2 + 1.0, h);
    shape2D.lineTo(-d / 2, h);
    shape2D.closePath();

    const extrudeGeo = new THREE.ExtrudeGeometry(shape2D, { depth: w - gap, bevelEnabled: false });
    extrudeGeo.rotateY(Math.PI / 2);
    extrudeGeo.translate(-(w - gap) / 2, 0, 0);
    group.add(new THREE.Mesh(extrudeGeo, mat));
    addStudsToGroup(group, part.w, part.d, h, mat, (ix, iz) => iz > 0);
  } else if (part.shape === 'roof') {
    const shape2D = new THREE.Shape();
    shape2D.moveTo(-d / 2, 0);
    shape2D.lineTo(d / 2, 0);
    shape2D.lineTo(d / 2, 0.22);
    shape2D.lineTo(0, h);
    shape2D.lineTo(-d / 2, 0.22);
    shape2D.closePath();

    const extrudeGeo = new THREE.ExtrudeGeometry(shape2D, { depth: w - gap, bevelEnabled: false });
    extrudeGeo.rotateY(Math.PI / 2);
    extrudeGeo.translate(-(w - gap) / 2, 0, 0);
    group.add(new THREE.Mesh(extrudeGeo, mat));
  } else if (part.shape === 'arch') {
    const pillarD = 0.85;
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, pillarD), mat);
    p1.position.set(0, h / 2, -d / 2 + pillarD / 2);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, pillarD), mat);
    p2.position.set(0, h / 2, d / 2 - pillarD / 2);
    const top = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h * 0.36, d - gap), mat);
    top.position.set(0, h - (h * 0.36) / 2, 0);
    group.add(p1, p2, top);
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'window') {
    const frameThick = 0.24;
    const bot = new THREE.Mesh(new THREE.BoxGeometry(w - gap, frameThick, d - gap), mat);
    bot.position.y = frameThick / 2;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w - gap, frameThick, d - gap), mat);
    top.position.y = h - frameThick / 2;
    const left = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, frameThick), mat);
    left.position.set(0, h / 2, -d / 2 + frameThick / 2);
    const right = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, frameThick), mat);
    right.position.set(0, h / 2, d / 2 - frameThick / 2);

    const glassMat = createMaterial({ name: 'Glass', hex: '#9EE4FF', transparent: true, glow: true }, isGhost);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.12, h - frameThick * 1.5, d - frameThick * 1.5), glassMat);
    glass.position.y = h / 2;
    group.add(bot, top, left, right, glass);
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'door') {
    const frameThick = 0.25;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w - gap, frameThick, d - gap), mat);
    top.position.y = h - frameThick / 2;
    const left = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, frameThick), mat);
    left.position.set(0, h / 2, -d / 2 + frameThick / 2);
    const right = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, frameThick), mat);
    right.position.set(0, h / 2, d / 2 - frameThick / 2);

    const leafMat = createMaterial({ name: 'Leaf', hex: '#FFD500' }, isGhost);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.24, h - frameThick - 0.05, d - frameThick * 2 - 0.06), leafMat);
    leaf.position.set(0.35, (h - frameThick) / 2, 0.2);
    leaf.rotation.y = 0.45;

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), mat);
    knob.position.set(0.55, h * 0.45, 0.55);
    group.add(top, left, right, leaf, knob);
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'wheel') {
    const axle = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, h * 0.45, d - 0.1), mat);
    axle.position.y = h * 0.5;
    group.add(axle);

    const tireMat = createMaterial({ name: 'Rubber', hex: '#18181B' }, isGhost);
    const rimMat = createMaterial({ name: 'Rim', hex: '#C0C5CE' }, isGhost);
    [-w / 2 + 0.1, w / 2 - 0.1].forEach(wx => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.42, 20), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wx, 0.58, 0);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.44, 16), rimMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, 0.58, 0);
      group.add(tire, rim);
    });
    addStudsToGroup(group, part.w, part.d, h * 0.72, mat);
  } else if (part.shape === 'fence') {
    const bot = new THREE.Mesh(new THREE.BoxGeometry(w - gap, 0.25, d - gap), mat);
    bot.position.y = 0.125;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w - gap, 0.25, d - gap), mat);
    top.position.y = h - 0.125;
    group.add(bot, top);
    for (let i = -d / 2 + 0.3; i <= d / 2 - 0.3; i += 0.65) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, h, 10), mat);
      bar.position.set(0, h / 2, i);
      group.add(bar);
    }
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'tree') {
    const trunkMat = createMaterial({ name: 'Brown', hex: '#6B3E26' }, isGhost);
    const leafMat = createMaterial({ name: 'Green', hex: '#008C3A' }, isGhost);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.1, 14), trunkMat);
    trunk.position.y = 0.55;
    group.add(trunk);
    [
      { r: 1.35, y: 1.55, ch: 1.1 },
      { r: 1.05, y: 2.35, ch: 1.0 },
      { r: 0.72, y: 3.05, ch: 0.9 }
    ].forEach(tier => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.ch, 16), leafMat);
      cone.position.y = tier.y;
      group.add(cone);
    });
  } else if (part.shape === 'flag') {
    const poleMat = createMaterial({ name: 'Gray', hex: '#A3A8AD' }, isGhost);
    const base = new THREE.Mesh(new THREE.BoxGeometry(w - gap, 0.4, d - gap), poleMat);
    base.position.y = 0.2;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, h, 12), poleMat);
    pole.position.set(0, h / 2, -0.5);
    const banner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 1.3), mat);
    banner.position.set(0, h - 0.55, 0.15);
    group.add(base, pole, banner);
  }

  group.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = !isGhost;
      obj.receiveShadow = !isGhost;
    }
  });
  return group;
}

// ==========================================
// 5. ГОЛОВНИЙ КЛАС 3D-ГРИ
// ==========================================
class DenysLegoGame {
  constructor() {
    this.gridSize = 24;
    this.selectedPart = PARTS_CATALOG[8]; // Кубик 2x4
    this.selectedColor = LEGO_COLORS[0];
    this.currentRotation = 0;
    this.toolMode = 'build';
    this.activeCategory = 'bricks';
    this.activeMfFilter = 'all';

    this.placedBricks = [];
    this.animations = [];
    this.particles = [];

    this.isExploded = false;
    this.explodeProgress = 0;
    this.lightingMode = 0; // 0: День, 1: Захід, 2: Ніч
    this.autoOrbit = false;
    this.cameraTween = null;

    this.initScene();
    this.buildBaseplate(this.gridSize);
    this.initUI();
    this.createGhostMesh();
    this.animate();
  }

  initScene() {
    const canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#7EC8E3');
    this.scene.fog = new THREE.Fog('#7EC8E3', 65, 180);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 350);
    this.camera.position.set(18, 18, 22);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 115;

    // Підтримка 360° обертання мишею і одним/двома пальцями на телефоні
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.PAN
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    this.hemiLight = new THREE.HemisphereLight('#ffffff', '#3d5a3c', 0.9);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight('#fff8eb', 1.4);
    this.dirLight.position.set(28, 45, 24);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 5;
    this.dirLight.shadow.camera.far = 140;
    const d = 42;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    // Підлога студії
    const table = new THREE.Mesh(
      new THREE.PlaneGeometry(360, 360),
      new THREE.MeshStandardMaterial({ color: '#3B526E', roughness: 0.85 })
    );
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.32;
    table.receiveShadow = true;
    this.scene.add(table);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.bricksGroup = new THREE.Group();
    this.scene.add(this.bricksGroup);
  }

  buildBaseplate(size) {
    this.gridSize = size;
    if (this.baseplateGroup) {
      this.scene.remove(this.baseplateGroup);
    }
    this.baseplateGroup = new THREE.Group();

    const plateMat = new THREE.MeshPhysicalMaterial({
      color: '#008C3A',
      roughness: 0.3,
      clearcoat: 0.25
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(size, 0.3, size), plateMat);
    base.position.y = -0.15;
    base.receiveShadow = true;
    base.name = 'baseplate';
    this.baseplateGroup.add(base);

    // InstancedMesh для ідеальної швидкості навіть на 64x64 (4096 шипів!)
    const studGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.16, 10);
    const totalStuds = size * size;
    const instancedStuds = new THREE.InstancedMesh(studGeo, plateMat, totalStuds);
    instancedStuds.receiveShadow = true;

    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let x = -size / 2 + 0.5; x < size / 2; x += 1) {
      for (let z = -size / 2 + 0.5; z < size / 2; z += 1) {
        dummy.position.set(x, 0.08, z);
        dummy.updateMatrix();
        instancedStuds.setMatrixAt(idx++, dummy.matrix);
      }
    }
    this.baseplateGroup.add(instancedStuds);

    const gridHelper = new THREE.GridHelper(size, size, '#004d20', '#006e2e');
    gridHelper.position.y = 0.005;
    this.baseplateGroup.add(gridHelper);

    this.scene.add(this.baseplateGroup);
    this.baseHitMesh = base;

    // Підлаштовуємо дистанцію камери під розмір пластини
    const dist = size * 0.92;
    this.controls.maxDistance = size * 2.1;
    this.setCameraView('iso', dist);
  }

  setCameraView(view, customDist = null) {
    this.autoOrbit = false;
    document.getElementById('btn-auto-orbit')?.classList.remove('active');

    const d = customDist || Math.max(16, this.gridSize * 0.88);
    const h = d * 0.65;
    const targets = {
      front: new THREE.Vector3(0, h * 0.6, d),
      back: new THREE.Vector3(0, h * 0.6, -d),
      left: new THREE.Vector3(-d, h * 0.6, 0),
      right: new THREE.Vector3(d, h * 0.6, 0),
      top: new THREE.Vector3(0.01, d * 1.25, 0.01),
      iso: new THREE.Vector3(d * 0.78, h, d * 0.85)
    };

    const dest = targets[view] || targets.iso;
    this.cameraTween = {
      startPos: this.camera.position.clone(),
      endPos: dest,
      progress: 0
    };
  }

  cycleLighting() {
    this.lightingMode = (this.lightingMode + 1) % 3;
    const btn = document.getElementById('btn-lighting');

    if (this.lightingMode === 0) {
      this.scene.background.set('#7EC8E3');
      this.scene.fog.color.set('#7EC8E3');
      this.hemiLight.intensity = 0.9;
      this.dirLight.color.set('#fff8eb');
      this.dirLight.intensity = 1.4;
      btn.innerHTML = '☀️ <span class="btn-txt">День</span>';
    } else if (this.lightingMode === 1) {
      this.scene.background.set('#F59E0B');
      this.scene.fog.color.set('#D97706');
      this.hemiLight.intensity = 0.65;
      this.dirLight.color.set('#FF7E47');
      this.dirLight.intensity = 1.65;
      btn.innerHTML = '🌅 <span class="btn-txt">Захід</span>';
    } else {
      this.scene.background.set('#090D1A');
      this.scene.fog.color.set('#090D1A');
      this.hemiLight.intensity = 0.35;
      this.dirLight.color.set('#6366F1');
      this.dirLight.intensity = 0.65;
      btn.innerHTML = '🌙 <span class="btn-txt">Ніч</span>';
    }

    // Підсилюємо неонове світіння вікон та світлових мечів вночі
    const glowStrength = this.lightingMode === 2 ? 1.5 : 0.45;
    this.bricksGroup.traverse(obj => {
      if (obj.isMesh && obj.material && obj.material.userData?.isGlow) {
        obj.material.emissiveIntensity = glowStrength;
      }
    });
  }

  createGhostMesh() {
    if (this.ghostMesh) {
      this.scene.remove(this.ghostMesh);
    }
    this.ghostMesh = createPartMesh(this.selectedPart, this.selectedColor, true);
    this.ghostMesh.rotation.y = (this.currentRotation * Math.PI) / 2;
    this.ghostMesh.visible = this.toolMode === 'build';
    this.scene.add(this.ghostMesh);
  }

  getEffectiveDims(part, rot) {
    return rot % 2 === 0 ? { w: part.w, d: part.d } : { w: part.d, d: part.w };
  }

  snapCoordinates(rawX, rawZ, part, rot) {
    const { w, d } = this.getEffectiveDims(part, rot);
    const half = this.gridSize / 2;

    const snapAxis = (val, dim) => {
      const snapped = dim % 2 === 1 ? Math.floor(val) + 0.5 : Math.round(val);
      const minC = -half + dim / 2;
      const maxC = half - dim / 2;
      return Math.max(minC, Math.min(maxC, snapped));
    };

    const x = snapAxis(rawX, w);
    const z = snapAxis(rawZ, d);
    const y = this.computeStackHeight(x, z, w, d);
    return { x, y, z };
  }

  computeStackHeight(cx, cz, w, d) {
    const minX = cx - w / 2 + 0.05;
    const maxX = cx + w / 2 - 0.05;
    const minZ = cz - d / 2 + 0.05;
    const maxZ = cz + d / 2 - 0.05;

    let highestY = 0;
    for (const b of this.placedBricks) {
      const dims = this.getEffectiveDims(b.part, b.rot);
      const bMinX = b.x - dims.w / 2;
      const bMaxX = b.x + dims.w / 2;
      const bMinZ = b.z - dims.d / 2;
      const bMaxZ = b.z + dims.d / 2;

      if (minX < bMaxX && maxX > bMinX && minZ < bMaxZ && maxZ > bMinZ) {
        const topY = b.y + b.part.hPlates * PLATE_HEIGHT;
        if (topY > highestY) highestY = topY;
      }
    }
    return Number(highestY.toFixed(2));
  }

  placeBrick(part, color, x, y, z, rot, animateDrop = true) {
    const mesh = createPartMesh(part, color, false);
    mesh.position.set(x, y, z);
    mesh.rotation.y = (rot * Math.PI) / 2;
    this.bricksGroup.add(mesh);

    const record = {
      id: crypto.randomUUID(),
      part,
      color,
      x,
      y,
      z,
      rot,
      mesh
    };
    mesh.userData.brickRecord = record;
    this.placedBricks.push(record);
    this.updateCounter();

    if (animateDrop) {
      audio.playSnap(0.92 + Math.random() * 0.24);
      this.animations.push({
        type: 'drop',
        mesh,
        targetY: y,
        startY: y + 2.2,
        progress: 0
      });
      this.spawnParticles(x, y + 0.2, z, color.hex);
    }
    return record;
  }

  removeBrick(record) {
    const idx = this.placedBricks.indexOf(record);
    if (idx === -1) return;
    this.placedBricks.splice(idx, 1);
    this.updateCounter();
    audio.playRemove();

    this.animations.push({
      type: 'remove',
      mesh: record.mesh,
      startY: record.mesh.position.y,
      progress: 0
    });
  }

  spawnParticles(x, y, z, hex) {
    const geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const mat = new THREE.MeshBasicMaterial({ color: hex });
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.position.set(x, y, z);
      const angle = (Math.PI * 2 * i) / 8;
      this.scene.add(p);
      this.particles.push({
        mesh: p,
        vx: Math.cos(angle) * 0.08,
        vy: 0.12 + Math.random() * 0.08,
        vz: Math.sin(angle) * 0.08,
        life: 1.0
      });
    }
  }

  clearAll(silent = false) {
    while (this.bricksGroup.children.length > 0) {
      this.bricksGroup.remove(this.bricksGroup.children[0]);
    }
    this.placedBricks = [];
    this.isExploded = false;
    this.explodeProgress = 0;
    this.updateCounter();
    if (!silent) this.showToast('Робоче поле очищено!');
  }

  // ==========================================
  // 6. ГОТОВІ МАКЕТИ (ВКЛЮЧНО З МЕГА-МІСТОМ 64×64)
  // ==========================================
  buildBlueprint(type) {
    if (type === 'megacity' && this.gridSize < 64) {
      this.buildBaseplate(64);
      document.querySelectorAll('.size-btn').forEach(b => {
        b.classList.toggle('active', Number(b.dataset.size) === 64);
      });
    }

    this.clearAll(true);
    const cRed = LEGO_COLORS[0];
    const cBlue = LEGO_COLORS[1];
    const cYellow = LEGO_COLORS[2];
    const cGreen = LEGO_COLORS[3];
    const cOrange = LEGO_COLORS[5];
    const cWhite = LEGO_COLORS[6];
    const cBlack = LEGO_COLORS[7];
    const cGray = LEGO_COLORS[8];
    const cDarkGray = LEGO_COLORS[9];
    const cBrown = LEGO_COLORS[11];
    const cGold = LEGO_COLORS[16];
    const byId = id => PARTS_CATALOG.find(p => p.id === id);

    const queue = [];
    const add = (partId, color, x, z, rot = 0) => {
      const part = byId(partId);
      if (part) queue.push({ part, color, x, z, rot });
    };

    if (type === 'house') {
      add('b_2x4', cWhite, -2, -2, 1);
      add('b_2x4', cWhite, 2, -2, 1);
      add('b_2x4', cWhite, -2, 2, 1);
      add('b_2x4', cWhite, 2, 2, 1);
      add('d_door', cBrown, 0, 2.5, 1);
      add('d_win', cWhite, -2.5, 0, 0);
      add('d_win', cWhite, 2.5, 0, 0);
      add('b_2x4', cYellow, -2, -2, 1);
      add('b_2x4', cYellow, 2, -2, 1);
      add('b_2x4', cYellow, -2, 2, 1);
      add('b_2x4', cYellow, 2, 2, 1);
      add('r_2x4', cRed, -1, -1.5, 0);
      add('r_2x4', cRed, 1, -1.5, 0);
      add('r_2x4', cRed, -1, 1.5, 0);
      add('r_2x4', cRed, 1, 1.5, 0);
      add('dec_tree', cGreen, -5, 3, 0);
      add('mf_001', cRed, 0, 5, 0);
    } else if (type === 'car') {
      add('d_wheel', cBlack, 0, -2, 0);
      add('d_wheel', cBlack, 0, 2, 0);
      add('p_2x4', cRed, 0, -1, 0);
      add('p_2x4', cRed, 0, 2, 0);
      add('b_2x2', cRed, 0, 0, 0);
      add('s_2x2', cYellow, 0, -2, 2);
      add('s_2x2', cWhite, 0, 1, 0);
      add('t_2x2', cBlack, 0, 3, 0);
      add('mf_007', cRed, 3, 0, 0);
    } else if (type === 'castle') {
      [-3, 3].forEach(x => {
        [-3, 3].forEach(z => {
          add('b_2x2', cGray, x, z, 0);
          add('b_2x2', cDarkGray, x, z, 0);
          add('b_2x2', cGray, x, z, 0);
          add('b_1x1', cDarkGray, x - 0.5, z - 0.5, 0);
          add('b_1x1', cDarkGray, x + 0.5, z + 0.5, 0);
        });
      });
      add('a_1x4', cGray, 0, 3.5, 1);
      add('a_1x4', cGray, 0, -3.5, 1);
      add('dec_flag', cRed, 3, 3, 0);
      add('mf_047', cGray, 0, 0, 0);
    } else if (type === 'rocket') {
      add('b_cyl2', cWhite, 0, 0, 0);
      add('b_cyl2', cRed, 0, 0, 0);
      add('b_cyl2', cWhite, 0, 0, 0);
      add('b_cone', cRed, 0, 0, 0);
      add('s_1x2', cBlue, -1.5, 0, 3);
      add('s_1x2', cBlue, 1.5, 0, 1);
      add('s_1x2', cBlue, 0, -1.5, 0);
      add('s_1x2', cBlue, 0, 1.5, 2);
      add('mf_023', cWhite, 3.5, 2, 0);
    } else if (type === 'megacity') {
      // Головна автострада 64x64
      for (let z = -28; z <= 28; z += 4) {
        add('t_2x4', cDarkGray, -1, z, 0);
        add('t_2x4', cDarkGray, 1, z, 0);
      }
      // Хмарочос №1 (Ліворуч)
      for (let floor = 0; floor < 6; floor++) {
        add('b_2x4', cBlue, -14, -14, 0);
        add('d_win4', cWhite, -12, -14, 0);
        add('b_2x4', cBlue, -14, -10, 0);
      }
      add('r_2x4', cGold, -13, -12, 0);

      // Хмарочос №2 (Праворуч)
      for (let floor = 0; floor < 5; floor++) {
        add('b_2x4', cRed, 14, -12, 0);
        add('d_win4', cYellow, 12, -12, 0);
      }
      add('dec_flag', cYellow, 14, -12, 0);

      // Поліцейська дільниця та пожежна
      add('b_2x6', cWhite, -14, 12, 0);
      add('d_door', cBlue, -12, 12.5, 0);
      add('b_2x6', cOrange, 14, 12, 0);
      add('d_door', cRed, 12, 12.5, 0);

      // Спорткари на дорозі
      add('d_wheel', cBlack, 0, -10, 0);
      add('d_wheel', cBlack, 0, -6, 0);
      add('p_2x4', cYellow, 0, -8, 0);
      add('s_2x2', cRed, 0, -9, 2);

      // Парк з деревами
      [[-22, -4], [-22, 4], [22, -4], [22, 4], [-8, 22], [8, 22]].forEach(([tx, tz]) => {
        add('dec_tree', cGreen, tx, tz, 0);
      });

      // Натовп з 12 різних фігурок у місті!
      const crowd = [
        ['mf_001', -6, -8], ['mf_002', -8, 12], ['mf_003', 8, 12],
        ['mf_023', -5, 4], ['mf_045', 6, -4], ['mf_067', -4, 16],
        ['mf_089', 5, 16], ['mf_111', 6, 4], ['mf_005', -18, 0],
        ['mf_028', 18, 0], ['mf_050', 0, 20], ['mf_120', 0, -20]
      ];
      crowd.forEach(([id, mx, mz]) => add(id, cRed, mx, mz, 0));
    }

    const delay = type === 'megacity' ? 35 : 130;
    queue.forEach((item, index) => {
      setTimeout(() => {
        const dims = this.getEffectiveDims(item.part, item.rot);
        const y = this.computeStackHeight(item.x, item.z, dims.w, dims.d);
        this.placeBrick(item.part, item.color, item.x, y, item.z, item.rot, true);
      }, index * delay);
    });
    this.showToast(type === 'megacity' ? 'Будуємо Мега-Місто 64×64!' : 'Збираємо 3D-макет...');
  }

  loadLDrawModel(urlOrText, isText = false) {
    this.clearAll(true);
    this.showToast('Завантаження з відкритої бази LDraw...');
    const loader = new LDrawLoader();
    loader.setPartsLibraryPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/ldraw/officialLibrary/');

    const onLoaded = group => {
      group.rotation.x = Math.PI;
      const box = new THREE.Box3().setFromObject(group);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 12 / maxDim;
      group.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      scaledBox.getCenter(center);
      group.position.set(-center.x, -scaledBox.min.y, -center.z);

      group.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.bricksGroup.add(group);
      this.showToast('Модель LDraw успішно завантажена!');
    };

    if (isText) {
      loader.parse(urlOrText, onLoaded);
    } else {
      loader.load(urlOrText, onLoaded, undefined, () => {
        this.showToast('Помилка мережі. Завантаж локальний .LDR файл!');
      });
    }
  }

  // ==========================================
  // 7. ІНТЕРФЕЙС, МОБІЛЬНЕ КЕРУВАННЯ ТА ПОДІЇ
  // ==========================================
  initUI() {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.buildBaseplate(Number(btn.dataset.size));
        this.showToast(`Пластина ${btn.dataset.size}×${btn.dataset.size} готова!`);
      });
    });

    const hideMenu = () => {
      document.getElementById('main-menu').classList.add('hidden');
      document.getElementById('hud').classList.remove('hidden');
    };

    document.getElementById('btn-start-sandbox').addEventListener('click', () => {
      hideMenu();
      this.showToast('Тягни для огляду 360°, клік/тап — поставити блок!');
    });

    document.getElementById('btn-open-blueprints').addEventListener('click', () => {
      document.getElementById('blueprints-panel').classList.toggle('hidden');
      document.getElementById('ldraw-panel').classList.add('hidden');
    });

    document.getElementById('btn-open-ldraw').addEventListener('click', () => {
      document.getElementById('ldraw-panel').classList.toggle('hidden');
      document.getElementById('blueprints-panel').classList.add('hidden');
    });

    document.querySelectorAll('.bp-card').forEach(btn => {
      btn.addEventListener('click', () => {
        hideMenu();
        this.buildBlueprint(btn.dataset.bp);
      });
    });

    document.querySelectorAll('.ldraw-remote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        hideMenu();
        this.loadLDrawModel(btn.dataset.url, false);
      });
    });

    document.getElementById('ldraw-file-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        hideMenu();
        this.loadLDrawModel(ev.target.result, true);
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      document.getElementById('main-menu').classList.remove('hidden');
      document.getElementById('hud').classList.add('hidden');
    });

    // 360° Камера-гізмо (ракурси з усіх сторін)
    document.querySelectorAll('.cam-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setCameraView(btn.dataset.view));
    });

    const orbitBtn = document.getElementById('btn-auto-orbit');
    orbitBtn.addEventListener('click', () => {
      this.autoOrbit = !this.autoOrbit;
      orbitBtn.classList.toggle('active', this.autoOrbit);
      this.showToast(this.autoOrbit ? 'Увімкнено 360° обліт споруди' : 'Обліт зупинено');
    });

    // Палітра кольорів
    const paletteEl = document.getElementById('color-palette');
    LEGO_COLORS.forEach((col, i) => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (i === 0 ? ' active' : '');
      sw.style.backgroundColor = col.hex;
      sw.title = col.name;
      sw.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        this.selectedColor = col;
        this.createGhostMesh();
        this.renderBannerItems();
      });
      paletteEl.appendChild(sw);
    });

    // Категорії банера
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.cat;

        const mfSub = document.getElementById('minifig-subtabs');
        mfSub.classList.toggle('hidden', this.activeCategory !== 'minifigs');

        this.renderBannerItems();
      });
    });

    // Підфільтри 132 мініфігурок
    document.querySelectorAll('.mf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mf-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeMfFilter = btn.dataset.mf;
        this.renderBannerItems();
      });
    });

    document.getElementById('part-search').addEventListener('input', () => this.renderBannerItems());

    const spawnCenterAction = () => {
      const { x, y, z } = this.snapCoordinates(0, 0, this.selectedPart, this.currentRotation);
      this.placeBrick(this.selectedPart, this.selectedColor, x, y, z, this.currentRotation, true);
    };
    document.getElementById('btn-spawn-center').addEventListener('click', spawnCenterAction);

    // Мобільні кнопки швидкої дії
    document.getElementById('mob-place').addEventListener('click', () => {
      if (this.ghostMesh && this.ghostMesh.visible) {
        const { x, y, z } = this.ghostMesh.position;
        this.placeBrick(this.selectedPart, this.selectedColor, x, y, z, this.currentRotation, true);
      } else {
        spawnCenterAction();
      }
    });

    const toggleBannerBtn = document.getElementById('mob-toggle-banner');
    toggleBannerBtn.addEventListener('click', () => {
      const banner = document.getElementById('parts-banner');
      const dock = document.querySelector('.mobile-action-dock');
      const collapsed = banner.classList.toggle('collapsed');
      dock.classList.toggle('banner-closed', collapsed);
      toggleBannerBtn.textContent = collapsed ? '🔼 Деталі' : '🔽 Сховати';
    });

    // Інструменти
    const setTool = mode => {
      this.toolMode = mode;
      document.querySelectorAll('#tool-build, #tool-paint, #tool-delete').forEach(b => b.classList.remove('active'));
      document.getElementById(`tool-${mode}`).classList.add('active');
      if (this.ghostMesh) this.ghostMesh.visible = mode === 'build';
    };

    document.getElementById('tool-build').addEventListener('click', () => setTool('build'));
    document.getElementById('tool-paint').addEventListener('click', () => setTool('paint'));
    document.getElementById('tool-delete').addEventListener('click', () => setTool('delete'));

    const rotateAction = () => {
      this.currentRotation = (this.currentRotation + 1) % 4;
      if (this.ghostMesh) {
        this.ghostMesh.rotation.y = (this.currentRotation * Math.PI) / 2;
      }
    };
    document.getElementById('btn-rotate').addEventListener('click', rotateAction);
    document.getElementById('mob-rotate').addEventListener('click', rotateAction);

    const undoAction = () => {
      if (this.placedBricks.length === 0) return;
      this.removeBrick(this.placedBricks[this.placedBricks.length - 1]);
    };
    document.getElementById('btn-undo').addEventListener('click', undoAction);

    // Вибух-схема
    const explodeBtn = document.getElementById('btn-explode');
    explodeBtn.addEventListener('click', () => {
      if (this.placedBricks.length === 0) return;
      this.isExploded = !this.isExploded;
      explodeBtn.classList.toggle('active', this.isExploded);
      audio.playSnap(this.isExploded ? 1.3 : 0.8);
      this.showToast(this.isExploded ? 'Вибух-схема: огляд внутрішніх шарів!' : 'Деталі зібрано назад!');
    });

    // Освітлення (День / Захід / Ніч)
    document.getElementById('btn-lighting').addEventListener('click', () => this.cycleLighting());

    // Фото-студія (скріншот PNG)
    document.getElementById('btn-photo').addEventListener('click', () => {
      if (this.ghostMesh) this.ghostMesh.visible = false;
      this.renderer.render(this.scene, this.camera);
      const link = document.createElement('a');
      link.download = 'DENYS-HANDZIUK-LEGO-PHOTO.png';
      link.href = this.renderer.domElement.toDataURL('image/png');
      link.click();
      if (this.ghostMesh && this.toolMode === 'build') this.ghostMesh.visible = true;
      this.showToast('📸 Студійне фото моделі збережено!');
    });

    document.getElementById('btn-clear').addEventListener('click', () => this.clearAll());

    // Збереження / Відкриття JSON
    document.getElementById('btn-save').addEventListener('click', () => {
      const data = this.placedBricks.map(b => ({
        partId: b.part.id,
        colorHex: b.color.hex,
        x: b.x,
        y: b.y,
        z: b.z,
        rot: b.rot
      }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'denys-handziuk-lego.json';
      a.click();
      this.showToast('Модель збережено!');
    });

    document.getElementById('json-load-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const items = JSON.parse(ev.target.result);
        this.clearAll(true);
        items.forEach(it => {
          const part = PARTS_CATALOG.find(p => p.id === it.partId) || PARTS_CATALOG[0];
          const color = LEGO_COLORS.find(c => c.hex === it.colorHex) || { name: 'Custom', hex: it.colorHex };
          this.placeBrick(part, color, it.x, it.y, it.z, it.rot, false);
        });
        this.showToast('Збережену споруду завантажено!');
      };
      reader.readAsText(file);
    });

    window.addEventListener('keydown', e => {
      if (e.code === 'KeyR') rotateAction();
      if (e.ctrlKey && e.code === 'KeyZ') undoAction();
    });

    // Розумна обробка миші та сенсорного екрану (відрізняє клік/тап від обертання 360°)
    const canvas = this.renderer.domElement;
    let downX = 0;
    let downY = 0;
    let downTime = 0;

    canvas.addEventListener('pointermove', e => this.updateGhostFromPointer(e));

    canvas.addEventListener('pointerdown', e => {
      downX = e.clientX;
      downY = e.clientY;
      downTime = performance.now();
      this.updateGhostFromPointer(e);
    });

    canvas.addEventListener('pointerup', e => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      const elapsed = performance.now() - downTime;

      // Якщо це короткий клік/тап без перетягування камери:
      if (dist < 10 && elapsed < 350) {
        this.handleCanvasTap(e);
      }
    });

    canvas.addEventListener('contextmenu', e => e.preventDefault());

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderBannerItems();
  }

  getMinifigCardSVG(part) {
    const cfg = part.mfConfig;
    return `
      <svg width="46" height="42" viewBox="0 0 46 42">
        <rect x="13" y="29" width="8" height="11" rx="1.5" fill="${cfg.legColor}" stroke="#fff" stroke-width="0.8"/>
        <rect x="25" y="29" width="8" height="11" rx="1.5" fill="${cfg.legColor}" stroke="#fff" stroke-width="0.8"/>
        <rect x="11" y="15" width="24" height="14" rx="2.5" fill="${cfg.torsoColor}" stroke="#fff" stroke-width="0.9"/>
        <rect x="16" y="5" width="14" height="10" rx="3" fill="${cfg.headColor}" stroke="#111" stroke-width="0.8"/>
        <circle cx="20" cy="9" r="1.2" fill="#111"/>
        <circle cx="26" cy="9" r="1.2" fill="#111"/>
        <rect x="14" y="2" width="18" height="4" rx="1.5" fill="${cfg.torsoColor}"/>
      </svg>
    `;
  }

  renderBannerItems() {
    const container = document.getElementById('banner-items');
    const query = document.getElementById('part-search').value.trim().toLowerCase();
    container.innerHTML = '';

    const filtered = PARTS_CATALOG.filter(p => {
      if (query) return p.name.toLowerCase().includes(query);
      if (this.activeCategory === 'minifigs') {
        if (p.cat !== 'minifigs') return false;
        if (this.activeMfFilter !== 'all' && p.subCat !== this.activeMfFilter) return false;
        return true;
      }
      return p.cat === this.activeCategory;
    });

    filtered.forEach(part => {
      const card = document.createElement('div');
      card.className = 'part-card' + (this.selectedPart.id === part.id ? ' active' : '');

      const iconHTML = part.shape === 'minifig'
        ? this.getMinifigCardSVG(part)
        : `<svg width="48" height="36" viewBox="0 0 48 36">
            <rect x="6" y="10" width="36" height="20" rx="3" fill="${this.selectedColor.hex}" stroke="#fff" stroke-width="1.5"/>
            <rect x="11" y="5" width="8" height="5" rx="1" fill="${this.selectedColor.hex}" stroke="#fff" stroke-width="1.2"/>
            <rect x="29" y="5" width="8" height="5" rx="1" fill="${this.selectedColor.hex}" stroke="#fff" stroke-width="1.2"/>
          </svg>`;

      card.innerHTML = `
        <div class="part-icon">${iconHTML}</div>
        <div class="part-name">${part.name}</div>
        <div class="part-dims">${part.shape === 'minifig' ? '3D Фігурка' : `${part.w}×${part.d}`}</div>
      `;

      card.addEventListener('click', () => {
        this.selectedPart = part;
        this.toolMode = 'build';
        document.querySelectorAll('#tool-build, #tool-paint, #tool-delete').forEach(b => b.classList.remove('active'));
        document.getElementById('tool-build').classList.add('active');
        this.createGhostMesh();
        this.renderBannerItems();
      });
      container.appendChild(card);
    });
  }

  getRaycastHit(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const targets = [this.baseHitMesh, ...this.bricksGroup.children];
    const hits = this.raycaster.intersectObjects(targets, true);
    return hits.length > 0 ? hits[0] : null;
  }

  findRecordFromObject(obj) {
    let curr = obj;
    while (curr) {
      if (curr.userData && curr.userData.brickRecord) return curr.userData.brickRecord;
      curr = curr.parent;
    }
    return null;
  }

  updateGhostFromPointer(e) {
    if (this.toolMode !== 'build' || !this.ghostMesh) return;
    const hit = this.getRaycastHit(e);
    if (!hit) {
      this.ghostMesh.visible = false;
      return;
    }

    this.ghostMesh.visible = true;
    const normal = hit.face
      ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
      : new THREE.Vector3(0, 1, 0);
    const offset = normal.y > 0.5 ? 0.05 : 0.48;
    const targetPoint = hit.point.clone().addScaledVector(normal, offset);

    const snapped = this.snapCoordinates(targetPoint.x, targetPoint.z, this.selectedPart, this.currentRotation);
    this.ghostMesh.position.set(snapped.x, snapped.y, snapped.z);
  }

  handleCanvasTap(e) {
    const hit = this.getRaycastHit(e);
    if (!hit) return;

    const hitRecord = this.findRecordFromObject(hit.object);

    if (e.button === 2 || (e.button === 0 && this.toolMode === 'delete')) {
      if (hitRecord) this.removeBrick(hitRecord);
      return;
    }

    if (e.button === 0 && this.toolMode === 'paint') {
      if (hitRecord) {
        const idx = this.placedBricks.indexOf(hitRecord);
        this.bricksGroup.remove(hitRecord.mesh);
        this.placedBricks.splice(idx, 1);
        this.placeBrick(hitRecord.part, this.selectedColor, hitRecord.x, hitRecord.y, hitRecord.z, hitRecord.rot, true);
      }
      return;
    }

    if (e.button === 0 && this.toolMode === 'build') {
      this.updateGhostFromPointer(e);
      if (this.ghostMesh && this.ghostMesh.visible) {
        const { x, y, z } = this.ghostMesh.position;
        this.placeBrick(this.selectedPart, this.selectedColor, x, y, z, this.currentRotation, true);
      }
    }
  }

  updateCounter() {
    document.getElementById('brick-counter').textContent = this.placedBricks.length;
  }

  showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.add('hidden'), 2300);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Плавний переліт камери при натисканні кнопок огляду
    if (this.cameraTween) {
      this.cameraTween.progress += 0.065;
      const t = Math.min(1, this.cameraTween.progress);
      const ease = 1 - Math.pow(1 - t, 3);
      this.camera.position.lerpVectors(this.cameraTween.startPos, this.cameraTween.endPos, ease);
      this.controls.target.lerp(new THREE.Vector3(0, 1.5, 0), ease);
      if (t >= 1) this.cameraTween = null;
    }

    // Автоматичний 360° обліт споруди
    if (this.autoOrbit) {
      const angle = 0.008;
      const x = this.camera.position.x;
      const z = this.camera.position.z;
      this.camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
      this.camera.position.z = z * Math.cos(angle) + x * Math.sin(angle);
    }

    this.controls.update();

    // Плавна анімація "Вибух-схеми"
    const targetExplode = this.isExploded ? 1 : 0;
    if (Math.abs(this.explodeProgress - targetExplode) > 0.005) {
      this.explodeProgress += (targetExplode - this.explodeProgress) * 0.1;
      for (const b of this.placedBricks) {
        b.mesh.position.y = b.y + b.y * 0.85 * this.explodeProgress;
      }
    }

    // Анімації встановлення та видалення блоків
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      anim.progress += 0.09;

      if (anim.type === 'drop') {
        const t = Math.min(1, anim.progress);
        const ease = 1 - Math.pow(1 - t, 3);
        anim.mesh.position.y = anim.startY + (anim.targetY - anim.startY) * ease;
        const squash = t < 0.8 ? 1 : 1 - Math.sin((t - 0.8) * Math.PI * 5) * 0.07;
        anim.mesh.scale.set(1 + (1 - squash) * 0.5, squash, 1 + (1 - squash) * 0.5);
        if (t >= 1) {
          anim.mesh.position.y = anim.targetY;
          anim.mesh.scale.set(1, 1, 1);
          this.animations.splice(i, 1);
        }
      } else if (anim.type === 'remove') {
        const t = Math.min(1, anim.progress);
        anim.mesh.position.y = anim.startY + t * 1.8;
        anim.mesh.rotation.y += 0.25;
        anim.mesh.scale.setScalar(1 - t);
        if (t >= 1) {
          this.bricksGroup.remove(anim.mesh);
          this.animations.splice(i, 1);
        }
      }
    }

    // Частинки при клацанні деталей
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;
      p.vy -= 0.012;
      p.life -= 0.045;
      p.mesh.scale.setScalar(Math.max(0.01, p.life));
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new DenysLegoGame();
});