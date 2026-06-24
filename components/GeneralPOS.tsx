"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Printer, 
  Barcode, 
  Plus, 
  Minus, 
  Percent, 
  DollarSign, 
  X, 
  Check, 
  Calendar, 
  User as UserIcon, 
  ShoppingBag,
  RotateCcw,
  Tag,
  AlertTriangle,
  History
} from 'lucide-react';
import { Product, GeneralSale, SalesItem, UserRole } from '@/types';
import { formatNaira } from '@/mockData';

interface GeneralPOSProps {
  products: Product[];
  sales: GeneralSale[];
  onAddSale: (sale: GeneralSale) => void;
  onUpdateProduct: (product: Product) => void;
  currentRole: UserRole;
  currentUserName: string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const CATEGORIES = [
  'All',
  'Groceries',
  'Beverages',
  'Electronics',
  'Cosmetics',
  'Household Items',
  'Stationery',
  'Pharmaceuticals',
  'Services'
] as const;

export default function GeneralPOS({
  products,
  sales,
  onAddSale,
  onUpdateProduct,
  currentRole,
  currentUserName,
  showToast
}: GeneralPOSProps) {
  // State
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>('checkout');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Cart State (stored as array of { product: Product, quantity: number })
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  
  // Checkout Input States
  const [discountInput, setDiscountInput] = useState<number>(0);
  const [cashReceivedInput, setCashReceivedInput] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'POS'>('Cash');
  
  // Active Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<GeneralSale | null>(null);
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  // History Filter States
  const [historySearch, setHistorySearch] = useState('');
  const [historyCashier, setHistoryCashier] = useState('All');
  const [historyDate, setHistoryDate] = useState('');

  // Barcode Lookup Simulator
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matchedProduct = products.find(p => p.barcode === barcodeInput.trim() && p.status === 'Active');
    
    if (matchedProduct) {
      if (matchedProduct.quantity === 0) {
        showToast(`Product "${matchedProduct.name}" is OUT OF STOCK.`, 'error');
      } else {
        addToCart(matchedProduct);
        showToast(`Scanned: ${matchedProduct.name}`, 'success');
      }
    } else {
      showToast(`SKU / Barcode "${barcodeInput}" not found in inventory registry.`, 'error');
    }
    setBarcodeInput('');
  };

  // Add Item to active cart
  const addToCart = (product: Product) => {
    if (product.quantity === 0) return;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].quantity;
        if (currentQty >= product.quantity && product.category !== 'Services') {
          showToast(`Cannot exceed physical available stock (${product.quantity} units)`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: currentQty + 1 };
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Alter cart item quantity
  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      const target = prev.find(item => item.product.id === productId);
      if (!target) return prev;

      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }

      if (delta > 0 && target.quantity >= target.product.quantity && target.product.category !== 'Services') {
        showToast(`Cannot exceed physical available stock (${target.product.quantity} units)`, 'error');
        return prev;
      }

      return prev.map(item => item.product.id === productId ? { ...item, quantity: newQty } : item);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Mathematical computations
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = Math.max(0, subtotal - discountInput);
    const balance = Math.max(0, cashReceivedInput - grandTotal);

