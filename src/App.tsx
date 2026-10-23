import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Compass,
  ExternalLink,
  Eye,
  Film,
  Handshake,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PackageCheck,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react"

type Role = "business" | "creator"
type Status = "pending" | "accepted" | "declined"
type Page = "overview" | "discover" | "campaigns" | "collaborations" | "budget" | "billing" | "settings" | "home" | "opportunities" | "requests" | "my-collaborations" | "profile" | "earnings" | "planner" | "creator-insights" | "business-insights"

type Campaign = {
  id: string
  name: string
  brand: string
  description: string
  deliverables: string
  audience: string
  budget: number
  deadline: string
  niche: string
  source?: "manual" | "ai-plan"
}

type Request = {
  id: string
  campaignId: string
  creatorId: string
  creatorName: string
  fee: number
  deliverables: string
  deadline: string
  status: Status
  direction: "invitation" | "application"
  createdAt: string
}

type CreatorProfile = {
  id: string
  name: string
  handle: string
  niche: string
  bio: string
  platform: string
  audience: string
  rate: number
  portfolio: string
  services: string
  image: string
  fit: number
}

type ChatMessage = {
  id: string
  sender: "user" | "assistant"
  text: string
  createdAt: string
}

type Review = {
  id: string
  creatorId: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

type ProductionBooking = {
  id: string
  requestId: string
  campaignId: string
  creatorId: string
  vendorName: string
  service: string
  cost: number
  createdAt: string
}

type AppData = {
  campaigns: Campaign[]
  requests: Request[]
  profile: CreatorProfile
  conversations: Record<Role, ChatMessage[]>
  reviews: Review[]
  productionBookings: ProductionBooking[]
}

const mayaImage =
  "https://images.unsplash.com/photo-1673767298248-b128f17f89af?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700"

const creators: CreatorProfile[] = [
  {
    id: "creator-maya",
    name: "Maya Creates",
    handle: "@mayacreates",
    niche: "Beauty",
    bio: "Skincare storyteller creating warm, detail-rich routines for ingredient-conscious audiences.",
    platform: "Instagram · YouTube",
    audience: "48.2K",
    rate: 5000,
    portfolio:
      "https://www.behance.net/search/projects?search=beauty%20content%20creator",
    services: "Reels, UGC, Product photography",
    image: mayaImage,
    fit: 96,
  },
  {
    id: "creator-aarav",
    name: "Aarav Frames",
    handle: "@aaravframes",
    niche: "Lifestyle",
    bio: "Cinematic everyday stories with a focus on mindful living and premium products.",
    platform: "Instagram",
    audience: "72K",
    rate: 7500,
    portfolio:
      "https://www.behance.net/search/projects?search=lifestyle%20content%20creator",
    services: "Reels, Photography",
    image:
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
    fit: 88,
  },
  {
    id: "creator-naina",
    name: "Naina Edit",
    handle: "@nainaedit",
    niche: "Fashion",
    bio: "Editorial styling, trend explainers, and polished short-form videos for modern labels.",
    platform: "Instagram · TikTok",
    audience: "35.6K",
    rate: 4500,
    portfolio:
      "https://www.behance.net/search/projects?search=fashion%20social%20content",
    services: "Reels, Styling, UGC",
    image:
      "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
    fit: 84,
  },
  {
    id: "creator-dev",
    name: "Dev On Desk",
    handle: "@devondesk",
    niche: "Tech",
    bio: "Clear product demos and desk-setup content for curious, design-aware professionals.",
    platform: "YouTube · Instagram",
    audience: "91K",
    rate: 9000,
    portfolio:
      "https://www.behance.net/search/projects?search=technology%20content%20creator",
    services: "Reviews, Tutorials, Shorts",
    image:
      "https://images.unsplash.com/photo-1664277497095-424e085175e8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
    fit: 71,
  },
]

const initialData: AppData = {
  campaigns: [
    {
      id: "campaign-glowlab-launch",
      name: "Glow Reset Serum Launch",
      brand: "GlowLab",
      description:
        "Introduce GlowLab’s new barrier-support serum through believable routines and tactile product storytelling.",
      deliverables: "1 Instagram Reel + 3 story frames",
      audience: "Skincare enthusiasts, ages 20–35",
      budget: 25000,
      deadline: "2026-07-18",
      niche: "Beauty",
    },
    {
      id: "campaign-sundaze",
      name: "Slow Sunday Rituals",
      brand: "Sundaze Home",
      description:
        "Show how small rituals can make weekends feel more restorative.",
      deliverables: "1 Reel + 5 edited photos",
      audience: "Urban professionals, ages 24–40",
      budget: 18000,
      deadline: "2026-08-02",
      niche: "Lifestyle",
    },
    {
      id: "campaign-threadline",
      name: "Monsoon Layers",
      brand: "Threadline",
      description:
        "Style versatile monsoon-ready pieces across work and weekend looks.",
      deliverables: "2 short-form videos",
      audience: "Fashion-first women, ages 18–30",
      budget: 32000,
      deadline: "2026-07-28",
      niche: "Fashion",
    },
  ],
  requests: [
    {
      id: "request-seed-1",
      campaignId: "campaign-glowlab-launch",
      creatorId: "creator-naina",
      creatorName: "Naina Edit",
      fee: 4500,
      deliverables: "1 unboxing Reel",
      deadline: "2026-07-16",
      status: "pending",
      direction: "invitation",
      createdAt: "2026-06-10",
    },
  ],
  profile: creators[0],
  conversations: {
    business: [
      {
        id: "chat-business-welcome",
        sender: "assistant",
        text: "Hi GlowLab. I can help shape your campaign brief, creator mix, deliverables, timeline, or ₹25,000 budget. What should we plan first?",
        createdAt: "2026-06-16T09:00:00.000Z",
      },
    ],
    creator: [
      {
        id: "chat-creator-welcome",
        sender: "assistant",
        text: "Hi Maya. I can help you interpret a brief, plan your content concept, price deliverables, or build a production schedule. What are you working through?",
        createdAt: "2026-06-16T09:00:00.000Z",
      },
    ],
  },
  reviews: [
    {
      id: "review-maya-1",
      creatorId: "creator-maya",
      author: "Aster & Co.",
      rating: 5,
      comment:
        "Maya translated a technical skincare brief into a warm, credible routine. Clear communication throughout.",
      createdAt: "2026-05-22",
    },
    {
      id: "review-maya-2",
      creatorId: "creator-maya",
      author: "Sunday Skin",
      rating: 4,
      comment:
        "Beautiful product framing and thoughtful storytelling. Delivery was organized and on brief.",
      createdAt: "2026-04-08",
    },
    {
      id: "review-aarav-1",
      creatorId: "creator-aarav",
      author: "Cedar Living",
      rating: 5,
      comment:
        "Strong visual instinct and a polished final edit that felt native to his audience.",
      createdAt: "2026-05-04",
    },
    {
      id: "review-naina-1",
      creatorId: "creator-naina",
      author: "Threadline",
      rating: 4,
      comment:
        "Responsive, stylish, and very good at turning feedback into a stronger second cut.",
      createdAt: "2026-03-19",
    },
  ],
  productionBookings: [],
}

const STORAGE_KEY = "creatorbridge-demo-v1"
const ROLE_KEY = "creatorbridge-role"

function currency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}

function prettyDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`))
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function Button({
  children,
  variant = "primary",
  icon: Icon,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  icon?: LucideIcon
}) {
  return (
    <button className={cx("button", `button-${variant}`, className)} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

function Badge({
  status,
  children,
}: {
  status?: Status | "active" | "demo"
  children: ReactNode
}) {
  return (
    <span className={cx("badge", status && `badge-${status}`)}>{children}</span>
  )
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone = "violet",
}: {
  icon: LucideIcon
  label: string
  value: string | number
  detail: string
  tone?: "violet" | "green" | "amber" | "blue"
}) {
  return (
    <article className="metric-card">
      <div className={cx("metric-icon", `tone-${tone}`)}>
        <Icon size={18} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  )
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [onClose])
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const businessNav: Array<[Page, string, LucideIcon]> = [
  ["overview", "Overview", LayoutDashboard],
  ["business-insights", "Business insights", BarChart3],
  ["discover", "Discover creators", Compass],
  ["campaigns", "Campaigns", BriefcaseBusiness],
  ["collaborations", "Collaborations", Handshake],
  ["budget", "Budget & schedule", WalletCards],
  ["billing", "Billing & plans", CircleDollarSign],
  ["planner", "AI campaign planner", Bot],
  ["settings", "Settings", Settings],
]

const creatorNav: Array<[Page, string, LucideIcon]> = [
  ["home", "Home", Home],
  ["opportunities", "Discover campaigns", Compass],
  ["requests", "Collaboration requests", Bell],
  ["my-collaborations", "My collaborations", Handshake],
  ["profile", "My profile", UserRound],
  ["creator-insights", "Creator insights", BarChart3],
  ["earnings", "Earnings", CircleDollarSign],
  ["billing", "Billing & plans", WalletCards],
  ["planner", "AI campaign planner", Bot],
]

function Welcome({ onSelect }: { onSelect: (role: Role) => void }) {
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null)
  const [authRole, setAuthRole] = useState<Role>("business")
  const [authError, setAuthError] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setAuthError("")
  }
  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") || "").trim()
    const password = String(form.get("password") || "")
    const name = String(form.get("name") || "").trim()
    if (!email || !password || (authMode === "signup" && !name)) {
      setAuthError("Please complete all required fields.")
      return
    }
    if (password.length < 8) {
      setAuthError("Use at least 8 characters for your password.")
      return
    }
    setAuthBusy(true)
    setAuthError("")
    try {
      const response = await fetch(`/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: authRole }),
      })
      const payload = (await response.json()) as { error?: string; token?: string }
      if (!response.ok || !payload.token) {
        setAuthError(payload.error || "Authentication failed. Please try again.")
        return
      }
      localStorage.setItem("creatorbridge-token", payload.token)
      setAuthMode(null)
      onSelect(authRole)
    } catch {
      setAuthError("Could not reach CreatorBridge. Please try again.")
    } finally {
      setAuthBusy(false)
    }
  }

  return (
    <main className="welcome">
      <nav className="welcome-nav">
        <button className="welcome-logo-button" onClick={() => scrollTo("top")}>
          <Logo />
        </button>
        <div className="welcome-links">
          <button onClick={() => scrollTo("business")}>For Businesses</button>
          <button onClick={() => scrollTo("creator")}>For Creators</button>
          <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
        </div>
        <div className="welcome-nav-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="auth-actions">
          <button className="auth-link" onClick={() => openAuth("signin")}>Sign in</button>
          <button className="auth-button" onClick={() => openAuth("signup")}>Sign up <ArrowRight size={14} /></button>
        </div>
      </nav>
      <section className="welcome-hero" id="top">
        <div className="welcome-copy">
          <h1>Choose your<br />creator journey.</h1>
          <p>
            A smarter way for brands, creators and production partners to
            collaborate, create and grow together.
          </p>
        </div>
        <div className="welcome-hero-note">
          <span className="welcome-rule" />
          <p>People · Ideas · Impact</p>
        </div>
      </section>
      <section className="journey-grid" aria-label="Choose your portal">
        <button className="journey-card journey-business" id="business" onClick={() => onSelect("business")}>
          <span className="journey-label">For businesses <i /></span>
          <span className="journey-title">Brand<br />partner</span>
          <span className="journey-description">
            For businesses looking to discover the right creators, launch
            impactful campaigns, and manage collaborations effortlessly.
          </span>
          <span className="journey-benefits">
            <span><CheckCircle2 size={15} /> Campaign creation and management</span>
            <span><CheckCircle2 size={15} /> Creator discovery and insights</span>
            <span><CheckCircle2 size={15} /> Collaboration and budget tracking</span>
          </span>
          <span className="journey-cta">Continue as business <ArrowRight size={17} /></span>
          <span className="journey-orb" aria-hidden="true" />
        </button>
        <button className="journey-card journey-creator" id="creator" onClick={() => onSelect("creator")}>
          <span className="journey-label">For content creators <i /></span>
          <span className="journey-title">Creator<br />space</span>
          <span className="journey-description">
            For creators ready to showcase their work, discover exciting brand
            opportunities, and build meaningful partnerships.
          </span>
          <span className="journey-benefits">
            <span><CheckCircle2 size={15} /> Personalized creator portfolio</span>
            <span><CheckCircle2 size={15} /> Discover brand campaigns</span>
            <span><CheckCircle2 size={15} /> Manage collaborations and earnings</span>
          </span>
          <span className="journey-cta">Continue as creator <ArrowRight size={17} /></span>
          <span className="journey-orb" aria-hidden="true" />
        </button>
      </section>
      <section className="how-it-works" id="how-it-works">
        <div>
          <p className="welcome-eyebrow">How it works</p>
          <h2>From first hello<br />to lasting growth.</h2>
        </div>
        <div className="workflow-grid">
          {[
            ["01", "Discover", "Find creators or campaigns that feel like the right fit."],
            ["02", "Connect", "Send collaboration requests or apply to opportunities."],
            ["03", "Collaborate", "Agree on deliverables, budgets, and deadlines."],
            ["04", "Grow", "Track campaigns, partnerships, and performance together."],
          ].map(([number, title, description]) => (
            <div className="workflow-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="welcome-final">
        <p className="welcome-eyebrow">The bridge is open</p>
        <h2>Better connections.<br />Better campaigns.</h2>
        <div className="welcome-final-actions">
          <button className="welcome-outline-button" onClick={() => onSelect("business")}>Find creators <ArrowRight size={17} /></button>
          <button className="welcome-outline-button" onClick={() => onSelect("creator")}>Explore opportunities <ArrowRight size={17} /></button>
        </div>
      </section>
      <footer className="welcome-footer">
        <Logo />
        <div>
          <button onClick={() => scrollTo("business")}>For Businesses</button>
          <button onClick={() => scrollTo("creator")}>For Creators</button>
          <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
          <button>Contact</button>
          <button>Privacy Policy</button>
          <button>Terms</button>
        </div>
      </footer>
      {authMode && (
        <div className="auth-backdrop" role="presentation" onMouseDown={() => setAuthMode(null)}>
          <section className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="auth-close" aria-label="Close authentication form" onClick={() => setAuthMode(null)}>×</button>
            <p className="welcome-eyebrow">{authMode === "signin" ? "Welcome back" : "Join CreatorBridge"}</p>
            <h2 id="auth-title">{authMode === "signin" ? "Sign in to your space." : "Make room for better work."}</h2>
            <p className="auth-intro">
              {authMode === "signin"
                ? "Continue to your campaigns, opportunities, and collaborations."
                : "Create your account and start building meaningful partnerships."}
            </p>
            <div className="auth-tabs">
              <button type="button" className={authMode === "signin" ? "active" : ""} onClick={() => openAuth("signin")}>Sign in</button>
              <button type="button" className={authMode === "signup" ? "active" : ""} onClick={() => openAuth("signup")}>Sign up</button>
            </div>
            <form className="auth-form" onSubmit={submitAuth}>
              {authMode === "signup" && <label>Name<input name="name" autoComplete="name" placeholder="Your name" /></label>}
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
              <label>Password<input name="password" type="password" autoComplete={authMode === "signin" ? "current-password" : "new-password"} placeholder="••••••••" /></label>
              <div className="auth-role">
                <span>I am joining as</span>
                <div>
                  <button type="button" className={authRole === "business" ? "active" : ""} onClick={() => setAuthRole("business")}>Business</button>
                  <button type="button" className={authRole === "creator" ? "active" : ""} onClick={() => setAuthRole("creator")}>Creator</button>
                </div>
              </div>
              {authError && <p className="auth-error" role="alert">{authError}</p>}
              <button className="auth-submit" type="submit" disabled={authBusy}>{authBusy ? "Connecting..." : authMode === "signin" ? "Enter CreatorBridge" : "Create account"} {!authBusy && <ArrowRight size={16} />}</button>
            </form>
            <p className="auth-note">This prototype uses fictional demo data. No account is created.</p>
          </section>
        </div>
      )}
    </main>
  )
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo">
      <img
        src={compact ? "/creatorbridge-mark.png" : "/creatorbridge-logo.png"}
        alt="CreatorBridge"
      />
    </div>
  )
}

function Shell({
  role,
  page,
  setPage,
  switchRole,
  pendingCount,
  children,
}: {
  role: Role
  page: Page
  setPage: (page: Page) => void
  switchRole: () => void
  pendingCount: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const nav = role === "business" ? businessNav : creatorNav
  const identity =
    role === "business"
      ? { name: "GlowLab", sub: "Brand workspace", initials: "GL" }
      : { name: "Maya Creates", sub: "Creator workspace", initials: "MC" }

  return (
    <div className={cx("app-shell", `shell-${role}`)}>
      <aside className={cx("sidebar", open && "sidebar-open")}>
        <div className="sidebar-top">
          <Logo compact />
          <button
            className="mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <div className="workspace-chip">
          <span className="workspace-mark">
            <img src="/creatorbridge-mark.png" alt="" />
          </span>
          <div>
            <strong>{identity.name}</strong>
            <small>{identity.sub}</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav" aria-label={`${role} navigation`}>
          <p>Workspace</p>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => {
                setPage(id)
                setOpen(false)
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "requests" && pendingCount > 0 && <b>{pendingCount}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-help">
          <MessageSquare size={18} />
          <strong>Quick start</strong>
          <p>
            Follow the purple actions to try the full collaboration workflow.
          </p>
        </div>
        <button className="profile-switch" onClick={switchRole}>
          <span>{identity.initials}</span>
          <div>
            <strong>{identity.name}</strong>
            <small>
              Switch to {role === "business" ? "creator" : "business"}
            </small>
          </div>
          <ArrowRight size={16} />
        </button>
      </aside>
      {open && <div className="sidebar-scrim" onClick={() => setOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div className="authenticated-mark">
            <Logo compact />
          </div>
          <div className="topbar-title">
            <span className="live-dot" />
            Workspace
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
              {pendingCount > 0 && <span className="notification-dot" />}
            </button>
            <Button variant="secondary" onClick={switchRole}>
              Switch role
            </Button>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}

function App() {
  const [role, setRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem(ROLE_KEY)
    return saved === "business" || saved === "creator" ? saved : null
  })
  const [page, setPage] = useState<Page>("overview")
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "",
      ) as Partial<AppData>
      return {
        ...initialData,
        ...saved,
        conversations: {
          ...initialData.conversations,
          ...saved.conversations,
        },
        reviews: saved.reviews ?? initialData.reviews,
        productionBookings:
          saved.productionBookings ?? initialData.productionBookings,
      }
    } catch {
      return initialData
    }
  })
  const [toast, setToast] = useState("")
  const [inviteCreator, setInviteCreator] = useState<CreatorProfile | null>(
    null,
  )
  const [viewCreator, setViewCreator] = useState<CreatorProfile | null>(null)
  const [brief, setBrief] = useState<Campaign | null>(null)
  const [campaignModal, setCampaignModal] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    if (role) localStorage.setItem(ROLE_KEY, role)
  }, [role])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const switchRole = () => {
    const next: Role = role === "business" ? "creator" : "business"
    setRole(next)
    setPage(next === "business" ? "overview" : "home")
    setToast(
      `Switched to ${
        next === "business" ? "GlowLab" : "Maya Creates"
      } workspace`,
    )
  }

  const chooseRole = (next: Role) => {
    setRole(next)
    setPage(next === "business" ? "overview" : "home")
  }

  const updateStatus = (id: string, status: Status) => {
    setData((current) => ({
      ...current,
      requests: current.requests.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    }))
    setToast(
      status === "accepted"
        ? "Collaboration accepted — both workspaces are updated"
        : "Request declined and GlowLab has been notified",
    )
  }

  const reset = () => {
    setData(initialData)
    setToast("Demo data has been reset")
    setPage(role === "business" ? "overview" : "home")
  }

  if (!role) return <Welcome onSelect={chooseRole} />

  const pendingCount = data.requests.filter(
    (request) =>
      request.status === "pending" &&
      request.creatorId === data.profile.id &&
      request.direction === "invitation",
  ).length

  return (
    <Shell
      role={role}
      page={page}
      setPage={setPage}
      switchRole={switchRole}
      pendingCount={pendingCount}
    >
      {role === "business" ? (
        <BusinessPages
          page={page}
          data={data}
          setData={setData}
          setPage={setPage}
          invite={setInviteCreator}
          viewCreator={setViewCreator}
          openCampaign={() => setCampaignModal(true)}
          reset={reset}
          toast={setToast}
        />
      ) : (
        <CreatorPages
          page={page}
          data={data}
          setData={setData}
          setPage={setPage}
          openBrief={setBrief}
          updateStatus={updateStatus}
          reset={reset}
          toast={setToast}
        />
      )}
      {inviteCreator && (
        <InviteModal
          creator={inviteCreator}
          campaigns={data.campaigns}
          onClose={() => setInviteCreator(null)}
          onSubmit={(request) => {
            setData((current) => ({
              ...current,
              requests: [request, ...current.requests],
            }))
            setInviteCreator(null)
            setToast(`Invitation sent to ${request.creatorName}`)
          }}
        />
      )}
      {viewCreator && (
        <CreatorModal
          creator={viewCreator}
          reviews={data.reviews.filter(
            (review) => review.creatorId === viewCreator.id,
          )}
          onClose={() => setViewCreator(null)}
          invite={setInviteCreator}
          onReview={(review) => {
            setData((current) => ({
              ...current,
              reviews: [review, ...current.reviews],
            }))
            setToast(`Review added for ${viewCreator.name}`)
          }}
        />
      )}
      {brief && (
        <BriefModal
          campaign={brief}
          applied={data.requests.some(
            (request) =>
              request.campaignId === brief.id &&
              request.creatorId === data.profile.id &&
              request.direction === "application",
          )}
          onClose={() => setBrief(null)}
          onApply={() => {
            applyToCampaign(brief, data, setData, setToast)
            setBrief(null)
          }}
        />
      )}
      {campaignModal && (
        <CampaignModal
          onClose={() => setCampaignModal(false)}
          onSubmit={(campaign) => {
            setData((current) => ({
              ...current,
              campaigns: [campaign, ...current.campaigns],
            }))
            setCampaignModal(false)
            setToast("Campaign created and saved to your workspace")
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} /> {toast}
        </div>
      )}
    </Shell>
  )
}

