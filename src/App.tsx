import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home";
import { News } from "./pages/News";
import { Chat } from "./pages/Chat";
import { Shorts } from "./pages/Shorts";

function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/shorts" element={<Shorts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
