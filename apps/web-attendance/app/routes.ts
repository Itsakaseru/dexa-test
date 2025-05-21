import { type RouteConfig, index, prefix, layout, route } from "@react-router/dev/routes";

export default [
  index("home/index.tsx"),
  route("/login", "login/index.tsx"),
  layout("layout/default.tsx", [
    ...prefix("dashboard", [
      index("dashboard/index.tsx")
    ]),
    ...prefix("employee", [
      index("employee/index.tsx"),
      route("/create", "employee/create/index.tsx"),
      route("/edit/:id", "employee/edit/index.tsx")
    ]),
    ...prefix("attendance", [
      index("attendance/index.tsx"),
      route("/:id", "attendance/[id]/index.tsx"),
    ])
  ])
] satisfies RouteConfig;
