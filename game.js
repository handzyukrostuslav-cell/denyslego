import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';

// ==========================================
// 1. КОНСТАНТИ ТА ПАЛІТРА КОЛЬОРІВ LEGO
// ==========================================
const STUD_SIZE = 1.0;
const PLATE_HEIGHT = 0.4; // 1 пластина = 0.4, 1 стандартний кубик = 3 пластини = 1.2

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

// ==========================================
// 2. БАЗОВІ ДЕТАЛІ LEGO
// ==========================================
const BASE_PARTS = [
  { id: 'b_1x1', name: 'Кубик 1×1', subCat: 'cubes', w: 1, d: 1, hPlates: 3, shape: 'brick' },
  { id: 'b_1x2', name: 'Кубик 1×2', subCat: 'cubes', w: 1, d: 2, hPlates: 3, shape: 'brick' },
  { id: 'b_1x3', name: 'Кубик 1×3', subCat: 'cubes', w: 1, d: 3, hPlates: 3, shape: 'brick' },
  { id: 'b_1x4', name: 'Кубик 1×4', subCat: 'cubes', w: 1, d: 4, hPlates: 3, shape: 'brick' },
  { id: 'b_1x6', name: 'Кубик 1×6', subCat: 'cubes', w: 1, d: 6, hPlates: 3, shape: 'brick' },
  { id: 'b_2x2', name: 'Кубик 2×2', subCat: 'cubes', w: 2, d: 2, hPlates: 3, shape: 'brick' },
  { id: 'b_2x3', name: 'Кубик 2×3', subCat: 'cubes', w: 2, d: 3, hPlates: 3, shape: 'brick' },
  { id: 'b_2x4', name: 'Кубик 2×4', subCat: 'cubes', w: 2, d: 4, hPlates: 3, shape: 'brick' },
  { id: 'b_2x6', name: 'Кубик 2×6', subCat: 'cubes', w: 2, d: 6, hPlates: 3, shape: 'brick' },
  { id: 'b_2x8', name: 'Кубик 2×8', subCat: 'cubes', w: 2, d: 8, hPlates: 3, shape: 'brick' },
  { id: 'b_cyl1', name: 'Циліндр 1×1', subCat: 'cubes', w: 1, d: 1, hPlates: 3, shape: 'cylinder' },
  { id: 'b_cyl2', name: 'Колона 2×2', subCat: 'cubes', w: 2, d: 2, hPlates: 6, shape: 'cylinder' },
  { id: 'b_cone', name: 'Конус 2×2', subCat: 'cubes', w: 2, d: 2, hPlates: 4, shape: 'cone' },

  { id: 'p_1x1', name: 'Пластина 1×1', subCat: 'plates', w: 1, d: 1, hPlates: 1, shape: 'plate' },
  { id: 'p_1x2', name: 'Пластина 1×2', subCat: 'plates', w: 1, d: 2, hPlates: 1, shape: 'plate' },
  { id: 'p_2x2', name: 'Пластина 2×2', subCat: 'plates', w: 2, d: 2, hPlates: 1, shape: 'plate' },
  { id: 'p_2x4', name: 'Пластина 2×4', subCat: 'plates', w: 2, d: 4, hPlates: 1, shape: 'plate' },
  { id: 'p_2x6', name: 'Пластина 2×6', subCat: 'plates', w: 2, d: 6, hPlates: 1, shape: 'plate' },
  { id: 'p_2x8', name: 'Пластина 2×8', subCat: 'plates', w: 2, d: 8, hPlates: 1, shape: 'plate' },
  { id: 'p_4x4', name: 'Пластина 4×4', subCat: 'plates', w: 4, d: 4, hPlates: 1, shape: 'plate' },
  { id: 'p_6x6', name: 'Пластина 6×6', subCat: 'plates', w: 6, d: 6, hPlates: 1, shape: 'plate' },
  { id: 't_1x2', name: 'Плитка 1×2', subCat: 'plates', w: 1, d: 2, hPlates: 1, shape: 'tile' },
  { id: 't_2x2', name: 'Плитка 2×2', subCat: 'plates', w: 2, d: 2, hPlates: 1, shape: 'tile' },
  { id: 't_2x4', name: 'Плитка 2×4', subCat: 'plates', w: 2, d: 4, hPlates: 1, shape: 'tile' },

  { id: 's_1x2', name: 'Скіс 1×2', subCat: 'slopes', w: 1, d: 2, hPlates: 3, shape: 'slope' },
  { id: 's_2x2', name: 'Скіс 2×2', subCat: 'slopes', w: 2, d: 2, hPlates: 3, shape: 'slope' },
  { id: 's_2x3', name: 'Скіс даху 2×3', subCat: 'slopes', w: 2, d: 3, hPlates: 3, shape: 'slope' },
  { id: 's_2x4', name: 'Скіс даху 2×4', subCat: 'slopes', w: 2, d: 4, hPlates: 3, shape: 'slope' },
  { id: 'r_2x2', name: 'Гребінь даху 2×2', subCat: 'slopes', w: 2, d: 2, hPlates: 3, shape: 'roof' },
  { id: 'r_2x4', name: 'Гребінь даху 2×4', subCat: 'slopes', w: 2, d: 4, hPlates: 3, shape: 'roof' },
  { id: 'a_1x4', name: 'Арка 1×4', subCat: 'slopes', w: 1, d: 4, hPlates: 3, shape: 'arch' },

  { id: 'd_win', name: 'Вікно 1×2×2', subCat: 'special', w: 1, d: 2, hPlates: 6, shape: 'window' },
  { id: 'd_win4', name: 'Панорама 1×4×2', subCat: 'special', w: 1, d: 4, hPlates: 6, shape: 'window' },
  { id: 'd_door', name: 'Двері 1×2×2', subCat: 'special', w: 1, d: 2, hPlates: 6, shape: 'door' },
  { id: 'd_wheel', name: 'Колесо 2×2', subCat: 'special', w: 2, d: 2, hPlates: 3, shape: 'wheel' },
  { id: 'd_fence', name: 'Паркан 1×4', subCat: 'special', w: 1, d: 4, hPlates: 3, shape: 'fence' },
  { id: 'dec_tree', name: 'Ялинка 2×2', subCat: 'special', w: 2, d: 2, hPlates: 9, shape: 'tree' },
  { id: 'dec_flag', name: 'Прапор 1×2', subCat: 'special', w: 1, d: 2, hPlates: 6, shape: 'flag' }
];

// ==========================================
// 3. ГЕНЕРАТОР 132 УНІКАЛЬНИХ 3D-МІНІФІГУРОК
// ==========================================
function generate132Minifigures() {
  const themes = [
    {
      subCat: 'city',
      roles: [
        'Будівельник', 'Поліцейський', 'Пожежник', 'Лікар-хірург', 'Шеф-кухар',
        'Пілот лайнера', 'Гонщик Формули', 'Автомеханік', 'Детектив', 'Рок-зірка',
        'Диджей', 'Телеведучий', 'Бізнесмен', 'Турист', 'Фермер',
        'Листоноша', 'Машиніст', 'Капітан судна', 'Водолаз', 'Архітектор',
        'Скейтбордист', 'Мер міста'
      ],
      torsos: ['#FF6F00', '#16284C', '#E3000B', '#36AEBF', '#F4F4F4', '#006CB7', '#FFD500', '#5C6166'],
      legs: ['#006CB7', '#1B1D21', '#5C6166', '#6B3E26', '#F4F4F4'],
      hats: ['builder', 'police', 'cap', 'hair', 'tophat', 'visor'],
      faces: ['smile', 'glasses', 'mustache', 'beard'],
      accs: ['wrench', 'none', 'torch']
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
      accs: ['blaster', 'saber_blue', 'none']
    },
    {
      subCat: 'castle',
      roles: [
        'Золотий Король', 'Королева Ельфів', 'Лицар Дракона', 'Лицар Лева', 'Темний Лорд',
        'Великий Чарівник', 'Вікінг Берсерк', 'Паладин Світла', 'Ельф-Лучник', 'Гвардієць',
        'Алхімік', 'Скелет-Воїн', 'Зомбі-Лицар', 'Коваль Зброї', 'Хранитель Вежі',
        'Принц Півночі', 'Лісовий Рейнджер', 'Барон Замку', 'Воєвода', 'Маг Вогню',
        'Маг Льоду', 'Лицар Фенікса'
      ],
      torsos: ['#A3A8AD', '#5C6166', '#D4AF37', '#E3000B', '#005A2B', '#7A288A', '#1B1D21', '#006CB7'],
      legs: ['#5C6166', '#1B1D21', '#6B3E26', '#A3A8AD', '#D4AF37'],
      hats: ['crown', 'knight', 'wizard', 'viking', 'hood'],
      faces: ['beard', 'smile', 'skeleton', 'zombie', 'mustache'],
      accs: ['sword', 'staff', 'shield']
    },
    {
      subCat: 'ninja',
      roles: [
        'Ніндзя Вогню', 'Ніндзя Блискавки', 'Ніндзя Льоду', 'Ніндзя Землі', 'Зелений Майстер',
        'Золотий Сенсей', 'Тіньовий Ніндзя', 'Самурай-Сьогун', 'Майстер Катани', 'Ніндзя Вітру',
        'Ніндзя Води', 'Кібер-Ніндзя', 'Воїн Змії', 'Червоний Ронін', 'Нічний Асасин',
        'Майстер Спіну', 'Дракон-Самурай', 'Учень Додзьо', 'Нефритовий Воїн', 'Білий Сьогун',
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
        'Золотий Фараон', 'Давня Мумія', 'Ковбой', 'Шериф', 'Дослідник Джунглів',
        'Капітан Привидів', 'Юнга', 'Мушкетер', 'Конкістадор', 'Вождь Племені',
        'Мисливець за Золотом', 'Пірат-Канонір', 'Наглядач Маяка', 'Морський Вовк', 'Губернатор',
        'Шаман', 'Легендарний Капер'
      ],
      torsos: ['#E3000B', '#16284C', '#6B3E26', '#DEC69B', '#D4AF37', '#1B1D21', '#005A2B', '#F4F4F4'],
      legs: ['#1B1D21', '#6B3E26', '#DEC69B', '#F4F4F4', '#16284C'],
      hats: ['pirate', 'cowboy', 'crown', 'tophat', 'hair'],
      faces: ['eyepatch', 'beard', 'mustache', 'skeleton', 'smile'],
      accs: ['cutlass', 'blaster', 'staff']
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
          hasCape: theme.subCat === 'castle' || theme.subCat === 'hero' || i % 5 === 0,
          capeColor: i % 2 === 0 ? '#E3000B' : '#16284C',
          subCat: theme.subCat
        }
      });
    });
  });
  return list;
}

