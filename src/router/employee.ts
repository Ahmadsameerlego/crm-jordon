export default [
  {
    path: "/employee/login",
    name: "EmployeeLogin",
    component: () => import("@/views/employee/LoginView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/employee",
    component: () => import("@/components/Employee/EmployeeLayout.vue"),
    meta: { requiresEmployeeAuth: true },
    children: [
      {
        path: "dashboard",
        name: "EmployeeDashboard",
        component: () => import("@/views/employee/DashboardView.vue"),
      },
      {
        path: "clients",
        name: "EmployeeClients",
        component: () => import("@/views/employee/ClientsView.vue"),
      },
      {
        path: "clients/:clientId/requests",
        name: "ClientRequests",
        component: () => import("@/views/employee/ClientRequestsView.vue"),
        props: true,
      },
      {
        path: "quotations",
        name: "ClientQuotations",
        component: () => import("@/views/employee/QuotationsView.vue"),
        props: true,
      },
      {
         path: "notifications",
          name: "Notifications",
          component: () => import("@/views/employee/NotificationsView.vue"),
          props: true,
      }

    ],
  },
];
