import { NavBar } from "../src/components/NavBar";
import { MainArticle } from "./components/MainArticle";

function App() {
  return (
    <div className="flex p-5 bg-red-700 min-h-screen">
      <NavBar />
      <MainArticle/>
    </div>
  );
}

export default App;
