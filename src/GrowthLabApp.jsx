import React, { useState, useEffect } from "react";
import {
  Building2,
  Store,
  Coffee,
  Wrench,
  LayoutDashboard,
  Wallet,
  Bell,
  CreditCard,
  ShieldCheck,
  Users,
  LogOut,
  Plus,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const STORAGE_KEY = "growth_lab_platform_v1";

const DEFAULT_PLANS = [
  { id: "basic", name: "Basic", price: 149000, maxStaff: 2, modules: 1 },
  { id: "pro", name: "Professional", price: 299000, maxStaff: 10, modules: 4 },
  { id: "business", name: "Business", price: 599000, maxStaff: 999, modules: 4 },
];

const INITIAL_TENANTS = [
  {
    id: "tenant-1",
    businessName: "Kopi & Kos Nusantara",
    ownerName: "Budi Santoso",
    email: "owner@growthlab.id",
    planId: "pro",
    status: "Aktif",
    expiresAt: "2027-05-20",
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: "TRX-101",
    tenantId: "tenant-1",
    module: "Property / Kos",
    title: "Sewa Kamar A-01 - Rina",
    type: "Pemasukan",
    amount: 1500000,
    date: "2026-11-18",
  },
  {
    id: "TRX-102",
    tenantId: "tenant-1",
    module: "Cafe Manager",
    title: "Penjualan Meja 04 (Kopi & Snack)",
    type: "Pemasukan",
    amount: 185000,
    date: "2026-11-19",
  },
  {
    id: "TRX-103",
    tenantId: "tenant-1",
    module: "UMKM Manager",
    title: "Restock Kemasan & Bahan Baku",
    type: "Pengeluaran",
    amount: 420000,
    date: "2026-11-19",
  },
];

const INITIAL_MODUL_DATA = {
  rooms: [
    { id: "R-01", name: "Kamar A-01 (AC)", occupant: "Rina Wulandari", price: 1500000, status: "Terisi", dueDate: "2026-12-18" },
    { id: "R-02", name: "Kamar A-02 (Standar)", occupant: "-", price: 950000, status: "Tersedia", dueDate: "-" },
    { id: "R-03", name: "Kamar B-01", occupant: "-", price: 1200000, status: "Perbaikan", dueDate: "-" },
  ],
  products: [
    { id: "P-01", name: "Kopi Bubuk Signature 250g", category: "Minuman", stock: 24, minStock: 10, cost: 35000, price: 55000 },
    { id: "P-02", name: "Gula Aren Cair 1L", category: "Bahan Baku", stock: 6, minStock: 8, cost: 28000, price: 42000 },
  ],
  menus: [
    { id: "M-01", name: "Kopi Susu Gula Aren", category: "Kopi", price: 22000, tableNo: "Meja 04", status: "Selesai" },
    { id: "M-02", name: "Roti Bakar Coklat Keju", category: "Makanan", price: 18000, tableNo: "Meja 02", status: "Diproses" },
  ],
  bookings: [
    { id: "BK-01", customer: "Andi Pratama", service: "Servis & Tune Up Rutin", staff: "Rizky", date: "2026-11-21", price: 175000, status: "Terjadwal" },
    { id: "BK-02", customer: "Siti Rahma", service: "Perawatan Berkala Unit", staff: "Deni", date: "2026-11-22", price: 250000, status: "Selesai" },
  ],
};

export default function GrowthLabApp() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      user: null,
      tenants: INITIAL_TENANTS,
      plans: DEFAULT_PLANS,
      transactions: INITIAL_TRANSACTIONS,
      modulData: INITIAL_MODUL_DATA,
      waConfig: {
        apiKey: "",
        phoneNumberId: "",
        templateApproved: false,
        userConsent: false,
      },
    };
  });

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [authTab, setAuthTab] = useState("login");
  const [emailInput, setEmailInput] = useState("owner@growthlab.id");
  const [passwordInput, setPasswordInput] = useState("123456");
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newPlanId, setNewPlanId] = useState("pro");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTrxTitle, setNewTrxTitle] = useState("");
  const [newTrxAmount, setNewTrxAmount] = useState("");
  const [newTrxType, setNewTrxType] = useState("Pemasukan");
  const [newTrxModule, setNewTrxModule] = useState("UMKM Manager");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(num || 0));

  const quickLogin = (role) => {
    if (role === "superadmin") {
      setState((prev) => ({
        ...prev,
        user: { name: "Super Admin GROWTH LAB.", email: "admin@growthlab.id", role: "superadmin", tenantId: null },
      }));
    } else if (role === "owner") {
      const t = state.tenants[0] || INITIAL_TENANTS[0];
      setState((prev) => ({
        ...prev,
        user: { name: t.ownerName, email: t.email, role: "owner", tenantId: t.id },
      }));
    } else {
      const t = state.tenants[0] || INITIAL_TENANTS[0];
      setState((prev) => ({
        ...prev,
        user: { name: "Staff Operasional", email: "staff@growthlab.id", role: "staff", tenantId: t.id },
      }));
    }
    setActiveMenu("dashboard");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    if (emailInput.toLowerCase().includes("admin")) {
      quickLogin("superadmin");
    } else if (emailInput.toLowerCase().includes("staff")) {
      quickLogin("staff");
    } else {
      quickLogin("owner");
    }
  };

  const handleRegisterTenant = (e) => {
    e.preventDefault();
    if (!newBusinessName.trim() || !newOwnerName.trim()) return;
    const newId = "tenant-" + Date.now();
    const created = {
      id: newId,
      businessName: newBusinessName.trim(),
      ownerName: newOwnerName.trim(),
      email: emailInput.trim() || "baru@growthlab.id",
      planId: newPlanId,
      status: "Aktif",
      expiresAt: "2027-11-20",
    };
    setState((prev) => ({
      ...prev,
      tenants: [...prev.tenants, created],
      user: {
        name: created.ownerName,
        email: created.email,
        role: "owner",
        tenantId: created.id,
      },
    }));
    setNewBusinessName("");
    setNewOwnerName("");
    setActiveMenu("dashboard");
  };

  const visibleTransactions =
    state.user?.role === "superadmin"
      ? state.transactions
      : state.transactions.filter((t) => t.tenantId === state.user?.tenantId);

  const totalIncome = visibleTransactions
    .filter((t) => t.type === "Pemasukan")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = visibleTransactions
    .filter((t) => t.type === "Pengeluaran")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const nominal = Number(newTrxAmount);
    if (!newTrxTitle.trim() || !nominal || nominal <= 0) return;
    const trx = {
      id: "TRX-" + Math.floor(100 + Math.random() * 900),
      tenantId: state.user?.tenantId || "tenant-1",
      module: newTrxModule,
      title: newTrxTitle.trim(),
      type: newTrxType,
      amount: nominal,
      date: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({
      ...prev,
      transactions: [trx, ...prev.transactions],
    }));
    setNewTrxTitle("");
    setNewTrxAmount("");
  };

  const exportCsv = () => {
    const header = "ID,Tanggal,Modul,Keterangan,Jenis,Nominal\n";
    const rows = visibleTransactions
      .map((t) => `${t.id},${t.date},"${t.module}","${t.title}",${t.type},${t.amount}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-keuangan-growth-lab.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const waReady =
    Boolean(state.waConfig.apiKey.trim()) &&
    Boolean(state.waConfig.phoneNumberId.trim()) &&
    state.waConfig.templateApproved &&
    state.waConfig.userConsent;

  if (!state.user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              GROWTH LAB. — All-in-One Business Management Platform
            </div>
            <h1 className="text-2xl font-bold mt-3 text-white">Masuk ke Workspace</h1>
            <p className="text-sm text-slate-400 mt-1">
              Platform manajemen bisnis multi-klien untuk Property/Kos, UMKM, Cafe, dan Service.
            </p>
          </div>

          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setAuthTab("login")}
              className={`py-2 text-sm font-medium rounded-lg ${
                authTab === "login" ? "bg-emerald-500 text-slate-950" : "text-slate-400"
              }`}
            >
              Login Akun
            </button>
            <button
              type="button"
              onClick={() => setAuthTab("register")}
              className={`py-2 text-sm font-medium rounded-lg ${
                authTab === "register" ? "bg-emerald-500 text-slate-950" : "text-slate-400"
              }`}
            >
              Daftar Bisnis Baru
            </button>
          </div>

          {authTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition"
              >
                Masuk Sekarang
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterTenant} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nama Usaha / Bisnis</label>
                <input
                  type="text"
                  placeholder="Contoh: Kos Melati Indah"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nama Pemilik (Owner)</label>
                <input
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Paket Langganan</label>
                <select
                  value={newPlanId}
                  onChange={(e) => setNewPlanId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
                >
                  {state.plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      Paket {p.name} ({formatRupiah(p.price)}/bln)
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm"
              >
                Buat Ruang Bisnis
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-xs text-slate-400 font-medium">Akses Cepat Pengujian:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin("superadmin")}
                className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => quickLogin("owner")}
                className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
              >
                Owner Bisnis
              </button>
              <button
                type="button"
                onClick={() => quickLogin("staff")}
                className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
    { id: "property", label: "Property / Kos", icon: Building2 },
    { id: "umkm", label: "UMKM Manager", icon: Store },
    { id: "cafe", label: "Cafe Manager", icon: Coffee },
    { id: "service", label: "Service Manager", icon: Wrench },
    { id: "finance", label: "Keuangan & Laporan", icon: Wallet },
    { id: "notifications", label: "Notifikasi & WA API", icon: Bell },
    { id: "subscriptions", label: "Paket Langganan", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-white">GROWTH LAB.</div>
            <div className="text-[11px] text-emerald-400">All-in-One Business Management</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-white">{state.user.name}</div>
            <div className="text-slate-400 uppercase">{state.user.role}</div>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    active
                      ? "bg-emerald-500 text-slate-950 font-semibold"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setState((prev) => ({ ...prev, user: null }))}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-xs font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{activeMenu}</h2>
            <p className="text-xs text-slate-400">
              {state.user.role === "superadmin"
                ? "Mode Super Admin: Pantau seluruh klien, paket, dan performa platform."
                : "Isolasi multi-tenant aktif: Hanya menampilkan data bisnis Anda."}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {activeMenu === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Total Klien GROWTH LAB.</div>
                <div className="text-2xl font-bold mt-1 text-white">{state.tenants.length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Total Transaksi</div>
                <div className="text-2xl font-bold mt-1 text-white">{visibleTransactions.length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Total Pemasukan</div>
                <div className="text-2xl font-bold mt-1 text-emerald-400">{formatRupiah(totalIncome)}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Saldo Bersih</div>
                <div className="text-2xl font-bold mt-1 text-white">{formatRupiah(netBalance)}</div>
              </div>
            </div>

            {state.user.role === "superadmin" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Daftar Klien Terdaftar
                </div>
                <div className="divide-y divide-slate-800 text-xs">
                  {state.tenants.map((t) => (
                    <div key={t.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white">{t.businessName}</div>
                        <div className="text-slate-400">Owner: {t.ownerName} • Paket: {t.planId.toUpperCase()}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-medium">
                        {t.status}
    
