'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import { SocketContext } from '@/contexts/SocketContext';
import CombinedAdminNav from '@/components/layout/AdminLayout';

type ChatMessage = {
  id: string;
  sender: 'USER' | 'ADMIN';
  message: string;
  createdAt: string;
  username?: string; // ✅ add this
};

export default function AdminSupportChatPage(props) {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const { userId } = router.query;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
  if (!userId) return;
  fetch(`/api/admin/support-chat/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setChatMessages(data);
      if (data.length > 0 && data[0].user.name) {
        setUsername(data[0].user.name); // ✅ set username from first message
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [userId]);


  useEffect(() => {
  if (!socket || !userId) return;

  const handleMessage = (msg: ChatMessage) => {
    if (msg.userId === userId) {
      setChatMessages((prev) => [...prev, msg]);
    }
  };

   const handleSeen = ({ userId: seenUserId, messageIds }: { userId: string; messageIds: string[] }) => {
    if (seenUserId !== userId) return; // Only update if it's this chat's user


    setChatMessages(prev =>
      prev.map(msg =>
        msg.id === seenInfo.messageId ? { ...msg, seen: true } : msg
      )
    );
  };

  socket.on('support-message', handleMessage);
  socket.on('message-seen', handleSeen);

  return () => {
    socket.off('support-message', handleMessage);
    socket.off('message-seen', handleSeen);
  };
}, [socket, userId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendReply = async () => {
    if (!input.trim() || !userId) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support-chat/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ message: input }),
        headers: { 'Content-Type': 'application/json' },
      });
      const newMsg = await res.json();
      socket?.emit('support-message', newMsg);
      setInput('');
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <CombinedAdminNav>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow h-[calc(100vh-6rem)] flex flex-col">
        <h1 className="text-xl font-bold mb-4">
          Chat with {username ? username : `User (${userId})`}
        </h1>


        <div className="flex-1 overflow-y-auto space-y-2 mb-4 bg-gray-50 p-3 rounded">
          {loading ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : chatMessages.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            chatMessages.map((msg) => (
              <div key={msg.id} className={`p-2 rounded-md max-w-[70%] ${
                msg.sender === 'USER' ? 'bg-blue-100 text-blue-800 ml-auto' : 'bg-gray-200 text-gray-700'
              }`}>
                <div className="text-xs text-gray-500 mb-1">
                  {msg.sender} – {new Date(msg.createdAt).toLocaleString()}
                  {msg.sender === 'ADMIN' && msg.seen && (
                    <div className="text-[10px] text-green-600 mt-1">Seen</div>
                  )}
                </div>
                <div>{msg.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 border-t pt-4">
          <input
            type="text"
            placeholder="Write a reply..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-sm"
            onKeyDown={(e) => e.key === 'Enter' && sendReply()}
          />
          <button
            onClick={sendReply}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </CombinedAdminNav>
  );
}
