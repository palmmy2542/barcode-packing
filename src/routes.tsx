import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import BaseLayout from "./containers/BaseLayout";
import PackingCases from "./pages/PackingCases";
import Palettes from "./pages/Palettes";

const routes: Route[] = [
  { path: "/", element: <Products /> },
  { path: "cases", element: <PackingCases /> },
  { path: "palettes", element: <Palettes /> },
];

const RoutesWrapper = () => {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        {routes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Route>
    </Routes>
  );
};

export default RoutesWrapper;
