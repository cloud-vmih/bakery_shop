import { useState, useEffect } from "react";
import ChatButton from "./ChatButton";
import { X } from "lucide-react";
import { useChatStore } from "../../stores/chat.store";
import { useSocketStore } from "../../stores/socket.store";


// export default function ChatWidget() {
// const [open, setOpen] = useState(false);
// const { messages, loadMessages, sendMessage } = useChatStore();
// const socket = useSocketStore();
// const [input, setInput] = useState("");


// useEffect(() => {
// if (!socket) return;


// socket.on("receiveMessage", (msg) => {
// addMessage({ from: "support", text: msg });
// });


// return () => socket.off("receiveMessage");
// }, [socket]);


// return (
// <div className="chat-container">
// {!open && <ChatButton onClick={() => setOpen(true)} />}


// {open && (
// <div className="chat-box">
// <div className="chat-header">
// <span>Hỗ trợ khách hàng</span>
// <X onClick={() => setOpen(false)} className="close-icon" />
// </div>


// <div className="chat-body">
// {messages.map((m, i) => (
// <div key={i} className={`msg ${m.from}`}>{m.text}</div>
// ))}
// </div>


// <div className="chat-input">
// <input
// value={input}
// onChange={(e) => setInput(e.target.value)}
// placeholder="Nhập tin nhắn..."
// />
// <button onClick={() => { sendMessage(input); setInput(""); }}>Gửi</button>
// </div>
// </div>
// )}
// </div>
// );
// }