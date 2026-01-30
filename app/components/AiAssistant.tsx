"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Message {
  type: "question" | "answer";
  text: string;
}

export default function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  //  التحقق من تسجيل الدخول
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login to use the Dental Assistant.");
      router.push("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  //  إرسال السؤال
  const sendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return toast.error("Please write your question first.");

    const newMsg: Message = { type: "question", text: question };
    setMessages((prev) => [...prev, newMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newMsg.text }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { type: "answer", text: data.answer }]);
      } else {
        toast.error(data.message || "An error occurred while processing your request.");
      }
    } catch {
      toast.error("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (checkingAuth)
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Checking login...
      </div>
    );

  return (
    <div
      className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[65%] xl:w-[50%] mx-auto mt-20 mb-24 rounded-3xl shadow-2xl border border-gray-200 flex flex-col h-[85vh] sm:h-[90vh] overflow-hidden"
    >
      {/*  الخلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/doctors/chat.jpg')",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>

      {/*  الرسائل */}
      <div
        ref={chatContainerRef}
        className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-5
        scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent hover:scrollbar-thumb-blue-600"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Welcome to the Smart Dental Assistant 🦷
            </h2>
            <p className="text-sm sm:text-base max-w-md">
              Ask any question about your dental health, and our AI will respond instantly.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.type === "question" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 sm:p-4 rounded-2xl text-sm sm:text-base max-w-[80%] shadow-md whitespace-pre-wrap ${
                msg.type === "question"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/*  إدخال السؤال */}
      <form
        onSubmit={sendQuestion}
        className="relative z-10 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 border-t bg-white/90 backdrop-blur-md"
      >
        <input
          type="text"
          className="flex-1 p-3 sm:p-4 border rounded-2xl text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your dental question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-base sm:text-lg rounded-2xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
