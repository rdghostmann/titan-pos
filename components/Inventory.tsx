"use client";
import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Boxes,
  FileText,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  Check,
  X,
  History,
  Trash2
} from 'lucide-react';
import { Product, StockLog, UserRole } from '@/types';
import { formatNaira } from '@/mockData';

interface InventoryProps {
  products: Product[];
  stockLogs: StockLog[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddStockLog: (log: StockLog) => void;
  currentRole: UserRole;
  currentUserName: string;
}

const CATEGORIES = [
  'Groceries',
  'Beverages',
  'Electronics',
  'Cosmetics',
  'Household Items',
  'Stationery',
  'Pharmaceuticals',
  'Services'
] as const;

export default function Inventory({
  products,
  stockLogs,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddStockLog,
  currentRole,
  currentUserName
}: InventoryProps) {
  const isAdmin = currentRole === 'Administrator';

  // State
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'logs'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low' | 'InStock' | 'OutOfStock'>('All');

  // Modals State
  const [productModal, setProductModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'edit';
    product?: Product;
  }>({ isOpen: false, type: 'add' });

  const [stockModal, setStockModal] = useState<{
    isOpen: boolean;
    product?: Product;
    type?: 'add' | 'reduce' | 'adjust';
  }>({ isOpen: false });

  // Product Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Groceries');
  const [formDesc, setFormDesc] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCost, setFormCost] = useState(0);
  const [formSell, setFormSell] = useState(0);
  const [formQty, setFormQty] = useState(0);
  const [formReorder, setFormReorder] = useState(10);
  const [formUnit, setFormUnit] = useState('Pcs');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  // Stock Adjustment internal states
  const [stockChangeQty, setStockChangeQty] = useState(1);
  const [stockNotes, setStockNotes] = useState('');

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm));

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'Low') {
        matchesStock = product.quantity < product.reorderLevel;
      } else if (stockFilter === 'InStock') {
        matchesStock = product.quantity >= product.reorderLevel && product.quantity > 0;
      } else if (stockFilter === 'OutOfStock') {
        matchesStock = product.quantity === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

  // Statistics
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.status === 'Active' && p.quantity < p.reorderLevel);
  }, [products]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
  }, [products]);

  const totalCostValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
  }, [products]);

  // Handle open add / edit modals
  const handleOpenProductModal = (type: 'add' | 'edit', prod?: Product) => {
    if (!isAdmin) return;
    if (type === 'edit' && prod) {
      setFormName(prod.name);
      setFormCategory(prod.category);
      setFormDesc(prod.description);
      setFormBarcode(prod.barcode || '');
      setFormCost(prod.costPrice);
      setFormSell(prod.sellingPrice);
      setFormQty(prod.quantity);
      setFormReorder(prod.reorderLevel);
      setFormUnit(prod.unitType);
      setFormStatus(prod.status);
      setProductModal({ isOpen: true, type: 'edit', product: prod });
    } else {
      setFormName('');
      setFormCategory('Groceries');
      setFormDesc('');
      setFormBarcode('');
      setFormCost(0);
      setFormSell(0);
      setFormQty(0);
      setFormReorder(10);
      setFormUnit('Pcs');
      setFormStatus('Active');
      setProductModal({ isOpen: true, type: 'add' });
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!formName.trim() || formCost < 0 || formSell < 0 || formQty < 0) {
      alert('Kindly fill in all fields with valid values.');
      return;
    }

    const isoDate = new Date().toISOString();

    if (productModal.type === 'add') {
      const newId = 'p_' + Math.random().toString(36).substr(2, 9);
      const newProduct: Product = {
        id: newId,
        name: formName,
        category: formCategory,
        description: formDesc,
        barcode: formBarcode || undefined,
        costPrice: Number(formCost),
        sellingPrice: Number(formSell),
        quantity: Number(formQty),
        reorderLevel: Number(formReorder),
        unitType: formUnit,
        status: formStatus,
        dateAdded: isoDate,
        lastUpdated: isoDate
      };

      onAddProduct(newProduct);

      // Create Stock Log
      const logId = 'log_' + Math.random().toString(36).substr(2, 9);
      const newLog: StockLog = {
        id: logId,
        productId: newId,
        productName: formName,
        prevQuantity: 0,
        newQuantity: Number(formQty),
        quantityChanged: Number(formQty),
        actionType: 'Creation',
        adminName: currentUserName,
        date: isoDate
      };
      onAddStockLog(newLog);

    } else if (productModal.type === 'edit' && productModal.product) {
      const prevQty = productModal.product.quantity;
      const updatedProduct: Product = {
        ...productModal.product,
        name: formName,
        category: formCategory,
        description: formDesc,
        barcode: formBarcode || undefined,
        costPrice: Number(formCost),
        sellingPrice: Number(formSell),
        quantity: Number(formQty),
        reorderLevel: Number(formReorder),
        unitType: formUnit,
        status: formStatus,
        lastUpdated: isoDate
      };

      onUpdateProduct(updatedProduct);

      // Log qty difference if changed
      if (prevQty !== Number(formQty)) {
        const diff = Number(formQty) - prevQty;
        const logId = 'log_' + Math.random().toString(36).substr(2, 9);
        const newLog: StockLog = {
          id: logId,
          productId: productModal.product.id,
          productName: formName,
          prevQuantity: prevQty,
          newQuantity: Number(formQty),
          quantityChanged: diff,
          actionType: 'Adjustment',
          adminName: currentUserName,
          date: isoDate
        };
        onAddStockLog(newLog);
      }
    }

    setProductModal({ isOpen: false, type: 'add' });
  };

  const handleOpenStockModal = (prod: Product, type: 'add' | 'reduce' | 'adjust') => {
    if (!isAdmin) return;
    setStockChangeQty(1);
    setStockNotes('');
    setStockModal({ isOpen: true, product: prod, type });
  };

  const handleSaveStockChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !stockModal.product) return;

    const prod = stockModal.product;
    const changeAmount = Number(stockChangeQty);
    if (changeAmount <= 0) {
      alert('Stock change quantity must be greater than zero.');
      return;
    }

    let prevQty = prod.quantity;
    let newQty = prevQty;
    let action: StockLog['actionType'] = 'Adjustment';

    if (stockModal.type === 'add') {
      newQty = prevQty + changeAmount;
      action = 'Addition';
    } else if (stockModal.type === 'reduce') {
      newQty = Math.max(0, prevQty - changeAmount);
      action = 'Reduction';
    } else {
      // Direct adjustment
      newQty = changeAmount;
      action = 'Adjustment';
    }

    const isoDate = new Date().toISOString();
    const updatedProd: Product = {
      ...prod,
      quantity: newQty,
      lastUpdated: isoDate
    };

    onUpdateProduct(updatedProd);

    // Create log
    const logId = 'log_' + Math.random().toString(36).substr(2, 9);
    const newLog: StockLog = {
      id: logId,
      productId: prod.id,
      productName: prod.name,
      prevQuantity: prevQty,
      newQuantity: newQty,
      quantityChanged: action === 'Reduction' ? -changeAmount : (action === 'Addition' ? changeAmount : newQty - prevQty),
      actionType: action,
      adminName: currentUserName,
      date: isoDate
    };
    onAddStockLog(newLog);

    setStockModal({ isOpen: false });
  };

  return (
    <div className="space-y-6" id="inventory-container">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-indigo-600" />
            General Retail Inventory Management
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            Store and stock tracking. Register new products, adjust store levels, and view reorder alarms.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          {isAdmin && (
            <button
              id="btn-add-product"
              onClick={() => handleOpenProductModal('add')}
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* TOTAL PRODUCTS */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-lg">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Active Products</span>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
              {products.filter(p => p.status === 'Active').length}
            </p>
          </div>
        </div>

        {/* LOW STOCK ALERT CARDS */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
          <div className={`p-3 rounded-lg ${lowStockProducts.length > 0 ? 'bg-red-50 dark:bg-red-950 text-red-600' : 'bg-green-50 dark:bg-green-950 text-green-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Low Stock Alerts</span>
            <p className={`text-xl font-bold mt-0.5 ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>
              {lowStockProducts.length}
            </p>
          </div>
        </div>

        {/* SELLING VALUE */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Retail Value</span>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
              {formatNaira(totalInventoryValue)}
            </p>
          </div>
        </div>

        {/* COST VALUE */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-lg">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium font-mono">Inventory Cost Basis</span>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
              {formatNaira(totalCostValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Red Alarm panel for Low Stocks */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">⚠ CRITICAL LOW STOCK WARNINGS</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map(prod => (
              <div key={prod.id} className="p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-xs flex items-center justify-between border border-red-100 dark:border-red-900/30 text-xs text-slate-800 dark:text-slate-300">
                <div className="truncate">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{prod.name}</p>
                  <p className="text-slate-500">Qty remaining: <span className="font-bold text-red-600">{prod.quantity} {prod.unitType}</span> (Reorder: {prod.reorderLevel})</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleOpenStockModal(prod, 'add')}
                    className="px-2 py-1 text-[10px] uppercase font-bold tracking-tight bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded hover:bg-red-200 transition"
                  >
                    Restock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Sub Tabs for Products vs Logs */}
      <div className="flex border-b border-slate-100 dark:border-slate-700/50">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${activeSubTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Active Products Registry ({filteredProducts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${activeSubTab === 'logs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          <History className="w-4 h-4" /> Stock Adjustment Logs ({stockLogs.length})
        </button>
      </div>

      {activeSubTab === 'products' ? (
        <div className="space-y-4" id="products-registry-pane">
          {/* Filtering and Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-slate-700/50">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by Name, Barcode, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Stock Level Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Stock Levels</option>
              <option value="Low">Low Stock Alerts (&lt; Reorder)</option>
              <option value="InStock">Available / Healthy</option>
              <option value="OutOfStock">Out Of Stock (0 items)</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-700/40 text-xs uppercase tracking-tight">
                  <tr>
                    <th className="p-4">Product Name / Barcode</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Prices (Cost / Sell)</th>
                    <th className="p-4 text-center">Available Stock</th>
                    <th className="p-4">Reorder Min</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-slate-400 font-medium">
                        No product matches found in this criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => {
                      const isLowStock = product.quantity < product.reorderLevel;
                      const isOutOfStock = product.quantity === 0;

                      return (
                        <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 text-slate-700 dark:text-slate-200">
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                              {product.barcode && (
                                <p className="font-mono text-[10px] text-slate-400 mt-0.5">BC: {product.barcode}</p>
                              )}
                              <p className="text-xs text-slate-400 mt-0.5 max-w-sm truncate">{product.description}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                              {product.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs">
                            <p className="text-slate-400" title="Cost Price">Cost: {formatNaira(product.costPrice)}</p>
                            <p className="font-bold text-slate-900 dark:text-white" title="Selling Price">Sell: {formatNaira(product.sellingPrice)}</p>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`px-3 py-1 text-sm font-bold rounded-lg ${isOutOfStock
                                  ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                                  : isLowStock
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 animate-pulse'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                                }`}>
                                {product.quantity} {product.unitType}
                              </span>
                              {isOutOfStock && <span className="text-[10px] text-red-500 font-bold mt-1">Out of Stock</span>}
                              {isLowStock && !isOutOfStock && <span className="text-[10px] text-rose-500 font-bold mt-1">⚠️ Low Stock Alert</span>}
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
                            {product.reorderLevel} {product.unitType}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {/* Stock actions (Admin Only) */}
                              {isAdmin ? (
                                <>
                                  <button
                                    title="Add Stock (+)"
                                    onClick={() => handleOpenStockModal(product, 'add')}
                                    className="p-1 px-2.5 text-xs bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded hover:bg-indigo-100 transition"
                                  >
                                    + Add
                                  </button>
                                  <button
                                    title="Reduce Stock (-)"
                                    onClick={() => handleOpenStockModal(product, 'reduce')}
                                    className="p-1 px-2.5 text-xs bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded hover:bg-amber-100 transition"
                                  >
                                    - Red
                                  </button>
                                  <button
                                    title="Edit Product Details"
                                    onClick={() => handleOpenProductModal('edit', product)}
                                    className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 transition"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    title="Delete product catalog"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${product.name} from inventory?`)) {
                                        onDeleteProduct(product.id);
                                      }
                                    }}
                                    className="p-1.5 bg-red-50 dark:bg-red-950/50 text-red-500 rounded hover:bg-red-100 transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No permission</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Logs Sub-tab view */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Audit Trail: Stock Adjustments History</h3>
            <span className="text-xs text-slate-400">Chronological list of additions, redemptions & adjustments</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-700/40 text-xs uppercase tracking-tight">
                <tr>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4 text-center">Previous Qty</th>
                  <th className="p-4 text-center">Quantity Changed</th>
                  <th className="p-4 text-center">New Quantity</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Issued By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-mono text-xs">
                {stockLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-400 font-normal">
                      No stock log reports compiled yet.
                    </td>
                  </tr>
                ) : (
                  [...stockLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => {
                    const isPositive = log.quantityChanged > 0;
                    const isCreation = log.actionType === 'Creation';

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/20 text-slate-700 dark:text-slate-200">
                        <td className="p-4 font-sans text-slate-400">
                          {new Date(log.date).toLocaleString('en-NG')}
                        </td>
                        <td className="p-4 font-sans font-bold text-slate-900 dark:text-white">
                          {log.productName}
                        </td>
                        <td className="p-4 text-center text-slate-400">
                          {log.prevQuantity}
                        </td>
                        <td className={`p-4 text-center font-bold ${isCreation
                            ? 'text-indigo-600'
                            : isPositive
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                          {isPositive ? `+${log.quantityChanged}` : log.quantityChanged}
                        </td>
                        <td className="p-4 text-center font-bold">
                          {log.newQuantity}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${log.actionType === 'Addition'
                              ? 'bg-green-100 text-green-800'
                              : log.actionType === 'Reduction'
                                ? 'bg-red-100 text-red-00'
                                : log.actionType === 'Creation'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}>
                            {log.actionType}
                          </span>
                        </td>
                        <td className="p-4 font-sans text-slate-500">
                          {log.adminName}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Product Add / Edit Modal */}
      {productModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-700/40">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {productModal.type === 'add' ? '✨ Add New Retail Product' : '✏️ Edit Product Specifications'}
              </h3>
              <button
                onClick={() => setProductModal({ isOpen: false, type: 'add' })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milo Chocolate Refill 400g"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Unit Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pack, Bottle, Pcs, Bag"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief explanation of the inventory item size, brand, etc."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">UPC / Barcode (Optional)</label>
                <input
                  type="text"
                  placeholder="Scan or type barcode"
                  value={formBarcode}
                  onChange={(e) => setFormBarcode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm font-mono font-bold"
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Cost Price (₦)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formCost}
                    onChange={(e) => setFormCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Selling Price (₦)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formSell}
                    onChange={(e) => setFormSell(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm font-mono"
                  />
                </div>
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Qty Available</label>
                  <input
                    type="number"
                    required
                    min={0}
                    disabled={productModal.type === 'edit'} // Restrict direct quantity edit in form, force stock logs!
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm font-mono disabled:opacity-55"
                  />
                  {productModal.type === 'edit' && (
                    <span className="text-[10px] text-slate-400">Use addition/reduction buttons in registry to alter quantity.</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Reorder Level Alarm</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formReorder}
                    onChange={(e) => setFormReorder(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm font-mono"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                    /> Active
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'Inactive'}
                      onChange={() => setFormStatus('Inactive')}
                    /> Inactive
                  </label>
                </div>
              </div>

              {/* Save Controls */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setProductModal({ isOpen: false, type: 'add' })}
                  className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Stock adjustments (Add / Reduce / Adjust) */}
      {stockModal.isOpen && stockModal.product && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-700/40 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white">
                {stockModal.type === 'add' ? `📈 Restock: ${stockModal.product.name}` : `📉 Reduce: ${stockModal.product.name}`}
              </h3>
              <button
                onClick={() => setStockModal({ isOpen: false })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveStockChange} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>Current Quantity: <span className="font-bold text-slate-900 dark:text-white">{stockModal.product.quantity} {stockModal.product.unitType}</span></p>
                <p>Cost Basis: <span className="font-bold italic">{formatNaira(stockModal.product.costPrice)}</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">
                  {stockModal.type === 'add' ? 'Quantity to Add / Restock' : 'Quantity to Deduct / Reduce'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stockChangeQty}
                  onChange={(e) => setStockChangeQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-tight text-slate-500 mb-1">Reason / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Monthly batch restocking, damage disposal"
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setStockModal({ isOpen: false })}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition ${stockModal.type === 'add' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
