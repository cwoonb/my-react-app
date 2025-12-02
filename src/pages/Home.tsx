import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          🏠 홈
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#666",
            lineHeight: "1.6",
          }}
        >
          다양한 기능을 탐색해보세요
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        {/* 뉴스 카드 */}
        <Link
          to="/news"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              📰
            </div>
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "15px",
                color: "#333",
                textAlign: "center",
              }}
            >
              뉴스
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              카테고리별 뉴스를 확인하고 분석해보세요
            </p>
          </div>
        </Link>

        {/* 채팅 카드 */}
        <Link
          to="/chat"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              💬
            </div>
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "15px",
                color: "#333",
                textAlign: "center",
              }}
            >
              채팅
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              틴더처럼 새로운 사람들과 대화를 시작해보세요
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

