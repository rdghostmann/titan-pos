// components/Dashboard.tsx
"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Droplet,
  Flame,
  CreditCard,
  Users,
  Sparkles,
  ShoppingBag,
  Zap,
  Clock
} from 'lucide-react';
import { formatNaira } from '@/mockData';

interface DashboardProps {
  currentRole?: string;
  currentUser?: string;
}

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#ca8a04', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6'];

export default function Dashboard({ currentRole = 'Administrator', currentUser = 'System' }: DashboardProps) {
  const todayStr = '2026-06-21';
  const currentUserLabel = currentUser || 'System';

  const kpis = {
    totalTodayRevenue: 1250000,
    todayGasRevenue: 620000,
    todayGasKg: 870,
    todayGasTx: 41,
    todayCWRevenue: 245000,
    todayCWCars: 32,
    todayRetailRevenue: 385000,
    todayRetailTx: 48,
    todayRetailItemsCount: 191,
    totalTodayTx: 121,
    activeStaffCount: 8,
    totalCustomersCount: 96,
    lowStockCount: 5,
    totalStoreValue: 4800000,
  };

  const masterChartsData = {
    dailyRevCombined: [
      { key: '2026-06-07', date: 'Jun 7', Gas: 510000, CarWash: 175000, Retail: 145000, Total: 830000 },
      { key: '2026-06-08', date: 'Jun 8', Gas: 480000, CarWash: 182000, Retail: 152000, Total: 814000 },
      { key: '2026-06-09', date: 'Jun 9', Gas: 525000, CarWash: 188000, Retail: 160000, Total: 873000 },
      { key: '2026-06-10', date: 'Jun 10', Gas: 540000, CarWash: 195000, Retail: 168000, Total: 903000 },
      { key: '2026-06-11', date: 'Jun 11', Gas: 565000, CarWash: 205000, Retail: 172000, Total: 942000 },
      { key: '2026-06-12', date: 'Jun 12', Gas: 590000, CarWash: 210000, Retail: 180000, Total: 980000 },
      { key: '2026-06-13', date: 'Jun 13', Gas: 610000, CarWash: 220000, Retail: 185000, Total: 1015000 },
      { key: '2026-06-14', date: 'Jun 14', Gas: 620000, CarWash: 228000, Retail: 188000, Total: 1036000 },
      { key: '2026-06-15', date: 'Jun 15', Gas: 635000, CarWash: 232000, Retail: 192000, Total: 1059000 },
      { key: '2026-06-16', date: 'Jun 16', Gas: 648000, CarWash: 240000, Retail: 200000, Total: 1088000 },
      { key: '2026-06-17', date: 'Jun 17', Gas: 660000, CarWash: 242000, Retail: 205000, Total: 1107000 },
      { key: '2026-06-18', date: 'Jun 18', Gas: 675000, CarWash: 248000, Retail: 210000, Total: 1133000 },
      { key: '2026-06-19', date: 'Jun 19', Gas: 690000, CarWash: 252000, Retail: 216000, Total: 1158000 },
      { key: '2026-06-20', date: 'Jun 20', Gas: 705000, CarWash: 258000, Retail: 220000, Total: 1183000 },
      { key: '2026-06-21', date: 'Jun 21', Gas: 720000, CarWash: 265000, Retail: 228000, Total: 1213000 },
    ],
    weeklyData: [
      { name: 'Week 1 (May 24-30)', Gas: 620000, CarWash: 190000, Retail: 155000, Total: 965000 },
      { name: 'Week 2 (May 31-Jun 6)', Gas: 780000, CarWash: 215000, Retail: 172000, Total: 1167000 },
      { name: 'Week 3 (Jun 7-13)', Gas: 840000, CarWash: 240000, Retail: 182000, Total: 1262000 },
      { name: 'Week 4 (Jun 14-21)', Gas: 920000, CarWash: 265000, Retail: 228000, Total: 1413000 },
    ],
    monthlyData: [
      { name: 'May 2026', Gas: 2400000, CarWash: 760000, Retail: 620000, Total: 3780000 },
      { name: 'June 2026', Gas: 3100000, CarWash: 920000, Retail: 780000, Total: 4800000 },
    ],
    topServices: [
      { name: 'Full Detailing', value: 420000 },
      { name: 'Express Wash', value: 310000 },
      { name: 'Interior Cleaning', value: 240000 },
      { name: 'Wax & Polish', value: 180000 },
    ],
    bestSellingProducts: [
      { name: 'Cooking Gas 3kg', quantity: 48, revenue: 324000 },
      { name: 'Water 25L', quantity: 36, revenue: 216000 },
      { name: 'Detergent Pack', quantity: 31, revenue: 93000 },
      { name: 'Bread Loaf', quantity: 27, revenue: 54000 },
      { name: 'Soft Drinks', quantity: 24, revenue: 72000 },
    ],
    categoryPerformance: [
      { name: 'Groceries', value: 295000 },
      { name: 'Household', value: 185000 },
      { name: 'Beverages', value: 125000 },
      { name: 'Personal Care', value: 98000 },
    ],
    staffRank: [
      { name: 'Amina', Revenue: 760000, Transactions: 29 },
      { name: 'Tunde', Revenue: 610000, Transactions: 24 },
      { name: 'Bola', Revenue: 540000, Transactions: 21 },
      { name: 'Kemi', Revenue: 470000, Transactions: 18 },
    ],
  };

  const gasChartsData = {
    todayPayments: { cash: 620000, transfer: 240000, pos: 180000 },
    topGasAttendant: 'Amina',
    paymentPie: [
      { name: 'Cash', value: 620000 },
      { name: 'Bank Transfer', value: 240000 },
      { name: 'POS', value: 180000 },
    ],
    attRank: [
      { name: 'Amina', Revenue: 860000 },
      { name: 'Tunde', Revenue: 705000 },
      { name: 'Bola', Revenue: 610000 },
      { name: 'Kemi', Revenue: 495000 },
    ],
  };

  const carWashChartsData = {
    serviceBreakdownToday: {
      'Express Wash': 16,
      'Full Detailing': 8,
      'Interior Cleaning': 5,
      'Wax & Polish': 3,
    },
    staffCWRank: [
      { name: 'Tunde', Revenue: 410000, Vehicles: 18 },
      { name: 'Bola', Revenue: 320000, Vehicles: 14 },
      { name: 'Kemi', Revenue: 280000, Vehicles: 12 },
      { name: 'Amina', Revenue: 240000, Vehicles: 10 },
    ],
    paymentCWPie: [
      { name: 'Cash', value: 310000 },
      { name: 'Bank Transfer', value: 180000 },
      { name: 'POS', value: 140000 },
    ],
  };

  const lowStockAlerts = [
    { id: 'p1', name: 'Rice 5kg', quantity: 6 },
    { id: 'p2', name: 'Cooking Oil 5L', quantity: 4 },
    { id: 'p3', name: 'Detergent Pack', quantity: 8 },
  ];

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800" id="dash-header">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance & Analytics Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Real-time commercial index for Cooking Gas & Car Wash Center <br /> <br /> • Today: <span className="font-semibold text-blue-600 dark:text-blue-400">{todayStr}</span>
            <span className="sr-only"> • Active user: {currentUserLabel}</span>
          </p>
        </div>
        <div className="hidden mt-4 md:mt-0 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          SYSTEM PRIVILEGE: <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{currentRole}</span>
        </div>
      </header>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4" id="kpi-cards-grid">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-today-revenue">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Today Revenue</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{formatNaira(kpis.totalTodayRevenue)}</p>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center mt-1">
              Active Performance +12%
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-gas-revenue">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Gas Revenue (Today)</span>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{formatNaira(kpis.todayGasRevenue)}</p>
            <p className="text-[10px] text-orange-500 font-medium mt-1">
              {kpis.todayGasKg} kg gas refilled
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-carwash-revenue">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Car Wash (Today)</span>
            <Droplet className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{formatNaira(kpis.todayCWRevenue)}</p>
            <p className="text-[10px] text-green-600 font-medium mt-1">
              {kpis.todayCWCars} vehicles serviced
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-transactions">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Tickets</span>
            <CreditCard className="w-5 h-5 text-purple-500" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{kpis.totalTodayTx}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              {kpis.todayGasTx} Gas • {kpis.todayCWCars} Clean
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-active-staff">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Active Staff Today</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{kpis.activeStaffCount}</p>
            <p className="text-[10px] text-slate-400 mt-1">Attendants & Cashiers</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-customers">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Base Customers</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{kpis.totalCustomersCount}</p>
            <p className="text-[10px] text-slate-400 mt-1">Loyalty distribution</p>
          </div>
        </div>
      </div>

      {/* Main Combined Sections for Administrator & Cashier, with customized access rules */}
      <div className="space-y-6" id="dashboard-sections-combined">
        {/* SECTION 1: Master Corporate Dashboard (Only viewable by Admin & Cashier) */}
        {(currentRole === 'Administrator' || currentRole === 'Cashier') && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6" id="master-executive-analytics">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Corporate Enterprise Overview (Gas + Wash)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">High-level financial aggregate reporting</p>
              </div>
            </div>

            {/* Daily trend and summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="master-charts-block-1">
              <div className="lg:col-span-2 space-y-3" id="daily-revenue-combined-card">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Multi-SBU Revenue Trend (Last 15 Days)</span>
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded">Daily Split</span>
                </div>
                <div className="h-80 w-full" id="daily-revenue-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masterChartsData.dailyRevCombined}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <YAxis tickFormatter={(val) => `₦${val / 1000}k`} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <Tooltip 
                        formatter={(value) => [formatNaira(Number(value)), '']}
                        contentStyle={{ borderRadius: 8, fontSize: 12 }} 
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Gas" stackId="a" fill="#ea580c" name="Cooking Gas Plant" />
                      <Bar dataKey="CarWash" stackId="a" fill="#16a34a" name="Car Wash Center" />
                      <Bar dataKey="Retail" stackId="a" fill="#6366f1" name="Provision Retail Store" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3" id="service-split-card">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Car Wash Services Premium Dist.</span>
                  <span className="text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded">By Revenue</span>
                </div>
                <div className="h-64 flex items-center justify-center relative" id="service-split-pie-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={masterChartsData.topServices}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {masterChartsData.topServices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatNaira(Number(v))} contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] " id="pie-legend">
                  {masterChartsData.topServices.slice(0, 4).map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-slate-600 dark:text-slate-400 truncate">{entry.name} ({formatNaira(entry.value)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Aggregated Periodical Chart Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700/50" id="master-charts-block-2">
              <div className="space-y-3" id="weekly-aggregate-card">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekly Commercial Revenue</span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masterChartsData.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <YAxis tickFormatter={(val) => `₦${val / 1000}k`} stroke="#94a3b8" />
                      <Tooltip formatter={(val) => formatNaira(Number(val))} />
                      <Legend />
                      <Bar dataKey="Gas" fill="#f97316" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="CarWash" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Retail" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3" id="monthly-aggregate-card">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly SBU Revenue Trend</span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masterChartsData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(val) => `₦${val / 1000}k`} />
                      <Tooltip formatter={(val) => formatNaira(Number(val))} />
                      <Legend />
                      <Bar dataKey="Gas" fill="#ea580c" />
                      <Bar dataKey="CarWash" fill="#16a34a" />
                      <Bar dataKey="Retail" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Cooking Gas SBU Dashboard (Viewable by Administrator, Cashier & Pump Attendant) */}
        {(currentRole === 'Administrator' || currentRole === 'Cashier' || currentRole === 'Pump Attendant') && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6" id="cooking-gas-sbu-dashboard">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/40 rounded-lg text-orange-600 dark:text-orange-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Gas Plant operations Dashboard</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sales breakdown, payment options & weights filled</p>
                </div>
              </div>
              <span className="text-xs font-mono text-orange-600 dark:text-orange-400 font-bold bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded">SBU GAS</span>
            </div>

            {/* Quick mini-KPIs specific to Cooking Gas SBU */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="gas-sub-kpis">
              <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl" id="gas-cash-pm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gas Cash Counter Today</span>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-400 mt-1">{formatNaira(gasChartsData.todayPayments.cash)}</p>
              </div>
              <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl" id="gas-transfer-pm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gas Bank Transfer Today</span>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-400 mt-1">{formatNaira(gasChartsData.todayPayments.transfer)}</p>
              </div>
              <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl" id="gas-pos-pm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gas POS Terminals Today</span>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-400 mt-1">{formatNaira(gasChartsData.todayPayments.pos)}</p>
              </div>
            </div>

            {/* Gas sales performance charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="gas-charts-block">
              {/* Payment Method Distribution */}
              <div className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-xl space-y-4" id="gas-payment-dist-chart">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gas SBU Volume Distribution (Payment method)</span>
                <div className="h-60 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gasChartsData.paymentPie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                      >
                        {gasChartsData.paymentPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatNaira(Number(val))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs font-mono">
                  {gasChartsData.paymentPie.map((item, id) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[(id + 1) % COLORS.length] }}></span>
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pump Attendant Overall Ranking */}
              <div className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-xl space-y-4" id="gas-attendants-rating">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pump Attendant Revenue Ranking</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-1 rounded font-bold">TOP: {gasChartsData.topGasAttendant}</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gasChartsData.attRank}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tickFormatter={(val) => `₦${val / 1000}k`} />
                      <Tooltip formatter={(v) => formatNaira(Number(v))} />
                      <Bar dataKey="Revenue" fill="#ea580c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Car Wash Center Dashboard (Viewable by Administrator, Cashier & Car Wash Attendant) */}
        {(currentRole === 'Administrator' || currentRole === 'Cashier' || currentRole === 'Car Wash Attendant') && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6" id="car-wash-sbu-dashboard">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 dark:bg-green-900/40 rounded-lg text-green-600 dark:text-green-400">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Car Wash Center Operations</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Services, productivity metrics & vehicle stats</p>
                </div>
              </div>
              <span className="text-xs font-mono text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded">SBU WASH</span>
            </div>

            {/* Car wash specific calculations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="wash-charts-block">
              {/* Productive Car Wash Staff */}
              <div className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-xl space-y-4" id="wash-staff-production">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Staff Productivity (Clean Revenue vs Vehicles serviced)</span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carWashChartsData.staffCWRank}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#16a34a" tickFormatter={(v) => `₦${v / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#2563eb" />
                      <Tooltip formatter={(value, name) => [name === 'Revenue' ? formatNaira(Number(value)) : `${value} Cars`, name]} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar yAxisId="left" dataKey="Revenue" fill="#16a34a" name="Revenue Generated" />
                      <Bar yAxisId="right" dataKey="Vehicles" fill="#2563eb" name="Cars Cleaned" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Method Distribution */}
              <div className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-xl space-y-4" id="wash-pay-method">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Car Wash Payment Category</span>
                <div className="h-60 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={carWashChartsData.paymentCWPie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                      >
                        {carWashChartsData.paymentCWPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatNaira(Number(val))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs font-mono">
                  {carWashChartsData.paymentCWPie.map((item, id) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[(id + 2) % COLORS.length] }}></span>
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: General Retail SBU Dashboard (Viewable by Administrator & Cashier) */}
        {(currentRole === 'Administrator' || currentRole === 'Cashier') && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6" id="general-retail-sbu-dashboard">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Provision Store operations Dashboard</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Category performance, top selling items & inventory evaluation</p>
                </div>
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded">SBU RETAIL</span>
            </div>

            {/* Sub KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="retail-sub-kpi-grid">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/20 rounded-xl border border-slate-100 dark:border-slate-700/30">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Todays Sales Revenue</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{formatNaira(kpis.todayRetailRevenue)}</p>
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold">{kpis.todayRetailTx} checkouts today</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/20 rounded-xl border border-slate-100 dark:border-slate-700/30">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Quantity Sold</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{kpis.todayRetailItemsCount} units</p>
                <span className="text-[10px] text-slate-400">Item units dispensed</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/20 rounded-xl border border-slate-100 dark:border-slate-700/30">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Inventory Asset Value</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{formatNaira(kpis.totalStoreValue)}</p>
                <span className="text-[10px] text-emerald-500 font-semibold">Total Stock Valuation</span>
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <span className="text-xs text-rose-500 dark:text-rose-400 font-medium block">Low Stock Alarm items</span>
                <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">{kpis.lowStockCount} Products</p>
                <span className="text-[10px] text-rose-500 font-semibold">Quantity below reorder limit</span>
              </div>
            </div>

            {/* Low stock alerts panel inside dashboard for immediate visibility */}
            {kpis.lowStockCount > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-red-500" /> Critical Inventory Alert Level (&lt; 10 units on hand)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {lowStockAlerts.map(p => (
                    <div key={p.id} className="p-2 border border-red-100 dark:border-red-900/25 bg-white dark:bg-gray-800 rounded-lg text-xs flex justify-between items-center shadow-2xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate mr-2">{p.name}</span>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                        {p.quantity} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts sub-block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="retail-charts-block">
              {/* Best Selling Products */}
              <div className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-xl space-y-4" id="retail-staff-production">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Top 5 Best Selling Products (By Units Sold)</span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masterChartsData.bestSellingProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={100} stroke="#94a3b8" />
                      <Tooltip formatter={(value) => [`${value} Units`, 'Quantity Sold']} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="quantity" fill="#6366f1" name="Quantity Sold" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Revenues */}
              <div className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-xl space-y-4" id="retail-category-revenue">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Retail Revenue by Category</span>
                <div className="h-60 flex items-center justify-center relative">
                  {masterChartsData.categoryPerformance.length === 0 ? (
                    <span className="text-xs text-slate-400">No category sales recorded yet</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={masterChartsData.categoryPerformance}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                        >
                          {masterChartsData.categoryPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => formatNaira(Number(val))} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400">
                  {masterChartsData.categoryPerformance.map((item, id) => (
                    <div key={item.name} className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded shrink-0" style={{ backgroundColor: COLORS[(id + 3) % COLORS.length] }}></span>
                      <span className="truncate">{item.name}: {formatNaira(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
