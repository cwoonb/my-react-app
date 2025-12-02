import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "홈", icon: "🏠" },
    { path: "/news", label: "뉴스", icon: "📰" },
    { path: "/chat", label: "채팅", icon: "💬" },
    { path: "/shorts", label: "숏츠", icon: "🎬" },
  ];

  return (
    <nav
      style={{
        background: "#222",
        color: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: "none",
            color: location.pathname === item.path ? "#646cff" : "white",
            padding: "10px 20px",
            borderRadius: "8px",
            background: location.pathname === item.path ? "rgba(100, 108, 255, 0.2)" : "transparent",
            transition: "all 0.2s",
            fontSize: "16px",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

