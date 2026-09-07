import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Difficulty, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Development seed.
 *
 * Populates the database with a predictable, reasonably large data set so the
 * app can be run end-to-end without manual setup. Safe to run multiple times:
 * it wipes the domain tables first and then recreates everything.
 *
 * Default login created by this seed:
 *   email:    notelab@gmail.com
 *   password: 12345678
 *   role:     ADMIN
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is required to run the seed',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const PASSWORD_PLAIN = '12345678';
const BCRYPT_ROUNDS = 10;

// Placeholder video used on every lesson, just for representation.
const LESSON_VIDEO_URL = 'https://youtu.be/dQw4w9WgXcQ';

const CATEGORY_NAMES = [
  'guitarra',
  'contrabaixo',
  'piano',
  'bateria',
  'teclado',
  'jazz',
  'violão',
  'vocal',
  'rock',
  'blues',
];

type SeedUser = {
  email: string;
  name: string;
  role: Role;
};

const USERS: SeedUser[] = [
  { email: 'notelab@gmail.com', name: 'NoteLab Admin', role: Role.ADMIN },
  {
    email: 'instrutor@notelab.com',
    name: 'Ana Instrutora',
    role: Role.INSTRUCTOR,
  },
  {
    email: 'carlos@notelab.com',
    name: 'Carlos Instrutor',
    role: Role.INSTRUCTOR,
  },
  { email: 'bruna@notelab.com', name: 'Bruna Mendes', role: Role.INSTRUCTOR },
  { email: 'diego@notelab.com', name: 'Diego Rocha', role: Role.INSTRUCTOR },
  { email: 'aluno@notelab.com', name: 'João Aluno', role: Role.STUDENT },
  { email: 'maria@notelab.com', name: 'Maria Aluna', role: Role.STUDENT },
  { email: 'pedro@notelab.com', name: 'Pedro Santos', role: Role.STUDENT },
  { email: 'julia@notelab.com', name: 'Julia Lima', role: Role.STUDENT },
  { email: 'rafael@notelab.com', name: 'Rafael Costa', role: Role.STUDENT },
];

const INSTRUCTOR_EMAILS = USERS.filter(u => u.role === Role.INSTRUCTOR).map(
  u => u.email,
);
const STUDENT_EMAILS = USERS.filter(u => u.role === Role.STUDENT).map(
  u => u.email,
);

async function clearDatabase(): Promise<void> {
  // Order matters because of foreign keys; onDelete: Cascade covers the rest.
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.courseCategory.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.approveInstructorRequest.deleteMany();
  await prisma.passwordRequest.deleteMany();
  await prisma.userBio.deleteMany();
  await prisma.user.deleteMany();
}

async function seedCategories(): Promise<Map<string, number>> {
  const byName = new Map<string, number>();

  for (const name of CATEGORY_NAMES) {
    const category = await prisma.category.create({ data: { name } });
    byName.set(name, category.id);
  }

  return byName;
}

async function seedUsers(): Promise<Map<string, string>> {
  const passwordHash = await bcrypt.hash(PASSWORD_PLAIN, BCRYPT_ROUNDS);
  const byEmail = new Map<string, string>();

  for (const user of USERS) {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: passwordHash,
        role: user.role,
        cart: { create: {} },
        userBio: {
          create: {
            bio: `Conta de demonstração (${user.role.toLowerCase()}).`,
          },
        },
      },
    });

    byEmail.set(user.email, created.id);
  }

  return byEmail;
}

/* -------------------------------------------------------------------------- */
/*  Course catalog                                                            */
/* -------------------------------------------------------------------------- */

type Track = 'strings' | 'keys' | 'percussion' | 'voice' | 'theory';

type CourseBlueprint = {
  name: string;
  description: string;
  price: number;
  difficulty: Difficulty;
  categories: string[];
  track: Track;
};

