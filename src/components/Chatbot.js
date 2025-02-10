import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react"; // Icon library

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const chatRef = useRef(null);

  // Close chatbox when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "You are a helpful AI assistant." }, ...newMessages],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("Error: " + (error.response?.data?.error?.message || "Something went wrong!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon with "Talk to me" */}
      {!open && (
        <div className="fixed bottom-5 right-5 flex flex-col items-center">
          {/* Text above the icon */}
          <div className="mb-2 bg-teal-500 text-white text-sm px-3 py-1 rounded-lg shadow-lg">
            Talk to me
          </div>

          {/* Chat Icon */}
          <button
            onClick={() => setOpen(true)}
            className="bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 transition"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Chatbox */}
      {open && (
        <div ref={chatRef} className="fixed bottom-16 right-5 bg-white shadow-lg rounded-lg w-80 p-4">
          <div className="h-64 overflow-y-auto p-2 border-b border-gray-300">
            {messages.map((msg, index) => (
              <p key={index} className={msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-600"}>
                {msg.content}
              </p>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border p-2 rounded-l"
              placeholder="Ask me something..."
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-teal-500 text-white px-3 py-2 rounded-r"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
