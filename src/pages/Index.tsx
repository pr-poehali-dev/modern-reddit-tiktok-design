import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Page = "home" | "feed" | "profile" | "menu";

const CURRENT_USER = {
  name: "Алексей Громов",
  handle: "@agromov",
  initials: "АГ",
  followers: 1240,
  following: 389,
  posts: 87,
  bio: "Разработчик, дизайнер, любитель тёмных тем и качественного контента.",
};

const POSTS = [
  {
    id: 1,
    user: { name: "Мария Иванова", handle: "@mariia_iv", initials: "МИ" },
    community: "Дизайн & UI",
    time: "2 мин",
    text: "Пробовала новый подход к тёмным интерфейсам — ключ в том, чтобы не использовать чистый чёрный (#000). Мягкие угольные тона гораздо комфортнее для глаз.",
    tags: ["#дизайн", "#UX", "#тёмнаятема"],
    likes: 248,
    comments: 34,
    reposts: 12,
    liked: false,
    score: 1840,
    bg: "from-violet-900/40 to-indigo-900/20",
  },
  {
    id: 2,
    user: { name: "Дмитрий Кравцов", handle: "@dkravtsov", initials: "ДК" },
    community: "Технологии",
    time: "15 мин",
    text: "Алгоритм рекомендаций — это не магия. Это матрица схожести интересов + сигналы взаимодействий. Чем больше осознанных действий, тем точнее лента.",
    tags: ["#алгоритмы", "#ML", "#рекомендации"],
    likes: 512,
    comments: 89,
    reposts: 47,
    liked: true,
    score: 5120,
    bg: "from-blue-900/40 to-cyan-900/20",
  },
  {
    id: 3,
    user: { name: "Анна Белова", handle: "@abelova", initials: "АБ" },
    community: "Фотография",
    time: "1 ч",
    text: "Золотой час сегодня был просто невероятным. Снял серию на плёночную камеру — буду делиться результатами, когда проявлю.",
    tags: ["#фото", "#плёнка", "#закат"],
    likes: 1024,
    comments: 156,
    reposts: 83,
    liked: false,
    score: 12300,
    bg: "from-orange-900/40 to-amber-900/20",
  },
  {
    id: 4,
    user: { name: "Игорь Смирнов", handle: "@igor_sm", initials: "ИС" },
    community: "Стартапы",
    time: "3 ч",
    text: "Запустили бета-версию нашего продукта. 500 пользователей за первые 6 часов без рекламы — только сарафанное радио. Главный урок: решайте реальную боль.",
    tags: ["#стартап", "#продукт", "#запуск"],
    likes: 2100,
    comments: 341,
    reposts: 198,
    liked: false,
    score: 21000,
    bg: "from-emerald-900/40 to-teal-900/20",
  },
  {
    id: 5,
    user: { name: "Саша Новикова", handle: "@sasha_nov", initials: "СН" },
    community: "Музыка",
    time: "5 ч",
    text: "Записали первый трек с новым синтезатором. Звучание просто космос — тёплый аналоговый звук в сочетании с цифровыми текстурами.",
    tags: ["#музыка", "#синт", "#запись"],
    likes: 763,
    comments: 44,
    reposts: 31,
    liked: false,
    score: 4200,
    bg: "from-pink-900/40 to-rose-900/20",
  },
  {
    id: 6,
    user: { name: "Иван Кулик", handle: "@ivan_k", initials: "ИК" },
    community: "Кино & Сериалы",
    time: "8 ч",
    text: "Пересмотрел «Дюну» в четвёртый раз. С каждым разом замечаю всё больше деталей в операторской работе Грига Фрейзера. Шедевр визуального повествования.",
    tags: ["#кино", "#дюна", "#кинематограф"],
    likes: 891,
    comments: 127,
    reposts: 56,
    liked: false,
    score: 6700,
    bg: "from-yellow-900/40 to-amber-900/20",
  },
];

const COMMUNITIES = [
  { id: 1, name: "Дизайн & UI", members: 12400, posts: 890, joined: true, icon: "Palette" },
  { id: 2, name: "Технологии", members: 45200, posts: 3210, joined: true, icon: "Cpu" },
  { id: 3, name: "Фотография", members: 8900, posts: 540, joined: false, icon: "Camera" },
  { id: 4, name: "Стартапы", members: 23100, posts: 1780, joined: false, icon: "Rocket" },
  { id: 5, name: "Музыка", members: 31000, posts: 2100, joined: false, icon: "Music" },
  { id: 6, name: "Кино & Сериалы", members: 18700, posts: 1430, joined: true, icon: "Film" },
];