const CATALOG: CourseBlueprint[] = [
  // ---- Violão / Guitarra (strings) ----
  {
    name: 'Violão do Zero',
    description: 'Primeiros acordes, ritmos e músicas simples no violão.',
    price: 49.9,
    difficulty: Difficulty.BEGINNER,
    categories: ['violão'],
    track: 'strings',
  },
  {
    name: 'Violão Popular Brasileiro',
    description:
      'Bossa nova, samba e MPB: levadas, batidas e condução de acordes.',
    price: 129.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['violão'],
    track: 'strings',
  },
  {
    name: 'Fingerstyle na Prática',
    description:
      'Arranjos solo no violão: melodia, baixo e harmonia ao mesmo tempo.',
    price: 219.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['violão'],
    track: 'strings',
  },
  {
    name: 'Guitarra Iniciante',
    description: 'Postura, palhetada, acordes com pestana e primeiros riffs.',
    price: 49.9,
    difficulty: Difficulty.BEGINNER,
    categories: ['guitarra', 'rock'],
    track: 'strings',
  },
  {
    name: 'Guitarra Rock: Riffs e Solos',
    description:
      'Power chords, bends, vibrato, pentatônica e fraseado de rock.',
    price: 149.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['guitarra', 'rock'],
    track: 'strings',
  },
  {
    name: 'Guitarra Blues',
    description:
      'Shuffle, turnarounds, call-and-response e a linguagem do blues.',
    price: 139.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['guitarra', 'blues'],
    track: 'strings',
  },
  {
    name: 'Guitarra Avançada: Técnica e Improviso',
    description: 'Sweep, legato, tapping e improviso sobre progressões modais.',
    price: 279.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['guitarra'],
    track: 'strings',
  },
  {
    name: 'Contrabaixo do Zero',
    description: 'Time, mão direita, tablatura e as primeiras linhas de baixo.',
    price: 44.9,
    difficulty: Difficulty.BEGINNER,
    categories: ['contrabaixo'],
    track: 'strings',
  },
  {
    name: 'Groove no Baixo',
    description: 'Ghost notes, síncope e como travar com a bateria.',
    price: 119.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['contrabaixo', 'rock'],
    track: 'strings',
  },
  {
    name: 'Walking Bass no Jazz',
    description:
      'Construção de walking bass sobre standards e condução de vozes.',
    price: 229.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['contrabaixo', 'jazz'],
    track: 'strings',
  },

  // ---- Piano / Teclado (keys) ----
  {
    name: 'Piano para Iniciantes',
    description: 'Leitura, dedilhado, mãos juntas e primeiras peças.',
    price: 54.9,
    difficulty: Difficulty.BEGINNER,
    categories: ['piano'],
    track: 'keys',
  },
  {
    name: 'Piano Popular',
    description:
      'Cifras, campo harmônico e acompanhamento de músicas populares.',
    price: 149.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['piano', 'teclado'],
    track: 'keys',
  },
  {
    name: 'Piano Clássico Intermediário',
    description: 'Estudos, dinâmica, pedal e repertório do período romântico.',
    price: 169.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['piano'],
    track: 'keys',
  },
  {
    name: 'Piano Jazz: Voicings e Comping',
    description:
      'Voicings de 3ª e 7ª, rootless, comping e introdução ao improviso.',
    price: 289.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['piano', 'jazz'],
    track: 'keys',
  },
  {
    name: 'Teclado em Bandas',
    description: 'Timbres, camadas, naipes e o papel do teclado no arranjo.',
    price: 109.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['teclado', 'rock'],
    track: 'keys',
  },
  {
    name: 'Blues no Piano',
    description: 'Escala blues, licks, baixo de mão esquerda e boogie-woogie.',
    price: 129.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['piano', 'blues'],
    track: 'keys',
  },

  // ---- Bateria (percussion) ----
  {
    name: 'Bateria do Zero',
    description: 'Postura, empunhadura, leitura rítmica e o primeiro groove.',
    price: 49.9,
    difficulty: Difficulty.BEGINNER,
    categories: ['bateria'],
    track: 'percussion',
  },
  {
    name: 'Bateria: Groove e Independência',
    description: 'Subdivisões, independência de membros e viradas musicais.',
    price: 159.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['bateria', 'rock'],
    track: 'percussion',
  },
  {
    name: 'Bateria no Rock',
    description: 'Grooves de rock, fills, dinâmica e tocar com a banda.',
    price: 139.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['bateria', 'rock'],
    track: 'percussion',
  },
  {
    name: 'Bateria Jazz: Swing e Comping',
    description: 'Ride de swing, comping de caixa e bumbo, brushes e trading.',
    price: 239.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['bateria', 'jazz'],
    track: 'percussion',
  },

  // ---- Canto (voice) ----
  {
    name: 'Canto para Iniciantes',
    description: 'Respiração, apoio, afinação e aquecimento vocal.',
    price: 39.9,
    difficulty: Difficulty.BEGINNER,
    categories: ['vocal'],
    track: 'voice',
  },
  {
    name: 'Técnica Vocal Intermediária',
    description: 'Ressonância, registros, passagem e saúde vocal.',
    price: 119.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['vocal'],
    track: 'voice',
  },
  {
    name: 'Interpretação e Estilo',
    description: 'Fraseado, dinâmica, ornamentação e presença de palco.',
    price: 199.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['vocal', 'jazz'],
    track: 'voice',
  },

  // ---- Teoria (theory) ----
  {
    name: 'Teoria Musical Essencial',
    description: 'Notas, ritmo, intervalos, escalas e leitura de partitura.',
    price: 0,
    difficulty: Difficulty.BEGINNER,
    categories: ['piano'],
    track: 'theory',
  },
  {
    name: 'Harmonia Funcional',
    description:
      'Campo harmônico, funções, dominantes secundárias e reharmonização.',
    price: 159.9,
    difficulty: Difficulty.INTERMEDIATE,
    categories: ['jazz', 'piano'],
    track: 'theory',
  },
  {
    name: 'Improvisação no Jazz',
    description: 'Modos, arpejos, guide tones e vocabulário sobre II-V-I.',
    price: 209.9,
    difficulty: Difficulty.ADVANCED,
    categories: ['jazz', 'guitarra'],
    track: 'theory',
  },
];

