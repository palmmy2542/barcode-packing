import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar";

interface BaseLayoutProps {
  children?: JSX.Element;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return <SideBar main={children ?? <Outlet />} />;
};

export default BaseLayout;
