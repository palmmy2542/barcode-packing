import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import PackingProvider from "./contexts/PackingProvider/PackingProvider";
import "./firebase";
import RoutesWrapper from "./routes";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <PackingProvider>
          <RoutesWrapper />
        </PackingProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
