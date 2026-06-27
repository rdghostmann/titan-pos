// Home.tsx
"use client";
import { useState, useEffect } from 'react';
import {
  getSavedGasSales,
  saveGasSales,
  getSavedCarWashSales,
  saveCarWashSales,
  getSavedUsers,
  saveUsers,
  getSavedProducts,
  saveProducts,
  getSavedGeneralSales,
  saveGeneralSales,
  getSavedStockLogs,
  saveStockLogs
} from '@/mockData';
import { GasSale, CarWashSale, User, UserRole, Product, GeneralSale, StockLog } from '@/types';

// Icons
import {
  TrendingUp,
  Captions,
  Flame,
  Droplet,
  FileText,
  FileSpreadsheet,
  Users,
  Sun,
  Moon,
  Menu,
  X,
  ShieldAlert,
  UserCheck,
  MapPin,
  BellRing,
  CheckCircle,
  Boxes,
  ShoppingCart
} from 'lucide-react';

// Sub Components
import Dashboard from '@/components/Dashboard';
import GasPOS from '@/components/GasPOS';
import CarWashPOS from '@/components/CarWashPOS';
import Reporting from '@/components/Reporting';
import ExcelIO from '@/components/ExcelIO';
import UserManagement from '@/components/UserManagement';
import GeneralPOS from '@/components/GeneralPOS';
import Inventory from '@/components/Inventory';

