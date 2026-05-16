import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  UploadCloud,
  FileText,
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
  Database,
  Cpu,
  Search,
  LogOut,
  File,
  XCircle,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (token) {
      fetchMe();
      fetchHistory();
      fetchDocuments();
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const response = await axios.get(`${API_URL}/me`, authHeaders);
      setUser(response.data);
    } catch {
      logout();
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`, authHeaders);

      const historyMessages = response.data
        .reverse()
        .flatMap((chat) => [
          {
            type: "user",
            text: chat.question,
          },
          {
            type: "ai",
            text: chat.answer,
            sources: chat.sources || [],
          },
        ]);

      setMessages(historyMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`, authHeaders);
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async () => {
    try {
      await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });

      alert("Signup successful. Please login.");
      setAuthMode("login");
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed");
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);
      setUser(response.data.user);
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setMessages([]);
    setDocuments([]);
    setFile(null);
  };

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please choose a PDF file only");
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please choose a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await axios.post(`${API_URL}/upload`, formData, authHeaders);

      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: `PDF **${file.name}** uploaded successfully. You can now ask questions.`,
        },
      ]);

      setFile(null);
      fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("PDF upload failed. Please login again if needed.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/documents/${documentId}`, authHeaders);
      fetchDocuments();

      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: "Document deleted successfully.",
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("Failed to delete document.");
    }
  };

  const askQuestion = async (customQuestion) => {
    const finalQuestion = customQuestion || question;

    if (!finalQuestion.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: finalQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/ask`,
        {
          question: finalQuestion,
        },
        authHeaders
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: response.data.answer,
          sources: response.data.sources || [],
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("AI request failed. Please upload a PDF or login again.");
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Summarize this document",
    "What skills are mentioned?",
    "What are the key projects?",
    "What education details are mentioned?",
  ];

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Sparkles size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">RAG AI</h1>
              <p className="text-slate-400 text-sm">
                Secure Document Assistant
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">
            {authMode === "login" ? "Login" : "Create Account"}
          </h2>

          <div className="space-y-4">
            {authMode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:border-blue-500"
              />
            )}

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:border-blue-500"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:border-blue-500"
            />

            <button
              onClick={authMode === "login" ? login : signup}
              className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-bold transition"
            >
              {authMode === "login" ? "Login" : "Signup"}
            </button>
          </div>

          <p className="text-slate-400 text-sm mt-6 text-center">
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "signup" : "login")
              }
              className="text-blue-400 hover:underline"
            >
              {authMode === "login" ? "Signup" : "Login"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex">
      <aside className="w-86 min-h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <Sparkles size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">RAG AI</h1>
            <p className="text-slate-400 text-sm">
              {user ? user.name : "Private Document Assistant"}
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`border-2 border-dashed rounded-3xl p-5 text-center transition-all duration-300 ${dragActive
              ? "border-blue-400 bg-blue-500/20 scale-105"
              : "border-slate-700 bg-slate-800/60 hover:bg-slate-800"
            }`}
        >
          <UploadCloud className="mx-auto mb-3 text-blue-400" size={40} />

          <p className="font-semibold mb-2">
            {file ? file.name : "Drag & drop PDF"}
          </p>

          <p className="text-slate-400 text-sm mb-4">
            or click below to choose file
          </p>

          <label className="inline-block bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl cursor-pointer transition">
            Choose PDF
            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        </div>

        <button
          onClick={uploadFile}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all p-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <UploadCloud size={20} />
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

        {file && (
          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <FileText className="text-emerald-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{file.name}</p>
              <p className="text-xs text-emerald-400">Ready to upload</p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Uploaded Documents</h2>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {documents.length === 0 ? (
              <p className="text-sm text-slate-500">No documents uploaded.</p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-800/70 border border-slate-700 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="text-blue-400 shrink-0" size={20} />

                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate">
                        {doc.filename}
                      </p>
                      <p className="text-xs text-slate-400">
                        {doc.chunks} chunks
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-300 hover:text-red-500 transition"
                    title="Delete document"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">System Stack</h2>

          <div className="grid gap-3 text-sm">
            <div className="bg-slate-800/70 p-3 rounded-xl flex items-center gap-3">
              <Cpu className="text-blue-400" size={18} />
              Local LLM: Llama3.2
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl flex items-center gap-3">
              <Database className="text-purple-400" size={18} />
              Vector DB: ChromaDB
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl flex items-center gap-3">
              <Search className="text-emerald-400" size={18} />
              Semantic Retrieval
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button
            onClick={() => setMessages([])}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Trash2 size={18} />
            Clear Chat
          </button>

          <button
            onClick={logout}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <h2 className="text-4xl font-bold">AI Document Assistant</h2>
          <p className="text-slate-400 mt-2">
            Ask questions from your PDFs using local open-source AI.
          </p>
        </header>

        <section className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-blue-600/20 p-6 rounded-full mb-6">
                <Bot size={60} className="text-blue-400" />
              </div>

              <h3 className="text-3xl font-bold mb-3">
                Upload PDFs and start chatting
              </h3>

              <p className="text-slate-400 max-w-xl mb-8">
                Your documents, chats, and user data are stored separately for
                each account.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => askQuestion(q)}
                    disabled={loading}
                    className="bg-slate-800/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 transition p-4 rounded-2xl text-left disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 ${msg.type === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.type !== "user" && (
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center ${msg.type === "system" ? "bg-emerald-600" : "bg-blue-600"
                    }`}
                >
                  {msg.type === "system" ? <FileText /> : <Bot />}
                </div>
              )}

              <div
                className={`max-w-4xl p-5 rounded-3xl shadow-xl leading-8 whitespace-pre-wrap text-lg ${msg.type === "user"
                    ? "bg-blue-600 rounded-tr-none"
                    : msg.type === "system"
                      ? "bg-emerald-700/80 rounded-tl-none"
                      : "bg-slate-800/90 border border-white/10 rounded-tl-none"
                  }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>

                {msg.type === "ai" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-6 border-t border-slate-700 pt-4">
                    <p className="text-sm text-slate-400 mb-2">Sources</p>

                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, sourceIndex) => (
                        <span
                          key={sourceIndex}
                          className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30"
                        >
                          📄 {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.type === "user" && (
                <div className="h-11 w-11 rounded-2xl bg-slate-700 flex items-center justify-center">
                  <User />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center">
                <Bot />
              </div>

              <div className="bg-slate-800/90 border border-white/10 p-5 rounded-3xl rounded-tl-none flex gap-2">
                <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
        </section>

        <footer className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex gap-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask questions about your documents..."
              className="flex-1 bg-slate-900/80 border border-slate-700 focus:border-blue-500 rounded-3xl p-5 outline-none resize-none text-lg transition min-h-24"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askQuestion();
                }
              }}
            />

            <button
              onClick={() => askQuestion()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all px-8 rounded-3xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Send"}
              <Send size={22} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;