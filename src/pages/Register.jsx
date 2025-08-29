// src/pages/Register.jsx
import { useState } from 'react';
import { register } from '../services/authService';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Pendaftaran gagal');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
        <p className="mt-3 text-sm text-center">
          Sudah punya akun?{' '}
          <a
            href="/login"
            className="text-blue-500"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