export default function Home() {
  // Database local states
  const [gasSales, setGasSales] = useState<GasSale[]>(() => getSavedGasSales());
  const [carWashSales, setCarWashSales] = useState<CarWashSale[]>(() => getSavedCarWashSales());
  const [posUsers, setPosUsers] = useState<User[]>(() => getSavedUsers());
  const [products, setProducts] = useState<Product[]>(() => getSavedProducts());
  const [generalSales, setGeneralSales] = useState<GeneralSale[]>(() => getSavedGeneralSales());
  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => getSavedStockLogs());

  // Simulation Login States
  const [currentUsername, setCurrentUsername] = useState('admin');
  const [currentRole, setCurrentRole] = useState<UserRole>('Administrator');
  const [currentName, setCurrentName] = useState('Alhaji Ibrahim');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gas' | 'carwash' | 'retail_pos' | 'inventory' | 'reports' | 'excel' | 'users'>('dashboard');

  // Dark/Light State
  const [darkMode, setDarkMode] = useState(false);

  // Responsive Mobile Drawer toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize theme
  useEffect(() => {
    const isDark = localStorage.getItem("theme_dark") === "true";

    // setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Sync state mutations helper
  const handleAddGasSale = (sale: GasSale) => {
    const next = [sale, ...gasSales];
    setGasSales(next);
    saveGasSales(next);
  };

  const handleDeleteGasSale = (id: string) => {
    const next = gasSales.filter(g => g.id !== id);
    setGasSales(next);
    saveGasSales(next);
  };

  const handleAddCWSale = (sale: CarWashSale) => {
    const next = [sale, ...carWashSales];
    setCarWashSales(next);
    saveCarWashSales(next);
  };

  const handleDeleteCWSale = (id: string) => {
    const next = carWashSales.filter(c => c.id !== id);
    setCarWashSales(next);
    saveCarWashSales(next);
  };

  const handleAddUser = (user: User) => {
    const next = [...posUsers, user];
    setPosUsers(next);
    saveUsers(next);
  };

  const handleDeleteUser = (id: string) => {
    const next = posUsers.filter(u => u.id !== id);
    setPosUsers(next);
    saveUsers(next);
  };

  const handleAddProduct = (prod: Product) => {
    const next = [prod, ...products];
    setProducts(next);
    saveProducts(next);
  };

  const handleUpdateProduct = (prod: Product) => {
    const next = products.map(p => p.id === prod.id ? prod : p);
    setProducts(next);
    saveProducts(next);
  };

  const handleDeleteProduct = (id: string) => {
    const next = products.filter(p => p.id !== id);
    setProducts(next);
    saveProducts(next);
  };

  const handleAddGeneralSale = (sale: GeneralSale) => {
    const next = [sale, ...generalSales];
    setGeneralSales(next);
    saveGeneralSales(next);
  };

  const handleAddStockLog = (log: StockLog) => {
    const next = [log, ...stockLogs];
    setStockLogs(next);
    saveStockLogs(next);
  };

  // Switch Context simulation
  const handleSwitchUser = (username: string) => {
    const target = posUsers.find(u => u.username === username);
    if (target) {
      setCurrentUsername(target.username);
      setCurrentRole(target.role);
      setCurrentName(target.name);

      // Auto-restrict tab perspective if needed:
      // e.g. Pump attendants can't see Excel settings. Auto route to GasPOS or Dashboard
      if (target.role === 'Pump Attendant') {
        setActiveTab('gas');
      } else if (target.role === 'Car Wash Attendant') {
        setActiveTab('carwash');
      } else {
        setActiveTab('dashboard');
      }
    }
  };

  // Bulk Import Overwrite Helpers (Spreadsheet recovery)
  const handleImportGasSales = (data: GasSale[], mode: 'merge' | 'replace') => {
    let next: GasSale[] = [];
    if (mode === 'replace') {
      next = data;
    } else {
      // Merge: Avoid duplicating identical receipt numbers
      const existingMap = new Map<string, GasSale>(gasSales.map(g => [g.receiptNumber, g]));
      data.forEach(item => {
        existingMap.set(item.receiptNumber, item); // Overwrites duplicates
      });
      next = Array.from(existingMap.values());
    }
    setGasSales(next);
    saveGasSales(next);
  };

  const handleImportCarWashSales = (data: CarWashSale[], mode: 'merge' | 'replace') => {
    let next: CarWashSale[] = [];
    if (mode === 'replace') {
      next = data;
    } else {
      const existingMap = new Map<string, CarWashSale>(carWashSales.map(c => [c.receiptNumber, c]));
      data.forEach(item => {
        existingMap.set(item.receiptNumber, item);
      });
      next = Array.from(existingMap.values());
    }
    setCarWashSales(next);
    saveCarWashSales(next);
  };

  // Toast triggers
  const showToastMsg = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message: msg, type });
  };

  // Auto clear toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Darkmode toggler
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme_dark', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToastMsg(`Theme switched to ${next ? 'Night Mode' : 'Day Mode'}!`, 'info');
  };

  // Role permissions checking guard
  // Helper to determine if menu option should render
  const isAccessible = (tab: typeof activeTab) => {
    if (currentRole === 'Administrator') return true;
    if (currentRole === 'Cashier') {
      // Cashier can access everything except Excel backup setup & creating users
      return tab !== 'excel';
    }
    if (currentRole === 'Pump Attendant') {
      return tab === 'gas';
    }
    if (currentRole === 'Car Wash Attendant') {
      return tab === 'carwash';
    }
    return false;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">

      {/* 1. SIDEBAR NAVIGATION WINDOW */}
      <aside
        id="main-sidebar-navigation"
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                <Captions className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold tracking-wide uppercase font-display">Titan POS</h2>
                <p className="text-[10px] text-slate-400">Integrated Group Management</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SBU Branch Indicators */}
          <div className="hidden px-6 py-4 border-b border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Business Units</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="p-2 rounded-lg bg-orange-950/40 border border-orange-900/40 text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Gas Plant
              </div>
              <div className="p-2 rounded-lg bg-green-950/40 border border-green-900/40 text-green-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-green-500" /> Car Wash
              </div>
            </div>
          </div>

          {/* Tab Navigation links */}
          <nav className="p-4 space-y-1.5 flex-1" id="sidebar-nav-list">

            {/* Tab 1: Combined Master Dashboard (Admin/Cashier only) */}
            {isAccessible('dashboard') && (
              <button
                onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
              >
                <TrendingUp className="w-4 h-4" /> Performance Analytics
              </button>
            )}

            {/* Tab 2: Cooking Gas Refill POS Desk */}
            {isAccessible('gas') && (
              <button
                onClick={() => { setActiveTab('gas'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'gas'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-855'
                  }`}
              >
                <Flame className="w-4 h-4" /> Cooking Gas Plant
              </button>
            )}

            {/* Tab 3: Car Wash Intake POS Desk */}
            {isAccessible('carwash') && (
              <button
                onClick={() => { setActiveTab('carwash'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'carwash'
                  ? 'bg-green-650 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-860'
                  }`}
              >
                <Droplet className="w-4 h-4" /> Car Wash Center
              </button>
            )}

            {/* Tab 3.1: General Retail POS Desk */}
            {isAccessible('retail_pos') && (
              <button
                onClick={() => { setActiveTab('retail_pos'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'retail_pos'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
              >
                <ShoppingCart className="w-4 h-4" /> Provision Retail
              </button>
            )}

            {/* Tab 3.2: General Retail Inventory Desk */}
            {isAccessible('inventory') && (
              <button
                onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'inventory'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
              >
                <Boxes className="w-4 h-4" /> Stores Inventory Admin
              </button>
            )}

            {/* Tab 4: Financial Reports Mapped Periodics */}
            {isAccessible('reports') && (
              <button
                onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
              >
                <FileText className="w-4 h-4" /> Financial Audits
              </button>
            )}

            {/* Tab 5: Excel IO advanced integration tab (Admin/Cashier only) */}
            {isAccessible('excel') && (
              <button
                onClick={() => { setActiveTab('excel'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'excel'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel Integration
              </button>
            )}

            {/* Tab 6: Active Users profilesSwitcher (Admin only to manage) */}
            <button
              onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold font-display transition ${activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
            >
              <Users className="w-4 h-4" /> Accounts & Logins
            </button>
          </nav>

        </div>

        {/* User profile footer section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px]" id="sidebar-footer-profile">
          <div className="flex items-center gap-3 p-2 bg-slate-850/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-indigo-600/80 font-bold flex items-center justify-center text-xs border border-indigo-400 shrink-0 select-none">
              {currentName.substring(0, 2).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <span className="font-bold text-white block leading-tight truncate">{currentName}</span>
              <span className="text-[9px] uppercase font-mono text-emerald-400 font-semibold block mt-0.5">{currentRole}</span>
            </div>
          </div>
          <p className="hidden text-center text-[9px] text-slate-500 mt-3 font-mono">Lagos, NG • Jun 21, 2026</p>
        </div>
      </aside>

      {/* Background shadow overlay for responsive mobile slideout drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>
      )}

      {/* 2. MAIN CORE LAYOUT FRAME */}
      <main className="flex-1 flex flex-col min-w-0" id="main-content-scroller">

        {/* GLOBAL HEADER BAR */}
        <header
          id="header-global"
          className="h-16 px-6 bg-white dark:bg-gray-800 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center shrink-0 shadow-xs"
        >
          {/* Left panel */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="invisible items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Headquarters branch Lekki</span>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex items-center gap-4">

            {/* Quick credentials switcher indicator pill in header */}
            <div
              onClick={() => setActiveTab('users')}
              className="invisible px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 cursor-pointer text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-2 border border-indigo-100 dark:border-indigo-900/50 hover:scale-[1.01] transition select-none"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-mono">@{currentUsername}</span>
            </div>

            {/* Dark mode switch button */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Sunset Night Theme'}
              className="p-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>
        </header>

        {/* ACTIVE TAB MAIN ENGINE VIEWPORT */}
        <section className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              currentRole={currentRole}
              currentUser={currentName}
            />
          )}

          {activeTab === 'gas' && (
            <GasPOS />
          )}

          {activeTab === 'carwash' && (
            <CarWashPOS
              sales={carWashSales}
              onAddSale={handleAddCWSale}
              onDeleteSale={handleDeleteCWSale}
              currentRole={currentRole}
              currentUser={currentName}
              showToast={showToastMsg}
            />
          )}

          {activeTab === 'retail_pos' && (
            <GeneralPOS
              products={products}
              sales={generalSales}
              onAddSale={handleAddGeneralSale}
              onUpdateProduct={handleUpdateProduct}
              currentRole={currentRole}
              currentUserName={currentName}
              showToast={showToastMsg}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              products={products}
              stockLogs={stockLogs}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddStockLog={handleAddStockLog}
              currentRole={currentRole}
              currentUserName={currentName}
            />
          )}

          {activeTab === 'reports' && (
            <Reporting
              gasSales={gasSales}
              carWashSales={carWashSales}
            />
          )}

          {activeTab === 'excel' && (
            <ExcelIO
              gasSales={gasSales}
              carWashSales={carWashSales}
              onImportGasSales={handleImportGasSales}
              onImportCarWashSales={handleImportCarWashSales}
              showToast={showToastMsg}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={posUsers}
              currentRole={currentRole}
              currentUser={currentUsername}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onSwitchUser={handleSwitchUser}
              showToast={showToastMsg}
            />
          )}
        </section>

      </main>

      {/* 3. FLOAT FLOATING TOAST CONTAINER PORTAL */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border animate-none transition-all duration-350 bg-slate-900 border-slate-800 text-white max-w-sm"
          id="toast-notification-popup"
        >
          <div className="shrink-0">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <BellRing className="w-5 h-5 text-sky-400 animate-bounce" />}
          </div>
          <div className="text-xs font-semibold leading-relaxed flex-1">
            {toast.message}
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  )
}

