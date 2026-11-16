import { useState } from "react";
import Gallery from "./components/Gallery";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      if (isLogin) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } else {
      alert(data.error);
    }
  }

  if (token) return <Gallery setToken={setToken} />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
        {isLogin ? "CloudShare Login" : "CloudShare Register"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4 mt-4"
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        )}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md mt-2"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 text-sm text-blue-600 hover:underline font-medium"
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