// ==========================================
// 4. ГЕНЕРАТОР 100 РЕАЛІСТИЧНИХ МАШИН З ТОЧНИМИ КООРДИНАТАМИ
// ==========================================
function generate100Cars() {
  const carClasses = [
    { type: 'sport', label: 'Спорткар', len: 6, siren: null, style: 'sport' },
    { type: 'police', label: 'Поліція', len: 6, siren: 'police', style: 'sedan' },
    { type: 'fire', label: 'Пожежна', len: 8, siren: 'red', style: 'truck' },
    { type: 'ambulance', label: 'Швидка', len: 8, siren: 'blue', style: 'van' },
    { type: 'jeep', label: 'Джип 4×4', len: 6, siren: null, style: 'jeep' },
    { type: 'truck', label: 'Вантажівка', len: 8, siren: 'orange', style: 'truck' },
    { type: 'f1', label: 'Болід F1', len: 6, siren: null, style: 'f1' },
    { type: 'cabrio', label: 'Кабріолет', len: 6, siren: null, style: 'cabrio' },
    { type: 'cyber', label: 'Кібер-Пікап', len: 8, siren: null, style: 'cyber' },
    { type: 'bus', label: 'Автобус', len: 10, siren: null, style: 'bus' }
  ];

  const editions = [
    { suffix: 'Turbo', primary: '#E3000B', secondary: '#FFD500' },
    { suffix: 'GT', primary: '#006CB7', secondary: '#F4F4F4' },
    { suffix: 'Shadow', primary: '#1B1D21', secondary: '#FF6F00' },
    { suffix: 'Gold', primary: '#D4AF37', secondary: '#1B1D21' },
    { suffix: 'Neon', primary: '#A5CA18', secondary: '#1B1D21' },
    { suffix: 'Arctic', primary: '#F4F4F4', secondary: '#006CB7' },
    { suffix: 'Inferno', primary: '#FF6F00', secondary: '#1B1D21' },
    { suffix: 'Viper', primary: '#00A850', secondary: '#FFD500' },
    { suffix: 'Phantom', primary: '#7A288A', secondary: '#C0C5CE' },
    { suffix: 'Silver', primary: '#C0C5CE', secondary: '#E3000B' }
  ];

  const cars = [];
  let idx = 1;

  carClasses.forEach(cls => {
    editions.forEach(ed => {
      const items = [];
      const primary = cls.type === 'police' ? '#16284C'
        : cls.type === 'fire' ? '#E3000B'
        : cls.type === 'ambulance' ? '#F4F4F4'
        : ed.primary;
      const secondary = cls.type === 'police' ? '#F4F4F4'
        : cls.type === 'fire' ? '#FFD500'
        : cls.type === 'ambulance' ? '#E3000B'
        : ed.secondary;

      const halfL = cls.len / 2;

      // Рівень Y = 0 (висота 1.2 = 3 пластини): Колеса на осях + центральні блоки шасі
      items.push({ partId: 'd_wheel', colorHex: '#1B1D21', x: 0, y: 0, z: -halfL + 1, rot: 0 });
      items.push({ partId: 'd_wheel', colorHex: '#1B1D21', x: 0, y: 0, z: halfL - 1, rot: 0 });

      if (cls.len === 6) {
        items.push({ partId: 'b_2x2', colorHex: primary, x: 0, y: 0, z: 0, rot: 0 });
        items.push({ partId: 'p_2x6', colorHex: secondary, x: 0, y: 1.2, z: 0, rot: 0 });
      } else if (cls.len === 8) {
        items.push({ partId: 'b_2x4', colorHex: primary, x: 0, y: 0, z: 0, rot: 0 });
        items.push({ partId: 'p_2x8', colorHex: secondary, x: 0, y: 1.2, z: 0, rot: 0 });
      } else if (cls.len === 10) {
        items.push({ partId: 'b_2x6', colorHex: primary, x: 0, y: 0, z: 0, rot: 0 });
        items.push({ partId: 'p_2x6', colorHex: secondary, x: 0, y: 1.2, z: -2, rot: 0 });
        items.push({ partId: 'p_2x4', colorHex: secondary, x: 0, y: 1.2, z: 3, rot: 0 });
      }

      // Рівень Y = 1.6 (над рамою): Кузов авто
      const zFront = -halfL + 1;
      // 1. Похилий капот спереду (rot=2 нахилений вперед на -Z)
      items.push({ partId: 's_2x2', colorHex: primary, x: 0, y: 1.6, z: zFront, rot: 2 });

      // 2. Лобове скло зі скла (rot=2)
      if (cls.style !== 'f1') {
        items.push({ partId: 's_2x2', colorHex: '#88D8FF', x: 0, y: 1.6, z: zFront + 2, rot: 2 });
      } else {
        items.push({ partId: 'b_2x2', colorHex: primary, x: 0, y: 1.6, z: zFront + 2, rot: 0 });
      }

      // 3. Задня частина авто
      if (cls.len === 6) {
        if (cls.style === 'sport' || cls.style === 'f1') {
          items.push({ partId: 'b_2x2', colorHex: primary, x: 0, y: 1.6, z: 2, rot: 0 });
          items.push({ partId: 't_2x2', colorHex: secondary, x: 0, y: 2.8, z: 2, rot: 0 }); // спойлер
        } else if (cls.style === 'cabrio') {
          items.push({ partId: 'p_2x2', colorHex: primary, x: 0, y: 1.6, z: 2, rot: 0 });
        } else {
          // Седан / Поліція / Джип
          items.push({ partId: 'b_2x2', colorHex: primary, x: 0, y: 1.6, z: 2, rot: 0 });
          items.push({ partId: 't_2x4', colorHex: secondary, x: 0, y: 2.8, z: 1, rot: 0 }); // дах кабіни
        }
      } else if (cls.len === 8) {
        // Вантажівка / Пожежна / Швидка / Кібер-пікап
        items.push({ partId: 'b_2x4', colorHex: primary, x: 0, y: 1.6, z: 2, rot: 0 });
        if (cls.style !== 'cyber') {
          items.push({ partId: 'b_2x4', colorHex: secondary, x: 0, y: 2.8, z: 2, rot: 0 });
          items.push({ partId: 't_2x4', colorHex: primary, x: 0, y: 4.0, z: 2, rot: 0 });
        } else {
          items.push({ partId: 's_2x2', colorHex: primary, x: 0, y: 2.8, z: 1, rot: 0 });
        }
      } else if (cls.len === 10) {
        // Міський автобус
        items.push({ partId: 'b_2x6', colorHex: primary, x: 0, y: 1.6, z: 2, rot: 0 });
        items.push({ partId: 'b_2x6', colorHex: '#88D8FF', x: 0, y: 2.8, z: 1, rot: 0 });
        items.push({ partId: 't_2x8', colorHex: secondary, x: 0, y: 4.0, z: 1, rot: 0 });
      }

      // Мигалка на даху спецтранспорту
      if (cls.siren) {
        const sirenHex = cls.siren === 'red' ? '#FF5500' : (cls.siren === 'orange' ? '#FF6F00' : '#88D8FF');
        const sirenY = cls.len === 6 ? 3.2 : 4.4;
        const sirenZ = cls.len === 6 ? 0.5 : 1;
        items.push({ partId: 'p_1x2', colorHex: sirenHex, x: 0, y: sirenY, z: sirenZ, rot: 1 });
      }

      cars.push({
        id: `car_${String(idx).padStart(3, '0')}`,
        name: `#${idx} ${cls.label} ${ed.suffix}`,
        cat: 'cars',
        subCat: cls.type,
        w: 2,
        d: cls.len,
        primaryColor: primary,
        secondaryColor: secondary,
        items
      });
      idx++;
    });
  });

  return cars;
}

