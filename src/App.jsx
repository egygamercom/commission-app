import { useState } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface2: #22263a;
    --border: #2e3352;
    --accent: #4f8aff;
    --accent2: #00e5a0;
    --accent3: #ff6b6b;
    --accent4: #ffd166;
    --text: #e8eaf6;
    --text2: #8892b0;
    --text3: #4a5380;
    --pending: #ffd166;
    --confirmed: #00e5a0;
    --reversed: #ff6b6b;
    --r: 12px;
    --r-sm: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  html, body { height: 100%; }
  body { background: var(--bg); color: var(--text); font-family: 'IBM Plex Sans Arabic', sans-serif; min-height: 100vh; }
  #root { min-height: 100vh; }

  .app { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 20px 0; position: fixed; top: 0; left: 0;
    height: 100vh; z-index: 100; transition: transform 0.3s ease; overflow-y: auto;
  }
  .sidebar.collapsed { transform: translateX(-240px); }
  .logo { padding: 0 20px 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .logo-title { font-size: 15px; font-weight: 700; color: var(--accent); }
  .logo-sub { font-size: 11px; color: var(--text2); margin-top: 2px; font-family: 'IBM Plex Mono', monospace; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 20px; cursor: pointer;
    font-size: 14px; color: var(--text2); transition: all 0.2s; border: none; background: none;
    width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(79,138,255,0.15); color: var(--accent); border-right: 3px solid var(--accent); }
  .nav-section { font-size: 10px; color: var(--text3); padding: 12px 20px 4px; text-transform: uppercase; letter-spacing: 1px; font-family: 'IBM Plex Mono', monospace; }
  .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid var(--border); }
  .user-chip { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; }
  .user-role { font-size: 11px; color: var(--text2); }

  .main { margin-left: 240px; flex: 1; padding: 24px; transition: margin 0.3s ease; min-width: 0; }

  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .menu-btn { background: var(--surface); border: 1px solid var(--border); color: var(--text); cursor: pointer; padding: 8px 10px; border-radius: var(--r-sm); font-size: 16px; display: none; }
  .page-title { font-size: 22px; font-weight: 700; }
  .page-sub { font-size: 13px; color: var(--text2); margin-top: 2px; }
  .topbar-right { display: flex; gap: 10px; align-items: center; }

  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: var(--r-sm); font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-family: inherit; text-decoration: none; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #6a9fff; }
  .btn-outline { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: var(--accent3); color: #fff; }
  .btn-danger:hover { background: #ff8585; }
  .btn-success { background: var(--accent2); color: #0f1117; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; }
  .grid { display: grid; gap: 16px; }
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }

  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--c, var(--accent)); }
  .stat-icon { font-size: 28px; margin-bottom: 12px; }
  .stat-label { font-size: 12px; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; font-family: 'IBM Plex Mono', monospace; }
  .stat-value { font-size: 28px; font-weight: 700; margin: 4px 0; font-family: 'IBM Plex Mono', monospace; }
  .stat-sub { font-size: 12px; color: var(--text2); }

  .table-wrap { overflow-x: auto; border-radius: var(--r); border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: var(--surface2); color: var(--text2); padding: 12px 16px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  td { padding: 12px 16px; border-top: 1px solid var(--border); color: var(--text); vertical-align: middle; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }
  .badge-pending { background: rgba(255,209,102,0.15); color: var(--pending); }
  .badge-confirmed { background: rgba(0,229,160,0.15); color: var(--confirmed); }
  .badge-reversed { background: rgba(255,107,107,0.15); color: var(--reversed); }
  .badge-admin { background: rgba(79,138,255,0.15); color: var(--accent); }
  .badge-manager { background: rgba(0,229,160,0.15); color: var(--accent2); }
  .badge-employee { background: rgba(255,209,102,0.15); color: var(--accent4); }

  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; color: var(--text2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-control {
    background: var(--surface2); border: 1px solid var(--border); color: var(--text);
    padding: 10px 14px; border-radius: var(--r-sm); font-size: 14px; font-family: inherit;
    transition: border-color 0.2s; outline: none; width: 100%;
  }
  .form-control:focus { border-color: var(--accent); }
  .form-control option { background: var(--surface2); }
  select.form-control { cursor: pointer; }

  .sale-line { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 14px; display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end; }
  .add-line-btn { width: 100%; padding: 10px; background: var(--surface2); border: 2px dashed var(--border); border-radius: var(--r-sm); color: var(--text3); cursor: pointer; font-size: 13px; transition: all 0.2s; font-family: inherit; }
  .add-line-btn:hover { border-color: var(--accent); color: var(--accent); }
  .remove-btn { background: rgba(255,107,107,0.15); border: none; color: var(--accent3); cursor: pointer; padding: 8px 10px; border-radius: var(--r-sm); font-size: 14px; transition: all 0.2s; }
  .remove-btn:hover { background: rgba(255,107,107,0.3); }

  .rank-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .rank-item:last-child { border-bottom: none; }
  .rank-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; font-family: 'IBM Plex Mono', monospace; }
  .rank-1 { background: linear-gradient(135deg, #ffd700, #ffaa00); color: #000; }
  .rank-2 { background: linear-gradient(135deg, #c0c0c0, #909090); color: #000; }
  .rank-3 { background: linear-gradient(135deg, #cd7f32, #a05a20); color: #fff; }
  .rank-n { background: var(--surface2); color: var(--text2); }
  .rank-name { flex: 1; font-size: 14px; font-weight: 600; }
  .rank-amount { font-size: 15px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--accent2); }

  .progress { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; margin-top: 6px; }
  .progress-fill { height: 100%; border-radius: 3px; background: var(--accent); transition: width 0.5s ease; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 24px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .close-btn { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 20px; padding: 4px; }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: var(--bg); }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; width: 100%; max-width: 380px; }
  .login-logo { font-size: 36px; text-align: center; margin-bottom: 8px; }
  .login-title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 4px; }
  .login-sub { font-size: 13px; color: var(--text2); text-align: center; margin-bottom: 28px; }
  .quick-btns { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 20px; }
  .quick-btn { padding: 8px; font-size: 11px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-sm); cursor: pointer; color: var(--text2); transition: all 0.2s; font-family: inherit; }
  .quick-btn:hover { border-color: var(--accent); color: var(--accent); }

  .notif { position: fixed; top: 20px; right: 20px; z-index: 999; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 14px 20px; font-size: 14px; box-shadow: var(--shadow); animation: slideIn 0.3s ease; max-width: 320px; }
  .notif.success { border-color: var(--accent2); }
  .notif.error { border-color: var(--accent3); }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .empty { text-align: center; padding: 48px 20px; color: var(--text3); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 16px; font-weight: 700; }

  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-amount { font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--accent2); }

  .csv-area { background: var(--surface2); border: 2px dashed var(--border); border-radius: var(--r); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .csv-area:hover { border-color: var(--accent); }

  .alert { padding: 12px 16px; border-radius: var(--r-sm); font-size: 13px; margin-bottom: 16px; border: 1px solid; }
  .alert-info { background: rgba(79,138,255,0.1); border-color: rgba(79,138,255,0.3); color: #a0baff; }
  .alert-warning { background: rgba(255,209,102,0.1); border-color: rgba(255,209,102,0.3); color: var(--pending); }

  .overlay-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; display: none; }
  .overlay-bg.show { display: block; }

  input[type="file"] { display: none; }
  .mt-4 { margin-top: 16px; }
  .mb-4 { margin-bottom: 16px; }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  .text-green { color: var(--accent2); }
  .text-red { color: var(--accent3); }
  .text-yellow { color: var(--accent4); }
  .text-blue { color: var(--accent); }
  .text-sm { font-size: 12px; color: var(--text2); }
  .w-full { width: 100%; }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-240px); }
    .sidebar.open { transform: translateX(0); }
    .main { margin-left: 0; padding: 16px; }
    .menu-btn { display: flex !important; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .sale-line { grid-template-columns: 1fr 1fr; }
    .sale-line > *:first-child { grid-column: 1/-1; }
    .quick-btns { grid-template-columns: 1fr; }
    .modal { padding: 16px; }
  }
  @media (max-width: 480px) {
    .page-title { font-size: 18px; }
  }
`;

// ─── Constants ─────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id: 1, name: "Ahmed Hassan",   role: "admin",    branch: null,    email: "admin@branch.com",  password: "admin123"   },
  { id: 2, name: "Sara Mohamed",   role: "manager",  branch: "Cairo", email: "cairo@branch.com",  password: "manager123" },
  { id: 3, name: "Khaled Ali",     role: "manager",  branch: "Alex",  email: "alex@branch.com",   password: "manager456" },
  { id: 4, name: "Youssef Ibrahim",role: "employee", branch: "Cairo", email: "y@branch.com",      password: "emp123"     },
  { id: 5, name: "Nour Salah",     role: "employee", branch: "Cairo", email: "n@branch.com",      password: "emp456"     },
  { id: 6, name: "Omar Tarek",     role: "employee", branch: "Alex",  email: "o@branch.com",      password: "emp789"     },
];

const BRANCHES = ["Cairo", "Alex", "Giza", "Mansoura"];
const DEFAULT_RATES = { "New Devices": 75, "Fabrika Devices": 50, "Used Games": 25 };
const CATEGORY_EMOJIS = { "New Devices": "📱", "Fabrika Devices": "🏭", "Used Games": "🎮" };

function generateId() { return Date.now() + Math.random().toString(36).substr(2, 5); }
function daysAgo(dateStr) { return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000); }
function monthKey(dateStr) { const d = new Date(dateStr); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
function formatEGP(n) { return `${Number(n).toLocaleString()} EGP`; }
function getCommissionStatus(sale, lockDays) {
  if (sale.returned) return "reversed";
  return daysAgo(sale.date) >= lockDays ? "confirmed" : "pending";
}

function generateDemoSales() {
  const sales = [];
  const now = new Date();
  const employees = DEMO_USERS.filter(u => u.role === "employee");
  const categories = Object.keys(DEFAULT_RATES);
  for (let i = 0; i < 40; i++) {
    const emp = employees[Math.floor(Math.random() * employees.length)];
    const daysBack = Math.floor(Math.random() * 60);
    const date = new Date(now); date.setDate(date.getDate() - daysBack);
    const lines = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      return { id: generateId(), category: cat, quantity: qty, commission: DEFAULT_RATES[cat] * qty };
    });
    sales.push({ id: generateId(), employeeId: emp.id, branch: emp.branch, date: date.toISOString().split("T")[0], lines, returned: Math.random() < 0.1, returnDate: null, note: "" });
  }
  return sales;
}

function getNav(role) {
  if (role === "admin") return [
    { label: "Overview",    items: [{ page: "dashboard", icon: "🏠", label: "Dashboard" }, { page: "reports", icon: "📊", label: "Reports" }] },
    { label: "Management",  items: [{ page: "sales", icon: "💰", label: "All Sales" }, { page: "csv", icon: "📂", label: "CSV Import" }, { page: "employees", icon: "👥", label: "Users" }, { page: "settings", icon: "⚙️", label: "Settings" }] },
  ];
  if (role === "manager") return [
    { label: "Overview", items: [{ page: "dashboard", icon: "🏠", label: "Dashboard" }, { page: "reports", icon: "📊", label: "Reports" }] },
    { label: "Branch",   items: [{ page: "sales", icon: "💰", label: "Branch Sales" }, { page: "csv", icon: "📂", label: "CSV Import" }] },
  ];
  return [{ label: "My Work", items: [{ page: "dashboard", icon: "🏠", label: "Dashboard" }, { page: "my-sales", icon: "💰", label: "My Sales" }] }];
}

function getPageTitle(page) {
  return { dashboard:"🏠 Dashboard", sales:"💰 Sales", "my-sales":"💰 My Sales", employees:"👥 Users", settings:"⚙️ Settings", reports:"📊 Reports", csv:"📂 CSV Import" }[page] || page;
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]           = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notif, setNotif]         = useState(null);
  const [modal, setModal]         = useState(null);
  const [users, setUsers]         = useState(DEMO_USERS);
  const [sales, setSales]         = useState(generateDemoSales);
  const [rates, setRates]         = useState(DEFAULT_RATES);
  const [lockDays, setLockDays]   = useState(7);

  function notify(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  }
  function addSale(sale) {
    setSales(prev => [...prev, { ...sale, id: generateId() }]);
    notify("✅ Sale recorded successfully!");
  }
  function returnSale(saleId) {
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, returned: true, returnDate: new Date().toISOString().split("T")[0] } : s));
    notify("↩️ Return processed!");
  }

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <LoginPage users={users} onLogin={u => { setUser(u); setPage("dashboard"); }} />
    </>
  );

  const nav = getNav(user.role);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className={`overlay-bg ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="logo">
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏪</div>
            <div className="logo-title">Branch Commission</div>
            <div className="logo-sub">System v1.0</div>
          </div>
          {nav.map((section, si) => (
            <div key={si}>
              <div className="nav-section">{section.label}</div>
              {section.items.map(item => (
                <button key={item.page} className={`nav-item ${page === item.page ? "active" : ""}`}
                  onClick={() => { setPage(item.page); setSidebarOpen(false); }}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="avatar">{user.name[0]}</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.branch || user.role}</div>
              </div>
            </div>
            <button className="btn btn-outline btn-sm w-full mt-4" onClick={() => setUser(null)}>🚪 Logout</button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <button className="menu-btn" style={{ display: "none" }} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
              <div>
                <div className="page-title">{getPageTitle(page)}</div>
                <div className="page-sub">{new Date().toLocaleDateString("en-EG", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</div>
              </div>
            </div>
            <div className="topbar-right">
              {(page === "sales" || page === "my-sales") && user.role !== "admin" && (
                <button className="btn btn-primary" onClick={() => setModal("new-sale")}>➕ New Sale</button>
              )}
            </div>
          </div>

          {page === "dashboard"  && <DashboardPage  user={user} sales={sales} rates={rates} lockDays={lockDays} users={users} />}
          {page === "sales"      && <SalesPage      user={user} sales={sales} users={users} rates={rates} lockDays={lockDays} onReturn={returnSale} setModal={setModal} />}
          {page === "my-sales"   && <SalesPage      user={user} sales={sales.filter(s => s.employeeId === user.id)} users={users} rates={rates} lockDays={lockDays} onReturn={returnSale} setModal={setModal} mine />}
          {page === "employees"  && <EmployeesPage  users={users} setUsers={setUsers} notify={notify} branches={BRANCHES} />}
          {page === "settings"   && <SettingsPage   rates={rates} setRates={setRates} lockDays={lockDays} setLockDays={setLockDays} notify={notify} />}
          {page === "reports"    && <ReportsPage    user={user} sales={sales} users={users} lockDays={lockDays} />}
          {page === "csv"        && <CSVPage        user={user} users={users} rates={rates} onImport={addSale} notify={notify} />}
        </main>

        {modal === "new-sale" && (
          <SaleModal user={user} rates={rates} users={users} onClose={() => setModal(null)}
            onSave={s => { addSale(s); setModal(null); }} />
        )}

        {notif && <div className={`notif ${notif.type}`}>{notif.msg}</div>}
      </div>
    </>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  function handleLogin() {
    const u = users.find(u => u.email === email && u.password === password);
    if (u) { onLogin(u); } else { setError("❌ Invalid email or password"); }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">🏪</div>
        <div className="login-title">Branch Commission</div>
        <div className="login-sub">Sign in to your account</div>
        {error && <div className="alert alert-warning">{error}</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="form-group">
            <label className="form-label">📧 Email</label>
            <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">🔐 Password</label>
            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary w-full" style={{ justifyContent:"center", padding:"12px" }} onClick={handleLogin}>Sign In →</button>
        </div>
        <div style={{ marginTop:24, borderTop:"1px solid var(--border)", paddingTop:16 }}>
          <div className="text-sm" style={{ textAlign:"center", marginBottom:12 }}>⚡ Quick Login (Demo)</div>
          <div className="quick-btns">
            {[{ label:"👑 Admin", u:users[0] }, { label:"🏪 Manager", u:users[1] }, { label:"👤 Employee", u:users[3] }].map(({ label, u }) => (
              <button key={u.id} className="quick-btn" onClick={() => onLogin(u)}>{label}</button>
            ))}
          </div>
          <div style={{ marginTop:16, fontSize:11, color:"var(--text3)", textAlign:"center" }}>
            admin@branch.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function DashboardPage({ user, sales, rates, lockDays, users }) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const mySales    = user.role === "employee" ? sales.filter(s => s.employeeId === user.id) : sales;
  const branchSales= user.role === "manager"  ? sales.filter(s => s.branch === user.branch) : mySales;
  const monthSales = branchSales.filter(s => monthKey(s.date) === thisMonth);

  function calcCommission(list) {
    return list.reduce((acc,s) => s.returned ? acc : acc + s.lines.reduce((a,l) => a+l.commission,0), 0);
  }
  function calcByStatus(list, status) {
    return list.filter(s => !s.returned && getCommissionStatus(s,lockDays)===status)
      .reduce((acc,s) => acc + s.lines.reduce((a,l) => a+l.commission,0), 0);
  }

  const totalMonth = calcCommission(monthSales);
  const pending    = calcByStatus(monthSales,"pending");
  const confirmed  = calcByStatus(monthSales,"confirmed");

  const byCategory = {};
  monthSales.filter(s=>!s.returned).forEach(s=>s.lines.forEach(l=>{
    byCategory[l.category] = (byCategory[l.category]||0) + l.commission;
  }));

  const employees  = users.filter(u => u.role==="employee" && (user.role==="admin" || u.branch===user.branch));
  const leaderboard= employees.map(emp => ({
    ...emp,
    total: calcCommission(branchSales.filter(s => s.employeeId===emp.id && monthKey(s.date)===thisMonth))
  })).sort((a,b)=>b.total-a.total);

  const history = [];
  for (let i=0;i<6;i++) {
    const d = new Date(now); d.setMonth(d.getMonth()-i);
    const mk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const s  = user.role==="employee" ? mySales : branchSales;
    history.push({ month:mk, label:d.toLocaleString("default",{month:"short",year:"2-digit"}), amount:calcCommission(s.filter(x=>monthKey(x.date)===mk)) });
  }
  const maxHistory = Math.max(...history.map(h=>h.amount),1);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div className="grid grid-4">
        {[
          { icon:"💰", label:"This Month",  value:totalMonth.toLocaleString(), sub:"EGP Commission",   c:"var(--accent)"  },
          { icon:"⏳", label:"Pending",     value:pending.toLocaleString(),    sub:`EGP (locked ${lockDays}d)`, c:"var(--pending)" },
          { icon:"✅", label:"Confirmed",   value:confirmed.toLocaleString(),  sub:"EGP Ready",         c:"var(--confirmed)"},
          { icon:"📦", label:"Sales",       value:monthSales.filter(s=>!s.returned).length, sub:"Invoices this month", c:"var(--accent4)"},
        ].map(s=>(
          <div key={s.label} className="stat-card" style={{"--c":s.c}}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="section-header"><div className="section-title">📊 By Category</div></div>
          {Object.entries(byCategory).length===0
            ? <div className="empty"><div className="empty-icon">📭</div><div className="empty-text">No sales this month</div></div>
            : Object.entries(byCategory).map(([cat,amt])=>(
              <div key={cat} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13 }}>{CATEGORY_EMOJIS[cat]} {cat}</span>
                  <span className="mono" style={{ fontSize:13,fontWeight:700,color:"var(--accent2)" }}>{formatEGP(amt)}</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{ width:`${(amt/totalMonth)*100}%` }} /></div>
              </div>
            ))}
        </div>

        <div className="card">
          <div className="section-header"><div className="section-title">📅 Monthly History</div></div>
          {history.map(h=>(
            <div key={h.month} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13 }}>{h.label}</span>
                <span className="mono" style={{ fontSize:13,fontWeight:700,color:h.month===thisMonth?"var(--accent2)":"var(--text2)" }}>{formatEGP(h.amount)}</span>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width:`${(h.amount/maxHistory)*100}%`, background:h.month===thisMonth?"var(--accent2)":"var(--accent)" }} /></div>
            </div>
          ))}
        </div>
      </div>

      {user.role!=="employee" && (
        <div className="card">
          <div className="section-header">
            <div className="section-title">🏆 Employee Leaderboard – {now.toLocaleString("default",{month:"long",year:"numeric"})}</div>
          </div>
          {leaderboard.length===0
            ? <div className="empty"><div className="empty-icon">🏅</div><div className="empty-text">No data</div></div>
            : leaderboard.map((emp,i)=>(
              <div key={emp.id} className="rank-item">
                <div className={`rank-num ${i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"rank-n"}`}>{i+1}</div>
                <div className="avatar" style={{ width:30,height:30,fontSize:12 }}>{emp.name[0]}</div>
                <div className="rank-name">{emp.name} <span className="text-sm">• {emp.branch}</span></div>
                <div className="rank-amount">{formatEGP(emp.total)}</div>
              </div>
            ))}
        </div>
      )}

      {user.role==="admin" && (
        <div className="card">
          <div className="section-header"><div className="section-title">🏪 Branch Overview</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Branch</th><th>Sales</th><th>Commission</th><th>Pending</th><th>Confirmed</th></tr></thead>
              <tbody>
                {BRANCHES.map(branch=>{
                  const bs    = sales.filter(s=>s.branch===branch && monthKey(s.date)===thisMonth);
                  const bc    = calcCommission(bs);
                  const bp    = calcByStatus(bs,"pending");
                  const bconf = calcByStatus(bs,"confirmed");
                  return (
                    <tr key={branch}>
                      <td>🏪 {branch}</td>
                      <td className="mono">{bs.filter(s=>!s.returned).length}</td>
                      <td className="mono text-green">{formatEGP(bc)}</td>
                      <td className="mono text-yellow">{formatEGP(bp)}</td>
                      <td className="mono text-green">{formatEGP(bconf)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sales Page ─────────────────────────────────────────────────────────────
function SalesPage({ user, sales, users, rates, lockDays, onReturn, setModal, mine }) {
  const [filter, setFilter] = useState({ month:"", status:"", branch:"" });
  const [search, setSearch] = useState("");

  const filtered = sales.filter(s => {
    if (filter.month  && !s.date.startsWith(filter.month)) return false;
    if (filter.status && getCommissionStatus(s,lockDays)!==filter.status) return false;
    if (filter.branch && s.branch!==filter.branch) return false;
    if (search) {
      const emp = users.find(u=>u.id===s.employeeId);
      if (!emp?.name.toLowerCase().includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const totalCommission = filtered.filter(s=>!s.returned).reduce((a,s)=>a+s.lines.reduce((b,l)=>b+l.commission,0),0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="card">
        <div className="grid grid-4">
          <div className="form-group">
            <label className="form-label">🔍 Search</label>
            <input className="form-control" placeholder="Employee name…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">📅 Month</label>
            <input className="form-control" type="month" value={filter.month} onChange={e=>setFilter(f=>({...f,month:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">⚡ Status</label>
            <select className="form-control" value={filter.status} onChange={e=>setFilter(f=>({...f,status:e.target.value}))}>
              <option value="">All</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="reversed">↩️ Reversed</option>
            </select>
          </div>
          {user.role==="admin" && (
            <div className="form-group">
              <label className="form-label">🏪 Branch</label>
              <select className="form-control" value={filter.branch} onChange={e=>setFilter(f=>({...f,branch:e.target.value}))}>
                <option value="">All</option>
                {BRANCHES.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
          )}
        </div>
        <div style={{ marginTop:12,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>
          <span className="text-sm">Showing {filtered.length} sales</span>
          <span style={{ fontSize:14,fontWeight:700,color:"var(--accent2)" }} className="mono">Total: {formatEGP(totalCommission)}</span>
          {!mine && user.role!=="admin" && <button className="btn btn-primary btn-sm" onClick={()=>setModal("new-sale")}>➕ New Sale</button>}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Employee</th><th>Branch</th><th>Items</th><th>Commission</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={7} style={{ textAlign:"center",padding:40,color:"var(--text3)" }}>No sales found 📭</td></tr>
              : [...filtered].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(s=>{
                  const emp    = users.find(u=>u.id===s.employeeId);
                  const status = getCommissionStatus(s,lockDays);
                  const total  = s.lines.reduce((a,l)=>a+l.commission,0);
                  return (
                    <tr key={s.id}>
                      <td className="mono" style={{ fontSize:12 }}>{s.date}</td>
                      <td>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <div className="avatar" style={{ width:26,height:26,fontSize:11 }}>{emp?.name[0]}</div>
                          {emp?.name}
                        </div>
                      </td>
                      <td>🏪 {s.branch}</td>
                      <td>{s.lines.map(l=>(
                        <div key={l.id} style={{ fontSize:12,color:"var(--text2)" }}>{CATEGORY_EMOJIS[l.category]} {l.category} × {l.quantity}</div>
                      ))}</td>
                      <td className="mono" style={{ color:s.returned?"var(--accent3)":"var(--accent2)",fontWeight:700 }}>
                        {s.returned?"-":""}{formatEGP(total)}
                      </td>
                      <td>
                        <span className={`badge badge-${status}`}>
                          {status==="pending"?"⏳":status==="confirmed"?"✅":"↩️"} {status}
                        </span>
                      </td>
                      <td>
                        {!s.returned && (user.role==="admin"||user.role==="manager") && (
                          <button className="btn btn-outline btn-sm" onClick={()=>onReturn(s.id)}>↩️ Return</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Sale Modal ─────────────────────────────────────────────────────────────
function SaleModal({ user, rates, users, onClose, onSave }) {
  const [date, setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [empId, setEmpId] = useState(user.role==="employee" ? user.id : "");
  const [lines, setLines] = useState([{ id:generateId(), category:"New Devices", quantity:1 }]);
  const [note, setNote]   = useState("");

  const employees     = users.filter(u=>u.role==="employee"&&(user.role==="admin"?true:u.branch===user.branch));
  const computedLines = lines.map(l=>({...l,commission:rates[l.category]*l.quantity}));
  const total         = computedLines.reduce((a,l)=>a+l.commission,0);
  const selectedEmp   = users.find(u=>u.id===Number(empId));

  function addLine()           { setLines(l=>[...l,{id:generateId(),category:"New Devices",quantity:1}]); }
  function removeLine(id)      { setLines(l=>l.filter(x=>x.id!==id)); }
  function updateLine(id,f,v)  { setLines(l=>l.map(x=>x.id===id?{...x,[f]:v}:x)); }

  function handleSave() {
    if (!empId) return;
    onSave({ employeeId:Number(empId), branch:selectedEmp?.branch, date, lines:computedLines, returned:false, returnDate:null, note });
  }

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">➕ New Sale Entry <button className="close-btn" onClick={onClose}>✕</button></div>
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">👤 Employee</label>
              <select className="form-control" value={empId} onChange={e=>setEmpId(e.target.value)} disabled={user.role==="employee"}>
                <option value="">Select employee…</option>
                {employees.map(e=><option key={e.id} value={e.id}>{e.name} – {e.branch}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">📅 Date</label>
              <input className="form-control" type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            <div className="form-label">📦 Sale Lines</div>
            {computedLines.map(line=>(
              <div key={line.id} className="sale-line">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={line.category} onChange={e=>updateLine(line.id,"category",e.target.value)}>
                    {Object.keys(rates).map(cat=><option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Qty</label>
                  <input className="form-control" type="number" min={1} value={line.quantity} onChange={e=>updateLine(line.id,"quantity",Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Commission</label>
                  <input className="form-control" value={formatEGP(line.commission)} readOnly style={{ color:"var(--accent2)" }} />
                </div>
                {computedLines.length>1 && <button className="remove-btn" onClick={()=>removeLine(line.id)}>🗑</button>}
              </div>
            ))}
            <button className="add-line-btn" onClick={addLine}>➕ Add Line</button>
          </div>

          <div className="form-group">
            <label className="form-label">📝 Note</label>
            <input className="form-control" placeholder="Optional note…" value={note} onChange={e=>setNote(e.target.value)} />
          </div>

          <div className="card" style={{ padding:14 }}>
            {computedLines.map(l=>(
              <div key={l.id} className="summary-row">
                <span>{CATEGORY_EMOJIS[l.category]} {l.category} × {l.quantity}</span>
                <span className="summary-amount">{formatEGP(l.commission)}</span>
              </div>
            ))}
            <div className="summary-row" style={{ fontWeight:700,fontSize:16 }}>
              <span>💰 Total</span><span className="summary-amount">{formatEGP(total)}</span>
            </div>
          </div>

          <div className="alert alert-info">⏳ Commission will be <strong>Pending</strong> for {7} days, then automatically <strong>Confirmed</strong>.</div>
          <div style={{ display:"flex",gap:10 }}>
            <button className="btn btn-outline w-full" style={{ justifyContent:"center" }} onClick={onClose}>Cancel</button>
            <button className="btn btn-primary w-full" style={{ justifyContent:"center" }} onClick={handleSave} disabled={!empId}>💾 Save Sale</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employees ──────────────────────────────────────────────────────────────
function EmployeesPage({ users, setUsers, notify, branches }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name:"", email:"", password:"", role:"employee", branch:"Cairo" });

  function addUser() {
    if (!form.name||!form.email||!form.password) return;
    setUsers(prev=>[...prev,{...form,id:Date.now()}]);
    setForm({ name:"",email:"",password:"",role:"employee",branch:"Cairo" });
    setShowForm(false);
    notify("✅ User added successfully!");
  }
  function removeUser(id) {
    setUsers(prev=>prev.filter(u=>u.id!==id));
    notify("🗑 User removed!");
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div style={{ display:"flex",justifyContent:"flex-end" }}>
        <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>➕ Add User</button>
      </div>

      {showForm && (
        <div className="card">
          <div className="section-title mb-4">👤 New User</div>
          <div className="grid grid-2" style={{ gap:12 }}>
            <div className="form-group"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-control" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Role</label>
              <select className="form-control" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Admin</option>
              </select>
            </div>
            {form.role!=="admin" && (
              <div className="form-group"><label className="form-label">Branch</label>
                <select className="form-control" value={form.branch} onChange={e=>setForm(f=>({...f,branch:e.target.value}))}>
                  {branches.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            )}
          </div>
          <div style={{ display:"flex",gap:10,marginTop:16 }}>
            <button className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={addUser}>💾 Save</button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td><div style={{ display:"flex",alignItems:"center",gap:8 }}><div className="avatar" style={{ width:28,height:28,fontSize:11 }}>{u.name[0]}</div>{u.name}</div></td>
                <td className="text-sm">{u.email}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role==="admin"?"👑":u.role==="manager"?"🏪":"👤"} {u.role}</span></td>
                <td>{u.branch||"—"}</td>
                <td>{u.id!==1&&<button className="btn btn-danger btn-sm" onClick={()=>removeUser(u.id)}>🗑</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Settings ───────────────────────────────────────────────────────────────
function SettingsPage({ rates, setRates, lockDays, setLockDays, notify }) {
  const [localRates, setLocalRates] = useState({...rates});
  const [localLock, setLocalLock]   = useState(lockDays);

  function save() { setRates(localRates); setLockDays(localLock); notify("⚙️ Settings saved!"); }

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16,maxWidth:500 }}>
      <div className="card">
        <div className="section-title mb-4">💰 Commission Rates (EGP per item)</div>
        {Object.keys(localRates).map(cat=>(
          <div key={cat} className="form-group mt-4">
            <label className="form-label">{CATEGORY_EMOJIS[cat]} {cat}</label>
            <input className="form-control" type="number" value={localRates[cat]} onChange={e=>setLocalRates(r=>({...r,[cat]:Number(e.target.value)}))} />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title mb-4">⏳ Lock Period</div>
        <div className="form-group">
          <label className="form-label">Days before Pending → Confirmed</label>
          <input className="form-control" type="number" min={1} value={localLock} onChange={e=>setLocalLock(Number(e.target.value))} />
        </div>
        <div className="alert alert-info mt-4">Sales older than <strong>{localLock} days</strong> will be automatically confirmed.</div>
      </div>
      <button className="btn btn-primary" onClick={save}>💾 Save Settings</button>
    </div>
  );
}

// ─── Reports ────────────────────────────────────────────────────────────────
function ReportsPage({ user, sales, users, lockDays }) {
  const [selectedMonth, setSelectedMonth] = useState(()=>{
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  });

  const scope      = user.role==="admin" ? sales : user.role==="manager" ? sales.filter(s=>s.branch===user.branch) : sales.filter(s=>s.employeeId===user.id);
  const monthSales = scope.filter(s=>monthKey(s.date)===selectedMonth);
  const employees  = users.filter(u=>u.role==="employee"&&(user.role==="admin"?true:u.branch===user.branch));

  const empData = employees.map(emp=>{
    const empSales  = monthSales.filter(s=>s.employeeId===emp.id);
    const total     = empSales.filter(s=>!s.returned).reduce((a,s)=>a+s.lines.reduce((b,l)=>b+l.commission,0),0);
    const pending   = empSales.filter(s=>!s.returned&&getCommissionStatus(s,lockDays)==="pending").reduce((a,s)=>a+s.lines.reduce((b,l)=>b+l.commission,0),0);
    const confirmed = empSales.filter(s=>!s.returned&&getCommissionStatus(s,lockDays)==="confirmed").reduce((a,s)=>a+s.lines.reduce((b,l)=>b+l.commission,0),0);
    const returns   = empSales.filter(s=>s.returned).length;
    return {...emp, total, pending, confirmed, returns, salesCount:empSales.length};
  });
  const grandTotal = empData.reduce((a,e)=>a+e.total,0);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div className="card">
        <div className="form-group" style={{ maxWidth:200 }}>
          <label className="form-label">📅 Report Month</label>
          <input className="form-control" type="month" value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="section-header">
          <div className="section-title">📊 Employee Commission Report</div>
          <div className="mono" style={{ color:"var(--accent2)",fontWeight:700 }}>Total: {formatEGP(grandTotal)}</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Employee</th><th>Branch</th><th>Sales</th><th>Returns</th><th>Pending</th><th>Confirmed</th><th>Total</th></tr></thead>
            <tbody>
              {empData.length===0
                ? <tr><td colSpan={8} style={{ textAlign:"center",padding:40,color:"var(--text3)" }}>No data for this month 📭</td></tr>
                : [...empData].sort((a,b)=>b.total-a.total).map((emp,i)=>(
                  <tr key={emp.id}>
                    <td className="mono text-sm">{i+1}</td>
                    <td><div style={{ display:"flex",alignItems:"center",gap:8 }}><div className="avatar" style={{ width:26,height:26,fontSize:11 }}>{emp.name[0]}</div>{emp.name}</div></td>
                    <td>🏪 {emp.branch}</td>
                    <td className="mono">{emp.salesCount}</td>
                    <td className="mono text-red">{emp.returns}</td>
                    <td className="mono text-yellow">{formatEGP(emp.pending)}</td>
                    <td className="mono text-green">{formatEGP(emp.confirmed)}</td>
                    <td className="mono" style={{ fontWeight:700,color:"var(--accent2)" }}>{formatEGP(emp.total)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CSV Import ─────────────────────────────────────────────────────────────
function CSVPage({ user, users, rates, onImport, notify }) {
  const [preview, setPreview] = useState([]);
  const [error, setError]     = useState("");

  const template = `employee_email,date,category,quantity\ny@branch.com,2024-01-15,New Devices,3\ny@branch.com,2024-01-15,Used Games,5`;

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines  = ev.target.result.split("\n").filter(Boolean);
      const header = lines[0].split(",").map(h=>h.trim());
      const rows=[], errors=[];
      for (let i=1;i<lines.length;i++) {
        const vals = lines[i].split(",").map(v=>v.trim());
        const row  = {};
        header.forEach((h,j)=>row[h]=vals[j]);
        const emp  = users.find(u=>u.email===row.employee_email);
        if (!emp)            { errors.push(`Row ${i+1}: Employee not found (${row.employee_email})`); continue; }
        if (!rates[row.category]) { errors.push(`Row ${i+1}: Invalid category (${row.category})`); continue; }
        const qty  = Number(row.quantity);
        if (!qty||qty<1)     { errors.push(`Row ${i+1}: Invalid quantity`); continue; }
        rows.push({ emp, date:row.date, category:row.category, quantity:qty, commission:rates[row.category]*qty });
      }
      setError(errors.join("\n"));
      setPreview(rows);
    };
    reader.readAsText(file);
  }

  function importAll() {
    preview.forEach(row=>{
      onImport({ employeeId:row.emp.id, branch:row.emp.branch, date:row.date,
        lines:[{ id:generateId(),category:row.category,quantity:row.quantity,commission:row.commission }],
        returned:false, returnDate:null, note:"CSV Import" });
    });
    setPreview([]);
    notify(`✅ Imported ${preview.length} sales!`);
  }

  function downloadTemplate() {
    const blob = new Blob([template],{type:"text/csv"});
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = "commission_template.csv";
    a.click();
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div className="card">
        <div className="section-title mb-4">📂 Import Sales via CSV</div>
        <div className="alert alert-info">Upload a CSV with columns: <strong>employee_email, date, category, quantity</strong></div>
        <label>
          <input type="file" accept=".csv" onChange={handleFile} />
          <div className="csv-area mt-4">
            <div style={{ fontSize:40,marginBottom:12 }}>📤</div>
            <div style={{ fontWeight:600,marginBottom:4 }}>Click to upload CSV file</div>
            <div className="text-sm">Supports .csv files</div>
          </div>
        </label>
        <div style={{ marginTop:12 }}>
          <button className="btn btn-outline" onClick={downloadTemplate}>⬇️ Download Template</button>
        </div>
      </div>

      {error && <div className="alert alert-warning" style={{ whiteSpace:"pre-wrap" }}>⚠️ {error}</div>}

      {preview.length>0 && (
        <div className="card">
          <div className="section-header">
            <div className="section-title">👁 Preview ({preview.length} rows)</div>
            <button className="btn btn-success" onClick={importAll}>✅ Import All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Branch</th><th>Date</th><th>Category</th><th>Qty</th><th>Commission</th></tr></thead>
              <tbody>
                {preview.map((row,i)=>(
                  <tr key={i}>
                    <td>{row.emp.name}</td>
                    <td>{row.emp.branch}</td>
                    <td className="mono">{row.date}</td>
                    <td>{CATEGORY_EMOJIS[row.category]} {row.category}</td>
                    <td className="mono">{row.quantity}</td>
                    <td className="mono text-green">{formatEGP(row.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
