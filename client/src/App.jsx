import { useState } from "react";
import Gallery from "./components/Gallery";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      console.error(data.error);
    }
  }
  if (token) {
    return <Gallery setToken={setToken} />;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">CloudShare Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
