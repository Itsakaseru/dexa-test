import { type RouteConfig, index, prefix, layout } from "@react-router/dev/routes";

export default [
  index("home/index.tsx"),
  layout("layout/default.tsx", [
    ...prefix("dashboard", [
      index("dashboard/index.tsx")
    ]),
    ...prefix("employee", [
      index("employee/index.tsx")
    ]),
  ])
] satisfies RouteConfig;