// ==========================================
// 5. ГЕНЕРАТОР 100 ІДЕАЛЬНО РІВНИХ БУДИНКІВ (1-2-3 ПОВЕРХИ)
// ==========================================
function buildCleanHouseItems(w, d, floors, style, addTree) {
  const items = [];
  const halfW = w / 2;
  const halfD = d / 2;

  // 1. Рівний фундамент на Y = 0 (плита висотою 1 пластина = 0.4)
  for (let x = -halfW + 1; x < halfW; x += 2) {
    for (let z = -halfD + 1; z < halfD; z += 2) {
      items.push({ partId: 'p_2x2', colorHex: style.trim, x, y: 0, z, rot: 0 });
    }
  }

  // Допоміжна функція для 1×1 колони висотою 2 кубики (6 пластин = 2.4)
  const addPillar1x1 = (px, py, pz, col) => {
    items.push({ partId: 'b_1x1', colorHex: col, x: px, y: py, z: pz, rot: 0 });
    items.push({ partId: 'b_1x1', colorHex: col, x: px, y: py + 1.2, z: pz, rot: 0 });
  };

  // Допоміжна функція для 1×2 стіни висотою 2 кубики (6 пластин = 2.4)
  const addWall1x2 = (wx, wy, wz, rot, col) => {
    items.push({ partId: 'b_1x2', colorHex: col, x: wx, y: wy, z: wz, rot });
    items.push({ partId: 'b_1x2', colorHex: col, x: wx, y: wy + 1.2, z: wz, rot });
  };

  // 2. Поверхи (кожен поверх висотою 2.4 стіни + 0.4 перекриття = 2.8)
  for (let fl = 0; fl < floors; fl++) {
    const y0 = 0.4 + fl * 2.8;

    // Ліва та права стіни (x = -halfW + 0.5 та +halfW - 0.5)
    [-halfW + 0.5, halfW - 0.5].forEach(sx => {
      if (d === 6) {
        addWall1x2(sx, y0, -2, 0, style.wall);
        items.push({ partId: 'd_win', colorHex: style.trim, x: sx, y: y0, z: 0, rot: 0 });
        addWall1x2(sx, y0, 2, 0, style.wall);
      } else {
        // d === 8
        addWall1x2(sx, y0, -3, 0, style.wall);
        items.push({ partId: 'd_win', colorHex: style.trim, x: sx, y: y0, z: -1, rot: 0 });
        items.push({ partId: 'd_win', colorHex: style.trim, x: sx, y: y0, z: 1, rot: 0 });
        addWall1x2(sx, y0, 3, 0, style.wall);
      }
    });

    // Задня стіна (z = -halfD + 0.5, внутрішня ширина w - 2)
    const innerW = w - 2;
    for (let x = -innerW / 2 + 1; x < innerW / 2; x += 2) {
      addWall1x2(x, y0, -halfD + 0.5, 1, style.wall);
    }

    // Передня стіна (z = +halfD - 0.5)
    const fz = halfD - 0.5;
    if (w === 6) {
      addPillar1x1(-1.5, y0, fz, style.wall);
      addPillar1x1(1.5, y0, fz, style.wall);
      if (fl === 0) {
        items.push({ partId: 'd_door', colorHex: style.trim, x: 0, y: y0, z: fz, rot: 1 });
      } else {
        items.push({ partId: 'd_win', colorHex: style.trim, x: 0, y: y0, z: fz, rot: 1 });
      }
    } else if (w === 8) {
      items.push({ partId: 'd_win', colorHex: style.trim, x: -2, y: y0, z: fz, rot: 1 });
      items.push({ partId: 'd_win', colorHex: style.trim, x: 2, y: y0, z: fz, rot: 1 });
      if (fl === 0) {
        items.push({ partId: 'd_door', colorHex: style.trim, x: 0, y: y0, z: fz, rot: 1 });
      } else {
        addWall1x2(0, y0, fz, 1, style.wall);
      }
    } else {
      // w === 10
      addPillar1x1(-3.5, y0, fz, style.wall);
      addPillar1x1(3.5, y0, fz, style.wall);
      items.push({ partId: 'd_win', colorHex: style.trim, x: -2, y: y0, z: fz, rot: 1 });
      items.push({ partId: 'd_win', colorHex: style.trim, x: 2, y: y0, z: fz, rot: 1 });
      if (fl === 0) {
        items.push({ partId: 'd_door', colorHex: style.trim, x: 0, y: y0, z: fz, rot: 1 });
      } else {
        items.push({ partId: 'd_win', colorHex: style.trim, x: 0, y: y0, z: fz, rot: 1 });
      }
    }

    // Міжповерхове перекриття (Y = y0 + 2.4)
    const ySlab = Number((y0 + 2.4).toFixed(2));
    for (let x = -halfW + 1; x < halfW; x += 2) {
      for (let z = -halfD + 1; z < halfD; z += 2) {
        items.push({ partId: 'p_2x2', colorHex: style.trim, x, y: ySlab, z, rot: 0 });
      }
    }
  }

  // 3. Дах на рівні yRoof = 0.4 + floors * 2.8
  const yRoof = Number((0.4 + floors * 2.8).toFixed(2));

  if (style.roofType === 'gable') {
    // Акуратний двосхилий дах зі скосів s_2x3 (по центру) та плоских карнизів по краях
    for (let z = -halfD + 1; z < halfD; z += 2) {
      items.push({ partId: 's_2x3', colorHex: style.roof, x: -1.5, y: yRoof, z, rot: 1 });
      items.push({ partId: 's_2x3', colorHex: style.roof, x: 1.5, y: yRoof, z, rot: 3 });
      if (w >= 8) {
        items.push({ partId: 't_1x2', colorHex: style.roof, x: -3.5, y: yRoof, z, rot: 0 });
        items.push({ partId: 't_1x2', colorHex: style.roof, x: 3.5, y: yRoof, z, rot: 0 });
      }
      if (w === 10) {
        items.push({ partId: 't_1x2', colorHex: style.roof, x: -4.5, y: yRoof, z, rot: 0 });
        items.push({ partId: 't_1x2', colorHex: style.roof, x: 4.5, y: yRoof, z, rot: 0 });
      }
    }
    // Димар
    items.push({ partId: 'b_1x1', colorHex: style.trim, x: 1.5, y: yRoof + 1.2, z: -halfD + 1.5, rot: 0 });
  } else if (style.roofType === 'castle') {
    // Замкові зубці по периметру та прапор
    for (let x = -halfW + 0.5; x <= halfW - 0.5; x += 2) {
      items.push({ partId: 'b_1x1', colorHex: style.roof, x, y: yRoof, z: -halfD + 0.5, rot: 0 });
      items.push({ partId: 'b_1x1', colorHex: style.roof, x, y: yRoof, z: halfD - 0.5, rot: 0 });
    }
    items.push({ partId: 'dec_flag', colorHex: '#E3000B', x: halfW - 1, y: yRoof, z: -halfD + 1, rot: 0 });
  } else {
    // Сучасний плоский дах з терасою
    for (let x = -halfW + 1; x < halfW; x += 2) {
      items.push({ partId: 't_1x2', colorHex: style.roof, x, y: yRoof, z: -halfD + 0.5, rot: 1 });
      items.push({ partId: 't_1x2', colorHex: style.roof, x, y: yRoof, z: halfD - 0.5, rot: 1 });
    }
    items.push({ partId: 'b_cyl2', colorHex: style.trim, x: 0, y: yRoof, z: 0, rot: 0 });
  }

  // Ялинка поруч із будинком
  if (addTree) {
    items.push({ partId: 'dec_tree', colorHex: '#00A850', x: halfW + 1.5, y: 0, z: halfD - 1, rot: 0 });
  }

  return items;
}

function generate100Houses() {
  const styles = [
    { name: 'Котедж', wall: '#F4F4F4', trim: '#A3A8AD', roof: '#E3000B', roofType: 'gable' },
    { name: 'Вілла Модерн', wall: '#F4F4F4', trim: '#1B1D21', roof: '#5C6166', roofType: 'flat' },
    { name: 'Цегляний Дім', wall: '#FF6F00', trim: '#DEC69B', roof: '#6B3E26', roofType: 'gable' },
    { name: 'Скандинавський', wall: '#36AEBF', trim: '#F4F4F4', roof: '#1B1D21', roofType: 'gable' },
    { name: 'Сонячний Дім', wall: '#FFD500', trim: '#F4F4F4', roof: '#00A850', roofType: 'gable' },
    { name: 'Замкова Вежа', wall: '#A3A8AD', trim: '#5C6166', roof: '#5C6166', roofType: 'castle' },
    { name: 'Лісове Шале', wall: '#6B3E26', trim: '#DEC69B', roof: '#005A2B', roofType: 'gable' },
    { name: 'Хмарочос', wall: '#006CB7', trim: '#C0C5CE', roof: '#1B1D21', roofType: 'flat' },
    { name: 'Казковий Дім', wall: '#FF69B4', trim: '#FFD500', roof: '#7A288A', roofType: 'gable' },
    { name: 'Кібер-База', wall: '#1B1D21', trim: '#36AEBF', roof: '#006CB7', roofType: 'flat' }
  ];

  const footprints = [
    { w: 6, d: 6 },
    { w: 8, d: 6 },
    { w: 8, d: 8 },
    { w: 10, d: 6 },
    { w: 10, d: 8 }
  ];

  const houses = [];
  for (let i = 0; i < 100; i++) {
    const st = styles[i % styles.length];
    const fp = footprints[Math.floor(i / 20) % footprints.length];
    const floors = (i % 3) + 1;

    houses.push({
      id: `house_${String(i + 1).padStart(3, '0')}`,
      name: `#${i + 1} ${st.name} (${floors} пов.)`,
      cat: 'houses',
      subCat: `f${floors}`,
      floors,
      w: fp.w + (i % 3 === 0 ? 2 : 0),
      d: fp.d,
      primaryColor: st.wall,
      secondaryColor: st.roof,
      items: buildCleanHouseItems(fp.w, fp.d, floors, st, i % 3 === 0)
    });
  }
  return houses;
}

