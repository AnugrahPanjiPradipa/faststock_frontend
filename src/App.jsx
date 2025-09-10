import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import LogList from './components/LogList';
import Login from './pages/Login';
import Register from './pages/Register';

function Dashboard() {
  const [reload, setReload] = useState(false);
  const [logRefreshKey, setLogRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // 🔹 Satu fungsi untuk refresh ItemList dan LogList
  const refreshLogsAndItems = () => {
    setLogRefreshKey((prev) => prev + 1); // refresh LogList
    setReload((prev) => !prev); // trigger refresh ke ItemList
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Dashboard Stok Gudang & Etalase</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
          >
            Logout
          </button>
        </div>

        {/* Tombol Tambah Barang */}
        <div className="flex justify-center sm:justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            {showForm ? 'Sembunyikan Form' : 'Tambah Barang'}
          </button>
        </div>

        {/* Form Tambah Barang */}
        {showForm && (
          <div className="mb-6">
            <ItemForm
              onSuccess={() => setReload(!reload)}
              onActivitySuccess={refreshLogsAndItems}
            />
          </div>
        )}

        {/* List Item */}
        <div className="mb-8">
          <ItemList
            refreshTrigger={reload}
            onActivitySuccess={refreshLogsAndItems}
          />
        </div>

        {/* Audit Stok */}
        <h2 className="text-2xl font-bold text-center mt-8 mb-4">Audit Stok Obat</h2>
        <LogList
          refreshKey={logRefreshKey}
          onActivitySuccess={refreshLogsAndItems}
        />
      </div>
    </div>
  );
}

// Protected Route untuk membatasi akses
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  return children;
}

// Public Route untuk halaman login/register
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login & Register (Public Route) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Halaman Dashboard (Protected Route) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect jika route tidak ditemukan */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
