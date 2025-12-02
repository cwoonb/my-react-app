import { useState, useMemo } from "react";
import { newsData } from "../data/newsData";
import type { NewsCategory } from "../types";

export const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

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
        padding: "40px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "30px",
          color: "#333",
        }}
      >
        📰 뉴스 분석
      </h1>

      {/* 카테고리 필터 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedCategory("전체")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: selectedCategory === "전체" ? "#646cff" : "#f0f0f0",
            color: selectedCategory === "전체" ? "white" : "#333",
            cursor: "pointer",
            fontSize: "14px",
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
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: selectedCategory === category.name ? category.color : "#f0f0f0",
              color: selectedCategory === category.name ? "white" : "#333",
              cursor: "pointer",
              fontSize: "14px",
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
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            선택된 뉴스 수
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>
            {filteredNews.length}개
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            평균 조회수
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#646cff" }}>
            {categoryStats.avgViews}
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            평균 좋아요
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff6b6b" }}>
            {categoryStats.avgLikes}
          </div>
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {filteredNews.map((news) => (
          <div
            key={news.id}
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
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
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginLeft: "12px",
                }}
              >
                {news.category}
              </span>
            </div>
            <p
              style={{
                fontSize: "16px",
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
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                color: "#999",
              }}
            >
              <span>{news.date}</span>
              <div style={{ display: "flex", gap: "16px" }}>
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

