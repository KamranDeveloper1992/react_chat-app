import React, { useState } from "react";

const ChatApp = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  // Mesaj göndərmək funksiyası
  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, inputValue]); // Yeni mesaj əlavə et
      setInputValue(""); // Input sahəsini sıfırla
    }
  };

  // Klaviatura Enter düyməsinə reaksiya
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ width: "400px", margin: "20px auto", textAlign: "center" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: "left",
              margin: "5px 0",
              padding: "8px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
            }}
          >
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Mesaj yazın..."
        style={{
          width: "calc(100% - 60px)",
          padding: "8px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          padding: "8px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Göndər
      </button>
    </div>
  );
};

export default ChatApp;
