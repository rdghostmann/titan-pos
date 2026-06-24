"use client";
import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
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
  Calendar, 
  TrendingDown, 
  ShoppingBag,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import { GasSale, CarWashSale, User, UserRole, Product, GeneralSale } from '@/types';
import { formatNaira } from '@/mockData';

interface DashboardProps {
  gasSales: GasSale[];
  carWashSales: CarWashSale[];
  users: User[];
  currentRole: UserRole;
  currentUser: string;
  products?: Product[];
  generalSales?: GeneralSale[];
}

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#ca8a04', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6'];

export default function Dashboard({ 
  gasSales, 
  carWashSales, 
  users, 
  currentRole, 
  currentUser,
  products = [],
  generalSales = []
}: DashboardProps) {
  // Let's filter records strictly down to "today" if we want, or just look at all historical records for charts
  const todayStr = '2026-06-21'; // Set base date according to ADDITIONAL_METADATA

  // --- KPI computations (Today Specific) ---
  const kpis = useMemo(() => {
    // Current Gas Sales (Today)
    const todayGas = gasSales.filter(g => g.date.startsWith(todayStr));
    const todayGasRevenue = todayGas.reduce((sum, g) => sum + g.amount, 0);
    const todayGasKg = todayGas.reduce((sum, g) => sum + g.quantity, 0);
    const todayGasTx = todayGas.length;

    // Current Car Wash Sales (Today)
    const todayCW = carWashSales.filter(c => c.date.startsWith(todayStr));
    const todayCWRevenue = todayCW.reduce((sum, c) => sum + c.amount, 0);
    const todayCWCars = todayCW.length;

    // Retail POS sales (Today)
    const todayRetail = generalSales.filter(s => s.date === todayStr);
    const todayRetailRevenue = todayRetail.reduce((sum, s) => sum + s.grandTotal, 0);
    const todayRetailTx = todayRetail.length;
    const todayRetailItemsCount = todayRetail.reduce((sum, s) => sum + s.totalQuantity, 0);

    // Combined Today
    const totalTodayRevenue = todayGasRevenue + todayCWRevenue + todayRetailRevenue;
    const totalTodayTx = todayGasTx + todayCWCars + todayRetailTx;

    // Total counts (overall)
    const uniqueCustomers = new Set([
      ...gasSales.map(g => g.customerName.toLowerCase()),
      ...carWashSales.map(c => c.customerName.toLowerCase())
    ]);

    // Active Staff (Staff who did anything today or are on system)
    const activeStaff = new Set([
      ...todayGas.map(g => g.attendant),
      ...todayGas.map(g => g.cashier),
      ...todayCW.map(c => c.attendant),
      ...todayCW.map(c => c.cashier),
      ...todayRetail.map(s => s.cashierName)
    ]);
    if (activeStaff.size === 0) {
      activeStaff.add(currentUser);
    }

    // Low stock and store valuation
    const lowStockCount = products.filter(p => p.status === 'Active' && p.quantity < p.reorderLevel).length;
    const totalStoreValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);

    return {
      totalTodayRevenue,
      todayGasRevenue,
      todayGasKg,
      todayGasTx,
      todayCWRevenue,
      todayCWCars,
      todayRetailRevenue,
      todayRetailTx,
      todayRetailItemsCount,
      totalTodayTx,
      activeStaffCount: activeStaff.size,
      totalCustomersCount: uniqueCustomers.size,
      lowStockCount,
      totalStoreValue
    };
  }, [gasSales, carWashSales, generalSales, products, currentUser]);

  // --- Dynamic Chart Calculations (Combined Master Charts) ---
  const masterChartsData = useMemo(() => {
    // Daily revenue analysis for the last 15 days ending at 2026-06-21
    const revenueByDay: Record<string, { gas: number; carwash: number; retail: number; date: string }> = {};

    for (let i = 14; i >= 0; i--) {
      const d = new Date('2026-06-21T14:45:00');
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const formattedDate = d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
      revenueByDay[key] = { gas: 0, carwash: 0, retail: 0, date: formattedDate };
    }

    gasSales.forEach(g => {
      const key = g.date.split('T')[0];
      if (revenueByDay[key]) {
        revenueByDay[key].gas += g.amount;
      }
    });

    carWashSales.forEach(c => {
      const key = c.date.split('T')[0];
      if (revenueByDay[key]) {
        revenueByDay[key].carwash += c.amount;
      }
    });

    generalSales.forEach(s => {
      const key = s.date;
      if (revenueByDay[key]) {
        revenueByDay[key].retail += s.grandTotal;
      }
    });

    const dailyRevCombined = Object.keys(revenueByDay).map(k => ({
      key: k,
      date: revenueByDay[k].date,
      Gas: revenueByDay[k].gas,
      CarWash: revenueByDay[k].carwash,
      Retail: revenueByDay[k].retail,
      Total: revenueByDay[k].gas + revenueByDay[k].carwash + revenueByDay[k].retail,
    }));

    // Weekly Revenue Analysis (Last 4 weeks)
    const weeklyData = [
      { name: 'Week 1 (May 24-30)', Gas: 0, CarWash: 0, Retail: 0, Total: 0 },
      { name: 'Week 2 (May 31-Jun 6)', Gas: 0, CarWash: 0, Retail: 0, Total: 0 },
      { name: 'Week 3 (Jun 7-13)', Gas: 0, CarWash: 0, Retail: 0, Total: 0 },
      { name: 'Week 4 (Jun 14-21)', Gas: 0, CarWash: 0, Retail: 0, Total: 0 },
    ];

    gasSales.forEach(g => {
      const pDate = new Date(g.date);
      if (pDate >= new Date('2026-05-24') && pDate <= new Date('2026-05-30T23:59:59')) {
        weeklyData[0].Gas += g.amount;
      } else if (pDate >= new Date('2026-05-31') && pDate <= new Date('2026-06-06T23:59:59')) {
        weeklyData[1].Gas += g.amount;
      } else if (pDate >= new Date('2026-06-07') && pDate <= new Date('2026-06-13T23:59:59')) {
        weeklyData[2].Gas += g.amount;
      } else if (pDate >= new Date('2026-06-14') && pDate <= new Date('2026-06-25T23:59:59')) {
        weeklyData[3].Gas += g.amount;
      }
    });

    carWashSales.forEach(c => {
      const pDate = new Date(c.date);
      if (pDate >= new Date('2026-05-24') && pDate <= new Date('2026-05-30T23:59:59')) {
        weeklyData[0].CarWash += c.amount;
      } else if (pDate >= new Date('2026-05-31') && pDate <= new Date('2026-06-06T23:59:59')) {
        weeklyData[1].CarWash += c.amount;
      } else if (pDate >= new Date('2026-06-07') && pDate <= new Date('2026-06-13T23:59:59')) {
        weeklyData[2].CarWash += c.amount;
      } else if (pDate >= new Date('2026-06-14') && pDate <= new Date('2026-06-25T23:59:59')) {
        weeklyData[3].CarWash += c.amount;
      }
    });

    generalSales.forEach(s => {
      const pDate = new Date(s.date);
      if (pDate >= new Date('2026-05-24') && pDate <= new Date('2026-05-30T23:59:59')) {
        weeklyData[0].Retail += s.grandTotal;
      } else if (pDate >= new Date('2026-05-31') && pDate <= new Date('2026-06-06T23:59:59')) {
        weeklyData[1].Retail += s.grandTotal;
      } else if (pDate >= new Date('2026-06-07') && pDate <= new Date('2026-06-13T23:59:59')) {
        weeklyData[2].Retail += s.grandTotal;
      } else if (pDate >= new Date('2014-06-14') || (pDate >= new Date('2026-06-14') && pDate <= new Date('2026-06-25T23:59:59'))) {
        weeklyData[3].Retail += s.grandTotal;
      }
    });

    weeklyData.forEach(w => w.Total = w.Gas + w.CarWash + w.Retail);

    // Monthly Revenue (May vs June)
    const monthlyData = [
      { name: 'May 2026', Gas: 0, CarWash: 0, Retail: 0, Total: 0 },
      { name: 'June 2026', Gas: 0, CarWash: 0, Retail: 0, Total: 0 }
    ];
    gasSales.forEach(g => {
      if (g.date.startsWith('2026-05')) {
        monthlyData[0].Gas += g.amount;
      } else if (g.date.startsWith('2026-06')) {
        monthlyData[1].Gas += g.amount;
      }
    });
    carWashSales.forEach(c => {
      if (c.date.startsWith('2026-05')) {
        monthlyData[0].CarWash += c.amount;
      } else if (c.date.startsWith('2026-06')) {
        monthlyData[1].CarWash += c.amount;
      }
    });
    generalSales.forEach(s => {
      if (s.date.startsWith('2026-05')) {
        monthlyData[0].Retail += s.grandTotal;
      } else if (s.date.startsWith('2026-06')) {
        monthlyData[1].Retail += s.grandTotal;
      }
    });
    monthlyData.forEach(m => m.Total = m.Gas + m.CarWash + m.Retail);

    // Top Services in Car Wash
    const serviceDistribution: Record<string, number> = {};
    carWashSales.forEach(c => {
      serviceDistribution[c.serviceType] = (serviceDistribution[c.serviceType] || 0) + c.amount;
    });
    const topServices = Object.keys(serviceDistribution).map(k => ({
      name: k,
      value: serviceDistribution[k]
    })).sort((a,b) => b.value - a.value);

    // Best Selling Products (Retail items rank by quantity sold)
    const productSalesCount: Record<string, { name: string; quantity: number; revenue: number }> = {};
    generalSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSalesCount[item.productId]) {
          productSalesCount[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        productSalesCount[item.productId].quantity += item.quantity;
        productSalesCount[item.productId].revenue += item.total;
      });
    });
    const bestSellingProducts = Object.values(productSalesCount)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Product Category Performance (by revenue)
    const categoryRevenueMap: Record<string, number> = {};
    products.forEach(p => { categoryRevenueMap[p.category] = 0; });
    generalSales.forEach(sale => {
      sale.items.forEach(item => {
        const prodObj = products.find(p => p.id === item.productId);
        const cat = prodObj ? prodObj.category : 'Groceries';
        categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + item.total;
      });
    });
    const categoryPerformance = Object.keys(categoryRevenueMap).map(k => ({
      name: k,
      value: categoryRevenueMap[k]
    })).filter(item => item.value > 0);

    // Top Performing Staff (Attendants overall)
    const staffPerformance: Record<string, { revenue: number; tx: number }> = {};
    gasSales.forEach(g => {
      if (!staffPerformance[g.attendant]) staffPerformance[g.attendant] = { revenue: 0, tx: 0 };
      staffPerformance[g.attendant].revenue += g.amount;
      staffPerformance[g.attendant].tx += 1;
    });
    carWashSales.forEach(c => {
      if (!staffPerformance[c.attendant]) staffPerformance[c.attendant] = { revenue: 0, tx: 0 };
      staffPerformance[c.attendant].revenue += c.amount;
      staffPerformance[c.attendant].tx += 1;
    });
    const staffRank = Object.keys(staffPerformance).map(name => ({
      name,
      Revenue: staffPerformance[name].revenue,
      Transactions: staffPerformance[name].tx
    })).sort((a,b) => b.Revenue - a.Revenue);

    return {
      dailyRevCombined,
      weeklyData,
      monthlyData,
      topServices,
      bestSellingProducts,
      categoryPerformance,
      staffRank
    };
  }, [gasSales, carWashSales, generalSales, products]);

  // --- Gas Sales Specific calculations (Gas Dashboard) ---
  const gasChartsData = useMemo(() => {
    // Cumulative calculations
    const todayGas = gasSales.filter(g => g.date.startsWith(todayStr));
    const cash = todayGas.filter(g => g.paymentMethod === 'Cash').reduce((sum, g) => sum + g.amount, 0);
    const transfer = todayGas.filter(g => g.paymentMethod === 'Bank Transfer').reduce((sum, g) => sum + g.amount, 0);
    const pos = todayGas.filter(g => g.paymentMethod === 'POS').reduce((sum, g) => sum + g.amount, 0);

    // Top Attendant for cooking gas
    const gasAttendants: Record<string, number> = {};
    gasSales.forEach(g => {
      gasAttendants[g.attendant] = (gasAttendants[g.attendant] || 0) + g.amount;
    });
    let topGasAttendant = 'None';
    let maxGasRevenue = 0;
    Object.keys(gasAttendants).forEach(name => {
      if (gasAttendants[name] > maxGasRevenue) {
        maxGasRevenue = gasAttendants[name];
        topGasAttendant = name;
      }
    });

    // Payment distribution (overall)
    const payDist: Record<string, number> = { Cash: 0, 'Bank Transfer': 0, POS: 0 };
    gasSales.forEach(g => {
      payDist[g.paymentMethod] = (payDist[g.paymentMethod] || 0) + g.amount;
    });
    const paymentPie = Object.keys(payDist).map(k => ({ name: k, value: payDist[k] }));

    // Attendant performance overall (bar ranking)
    const attRank = Object.keys(gasAttendants).map(k => ({ name: k, Revenue: gasAttendants[k] })).sort((a,b) => b.Revenue - a.Revenue);

    return {
      todayPayments: { cash, transfer, pos },
      topGasAttendant,
      paymentPie,
      attRank
    };
  }, [gasSales]);

  // --- Car Wash Specific calculations (Car Wash Dashboard) ---
  const carWashChartsData = useMemo(() => {
    const todayCW = carWashSales.filter(c => c.date.startsWith(todayStr));
    
    // Service breakdown
    const serviceCount: Record<string, number> = {};
    todayCW.forEach(c => {
      serviceCount[c.serviceType] = (serviceCount[c.serviceType] || 0) + 1;
    });

    const staffCWPerf: Record<string, { revenue: number; count: number }> = {};
    carWashSales.forEach(c => {
      if (!staffCWPerf[c.attendant]) staffCWPerf[c.attendant] = { revenue: 0, count: 0 };
      staffCWPerf[c.attendant].revenue += c.amount;
      staffCWPerf[c.attendant].count += 1;
    });

    const staffCWRank = Object.keys(staffCWPerf).map(k => ({
      name: k,
      Revenue: staffCWPerf[k].revenue,
      Vehicles: staffCWPerf[k].count
    })).sort((a,b) => b.Revenue - a.Revenue);

    const payCWDist: Record<string, number> = { Cash: 0, 'Bank Transfer': 0, POS: 0 };
    carWashSales.forEach(c => {
      payCWDist[c.paymentMethod] = (payCWDist[c.paymentMethod] || 0) + c.amount;
    });
    const paymentCWPie = Object.keys(payCWDist).map(k => ({ name: k, value: payCWDist[k] }));

    return {
      serviceBreakdownToday: serviceCount,
      staffCWRank,
      paymentCWPie
    };
  }, [carWashSales]);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50" id="dash-header">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance & Analytics Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Real-time commercial index for Cooking Gas & Car Wash Center • Today: <span className="font-semibold text-blue-600 dark:text-blue-400">{todayStr}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          SYSTEM PRIVILEGE: <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{currentRole}</span>
        </div>
      </header>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4" id="kpi-cards-grid">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between" id="kpi-today-revenue">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Today's Revenue</span>
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
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Today's Sales Revenue</span>
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
                  {products
                    .filter(p => p.status === 'Active' && p.quantity < p.reorderLevel)
                    .map(p => (
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
