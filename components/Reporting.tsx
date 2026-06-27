"use client";
import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  ArrowUpDown, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard 
} from 'lucide-react';
import { formatNaira } from '@/mockData';

const STATIC_REPORT_ROWS = [
  {
    id: 'r-1',
    date: '2026-06-21T09:30:00.000Z',
    source: 'Gas Plant',
    receiptNumber: 'GAS-1001',
    customerName: 'Amina Yusuf',
    customerPhone: '08031234567',
    displayType: 'LPG 12.5kg',
    displayDetails: '12.5 kg @ ₦1200/kg',
    paymentMethod: 'Cash',
    attendant: 'Mariam Bello',
    cashier: 'Binta Musa',
    amount: 15000
  },
  {
    id: 'r-2',
    date: '2026-06-21T10:00:00.000Z',
    source: 'Car Wash',
    receiptNumber: 'CW-2001',
    customerName: 'Kunle Salami',
    customerPhone: '08021234567',
    displayType: 'Sedan Clear',
    displayDetails: 'Full Wash',
    paymentMethod: 'POS',
    attendant: 'Tunde Akin',
    cashier: 'Grace Udo',
    amount: 5000
  },
  {
    id: 'r-3',
    date: '2026-06-21T11:15:00.000Z',
    source: 'Gas Plant',
    receiptNumber: 'GAS-1002',
    customerName: 'Bola Ade',
    customerPhone: '08036543210',
    displayType: 'LPG 6kg',
    displayDetails: '6 kg @ ₦1100/kg',
    paymentMethod: 'Bank Transfer',
    attendant: 'Seyi Ibitoye',
    cashier: 'Maryam Hassan',
    amount: 6600
  },
  {
    id: 'r-4',
    date: '2026-06-21T12:40:00.000Z',
    source: 'Car Wash',
    receiptNumber: 'CW-2002',
    customerName: 'Sade Okafor',
    customerPhone: '08029876543',
    displayType: 'SUV Clear',
    displayDetails: 'Premium Polish',
    paymentMethod: 'Cash',
    attendant: 'Kemi Lawal',
    cashier: 'Titi Okafor',
    amount: 8000
  }
];

type SortField = 'date' | 'amount' | 'receipt' | 'customer';
type SortOrder = 'asc' | 'desc';

