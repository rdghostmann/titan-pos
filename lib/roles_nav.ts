// lib/roles_nav.ts - Defines the navigation structure for different user roles in the application.

export const roleNavMain = {
  admin: [
    { id: "overview", title: "Overview", icon: "📊", url: "/admin" },
    { id: "users", title: "Users", icon: "�", url: "/admin/users" },
    { id: "suppliers", title: "Suppliers", icon: "🏦", url: "/admin/suppliers" },
    { id: "products-catalog", title: "Product Catalog", icon: "�", url: "/admin/products" },
    { id: "all-orders", title: "All Orders", icon: "�", url: "/admin/all-orders" },
  ],
  cashier: [
    { id: "overview", title: "Overview", icon: "📊", url: "/cashier" },
    { id: "sales", title: "Sales", icon: "�", url: "/cashier/sales" },
    { id: "returns", title: "Returns", icon: "�", url: "/cashier/returns" },
    { id: "reports", title: "Reports", icon: "�", url: "/cashier/reports" },
  ],

}