function BusinessPages({
  page,
  data,
  setData,
  setPage,
  invite,
  viewCreator,
  openCampaign,
  reset,
  toast,
}: {
  page: Page
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  setPage: (page: Page) => void
  invite: (creator: CreatorProfile) => void
  viewCreator: (creator: CreatorProfile) => void
  openCampaign: () => void
  reset: () => void
  toast: (message: string) => void
}) {
  if (page === "business-insights")
    return <BusinessInsights data={data} setPage={setPage} />
  if (page === "planner")
    return (
      <CampaignPlanner
        role="business"
        data={data}
        setData={setData}
        setPage={setPage}
        toast={toast}
      />
    )
  if (page === "overview")
    return (
      <BusinessOverview
        data={data}
        setPage={setPage}
        openCampaign={openCampaign}
      />
    )
  if (page === "discover")
    return (
      <CreatorDiscovery
        data={data}
        invite={invite}
        viewCreator={viewCreator}
        toast={toast}
      />
    )
  if (page === "campaigns")
    return (
      <Campaigns data={data} openCampaign={openCampaign} setPage={setPage} />
    )
  if (page === "collaborations")
    return <BusinessCollaborations data={data} invite={invite} />
  if (page === "budget") return <BudgetSchedule data={data} />
  if (page === "billing") return <BillingPage role="business" />
  return <SettingsPage reset={reset} role="business" setData={setData} />
}

