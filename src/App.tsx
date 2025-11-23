import "./App.css";

function App() {
  return (
    <div style={{ padding: "40px", color: "#fff", textAlign: "center" }}>
      <h1>Junho의 첫 번째 React 페이지 🎉</h1>
      <p style={{ fontSize: "18px", marginTop: "10px" }}>
        이제부터 너만의 React 프로젝트를 만들어보자!
      </p>

      <div style={{ marginTop: "40px" }}>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "8px",
            background: "#646cff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => alert("React 시작 축하해 🎉")}
        >
          클릭해봐!
        </button>
      </div>
    </div>
  );
}

export default App;