// ==========================================
// 6. ГЕНЕРАТОР 32 ДОДАТКОВИХ НАБОРІВ З ТОЧНИМИ КООРДИНАТАМИ
// ==========================================
function generateExtraSets() {
  const sets = [];
  const makeSet = (id, name, subCat, w, d, primaryColor, secondaryColor, items) => {
    sets.push({ id, name, cat: 'sets', subCat, w, d, primaryColor, secondaryColor, items });
  };

  // Гелікоптери (8)
  [
    ['Поліцейський Гелікоптер', '#16284C', '#F4F4F4'],
    ['Рятувальний Гелікоптер', '#FF6F00', '#F4F4F4'],
    ['Пожежний Гелікоптер', '#E3000B', '#FFD500'],
    ['Військовий Гелікоптер', '#005A2B', '#1B1D21'],
    ['Арктичний Гелікоптер', '#F4F4F4', '#E3000B'],
    ['Золотий VIP-Гелікоптер', '#D4AF37', '#1B1D21'],
    ['Кібер-Дрон', '#1B1D21', '#36AEBF'],
    ['Берегова Охорона', '#FFD500', '#006CB7']
  ].forEach(([name, c1, c2], i) => {
    makeSet(`set_heli_${i}`, name, 'air', 4, 8, c1, c2, [
      { partId: 'p_2x8', colorHex: c2, x: 0, y: 0, z: 0, rot: 0 },
      { partId: 's_2x2', colorHex: '#88D8FF', x: 0, y: 0.4, z: -3, rot: 2 },
      { partId: 'b_2x2', colorHex: c1, x: 0, y: 0.4, z: -1, rot: 0 },
      { partId: 'b_1x4', colorHex: c1, x: 0, y: 0.4, z: 2, rot: 0 },
      { partId: 't_1x2', colorHex: c2, x: 0, y: 1.6, z: 3.5, rot: 1 },
      { partId: 't_1x4', colorHex: '#1B1D21', x: -1.5, y: 1.6, z: -1, rot: 1 },
      { partId: 't_1x4', colorHex: '#1B1D21', x: 1.5, y: 1.6, z: -1, rot: 1 }
    ]);
  });

  // Космічні ракети та кораблі (8)
  [
    ['Космічний Шаттл', '#F4F4F4', '#1B1D21'],
    ['Зоряний Винищувач', '#006CB7', '#FFD500'],
    ['Важка Ракета Saturn', '#F4F4F4', '#E3000B'],
    ['Марсіанський Модуль', '#FF6F00', '#C0C5CE'],
    ['Галактичний Крейсер', '#5C6166', '#36AEBF'],
    ['Корабель Прибульців НЛО', '#A5CA18', '#7A288A'],
    ['Квантовий Перехоплювач', '#1B1D21', '#E3000B'],
    ['Золотий Зоряний Корабель', '#D4AF37', '#006CB7']
  ].forEach(([name, c1, c2], i) => {
    makeSet(`set_space_${i}`, name, 'space', 4, 4, c1, c2, [
      { partId: 'p_4x4', colorHex: '#5C6166', x: 0, y: 0, z: 0, rot: 0 },
      { partId: 'b_cyl2', colorHex: c1, x: 0, y: 0.4, z: 0, rot: 0 },
      { partId: 'b_cyl2', colorHex: c2, x: 0, y: 2.8, z: 0, rot: 0 },
      { partId: 'b_cone', colorHex: c1, x: 0, y: 5.2, z: 0, rot: 0 },
      { partId: 's_1x2', colorHex: c2, x: -1.5, y: 0.4, z: 0, rot: 3 },
      { partId: 's_1x2', colorHex: c2, x: 1.5, y: 0.4, z: 0, rot: 1 }
    ]);
  });

  // Міська інфраструктура (8)
  [
    ['Міський Фонтан', '#A3A8AD', '#88D8FF'],
    ['Кам’яний Міст', '#5C6166', '#DEC69B'],
    ['Маяк на Узбережжі', '#F4F4F4', '#E3000B'],
    ['Парк з Ялинками', '#00A850', '#6B3E26'],
    ['АЗС Заправка', '#FFD500', '#E3000B'],
    ['Ліхтарна Алея', '#1B1D21', '#FFD500'],
    ['Оглядова Вежа', '#006CB7', '#C0C5CE'],
    ['Кав’ярня на Колесах', '#36AEBF', '#F4F4F4']
  ].forEach(([name, c1, c2], i) => {
    makeSet(`set_city_${i}`, name, 'city_decor', 6, 6, c1, c2, [
      { partId: 'p_6x6', colorHex: c1, x: 0, y: 0, z: 0, rot: 0 },
      { partId: 'b_cyl2', colorHex: c2, x: 0, y: 0.4, z: 0, rot: 0 },
      { partId: 'b_cone', colorHex: c1, x: 0, y: 2.8, z: 0, rot: 0 },
      { partId: 'd_fence', colorHex: c1, x: 0, y: 0.4, z: 2.5, rot: 1 },
      { partId: 'd_fence', colorHex: c1, x: 0, y: 0.4, z: -2.5, rot: 1 },
      { partId: 'dec_tree', colorHex: '#00A850', x: -2, y: 0.4, z: 0, rot: 0 },
      { partId: 'dec_flag', colorHex: c2, x: 2, y: 0.4, z: 0, rot: 0 }
    ]);
  });

  // Бойові Роботи-Мехи та Катери (8)
  [
    ['Бойовий Мех Титан', '#E3000B', '#FFD500'],
    ['Поліцейський Робот', '#006CB7', '#F4F4F4'],
    ['Самурай-Мех', '#1B1D21', '#D4AF37'],
    ['Лісовий Робот', '#00A850', '#5C6166'],
    ['Швидкісний Катер', '#F4F4F4', '#006CB7'],
    ['Піратський Корабель', '#6B3E26', '#1B1D21'],
    ['Рятувальний Човен', '#FF6F00', '#F4F4F4'],
    ['Яхта Мільйонера', '#F4F4F4', '#D4AF37']
  ].forEach(([name, c1, c2], i) => {
    makeSet(`set_mech_${i}`, name, 'mech_boat', 4, 4, c1, c2, [
      { partId: 'b_2x2', colorHex: c1, x: -1.5, y: 0, z: 0, rot: 0 },
      { partId: 'b_2x2', colorHex: c1, x: 1.5, y: 0, z: 0, rot: 0 },
      { partId: 'p_4x4', colorHex: c2, x: 0, y: 1.2, z: 0, rot: 0 },
      { partId: 'b_2x4', colorHex: c1, x: 0, y: 1.6, z: 0, rot: 1 },
      { partId: 's_2x2', colorHex: '#88D8FF', x: 0, y: 2.8, z: 0, rot: 2 },
      { partId: 'dec_flag', colorHex: c2, x: 1.5, y: 2.8, z: -1, rot: 0 }
    ]);
  });

  return sets;
}

const MINIFIG_CATALOG = generate132Minifigures();
const CARS_CATALOG = generate100Cars();
const HOUSES_CATALOG = generate100Houses();
const EXTRA_SETS_CATALOG = generateExtraSets();

const ALL_ITEMS = [
  ...BASE_PARTS.map(p => ({ ...p, cat: 'bricks' })),
  ...CARS_CATALOG,
  ...HOUSES_CATALOG,
  ...EXTRA_SETS_CATALOG,
  ...MINIFIG_CATALOG
];

// ==========================================
// 7. ЗВУКОВИЙ СИНТЕЗАТОР КЛАЦАННЯ LEGO
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
    osc.frequency.exponentialRampToValueAtTime(1480 * pitch, now + 0.032);
    osc.frequency.exponentialRampToValueAtTime(290 * pitch, now + 0.072);

    gain.gain.setValueAtTime(0.22, now);
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
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }
}
const audio = new LegoAudio();

