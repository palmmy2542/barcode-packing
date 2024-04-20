import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RoutesWrapper from "./routes";
import PackingProvider from "./contexts/PackingProvider/PackingProvider";

function App() {
  return (
    <>
      <BrowserRouter>
        <PackingProvider>
          <RoutesWrapper />
        </PackingProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