const MESSAGES = [
  { id: 1, user: { name: "Мария Иванова", initials: "МИ" }, last: "Привет! Видела твой последний пост...", time: "2м", unread: 3, online: true },
  { id: 2, user: { name: "Дмитрий Кравцов", initials: "ДК" }, last: "Да, согласен насчёт алгоритмов", time: "1ч", unread: 0, online: true },
  { id: 3, user: { name: "Игорь Смирнов", initials: "ИС" }, last: "Спасибо за поддержку 🙌", time: "3ч", unread: 1, online: false },
  { id: 4, user: { name: "Анна Белова", initials: "АБ" }, last: "Скину фото, как только проявлю", time: "вчера", unread: 0, online: false },
];

const ACHIEVEMENTS = [
  { icon: "Flame", label: "Серия 7 дней", color: "text-orange-400" },
  { icon: "Star", label: "Топ автор", color: "text-yellow-400" },
  { icon: "Users", label: "Инфлюенсер", color: "text-indigo-400" },
  { icon: "Zap", label: "Первый пост", color: "text-green-400" },
];

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "к";
  return String(n);
}

// ─── HOME PAGE (Reddit-style grid) ───────────────────────────────────────────

function HomePage() {
  const [posts, setPosts] = useState(POSTS);
  const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
  const [newPost, setNewPost] = useState("");
  const [composing, setComposing] = useState(false);

  const handleLike = (id: number) => {
    setPosts(p => p.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1, score: post.liked ? post.score - 10 : post.score + 10 }
        : post
    ));
  };

  const sorted = [...posts].sort((a, b) =>
    sort === "top" ? b.score - a.score : sort === "new" ? b.id - a.id : b.score - a.score
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-mono-accent">N</span>
            </div>
            <span className="text-base font-bold tracking-tight">Nexus</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all">
              <Icon name="Bell" size={18} />
            </button>
            <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all">
              <Icon name="Search" size={18} />
            </button>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-1 p-0.5 rounded-xl bg-secondary/50">
          {(["hot", "new", "top"] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${sort === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Icon name={s === "hot" ? "Flame" : s === "new" ? "Sparkles" : "TrendingUp"} size={12} />
              {s === "hot" ? "Горячее" : s === "new" ? "Новое" : "Топ"}
            </button>
          ))}
        </div>
      </div>

      {/* Compose button */}
      <div className="px-4 pt-3 pb-2">
        {!composing ? (
          <button onClick={() => setComposing(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border text-muted-foreground/60 text-sm hover:border-primary/30 transition-all text-left">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>
            Поделитесь чем-нибудь...
          </button>
        ) : (
          <div className="rounded-2xl bg-card border border-primary/30 p-4 animate-fade-in">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="Что у вас нового?" rows={3} autoFocus
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none leading-relaxed" />
            <div className="flex items-center gap-2 pt-3 border-t border-border/60 mt-2">
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-lg hover:bg-secondary transition-all">
                <Icon name="Image" size={13} /> Фото
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-lg hover:bg-secondary transition-all">
                <Icon name="Hash" size={13} /> Тег
              </button>
              <div className="ml-auto flex gap-2">
                <button onClick={() => setComposing(false)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                  Отмена
                </button>
                <button className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all">
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reddit-style post grid */}
      <div className="px-4 flex flex-col gap-2">
        {sorted.map(post => (
          <div key={post.id} className={`rounded-2xl border border-border bg-gradient-to-br ${post.bg} bg-card overflow-hidden animate-fade-in hover:border-primary/25 transition-all cursor-pointer`}>
            {/* Score bar + meta */}
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              {/* Upvote column */}
              <div className="flex flex-col items-center gap-0.5 mr-1">
                <button onClick={() => handleLike(post.id)}
                  className={`p-1 rounded-lg transition-all ${post.liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                  <Icon name="ChevronUp" size={16} className={post.liked ? "stroke-[2.5]" : ""} />
                </button>
                <span className={`text-[11px] font-bold font-mono-accent ${post.liked ? "text-primary" : "text-muted-foreground"}`}>
                  {formatNumber(post.score)}
                </span>
                <button className="p-1 rounded-lg text-muted-foreground hover:text-orange-400 transition-all">
                  <Icon name="ChevronDown" size={16} />
                </button>
              </div>

              {/* Community + time */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0 font-medium border-0 bg-primary/15 text-primary/80">
                    {post.community}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/60">·</span>
                  <span className="text-[10px] text-muted-foreground">{post.user.handle}</span>
                  <span className="text-[10px] text-muted-foreground/60">·</span>
                  <span className="text-[10px] text-muted-foreground">{post.time}</span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="px-4 pb-2">
              <p className="text-sm leading-relaxed text-foreground/90">{post.text}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map(t => (
                  <span key={t} className="text-[11px] text-primary/60 hover:text-primary transition-colors font-mono-accent cursor-pointer">{t}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-3 pb-3 flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all">
                <Icon name="MessageSquare" size={13} />
                {formatNumber(post.comments)}
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-white/5 hover:text-green-400 transition-all">
                <Icon name="Repeat2" size={13} />
                {formatNumber(post.reposts)}
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-white/5 hover:text-primary transition-all ml-auto">
                <Icon name="Bookmark" size={13} />
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-white/5 hover:text-primary transition-all">
                <Icon name="Share2" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEED DATA (длинные тексты для режима чтения) ────────────────────────────

const FEED_ARTICLES = [
  {
    id: 1,
    community: "Дизайн & UI",
    user: { name: "Мария Иванова", handle: "@mariia_iv", initials: "МИ" },
    time: "2 мин",
    title: "Тёмные интерфейсы: почему угольный лучше чёрного",
    subtitle: "Руководство по комфортному дизайну",
    body: [
      { type: "p", text: "В эпоху цифровых экранов мы проводим за ними по 8–12 часов в сутки. Выбор цветовой схемы напрямую влияет на усталость глаз — и здесь скрывается один из главных мифов дизайна." },
      { type: "h2", text: "Почему #000 — плохая идея" },
      { type: "p", text: "Чистый чёрный (#000000) создаёт максимальный контраст с белым текстом. Это звучит хорошо в теории, но на практике вызывает эффект «ореола» — глаза постоянно адаптируются к резкому переходу." },
      { type: "h2", text: "Правильный подход" },
      { type: "p", text: "Используйте оттенки с лёгким цветовым смещением: тёмно-синие (#0d1117), угольные (#1a1a2e) или тёплые тёмно-серые (#1c1917). Они создают комфортную среду для длительного чтения." },
      { type: "p", text: "Nexus использует именно такой подход — фон #0e0f13 с лёгким холодным смещением. Это снижает нагрузку на глаза при длительном просмотре контента." },
    ],
    tags: ["#дизайн", "#UX", "#тёмнаятема"],
    likes: 248, comments: 34, reposts: 12, liked: false, saved: false,
    accentColor: "from-violet-500/20 to-indigo-500/10",
    dotColor: "bg-violet-400",
  },
  {
    id: 2,
    community: "Технологии",
    user: { name: "Дмитрий Кравцов", handle: "@dkravtsov", initials: "ДК" },
    time: "15 мин",
    title: "Алгоритм рекомендаций: как он знает, что тебе понравится",
    subtitle: "Разбираем персонализацию изнутри",
    body: [
      { type: "p", text: "Каждый раз, когда вы лайкаете пост, пролистываете статью или задерживаетесь на фото больше 3 секунд — алгоритм делает пометку. Но как из тысяч сигналов рождается точная рекомендация?" },
      { type: "h2", text: "Матрица схожести интересов" },
      { type: "p", text: "В основе лежит коллаборативная фильтрация: система находит пользователей со схожим поведением и предлагает вам контент, который понравился им. Чем больше у вас общих интересов — тем выше точность." },
      { type: "h2", text: "Сигналы взаимодействия" },
      { type: "p", text: "Не все действия равнозначны. Дочитать статью до конца — сильный сигнал. Лайкнуть, не читая — слабый. Сохранить в избранное — очень сильный. Алгоритм взвешивает каждое действие." },
      { type: "p", text: "Именно поэтому осознанное взаимодействие с контентом делает ленту точнее. Чем честнее вы реагируете — тем умнее становится система." },
    ],
    tags: ["#алгоритмы", "#ML", "#рекомендации"],
    likes: 512, comments: 89, reposts: 47, liked: true, saved: false,
    accentColor: "from-blue-500/20 to-cyan-500/10",
    dotColor: "bg-blue-400",
  },
  {
    id: 3,
    community: "Фотография",
    user: { name: "Анна Белова", handle: "@abelova", initials: "АБ" },
    time: "1 ч",
    title: "Плёночная фотография в 2024: почему это не ностальгия",
    subtitle: "Об аналоговом мышлении в цифровую эпоху",
    body: [
      { type: "p", text: "Плёнка переживает настоящий ренессанс. Продажи фотоплёнки растут третий год подряд, а средний возраст новых покупателей — 24 года. Это не ностальгия стариков. Это осознанный выбор поколения, выросшего на Instagram." },
      { type: "h2", text: "Ограничение как инструмент" },
      { type: "p", text: "36 кадров на катушке меняют отношение к съёмке фундаментально. Каждый кадр стоит денег и времени на проявку. Это заставляет думать прежде, чем нажать кнопку — и это делает фотографии лучше." },
      { type: "h2", text: "Золотой час сегодня" },
      { type: "p", text: "Сегодня я провёл два часа в парке с Canon AE-1 и Kodak Portra 400. Свет был невероятным — тёплый, боковой, с длинными тенями. Результаты увижу через неделю, когда сдам плёнку на проявку." },
    ],
    tags: ["#фото", "#плёнка", "#закат"],
    likes: 1024, comments: 156, reposts: 83, liked: false, saved: true,
    accentColor: "from-orange-500/20 to-amber-500/10",
    dotColor: "bg-orange-400",
  },
  {
    id: 4,
    community: "Стартапы",
    user: { name: "Игорь Смирнов", handle: "@igor_sm", initials: "ИС" },
    time: "3 ч",
    title: "500 пользователей за 6 часов без рекламы: наш опыт",
    subtitle: "Честный разбор запуска бета-версии",
    body: [
      { type: "p", text: "Мы запустили бета-версию в среду в 14:00. К 20:00 было 500 зарегистрированных пользователей. Ни одного рубля на рекламу. Вот как это получилось — и что мы сделали неправильно." },
      { type: "h2", text: "Что сработало" },
      { type: "p", text: "Личные сообщения 200 людям из целевой аудитории за неделю до запуска. Не спам — персональные письма с объяснением, зачем мы создаём продукт и почему именно их мнение важно." },
      { type: "h2", text: "Главный урок" },
      { type: "p", text: "Решайте реальную боль. Наш продукт убирает 40 минут рутины в день для конкретной профессии. Когда есть такая чёткая ценность — пользователи сами рассказывают о вас друзьям." },
      { type: "p", text: "Сейчас у нас 2300 пользователей и 34% дневная активность. Это лучший показатель за всю мою карьеру." },
    ],
    tags: ["#стартап", "#продукт", "#запуск"],
    likes: 2100, comments: 341, reposts: 198, liked: false, saved: false,
    accentColor: "from-emerald-500/20 to-teal-500/10",
    dotColor: "bg-emerald-400",
  },
  {
    id: 5,
    community: "Музыка",
    user: { name: "Саша Новикова", handle: "@sasha_nov", initials: "СН" },
    time: "5 ч",
    title: "Аналог + цифра: как мы записали трек мечты",
    subtitle: "О гибридном звуке и тёплых текстурах",
    body: [
      { type: "p", text: "После трёх месяцев экспериментов мы наконец нашли звук, который искали. Секрет оказался неожиданным: старый синтезатор Juno-60 через современный цифровой процессор эффектов." },
      { type: "h2", text: "Почему аналог звучит иначе" },
      { type: "p", text: "Аналоговые схемы имеют физические несовершенства — лёгкий дрейф частоты, тепловой шум, нелинейности. Именно эти «ошибки» создают ощущение живого звука, которого нет в идеальном цифровом сигнале." },
      { type: "h2", text: "Результат" },
      { type: "p", text: "Трек выходит в следующую пятницу. Мы впервые по-настоящему довольны звучанием — это тот момент, к которому шли два года." },
    ],
    tags: ["#музыка", "#синт", "#запись"],
    likes: 763, comments: 44, reposts: 31, liked: false, saved: false,
    accentColor: "from-pink-500/20 to-rose-500/10",
    dotColor: "bg-pink-400",
  },
];

// ─── FEED PAGE (Article reader, референс-стиль) ───────────────────────────────

function FeedPage() {
  const [tab, setTab] = useState<"rec" | "subs">("rec");
  const [articles, setArticles] = useState(FEED_ARTICLES);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartY = useRef(0);

  const article = articles[currentIdx];

  const handleLike = (id: number) => {
    setArticles(a => a.map(x =>
      x.id === id ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x
    ));
  };

  const handleSave = (id: number) => {
    setArticles(a => a.map(x => x.id === id ? { ...x, saved: !x.saved } : x));
  };

  const scrollToIdx = (idx: number) => {
    if (idx < 0 || idx >= articles.length) return;
    setCurrentIdx(idx);
    articleRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    let closest = 0;
    let minDist = Infinity;
    articleRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(el.offsetTop - scrollTop);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setCurrentIdx(closest);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") scrollToIdx(currentIdx + 1);
      if (e.key === "ArrowUp") scrollToIdx(currentIdx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIdx]);

  return (
    <div className="fixed inset-0 bottom-16 flex flex-col bg-background overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3 z-20">
        {/* Like pill */}
        <button
          onClick={() => handleLike(article.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border transition-all duration-200 ${article.liked ? "border-red-400/40 bg-red-400/10 text-red-400" : "border-border bg-card/80 text-muted-foreground hover:text-red-400"}`}
        >
          <Icon name="Heart" size={16} className={article.liked ? "fill-red-400" : ""} />
          <span className="text-xs font-semibold">{formatNumber(article.likes)}</span>
        </button>

        {/* Tab switcher */}
        <div className="flex items-center gap-0.5 bg-card/80 border border-border rounded-2xl p-1 backdrop-blur-sm">
          {(["rec", "subs"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "rec" ? "Рекомендации" : "Подписки"}
            </button>
          ))}
        </div>

        {/* Avatar */}
        <button className="relative">
          <Avatar className="w-9 h-9 ring-2 ring-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {CURRENT_USER.initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-5 pb-2">
        {articles.map((_, i) => (
          <button key={i} onClick={() => scrollToIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIdx ? "bg-primary flex-[2]" : "bg-border flex-1"}`} />
        ))}
      </div>

      {/* ── Scrollable content + Right sidebar ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Article scroll area */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          onTouchStart={onTouchStart}
          className="flex-1 overflow-y-auto scroll-smooth"
          style={{ scrollSnapType: "none" }}
        >
          {articles.map((art, idx) => (
            <div
              key={art.id}
              ref={el => { articleRefs.current[idx] = el; }}
              className="px-5 pt-4 pb-8"
              style={{ minHeight: "calc(100vh - 200px)" }}
            >
              {/* Community label */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${art.dotColor}`} />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono-accent">
                  {art.community}
                </span>
              </div>

              {/* Title block */}
              <h1 className="text-[22px] font-bold leading-tight text-foreground mb-1">
                {art.title}
              </h1>
              <p className="text-base font-semibold text-muted-foreground mb-4 leading-snug">
                {art.subtitle}
              </p>

              {/* Author row */}
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border/50">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[hsl(220_13%_18%)] text-xs font-bold text-foreground">
                    {art.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-foreground">{art.user.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 font-mono-accent">{art.time}</span>
                </div>
                <button className="text-xs font-semibold text-primary hover:text-primary/70 transition-colors border border-primary/30 px-2.5 py-1 rounded-xl hover:bg-primary/10">
                  + Читать
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4">
                {art.body.map((block, bi) =>
                  block.type === "h2" ? (
                    <h2 key={bi} className="text-lg font-bold text-foreground mt-6">
                      {block.text}
                    </h2>
                  ) : (
                    <p key={bi} className="text-[15px] leading-[1.75] text-foreground/80">
                      {block.text}
                    </p>
                  )
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/40">
                {art.tags.map(t => (
                  <span key={t} className="text-xs font-mono-accent text-primary/60 hover:text-primary cursor-pointer transition-colors bg-primary/8 px-2.5 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom separator between articles */}
              {idx < articles.length - 1 && (
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-[10px] text-muted-foreground/40 font-mono-accent uppercase tracking-widest">далее</span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Right action rail ── */}
        <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center gap-5 pr-2 pb-4">
          {/* Follow */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-primary hover:bg-primary/10 transition-all">
              <Icon name="UserPlus" size={17} />
            </button>
          </div>

          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleLike(article.id)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border ${article.liked ? "bg-red-400/15 border-red-400/40 text-red-400" : "bg-card border-border text-muted-foreground hover:text-red-400 hover:border-red-400/30"}`}
            >
              <Icon name="Heart" size={17} className={article.liked ? "fill-red-400" : ""} />
            </button>
            <span className="text-[10px] text-muted-foreground font-mono-accent">{formatNumber(article.likes)}</span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
              <Icon name="MessageCircle" size={17} />
            </button>
            <span className="text-[10px] text-muted-foreground font-mono-accent">{formatNumber(article.comments)}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-green-400 hover:border-green-400/30 transition-all">
              <Icon name="Share2" size={17} />
            </button>
            <span className="text-[10px] text-muted-foreground font-mono-accent">{formatNumber(article.reposts)}</span>
          </div>

          {/* Save */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleSave(article.id)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${article.saved ? "bg-primary/15 border-primary/40 text-primary" : "bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/30"}`}
            >
              <Icon name="Bookmark" size={17} className={article.saved ? "fill-primary" : ""} />
            </button>
          </div>

          {/* More */}
          <button className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
            <Icon name="MoreVertical" size={17} />
          </button>
        </div>
      </div>

      {/* ── Bottom nav arrows ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-8 py-2 border-t border-border/40">
        <button onClick={() => scrollToIdx(currentIdx - 1)} disabled={currentIdx === 0}
          className="flex items-center gap-1.5 text-xs text-muted-foreground disabled:opacity-25 hover:text-foreground transition-all">
          <Icon name="ChevronUp" size={14} /> Предыдущая
        </button>
        <span className="text-[10px] text-muted-foreground/30 font-mono-accent">{currentIdx + 1} / {articles.length}</span>
        <button onClick={() => scrollToIdx(currentIdx + 1)} disabled={currentIdx === articles.length - 1}
          className="flex items-center gap-1.5 text-xs text-muted-foreground disabled:opacity-25 hover:text-foreground transition-all">
          Следующая <Icon name="ChevronDown" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "achievements">("posts");
  const [posts, setPosts] = useState(POSTS.slice(0, 3));

  const handleLike = (id: number) => {
    setPosts(p => p.map(post =>
      post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1, score: post.liked ? post.score - 10 : post.score + 10 } : post
    ));
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-br from-primary/30 via-indigo-900/20 to-background" />
        <div className="px-4 -mt-10 pb-4">
          <div className="flex items-end justify-between mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-background">
              <AvatarFallback className="bg-primary/25 text-primary text-2xl font-bold">{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
              <Icon name="Settings" size={14} />
              Настройки
            </button>
          </div>

          <h2 className="text-xl font-bold text-foreground">{CURRENT_USER.name}</h2>
          <p className="text-sm text-muted-foreground font-mono-accent mb-2">{CURRENT_USER.handle}</p>
          <p className="text-sm text-foreground/75 leading-relaxed mb-4">{CURRENT_USER.bio}</p>

          <div className="flex gap-6">
            {[
              { label: "Постов", value: CURRENT_USER.posts },
              { label: "Подписчиков", value: CURRENT_USER.followers },
              { label: "Подписок", value: CURRENT_USER.following },
            ].map(s => (
              <div key={s.label}>
                <span className="text-lg font-bold text-foreground">{formatNumber(s.value)}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pb-3 border-b border-border">
        <div className="flex gap-1 p-0.5 rounded-xl bg-secondary/50">
          {(["posts", "achievements"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {tab === "posts" ? "Публикации" : "Достижения"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        {activeTab === "posts" && (
          <div className="flex flex-col gap-2">
            {posts.map(post => (
              <div key={post.id} className={`rounded-2xl border border-border bg-gradient-to-br ${post.bg} bg-card overflow-hidden hover:border-primary/25 transition-all cursor-pointer`}>
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <div className="flex flex-col items-center gap-0.5 mr-1">
                    <button onClick={() => handleLike(post.id)}
                      className={`p-1 rounded-lg transition-all ${post.liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                      <Icon name="ChevronUp" size={16} />
                    </button>
                    <span className={`text-[11px] font-bold font-mono-accent ${post.liked ? "text-primary" : "text-muted-foreground"}`}>
                      {formatNumber(post.score)}
                    </span>
                    <button className="p-1 rounded-lg text-muted-foreground hover:text-orange-400 transition-all">
                      <Icon name="ChevronDown" size={16} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0 font-medium border-0 bg-primary/15 text-primary/80 mb-1">
                      {post.community}
                    </Badge>
                    <p className="text-sm text-foreground/90 leading-snug">{post.text}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {post.tags.map(t => (
                        <span key={t} className="text-[11px] text-primary/60 font-mono-accent cursor-pointer">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 flex items-center gap-1">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-white/5 transition-all">
                    <Icon name="MessageSquare" size={13} />
                    {formatNumber(post.comments)}
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-white/5 hover:text-green-400 transition-all">
                    <Icon name="Repeat2" size={13} />
                    {formatNumber(post.reposts)}
                  </button>
                  <span className="ml-auto text-[10px] text-muted-foreground">{post.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-3 text-center animate-fade-in hover:border-primary/25 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                  <Icon name={a.icon} size={26} className={a.color} />
                </div>
                <span className="text-sm font-semibold text-foreground">{a.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MENU PAGE ────────────────────────────────────────────────────────────────

function MenuPage() {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [activeChat, setActiveChat] = useState<typeof MESSAGES[0] | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [activeSection, setActiveSection] = useState<"main" | "messages" | "communities" | "search">("main");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleJoin = (id: number) => {
    setCommunities(c => c.map(comm => comm.id === id ? { ...comm, joined: !comm.joined } : comm));
  };

  if (activeChat) {
    const chatMessages = [
      { from: "them", text: "Привет! Видела твой последний пост про тёмные темы", time: "14:22" },
      { from: "me", text: "Да! Рад что понравилось 🙂", time: "14:23" },
      { from: "them", text: "Постоянно дизайню только в тёмных темах — глаза спасибо говорят", time: "14:25" },
      { from: "me", text: "Кстати, у нас в сообществе скоро будет тред про цветовые схемы", time: "14:26" },
      { from: "them", text: "Отлично! Обязательно приму участие", time: "14:27" },
    ];
    return (
      <div className="fixed inset-0 bottom-16 bg-background flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => setActiveChat(null)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all">
            <Icon name="ArrowLeft" size={18} />
          </button>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-[hsl(220_13%_16%)] text-sm font-semibold">{activeChat.user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm text-foreground">{activeChat.user.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className={`w-1.5 h-1.5 rounded-full ${activeChat.online ? "bg-green-400" : "bg-muted-foreground/40"}`} />
              {activeChat.online ? "Онлайн" : "Был(а) недавно"}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-3">
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm ${m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm text-foreground"}`}>
                <p className="leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
          <button className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
            <Icon name="Paperclip" size={16} />
          </button>
          <input value={msgInput} onChange={e => setMsgInput(e.target.value)}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-all" />
          <button className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Section tabs */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-4 pb-3">
        <div className="flex gap-1 p-0.5 rounded-xl bg-secondary/50 overflow-x-auto">
          {([
            { id: "main", label: "Главное", icon: "LayoutGrid" },
            { id: "messages", label: "Сообщения", icon: "MessageCircle", badge: 4 },
            { id: "communities", label: "Сообщества", icon: "Users" },
            { id: "search", label: "Поиск", icon: "Search" },
          ] as const).map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all relative ${activeSection === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Icon name={s.icon} size={13} />
              {s.label}
              {s.badge && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5">
                  {s.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* MAIN section */}
        {activeSection === "main" && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-primary/25">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">{CURRENT_USER.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{CURRENT_USER.name}</div>
                  <div className="text-xs text-muted-foreground font-mono-accent">{CURRENT_USER.handle}</div>
                </div>
              </div>
            </div>

            {[
              { icon: "Bell", label: "Уведомления", desc: "3 новых", color: "text-yellow-400" },
              { icon: "Bookmark", label: "Сохранённое", desc: "12 постов", color: "text-primary" },
              { icon: "TrendingUp", label: "Статистика", desc: "Аналитика профиля", color: "text-green-400" },
              { icon: "Shield", label: "Приватность", desc: "Настройки доступа", color: "text-blue-400" },
              { icon: "HelpCircle", label: "Помощь", desc: "Поддержка платформы", color: "text-muted-foreground" },
              { icon: "LogOut", label: "Выйти", desc: "", color: "text-red-400" },
            ].map(item => (
              <button key={item.label} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/25 transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={18} className={item.color} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{item.label}</div>
                  {item.desc && <div className="text-xs text-muted-foreground">{item.desc}</div>}
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground/50" />
              </button>
            ))}
          </div>
        )}

        {/* MESSAGES section */}
        {activeSection === "messages" && (
          <div className="flex flex-col gap-1 animate-fade-in">
            <div className="relative mb-3">
              <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Поиск в сообщениях..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 transition-all text-foreground" />
            </div>
            {MESSAGES.map(m => (
              <button key={m.id} onClick={() => setActiveChat(m)} className="post-card p-4 flex items-center gap-3 text-left w-full">
                <div className="relative">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-[hsl(220_13%_16%)] font-semibold">{m.user.initials}</AvatarFallback>
                  </Avatar>
                  {m.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-background" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{m.user.name}</span>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.last}</p>
                </div>
                {m.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                    {m.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* COMMUNITIES section */}
        {activeSection === "communities" && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">Все сообщества</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all">
                <Icon name="Plus" size={12} /> Создать
              </button>
            </div>
            {communities.map(c => (
              <div key={c.id} className="post-card p-4 flex items-center gap-3 animate-fade-in">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.joined ? "bg-primary/20" : "bg-secondary"}`}>
                  <Icon name={c.icon} size={20} className={c.joined ? "text-primary" : "text-muted-foreground"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{formatNumber(c.members)} уч. · {formatNumber(c.posts)} постов</div>
                </div>
                <button onClick={() => toggleJoin(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${c.joined ? "bg-secondary text-muted-foreground hover:text-destructive" : "border border-primary/40 text-primary hover:bg-primary/10"}`}>
                  {c.joined ? "Вступил" : "Вступить"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SEARCH section */}
        {activeSection === "search" && (
          <div className="animate-fade-in">
            <div className="relative mb-4">
              <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по людям и сообществам..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-all" />
            </div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Популярные теги</h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {["#дизайн", "#технологии", "#стартапы", "#UX", "#ML", "#фото", "#продукт", "#музыка"].map(tag => (
                <button key={tag} className="text-xs px-3 py-1.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all font-mono-accent">
                  {tag}
                </button>
              ))}
            </div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Кого читать</h3>
            <div className="flex flex-col gap-2">
              {[
                { name: "Мария Иванова", handle: "@mariia_iv", initials: "МИ", followers: 4200 },
                { name: "Дмитрий Кравцов", handle: "@dkravtsov", initials: "ДК", followers: 8900 },
                { name: "Анна Белова", handle: "@abelova", initials: "АБ", followers: 3100 },
              ].map(u => (
                <div key={u.handle} className="post-card p-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[hsl(220_13%_16%)] text-sm font-semibold">{u.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-foreground">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.handle} · {formatNumber(u.followers)} подп.</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-primary/40 text-primary hover:bg-primary/10 transition-all">
                    Читать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BOTTOM NAV + ROOT ────────────────────────────────────────────────────────

export default function Index() {
  const [page, setPage] = useState<Page>("home");

  const navItems: { id: Page; label: string; icon: string; badge?: number }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "feed", label: "Лента", icon: "Layers" },
    { id: "profile", label: "Профиль", icon: "User" },
    { id: "menu", label: "Меню", icon: "Menu", badge: 4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page content */}
      <div className={page === "feed" ? "" : "overflow-y-auto"}>
        {page === "home" && <HomePage />}
        {page === "feed" && <FeedPage />}
        {page === "profile" && <ProfilePage />}
        {page === "menu" && <MenuPage />}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-all"
            >
              <div className={`relative p-2 rounded-xl transition-all duration-200 ${page === item.id ? "bg-primary/15" : ""}`}>
                <Icon
                  name={item.icon}
                  size={20}
                  className={page === item.id ? "text-primary" : "text-muted-foreground"}
                />
                {item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${page === item.id ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {page === item.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}