/* -------------------------------------------------------------------------- */
/*  Module / lesson generation                                                */
/* -------------------------------------------------------------------------- */

type ModuleSpec = {
  name: string;
  lessons: { title: string; description: string; videoUrl: string }[];
};

const MODULE_TOPICS: Record<Track, string[]> = {
  strings: [
    'Fundamentos',
    'Mão esquerda',
    'Mão direita e ritmo',
    'Acordes e progressões',
    'Improviso e fraseado',
    'Repertório',
  ],
  keys: [
    'Fundamentos',
    'Leitura e técnica',
    'Harmonia ao teclado',
    'Acompanhamento',
    'Improviso',
    'Repertório',
  ],
  percussion: [
    'Fundamentos',
    'Rudimentos',
    'Grooves',
    'Independência',
    'Viradas e dinâmica',
    'Tocando com a banda',
  ],
  voice: [
    'Respiração e apoio',
    'Afinação e ouvido',
    'Ressonância e registros',
    'Dicção e fraseado',
    'Interpretação',
    'Repertório',
  ],
  theory: [
    'Ritmo e leitura',
    'Intervalos e escalas',
    'Tríades e tétrades',
    'Campo harmônico',
    'Análise',
    'Aplicação prática',
  ],
};

const LESSON_TEMPLATES: {
  title: (t: string) => string;
  desc: (t: string) => string;
}[] = [
  {
    title: t => `${t}: conceitos`,
    desc: t => `Visão geral de ${t.toLowerCase()} e por que isso importa.`,
  },
  {
    title: t => `${t}: exercícios guiados`,
    desc: t => `Exercícios progressivos de ${t.toLowerCase()} com metrônomo.`,
  },
  {
    title: t => `${t}: aplicando numa música`,
    desc: t => `Como usar ${t.toLowerCase()} num trecho real de repertório.`,
  },
  {
    title: t => `${t}: erros comuns`,
    desc: t =>
      `Os deslizes mais frequentes em ${t.toLowerCase()} e como corrigir.`,
  },
  {
    title: t => `${t}: desafio da semana`,
    desc: t => `Um estudo para consolidar ${t.toLowerCase()}.`,
  },
];

