'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { SocketContext } from '@/contexts/SocketContext';
import { MessageCircle, X } from 'lucide-react';

type ChatMessage = {
  id: string;
  sender: 'USER' | 'ADMIN';
  message: string;
  createdAt: string;
};

export default function ChatSupportWidget() {
  const socket = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔁 Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Set up socket listener once
useEffect(() => {
  if (!socket) return; // returning undefined is fine

  const handleMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);

    // 👁️ Mark admin messages as seen immediately if widget is open
    if (msg.sender === "ADMIN" && isOpen) {
      fetch("/api/user/support-chat/seen", {
        method: "POST",
        body: JSON.stringify({ ids: [msg.id] }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          socket.emit("message-seen", {
            messageId: msg.id,
            userId: msg.userId,
          });
        })
        .catch(console.error);
    }
  };

  socket.on("support-message", handleMessage);

  // ⬇️ Cleanup must return void — wrap in braces
  return () => {
    socket.off("support-message", handleMessage);
    // (optional) if this component owns the socket:
    // socket.disconnect();
  };
}, [socket, isOpen]);



  // ✅ Fetch chat history on modal open
  useEffect(() => {
  if (isOpen) {
    fetch('/api/socket'); // Wake socket
    fetch('/api/user/support-chat')
      .then((res) => res.json())
      .then((msgs) => {
        setMessages(msgs);

        // Mark all unseen ADMIN messages as seen
        const unseenIds = msgs
          .filter(m => m.sender === 'ADMIN' && !m.seen)
          .map(m => m.id);

        if (unseenIds.length) {
          fetch('/api/user/support-chat/seen', {
            method: 'POST',
            body: JSON.stringify({ ids: unseenIds }),
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');

    const res = await fetch('/api/user/support-chat', {
      method: 'POST',
      body: JSON.stringify({ message: userText }),
      headers: { 'Content-Type': 'application/json' },
    });

    const saved: ChatMessage = await res.json();
    socket?.emit('support-message', saved); // Let the listener update state
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 bg-white border rounded-lg shadow-lg flex flex-col h-96">
          <div className="flex justify-between items-center p-3 border-b">
            <h2 className="font-semibold text-sm">ZestLeads Support</h2>
            <X className="w-4 h-4 cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-2 text-sm bg-gray-50">
            {loading ? (
              <p className="text-gray-400 text-xs">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-xs">Start a conversation with support.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-md max-w-[75%] ${
                    msg.sender === 'USER'
                      ? 'bg-blue-100 text-blue-800 ml-auto'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {msg.message}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex border-t p-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Help
        </button>
      )}
    </div>
  );
}
