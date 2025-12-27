import { useState, useEffect, useRef, useMemo } from "react";
import { shortsData } from "../data/shortsData";

const defaultKeywords = [
  "강아지",
  "고양이",
  "자기개발",
  "마음의 위로",
  "이별",
  "사랑",
  "가족",
  "공포",
  "영화",
  "발라드 노래",
  "힙합",
  "EDM",
];

export const Shorts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [tempSelectedKeywords, setTempSelectedKeywords] = useState<Set<string>>(new Set());
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // localStorage에서 선택된 키워드와 커스텀 키워드 불러오기
  useEffect(() => {
    const savedKeywords = localStorage.getItem("selectedKeywords");
    const savedCustom = localStorage.getItem("customKeywords");
    
    if (savedKeywords) {
      try {
        const keywords = new Set<string>(JSON.parse(savedKeywords));
        setSelectedKeywords(keywords);
        setTempSelectedKeywords(keywords);
      } catch (error) {
        console.error("키워드 불러오기 실패:", error);
      }
    }
    
    if (savedCustom) {
      try {
        setCustomKeywords(JSON.parse(savedCustom));
      } catch (error) {
        console.error("커스텀 키워드 불러오기 실패:", error);
      }
    }
  }, []);

  // 선택된 키워드로 필터링된 숏츠
  const filteredShorts = useMemo(() => {
    if (selectedKeywords.size === 0) {
      return shortsData;
    }
    return shortsData.filter((shorts) =>
      shorts.keywords.some((keyword) => selectedKeywords.has(keyword))
    );
  }, [selectedKeywords]);

  // 모달 열 때 현재 선택된 키워드를 임시 선택으로 복사
  const handleOpenModal = () => {
    setTempSelectedKeywords(new Set(selectedKeywords));
    setShowKeywordModal(true);
  };

  // 키워드 토글 (모달 내에서만)
  const toggleKeyword = (keyword: string) => {
    setTempSelectedKeywords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyword)) {
        newSet.delete(keyword);
      } else {
        newSet.add(keyword);
      }
      return newSet;
    });
  };

  // 적용하기 버튼 클릭
  const handleApplyKeywords = () => {
    setSelectedKeywords(new Set(tempSelectedKeywords));
    localStorage.setItem("selectedKeywords", JSON.stringify(Array.from(tempSelectedKeywords)));
    setCurrentIndex(0); // 필터 변경 시 첫 번째로 이동
    setShowKeywordModal(false);
  };

  // 커스텀 키워드 추가
  const handleAddCustomKeyword = () => {
    if (newKeyword.trim() && !customKeywords.includes(newKeyword.trim())) {
      const updated = [...customKeywords, newKeyword.trim()];
      setCustomKeywords(updated);
      localStorage.setItem("customKeywords", JSON.stringify(updated));
      setNewKeyword("");
      setShowKeywordModal(false);
    }
  };

  // 커스텀 키워드 삭제
  const handleDeleteCustomKeyword = (keyword: string) => {
    const updated = customKeywords.filter((k) => k !== keyword);
    setCustomKeywords(updated);
    localStorage.setItem("customKeywords", JSON.stringify(updated));
    // 임시 선택된 키워드에서도 제거
    setTempSelectedKeywords((prev) => {
      const newSet = new Set(prev);
      newSet.delete(keyword);
      return newSet;
    });
  };

  // 비디오 재생 제어
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // 이전 비디오 일시정지
      videoRefs.current.forEach((video, idx) => {
        if (video && idx !== currentIndex) {
          video.pause();
        }
      });

      // 현재 비디오 재생 시도
      if (isPlaying && currentVideo) {
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // 재생 성공
            })
            .catch((error) => {
              // 모바일에서 자동재생이 차단된 경우
              console.log("자동재생 실패:", error);
              setIsPlaying(false);
            });
        }
      } else if (currentVideo) {
        currentVideo.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  // 스크롤 감지로 자동 전환
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const itemHeight = container.clientHeight;
        const newIndex = Math.round(scrollTop / itemHeight);

        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredShorts.length) {
          setCurrentIndex(newIndex);
        }
        isScrolling = false;
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, filteredShorts.length]);

  // 좋아요 토글
  const handleLike = (id: string) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 재생/일시정지 토글
  const togglePlay = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
        setIsPlaying(false);
      } else {
        // 모바일에서 음소거 해제 후 재생
        currentVideo.muted = false;
        currentVideo.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("재생 실패:", error);
            // 재생 실패 시 음소거로 재시도
            currentVideo.muted = true;
            currentVideo.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                setIsPlaying(false);
              });
          });
      }
    }
  };

  return (
    <div style={{ position: "relative", height: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 60px)" }}>
      {/* 키워드 선택 버튼 */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "12px" : "20px",
          left: isMobile ? "12px" : "20px",
          zIndex: 100,
        }}
      >
        <button
          onClick={handleOpenModal}
          style={{
            padding: isMobile ? "8px 12px" : "10px 20px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "4px" : "8px",
          }}
        >
          🏷️ {!isMobile && "키워드 선택"}
          {selectedKeywords.size > 0 && (
            <span
              style={{
                background: "#646cff",
                borderRadius: "10px",
                padding: "2px 6px",
                fontSize: isMobile ? "10px" : "12px",
              }}
            >
              {selectedKeywords.size}
            </span>
          )}
        </button>
      </div>

      {/* 키워드 모달 */}
      {showKeywordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowKeywordModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: isMobile ? "16px" : "20px",
              padding: isMobile ? "20px" : "30px",
              maxWidth: isMobile ? "95%" : "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: isMobile ? "20px" : "24px", color: "#333" }}>
                관심 키워드 선택
              </h2>
              <button
                onClick={() => {
                  setTempSelectedKeywords(new Set(selectedKeywords));
                  setShowKeywordModal(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            {/* 기본 키워드 */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ marginBottom: "15px", fontSize: isMobile ? "16px" : "18px", color: "#333" }}>
                기본 키워드
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? "6px" : "10px",
                }}
              >
                {defaultKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => toggleKeyword(keyword)}
                    style={{
                      padding: isMobile ? "8px 14px" : "10px 20px",
                      borderRadius: "20px",
                      border: "2px solid",
                      borderColor: tempSelectedKeywords.has(keyword) ? "#646cff" : "#ddd",
                      background: tempSelectedKeywords.has(keyword) ? "#646cff" : "white",
                      color: tempSelectedKeywords.has(keyword) ? "white" : "#333",
                      cursor: "pointer",
                      fontSize: isMobile ? "12px" : "14px",
                      fontWeight: tempSelectedKeywords.has(keyword) ? "bold" : "normal",
                      transition: "all 0.2s",
                    }}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 커스텀 키워드 */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ marginBottom: "15px", fontSize: isMobile ? "16px" : "18px", color: "#333" }}>
                내가 추가한 키워드 ({customKeywords.length}/5)
              </h3>
              {customKeywords.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  {customKeywords.map((keyword) => (
                    <div
                      key={keyword}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        background: tempSelectedKeywords.has(keyword) ? "#646cff" : "#f0f0f0",
                        color: tempSelectedKeywords.has(keyword) ? "white" : "#333",
                        border: "2px solid",
                        borderColor: tempSelectedKeywords.has(keyword) ? "#646cff" : "#ddd",
                      }}
                    >
                      <button
                        onClick={() => toggleKeyword(keyword)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "inherit",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: tempSelectedKeywords.has(keyword) ? "bold" : "normal",
                        }}
                      >
                        {keyword}
                      </button>
                      <button
                        onClick={() => handleDeleteCustomKeyword(keyword)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "inherit",
                          cursor: "pointer",
                          fontSize: "16px",
                          opacity: 0.7,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 키워드 추가 입력 */}
              {customKeywords.length < 5 && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddCustomKeyword();
                      }
                    }}
                    placeholder="키워드 입력 (최대 5개)"
                    style={{
                      flex: 1,
                      padding: "10px 15px",
                      borderRadius: "20px",
                      border: "2px solid #ddd",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleAddCustomKeyword}
                    disabled={!newKeyword.trim() || customKeywords.length >= 5}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "20px",
                      border: "none",
                      background: newKeyword.trim() && customKeywords.length < 5 ? "#646cff" : "#ccc",
                      color: "white",
                      cursor: newKeyword.trim() && customKeywords.length < 5 ? "pointer" : "not-allowed",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    추가
                  </button>
                </div>
              )}
            </div>

            {/* 버튼 영역 */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {/* 취소 */}
              <button
                onClick={() => {
                  setTempSelectedKeywords(new Set(selectedKeywords));
                  setShowKeywordModal(false);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #ddd",
                  background: "white",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                취소
              </button>

              {/* 선택 초기화 */}
              <button
                onClick={() => {
                  setTempSelectedKeywords(new Set());
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #ff6b6b",
                  background: "white",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                초기화
              </button>

              {/* 적용하기 */}
              <button
                onClick={handleApplyKeywords}
                style={{
                  flex: 2,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#646cff",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                적용하기 ({tempSelectedKeywords.size}개 선택됨)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 숏츠 목록 */}
      {filteredShorts.length === 0 ? (
        <div
          style={{
            height: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "white",
            flexDirection: "column",
            gap: "20px",
            padding: isMobile ? "20px" : "0",
          }}
        >
          <div style={{ fontSize: isMobile ? "36px" : "48px" }}>🔍</div>
          <div style={{ fontSize: isMobile ? "16px" : "20px", textAlign: "center" }}>선택한 키워드에 해당하는 숏츠가 없습니다</div>
          <button
            onClick={() => {
              setSelectedKeywords(new Set());
              localStorage.setItem("selectedKeywords", JSON.stringify([]));
            }}
            style={{
              padding: isMobile ? "10px 20px" : "12px 24px",
              borderRadius: "20px",
              border: "none",
              background: "#646cff",
              color: "white",
              cursor: "pointer",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "bold",
            }}
          >
            키워드 초기화
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            height: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 60px)",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            scrollBehavior: "smooth",
            background: "#000",
          }}
        >
          {filteredShorts.map((shorts, index) => {
            // 현재 보이는 비디오와 앞뒤 2개만 실제 로드 (지연 로딩)
            const shouldLoad = Math.abs(index - currentIndex) <= 2;
            const isCurrent = index === currentIndex;
            
            return (
              <div
                key={shorts.id}
                style={{
                  height: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 60px)",
                  scrollSnapAlign: "start",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#000",
                }}
              >
                {/* 비디오 */}
                {shouldLoad ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={shorts.videoUrl}
                    poster={shorts.thumbnail}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    loop
                    muted={!isCurrent}
                    playsInline
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    preload={isCurrent ? "auto" : "metadata"}
                    onClick={togglePlay}
                    onTouchStart={(e) => {
                      // 모바일 터치 이벤트
                      e.preventDefault();
                      togglePlay();
                    }}
                    onLoadedMetadata={() => {
                      // 비디오 메타데이터 로드 완료 시
                      if (isCurrent && isPlaying) {
                        const video = videoRefs.current[index];
                        if (video) {
                          video.play().catch(() => {
                            setIsPlaying(false);
                          });
                        }
                      }
                    }}
                  />
                ) : (
                  // 로드하지 않는 비디오는 썸네일만 표시
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${shorts.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "30px",
                      }}
                    >
                      ▶️
                    </div>
                  </div>
                )}

              {/* 오버레이 정보 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  padding: isMobile ? "12px" : "20px",
                  color: "white",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                }}
              >
                {/* 왼쪽: 작성자 정보 */}
                <div style={{ flex: 1, marginBottom: isMobile ? "12px" : "0" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? "8px" : "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <img
                      src={shorts.authorAvatar}
                      alt={shorts.author}
                      style={{
                        width: isMobile ? "32px" : "40px",
                        height: isMobile ? "32px" : "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: isMobile ? "14px" : "16px" }}>
                        {shorts.author}
                      </div>
                      <div style={{ fontSize: isMobile ? "12px" : "14px", opacity: 0.8 }}>
                        {shorts.views.toLocaleString()}회 조회
                      </div>
                    </div>
                  </div>
                  <h3 style={{ margin: "8px 0", fontSize: isMobile ? "16px" : "18px", fontWeight: "bold" }}>
                    {shorts.title}
                  </h3>
                  <p style={{ margin: "4px 0 8px 0", fontSize: isMobile ? "12px" : "14px", opacity: 0.9 }}>
                    {shorts.description}
                  </p>
                  {/* 키워드 태그 */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "4px" : "6px" }}>
                    {shorts.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        style={{
                          padding: isMobile ? "3px 8px" : "4px 10px",
                          borderRadius: "12px",
                          background: selectedKeywords.has(keyword)
                            ? "rgba(100, 108, 255, 0.8)"
                            : "rgba(255,255,255,0.2)",
                          fontSize: isMobile ? "10px" : "12px",
                          border: selectedKeywords.has(keyword) ? "1px solid #646cff" : "none",
                        }}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 오른쪽: 액션 버튼 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "center",
                    gap: isMobile ? "16px" : "20px",
                    marginLeft: isMobile ? "0" : "20px",
                    justifyContent: isMobile ? "center" : "flex-start",
                  }}
                >
                  {/* 좋아요 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleLike(shorts.id)}
                  >
                    <div
                      style={{
                        width: isMobile ? "44px" : "50px",
                        height: isMobile ? "44px" : "50px",
                        borderRadius: "50%",
                        background: liked.has(shorts.id) ? "#ff3040" : "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? "20px" : "24px",
                        marginBottom: isMobile ? "0" : "4px",
                        transition: "all 0.2s",
                      }}
                    >
                      {liked.has(shorts.id) ? "❤️" : "🤍"}
                    </div>
                    {!isMobile && (
                      <span style={{ fontSize: "12px" }}>
                        {(shorts.likes + (liked.has(shorts.id) ? 1 : 0)).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* 댓글 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "44px" : "50px",
                        height: isMobile ? "44px" : "50px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? "20px" : "24px",
                        marginBottom: isMobile ? "0" : "4px",
                      }}
                    >
                      💬
                    </div>
                    {!isMobile && (
                      <span style={{ fontSize: "12px" }}>
                        {shorts.comments.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* 공유 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "44px" : "50px",
                        height: isMobile ? "44px" : "50px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? "20px" : "24px",
                        marginBottom: isMobile ? "0" : "4px",
                      }}
                    >
                      📤
                    </div>
                  </div>
                </div>
              </div>

              {/* 재생/일시정지 아이콘 */}
              {!isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: isMobile ? "64px" : "80px",
                    height: isMobile ? "64px" : "80px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? "32px" : "40px",
                    cursor: "pointer",
                    zIndex: 10,
                    touchAction: "manipulation",
                  }}
                  onClick={togglePlay}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePlay();
                  }}
                >
                  ▶️
                </div>
              )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