// ==========================================
// 8. ГЕНЕРАТОР 3D-ГЕОМЕТРІЇ LEGO ТА МІНІФІГУРОК
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
  const studGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.18, 14);
  const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 12);
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
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 112, 128, 16);
  ctx.fillStyle = '#FFD500';
  ctx.fillRect(54, 114, 20, 12);

  ctx.fillStyle = '#FFD500';
  ctx.beginPath();
  ctx.arc(64, 54, 16, 0, Math.PI * 2);
  ctx.fill();

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

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3.5;
  if (cfg.faceType !== 'ninja') {
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

  const hipMesh = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.28, 0.68), legMat);
  hipMesh.position.y = 1.25;
  group.add(hipMesh);

  const legGeo = new THREE.BoxGeometry(0.62, 1.12, 0.66);
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.36, 0.56, 0);
  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.36, 0.56, 0);
  group.add(leftLeg, rightLeg);

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

  if (cfg.hasCape) {
    const capeMat = createMaterial({ name: 'Cape', hex: cfg.capeColor }, isGhost);
    const cape = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.85, 0.06), capeMat);
    cape.position.set(0, 1.65, -0.38);
    cape.rotation.x = 0.14;
    group.add(cape);
  }

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

  if (cfg.accessory && cfg.accessory !== 'none') {
    const accGroup = new THREE.Group();
    accGroup.position.set(0.92, 1.58, 0.35);
    if (cfg.accessory.startsWith('saber')) {
      const saberHex = cfg.accessory === 'saber_red' ? '#FF1E1E' : (cfg.accessory === 'saber_green' ? '#00FF55' : '#00B4FF');
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 12), createMaterial({ name: 'Beam', hex: saberHex, glow: true }, isGhost));
      beam.position.y = 0.85;
      accGroup.add(beam);
      accGroup.rotation.x = 0.5;
    } else {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.45, 0.18), createMaterial({ name: 'Steel', hex: '#C0C5CE' }, isGhost));
      blade.position.y = 0.72;
      accGroup.add(blade);
      accGroup.rotation.x = 0.55;
    }
    group.add(accGroup);
  }

  const faceMat = new THREE.MeshPhysicalMaterial({
    map: createFaceTexture(cfg),
    roughness: 0.24,
    transparent: isGhost,
    opacity: isGhost ? 0.6 : 1
  });
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.72, 22), faceMat);
  head.position.y = 3.04;
  head.rotation.y = -Math.PI / 2;
  group.add(head);

  const hatMat = createMaterial({ name: 'Hat', hex: cfg.torsoColor }, isGhost);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.47, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hatMat);
  dome.position.y = 3.26;
  group.add(dome);

  const topStud = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 14), headMat);
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
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 22), mat);
    cyl.position.y = h / 2;
    group.add(cyl);
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'cone') {
    const rBot = (w - gap) / 2;
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.35, rBot, h, 22), mat);
    cone.position.y = h / 2;
    group.add(cone);
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.18, 14), mat);
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
    const frameThick = 0.22;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w - gap, frameThick, d - gap), mat);
    top.position.y = h - frameThick / 2;
    const left = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, frameThick), mat);
    left.position.set(0, h / 2, -d / 2 + frameThick / 2);
    const right = new THREE.Mesh(new THREE.BoxGeometry(w - gap, h, frameThick), mat);
    right.position.set(0, h / 2, d / 2 - frameThick / 2);

    const leafMat = createMaterial({ name: 'Leaf', hex: '#FFD500' }, isGhost);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.2, h - frameThick - 0.04, d - frameThick * 2 - 0.04), leafMat);
    leaf.position.set(0.28, (h - frameThick) / 2, 0.15);
    leaf.rotation.y = 0.38;
    group.add(top, left, right, leaf);
    addStudsToGroup(group, part.w, part.d, h, mat);
  } else if (part.shape === 'wheel') {
    const axle = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, h * 0.45, d - 0.1), mat);
    axle.position.y = h * 0.5;
    group.add(axle);

    const tireMat = createMaterial({ name: 'Rubber', hex: '#18181B' }, isGhost);
    const rimMat = createMaterial({ name: 'Rim', hex: '#C0C5CE' }, isGhost);
    [-w / 2 + 0.1, w / 2 - 0.1].forEach(wx => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.42, 18), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wx, 0.58, 0);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.44, 14), rimMat);
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
// 9. ГОЛОВНИЙ КЛАС 3D-ГРИ
// ==========================================
class DenysLegoGame {
  constructor() {
    this.gridSize = 32;
    this.selectedPart = BASE_PARTS[7]; // Кубик 2x4
    this.selectedColor = LEGO_COLORS[0];
    this.currentRotation = 0;
    this.toolMode = 'build';
    this.activeCategory = 'bricks';
    this.activeSubFilter = 'all';

    this.placedBricks = [];
    this.selectedBricks = [];
    this.moveWholeGroup = true;
    this.isDraggingSelection = false;
    this.dragAnchorPoint = new THREE.Vector3();

    this.animations = [];
    this.particles = [];
    this.isExploded = false;
    this.explodeProgress = 0;
    this.lightingMode = 0;
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
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#7EC8E3');
    this.scene.fog = new THREE.Fog('#7EC8E3', 75, 210);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 400);
    this.camera.position.set(22, 20, 26);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 135;

