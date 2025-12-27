import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navigation = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        padding: isMobile ? "10px 4px" : "12px 8px",
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? "4px" : "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: "none",
            color: location.pathname === item.path ? "#646cff" : "white",
            padding: isMobile ? "8px 4px" : "8px 12px",
            borderRadius: "8px",
            background: location.pathname === item.path ? "rgba(100, 108, 255, 0.2)" : "transparent",
            transition: "all 0.2s",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "4px" : "6px",
            flex: "1 1 0",
            justifyContent: "center",
            minWidth: 0,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <span style={{ fontSize: isMobile ? "20px" : "18px" }}>{item.icon}</span>
          {!isMobile && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
};