function BusinessOverview({
  data,
  setPage,
  openCampaign,
}: {
  data: AppData
  setPage: (page: Page) => void
  openCampaign: () => void
}) {
  const accepted = data.requests.filter(
    (request) => request.status === "accepted",
  )
  const pending = data.requests.filter(
    (request) => request.status === "pending",
  )
  const planned = data.campaigns.reduce(
    (sum, campaign) => sum + campaign.budget,
    0,
  )
  const focusCampaign =
    data.campaigns.find((item) => item.id === "campaign-glowlab-launch") ??
    data.campaigns[0]
  const projectedRevenue = 64000
  const projectedProfit = projectedRevenue - focusCampaign.budget
  const projectedRoi = Math.round(
    (projectedProfit / focusCampaign.budget) * 100,
  )
  const enquiries = data.requests.filter(
    (request) => request.direction === "application",
  )
  return (
    <>
      <PageHeader
        eyebrow="Monday, 16 June"
        title="Good morning, GlowLab"
        description="Here’s what’s moving across your creator campaigns."
        action={
          <Button icon={Plus} onClick={openCampaign}>
            New campaign
          </Button>
        }
      />
      <div className="metrics metrics-four">
        <Metric
          icon={BriefcaseBusiness}
          label="Active campaigns"
          value={data.campaigns.length}
          detail="Across 3 categories"
        />
        <Metric
          icon={BadgeIndianRupee}
          label="Planned budget"
          value={currency(planned)}
          detail="This campaign cycle"
          tone="green"
        />
        <Metric
          icon={Clock3}
          label="Pending requests"
          value={pending.length}
          detail="Awaiting creator response"
          tone="amber"
        />
        <Metric
          icon={Handshake}
          label="Confirmed"
          value={accepted.length}
          detail="Active collaborations"
          tone="blue"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel campaign-feature">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Priority campaign</p>
              <h2>Glow Reset Serum Launch</h2>
            </div>
            <Badge status="active">Active</Badge>
          </div>
          <p className="muted">
            Build trust through creator-led routines and ingredient
            storytelling.
          </p>
          <div className="campaign-visual">
            <div>
              <span>GLOWLAB</span>
              <strong>RESET</strong>
              <small>Barrier support serum</small>
            </div>
          </div>
          <div className="campaign-stats">
            <div>
              <span>Budget</span>
              <strong>₹25,000</strong>
            </div>
            <div>
              <span>Deadline</span>
              <strong>18 Jul</strong>
            </div>
            <div>
              <span>Creators</span>
              <strong>{accepted.length}/3</strong>
            </div>
          </div>
          <div className="button-row">
            <Button onClick={() => setPage("discover")}>Find creators</Button>
            <Button variant="secondary" onClick={() => setPage("budget")}>
              View schedule
            </Button>
          </div>
        </section>
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest updates</p>
              <h2>Recent activity</h2>
            </div>
          </div>
          <div className="activity-list">
            {data.requests.slice(0, 4).map((request) => (
              <div className="activity-item" key={request.id}>
                <span
                  className={cx("activity-icon", `activity-${request.status}`)}
                >
                  {request.status === "accepted" ? (
                    <Check size={16} />
                  ) : (
                    <Bell size={16} />
                  )}
                </span>
                <div>
                  <strong>
                    {request.creatorName}{" "}
                    {request.status === "pending"
                      ? "received an invitation"
                      : `${request.status} your request`}
                  </strong>
                  <p>
                    {
                      data.campaigns.find(
                        (campaign) => campaign.id === request.campaignId,
                      )?.name
                    }
                  </p>
                </div>
                <Badge status={request.status}>{request.status}</Badge>
              </div>
            ))}
            {data.requests.length === 0 && (
              <EmptyState
                icon={Bell}
                title="No activity yet"
                text="New campaign activity will appear here."
              />
            )}
          </div>
        </section>
      </div>
      <div className="insights-grid">
        <section className="panel profit-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Demo forecast</p>
              <h2>Profitability outlook</h2>
            </div>
            <Badge status="demo">Estimated</Badge>
          </div>
          <div className="profit-hero">
            <div>
              <span>Projected net profit</span>
              <strong>{currency(projectedProfit)}</strong>
              <small>
                Based on {currency(projectedRevenue)} projected campaign revenue
              </small>
            </div>
            <span>
              <TrendingUp size={18} />
              {projectedRoi}% ROI
            </span>
          </div>
          <div className="profit-breakdown">
            <div>
              <span>Planned investment</span>
              <strong>{currency(focusCampaign.budget)}</strong>
            </div>
            <div>
              <span>Revenue forecast</span>
              <strong>{currency(projectedRevenue)}</strong>
            </div>
            <div>
              <span>Break-even target</span>
              <strong>391 orders</strong>
            </div>
          </div>
          <p className="forecast-note">
            Fictional planning estimate only. No sales, attribution, or return
            data is connected.
          </p>
        </section>
        <section className="panel enquiry-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Creator enquiries</p>
              <h2>Inbound interest</h2>
            </div>
            <button
              className="text-link"
              onClick={() => setPage("collaborations")}
            >
              Manage all <ArrowRight size={14} />
            </button>
          </div>
          {enquiries.slice(0, 3).map((request) => (
            <div className="enquiry-item" key={request.id}>
              <span>
                {request.creatorName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div>
                <strong>{request.creatorName}</strong>
                <small>
                  Applied to{" "}
                  {
                    data.campaigns.find(
                      (campaign) => campaign.id === request.campaignId,
                    )?.name
                  }
                </small>
              </div>
              <Badge status={request.status}>{request.status}</Badge>
            </div>
          ))}
          {enquiries.length === 0 && (
            <EmptyState
              icon={MessageSquare}
              title="No creator enquiries yet"
              text="Applications from campaign discovery will appear here."
            />
          )}
        </section>
      </div>
    </>
  )
}

function BusinessInsights({
  data,
  setPage,
}: {
  data: AppData
  setPage: (page: Page) => void
}) {
  const [period, setPeriod] = useState<"30" | "90">("30")
  const accepted = data.requests.filter(
    (request) => request.status === "accepted",
  )
  const confirmedSpend = accepted.reduce((sum, request) => sum + request.fee, 0)
  const pendingSpend = data.requests
    .filter((request) => request.status === "pending")
    .reduce((sum, request) => sum + request.fee, 0)
  const campaignBudget =
    data.campaigns.find((item) => item.id === "campaign-glowlab-launch")
      ?.budget ?? 25000
  const trend =
    period === "30"
      ? [32, 44, 39, 58, 67, 82]
      : [24, 31, 45, 42, 56, 63, 72, 88]
  const revenue = period === "30" ? 64000 : 148000
  const investment = period === "30" ? campaignBudget : 57000
  const profit = revenue - investment
  const roi = Math.round((profit / investment) * 100)
  const funnel = [
    { label: "Creator profiles viewed", value: 24, width: 100 },
    { label: "Shortlisted", value: 8, width: 72 },
    {
      label: "Invited or applied",
      value: Math.max(data.requests.length, 1),
      width: 48,
    },
    { label: "Confirmed", value: accepted.length, width: 28 },
  ]
  return (
    <>
      <PageHeader
        eyebrow="Visual intelligence"
        title="Business insights"
        description="See how campaign investment, creator activity, and projected outcomes connect."
        action={
          <div className="period-switch" aria-label="Insight period">
            <button
              className={period === "30" ? "active" : ""}
              onClick={() => setPeriod("30")}
            >
              30 days
            </button>
            <button
              className={period === "90" ? "active" : ""}
              onClick={() => setPeriod("90")}
            >
              90 days
            </button>
          </div>
        }
      />
      <div className="demo-callout">
        <BarChart3 />
        <div>
          <strong>Illustrative business intelligence</strong>
          <p>
            Revenue, reach, conversion, and ROI are fictional planning
            forecasts. Creator request and spend totals reflect your local demo
            activity.
          </p>
        </div>
      </div>
      <div className="metrics metrics-four">
        <Metric
          icon={TrendingUp}
          label="Projected revenue"
          value={currency(revenue)}
          detail={`${period}-day demo forecast`}
          tone="green"
        />
        <Metric
          icon={BadgeIndianRupee}
          label="Planned investment"
          value={currency(investment)}
          detail="Campaign budget allocation"
        />
        <Metric
          icon={CircleDollarSign}
          label="Projected profit"
          value={currency(profit)}
          detail="Revenue minus investment"
          tone="blue"
        />
        <Metric
          icon={BarChart3}
          label="Forecast ROI"
          value={`${roi}%`}
          detail="Illustrative return"
          tone="amber"
        />
      </div>
      <div className="business-chart-grid">
        <section className="panel performance-chart">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Campaign momentum</p>
              <h2>Projected engagement trend</h2>
            </div>
            <span className="trend-positive">
              <TrendingUp size={14} /> +24%
            </span>
          </div>
          <div className="line-chart-visual">
            <div className="chart-axis">
              <span>12K</span>
              <span>8K</span>
              <span>4K</span>
              <span>0</span>
            </div>
            <div className="trend-bars">
              {trend.map((height, index) => (
                <div key={index}>
                  <i style={{ height: `${height}%` }}>
                    <span>{Math.round(height * 120)}</span>
                  </i>
                  <small>{index + 1}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-violet" /> Projected engagements
            </span>
            <small>Week number</small>
          </div>
        </section>
        <section className="panel allocation-chart">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Budget health</p>
              <h2>Glow Reset allocation</h2>
            </div>
            <button className="text-link" onClick={() => setPage("budget")}>
              Open budget <ArrowRight size={14} />
            </button>
          </div>
          <div className="donut-wrap">
            <div
              className="budget-donut"
              style={
                {
                  "--confirmed-angle": `${(confirmedSpend / campaignBudget) * 360}deg`,
                  "--pending-angle": `${
                    ((confirmedSpend + pendingSpend) / campaignBudget) * 360
                  }deg`,
                } as React.CSSProperties
              }
            >
              <span>
                <strong>{currency(campaignBudget - confirmedSpend)}</strong>
                <small>remaining</small>
              </span>
            </div>
            <div className="donut-legend">
              <div>
                <i className="dot-confirmed" />
                <span>Confirmed</span>
                <strong>{currency(confirmedSpend)}</strong>
              </div>
              <div>
                <i className="dot-pending" />
                <span>Pending</span>
                <strong>{currency(pendingSpend)}</strong>
              </div>
              <div>
                <i className="dot-available" />
                <span>Available</span>
                <strong>{currency(campaignBudget - confirmedSpend)}</strong>
              </div>
            </div>
          </div>
        </section>
        <section className="panel funnel-chart">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Creator pipeline</p>
              <h2>Discovery to collaboration</h2>
            </div>
            <Badge status="demo">Live demo state</Badge>
          </div>
          <div className="funnel-visual">
            {funnel.map((stage, index) => (
              <div
                key={stage.label}
                style={{ width: `${stage.width}%` }}
                className={`funnel-stage funnel-stage-${index}`}
              >
                <span>{stage.label}</span>
                <strong>{stage.value}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel campaign-comparison">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Portfolio view</p>
              <h2>Campaign budget comparison</h2>
            </div>
          </div>
          <div className="comparison-list">
            {data.campaigns.slice(0, 4).map((campaign) => {
              const maxBudget = Math.max(
                ...data.campaigns.map((item) => item.budget),
              )
              return (
                <div key={campaign.id}>
                  <span>
                    <strong>{campaign.name.replace(" · AI plan", "")}</strong>
                    <small>{currency(campaign.budget)}</small>
                  </span>
                  <div>
                    <i
                      style={{
                        width: `${(campaign.budget / maxBudget) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}

function CreatorDiscovery({
  data,
  invite,
  viewCreator,
  toast,
}: {
  data: AppData
  invite: (creator: CreatorProfile) => void
  viewCreator: (creator: CreatorProfile) => void
  toast: (message: string) => void
}) {
  const [search, setSearch] = useState("")
  const [niche, setNiche] = useState("All")
  const [budget, setBudget] = useState("10000")
  const [market, setMarket] = useState<"creators" | "vendors">("creators")
  const filtered = creators.filter(
    (creator) =>
      (niche === "All" || creator.niche === niche) &&
      creator.rate <= Number(budget) &&
      `${creator.name} ${creator.bio} ${creator.niche}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )
  return (
    <>
      <PageHeader
        eyebrow="Curated network"
        title="Find your next creative partner"
        description="Explore fictional demo profiles selected for your campaign goals."
      />
      <div className="market-tabs">
        <button
          className={market === "creators" ? "active" : ""}
          onClick={() => setMarket("creators")}
        >
          <Users size={17} /> Creators
        </button>
        <button
          className={market === "vendors" ? "active" : ""}
          onClick={() => setMarket("vendors")}
        >
          <Store size={17} /> Production vendors
        </button>
      </div>
      {market === "creators" ? (
        <>
          <div className="filterbar">
            <label className="search-field">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search creators or niches"
                aria-label="Search creators"
              />
            </label>
            <label>
              <SlidersHorizontal size={16} />
              <select
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
                aria-label="Filter by niche"
              >
                {["All", "Beauty", "Lifestyle", "Fashion", "Tech"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Up to
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                aria-label="Filter by creator rate"
              >
                <option value="5000">₹5,000</option>
                <option value="7500">₹7,500</option>
                <option value="10000">₹10,000</option>
              </select>
            </label>
          </div>
          <div className="creator-grid">
            {filtered.map((creator, index) => (
              <article className="creator-card" key={creator.id}>
                <div className="creator-image">
                  <img src={creator.image} alt="" />
                  <Badge>{creator.fit}% fit</Badge>
                  {index === 0 && (
                    <span className="recommended">Best match</span>
                  )}
                </div>
                <div className="creator-body">
                  <div className="creator-title">
                    <div>
                      <h2>{creator.name}</h2>
                      <p>{creator.handle}</p>
                    </div>
                    <Badge>{creator.niche}</Badge>
                  </div>
                  <RatingSummary
                    reviews={data.reviews.filter(
                      (review) => review.creatorId === creator.id,
                    )}
                  />
                  <p>{creator.bio}</p>
                  <div className="creator-meta">
                    <span>
                      <Users size={15} /> {creator.audience}
                    </span>
                    <span>
                      <Camera size={15} /> {creator.platform}
                    </span>
                  </div>
                  <a
                    className="portfolio-link"
                    href={creator.portfolio}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={13} />
                    View example portfolio
                  </a>
                  <div className="rate">
                    <span>Starting from</span>
                    <strong>{currency(creator.rate)}</strong>
                  </div>
                  <div className="button-row">
                    <Button
                      variant="secondary"
                      onClick={() => viewCreator(creator)}
                    >
                      View profile
                    </Button>
                    <Button onClick={() => invite(creator)}>Invite</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <EmptyState
              icon={Search}
              title="No creators found"
              text="Try widening your budget or choosing another niche."
            />
          )}
        </>
      ) : (
        <VendorMarketplace toast={toast} />
      )}
    </>
  )
}

function VendorMarketplace({ toast }: { toast: (message: string) => void }) {
  const vendors = [
    {
      name: "Framecraft Studio",
      type: "Photography",
      rate: "₹8,000 / day",
      icon: Camera,
      text: "Product and lifestyle shoots with studio lighting included.",
      portfolio:
        "https://www.behance.net/search/projects?search=product%20photography%20studio",
    },
    {
      name: "Motion Mint",
      type: "Videography",
      rate: "₹12,000 / day",
      icon: Film,
      text: "Lean two-person crew for social-first campaign films.",
      portfolio:
        "https://www.behance.net/search/projects?search=social%20campaign%20videography",
    },
    {
      name: "Cut Room Co.",
      type: "Editing",
      rate: "₹2,500 / video",
      icon: Pencil,
      text: "Fast, brand-aware edits for Reels, Shorts, and ads.",
      portfolio:
        "https://www.behance.net/search/projects?search=social%20video%20editing",
    },
  ]
  return (
    <div className="vendor-grid">
      {vendors.map((vendor) => (
        <article className="vendor-card" key={vendor.name}>
          <span className="vendor-icon">
            <vendor.icon />
          </span>
          <Badge>{vendor.type}</Badge>
          <h2>{vendor.name}</h2>
          <p>{vendor.text}</p>
          <a
            className="portfolio-link vendor-portfolio"
            href={vendor.portfolio}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={13} />
            View example portfolio
          </a>
          <div className="rate">
            <span>Sample rate</span>
            <strong>{vendor.rate}</strong>
          </div>
          <Button
            onClick={() => toast(`Booking request sent to ${vendor.name}`)}
          >
            Request booking
          </Button>
        </article>
      ))}
    </div>
  )
}

function Campaigns({
  data,
  openCampaign,
  setPage,
}: {
  data: AppData
  openCampaign: () => void
  setPage: (page: Page) => void
}) {
  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Plan briefs, budgets, deliverables, and creator partnerships in one place."
        action={
          <Button icon={Plus} onClick={openCampaign}>
            Create campaign
          </Button>
        }
      />
      <div className="campaign-list">
        {data.campaigns.map((campaign, index) => {
          const related = data.requests.filter(
            (request) => request.campaignId === campaign.id,
          )
          const spent = related
            .filter((request) => request.status === "accepted")
            .reduce((sum, request) => sum + request.fee, 0)
          return (
            <article className="campaign-row" key={campaign.id}>
              <div className={cx("campaign-monogram", `monogram-${index % 3}`)}>
                {campaign.brand.slice(0, 2).toUpperCase()}
              </div>
              <div className="campaign-info">
                <div>
                  <h2>{campaign.name}</h2>
                  {campaign.source === "ai-plan" && (
                    <Badge status="demo">
                      <Bot size={10} /> AI planned
                    </Badge>
                  )}
                  <Badge status="active">Active</Badge>
                </div>
                <p>{campaign.description}</p>
                <div className="inline-meta">
                  <span>
                    <CalendarDays size={15} /> {prettyDate(campaign.deadline)}
                  </span>
                  <span>
                    <BadgeIndianRupee size={15} /> {currency(campaign.budget)}
                  </span>
                  <span>
                    <Users size={15} /> {related.length} request
                    {related.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <div className="campaign-spend">
                <span>{currency(spent)} confirmed</span>
                <div>
                  <i
                    style={{
                      width: `${Math.min(100, (spent / campaign.budget) * 100)}%`,
                    }}
                  />
                </div>
                <Button variant="secondary" onClick={() => setPage("budget")}>
                  View details
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

function BusinessCollaborations({
  data,
  invite,
}: {
  data: AppData
  invite: (creator: CreatorProfile) => void
}) {
  return (
    <>
      <PageHeader
        title="Collaborations"
        description="Track every invitation and application across your campaigns."
        action={
          <Button icon={Plus} onClick={() => invite(creators[0])}>
            Invite Maya
          </Button>
        }
      />
      <div className="table-card">
        <div className="table-head">
          <span>Creator</span>
          <span>Campaign</span>
          <span>Fee</span>
          <span>Deadline</span>
          <span>Status</span>
        </div>
        {data.requests.map((request) => (
          <div className="table-row" key={request.id}>
            <div className="person-cell">
              <span>
                {request.creatorName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <strong>{request.creatorName}</strong>
            </div>
            <span>
              {
                data.campaigns.find(
                  (campaign) => campaign.id === request.campaignId,
                )?.name
              }
            </span>
            <strong>{currency(request.fee)}</strong>
            <span>{prettyDate(request.deadline)}</span>
            <Badge status={request.status}>{request.status}</Badge>
          </div>
        ))}
        {data.requests.length === 0 && (
          <EmptyState
            icon={Handshake}
            title="No collaborations yet"
            text="Invite a creator to start a shared workflow."
          />
        )}
      </div>
    </>
  )
}

function BudgetSchedule({ data }: { data: AppData }) {
  const campaign =
    data.campaigns.find((item) => item.id === "campaign-glowlab-launch") ||
    data.campaigns[0]
  const requests = data.requests.filter(
    (request) => request.campaignId === campaign.id,
  )
  const confirmed = requests
    .filter((request) => request.status === "accepted")
    .reduce((sum, request) => sum + request.fee, 0)
  const pending = requests
    .filter((request) => request.status === "pending")
    .reduce((sum, request) => sum + request.fee, 0)
  const remaining = campaign.budget - confirmed
  return (
    <>
      <PageHeader
        title="Budget & schedule"
        description={`A live view of committed costs and deadlines for ${campaign.name}.`}
      />
      <div className="budget-hero">
        <div>
          <p className="eyebrow">Campaign budget</p>
          <h2>{currency(campaign.budget)}</h2>
          <p>Only accepted collaborations count toward confirmed spend.</p>
        </div>
        <div
          className="budget-ring"
          style={
            {
              "--progress": `${(confirmed / campaign.budget) * 360}deg`,
            } as React.CSSProperties
          }
        >
          <span>
            <strong>{Math.round((confirmed / campaign.budget) * 100)}%</strong>
            <small>committed</small>
          </span>
        </div>
      </div>
      <div className="metrics metrics-three">
        <Metric
          icon={Clock3}
          label="Pending proposals"
          value={currency(pending)}
          detail="Not included in spend"
          tone="amber"
        />
        <Metric
          icon={CheckCircle2}
          label="Confirmed costs"
          value={currency(confirmed)}
          detail="Accepted collaborations"
          tone="green"
        />
        <Metric
          icon={WalletCards}
          label="Remaining budget"
          value={currency(remaining)}
          detail={`of ${currency(campaign.budget)}`}
        />
      </div>
      <div className="panel budget-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Utilisation</p>
            <h2>Campaign allocation</h2>
          </div>
          <strong>
            {currency(confirmed)} / {currency(campaign.budget)}
          </strong>
        </div>
        <div className="progress">
          <i
            style={{
              width: `${Math.min(100, (confirmed / campaign.budget) * 100)}%`,
            }}
          />
        </div>
        <div className="legend">
          <span>
            <i className="confirmed" /> Confirmed
          </span>
          <span>
            <i className="available" /> Available
          </span>
        </div>
      </div>
      <section className="panel schedule">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Delivery calendar</p>
            <h2>Upcoming schedule</h2>
          </div>
        </div>
        {requests
          .filter((request) => request.status === "accepted")
          .map((request) => (
            <div className="schedule-item" key={request.id}>
              <div className="date-tile">
                <strong>
                  {new Date(`${request.deadline}T12:00:00`).getDate()}
                </strong>
                <span>
                  {new Date(`${request.deadline}T12:00:00`).toLocaleString(
                    "en",
                    { month: "short" },
                  )}
                </span>
              </div>
              <div>
                <h3>{request.deliverables}</h3>
                <p>
                  {request.creatorName} · {campaign.name}
                </p>
              </div>
              <Badge status="accepted">Confirmed</Badge>
            </div>
          ))}
        {requests.every((request) => request.status !== "accepted") && (
          <EmptyState
            icon={CalendarDays}
            title="No confirmed dates yet"
            text="Accepted creator work will automatically appear on this schedule."
          />
        )}
      </section>
    </>
  )
}

function CreatorPages({
  page,
  data,
  setData,
  setPage,
  openBrief,
  updateStatus,
  reset,
  toast,
}: {
  page: Page
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  setPage: (page: Page) => void
  openBrief: (campaign: Campaign) => void
  updateStatus: (id: string, status: Status) => void
  reset: () => void
  toast: (message: string) => void
}) {
  if (page === "planner")
    return (
      <CampaignPlanner
        role="creator"
        data={data}
        setData={setData}
        setPage={setPage}
        toast={toast}
      />
    )
  if (page === "home") return <CreatorHome data={data} setPage={setPage} />
  if (page === "opportunities")
    return (
      <CampaignDiscovery
        data={data}
        setData={setData}
        openBrief={openBrief}
        toast={toast}
      />
    )
  if (page === "requests")
    return <CreatorRequests data={data} updateStatus={updateStatus} />
  if (page === "my-collaborations")
    return <MyCollaborations data={data} setData={setData} toast={toast} />
  if (page === "creator-insights") return <CreatorInsights data={data} />
  if (page === "profile")
    return <ProfileEditor data={data} setData={setData} toast={toast} />
  if (page === "earnings") return <Earnings data={data} />
  if (page === "billing") return <BillingPage role="creator" />
  return <SettingsPage reset={reset} role="creator" setData={setData} />
}

function CreatorHome({
  data,
  setPage,
}: {
  data: AppData
  setPage: (page: Page) => void
}) {
  const incoming = data.requests.filter(
    (request) =>
      request.creatorId === data.profile.id &&
      request.status === "pending" &&
      request.direction === "invitation",
  )
  const active = data.requests.filter(
    (request) =>
      request.creatorId === data.profile.id && request.status === "accepted",
  )
  return (
    <>
      <div className="creator-welcome">
        <div>
          <p className="eyebrow">Creator workspace</p>
          <h1>Make space for your best work, Maya.</h1>
          <p>
            Your opportunities, collaborations, and next deadlines—without the
            admin fog.
          </p>
        </div>
        <div className="profile-progress">
          <div>
            <span>Profile strength</span>
            <strong>85%</strong>
          </div>
          <div>
            <i />
          </div>
          <button onClick={() => setPage("profile")}>
            Complete profile <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div className="metrics metrics-four">
        <Metric
          icon={Bell}
          label="New invitations"
          value={incoming.length}
          detail="Waiting for your reply"
          tone="amber"
        />
        <Metric
          icon={Sparkles}
          label="Good-fit campaigns"
          value={2}
          detail="Based on Beauty niche"
        />
        <Metric
          icon={Handshake}
          label="Active work"
          value={active.length}
          detail="Confirmed collaborations"
          tone="green"
        />
        <Metric
          icon={CalendarDays}
          label="Next deadline"
          value={
            active[0]
              ? prettyDate(active[0].deadline).replace(" 2026", "")
              : "—"
          }
          detail={active[0] ? active[0].deliverables : "Nothing scheduled"}
          tone="blue"
        />
      </div>
      <div className="creator-home-grid">
        <section className="panel invitation-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Needs your attention</p>
              <h2>Incoming invitations</h2>
            </div>
            <button className="text-link" onClick={() => setPage("requests")}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {incoming.slice(0, 2).map((request) => {
            const campaign = data.campaigns.find(
              (item) => item.id === request.campaignId,
            )
            return (
              <div className="invitation-preview" key={request.id}>
                <div className="brand-tile">GL</div>
                <div>
                  <Badge>{campaign?.brand}</Badge>
                  <h3>{campaign?.name}</h3>
                  <p>{request.deliverables}</p>
                  <span>
                    <CalendarDays size={14} /> Due{" "}
                    {prettyDate(request.deadline)}
                  </span>
                </div>
                <div className="offer">
                  <span>Proposed fee</span>
                  <strong>{currency(request.fee)}</strong>
                  <Button onClick={() => setPage("requests")}>
                    Review request
                  </Button>
                </div>
              </div>
            )
          })}
          {incoming.length === 0 && (
            <EmptyState
              icon={CheckCircle2}
              title="You’re all caught up"
              text="New brand invitations will appear here."
            />
          )}
        </section>
        <section className="panel match-card">
          <div className="match-visual">
            <Sparkles />
            <span>94% match</span>
          </div>
          <p className="eyebrow">Picked for you</p>
          <h2>Glow Reset Serum Launch</h2>
          <p>
            A skincare storytelling brief that fits your beauty audience and UGC
            style.
          </p>
          <Button onClick={() => setPage("opportunities")}>
            Explore opportunity
          </Button>
        </section>
      </div>
    </>
  )
}

function CampaignDiscovery({
  data,
  setData,
  openBrief,
  toast,
}: {
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  openBrief: (campaign: Campaign) => void
  toast: (message: string) => void
}) {
  const [search, setSearch] = useState("")
  const [niche, setNiche] = useState("All")
  const filtered = data.campaigns.filter(
    (campaign) =>
      (niche === "All" || campaign.niche === niche) &&
      `${campaign.name} ${campaign.brand} ${campaign.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )
  return (
    <>
      <PageHeader
        eyebrow="Fresh opportunities"
        title="Campaigns made for your style"
        description="Discover fictional briefs from brands looking for creators like you."
      />
      <div className="filterbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search campaigns or brands"
            aria-label="Search campaigns"
          />
        </label>
        <label>
          <SlidersHorizontal size={16} />
          <select
            value={niche}
            onChange={(event) => setNiche(event.target.value)}
            aria-label="Filter by niche"
          >
            {["All", "Beauty", "Lifestyle", "Fashion"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="opportunity-grid">
        {filtered.map((campaign, index) => {
          const applied = data.requests.some(
            (request) =>
              request.campaignId === campaign.id &&
              request.creatorId === data.profile.id &&
              request.direction === "application",
          )
          return (
            <article className="opportunity-card" key={campaign.id}>
              <div
                className={cx("opportunity-top", `opportunity-${index % 3}`)}
              >
                <span>{campaign.brand.slice(0, 2).toUpperCase()}</span>
                <Badge>{campaign.niche}</Badge>
              </div>
              <div className="opportunity-body">
                <p className="brand-name">{campaign.brand}</p>
                <h2>{campaign.name}</h2>
                <p>{campaign.description}</p>
                <dl>
                  <div>
                    <dt>Deliverables</dt>
                    <dd>{campaign.deliverables}</dd>
                  </div>
                  <div>
                    <dt>Campaign budget</dt>
                    <dd>{currency(campaign.budget)}</dd>
                  </div>
                  <div>
                    <dt>Audience</dt>
                    <dd>{campaign.audience}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{prettyDate(campaign.deadline)}</dd>
                  </div>
                </dl>
                <div className="button-row">
                  <Button
                    variant="secondary"
                    onClick={() => openBrief(campaign)}
                  >
                    View brief
                  </Button>
                  <Button
                    disabled={applied}
                    onClick={() =>
                      applyToCampaign(campaign, data, setData, toast)
                    }
                  >
                    {applied ? "Applied" : "Apply now"}
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

function applyToCampaign(
  campaign: Campaign,
  data: AppData,
  setData: React.Dispatch<React.SetStateAction<AppData>>,
  toast: (message: string) => void,
) {
  if (
    data.requests.some(
      (request) =>
        request.campaignId === campaign.id &&
        request.creatorId === data.profile.id &&
        request.direction === "application",
    )
  ) {
    toast("You already applied to this campaign")
    return
  }
  const request: Request = {
    id: `application-${Date.now()}`,
    campaignId: campaign.id,
    creatorId: data.profile.id,
    creatorName: data.profile.name,
    fee: data.profile.rate,
    deliverables: campaign.deliverables,
    deadline: campaign.deadline,
    status: "pending",
    direction: "application",
    createdAt: new Date().toISOString().slice(0, 10),
  }
  setData((current) => ({
    ...current,
    requests: [request, ...current.requests],
  }))
  toast(`Application sent to ${campaign.brand}`)
}

function CreatorRequests({
  data,
  updateStatus,
}: {
  data: AppData
  updateStatus: (id: string, status: Status) => void
}) {
  const requests = data.requests.filter(
    (request) =>
      request.creatorId === data.profile.id &&
      request.direction === "invitation",
  )
  const pending = requests.filter((request) => request.status === "pending")
  const history = requests.filter((request) => request.status !== "pending")
  return (
    <>
      <PageHeader
        title="Collaboration requests"
        description="Review campaign details and decide what fits your schedule and style."
      />
      <div className="request-list">
        {pending.map((request) => {
          const campaign = data.campaigns.find(
            (item) => item.id === request.campaignId,
          )
          return (
            <article className="request-card" key={request.id}>
              <div className="request-brand">
                <span>{campaign?.brand.slice(0, 2).toUpperCase()}</span>
                <div>
                  <Badge>New invitation</Badge>
                  <h2>{campaign?.brand}</h2>
                </div>
              </div>
              <div className="request-main">
                <p className="eyebrow">{campaign?.name}</p>
                <h3>{request.deliverables}</h3>
                <p>{campaign?.description}</p>
                <div className="inline-meta">
                  <span>
                    <CalendarDays size={15} /> Due{" "}
                    {prettyDate(request.deadline)}
                  </span>
                  <span>
                    <Users size={15} /> {campaign?.audience}
                  </span>
                </div>
              </div>
              <div className="request-action">
                <span>Proposed fee</span>
                <strong>{currency(request.fee)}</strong>
                <small>Demo figure · no payment processed</small>
                <div className="button-row">
                  <Button
                    variant="secondary"
                    icon={X}
                    onClick={() => updateStatus(request.id, "declined")}
                  >
                    Decline
                  </Button>
                  <Button
                    icon={Check}
                    onClick={() => updateStatus(request.id, "accepted")}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
        {pending.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No requests waiting"
            text="You’ve responded to every invitation. Nice work."
          />
        )}
      </div>
      {history.length > 0 && (
        <>
          <div className="subsection-title">
            <h2>Request history</h2>
            <span>{history.length}</span>
          </div>
          <div className="history-list">
            {history.map((request) => (
              <div key={request.id}>
                <div>
                  <strong>
                    {
                      data.campaigns.find(
                        (campaign) => campaign.id === request.campaignId,
                      )?.name
                    }
                  </strong>
                  <span>
                    {request.creatorName} · {currency(request.fee)}
                  </span>
                </div>
                <Badge status={request.status}>{request.status}</Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

function MyCollaborations({
  data,
  setData,
  toast,
}: {
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  toast: (message: string) => void
}) {
  const [bookingRequest, setBookingRequest] = useState<Request | null>(null)
  const accepted = data.requests.filter(
    (request) =>
      request.creatorId === data.profile.id && request.status === "accepted",
  )
  return (
    <>
      <PageHeader
        title="My collaborations"
        description="Everything you’ve accepted, organized around the work ahead."
      />
      <div className="collaboration-grid">
        {accepted.map((request) => {
          const campaign = data.campaigns.find(
            (item) => item.id === request.campaignId,
          )
          const booking = data.productionBookings.find(
            (item) => item.requestId === request.id,
          )
          const productionCost = booking?.cost ?? 0
          const availableBudget = Math.max(0, request.fee - productionCost)
          return (
            <article className="collaboration-card" key={request.id}>
              <div className="collab-top">
                <span>{campaign?.brand.slice(0, 2).toUpperCase()}</span>
                <Badge status="accepted">Active</Badge>
              </div>
              <p className="eyebrow">{campaign?.brand}</p>
              <h2>{campaign?.name}</h2>
              <p>{request.deliverables}</p>
              <div className="mini-progress">
                <span>
                  <i />
                </span>
                <small>Planning · Deliverables not submitted</small>
              </div>
              <div className="collab-footer">
                <div>
                  <span>Creator allowance</span>
                  <strong>{currency(availableBudget)}</strong>
                </div>
                <div>
                  <span>Due</span>
                  <strong>{prettyDate(request.deadline)}</strong>
                </div>
              </div>
              {booking ? (
                <div className="production-booked">
                  <span>
                    <CheckCircle2 size={15} />
                    {booking.vendorName}
                  </span>
                  <strong>-{currency(booking.cost)}</strong>
                  <small>
                    {booking.service} booked from your fee allowance
                  </small>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  icon={Camera}
                  className="production-button"
                  onClick={() => setBookingRequest(request)}
                >
                  Book a production team
                </Button>
              )}
            </article>
          )
        })}
      </div>
      {accepted.length === 0 && (
        <EmptyState
          icon={Handshake}
          title="No active collaborations"
          text="Accepted requests will appear here with deliverables and dates."
        />
      )}
      {bookingRequest && (
        <ProductionBookingModal
          request={bookingRequest}
          onClose={() => setBookingRequest(null)}
          onBook={(booking) => {
            setData((current) => ({
              ...current,
              productionBookings: [
                booking,
                ...current.productionBookings.filter(
                  (item) => item.requestId !== booking.requestId,
                ),
              ],
            }))
            setBookingRequest(null)
            toast(
              `${booking.vendorName} booked. ${currency(booking.cost)} deducted from your creator allowance.`,
            )
          }}
        />
      )}
    </>
  )
}

function ProductionBookingModal({
  request,
  onClose,
  onBook,
}: {
  request: Request
  onClose: () => void
  onBook: (booking: ProductionBooking) => void
}) {
  const packages = [
    {
      name: "Solo Shoot Assist",
      vendor: "Framecraft Studio",
      service: "Camera operator · 2 hours",
      cost: 1200,
    },
    {
      name: "Reel Production Pair",
      vendor: "Motion Mint",
      service: "Videographer + lighting · 3 hours",
      cost: 2200,
    },
    {
      name: "Shoot + Edit Support",
      vendor: "Bridge Production Crew",
      service: "Camera operator + social edit",
      cost: 3200,
    },
  ]
  const [selected, setSelected] = useState(1)
  const chosen = packages[selected]
  const remaining = request.fee - chosen.cost
  return (
    <Modal
      title="Book production support"
      description="Use part of your collaboration fee allowance when you need equipment or crew."
      onClose={onClose}
    >
      <div className="allowance-summary">
        <div>
          <span>Collaboration fee</span>
          <strong>{currency(request.fee)}</strong>
        </div>
        <span>-</span>
        <div>
          <span>Production support</span>
          <strong>{currency(chosen.cost)}</strong>
        </div>
        <span>=</span>
        <div>
          <span>Remaining allowance</span>
          <strong>{currency(Math.max(0, remaining))}</strong>
        </div>
      </div>
      <div className="production-options">
        {packages.map((item, index) => (
          <button
            key={item.name}
            className={selected === index ? "selected" : ""}
            onClick={() => setSelected(index)}
          >
            <span className="radio-dot" />
            <div>
              <strong>{item.name}</strong>
              <small>
                {item.vendor} · {item.service}
              </small>
            </div>
            <strong>{currency(item.cost)}</strong>
          </button>
        ))}
      </div>
      <div className="booking-notice">
        <Camera size={17} />
        <p>
          Demo booking only. The selected cost reduces this collaboration’s
          available creator allowance; no real payment is processed.
        </p>
      </div>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={remaining < 0}
          onClick={() =>
            onBook({
              id: `production-${Date.now()}`,
              requestId: request.id,
              campaignId: request.campaignId,
              creatorId: request.creatorId,
              vendorName: chosen.vendor,
              service: chosen.service,
              cost: chosen.cost,
              createdAt: new Date().toISOString().slice(0, 10),
            })
          }
        >
          Confirm demo booking
        </Button>
      </div>
    </Modal>
  )
}

function CreatorInsights({ data }: { data: AppData }) {
  const creatorRequests = data.requests.filter(
    (request) => request.creatorId === data.profile.id,
  )
  const invitations = creatorRequests.filter(
    (request) => request.direction === "invitation",
  )
  const accepted = creatorRequests.filter(
    (request) => request.status === "accepted",
  )
  const responseRate = invitations.length
    ? Math.round(
        (invitations.filter((request) => request.status !== "pending").length /
          invitations.length) *
          100,
      )
    : 0
  const conversionRate = invitations.length
    ? Math.round((accepted.length / invitations.length) * 100)
    : 0
  const creatorReviews = data.reviews.filter(
    (review) => review.creatorId === data.profile.id,
  )
  const averageRating = creatorReviews.length
    ? creatorReviews.reduce((sum, review) => sum + review.rating, 0) /
      creatorReviews.length
    : 0
  const productionSpend = data.productionBookings
    .filter((booking) => booking.creatorId === data.profile.id)
    .reduce((sum, booking) => sum + booking.cost, 0)
  return (
    <>
      <PageHeader
        eyebrow="Demo analytics"
        title="Creator insights"
        description="Understand profile interest, opportunity fit, and how efficiently collaborations are converting."
      />
      <div className="demo-callout">
        <BarChart3 />
        <div>
          <strong>Illustrative insights</strong>
          <p>
            Profile reach and discovery figures are fictional demo metrics, not
            connected platform analytics.
          </p>
        </div>
      </div>
      <div className="metrics metrics-four">
        <Metric
          icon={Eye}
          label="Profile views"
          value="1,842"
          detail="+18% demo trend"
          tone="blue"
        />
        <Metric
          icon={Bell}
          label="Response rate"
          value={`${responseRate}%`}
          detail={`${invitations.length} brand invitations`}
          tone="green"
        />
        <Metric
          icon={TrendingUp}
          label="Invite conversion"
          value={`${conversionRate}%`}
          detail={`${accepted.length} accepted collaborations`}
        />
        <Metric
          icon={Star}
          label="Average rating"
          value={averageRating ? averageRating.toFixed(1) : "New"}
          detail={`${creatorReviews.length} business reviews`}
          tone="amber"
        />
      </div>
      <div className="creator-insight-grid">
        <section className="panel insight-chart">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Discovery trend</p>
              <h2>Profile interest</h2>
            </div>
            <Badge status="demo">Last 6 weeks</Badge>
          </div>
          <div
            className="bar-chart"
            aria-label="Illustrative profile views chart"
          >
            {[38, 53, 45, 70, 64, 88].map((height, index) => (
              <div key={index}>
                <i style={{ height: `${height}%` }} />
                <span>W{index + 1}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel insight-list">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What’s working</p>
              <h2>Opportunity signals</h2>
            </div>
          </div>
          <div>
            <span className="insight-rank">01</span>
            <div>
              <strong>Beauty is your strongest niche</strong>
              <p>Three of four suitable demo campaigns match your profile.</p>
            </div>
          </div>
          <div>
            <span className="insight-rank">02</span>
            <div>
              <strong>UGC services drive profile interest</strong>
              <p>
                Keep product storytelling prominent in your bio and portfolio.
              </p>
            </div>
          </div>
          <div>
            <span className="insight-rank">03</span>
            <div>
              <strong>{currency(productionSpend)} used for production</strong>
              <p>
                Booked crew costs are deducted from collaboration allowances.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function ProfileEditor({
  data,
  setData,
  toast,
}: {
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  toast: (message: string) => void
}) {
  const [form, setForm] = useState(data.profile)
  const change = (key: keyof CreatorProfile, value: string | number) =>
    setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (
      !form.name.trim() ||
      !form.bio.trim() ||
      !form.niche.trim() ||
      form.rate <= 0
    )
      return toast("Please complete all required fields")
    setData((current) => ({ ...current, profile: form }))
    toast("Profile saved successfully")
  }
  return (
    <>
      <PageHeader
        title="My profile"
        description="Help brands understand your audience, strengths, and creative services."
        action={
          <RatingSummary
            reviews={data.reviews.filter(
              (review) => review.creatorId === data.profile.id,
            )}
            large
          />
        }
      />
      <form className="profile-layout" onSubmit={submit}>
        <aside className="profile-preview">
          <img src={form.image} alt="" />
          <h2>{form.name}</h2>
          <p>{form.handle}</p>
          <Badge>{form.niche}</Badge>
          <div>
            <span>Audience</span>
            <strong>{form.audience}</strong>
          </div>
          <div>
            <span>Starting rate</span>
            <strong>{currency(form.rate)}</strong>
          </div>
          <small>Fictional demo profile</small>
        </aside>
        <section className="form-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Public details</p>
              <h2>Profile information</h2>
            </div>
          </div>
          <div className="form-grid">
            <Field label="Creator name" required>
              <input
                value={form.name}
                onChange={(event) => change("name", event.target.value)}
                required
              />
            </Field>
            <Field label="Primary niche" required>
              <select
                value={form.niche}
                onChange={(event) => change("niche", event.target.value)}
              >
                <option>Beauty</option>
                <option>Lifestyle</option>
                <option>Fashion</option>
                <option>Tech</option>
              </select>
            </Field>
            <Field label="Bio" wide required>
              <textarea
                value={form.bio}
                onChange={(event) => change("bio", event.target.value)}
                rows={4}
                required
              />
            </Field>
            <Field label="Social platforms">
              <input
                value={form.platform}
                onChange={(event) => change("platform", event.target.value)}
              />
            </Field>
            <Field label="Audience size">
              <input
                value={form.audience}
                onChange={(event) => change("audience", event.target.value)}
              />
            </Field>
            <Field label="Starting rate (₹)" required>
              <input
                type="number"
                min="1"
                value={form.rate}
                onChange={(event) => change("rate", Number(event.target.value))}
                required
              />
            </Field>
            <Field label="Portfolio URL">
              <input
                type="url"
                value={form.portfolio}
                onChange={(event) => change("portfolio", event.target.value)}
              />
            </Field>
            <Field label="Services" wide>
              <input
                value={form.services}
                onChange={(event) => change("services", event.target.value)}
              />
            </Field>
          </div>
          <div className="form-actions">
            <Button type="submit">Save profile</Button>
          </div>
        </section>
      </form>
      <section className="panel profile-reviews">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Business feedback</p>
            <h2>Ratings & comments</h2>
          </div>
          <Badge>
            {
              data.reviews.filter(
                (review) => review.creatorId === data.profile.id,
              ).length
            }{" "}
            reviews
          </Badge>
        </div>
        <div className="review-list">
          {data.reviews
            .filter((review) => review.creatorId === data.profile.id)
            .map((review) => (
              <ReviewItem review={review} key={review.id} />
            ))}
        </div>
      </section>
    </>
  )
}

function Earnings({ data }: { data: AppData }) {
  const grossProjected = data.requests
    .filter(
      (request) =>
        request.creatorId === data.profile.id && request.status === "accepted",
    )
    .reduce((sum, request) => sum + request.fee, 0)
  const productionCosts = data.productionBookings
    .filter((booking) => booking.creatorId === data.profile.id)
    .reduce((sum, booking) => sum + booking.cost, 0)
  const projected = grossProjected - productionCosts
  return (
    <>
      <PageHeader
        title="Earnings"
        description="A demo-only view of projected collaboration value. No payments have occurred."
      />
      <div className="demo-callout">
        <CircleDollarSign />
        <div>
          <strong>Demo financial view</strong>
          <p>
            Figures below are fictional and represent accepted collaboration
            fees, not processed payments.
          </p>
        </div>
      </div>
      <div className="earnings-hero">
        <div>
          <p>Projected creator allowance</p>
          <h2>{currency(projected)}</h2>
          <span>
            {currency(grossProjected)} gross minus {currency(productionCosts)}{" "}
            production support
          </span>
        </div>
        <BarChart3 />
      </div>
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Breakdown</p>
            <h2>Accepted work</h2>
          </div>
        </div>
        {data.requests
          .filter(
            (request) =>
              request.creatorId === data.profile.id &&
              request.status === "accepted",
          )
          .map((request) => {
            const bookingCost =
              data.productionBookings.find(
                (booking) => booking.requestId === request.id,
              )?.cost ?? 0
            return (
              <div className="earning-row" key={request.id}>
                <div>
                  <strong>
                    {
                      data.campaigns.find(
                        (campaign) => campaign.id === request.campaignId,
                      )?.name
                    }
                  </strong>
                  <span>
                    Due {prettyDate(request.deadline)}
                    {bookingCost > 0 &&
                      ` · ${currency(bookingCost)} production deducted`}
                  </span>
                </div>
                <strong>{currency(request.fee - bookingCost)}</strong>
                <Badge>Projected</Badge>
              </div>
            )
          })}
        {projected === 0 && (
          <EmptyState
            icon={CircleDollarSign}
            title="No projected earnings yet"
            text="Accepted collaborations will be summarized here."
          />
        )}
      </div>
    </>
  )
}

function CampaignPlanner({
  role,
  data,
  setData,
  setPage,
  toast,
}: {
  role: Role
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  setPage: (page: Page) => void
  toast: (message: string) => void
}) {
  const [message, setMessage] = useState("")
  const [thinking, setThinking] = useState(false)
  const messages = data.conversations[role]
  const campaign =
    data.campaigns.find((item) => item.id === "campaign-glowlab-launch") ??
    data.campaigns[0]
  const suggestions =
    role === "business"
      ? [
          "Plan my ₹25,000 budget",
          "Improve the creator brief",
          "Build a launch timeline",
        ]
      : [
          "Help me pitch a content concept",
          "Plan my deliverables",
          "Is ₹5,000 a fair scope?",
        ]

  const convertPlanToCampaign = () => {
    const existing = data.campaigns.find(
      (item) =>
        item.source === "ai-plan" && item.name === `${campaign.name} · AI plan`,
    )
    if (existing) {
      toast("This AI plan is already available in Campaigns")
      setPage("campaigns")
      return
    }
    const latestPlan = [...messages]
      .reverse()
      .find((item) => item.sender === "assistant")
    const plannedCampaign: Campaign = {
      ...campaign,
      id: `campaign-ai-${Date.now()}`,
      name: `${campaign.name} · AI plan`,
      description: `${campaign.description} Planning note: ${
        latestPlan?.text ?? "Campaign structure prepared with Bridge Planner."
      }`,
      source: "ai-plan",
    }
    setData((current) => ({
      ...current,
      campaigns: [plannedCampaign, ...current.campaigns],
    }))
    toast("AI plan converted into a new campaign")
    setPage("campaigns")
  }

  const sendMessage = (text: string) => {
    const clean = text.trim()
    if (!clean || thinking) return
    const userMessage: ChatMessage = {
      id: `chat-user-${Date.now()}`,
      sender: "user",
      text: clean,
      createdAt: new Date().toISOString(),
    }
    setData((current) => ({
      ...current,
      conversations: {
        ...current.conversations,
        [role]: [...current.conversations[role], userMessage],
      },
    }))
    setMessage("")
    setThinking(true)
    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `chat-assistant-${Date.now()}`,
        sender: "assistant",
        text: getPlannerResponse(clean, role, campaign),
        createdAt: new Date().toISOString(),
      }
      setData((current) => ({
        ...current,
        conversations: {
          ...current.conversations,
          [role]: [...current.conversations[role], assistantMessage],
        },
      }))
      setThinking(false)
    }, 650)
  }

  return (
    <>
      <PageHeader
        eyebrow="Planning workspace"
        title="AI campaign planner"
        description={
          role === "business"
            ? "Turn campaign goals into a clearer brief, budget, creator plan, and timeline."
            : "Think through your concept, scope, production plan, and response to a brand brief."
        }
        action={
          <div className="planner-actions">
            <Button
              variant="secondary"
              onClick={() =>
                setPage(role === "business" ? "campaigns" : "opportunities")
              }
            >
              View campaign context
            </Button>
            {role === "business" && (
              <Button icon={Plus} onClick={convertPlanToCampaign}>
                Convert plan to campaign
              </Button>
            )}
          </div>
        }
      />
      <div className="planner-layout">
        <aside className="planner-context">
          <div className="planner-badge">
            <Bot size={18} />
            <span>
              <strong>Demo planning assistant</strong>
              <small>Local responses · no live AI service</small>
            </span>
          </div>
          <p className="eyebrow">Current context</p>
          <h2>{campaign.name}</h2>
          <p>{campaign.description}</p>
          <dl>
            <div>
              <dt>Budget</dt>
              <dd>{currency(campaign.budget)}</dd>
            </div>
            <div>
              <dt>Deliverables</dt>
              <dd>{campaign.deliverables}</dd>
            </div>
            <div>
              <dt>Audience</dt>
              <dd>{campaign.audience}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>{prettyDate(campaign.deadline)}</dd>
            </div>
          </dl>
          <div className="planner-note">
            <Sparkles size={16} />
            <p>
              This hackathon demo uses transparent, rule-based guidance stored
              only in your browser. It does not call an external AI model.
            </p>
          </div>
        </aside>
        <section className="chat-panel">
          <div className="chat-head">
            <span className="assistant-avatar">
              <Bot />
            </span>
            <div>
              <strong>Bridge Planner</strong>
              <span>
                <i /> Ready to plan
              </span>
            </div>
            <Badge status="demo">Demo AI</Badge>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((item) => (
              <div
                className={cx("chat-message", `chat-${item.sender}`)}
                key={item.id}
              >
                {item.sender === "assistant" && (
                  <span>
                    <Bot size={15} />
                  </span>
                )}
                <div>
                  <p>{item.text}</p>
                  <small>
                    {item.sender === "assistant"
                      ? "Bridge Planner"
                      : role === "business"
                        ? "GlowLab"
                        : "Maya"}
                  </small>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="chat-message chat-assistant">
                <span>
                  <Bot size={15} />
                </span>
                <div className="typing" aria-label="Planner is responding">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
          </div>
          <div className="prompt-chips">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                disabled={thinking}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(message)
            }}
          >
            <label>
              <span className="sr-only">Message the campaign planner</span>
              <textarea
                rows={2}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  role === "business"
                    ? "Ask about budget, brief, creators, or timing..."
                    : "Ask about your concept, rate, scope, or schedule..."
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage(message)
                  }
                }}
              />
            </label>
            <Button
              type="submit"
              icon={Send}
              disabled={!message.trim() || thinking}
            >
              Send
            </Button>
          </form>
        </section>
      </div>
    </>
  )
}

function getPlannerResponse(message: string, role: Role, campaign: Campaign) {
  const input = message.toLowerCase()
  if (input.includes("budget") || input.includes("₹")) {
    return role === "business"
      ? `For the ${currency(campaign.budget)} budget, reserve ₹15,000 for three creator partnerships, ₹5,000 for production support, ₹3,000 for paid usage or revisions, and keep ₹2,000 as contingency. Confirm usage rights before moving contingency into creator fees.`
      : "For a ₹5,000 offer, anchor the scope to one edited Reel plus three story frames, one revision round, and organic usage only. Ask for a separate fee if the brand wants paid ads, raw footage, exclusivity, or extra revisions."
  }
  if (
    input.includes("brief") ||
    input.includes("concept") ||
    input.includes("pitch")
  ) {
    return role === "business"
      ? "Sharpen the brief around one message: barrier support that fits a real routine. Ask creators to show texture, application, and a credible personal use moment. Keep mandatory claims in a short checklist and leave the hook and visual treatment creator-led."
      : "Pitch a “skin reset after a long day” concept: open with a relatable stressed-skin moment, move into texture and application close-ups, then finish with a simple routine takeaway. Note that the final claims will follow the approved brand brief."
  }
  if (
    input.includes("timeline") ||
    input.includes("schedule") ||
    input.includes("deliverable")
  ) {
    return role === "business"
      ? "Use a four-step schedule: creator confirmation by 24 June, product delivery by 28 June, concept approval by 2 July, and first cut by 11 July. That leaves one revision round before the 18 July launch deadline."
      : "Break the work into four blocks: brief review and questions, concept and shot list, one focused production session, then edit and quality check. Submit your first cut at least four days before the deadline to protect time for one revision."
  }
  if (input.includes("creator") || input.includes("maya")) {
    return "Maya is the strongest match for this beauty brief because her profile emphasizes skincare education, tactile product footage, and an ingredient-conscious audience. Evaluate fit alongside availability, usage rights, and the exact revision scope."
  }
  return role === "business"
    ? `A strong next step is to define one campaign objective for “${campaign.name},” then align the creator brief, deliverables, and measurement plan to it. I can help with the budget split, brief wording, creator mix, or timeline—choose one and we’ll make it concrete.`
    : `Start by separating what the brief requires from where you have creative freedom. For “${campaign.name},” confirm claims, usage rights, revision rounds, and deadline first; then build a concept that feels native to your audience. I can help with your pitch, rate, deliverables, or schedule.`
}

function RatingSummary({
  reviews,
  large = false,
}: {
  reviews: Review[]
  large?: boolean
}) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0
  return (
    <div className={cx("rating-summary", large && "rating-large")}>
      <span>
        <Star size={large ? 18 : 13} fill="currentColor" />
      </span>
      <strong>{reviews.length ? average.toFixed(1) : "New"}</strong>
      <small>
        {reviews.length} review{reviews.length === 1 ? "" : "s"}
      </small>
    </div>
  )
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="review-item">
      <div className="review-head">
        <span>{review.author.slice(0, 2).toUpperCase()}</span>
        <div>
          <strong>{review.author}</strong>
          <small>{prettyDate(review.createdAt)}</small>
        </div>
        <div
          className="review-stars"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              fill={star <= review.rating ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>
      <p>{review.comment}</p>
    </article>
  )
}

function BillingPage({ role }: { role: Role }) {
  const plans = [
    ["Starter (free)", "0", role === "creator" ? "Solo creators testing the platform" : "Emerging brands testing the platform", "1", "1", "Yes", "12%", "Basic", "Pay per package", "Yes (limited storage)", "Community"],
    ["Creator Pro", "15 to 25", "Full-time creators", "10", "2", "Yes", "10%", "Full with ROI", "5% discount", "Yes", "Email"],
    ["Business", "49 to 79", "Brands and small teams", "30", "5", "Yes", "8%", "Full with multi-campaign ROI", "10% discount", "Yes", "Priority email"],
    ["Agency", "149 to 249", "Agencies and managers", "Unlimited", "15 (extra seats billed)", "Yes", "6% (negotiable)", "Full with client-level reporting", "15% discount", "Yes", "Dedicated manager"],
  ]
  const rows = [
    "Price per month",
    "Who it is for",
    "Active campaigns",
    "Team seats",
    "Marketplace booking",
    "Booking commission",
    "Budget and income tracker",
    "PR packages",
    "In-app chat and file sharing",
    "Support",
  ]
  return (
    <section className="billing-page">
      <PageHeader
        title="Billing & plans"
        description="Choose the plan that fits the way you create, collaborate, and grow."
      />
      <div className="billing-frame">
        <div className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th aria-label="Plan features" />
                {plans.map(([name]) => <th key={name}>{name}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((label, rowIndex) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {plans.map((plan) => (
                    <td key={`${plan[0]}-${label}`}>{plan[rowIndex + 1]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="billing-note">Annual billing gets about two months free.</p>
      </div>
    </section>
  )
}

function SettingsPage({
  reset,
  role,
}: {
  reset: () => void
  role: Role
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  return (
    <>
      <PageHeader
        title="Settings"
        description={`Manage your ${role} demo workspace preferences.`}
      />
      <div className="settings-card">
        <div>
          <span className="setting-icon">
            <RotateCcw />
          </span>
          <div>
            <h2>Reset demo data</h2>
            <p>
              Restore the seeded campaigns, profiles, and requests. This cannot
              be undone.
            </p>
          </div>
        </div>
        <Button variant="danger" onClick={reset}>
          Reset demo
        </Button>
      </div>
      <div className="settings-card">
        <div>
          <span className="setting-icon">
            <PackageCheck />
          </span>
          <div>
            <h2>Workspace details</h2>
            <p>
              Profiles, brands, transactions, and financial figures in this
              prototype are fictional.
            </p>
          </div>
        </div>
        <Badge status="demo">Local only</Badge>
      </div>
    </>
  )
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <div className="empty-state">
      <span>
        <Icon />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string
  required?: boolean
  wide?: boolean
  children: ReactNode
}) {
  return (
    <label className={wide ? "field-wide" : ""}>
      <span>
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  )
}

function InviteModal({
  creator,
  campaigns,
  onClose,
  onSubmit,
}: {
  creator: CreatorProfile
  campaigns: Campaign[]
  onClose: () => void
  onSubmit: (request: Request) => void
}) {
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || "")
  const campaign = campaigns.find((item) => item.id === campaignId)
  const [fee, setFee] = useState(
    creator.id === "creator-maya" ? 5000 : creator.rate,
  )
  const [deliverables, setDeliverables] = useState(campaign?.deliverables || "")
  const [deadline, setDeadline] = useState(campaign?.deadline || "")
  const [error, setError] = useState("")
  const changeCampaign = (id: string) => {
    setCampaignId(id)
    const next = campaigns.find((item) => item.id === id)
    if (next) {
      setDeliverables(next.deliverables)
      setDeadline(next.deadline)
    }
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!campaignId || fee <= 0 || !deliverables.trim() || !deadline)
      return setError("Complete all invitation details before sending.")
    onSubmit({
      id: `request-${Date.now()}`,
      campaignId,
      creatorId: creator.id,
      creatorName: creator.name,
      fee,
      deliverables,
      deadline,
      status: "pending",
      direction: "invitation",
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }
  return (
    <Modal
      title={`Invite ${creator.name}`}
      description="Send a clear offer they can review in their creator workspace."
      onClose={onClose}
    >
      <form onSubmit={submit} className="modal-form">
        <Field label="Campaign" required>
          <select
            value={campaignId}
            onChange={(event) => changeCampaign(event.target.value)}
          >
            {campaigns.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Proposed fee (₹)" required>
          <input
            type="number"
            min="1"
            value={fee}
            onChange={(event) => setFee(Number(event.target.value))}
          />
        </Field>
        <Field label="Deliverables" required>
          <textarea
            value={deliverables}
            onChange={(event) => setDeliverables(event.target.value)}
            rows={3}
          />
        </Field>
        <Field label="Deadline" required>
          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </Field>
        {error && (
          <p className="form-error">
            <XCircle size={15} /> {error}
          </p>
        )}
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Send invitation</Button>
        </div>
      </form>
    </Modal>
  )
}

function CreatorModal({
  creator,
  reviews,
  onClose,
  invite,
  onReview,
}: {
  creator: CreatorProfile
  reviews: Review[]
  onClose: () => void
  invite: (creator: CreatorProfile) => void
  onReview: (review: Review) => void
}) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const submitReview = (event: FormEvent) => {
    event.preventDefault()
    if (!comment.trim()) {
      setError("Add a short comment before publishing your review.")
      return
    }
    onReview({
      id: `review-${Date.now()}`,
      creatorId: creator.id,
      author: "GlowLab",
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setComment("")
    setError("")
  }
  return (
    <Modal title="Creator profile" onClose={onClose}>
      <div className="creator-modal-profile">
        <img src={creator.image} alt="" />
        <div>
          <Badge>{creator.niche}</Badge>
          <h2>{creator.name}</h2>
          <p>
            {creator.handle} · {creator.platform}
          </p>
          <RatingSummary reviews={reviews} />
        </div>
      </div>
      <p className="modal-bio">{creator.bio}</p>
      <div className="profile-facts">
        <div>
          <span>Audience</span>
          <strong>{creator.audience}</strong>
        </div>
        <div>
          <span>Starting rate</span>
          <strong>{currency(creator.rate)}</strong>
        </div>
        <div>
          <span>Services</span>
          <strong>{creator.services}</strong>
        </div>
      </div>
      <div className="reviews-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fictional demo feedback</p>
            <h2>Ratings & comments</h2>
          </div>
          <RatingSummary reviews={reviews} />
        </div>
        <div className="review-list review-list-modal">
          {reviews.slice(0, 3).map((review) => (
            <ReviewItem review={review} key={review.id} />
          ))}
          {reviews.length === 0 && (
            <p className="no-reviews">
              No comments yet. Be the first business to share feedback.
            </p>
          )}
        </div>
        <form className="review-form" onSubmit={submitReview}>
          <div>
            <label>Rate this creator</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={star <= rating ? "selected" : ""}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star${star === 1 ? "" : "s"}`}
                >
                  <Star size={21} fill="currentColor" />
                </button>
              ))}
            </div>
          </div>
          <label>
            <span>Comment</span>
            <textarea
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share specific, constructive feedback..."
            />
          </label>
          {error && (
            <p className="form-error">
              <XCircle size={15} /> {error}
            </p>
          )}
          <Button type="submit" variant="secondary">
            Publish review
          </Button>
        </form>
      </div>
      <div className="modal-actions">
        <Button
          variant="secondary"
          icon={ExternalLink}
          onClick={() =>
            window.open(creator.portfolio, "_blank", "noopener,noreferrer")
          }
        >
          Portfolio
        </Button>
        <Button
          onClick={() => {
            onClose()
            invite(creator)
          }}
        >
          Invite to campaign
        </Button>
      </div>
    </Modal>
  )
}

function BriefModal({
  campaign,
  applied,
  onClose,
  onApply,
}: {
  campaign: Campaign
  applied: boolean
  onClose: () => void
  onApply: () => void
}) {
  return (
    <Modal
      title={campaign.name}
      description={`${campaign.brand} · ${campaign.niche}`}
      onClose={onClose}
    >
      <div className="brief-section">
        <p className="eyebrow">The brief</p>
        <p>{campaign.description}</p>
      </div>
      <div className="brief-grid">
        <div>
          <span>Deliverables</span>
          <strong>{campaign.deliverables}</strong>
        </div>
        <div>
          <span>Target audience</span>
          <strong>{campaign.audience}</strong>
        </div>
        <div>
          <span>Total campaign budget</span>
          <strong>{currency(campaign.budget)}</strong>
        </div>
        <div>
          <span>Deadline</span>
          <strong>{prettyDate(campaign.deadline)}</strong>
        </div>
      </div>
      <p className="demo-note">
        This is a fictional demo opportunity. Applying creates a local request
        only.
      </p>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button disabled={applied} onClick={onApply}>
          {applied ? "Already applied" : "Apply to campaign"}
        </Button>
      </div>
    </Modal>
  )
}

function CampaignModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (campaign: Campaign) => void
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    deliverables: "",
    audience: "",
    budget: 25000,
    deadline: "",
    niche: "Beauty",
  })
  const [error, setError] = useState("")
  const update = (key: keyof typeof form, value: string | number) =>
    setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.deliverables.trim() ||
      !form.audience.trim() ||
      !form.deadline ||
      form.budget <= 0
    )
      return setError("Please complete every required field.")
    onSubmit({ id: `campaign-${Date.now()}`, brand: "GlowLab", ...form })
  }
  return (
    <Modal
      title="Create a campaign"
      description="Start with a focused brief. You can invite creators after saving."
      onClose={onClose}
    >
      <form onSubmit={submit} className="modal-form two-column">
        <Field label="Campaign name" required>
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </Field>
        <Field label="Preferred niche" required>
          <select
            value={form.niche}
            onChange={(event) => update("niche", event.target.value)}
          >
            <option>Beauty</option>
            <option>Lifestyle</option>
            <option>Fashion</option>
            <option>Tech</option>
          </select>
        </Field>
        <Field label="Description" wide required>
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
          />
        </Field>
        <Field label="Deliverables" wide required>
          <input
            value={form.deliverables}
            onChange={(event) => update("deliverables", event.target.value)}
            placeholder="e.g. 1 Reel + 3 story frames"
          />
        </Field>
        <Field label="Target audience" wide required>
          <input
            value={form.audience}
            onChange={(event) => update("audience", event.target.value)}
          />
        </Field>
        <Field label="Budget (₹)" required>
          <input
            type="number"
            min="1"
            value={form.budget}
            onChange={(event) => update("budget", Number(event.target.value))}
          />
        </Field>
        <Field label="Deadline" required>
          <input
            type="date"
            value={form.deadline}
            onChange={(event) => update("deadline", event.target.value)}
          />
        </Field>
        {error && (
          <p className="form-error field-wide">
            <XCircle size={15} /> {error}
          </p>
        )}
        <div className="modal-actions field-wide">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create campaign</Button>
        </div>
      </form>
    </Modal>
  )
}

export default App
