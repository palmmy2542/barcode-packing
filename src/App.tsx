import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RoutesWrapper from "./routes";

function App() {
  return (
    <>
      <BrowserRouter>
        <RoutesWrapper />
      </BrowserRouter>
    </>
  );
}

export default App;
