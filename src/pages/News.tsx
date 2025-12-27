import { useState, useMemo, useEffect } from "react";
import { newsData } from "../data/newsData";
import type { NewsCategory } from "../types";

export const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 카테고리별 통계 계산
  const categories: NewsCategory[] = useMemo(() => {
    const categoryMap = new Map<string, { count: number; views: number; likes: number }>();
    
    newsData.forEach((news) => {
      const existing = categoryMap.get(news.category) || { count: 0, views: 0, likes: 0 };
      categoryMap.set(news.category, {
        count: existing.count + 1,
        views: existing.views + news.views,
        likes: existing.likes + news.likes,
      });
    });

    const colors = ["#646cff", "#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181", "#aa96da"];
    let colorIndex = 0;

    return Array.from(categoryMap.entries()).map(([name, stats]) => ({
      name,
      count: stats.count,
      color: colors[colorIndex++ % colors.length],
    }));
  }, []);

  // 선택된 카테고리로 필터링
  const filteredNews = useMemo(() => {
    if (selectedCategory === "전체") {
      return newsData;
    }
    return newsData.filter((news) => news.category === selectedCategory);
  }, [selectedCategory]);

  // 카테고리별 평균 조회수와 좋아요 계산
  const categoryStats = useMemo(() => {
    if (selectedCategory === "전체") {
      const totalViews = newsData.reduce((sum, news) => sum + news.views, 0);
      const totalLikes = newsData.reduce((sum, news) => sum + news.likes, 0);
      return {
        avgViews: Math.round(totalViews / newsData.length),
        avgLikes: Math.round(totalLikes / newsData.length),
      };
    }
    const categoryNews = newsData.filter((news) => news.category === selectedCategory);
    const totalViews = categoryNews.reduce((sum, news) => sum + news.views, 0);
    const totalLikes = categoryNews.reduce((sum, news) => sum + news.likes, 0);
    return {
      avgViews: Math.round(totalViews / categoryNews.length),
      avgLikes: Math.round(totalLikes / categoryNews.length),
    };
  }, [selectedCategory]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "20px 0" : "40px 20px",
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? "28px" : "36px",
          marginBottom: isMobile ? "20px" : "30px",
          color: "#333",
          padding: isMobile ? "0 8px" : "0",
        }}
      >
        📰 뉴스 분석
      </h1>

      {/* 카테고리 필터 */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? "6px" : "10px",
          marginBottom: isMobile ? "20px" : "30px",
          flexWrap: "wrap",
          padding: isMobile ? "0 8px" : "0",
        }}
      >
        <button
          onClick={() => setSelectedCategory("전체")}
          style={{
            padding: isMobile ? "8px 12px" : "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: selectedCategory === "전체" ? "#646cff" : "#f0f0f0",
            color: selectedCategory === "전체" ? "white" : "#333",
            cursor: "pointer",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: selectedCategory === "전체" ? "bold" : "normal",
            transition: "all 0.2s",
          }}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            style={{
              padding: isMobile ? "8px 12px" : "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: selectedCategory === category.name ? category.color : "#f0f0f0",
              color: selectedCategory === category.name ? "white" : "#333",
              cursor: "pointer",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: selectedCategory === category.name ? "bold" : "normal",
              transition: "all 0.2s",
            }}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* 통계 카드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
          gap: isMobile ? "12px" : "20px",
          marginBottom: isMobile ? "24px" : "40px",
          padding: isMobile ? "0 8px" : "0",
        }}
      >
        <div
          style={{
            background: "white",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#666", marginBottom: "8px" }}>
            선택된 뉴스 수
          </div>
          <div style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", color: "#333" }}>
            {filteredNews.length}개
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#666", marginBottom: "8px" }}>
            평균 조회수
          </div>
          <div style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", color: "#646cff" }}>
            {categoryStats.avgViews}
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#666", marginBottom: "8px" }}>
            평균 좋아요
          </div>
          <div style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", color: "#ff6b6b" }}>
            {categoryStats.avgLikes}
          </div>
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div
        style={{
          display: "grid",
          gap: isMobile ? "12px" : "20px",
          padding: isMobile ? "0 8px" : "0",
        }}
      >
        {filteredNews.map((news) => (
          <div
            key={news.id}
            style={{
              background: "white",
              padding: isMobile ? "16px" : "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "flex-start",
                marginBottom: "12px",
                gap: isMobile ? "8px" : "0",
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  margin: 0,
                  color: "#333",
                  flex: 1,
                }}
              >
                {news.title}
              </h2>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: categories.find((c) => c.name === news.category)?.color || "#646cff",
                  color: "white",
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: "bold",
                  marginLeft: isMobile ? "0" : "12px",
                  alignSelf: isMobile ? "flex-start" : "auto",
                }}
              >
                {news.category}
              </span>
            </div>
            <p
              style={{
                fontSize: isMobile ? "14px" : "16px",
                color: "#666",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}
            >
              {news.content}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                fontSize: isMobile ? "12px" : "14px",
                color: "#999",
                gap: isMobile ? "8px" : "0",
              }}
            >
              <span>{news.date}</span>
              <div style={{ display: "flex", gap: isMobile ? "12px" : "16px" }}>
                <span>👁️ {news.views}</span>
                <span>❤️ {news.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