// Deterministic pseudo-random so the seed is reproducible.
function makeRng(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function buildModules(blueprint: CourseBlueprint, index: number): ModuleSpec[] {
  const rng = makeRng(index + 1);
  const topics = MODULE_TOPICS[blueprint.track];
  const moduleCount = 3 + Math.floor(rng() * 3); // 3–5 modules

  return Array.from({ length: moduleCount }, (_, m) => {
    const topic = topics[m % topics.length];
    const lessonCount = 3 + Math.floor(rng() * 3); // 3–5 lessons

    return {
      name: `Módulo ${m + 1} — ${topic}`,
      lessons: Array.from({ length: lessonCount }, (_, l) => {
        const template = LESSON_TEMPLATES[l % LESSON_TEMPLATES.length];
        return {
          title: template.title(topic),
          description: template.desc(topic),
          videoUrl: LESSON_VIDEO_URL,
        };
      }),
    };
  });
}

/* -------------------------------------------------------------------------- */
/*  Persistence                                                               */
/* -------------------------------------------------------------------------- */

async function seedCourses(
  usersByEmail: Map<string, string>,
  categoriesByName: Map<string, number>,
): Promise<{ id: string; name: string }[]> {
  const created: { id: string; name: string }[] = [];
  let totalModules = 0;
  let totalLessons = 0;

  for (let i = 0; i < CATALOG.length; i++) {
    const blueprint = CATALOG[i];
    const instructorEmail = INSTRUCTOR_EMAILS[i % INSTRUCTOR_EMAILS.length];
    const instructorId = usersByEmail.get(instructorEmail);

    if (!instructorId) {
      throw new Error(`Instructor not found for course "${blueprint.name}"`);
    }

    const modules = buildModules(blueprint, i);
    totalModules += modules.length;
    totalLessons += modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

    const course = await prisma.course.create({
      data: {
        name: blueprint.name,
        description: blueprint.description,
        price: blueprint.price,
        difficulty: blueprint.difficulty,
        instructorId,
        categories: {
          create: blueprint.categories.map(categoryName => {
            const categoryId = categoriesByName.get(categoryName);
            if (!categoryId) {
              throw new Error(`Category "${categoryName}" was not seeded`);
            }
            return { categoryId };
          }),
        },
        modules: {
          create: modules.map(mod => ({
            name: mod.name,
            lessons: { create: mod.lessons },
          })),
        },
      },
    });

    created.push({ id: course.id, name: course.name });
  }

  console.log(
    `    (${totalModules} modules, ${totalLessons} lessons across ${created.length} courses)`,
  );
  return created;
}

async function seedEnrollments(
  usersByEmail: Map<string, string>,
  courses: { id: string; name: string }[],
): Promise<void> {
  let count = 0;

  // Each student is enrolled in a rotating slice of the catalog so every
  // course has some enrollments and every student has a populated dashboard.
  for (let s = 0; s < STUDENT_EMAILS.length; s++) {
    const userId = usersByEmail.get(STUDENT_EMAILS[s]);
    if (!userId) continue;

    const rng = makeRng(100 + s);
    const enrollCount = 4 + Math.floor(rng() * 4); // 4–7 courses per student
    const offset = s * 3;

    for (let k = 0; k < enrollCount; k++) {
      const course = courses[(offset + k) % courses.length];
      await prisma.enrollment.create({
        data: { userId, courseId: course.id },
      });
      count++;
    }
  }

  console.log(`  ✓ ${count} enrollments`);
}

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  await clearDatabase();
  console.log('  ✓ cleared existing data');

  const categoriesByName = await seedCategories();
  console.log(`  ✓ ${categoriesByName.size} categories`);

  const usersByEmail = await seedUsers();
  console.log(
    `  ✓ ${usersByEmail.size} users ` +
      `(${INSTRUCTOR_EMAILS.length} instructors, ${STUDENT_EMAILS.length} students)`,
  );

  const courses = await seedCourses(usersByEmail, categoriesByName);
  console.log(`  ✓ ${courses.length} courses`);

  await seedEnrollments(usersByEmail, courses);

  console.log('\n✅ Seed completed.');
  console.log('   Default login → notelab@gmail.com / 12345678 (ADMIN)');
}

main()
  .catch(error => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