    return {
      subtotal,
      totalQuantity,
      grandTotal,
      balance
    };
  }, [cart, discountInput, cashReceivedInput]);

  // Set Cash denominations helper
  const applyCashDenomination = (denom: number) => {
    setCashReceivedInput(denom);
  };

  // Generate dynamic GS-000001 sequence
  const nextReceiptNumber = useMemo(() => {
    const sorted = [...sales].sort((a, b) => b.receiptNumber.localeCompare(a.receiptNumber));
    if (sorted.length === 0) return 'GS-000001';

    const lastNumStr = sorted[0].receiptNumber.split('-')[1];
    const lastNumVal = parseInt(lastNumStr, 10);
    return `GS-${String(lastNumVal + 1).padStart(6, '0')}`;
  }, [sales]);

  // Handle Checkout Order submission
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Cannot checkout: Shopping Cart is empty', 'error');
      return;
    }
    if (cashReceivedInput < totals.grandTotal && paymentMethod === 'Cash') {
      showToast('Deduct failure: Cash Received is less than Grand Total', 'error');
      return;
    }

    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const formattedTime = todayDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: false });

    // 1. Compile Sales Items list representing product models sold
    const itemsList: SalesItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.sellingPrice,
      quantity: item.quantity,
      total: item.product.sellingPrice * item.quantity
    }));

    // 2. Build Transaction record
    const newSaleID = 'gs_' + Math.random().toString(36).substr(2, 9);
    const newSale: GeneralSale = {
      id: newSaleID,
      receiptNumber: nextReceiptNumber,
      items: itemsList,
      totalQuantity: totals.totalQuantity,
      subtotal: totals.subtotal,
      discount: discountInput,
      tax: 0,
      grandTotal: totals.grandTotal,
      cashReceived: paymentMethod === 'Cash' ? cashReceivedInput : totals.grandTotal,
      balanceReturned: paymentMethod === 'Cash' ? totals.balance : 0,
      cashierName: currentUserName,
      date: formattedDate,
      time: formattedTime
    };

    // 3. Subtract physical available stock for non-unbounded services
    cart.forEach(item => {
      if (item.product.category !== 'Services') {
        const nextQty = Math.max(0, item.product.quantity - item.quantity);
        onUpdateProduct({
          ...item.product,
          quantity: nextQty,
          lastUpdated: todayDate.toISOString()
        });
      }
    });

    // 4. Save and commit
    onAddSale(newSale);
    showToast(`Sale completed successfully: ${newSale.receiptNumber}`, 'success');

    // Reset states and trigger print modal
    setActiveReceipt(newSale);
    setCart([]);
    setDiscountInput(0);
    setCashReceivedInput(0);
  };

  // Filter Catalog Products
  const visibleProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'Active') return false;
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.barcode && p.barcode.includes(searchTerm));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Filter Transaction History Logs
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchSearch = s.receiptNumber.includes(historySearch) || 
                          s.items.some(item => item.productName.toLowerCase().includes(historySearch.toLowerCase()));
      const matchCashier = historyCashier === 'All' || s.cashierName === historyCashier;
      const matchDate = !historyDate || s.date === historyDate;

      return matchSearch && matchCashier && matchDate;
    });
  }, [sales, historySearch, historyCashier, historyDate]);

  const uniqueCashiers = useMemo(() => {
    return Array.from(new Set(sales.map(s => s.cashierName)));
  }, [sales]);

  return (
    <div className="space-y-6" id="general-pos-container">
      {/* Sub tabs configuration */}
      <div className="flex border-b border-slate-100 dark:border-slate-700/50 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl">
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'checkout' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Point Of Sale Register
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'history' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
            }`}
          >
            <History className="w-4 h-4" /> Retail Sales History Grid
          </button>
        </div>
        <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
          <span>Logged Cashier:</span> 
          <span className="font-bold text-slate-800 dark:text-white uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
            {currentUserName} ({currentRole})
          </span>
        </div>
      </div>

      {activeTab === 'checkout' ? (
        /* POS CHECKOUT MODULE SPLIT SCREEN */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="pos-split-panel">
          
          {/* LHS: Product Selector (lg:span-7) */}
          <div className="lg:col-span-7 space-y-4" id="pos-lhs-catalog">
            
            {/* Quick barcode lookup + Search tool */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Barcode scanner simulator */}
                <form onSubmit={handleBarcodeSubmit} className="relative">
                  <Barcode className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Barcode Simulator (Type & press Enter)..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white border-0 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-600 font-mono font-bold"
                  />
                  <button type="submit" className="hidden" />
                </form>

                {/* Normal Text Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search product names, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white border-0 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Categorization Slide-Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition ${
                      selectedCategory === cat 
                        ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[580px] p-0.5" id="products-catalog-grid">
              {visibleProducts.length === 0 ? (
                <div className="col-span-full text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 text-slate-400 font-medium">
                  No active products found match selected category.
                </div>
              ) : (
                visibleProducts.map(product => {
                  const isOutOfStock = product.quantity === 0 && product.category !== 'Services';
                  const isLowStock = product.quantity < product.reorderLevel && product.category !== 'Services';

                  return (
                    <div 
                      key={product.id}
                      onClick={() => !isOutOfStock && addToCart(product)}
                      className={`group p-4 bg-white dark:bg-gray-800 rounded-2xl border transition h-48 flex flex-col justify-between cursor-pointer relative shadow-xs overflow-hidden ${
                        isOutOfStock 
                          ? 'border-slate-100 opacity-55 cursor-not-allowed select-none' 
                          : 'border-slate-100 hover:border-indigo-500 hover:shadow dark:border-slate-700/50'
                      }`}
                    >
                      {/* Badge triggers */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        {isOutOfStock ? (
                          <span className="bg-red-600 text-white font-bold leading-none py-1 px-1.5 rounded text-[8px] uppercase tracking-wider">OUT OF STOCK</span>
                        ) : isLowStock ? (
                          <span className="bg-rose-500 text-white font-bold leading-none py-1 px-1.5 rounded text-[8px] uppercase tracking-wider animate-pulse">⚠ LOW</span>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight">{product.category}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 transition pt-1">{product.name}</h4>
                        {product.barcode && (
                          <p className="font-mono text-[9px] text-slate-400">BC: {product.barcode}</p>
                        )}
                      </div>

                      <div className="border-t border-slate-50 dark:border-slate-700/50 pt-2 flex items-end justify-between">
                        <div>
                          <p className="text-slate-400 text-[10px]">Price per unit</p>
                          <p className="text-sm font-black text-indigo-700 dark:text-indigo-300 font-mono">{formatNaira(product.sellingPrice)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-[9px] font-mono">In Stock</p>
                          <p className={`text-xs font-black font-mono ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>
                            {product.category === 'Services' ? '∞' : `${product.quantity} ${product.unitType}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RHS: Active Checkout Cart (lg:span-5) */}
          <div className="lg:col-span-5" id="pos-rhs-checkout">
            <form onSubmit={handleCheckout} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col h-[750px] justify-between overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-700/40 flex justify-between items-center">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm font-bold">POS Active Checkout Cart</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-indigo-100 text-indigo-800 p-1 px-2.5 rounded font-bold text-xs">{cart.length} Items</span>
                  {cart.length > 0 && (
                    <button 
                      type="button"
                      title="Clear Cart Items"
                      onClick={() => {
                        if (confirm('Clear shopping cart?')) setCart([]);
                      }}
                      className="p-1 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Shopping List view */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-slate-400 py-12 space-y-2">
                    <ShoppingBag className="w-12 h-12 text-slate-200 stroke-[1.5]" />
                    <p className="text-xs font-semibold">Ready to scan or select products.</p>
                    <p className="text-[10px] text-slate-400 max-w-xs text-center">Items clicked on catalogs or scanned with barcodes automatically render calculations in checkout.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="p-3 bg-slate-50 dark:bg-slate-700/20 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5 truncate max-w-[180px]">
                        <h5 className="font-bold text-slate-900 dark:text-white truncate" title={item.product.name}>{item.product.name}</h5>
                        <p className="text-slate-400 font-mono text-[10px]" title="Price Basis">{formatNaira(item.product.sellingPrice)} per {item.product.unitType}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white dark:bg-slate-700 rounded-lg shadow-2xs border border-slate-100 dark:border-slate-600">
                          <button 
                            type="button"
                            onClick={() => updateCartQty(item.product.id, -1)}
                            className="p-1 px-2 text-slate-500 hover:text-indigo-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 font-bold font-mono text-slate-950 dark:text-white text-sm">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateCartQty(item.product.id, 1)}
                            className="p-1 px-2 text-slate-500 hover:text-indigo-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right w-20">
                          <p className="font-bold text-slate-900 dark:text-white font-mono">{formatNaira(item.product.sellingPrice * item.quantity)}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations and checkout blocks */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
                
                {/* Formulas Panel */}
                <div className="space-y-2 text-xs">
                  {/* Basic Subtotal */}
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold">{formatNaira(totals.subtotal)}</span>
                  </div>

                  {/* Discount input in Naira */}
                  <div className="flex justify-between items-center gap-4 text-slate-600">
                    <span className="flex items-center gap-1 shrink-0">Discount Amount (₦)</span>
                    <div className="relative w-32 shrink-0">
                      <Percent className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="number"
                        min={0}
                        max={totals.subtotal}
                        value={discountInput}
                        onChange={(e) => setDiscountInput(Number(e.target.value))}
                        className="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-100 rounded text-right font-bold font-mono outline-none focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Grand total */}
                  <div className="flex justify-between items-center text-sm font-black border-t border-b border-slate-100 dark:border-slate-700/50 py-2 text-slate-900 dark:text-white">
                    <span>GRAND TOTAL</span>
                    <span className="font-mono text-base text-indigo-700 dark:text-indigo-300">{formatNaira(totals.grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout Payment details */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('Cash')}
                      className={`py-2 rounded-lg font-bold text-[10px] uppercase transition ${paymentMethod === 'Cash' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border'}`}
                    >
                      Cash
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('Bank Transfer')}
                      className={`py-2 rounded-lg font-bold text-[10px] uppercase transition ${paymentMethod === 'Bank Transfer' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border'}`}
                    >
                      Bank Transfer
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('POS')}
                      className={`py-2 rounded-lg font-bold text-[10px] uppercase transition ${paymentMethod === 'POS' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border'}`}
                    >
                      POS Split
                    </button>
                  </div>

                  {/* Cash fields */}
                  {paymentMethod === 'Cash' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-xs text-slate-500 font-bold uppercase shrink-0">Cash Received (₦)</span>
                        <input 
                          type="number"
                          required
                          min={0}
                          value={cashReceivedInput}
                          onChange={(e) => setCashReceivedInput(Number(e.target.value))}
                          className="w-40 p-2 bg-white dark:bg-slate-700 border border-slate-100 rounded text-right font-black font-mono text-base focus:ring-1 focus:ring-indigo-600 outline-none"
                        />
                      </div>

                      {/* Denomination Quick selectors */}
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {[1000, 2000, 5000, 10000, 20000, 50000].map(den => (
                          <button 
                            key={den}
                            type="button"
                            onClick={() => applyCashDenomination(den)}
                            className="text-[9px] font-mono px-2 py-1 bg-white hover:bg-slate-100 border border-slate-100 dark:border-slate-600 rounded"
                          >
                            ₦{den.toLocaleString()}
                          </button>
                        ))}
                      </div>

                      {/* Change Return calculation */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Balance Returned (Change):</span>
                        <span className={`font-mono font-black border-b border-dashed ${
                          cashReceivedInput >= totals.grandTotal ? 'text-green-600 text-sm' : 'text-slate-400'
                        }`}>
                          {formatNaira(totals.balance)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Checkout trigger */}
                  <button 
                    type="submit"
                    id="btn-cart-pay"
                    disabled={
                      cart.length === 0 || 
                      (paymentMethod === 'Cash' && cashReceivedInput < totals.grandTotal)
                    }
                    className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-xl flex items-center justify-center gap-2 shadow disabled:bg-slate-350 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    <Check className="w-5 h-5" /> Pay & Generate Receipt
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      ) : (
        /* PAST TRANSACTIONS ARCHIVE TABLE */
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4" id="history-panel">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-50">
            {/* Search items/receipt */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search Receipt Series / product..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white border-0 rounded-lg text-xs"
              />
            </div>

            {/* Date filter */}
            <input 
              type="date"
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white border-0 rounded-lg text-xs"
            />

            {/* Cashier filter */}
            <select 
              value={historyCashier}
              onChange={(e) => setHistoryCashier(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white border-0 rounded-lg text-xs"
            >
              <option value="All">All Cashiers</option>
              {uniqueCashiers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-300 font-bold border-b border-slate-100 text-xs uppercase tracking-tight">
                <tr>
                  <th className="p-4">Receipt Number</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Cashier</th>
                  <th className="p-4">Quantity Solid</th>
                  <th className="p-4">Products Sold Details</th>
                  <th className="p-4 font-mono">Grand Total</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-400">
                      No matching sales registers logged.
                    </td>
                  </tr>
                ) : (
                  [...filteredSales].sort((a,b) => b.receiptNumber.localeCompare(a.receiptNumber)).map(sale => (
                    <tr key={sale.id} className="hover:bg-slate-50/20 text-slate-700 dark:text-slate-200">
                      <td className="p-4 font-bold text-slate-900 dark:text-white font-mono">{sale.receiptNumber}</td>
                      <td className="p-4">{sale.date} • {sale.time}</td>
                      <td className="p-4">{sale.cashierName}</td>
                      <td className="p-4 text-center font-bold">{sale.totalQuantity} items</td>
                      <td className="p-4">
                        <div className="max-w-xs truncate" title={sale.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}>
                          {sale.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td className="p-4 font-black font-mono text-indigo-700 dark:text-indigo-400">{formatNaira(sale.grandTotal)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setActiveReceipt(sale)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded font-semibold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" /> View / Reprint
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW DIALOG MODAL (80mm Thermal Blueprint vs A4 format) */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
            {/* Header controls */}
            <div className="p-4 border-b bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold text-slate-600">Print Specifications Template:</span>
                <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-700 text-[10px] font-bold">
                  <button 
                    onClick={() => setPrintFormat('thermal')}
                    className={`px-2.5 py-1 ${printFormat === 'thermal' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                  >
                    Thermal 80mm
                  </button>
                  <button 
                    onClick={() => setPrintFormat('a4')}
                    className={`px-2.5 py-1 ${printFormat === 'a4' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                  >
                    A4 Page Format
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setActiveReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout Wrapper */}
            <div className="p-6 max-h-[550px] overflow-y-auto bg-slate-100 dark:bg-slate-900/40 flex justify-center">
              
              {printFormat === 'thermal' ? (
                /* THERMAL RECEIPT 80MM LAYOUT */
                <div 
                  id="thermal-receipt-preview"
                  className="w-[80mm] p-4 bg-white text-slate-900 shadow border border-slate-200 font-mono text-[10px] leading-tight space-y-4"
                >
                  {/* Header */}
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-black uppercase">ALHAJI IBRAHIM ENTERPRISES</h2>
                    <p className="text-[8px] text-slate-500">Cooking Gas Plant & General Store</p>
                    <p className="text-[8px] max-w-[200px] mx-auto text-slate-500">Plot 12, Lekki-Epe Expressway, Lagos State</p>
                    <p className="text-[8px] text-slate-500">Tel: +234 803 111 2222 / +234 812 345 6789</p>
                    <div className="border-t border-dashed border-slate-300 my-1 pt-1" />
                    <p className="font-bold text-xs">RETAIL SALES RECEIPT</p>
                  </div>

                  {/* Meta details */}
                  <div className="space-y-0.5 text-[8.5px]">
                    <div className="flex justify-between">
                      <span>Receipt No:</span>
                      <span className="font-bold">{activeReceipt.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date / Time:</span>
                      <span>{activeReceipt.date} • {activeReceipt.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cashier Name:</span>
                      <span>{activeReceipt.cashierName}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-300 my-1" />

                  {/* Items List */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-1 font-bold text-[8.5px] border-b border-slate-100 pb-1">
                      <span className="col-span-7">ITEM</span>
                      <span className="col-span-2 text-center">QTY</span>
                      <span className="col-span-3 text-right">TOTAL</span>
                    </div>
                    {activeReceipt.items.map(item => (
                      <div key={item.productId} className="grid grid-cols-12 gap-1 text-[8.5px] leading-snug">
                        <div className="col-span-7">
                          <p className="font-bold">{item.productName}</p>
                          <p className="text-[7.5px] text-slate-500">@{formatNaira(item.price)}</p>
                        </div>
                        <span className="col-span-2 text-center text-slate-600 px-1">{item.quantity}</span>
                        <span className="col-span-3 text-right font-black">{formatNaira(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-slate-300 my-1" />

                  {/* Totals calculations */}
                  <div className="space-y-1 text-[8.5px] font-bold">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatNaira(activeReceipt.subtotal)}</span>
                    </div>
                    {activeReceipt.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-{formatNaira(activeReceipt.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-black uppercase pt-1 border-t border-slate-200">
                      <span>GRAND TOTAL:</span>
                      <span>{formatNaira(activeReceipt.grandTotal)}</span>
                    </div>
                    
                    <div className="border-t border-dotted border-slate-200 my-1" />
                    
                    <div className="flex justify-between font-normal text-slate-500">
                      <span>Amount Received:</span>
                      <span>{formatNaira(activeReceipt.cashReceived)}</span>
                    </div>
                    <div className="flex justify-between font-normal text-slate-500">
                      <span>Adjusted Change:</span>
                      <span>{formatNaira(activeReceipt.balanceReturned)}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-300 my-1 pt-1" />

                  {/* Thank you note */}
                  <div className="text-center space-y-1 text-[8px] text-slate-500">
                    <p className="font-bold text-slate-800">💖 THANK YOU FOR YOUR CUSTOM!</p>
                    <p>Goods purchased in good condition are not returnable. For complaints, reach us on the hotline digits listed above.</p>
                    <p className="text-[7px] font-medium pt-1">Enterprise POS System v4.5.2</p>
                  </div>
                </div>
              ) : (
                /* A4 PAGE FORMAT */
                <div 
                  id="a4-receipt-preview"
                  className="w-full max-w-[210mm] p-8 bg-white text-slate-900 border shadow rounded"
                >
                  {/* Executive business layout */}
                  <div className="flex justify-between items-start border-b pb-6">
                    <div>
                      <h1 className="text-xl font-extrabold uppercase text-indigo-700">Ibrahim Corporate Stores</h1>
                      <p className="text-xs text-slate-500 mt-1">SBU Gas plant refilling station & General Provision Retail outlet</p>
                      <p className="text-xs text-slate-400 mt-1">Plot 12, Lekki-Epe Expressway, Lagos State, Nigeria</p>
                      <p className="text-xs text-slate-400">Lines: +234 803 111 2222 | ibrahim@stores-pos.ng</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 font-bold text-xs uppercase rounded bg-indigo-100 text-indigo-800">A4 Commercial Invoice</span>
                      <h3 className="text-sm font-bold mt-3 text-slate-500">INVOICE NO:</h3>
                      <h2 className="text-base font-black font-mono text-slate-800">{activeReceipt.receiptNumber}</h2>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-2 gap-4 py-6 text-xs border-b">
                    <div>
                      <h4 className="text-slate-400 uppercase tracking-wide font-semibold mb-1">Receipt Particulars:</h4>
                      <p>Date Generated: <span className="font-mono font-bold">{activeReceipt.date}</span></p>
                      <p>Time Locked: <span className="font-mono font-bold">{activeReceipt.time}</span></p>
                      <p>System Operator: <span className="font-bold">{activeReceipt.cashierName}</span></p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-slate-400 uppercase tracking-wide font-semibold mb-1">Company Details:</h4>
                      <p className="font-bold">Alhaji Ibrahim Enterprises Ltd</p>
                      <p>RC 982121 - Lekki-Epe depot, SBU 3</p>
                    </div>
                  </div>

                  {/* Table lists */}
                  <div className="py-6">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b font-extrabold text-slate-400 uppercase">
                          <th className="py-2">Line Product specifications</th>
                          <th className="py-2 text-right">Unit Sell Price</th>
                          <th className="py-2 text-center">Qty Purchased</th>
                          <th className="py-2 text-right">Line Total Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {activeReceipt.items.map(item => (
                          <tr key={item.productId} className="text-slate-700">
                            <td className="py-3">
                              <p className="font-black text-slate-900">{item.productName}</p>
                            </td>
                            <td className="py-3 text-right font-mono">{formatNaira(item.price)}</td>
                            <td className="py-3 text-center">{item.quantity}</td>
                            <td className="py-3 text-right font-mono font-bold">{formatNaira(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Checkout calculations */}
                  <div className="border-t pt-6 flex justify-end">
                    <div className="w-64 text-xs space-y-2">
                      <div className="flex justify-between text-slate-500">
                        <span>Invoice Subtotal:</span>
                        <span className="font-mono font-bold">{formatNaira(activeReceipt.subtotal)}</span>
                      </div>
                      {activeReceipt.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount Applied:</span>
                          <span className="font-mono font-bold">-{formatNaira(activeReceipt.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black border-t pt-2 text-slate-900">
                        <span>GRAND TOTAL (NGN):</span>
                        <span className="font-mono text-base text-indigo-700">{formatNaira(activeReceipt.grandTotal)}</span>
                      </div>
                      
                      <div className="border-t border-dashed pt-2 space-y-1 text-slate-400 text-[10px]">
                        <div className="flex justify-between">
                          <span>Amount Tendered:</span>
                          <span className="font-mono">{formatNaira(activeReceipt.cashReceived)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Change Settled:</span>
                          <span className="font-mono">{formatNaira(activeReceipt.balanceReturned)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 text-center border-t pt-6 text-[11px] text-slate-400">
                    <p className="font-black text-slate-600">ALHAJI IBRAHIM ENTERPRISES -- PREMIUM CUSTOMER CARE COOPERATIVE</p>
                    <p className="mt-1">Thanks for checking in! Goods verified sound on counter are non-refundable.</p>
                  </div>
                </div>
              )}

            </div>

            {/* Print and Actions footer */}
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <button 
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Cancel / Close
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Trigger System Print Dialog
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
