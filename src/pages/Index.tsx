import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Page = "feed" | "search" | "communities" | "messages" | "profile";

const CURRENT_USER = {
  name: "Алексей Громов",
  handle: "@agromov",
  avatar: "",
  initials: "АГ",
  followers: 1240,
  following: 389,
  posts: 87,
};

const POSTS = [
  {
    id: 1,
    user: { name: "Мария Иванова", handle: "@mariia_iv", initials: "МИ", avatar: "" },
    community: "Дизайн & UI",
    time: "2 мин назад",
    text: "Пробовала новый подход к тёмным интерфейсам — ключ в том, чтобы не использовать чистый чёрный (#000). Мягкие угольные тона гораздо комфортнее для глаз при длительной работе.",
    tags: ["#дизайн", "#UX", "#тёмнаятема"],
    likes: 248,
    comments: 34,
    reposts: 12,
    liked: false,
  },
  {
    id: 2,
    user: { name: "Дмитрий Кравцов", handle: "@dkravtsov", initials: "ДК", avatar: "" },
    community: "Технологии",
    time: "15 мин назад",
    text: "Алгоритм рекомендаций — это не магия. Это матрица схожести интересов + сигналы взаимодействий. Чем больше осознанных действий вы совершаете, тем точнее становится лента.",
    tags: ["#алгоритмы", "#ML", "#рекомендации"],
    likes: 512,
    comments: 89,
    reposts: 47,
    liked: true,
  },
  {
    id: 3,
    user: { name: "Анна Белова", handle: "@abelova", initials: "АБ", avatar: "" },
    community: "Фотография",
    time: "1 час назад",
    text: "Золотой час сегодня был просто невероятным. Снял серию на плёночную камеру — буду делиться результатами, когда проявлю.",
    tags: ["#фото", "#плёнка", "#закат"],
    likes: 1024,
    comments: 156,
    reposts: 83,
    liked: false,
  },
  {
    id: 4,
    user: { name: "Игорь Смирнов", handle: "@igor_sm", initials: "ИС", avatar: "" },
    community: "Стартапы",
    time: "3 часа назад",
    text: "Запустили бета-версию нашего продукта. 500 пользователей за первые 6 часов без рекламы — только сарафанное радио. Главный урок: решайте реальную боль.",
    tags: ["#стартап", "#продукт", "#запуск"],
    likes: 2100,
    comments: 341,
    reposts: 198,
    liked: false,
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
  { id: 2, user: { name: "Дмитрий Кравцов", initials: "ДК" }, last: "Да, согласен с тобой насчёт алгоритмов", time: "1ч", unread: 0, online: true },
  { id: 3, user: { name: "Игорь Смирнов", initials: "ИС" }, last: "Спасибо за поддержку 🙌", time: "3ч", unread: 1, online: false },
  { id: 4, user: { name: "Анна Белова", initials: "АБ" }, last: "Скину фото, как только проявлю", time: "вчера", unread: 0, online: false },
];

const SEARCH_USERS = [
  { name: "Мария Иванова", handle: "@mariia_iv", initials: "МИ", followers: 4200 },
  { name: "Дмитрий Кравцов", handle: "@dkravtsov", initials: "ДК", followers: 8900 },
  { name: "Анна Белова", handle: "@abelova", initials: "АБ", followers: 3100 },
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

function PostCard({ post, onLike }: { post: typeof POSTS[0]; onLike: (id: number) => void }) {
  return (
    <div className="post-card p-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-[hsl(220_13%_16%)] text-sm font-semibold text-foreground">
            {post.user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{post.user.name}</span>
            <span className="text-xs text-muted-foreground">{post.user.handle}</span>
            <span className="text-xs text-muted-foreground/50">·</span>
            <Badge variant="secondary" className="text-[10px] px-2 py-0 font-normal text-muted-foreground bg-secondary/60 border-0">
              {post.community}
            </Badge>
            <span className="text-xs text-muted-foreground/50 ml-auto">{post.time}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">{post.text}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map(t => (
              <span key={t} className="text-[11px] text-primary/70 hover:text-primary cursor-pointer transition-colors font-mono-accent">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-secondary ${post.liked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
        >
          <Icon name="Heart" size={14} className={post.liked ? "fill-red-400 text-red-400" : ""} />
          {formatNumber(post.likes)}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200">
          <Icon name="MessageCircle" size={14} />
          {formatNumber(post.comments)}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-green-400 hover:bg-secondary transition-all duration-200">
          <Icon name="Repeat2" size={14} />
          {formatNumber(post.reposts)}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 ml-auto">
          <Icon name="Bookmark" size={14} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200">
          <Icon name="Share2" size={14} />
        </button>
      </div>
    </div>
  );
}

function FeedPage() {
  const [posts, setPosts] = useState(POSTS);
  const [activeTab, setActiveTab] = useState<"all" | "following" | "recommended">("all");
  const [newPost, setNewPost] = useState("");

  const handleLike = (id: number) => {
    setPosts(p => p.map(post => post.id === id
      ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
      : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">{CURRENT_USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Что у вас нового?"
              rows={2}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 resize-none outline-none leading-relaxed"
            />
            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-border/60">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-secondary">
                <Icon name="Image" size={14} /> Фото
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-secondary">
                <Icon name="Hash" size={14} /> Тег
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-secondary">
                <Icon name="MapPin" size={14} /> Место
              </button>
              <button
                className="ml-auto px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 bg-primary text-primary-foreground hover:opacity-90"
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-card border border-border">
        {(["all", "following", "recommended"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "all" ? "Все" : tab === "following" ? "Подписки" : "Для вас"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {posts.map(post => <PostCard key={post.id} post={post} onLike={handleLike} />)}
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "users" | "communities" | "posts">("all");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative mb-6">
        <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по людям, постам и сообществам..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-all"
        />
      </div>

      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-card border border-border">
        {(["all", "users", "communities", "posts"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "all" ? "Все" : tab === "users" ? "Люди" : tab === "communities" ? "Сообщества" : "Посты"}
          </button>
        ))}
      </div>

      {(activeTab === "all" || activeTab === "users") && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Люди</h3>
          <div className="flex flex-col gap-2">
            {SEARCH_USERS.map(u => (
              <div key={u.handle} className="post-card p-4 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[hsl(220_13%_16%)] text-sm font-semibold">{u.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.handle} · {formatNumber(u.followers)} подписчиков</div>
                </div>
                <button className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-primary/40 text-primary hover:bg-primary/10 transition-all">
                  Подписаться
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === "all" || activeTab === "communities") && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Сообщества</h3>
          <div className="flex flex-col gap-2">
            {COMMUNITIES.slice(0, 3).map(c => (
              <div key={c.name} className="post-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Icon name={c.icon} size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{formatNumber(c.members)} участников</div>
                </div>
                <button className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-primary/40 text-primary hover:bg-primary/10 transition-all">
                  Вступить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === "all" || activeTab === "posts") && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Посты</h3>
          <div className="flex flex-col gap-3">
            {POSTS.slice(0, 2).map(post => (
              <PostCard key={post.id} post={post} onLike={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CommunitiesPage() {
  const [communities, setCommunities] = useState(COMMUNITIES);

  const toggleJoin = (id: number) => {
    setCommunities(c => c.map(comm => comm.id === id ? { ...comm, joined: !comm.joined } : comm));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Сообщества</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Найди своё сообщество по интересам</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all">
          <Icon name="Plus" size={14} />
          Создать
        </button>
      </div>

      <div className="grid gap-3">
        {communities.map(c => (
          <div key={c.id} className="post-card p-5 flex items-center gap-4 animate-fade-in">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.joined ? "bg-primary/20" : "bg-secondary"}`}>
              <Icon name={c.icon} size={22} className={c.joined ? "text-primary" : "text-muted-foreground"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground">{c.name}</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{formatNumber(c.members)}</span> участников
                </span>
                <span className="text-xs text-muted-foreground/50">·</span>
                <span className="text-xs text-muted-foreground">
                  <span className="text-foreground/70 font-medium">{formatNumber(c.posts)}</span> постов
                </span>
              </div>
            </div>
            <button
              onClick={() => toggleJoin(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex-shrink-0 ${c.joined ? "bg-secondary text-muted-foreground hover:text-destructive" : "border border-primary/40 text-primary hover:bg-primary/10"}`}
            >
              {c.joined ? "В сообществе" : "Вступить"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesPage() {
  const [activeChat, setActiveChat] = useState<typeof MESSAGES[0] | null>(null);
  const [chatMessages] = useState([
    { from: "them", text: "Привет! Видела твой последний пост про тёмные темы", time: "14:22" },
    { from: "me", text: "Да! Рад что понравилось 🙂 Ты сама работаешь над проектами на тёмном фоне?", time: "14:23" },
    { from: "them", text: "Постоянно! Дизайню только в тёмных темах — глаза спасибо говорят", time: "14:25" },
    { from: "me", text: "Полностью согласен. Кстати, у нас в сообществе скоро будет тред про цветовые схемы", time: "14:26" },
    { from: "them", text: "Отлично! Обязательно приму участие", time: "14:27" },
  ]);
  const [msgInput, setMsgInput] = useState("");

  if (activeChat) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100vh - 40px)" }}>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <button onClick={() => setActiveChat(null)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
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

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm text-foreground"}`}>
                <p className="leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <button className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
            <Icon name="Paperclip" size={16} />
          </button>
          <input
            value={msgInput}
            onChange={e => setMsgInput(e.target.value)}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-all"
          />
          <button className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Сообщения</h2>
        <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-all">
          <Icon name="Edit" size={18} />
        </button>
      </div>

      <div className="relative mb-4">
        <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Поиск в сообщениях..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 transition-all text-foreground"
        />
      </div>

      <div className="flex flex-col gap-1">
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
    </div>
  );
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "achievements">("posts");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 mb-5 animate-fade-in">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 ring-2 ring-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">{CURRENT_USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">{CURRENT_USER.name}</h2>
                <p className="text-sm text-muted-foreground font-mono-accent">{CURRENT_USER.handle}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                <Icon name="Settings" size={13} />
                Настройки
              </button>
            </div>
            <p className="text-sm text-foreground/75 mt-2 leading-relaxed">Разработчик, дизайнер, любитель тёмных тем и качественного контента.</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
          {[
            { label: "Постов", value: CURRENT_USER.posts },
            { label: "Подписчиков", value: CURRENT_USER.followers },
            { label: "Подписок", value: CURRENT_USER.following },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold text-foreground">{formatNumber(s.value)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-card border border-border">
        {(["posts", "achievements"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "posts" ? "Посты" : "Достижения"}
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="flex flex-col gap-3">
          {POSTS.slice(0, 2).map(post => <PostCard key={post.id} post={post} onLike={() => {}} />)}
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(a => (
            <div key={a.label} className="post-card p-5 flex flex-col items-center gap-3 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                <Icon name={a.icon} size={22} className={a.color} />
              </div>
              <span className="text-sm font-semibold text-foreground">{a.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const navItems = [
    { id: "feed" as Page, label: "Лента", icon: "Home" },
    { id: "search" as Page, label: "Поиск", icon: "Search" },
    { id: "communities" as Page, label: "Сообщества", icon: "Users" },
    { id: "messages" as Page, label: "Сообщения", icon: "MessageCircle", badge: 4 },
    { id: "profile" as Page, label: "Профиль", icon: "User" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-border bg-[hsl(var(--sidebar-background))]">
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-mono-accent">N</span>
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">Nexus</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`nav-item w-full ${page === item.id ? "active" : ""}`}
          >
            <Icon name={item.icon} size={18} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{CURRENT_USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{CURRENT_USER.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono-accent truncate">{CURRENT_USER.handle}</div>
          </div>
          <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}

function RightSidebar() {
  return (
    <aside className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-4 h-screen sticky top-0 pt-5 pr-4 overflow-y-auto">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Рекомендации</h3>
        <div className="flex flex-col gap-3">
          {POSTS.slice(0, 2).map(p => (
            <div key={p.id} className="flex items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarFallback className="bg-[hsl(220_13%_16%)] text-[10px] font-semibold">{p.user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-foreground/80 leading-snug">{p.text.slice(0, 80)}...</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono-accent">{p.user.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Популярные теги</h3>
        <div className="flex flex-wrap gap-2">
          {["#дизайн", "#технологии", "#стартапы", "#UX", "#ML", "#фото", "#продукт"].map(tag => (
            <button key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-mono-accent">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono-accent">Кого читать</h3>
        <div className="flex flex-col gap-3">
          {SEARCH_USERS.map(u => (
            <div key={u.handle} className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[hsl(220_13%_16%)] text-xs font-semibold">{u.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{u.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono-accent">{formatNumber(u.followers)} подп.</div>
              </div>
              <button className="text-[10px] font-semibold text-primary hover:text-primary/70 transition-colors">
                + читать
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("feed");

  const pageComponents: Record<Page, JSX.Element> = {
    feed: <FeedPage />,
    search: <SearchPage />,
    communities: <CommunitiesPage />,
    messages: <MessagesPage />,
    profile: <ProfilePage />,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 flex min-w-0">
        <div className="flex-1 py-5 px-5 overflow-y-auto min-w-0">
          {pageComponents[page]}
        </div>
        <RightSidebar />
      </main>
    </div>
  );
}