    this.hemiLight = new THREE.HemisphereLight('#ffffff', '#3d5a3c', 0.9);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight('#fff8eb', 1.4);
    this.dirLight.position.set(30, 48, 25);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 5;
    this.dirLight.shadow.camera.far = 150;
    const d = 44;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    const table = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: '#3B526E', roughness: 0.85 })
    );
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.32;
    table.receiveShadow = true;
    this.scene.add(table);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.bricksGroup = new THREE.Group();
    this.scene.add(this.bricksGroup);

    this.selectionHelper = new THREE.Box3Helper(new THREE.Box3(), 0xffd500);
    this.selectionHelper.visible = false;
    this.scene.add(this.selectionHelper);
  }

  buildBaseplate(size) {
    this.gridSize = size;
    if (this.baseplateGroup) this.scene.remove(this.baseplateGroup);
    this.baseplateGroup = new THREE.Group();

    const plateMat = new THREE.MeshPhysicalMaterial({ color: '#008C3A', roughness: 0.3, clearcoat: 0.25 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(size, 0.3, size), plateMat);
    base.position.y = -0.15;
    base.receiveShadow = true;
    base.name = 'baseplate';
    this.baseplateGroup.add(base);

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

    const dist = size * 0.92;
    this.controls.maxDistance = size * 2.2;
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
    this.cameraTween = {
      startPos: this.camera.position.clone(),
      endPos: targets[view] || targets.iso,
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
      btn.textContent = '☀️ Освітлення: День';
    } else if (this.lightingMode === 1) {
      this.scene.background.set('#F59E0B');
      this.scene.fog.color.set('#D97706');
      this.hemiLight.intensity = 0.65;
      this.dirLight.color.set('#FF7E47');
      this.dirLight.intensity = 1.65;
      btn.textContent = '🌅 Освітлення: Захід';
    } else {
      this.scene.background.set('#090D1A');
      this.scene.fog.color.set('#090D1A');
      this.hemiLight.intensity = 0.35;
      this.dirLight.color.set('#6366F1');
      this.dirLight.intensity = 0.65;
      btn.textContent = '🌙 Освітлення: Ніч';
    }
    const glowStrength = this.lightingMode === 2 ? 1.55 : 0.45;
    this.bricksGroup.traverse(obj => {
      if (obj.isMesh && obj.material?.userData?.isGlow) {
        obj.material.emissiveIntensity = glowStrength;
      }
    });
  }

  createGhostMesh() {
    if (this.ghostMesh) this.scene.remove(this.ghostMesh);
    if (this.selectedPart.items) {
      this.ghostMesh = null;
      return;
    }
    this.ghostMesh = createPartMesh(this.selectedPart, this.selectedColor, true);
    this.ghostMesh.rotation.y = (this.currentRotation * Math.PI) / 2;
    this.ghostMesh.visible = this.toolMode === 'build';
    this.scene.add(this.ghostMesh);
  }

  getEffectiveDims(part, rot) {
    return rot % 2 === 0 ? { w: part.w, d: part.d } : { w: part.d, d: part.w };
  }

  snapCoordinates(rawX, rawZ, part, rot, ignoreSet = null) {
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
    const y = this.computeStackHeight(x, z, w, d, ignoreSet);
    return { x, y, z };
  }

  computeStackHeight(cx, cz, w, d, ignoreSet = null) {
    const minX = cx - w / 2 + 0.05;
    const maxX = cx + w / 2 - 0.05;
    const minZ = cz - d / 2 + 0.05;
    const maxZ = cz + d / 2 - 0.05;

    let highestY = 0;
    for (const b of this.placedBricks) {
      if (ignoreSet && ignoreSet.has(b)) continue;
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

  placeBrick(part, color, x, y, z, rot, animateDrop = true, groupId = null) {
    const mesh = createPartMesh(part, color, false);
    mesh.position.set(x, y, z);
    mesh.rotation.y = (rot * Math.PI) / 2;
    this.bricksGroup.add(mesh);

    const record = {
      id: crypto.randomUUID(),
      groupId,
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
        startY: y + 2.0,
        progress: 0
      });
      this.spawnParticles(x, y + 0.2, z, color.hex);
    }
    return record;
  }

  // Пошук вільного місця на полі, щоб пресети не накладалися при спавні
  findFreeSpot(w, d) {
    const half = this.gridSize / 2;
    const step = 2;
    for (let radius = 0; radius <= half - Math.max(w, d) / 2; radius += step) {
      for (let ox = -radius; ox <= radius; ox += step) {
        for (let oz = -radius; oz <= radius; oz += step) {
          if (Math.abs(ox) !== radius && Math.abs(oz) !== radius) continue;
          if (ox - w / 2 < -half || ox + w / 2 > half || oz - d / 2 < -half || oz + d / 2 > half) continue;
          if (this.computeStackHeight(ox, oz, w + 1, d + 1) === 0) {
            return { x: ox, z: oz };
          }
        }
      }
    }
    return { x: 0, z: 0 };
  }

  // ==========================================
  // 10. СПАВН ТА ВІЛЬНЕ ПЕРЕСУВАННЯ ПРЕСЕТІВ
  // ==========================================
  spawnPresetOnBoard(preset, offsetX = null, offsetZ = null, autoSelectForMove = true) {
    let ox = offsetX;
    let oz = offsetZ;
    if (ox === null || oz === null) {
      const spot = this.findFreeSpot(preset.w || 6, preset.d || 6);
      ox = spot.x;
      oz = spot.z;
    }

    const groupId = crypto.randomUUID();
    const createdRecords = [];

    // Висота основи під пресетом (0 якщо вільне поле)
    const groundY = this.computeStackHeight(ox, oz, preset.w || 4, preset.d || 4);

    preset.items.forEach(it => {
      const part = BASE_PARTS.find(p => p.id === it.partId) || BASE_PARTS[0];
      const color = LEGO_COLORS.find(c => c.hex === it.colorHex) || { name: 'Custom', hex: it.colorHex };
      const bx = ox + it.x;
      const bz = oz + it.z;
      // Використовуємо точні креслярські координати Y пресету!
      const by = Number((groundY + (it.y ?? 0)).toFixed(2));
      const rec = this.placeBrick(part, color, bx, by, bz, it.rot, true, groupId);
      createdRecords.push(rec);
    });

    if (autoSelectForMove && createdRecords.length > 0) {
      this.setToolMode('move');
      this.moveWholeGroup = true;
      document.getElementById('btn-move-scope').textContent = '🏠 Весь об\'єкт';
      this.selectBrickOrGroup(createdRecords[0]);
      this.showToast(`«${preset.name}» зібрано! Тягни пальцем або мишею.`);
    }
    return createdRecords;
  }

  selectBrickOrGroup(record) {
    if (!record) {
      this.clearSelection();
      return;
    }
    if (this.moveWholeGroup && record.groupId) {
      this.selectedBricks = this.placedBricks.filter(b => b.groupId === record.groupId);
    } else {
      this.selectedBricks = [record];
    }
    this.updateSelectionHelper();
  }

  clearSelection() {
    this.selectedBricks = [];
    this.selectionHelper.visible = false;
  }

  updateSelectionHelper() {
    if (this.selectedBricks.length === 0) {
      this.selectionHelper.visible = false;
      return;
    }
    const box = new THREE.Box3();
    this.selectedBricks.forEach(b => box.expandByObject(b.mesh));
    this.selectionHelper.box.copy(box);
    this.selectionHelper.visible = true;
  }

  moveSelectedBy(dx, dz) {
    if (this.selectedBricks.length === 0) return;
    const half = this.gridSize / 2;

    for (const b of this.selectedBricks) {
      const dims = this.getEffectiveDims(b.part, b.rot);
      const nx = b.x + dx;
      const nz = b.z + dz;
      if (nx - dims.w / 2 < -half || nx + dims.w / 2 > half || nz - dims.d / 2 < -half || nz + dims.d / 2 > half) {
        return;
      }
    }

    const ignoreSet = new Set(this.selectedBricks);
    const minBaseY = Math.min(...this.selectedBricks.map(b => b.y));

    let newBaseY = 0;
    for (const b of this.selectedBricks) {
      if (Math.abs(b.y - minBaseY) < 0.05) {
        const dims = this.getEffectiveDims(b.part, b.rot);
        const h = this.computeStackHeight(b.x + dx, b.z + dz, dims.w, dims.d, ignoreSet);
        if (h > newBaseY) newBaseY = h;
      }
    }
    const dy = newBaseY - minBaseY;

    for (const b of this.selectedBricks) {
      b.x += dx;
      b.z += dz;
      b.y = Number((b.y + dy).toFixed(2));
      b.mesh.position.set(b.x, b.y, b.z);
    }
    this.updateSelectionHelper();
  }

  rotateSelected90() {
    if (this.selectedBricks.length === 0) return;
    let cx = 0;
    let cz = 0;
    this.selectedBricks.forEach(b => {
      cx += b.x;
      cz += b.z;
    });
    cx = Math.round((cx / this.selectedBricks.length) * 2) / 2;
    cz = Math.round((cz / this.selectedBricks.length) * 2) / 2;

    for (const b of this.selectedBricks) {
      const relX = b.x - cx;
      const relZ = b.z - cz;
      b.x = cx - relZ;
      b.z = cz + relX;
      b.rot = (b.rot + 1) % 4;
      b.mesh.position.set(b.x, b.y, b.z);
      b.mesh.rotation.y = (b.rot * Math.PI) / 2;
    }
    audio.playSnap(1.15);
    this.updateSelectionHelper();
  }

  cloneSelected() {
    if (this.selectedBricks.length === 0) return;
    const newGroupId = crypto.randomUUID();
    const clones = [];
    for (const b of this.selectedBricks) {
      const rec = this.placeBrick(b.part, b.color, b.x, b.y, b.z, b.rot, false, newGroupId);
      clones.push(rec);
    }
    this.selectedBricks = clones;
    this.moveSelectedBy(2, 2);
    audio.playSnap(1.25);
    this.showToast('Копію створено! Перетягни її на потрібне місце.');
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
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.position.set(x, y, z);
      const angle = (Math.PI * 2 * i) / 6;
      this.scene.add(p);
      this.particles.push({
        mesh: p,
        vx: Math.cos(angle) * 0.08,
        vy: 0.11 + Math.random() * 0.07,
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
    this.clearSelection();
    this.isExploded = false;
    this.explodeProgress = 0;
    this.updateCounter();
    if (!silent) this.showToast('Поле очищено!');
  }

  buildStarterMegaCity() {
    if (this.gridSize < 64) {
      this.buildBaseplate(64);
      document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', Number(b.dataset.size) === 64));
    }
    this.clearAll(true);

    // Головна дорога 64x64
    const cDarkGray = LEGO_COLORS[9];
    for (let z = -28; z <= 28; z += 4) {
      this.placeBrick(BASE_PARTS[10], cDarkGray, -1, 0, z, 0, false);
      this.placeBrick(BASE_PARTS[10], cDarkGray, 1, 0, z, 0, false);
    }

    // 4 охайні будинки різної поверховості + 3 авто + гелікоптер + жителі
    this.spawnPresetOnBoard(HOUSES_CATALOG[0], -14, -14, false); // 1-поверховий котедж
    this.spawnPresetOnBoard(HOUSES_CATALOG[7], 14, -14, false);  // 2-поверховий хмарочос
    this.spawnPresetOnBoard(HOUSES_CATALOG[2], -14, 12, false);  // 3-поверховий цегляний дім
    this.spawnPresetOnBoard(HOUSES_CATALOG[5], 14, 12, false);   // 3-поверхова замкова вежа

    this.spawnPresetOnBoard(CARS_CATALOG[0], 0, -14, false);     // Спорткар
    this.spawnPresetOnBoard(CARS_CATALOG[10], 0, 0, false);      // Поліція
    this.spawnPresetOnBoard(CARS_CATALOG[20], 0, 14, false);     // Пожежна
    this.spawnPresetOnBoard(EXTRA_SETS_CATALOG[0], -22, 0, false); // Гелікоптер

    [0, 1, 22, 44, 66, 88].forEach((mIdx, k) => {
      this.placeBrick(MINIFIG_CATALOG[mIdx], LEGO_COLORS[0], -6 + k * 2.5, 0, 6, 0, false);
    });

    this.showToast('Мега-Місто 64×64 готове! Режимом «✋ Рухати» пересувай будинки й машини.');
  }

  loadLDrawModel(urlOrText, isText = false) {
    this.clearAll(true);
    this.showToast('Завантаження з бази LDraw...');
    const loader = new LDrawLoader();
    loader.setPartsLibraryPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/ldraw/officialLibrary/');

    const onLoaded = group => {
      group.rotation.x = Math.PI;
      const box = new THREE.Box3().setFromObject(group);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      group.scale.setScalar(12 / maxDim);

      const scaledBox = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      scaledBox.getCenter(center);
      group.position.set(-center.x, -scaledBox.min.y, -center.z);
      this.bricksGroup.add(group);
      this.showToast('Модель LDraw завантажена!');
    };

    if (isText) loader.parse(urlOrText, onLoaded);
    else loader.load(urlOrText, onLoaded, undefined, () => this.showToast('Помилка мережі. Завантаж .LDR файл!'));
  }

  // ==========================================
  // 11. ІНТЕРФЕЙС ТА ПОДІЇ
  // ==========================================
  setToolMode(mode) {
    this.toolMode = mode;
    document.querySelectorAll('#tool-build, #tool-move, #tool-paint, #tool-delete').forEach(b => b.classList.remove('active'));
    document.getElementById(`tool-${mode}`)?.classList.add('active');

    const moveSub = document.getElementById('move-subbar');
    moveSub.classList.toggle('hidden', mode !== 'move');

    if (mode !== 'move') this.clearSelection();
    if (this.ghostMesh) this.ghostMesh.visible = mode === 'build';
  }

  initUI() {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.buildBaseplate(Number(btn.dataset.size));
      });
    });

    const enterGame = () => {
      document.getElementById('main-menu').classList.add('hidden');
      document.getElementById('hud').classList.remove('hidden');
    };

    document.getElementById('btn-start-sandbox').addEventListener('click', () => {
      enterGame();
      this.showToast('Обирай блоки, 100 машин або 100 будинків знизу!');
    });

    document.getElementById('btn-start-city').addEventListener('click', () => {
      enterGame();
      this.buildStarterMegaCity();
    });

    document.getElementById('btn-open-ldraw').addEventListener('click', () => {
      document.getElementById('ldraw-panel').classList.toggle('hidden');
    });

    document.querySelectorAll('.ldraw-remote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        enterGame();
        this.loadLDrawModel(btn.dataset.url, false);
      });
    });

    document.getElementById('ldraw-file-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        enterGame();
        this.loadLDrawModel(ev.target.result, true);
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      document.getElementById('main-menu').classList.remove('hidden');
      document.getElementById('hud').classList.add('hidden');
    });

    const popovers = [
      { btn: 'toggle-colors-btn', pop: 'popover-colors' },
      { btn: 'toggle-camera-btn', pop: 'popover-camera' },
      { btn: 'toggle-studio-btn', pop: 'popover-studio' }
    ];

    const closeAllPopovers = () => {
      popovers.forEach(({ btn, pop }) => {
        document.getElementById(pop).classList.add('hidden');
        document.getElementById(btn).classList.remove('open');
      });
    };

    popovers.forEach(({ btn, pop }) => {
      document.getElementById(btn).addEventListener('click', e => {
        e.stopPropagation();
        const isCurrentlyHidden = document.getElementById(pop).classList.contains('hidden');
        closeAllPopovers();
        if (isCurrentlyHidden) {
          document.getElementById(pop).classList.remove('hidden');
          document.getElementById(btn).classList.add('open');
        }
      });
    });

    document.querySelectorAll('.close-pop-btn').forEach(btn => {
      btn.addEventListener('click', closeAllPopovers);
    });

    document.querySelectorAll('.cam-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setCameraView(btn.dataset.view));
    });

    const orbitBtn = document.getElementById('btn-auto-orbit');
    orbitBtn.addEventListener('click', () => {
      this.autoOrbit = !this.autoOrbit;
      orbitBtn.classList.toggle('active', this.autoOrbit);
    });

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
        document.getElementById('current-color-dot').style.background = col.hex;
        this.createGhostMesh();
        if (this.activeCategory === 'bricks') this.renderBannerItems();
      });
      paletteEl.appendChild(sw);
    });

    document.getElementById('tool-build').addEventListener('click', () => this.setToolMode('build'));
    document.getElementById('tool-move').addEventListener('click', () => {
      this.setToolMode('move');
      this.showToast('Натисни на машину, будинок або деталь і тягни!');
    });
    document.getElementById('tool-paint').addEventListener('click', () => this.setToolMode('paint'));
    document.getElementById('tool-delete').addEventListener('click', () => this.setToolMode('delete'));

    const rotateAction = () => {
      if (this.toolMode === 'move' && this.selectedBricks.length > 0) {
        this.rotateSelected90();
        return;
      }
      this.currentRotation = (this.currentRotation + 1) % 4;
      if (this.ghostMesh) this.ghostMesh.rotation.y = (this.currentRotation * Math.PI) / 2;
    };
    document.getElementById('btn-rotate').addEventListener('click', rotateAction);

    const scopeBtn = document.getElementById('btn-move-scope');
    scopeBtn.addEventListener('click', () => {
      this.moveWholeGroup = !this.moveWholeGroup;
      scopeBtn.textContent = this.moveWholeGroup ? '🏠 Весь об\'єкт' : '🧱 Одна деталь';
      if (this.selectedBricks.length > 0) {
        this.selectBrickOrGroup(this.selectedBricks[0]);
      }
    });

    document.querySelectorAll('.nudge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.moveSelectedBy(Number(btn.dataset.dx), Number(btn.dataset.dz));
        audio.playSnap(1.05);
      });
    });

    document.getElementById('btn-clone-selected').addEventListener('click', () => this.cloneSelected());
    document.getElementById('btn-deselect').addEventListener('click', () => {
      this.clearSelection();
      audio.playSnap(1.2);
      this.showToast('Позицію зафіксовано!');
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
      if (this.placedBricks.length > 0) this.removeBrick(this.placedBricks[this.placedBricks.length - 1]);
    });
    document.getElementById('btn-clear').addEventListener('click', () => {
      this.clearAll();
      closeAllPopovers();
    });
    document.getElementById('btn-lighting').addEventListener('click', () => this.cycleLighting());
    document.getElementById('btn-explode').addEventListener('click', e => {
      this.isExploded = !this.isExploded;
      e.target.classList.toggle('active', this.isExploded);
    });
    document.getElementById('btn-photo').addEventListener('click', () => {
      closeAllPopovers();
      if (this.ghostMesh) this.ghostMesh.visible = false;
      this.selectionHelper.visible = false;
      this.renderer.render(this.scene, this.camera);
      const a = document.createElement('a');
      a.download = 'DENYS-HANDZIUK-LEGO.png';
      a.href = this.renderer.domElement.toDataURL('image/png');
      a.click();
      if (this.ghostMesh && this.toolMode === 'build') this.ghostMesh.visible = true;
      this.updateSelectionHelper();
      this.showToast('📸 Фото моделі збережено!');
    });

    document.getElementById('btn-save').addEventListener('click', () => {
      const data = this.placedBricks.map(b => ({
        partId: b.part.id,
        groupId: b.groupId,
        colorHex: b.color.hex,
        x: b.x,
        y: b.y,
        z: b.z,
        rot: b.rot
      }));
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
      a.download = 'denys-handziuk-lego-city.json';
      a.click();
      this.showToast('Місто збережено!');
    });

    document.getElementById('json-load-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const items = JSON.parse(ev.target.result);
        this.clearAll(true);
        items.forEach(it => {
          const part = ALL_ITEMS.find(p => p.id === it.partId) || BASE_PARTS[0];
          const color = LEGO_COLORS.find(c => c.hex === it.colorHex) || { name: 'Custom', hex: it.colorHex };
          this.placeBrick(part, color, it.x, it.y, it.z, it.rot, false, it.groupId || null);
        });
        this.showToast('Збережений проект відкрито!');
      };
      reader.readAsText(file);
    });

    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.cat;
        this.activeSubFilter = 'all';
        this.renderSubFilters();
        this.renderBannerItems();
      });
    });

    document.getElementById('part-search').addEventListener('input', () => this.renderBannerItems());

    document.getElementById('btn-spawn-center').addEventListener('click', () => {
      if (this.selectedPart.items) {
        this.spawnPresetOnBoard(this.selectedPart, null, null, true);
      } else {
        const { x, y, z } = this.snapCoordinates(0, 0, this.selectedPart, this.currentRotation);
        this.placeBrick(this.selectedPart, this.selectedColor, x, y, z, this.currentRotation, true);
      }
    });

    const collapseBtn = document.getElementById('btn-collapse-banner');
    collapseBtn.addEventListener('click', () => {
      const collapsed = document.getElementById('parts-banner').classList.toggle('collapsed');
      collapseBtn.textContent = collapsed ? '🔼' : '🔽';
    });

    window.addEventListener('keydown', e => {
      if (e.code === 'KeyR') rotateAction();
      if (e.code === 'ArrowUp') this.moveSelectedBy(0, -1);
      if (e.code === 'ArrowDown') this.moveSelectedBy(0, 1);
      if (e.code === 'ArrowLeft') this.moveSelectedBy(-1, 0);
      if (e.code === 'ArrowRight') this.moveSelectedBy(1, 0);
    });

    const canvas = this.renderer.domElement;
    let downX = 0;
    let downY = 0;
    let downTime = 0;

    canvas.addEventListener('pointerdown', e => {
      closeAllPopovers();
      downX = e.clientX;
      downY = e.clientY;
      downTime = performance.now();

      if (this.toolMode === 'move' && e.button === 0) {
        const hit = this.getRaycastHit(e);
        const hitRec = hit ? this.findRecordFromObject(hit.object) : null;
        if (hitRec) {
          if (!this.selectedBricks.includes(hitRec)) {
            this.selectBrickOrGroup(hitRec);
          }
          this.isDraggingSelection = true;
          this.controls.enabled = false;
          this.dragPlane.constant = -hit.point.y;
          this.dragAnchorPoint.copy(hit.point);
          return;
        }
      }

      this.updateGhostFromPointer(e);
    });

    canvas.addEventListener('pointermove', e => {
      if (this.isDraggingSelection && this.selectedBricks.length > 0) {
        const rect = canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const target = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.dragPlane, target)) {
          const dx = Math.round(target.x - this.dragAnchorPoint.x);
          const dz = Math.round(target.z - this.dragAnchorPoint.z);
          if (dx !== 0 || dz !== 0) {
            this.moveSelectedBy(dx, dz);
            this.dragAnchorPoint.x += dx;
            this.dragAnchorPoint.z += dz;
          }
        }
        return;
      }

      this.updateGhostFromPointer(e);
    });

    canvas.addEventListener('pointerup', e => {
      if (this.isDraggingSelection) {
        this.isDraggingSelection = false;
        this.controls.enabled = true;
        audio.playSnap(1.05);
        return;
      }

      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      const elapsed = performance.now() - downTime;
      if (dist < 10 && elapsed < 360) {
        this.handleCanvasTap(e);
      }
    });

    canvas.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderSubFilters();
    this.renderBannerItems();
  }

  renderSubFilters() {
    const bar = document.getElementById('subfilter-bar');
    const filtersMap = {
      bricks: [
        { id: 'all', label: 'Усі блоки' },
        { id: 'cubes', label: 'Кубики' },
        { id: 'plates', label: 'Пластини' },
        { id: 'slopes', label: 'Скоси/Дахи' },
        { id: 'special', label: 'Вікна/Колеса/Декор' }
      ],
      cars: [
        { id: 'all', label: 'Усі (100)' },
        { id: 'sport', label: 'Спорткари' },
        { id: 'police', label: 'Поліція' },
        { id: 'fire', label: 'Пожежні' },
        { id: 'jeep', label: 'Джипи' },
        { id: 'truck', label: 'Вантажівки' },
        { id: 'f1', label: 'Боліди F1' },
        { id: 'cyber', label: 'Кібер' },
        { id: 'bus', label: 'Автобуси' }
      ],
      houses: [
        { id: 'all', label: 'Усі (100)' },
        { id: 'f1', label: '1 Поверх' },
        { id: 'f2', label: '2 Поверхи' },
        { id: 'f3', label: '3 Поверхи' }
      ],
      sets: [
        { id: 'all', label: 'Усі (32)' },
        { id: 'air', label: 'Гелікоптери' },
        { id: 'space', label: 'Космос' },
        { id: 'city_decor', label: 'Місто і Парк' },
        { id: 'mech_boat', label: 'Роботи і Катери' }
      ],
      minifigs: [
        { id: 'all', label: 'Усі (132)' },
        { id: 'city', label: 'Місто' },
        { id: 'space', label: 'Космос' },
        { id: 'castle', label: 'Лицарі' },
        { id: 'ninja', label: 'Ніндзя' },
        { id: 'pirate', label: 'Пірати' },
        { id: 'hero', label: 'Герої' }
      ]
    };

    const list = filtersMap[this.activeCategory] || [];
    bar.innerHTML = '';
    list.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'sub-pill' + (this.activeSubFilter === f.id ? ' active' : '');
      btn.textContent = f.label;
      btn.addEventListener('click', () => {
        this.activeSubFilter = f.id;
        this.renderSubFilters();
        this.renderBannerItems();
      });
      bar.appendChild(btn);
    });
  }

  getCardIconHTML(item) {
    if (item.cat === 'cars') {
      return `<svg width="56" height="36" viewBox="0 0 56 36">
        <rect x="6" y="15" width="44" height="10" rx="3" fill="${item.primaryColor}" stroke="#fff" stroke-width="1.2"/>
        <rect x="16" y="8" width="22" height="8" rx="2" fill="${item.secondaryColor}" stroke="#fff" stroke-width="1"/>
        <circle cx="16" cy="26" r="5" fill="#18181B" stroke="#C0C5CE" stroke-width="1.5"/>
        <circle cx="40" cy="26" r="5" fill="#18181B" stroke="#C0C5CE" stroke-width="1.5"/>
      </svg>`;
    }
    if (item.cat === 'houses') {
      const h = item.floors === 3 ? 22 : (item.floors === 2 ? 17 : 12);
      const y = 32 - h;
      return `<svg width="56" height="36" viewBox="0 0 56 36">
        <polygon points="8,${y} 28,3 48,${y}" fill="${item.secondaryColor}" stroke="#fff" stroke-width="1"/>
        <rect x="12" y="${y}" width="32" height="${h}" fill="${item.primaryColor}" stroke="#fff" stroke-width="1"/>
        <rect x="24" y="22" width="8" height="10" fill="#6B3E26"/>
        <rect x="15" y="${y + 3}" width="6" height="5" fill="#88D8FF"/>
        <rect x="35" y="${y + 3}" width="6" height="5" fill="#88D8FF"/>
      </svg>`;
    }
    if (item.cat === 'sets') {
      return `<svg width="56" height="36" viewBox="0 0 56 36">
        <rect x="12" y="12" width="32" height="16" rx="4" fill="${item.primaryColor}" stroke="#fff" stroke-width="1.2"/>
        <polygon points="28,4 38,12 18,12" fill="${item.secondaryColor}"/>
      </svg>`;
    }
    if (item.cat === 'minifigs') {
      const cfg = item.mfConfig;
      return `<svg width="46" height="38" viewBox="0 0 46 38">
        <rect x="13" y="26" width="8" height="10" rx="1.5" fill="${cfg.legColor}"/>
        <rect x="25" y="26" width="8" height="10" rx="1.5" fill="${cfg.legColor}"/>
        <rect x="11" y="13" width="24" height="13" rx="2.5" fill="${cfg.torsoColor}" stroke="#fff" stroke-width="0.8"/>
        <rect x="16" y="4" width="14" height="9" rx="3" fill="${cfg.headColor}"/>
      </svg>`;
    }
    return `<svg width="48" height="36" viewBox="0 0 48 36">
      <rect x="6" y="10" width="36" height="20" rx="3" fill="${this.selectedColor.hex}" stroke="#fff" stroke-width="1.4"/>
      <rect x="11" y="5" width="8" height="5" rx="1" fill="${this.selectedColor.hex}" stroke="#fff" stroke-width="1.1"/>
      <rect x="29" y="5" width="8" height="5" rx="1" fill="${this.selectedColor.hex}" stroke="#fff" stroke-width="1.1"/>
    </svg>`;
  }

  renderBannerItems() {
    const container = document.getElementById('banner-items');
    const query = document.getElementById('part-search').value.trim().toLowerCase();
    container.innerHTML = '';

    const filtered = ALL_ITEMS.filter(item => {
      if (query) return item.name.toLowerCase().includes(query);
      if (item.cat !== this.activeCategory) return false;
      if (this.activeSubFilter !== 'all' && item.subCat !== this.activeSubFilter) return false;
      return true;
    });

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'part-card' + (this.selectedPart.id === item.id ? ' active' : '');
      const dimsLabel = item.cat === 'minifigs' ? 'Фігурка'
        : (item.cat === 'houses' ? `${item.floors} пов. • ${item.w}×${item.d}` : `${item.w}×${item.d}`);

      card.innerHTML = `
        <div class="part-icon">${this.getCardIconHTML(item)}</div>
        <div class="part-name">${item.name}</div>
        <div class="part-dims">${dimsLabel}</div>
      `;

      card.addEventListener('click', () => {
        this.selectedPart = item;
        if (item.items) {
          this.spawnPresetOnBoard(item, null, null, true);
        } else {
          this.setToolMode('build');
          this.createGhostMesh();
        }
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
      if (curr.userData?.brickRecord) return curr.userData.brickRecord;
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
    const normal = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 1, 0);
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

    if (e.button === 0 && this.toolMode === 'move') {
      this.selectBrickOrGroup(hitRecord);
      return;
    }

    if (e.button === 0 && this.toolMode === 'paint') {
      if (hitRecord) {
        const idx = this.placedBricks.indexOf(hitRecord);
        this.bricksGroup.remove(hitRecord.mesh);
        this.placedBricks.splice(idx, 1);
        this.placeBrick(hitRecord.part, this.selectedColor, hitRecord.x, hitRecord.y, hitRecord.z, hitRecord.rot, true, hitRecord.groupId);
      }
      return;
    }

    if (e.button === 0 && this.toolMode === 'build') {
      if (this.selectedPart.items) {
        const snapped = this.snapCoordinates(hit.point.x, hit.point.z, { w: 2, d: 2 }, 0);
        this.spawnPresetOnBoard(this.selectedPart, snapped.x, snapped.z, true);
        return;
      }
      this.updateGhostFromPointer(e);
      if (this.ghostMesh?.visible) {
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
    this.toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.cameraTween) {
      this.cameraTween.progress += 0.065;
      const t = Math.min(1, this.cameraTween.progress);
      const ease = 1 - Math.pow(1 - t, 3);
      this.camera.position.lerpVectors(this.cameraTween.startPos, this.cameraTween.endPos, ease);
      this.controls.target.lerp(new THREE.Vector3(0, 1.5, 0), ease);
      if (t >= 1) this.cameraTween = null;
    }

    if (this.autoOrbit) {
      const angle = 0.008;
      const x = this.camera.position.x;
      const z = this.camera.position.z;
      this.camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
      this.camera.position.z = z * Math.cos(angle) + x * Math.sin(angle);
    }

    this.controls.update();

    const targetExplode = this.isExploded ? 1 : 0;
    if (Math.abs(this.explodeProgress - targetExplode) > 0.005) {
      this.explodeProgress += (targetExplode - this.explodeProgress) * 0.1;
      for (const b of this.placedBricks) {
        b.mesh.position.y = b.y + b.y * 0.85 * this.explodeProgress;
      }
    }

    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      anim.progress += 0.095;
      if (anim.type === 'drop') {
        const t = Math.min(1, anim.progress);
        const ease = 1 - Math.pow(1 - t, 3);
        anim.mesh.position.y = anim.startY + (anim.targetY - anim.startY) * ease;
        const squash = t < 0.8 ? 1 : 1 - Math.sin((t - 0.8) * Math.PI * 5) * 0.06;
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

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;
      p.vy -= 0.012;
      p.life -= 0.05;
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
