import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  CheckCheck,
  Circle,
  LogOut,
  MessageCircle,
  Send,
  Wifi,
  WifiOff
} from "lucide-react";
import { fetchMessages } from "./api";

const DEFAULT_SOCKET_URL = "https://pulsechat-backend-production-23f3.up.railway.app";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : DEFAULT_SOCKET_URL);

function formatTime(dateString) {
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateString));
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat([], {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("chat_username") || ""
  );
  const [draftUsername, setDraftUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);

  const isLoggedIn = Boolean(username);

  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      const key = formatDate(message.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(message);
      return groups;
    }, {});
  }, [messages]);

  useEffect(() => {
    if (!isLoggedIn) return;

    let active = true;

    fetchMessages()
      .then((data) => {
        if (active) setMessages(data.messages || []);
      })
      .catch((err) => setError(err.message));

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError("");
      socket.emit("user:join", username);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("connect_error", () => {
      setConnected(false);
      setError("Cannot connect to chat server. Check that the backend is running.");
    });

    socket.on("message:new", (message) => {
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    });

    socket.on("users:update", ({ users: nextUsers }) => {
      setUsers(nextUsers || []);
    });

    socket.on("typing:update", ({ username: typingName, typing }) => {
      setTypingUser(typing ? typingName : "");
    });

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  function login(event) {
    event.preventDefault();
    const cleanName = draftUsername.trim().slice(0, 30);

    if (!cleanName) return;
    localStorage.setItem("chat_username", cleanName);
    setUsername(cleanName);
    setDraftUsername("");
  }

  function logout() {
    socketRef.current?.disconnect();
    localStorage.removeItem("chat_username");
    setUsername("");
    setMessages([]);
    setUsers([]);
    setConnected(false);
  }

  function handleTyping(value) {
    setText(value);
    const socket = socketRef.current;
    if (!socket || !connected) return;

    socket.emit("typing:start");
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing:stop");
    }, 900);
  }

  function sendMessage(event) {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText || !socketRef.current || !connected) return;

    socketRef.current.emit(
      "message:send",
      { text: cleanText },
      (response) => {
        if (!response?.ok) {
          setError(response?.error || "Message could not be sent.");
        }
      }
    );

    socketRef.current.emit("typing:stop");
    setText("");
  }

  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <section className="login-card">
          <div className="brand-mark">
            <MessageCircle size={28} />
          </div>
          <p className="eyebrow">REAL-TIME CHAT</p>
          <h1>Welcome to PulseChat</h1>
          <p className="muted">
            Join the conversation with instant Socket.io messaging.
          </p>

          <form onSubmit={login} className="login-form">
            <label htmlFor="username">Choose a username</label>
            <input
              id="username"
              value={draftUsername}
              onChange={(e) => setDraftUsername(e.target.value)}
              placeholder="e.g. Abhay"
              maxLength={30}
              autoFocus
            />
            <button type="submit">
              Enter chat <Send size={17} />
            </button>
          </form>

          <div className="feature-row">
            <span><Wifi size={15} /> Live messaging</span>
            <span><CheckCheck size={15} /> Persistent history</span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small"><MessageCircle size={20} /></div>
          <div>
            <strong>PulseChat</strong>
            <small>Realtime workspace</small>
          </div>
        </div>

        <div className="profile-card">
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="profile-copy">
            <strong>{username}</strong>
            <span><Circle size={8} fill="currentColor" /> Active</span>
          </div>
          <button className="icon-btn" onClick={logout} title="Log out">
            <LogOut size={17} />
          </button>
        </div>

        <div className="online-section">
          <div className="section-heading">
            <span>ONLINE NOW</span>
            <b>{users.length}</b>
          </div>

          <div className="user-list">
            {users.map((user) => (
              <div className="user-row" key={user}>
                <div className="avatar mini">{user.charAt(0).toUpperCase()}</div>
                <span>{user}</span>
                <i />
              </div>
            ))}
            {!users.length && (
              <p className="empty-users">Connecting to the room…</p>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className={`connection ${connected ? "online" : "offline"}`}>
            {connected ? <Wifi size={15} /> : <WifiOff size={15} />}
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">GENERAL ROOM</p>
            <h2>Team Chat</h2>
          </div>
          <div className={`status-pill ${connected ? "online" : "offline"}`}>
            <span />
            {connected ? "Live" : "Offline"}
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <div className="messages">
          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              <div className="date-divider"><span>{date}</span></div>

              {dayMessages.map((message) => {
                const mine = message.username === username;
                return (
                  <div
                    className={`message-row ${mine ? "mine" : ""}`}
                    key={message.id}
                  >
                    {!mine && (
                      <div className="avatar message-avatar">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="message-content">
                      {!mine && <span className="message-author">{message.username}</span>}
                      <div className="bubble">
                        <span>{message.text}</span>
                      </div>
                      <div className="message-meta">
                        {formatTime(message.createdAt)}
                        {mine && <CheckCheck size={14} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {!messages.length && (
            <div className="empty-chat">
              <div className="empty-icon"><MessageCircle size={28} /></div>
              <h3>No messages yet</h3>
              <p>Send the first message to start the conversation.</p>
            </div>
          )}

          {typingUser && (
            <div className="typing-indicator">
              <div className="typing-dots"><i /><i /><i /></div>
              <span>{typingUser} is typing…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <input
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder={connected ? "Write a message…" : "Waiting for server…"}
            maxLength={1000}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || !text.trim()}
            aria-label="Send message"
          >
            <Send size={19} />
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;