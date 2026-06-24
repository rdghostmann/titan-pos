"use client";
import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Info, 
  Play, 
  Eye,
  Trash2
} from 'lucide-react';
import { GasSale, CarWashSale } from '@/types';
import { ATTENDANTS_GAS, ATTENDANTS_CARWASH, CASHIERS, formatNaira } from '@/mockData';

interface ExcelIOProps {
  gasSales: GasSale[];
  carWashSales: CarWashSale[];
  onImportGasSales: (parsed: GasSale[], mode: 'merge' | 'replace') => void;
  onImportCarWashSales: (parsed: CarWashSale[], mode: 'merge' | 'replace') => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function ExcelIO({ 
  gasSales, 
  carWashSales, 
  onImportGasSales, 
  onImportCarWashSales, 
  showToast 
}: ExcelIOProps) {
  
  // States to hold uploaded preview data
  const [gasImportPreview, setGasImportPreview] = useState<any[] | null>(null);
  const [cwImportPreview, setCWImportPreview] = useState<any[] | null>(null);
  const [duplicateGasReceiptsCount, setDuplicateGasReceiptsCount] = useState<number>(0);
  const [duplicateCWReceiptsCount, setDuplicateCWReceiptsCount] = useState<number>(0);
  const [activeImportTab, setActiveImportTab] = useState<'gas' | 'carwash'>('gas');

  // File Input References
  const fileInputGasRef = useRef<HTMLInputElement>(null);
  const fileInputCWRef = useRef<HTMLInputElement>(null);

  // --- EXPORT Gas Plant Records ---
  const handleExportGas = () => {
    try {
      const rows = gasSales.map(g => ({
        Date: new Date(g.date).toLocaleDateString('en-NG') + ' ' + g.date.substring(11, 16),
        'Receipt No': g.receiptNumber,
        'Customer Name': g.customerName,
        'Cylinder Size': g.cylinderSize,
        'Quantity Filled (KG)': g.quantity,
        'Price per KG (₦)': g.pricePerKg,
        'Total Amount Paid (₦)': g.amount,
        'Payment Method': g.paymentMethod,
        Attendant: g.attendant,
        Cashier: g.cashier,
        Remarks: g.remarks
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cooking_Gas_Sales");
      XLSX.writeFile(workbook, "Cooking_Gas_Sales_SBU_Report.xlsx");
      showToast('Cooking Gas Sales exported to Excel успешно!', 'success');
    } catch (e: any) {
      showToast('Gas Excel Export action failed: ' + e.message, 'error');
    }
  };

  // --- EXPORT Car Wash Records ---
  const handleExportCarWash = () => {
    try {
      const rows = carWashSales.map(c => ({
        Date: new Date(c.date).toLocaleDateString('en-NG') + ' ' + c.date.substring(11, 16),
        'Receipt No': c.receiptNumber,
        'Customer Name': c.customerName,
        'Phone Number': c.customerPhone,
        'Vehicle Number': c.vehicleNumberPlate,
        'Vehicle Type': c.vehicleType,
        'Service Type': c.serviceType,
        'Amount Paid (₦)': c.amount,
        'Payment Method': c.paymentMethod,
        'Time In': c.timeIn,
        'Time Out': c.timeOut,
        Attendant: c.attendant,
        Cashier: c.cashier,
        Remarks: c.remarks
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Car_Wash_Services");
      XLSX.writeFile(workbook, "Car_Wash_Services_SBU_Report.xlsx");
      showToast('Car Wash records exported to Excel successfully!', 'success');
    } catch (e: any) {
      showToast('Car Wash Export action failed: ' + e.message, 'error');
    }
  };

  // --- EXPORT COMBINED MASTER WORKBOOK ---
  const handleExportCombined = () => {
    try {
      // Sheet 1: Dashboard Summary KPIs
      const totalGasRev = gasSales.reduce((sum, g) => sum + g.amount, 0);
      const totalCWRev = carWashSales.reduce((sum, c) => sum + c.amount, 0);
      const kpisRow = [
        { 'Key Performance Indicator': 'Total Group Revenue (₦)', Metric: totalGasRev + totalCWRev },
        { 'Key Performance Indicator': 'Cooking Gas division sales (₦)', Metric: totalGasRev },
        { 'Key Performance Indicator': 'Car Wash division bills (₦)', Metric: totalCWRev },
        { 'Key Performance Indicator': 'All Group Transactions Count', Metric: gasSales.length + carWashSales.length },
        { 'Key Performance Indicator': 'Cooking Gas Tickets Sold', Metric: gasSales.length },
        { 'Key Performance Indicator': 'Car Wash Tickets Serviced', Metric: carWashSales.length },
      ];
      const wsKPIs = XLSX.utils.json_to_sheet(kpisRow);

      // Sheet 2: Gas Sales
      const wsGasSales = XLSX.utils.json_to_sheet(gasSales.map(g => ({
        ID: g.id, Date: g.date, 'Receipt No': g.receiptNumber, 'Customer Name': g.customerName,
        'Cylinder Size': g.cylinderSize, 'Quantity (KG)': g.quantity, Amount: g.amount,
        'Payment Method': g.paymentMethod, Attendant: g.attendant, Cashier: g.cashier, Remarks: g.remarks
      })));

      // Sheet 3: Car Wash
      const wsCarWash = XLSX.utils.json_to_sheet(carWashSales.map(c => ({
        ID: c.id, Date: c.date, 'Receipt No': c.receiptNumber, 'Customer Name': c.customerName,
        'Vehicle Number': c.vehicleNumberPlate, 'Vehicle Type': c.vehicleType, 'Service Type': c.serviceType,
        Amount: c.amount, 'Payment Method': c.paymentMethod, Attendant: c.attendant, Cashier: c.cashier,
        'Time In': c.timeIn, 'Time Out': c.timeOut, Remarks: c.remarks
      })));

      // Sheet 4: Staff performance
      const staffPerf: Record<string, { SBU: string; Revenue: number; Tickets: number }> = {};
      gasSales.forEach(g => {
        if (!staffPerf[g.attendant]) staffPerf[g.attendant] = { SBU: 'Gas Plant', Revenue: 0, Tickets: 0 };
        staffPerf[g.attendant].Revenue += g.amount;
        staffPerf[g.attendant].Tickets += 1;
      });
      carWashSales.forEach(c => {
        if (!staffPerf[c.attendant]) staffPerf[c.attendant] = { SBU: 'Car Wash', Revenue: 0, Tickets: 0 };
        staffPerf[c.attendant].Revenue += c.amount;
        staffPerf[c.attendant].Tickets += 1;
      });
      const staffList = Object.keys(staffPerf).map(name => ({
        'Staff Name': name,
        'Primary SBU Branch': staffPerf[name].SBU,
        'Individual Revenue Generated (₦)': staffPerf[name].Revenue,
        'Quantity Tickets Booked': staffPerf[name].Tickets
      }));
      const wsStaff = XLSX.utils.json_to_sheet(staffList);

      // Sheet 5: Daily Revenue Analysis
      const dailyRev: Record<string, { Gas: number; CarWash: number; Total: number }> = {};
      gasSales.forEach(g => {
        const key = g.date.split('T')[0];
        if (!dailyRev[key]) dailyRev[key] = { Gas: 0, CarWash: 0, Total: 0 };
        dailyRev[key].Gas += g.amount;
        dailyRev[key].Total += g.amount;
      });
      carWashSales.forEach(c => {
        const key = c.date.split('T')[0];
        if (!dailyRev[key]) dailyRev[key] = { Gas: 0, CarWash: 0, Total: 0 };
        dailyRev[key].CarWash += c.amount;
        dailyRev[key].Total += c.amount;
      });
      const dailyAnalysisList = Object.keys(dailyRev).map(date => ({
        Date: date,
        'Gas Revenue (₦)': dailyRev[date].Gas,
        'Car Wash Revenue (₦)': dailyRev[date].CarWash,
        'Combined Total Revenue (₦)': dailyRev[date].Total
      })).sort((a,b) => b.Date.localeCompare(a.Date));
      const wsDaily = XLSX.utils.json_to_sheet(dailyAnalysisList);

      // Compile into Single Master Workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, wsKPIs, "Dashboard_Summary");
      XLSX.utils.book_append_sheet(workbook, wsGasSales, "Gas_Sales_Ledger");
      XLSX.utils.book_append_sheet(workbook, wsCarWash, "Car_Wash_Ledger");
      XLSX.utils.book_append_sheet(workbook, wsStaff, "Staff_Performance");
      XLSX.utils.book_append_sheet(workbook, wsDaily, "Daily_Revenue_Analysis");

      // Save File
      XLSX.writeFile(workbook, "Enterprise_Combined_Corporate_Report.xlsx");
      showToast('Multi-SBU Combined Workbook Excel report downloaded successfully!', 'success');
    } catch (e: any) {
      showToast('Combined Workbook Export Failed: ' + e.message, 'error');
    }
  };


  // --- PARSE UPLOADED GAS WORKBOOK FILE ---
  const handleUploadGasFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryData = evt.target?.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        
        // Find sheet
        const sheetName = workbook.SheetNames[0];
        const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

        if (rawRows.length === 0) {
          showToast('File is empty or worksheet could not be parsed', 'error');
          return;
        }

        // Validate minimal columns (Receipt No, Customer Name, Total Amount / Amount, Cylinder Size etc)
        const sample = rawRows[0];
        const potentialKeys = Object.keys(sample);
        
        const hasReceipt = potentialKeys.some(k => k.toLowerCase().includes('receipt'));
        const hasCustomer = potentialKeys.some(k => k.toLowerCase().includes('customer'));
        
        if (!hasReceipt || !hasCustomer) {
          showToast('Spreadsheet columns validation failed. Must contain Customer Name and Receipt fields.', 'error');
          return;
        }

        // Standardize into GasSale array format
        const standardSales: GasSale[] = rawRows.map((r, idx) => {
          // Attempt parsing details from row
          const recNo = r['Receipt No'] || r['receiptNumber'] || `GAS-IMP-${Date.now()}-${idx}`;
          const clientName = r['Customer Name'] || r['customerName'] || 'Imported Customer';
          const size = r['Cylinder Size'] || r['cylinderSize'] || '12.5kg';
          const qty = Number(r['Quantity Filled (KG)'] || r['quantity'] || 12.5);
          const rate = Number(r['Price per KG (₦)'] || r['pricePerKg'] || 1200);
          const val = Number(r['Total Amount Paid (₦)'] || r['amount'] || (qty * rate));
          const pay = r['Payment Method'] || r['paymentMethod'] || 'Cash';
          const att = r['Attendant'] || r['attendant'] || ATTENDANTS_GAS[0];
          const cash = r['Cashier'] || r['cashier'] || CASHIERS[0];
          const rem = r['Remarks'] || r['remarks'] || '';
          
          let dateStr = r['Date'] || r['date'];
          if (!dateStr) {
            dateStr = new Date('2026-06-21T14:45:00').toISOString();
          } else if (typeof dateStr === 'number') {
            // Excel serial dates handling
            dateStr = new Date((dateStr - 25569) * 86400 * 1000).toISOString();
          }

          return {
            id: 'gas-imp-' + idx + '-' + Date.now(),
            receiptNumber: String(recNo).trim(),
            date: new Date(dateStr).toISOString(),
            customerName: String(clientName).trim(),
            customerPhone: String(r['Phone Number'] || r['customerPhone'] || 'N/A'),
            cylinderSize: size,
            quantity: qty,
            pricePerKg: rate,
            amount: val,
            paymentMethod: pay,
            attendant: att,
            cashier: cash,
            remarks: String(rem)
          };
        });

        // Compute duplicates against local system sales
        const existingReceipts = new Set(gasSales.map(g => g.receiptNumber));
        const dupes = standardSales.filter(g => existingReceipts.has(g.receiptNumber)).length;

        setDuplicateGasReceiptsCount(dupes);
        setGasImportPreview(standardSales);
        showToast(`Matched ${standardSales.length} rows inside sheet successfully! Preview loaded.`, 'success');
      } catch (err: any) {
        showToast('Worksheet compilation failure: ' + err.message, 'error');
      }
    };
    reader.readAsBinaryString(file);
  };


  // --- PARSE UPLOADED CAR WASH WORKBOOK FILE ---
  const handleUploadCWFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryData = evt.target?.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        
        const sheetName = workbook.SheetNames[0];
        const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

        if (rawRows.length === 0) {
          showToast('Car wash sheet parses blank. No rows discoverable.', 'error');
          return;
        }

        const sample = rawRows[0];
        const potentialKeys = Object.keys(sample);

        const hasReceipt = potentialKeys.some(k => k.toLowerCase().includes('receipt'));
        const hasPlate = potentialKeys.some(k => k.toLowerCase().includes('vehicle') || k.toLowerCase().includes('plate'));

        if (!hasReceipt || !hasPlate) {
          showToast('Spreadsheet mapping failure! Make sure columns contain Receipt No and Vehicle Plate attributes', 'error');
          return;
        }

        const standardServices: CarWashSale[] = rawRows.map((r, idx) => {
          const recNo = r['Receipt No'] || r['receiptNumber'] || `CW-IMP-${Date.now()}-${idx}`;
          const clientName = r['Customer Name'] || r['customerName'] || 'Imported Customer';
          const plate = r['Vehicle Number'] || r['vehicleNumberPlate'] || r['Vehicle Plate'] || 'N/A';
          const vType = r['Vehicle Type'] || r['vehicleType'] || 'Sedan';
          const sType = r['Service Type'] || r['serviceType'] || 'Full Wash';
          const val = Number(r['Amount Paid (₦)'] || r['amount'] || 2500);
          const pay = r['Payment Method'] || r['paymentMethod'] || 'Cash';
          const tIn = r['Time In'] || r['timeIn'] || '08:00';
          const tOut = r['Time Out'] || r['timeOut'] || '08:45';
          const att = r['Attendant'] || r['attendant'] || ATTENDANTS_CARWASH[0];
          const cash = r['Cashier'] || r['cashier'] || CASHIERS[0];
          const rem = r['Remarks'] || r['remarks'] || '';

          let dateStr = r['Date'] || r['date'];
          if (!dateStr) {
            dateStr = new Date('2026-06-21T14:45:00').toISOString();
          } else if (typeof dateStr === 'number') {
            dateStr = new Date((dateStr - 25569) * 86400 * 1000).toISOString();
          }

          return {
            id: 'cw-imp-' + idx + '-' + Date.now(),
            receiptNumber: String(recNo).trim(),
            date: new Date(dateStr).toISOString(),
            customerName: String(clientName).trim(),
            customerPhone: String(r['Phone Number'] || r['customerPhone'] || 'N/A'),
            vehicleNumberPlate: String(plate).trim().toUpperCase(),
            vehicleType: vType,
            serviceType: sType,
            amount: val,
            paymentMethod: pay,
            attendant: att,
            cashier: cash,
            timeIn: String(tIn),
            timeOut: String(tOut),
            remarks: String(rem)
          };
        });

        // Compute duplicates against local system bookings
        const existingReceipts = new Set(carWashSales.map(c => c.receiptNumber));
        const dupes = standardServices.filter(c => existingReceipts.has(c.receiptNumber)).length;

        setDuplicateCWReceiptsCount(dupes);
        setCWImportPreview(standardServices);
        showToast(`Matched ${standardServices.length} rows in Car Wash sheet! Preview loaded.`, 'success');
      } catch (err: any) {
        showToast('Worksheet processing failed: ' + err.message, 'error');
      }
    };
    reader.readAsBinaryString(file);
  };


  // --- COMMIT IMPORTS (Gas Plant Division) ---
  const commitGasImport = (mode: 'merge' | 'replace') => {
    if (!gasImportPreview) return;
    onImportGasSales(gasImportPreview as GasSale[], mode);
    setGasImportPreview(null);
    setDuplicateGasReceiptsCount(0);
    if (fileInputGasRef.current) fileInputGasRef.current.value = '';
    showToast(`Gas sales imported via ${mode === 'merge' ? 'Merge (retain duplicates)' : 'Replace/Overwrite'} mode successfully!`, 'success');
  };

  // --- COMMIT IMPORTS (Car Wash Division) ---
  const commitCWImport = (mode: 'merge' | 'replace') => {
    if (!cwImportPreview) return;
    onImportCarWashSales(cwImportPreview as CarWashSale[], mode);
    setCWImportPreview(null);
    setDuplicateCWReceiptsCount(0);
    if (fileInputCWRef.current) fileInputCWRef.current.value = '';
    showToast(`Car wash services imported via ${mode === 'merge' ? 'Merge & Insert' : 'Replace All'} mode safely!`, 'success');
  };

  return (
    <div className="space-y-6 animate-none" id="excel-io-component-container">
      {/* top info bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs" id="excel-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Excel integration Center</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Export clean multi-sheet workbooks or backup/restore from spreadsheets</p>
          </div>
        </div>
      </div>

      {/* Grid of exports and imports blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="excel-grid">
        
        {/* PANEL 1: EXPORT UTILITIES */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-6" id="export-utilities">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-3 flex items-center gap-2">
            <Download className="w-4 h-4 text-theme" /> Export to Spreadsheets (.xlsx)
          </h2>
          <p className="text-xs text-slate-500">Download formatted worksheets containing filtered collections & overall KPI parameters. Standardized schema facilitates audit transfers.</p>
          
          <div className="space-y-3 pt-2" id="export-actions-list">
            
            {/* Export 1: Cooking Gas plant SBU */}
            <div className="p-4 bg-orange-50/40 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl flex items-center justify-between" id="export-single-gas-card">
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-white block">SBU Cooking Gas sales</span>
                <span className="text-[10px] text-slate-500 block">Total: {gasSales.length} records mapped</span>
              </div>
              <button
                onClick={handleExportGas}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" /> Export Gas sales
              </button>
            </div>

            {/* Export 2: Car Wash plant SBU */}
            <div className="p-4 bg-green-50/40 dark:bg-green-950/20 border border-green-105 dark:border-green-905/45 rounded-xl flex items-center justify-between" id="export-single-cw-card">
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-white block">SBU Car Wash clean registries</span>
                <span className="text-[10px] text-slate-500 block">Total: {carWashSales.length} services logged</span>
              </div>
              <button
                onClick={handleExportCarWash}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" /> Export Car Wash
              </button>
            </div>

            {/* Export 3: Combined Enterprise Corporate Sheet */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 border border-blue-100 dark:border-slate-800 rounded-xl relative overflow-hidden" id="export-multi-sheets-card">
              <div className="absolute right-0 bottom-0 opacity-10 filter blur-[1px]">
                <FileSpreadsheet className="w-24 h-24 text-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="text-xs space-y-1">
                  <span className="font-extrabold text-blue-800 dark:text-blue-400 block text-sm">Combined Corporate Master Workbook</span>
                  <span className="text-[10px] text-slate-500 block">Compiles SBU Gas, Car Wash, Staff Productivities, and Daily SBU Revenue tables into 5 beautiful worksheets in a single .xlsx file.</span>
                </div>
                <button
                  onClick={handleExportCombined}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition"
                  id="export-conso-wb"
                >
                  <Download className="w-4 h-4" /> Download Unified Multi-Sheet Report
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* PANEL 2: IMPORT UTILITIES */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-6" id="import-utilities">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-theme" /> Import & Restore Backup (.xlsx, .xls, .csv)
          </h2>
          
          {/* Sub Tab selection for Gas vs Car wash import */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl text-xs gap-1.5" id="import-subtabs">
            <button
              onClick={() => setActiveImportTab('gas')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                activeImportTab === 'gas' 
                  ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
              }`}
            >
              Gas Import Desk
            </button>
            <button
              onClick={() => setActiveImportTab('carwash')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                activeImportTab === 'carwash' 
                  ? 'bg-white dark:bg-slate-800 text-green-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
              }`}
            >
              Car Wash Import Desk
            </button>
          </div>

          <div className="space-y-4" id="import-active-panel">
            {activeImportTab === 'gas' ? (
              <div className="space-y-4" id="gas-import-flow">
                <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-orange-400/80 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer relative bg-slate-50/30">
                  <Upload className="w-8 h-8 text-orange-500" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-350 block">Upload Gas Sales Worksheet</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Supports .xlsx, .xls, .csv matching standard columns</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputGasRef}
                    onChange={handleUploadGasFile}
                    accept=".xlsx, .xls, .csv"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* Previews panel */}
                {gasImportPreview && (
                  <div className="p-4 bg-orange-100/50 dark:bg-orange-950/20 border border-orange-200 rounded-xl space-y-3 text-xs" id="gas-import-preview-box">
                    <div className="flex items-center gap-1.5 text-orange-850 dark:text-orange-450 font-bold">
                      <Info className="w-4 h-4 shrink-0" />
                      Spreadsheet parsed successfully! ({gasImportPreview.length} items mapped)
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded border border-orange-100">
                      <div>Headers Verified: <span className="font-bold text-emerald-600">YES</span></div>
                      <div>Conflict Sequence Receipts: <span className="font-bold text-rose-500">{duplicateGasReceiptsCount} matches</span></div>
                    </div>

                    {duplicateGasReceiptsCount > 0 && (
                      <div className="flex items-start gap-1.5 text-rose-600 font-medium text-[10px] leading-relaxed">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>Warning: Duplicate receipt numbers detected. Overwriting replacement will replace original entries. Merging will allow multiple entries under identical receipt numbers.</div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => commitGasImport('merge')}
                        className="py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-[11px]"
                      >
                        Merge & Append records
                      </button>
                      <button
                        onClick={() => commitGasImport('replace')}
                        className="py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-[11px]"
                      >
                        Reset & Overwrite All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4" id="cw-import-flow">
                <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-green-400/80 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer relative bg-slate-50/30">
                  <Upload className="w-8 h-8 text-green-500" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-350 block">Upload Car Wash Logs Sheet</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Supports .xlsx, .xls, .csv matching standard columns</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputCWRef}
                    onChange={handleUploadCWFile}
                    accept=".xlsx, .xls, .csv"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* Previews panel */}
                {cwImportPreview && (
                  <div className="p-4 bg-green-100/50 dark:bg-green-950/20 border border-green-203 rounded-xl space-y-3 text-xs" id="cw-import-preview-box">
                    <div className="flex items-center gap-1.5 text-green-850 dark:text-green-450 font-bold">
                      <Info className="w-4 h-4 shrink-0" />
                      Spreadsheet parsed successfully! ({cwImportPreview.length} services mapped)
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded border border-green-100">
                      <div>Headers Verified: <span className="font-bold text-emerald-600">YES</span></div>
                      <div>Conflict Sequence Receipts: <span className="font-bold text-rose-500">{duplicateCWReceiptsCount} matches</span></div>
                    </div>

                    {duplicateCWReceiptsCount > 0 && (
                      <div className="flex items-start gap-1.5 text-rose-600 font-medium text-[10px] leading-relaxed">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>Warning: Duplicate matching receipt sequences found. Choose merger or complete rewrite overwrite parameters.</div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1" id="import-confirm-btn-sc">
                      <button
                        onClick={() => commitCWImport('merge')}
                        className="py-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-[11px]"
                      >
                        Merge & Append entries
                      </button>
                      <button
                        onClick={() => commitCWImport('replace')}
                        className="py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-[11px]"
                      >
                        Reset & Clear replace
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
