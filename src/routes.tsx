import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import BaseLayout from "./containers/BaseLayout";

const routes: Route[] = [{ path: "/", element: <Products /> }];

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
