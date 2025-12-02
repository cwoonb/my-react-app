import { useState, useEffect, useRef } from "react";
import { chatProfiles } from "../data/chatProfiles";
import type { ChatProfile, ChatMessage } from "../types";

export const Chat = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matchedProfiles, setMatchedProfiles] = useState<ChatProfile[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentProfile = chatProfiles[currentProfileIndex];

  // 스와이프 처리
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      // 좋아요 - 매칭된 프로필에 추가
      setMatchedProfiles((prev) => [...prev, currentProfile]);
    }
    // 다음 프로필로 이동
    if (currentProfileIndex < chatProfiles.length - 1) {
      setCurrentProfileIndex((prev) => prev + 1);
    } else {
      // 모든 프로필을 다 본 경우
      setCurrentProfileIndex(0);
    }
  };

  // 매칭된 프로필 선택
  const handleSelectProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    // 저장된 채팅 불러오기
    const stored = localStorage.getItem(`chat_${profileId}`);
    if (stored) {
      try {
        setCurrentChat(JSON.parse(stored));
      } catch (error) {
        console.error("채팅 불러오기 실패:", error);
        setCurrentChat([]);
      }
    } else {
      setCurrentChat([]);
    }
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedProfileId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      profileId: selectedProfileId,
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleString("ko-KR"),
      isFromMe: true,
    };

    const updatedChat = [...currentChat, newMessage];
    setCurrentChat(updatedChat);
    localStorage.setItem(`chat_${selectedProfileId}`, JSON.stringify(updatedChat));
    setInputMessage("");

    // 자동 응답 (시뮬레이션)
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        profileId: selectedProfileId,
        text: "좋은 말이에요! 😊",
        timestamp: new Date().toLocaleString("ko-KR"),
        isFromMe: false,
      };
      const finalChat = [...updatedChat, autoReply];
      setCurrentChat(finalChat);
      localStorage.setItem(`chat_${selectedProfileId}`, JSON.stringify(finalChat));
    }, 1000);
  };

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  // 키보드 이벤트
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* 프로필 카드 영역 */}
      {!selectedProfileId && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          {currentProfile && (
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                position: "relative",
              }}
            >
              {/* 프로필 이미지 */}
              <div
                style={{
                  width: "100%",
                  height: "500px",
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={currentProfile.image}
                  alt={currentProfile.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    padding: "30px 20px 20px",
                    color: "white",
                  }}
                >
                  <h2 style={{ fontSize: "32px", margin: "0 0 8px 0" }}>
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <p style={{ fontSize: "16px", margin: "0 0 16px 0", lineHeight: "1.5" }}>
                    {currentProfile.bio}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {currentProfile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "6px 12px",
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "20px",
                          fontSize: "14px",
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  padding: "20px",
                  background: "white",
                }}
              >
                <button
                  onClick={() => handleSwipe("left")}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#ff6b6b",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255,107,107,0.4)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  ✕
                </button>
                <button
                  onClick={() => handleSwipe("right")}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#4ecdc4",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(78,205,196,0.4)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  ❤️
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 채팅 영역 */}
      {selectedProfileId ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* 채팅 헤더 */}
          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={matchedProfiles.find((p) => p.id === selectedProfileId)?.image}
                alt="profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>
                  {matchedProfiles.find((p) => p.id === selectedProfileId)?.name}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#999" }}>온라인</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedProfileId(null)}
              style={{
                padding: "8px 16px",
                background: "#f0f0f0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              뒤로
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "#f8f9fa",
            }}
          >
            {currentChat.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  padding: "40px",
                }}
              >
                <p>첫 메시지를 보내보세요! 👋</p>
              </div>
            ) : (
              currentChat.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: "flex",
                    justifyContent: message.isFromMe ? "flex-end" : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "18px",
                      background: message.isFromMe ? "#646cff" : "white",
                      color: message.isFromMe ? "white" : "#333",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.4" }}>
                      {message.text}
                    </p>
                    <span
                      style={{
                        fontSize: "11px",
                        opacity: 0.7,
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div
            style={{
              padding: "20px",
              background: "white",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "24px",
                border: "1px solid #e0e0e0",
                fontSize: "15px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={{
                padding: "12px 24px",
                borderRadius: "24px",
                border: "none",
                background: inputMessage.trim() ? "#646cff" : "#ccc",
                color: "white",
                cursor: inputMessage.trim() ? "pointer" : "not-allowed",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              전송
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "300px",
            background: "white",
            borderLeft: "1px solid #e0e0e0",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px", color: "#333" }}>
            매칭된 사람들 ({matchedProfiles.length})
          </h3>
          {matchedProfiles.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>
              아직 매칭된 사람이 없습니다.
              <br />
              프로필을 좋아요 해보세요! ❤️
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {matchedProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: selectedProfileId === profile.id ? "#f0f0f0" : "transparent",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedProfileId !== profile.id) {
                      e.currentTarget.style.background = "#f8f8f8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedProfileId !== profile.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                      {profile.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                      {profile.age}세
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

