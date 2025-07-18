import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await api.post("/auth/token", { email: username, password });
      sessionStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-2 sm:p-8 bg-white rounded-none sm:rounded shadow-none sm:shadow-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 p-2 border rounded bg-white text-black"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full mb-4 p-2 border rounded bg-white text-black"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
} 