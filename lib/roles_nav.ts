// lib/roleNavMain.ts

export type NavItem = {
  id: string;
  title: string;
  icon: string;
  url: string;
};

export const roleNavMain: Record<string, NavItem[]> = {
  admin: [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "📊",
      url: "/admin",
    },

    {
      id: "gas-plant",
      title: "Cooking Gas Plant",
      icon: "⛽",
      url: "/admin/cooking-gas-plant",
    },
    {
      id: "car-wash",
      title: "Car Wash Center",
      icon: "🚘",
      url: "/admin/car-wash-center",
    },
    {
      id: "retail",
      title: "Provision Retail",
      icon: "🛒",
      url: "/admin/provision-retail",
    },
    {
      id: "inventory",
      title: "Stores Inventory",
      icon: "📦",
      url: "/admin/inventory",
    },
    {
      id: "financial-audits",
      title: "Financial Audits",
      icon: "💰",
      url: "/admin/financial-audits",
    },
    {
      id: "excel",
      title: "Excel Integration",
      icon: "📄",
      url: "/admin/excel",
    },
    {
      id: "User Management",
      title: "User Management",
      icon: "👨🏿‍🤝‍👨🏼",
      url: "/admin/users-management",
    },
  ],

  cashier: [
    {
      id: "retail",
      title: "Provision Retail",
      icon: "🛒",
      url: "/cashier/provision-retail",
    },
    {
      id: "gas-plant",
      title: "Cooking Gas Plant",
      icon: "⛽",
      url: "/cashier/cooking-gas-plant",
    },
    {
      id: "car-wash",
      title: "Car Wash Center",
      icon: "🚘",
      url: "/cashier/car-wash-center",
    },
    {
      id: "excel",
      title: "Excel Integration",
      icon: "📄",
      url: "/cashier/excel",
    },
  ],

};