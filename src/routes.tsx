import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import BaseLayout from "./containers/BaseLayout";
import PackingCases from "./pages/PackingCases";
import Palettes from "./pages/Palettes";
import ProductScanning from "./pages/ProductScanning";
import Scanning from "./pages/Scanning";

const routes: Route[] = [
  { path: "/product-packing/:id", element: <ProductScanning /> },
  { path: "/scanning", element: <Scanning /> },
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