export default function Reporting() {
  // Preset report periods
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  // Selected scope (combined, gas, carwash)
  const [scope, setScope] = useState<'all' | 'gas' | 'carwash'>('all');

  // Custom range constraints (defaults to typical range in June 2026)
  const [startDateStr, setStartDateStr] = useState('2026-06-21');
  const [endDateStr, setEndDateStr] = useState('2026-06-21');

  // Query & sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const periodBoundaries = (() => {
    const today = new Date('2026-06-21T14:45:00');
    let start = new Date(today);
    let end = new Date(today);

    if (reportPeriod === 'daily') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (reportPeriod === 'weekly') {
      start.setDate(today.getDate() - 7);
      end.setHours(23, 59, 59, 999);
    } else if (reportPeriod === 'monthly') {
      start = new Date('2026-06-01T00:00:00');
      end.setHours(23, 59, 59, 999);
    } else if (reportPeriod === 'custom') {
      start = new Date(startDateStr + 'T00:00:00');
      end = new Date(endDateStr + 'T23:59:59');
    }

    return { start, end };
  })();

  const consolidatedRecords = (() => {
    const { start, end } = periodBoundaries;
    let combined = STATIC_REPORT_ROWS;

    if (scope === 'gas') {
      combined = STATIC_REPORT_ROWS.filter(record => record.source === 'Gas Plant');
    } else if (scope === 'carwash') {
      combined = STATIC_REPORT_ROWS.filter(record => record.source === 'Car Wash');
    }

    return combined.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
  })();

  const query = searchQuery.toLowerCase().trim();
  const searchedAndSortedRecords = (() => {
    let result = consolidatedRecords;

    if (query) {
      result = result.filter(r =>
        r.customerName.toLowerCase().includes(query) ||
        r.receiptNumber.toLowerCase().includes(query) ||
        r.displayType.toLowerCase().includes(query) ||
        r.paymentMethod.toLowerCase().includes(query) ||
        r.attendant.toLowerCase().includes(query) ||
        r.cashier.toLowerCase().includes(query)
      );
    }

    return [...result].sort((a, b) => {
      let valA: any = a[sortField === 'receipt' ? 'receiptNumber' : sortField === 'customer' ? 'customerName' : sortField];
      let valB: any = b[sortField === 'receipt' ? 'receiptNumber' : sortField === 'customer' ? 'customerName' : sortField];

      if (sortField === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  })();

  const aggregates = (() => {
    let revenue = 0;
    let transactions = searchedAndSortedRecords.length;
    let cashPay = 0;
    let transferPay = 0;
    let posPay = 0;
    let gasShare = 0;
    let cwShare = 0;

    searchedAndSortedRecords.forEach(r => {
      revenue += r.amount;
      if (r.paymentMethod === 'Cash') cashPay += r.amount;
      else if (r.paymentMethod === 'Bank Transfer') transferPay += r.amount;
      else if (r.paymentMethod === 'POS') posPay += r.amount;

      if (r.source === 'Gas Plant') gasShare += r.amount;
      else if (r.source === 'Car Wash') cwShare += r.amount;
    });

    return {
      revenue,
      transactions,
      cashPay,
      transferPay,
      posPay,
      gasShare,
      cwShare
    };
  })();

  // Toggle sort direction helper
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Printable Report action
  const triggerReportPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="reporting-module-container">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs" id="reporting-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Commercial Financial Audits</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Audit consolidated earnings, filter custom dates, & export standard prints</p>
          </div>
        </div>
        <button
          onClick={triggerReportPrint}
          className="mt-4 md:mt-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition"
          id="print-report-trig"
        >
          <Printer className="w-4 h-4" /> Print Current Report
        </button>
      </div>

      {/* Control console panel for criteria */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-4" id="reporting-controls">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="controls-grid">
          
          {/* Period Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Report Scope Mode</label>
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="grid grid-cols-2 gap-1.5" id="report-period-presets">
                {([
                  { key: 'daily', label: 'Today Only' },
                  { key: 'weekly', label: 'Last 7 Days' },
                  { key: 'monthly', label: 'June MTD' },
                  { key: 'custom', label: 'Custom Dates' }
                ] as const).map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setReportPeriod(p.key)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition ${
                      reportPeriod === p.key 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SBU Scope Selectors */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">SBU DIVISION Filter</label>
            <div className="flex flex-col gap-1 pt-1" id="scope-selector-buttons">
              {[
                { id: 'all', label: 'All Combined Divisions' },
                { id: 'gas', label: 'Gas SBU Plant accounts' },
                { id: 'carwash', label: 'Car Wash Center accounts' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setScope(item.id as any)}
                  className={`text-left text-xs px-3 py-1.5 border rounded-lg font-semibold transition ${
                    scope === item.id 
                      ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-white border-slate-300 dark:border-slate-600 font-bold' 
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Fields (Visible on Custom) */}
          <div className={`space-y-1.5 md:col-span-2 grid grid-cols-2 gap-3 ${reportPeriod !== 'custom' ? 'opacity-40 pointer-events-none' : ''}`} id="custom-dates-inputs">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Start Date
              </label>
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> End Date
              </label>
              <input
                type="date"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="col-span-2 text-[10px] text-slate-450 italic">
              * Configure Custom Date Range to extract historical data.
            </div>
          </div>

        </div>

        {/* Text Filter Search */}
        <div className="relative pt-2" id="report-search">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-2">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching report customer name, order, ticket ID, cashier, attendant..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Aggregate Analytical Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="aggregations-kpis">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs flex items-center gap-3" id="agg-revenue">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Consolidated Revenue</span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{formatNaira(aggregates.revenue)}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs flex items-center gap-3" id="agg-tickets">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Transactions</span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{aggregates.transactions} tickets</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs flex items-center gap-3" id="agg-splits">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/40 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">SBU Allocation Share </span>
            <div className="font-bold text-slate-800 dark:text-white">Gas: <span className="text-orange-600">{formatNaira(aggregates.gasShare)}</span></div>
            <div className="font-bold text-slate-800 dark:text-white">Wash: <span className="text-green-600">{formatNaira(aggregates.cwShare)}</span></div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs flex items-center gap-3" id="agg-payment">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold font-bold">Payments Distribution</span>
            <div>Cash: <span className="font-bold text-slate-800 dark:text-white">₦{aggregates.cashPay.toLocaleString()}</span></div>
            <div>Trsf: <span className="font-bold text-slate-800 dark:text-white">₦{aggregates.transferPay.toLocaleString()}</span></div>
            <div>POS: <span className="font-bold text-slate-800 dark:text-white">₦{aggregates.posPay.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      {/* Audit List Output Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-4" id="report-ledger-table-panel">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Report Audit ledger</h2>

        {/* PRINT DISPATCH BANNER */}
        <div id="print-header-brand" className="hidden print:block text-center space-y-1 pb-4 border-b">
          <h2 className="text-lg font-bold">SBU GAS OIL & CAR WASH CENTRAL SYSTEM REPORT</h2>
          <p className="text-xs">Report Period: <span className="font-bold text-blue-800">{reportPeriod.toUpperCase()}</span> ({periodBoundaries.start.toLocaleDateString()} - {periodBoundaries.end.toLocaleDateString()})</p>
          <p className="text-xs">Active Filter SBU Division Scope: <span className="font-bold uppercase text-blue-800">{scope}</span></p>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-700/50 rounded-xl" id="report-ledger-table-scroller">
          <table className="w-full text-xs text-left border-collapse" id="audit-printable-table">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700/50">
              <tr>
                <th className="p-3">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 font-semibold hover:text-blue-600">
                    Date & Time <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="p-3">
                  <button onClick={() => handleSort('receipt')} className="flex items-center gap-1 font-semibold hover:text-blue-600">
                    SBU Division <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="p-3">
                  <button onClick={() => handleSort('customer')} className="flex items-center gap-1 font-semibold hover:text-blue-600">
                    Customer Account <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="p-3">Specification Details</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Staff (Cashier/Att.)</th>
                <th className="p-3 text-right">
                  <button onClick={() => handleSort('amount')} className="flex items-center gap-1 font-semibold hover:text-blue-650 justify-end w-full">
                    Bill (₦) <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 dark:text-slate-300">
              {searchedAndSortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 dark:text-slate-500">
                    <FileText className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                    No financial archives found mapping current parameters.
                  </td>
                </tr>
              ) : (
                searchedAndSortedRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 truncate max-w-[120px] font-mono">
                      {new Date(item.date).toLocaleDateString('en-NG')} {item.date.substring(11, 16)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.source === 'Gas Plant' 
                          ? 'bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-400' 
                          : 'bg-green-105 text-green-900 dark:bg-green-950/40 dark:text-green-400'
                      }`}>
                        {item.source}
                      </span>
                      <div className="font-mono text-[9px] text-slate-400 mt-1">{item.receiptNumber}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold">{item.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.customerPhone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold">{item.displayType}</div>
                      <div className="text-[10px] text-slate-500">{item.displayDetails}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-[10px] border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] text-slate-500">
                      <div>Cashier: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.cashier.split(' ')[0]}</span></div>
                      <div>Att.: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.attendant.split(' ')[0]}</span></div>
                    </td>
                    <td className="p-3 font-bold text-right text-slate-900 dark:text-white">
                      {formatNaira(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
