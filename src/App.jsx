  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { useState } from 'react';
  import ItemForm from './components/ItemForm';
  import ItemList from './components/ItemList';
  import LogList from './components/LogList';
  import Login from './pages/Login';
  import Register from './pages/Register';

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

  function Dashboard() {
    const [reload, setReload] = useState(false);
    const [logRefreshKey, setLogRefreshKey] = useState(0);
    const [showForm, setShowForm] = useState(false);

    // 🔹 Satu fungsi untuk refresh ItemList dan LogList
    const refreshLogsAndItems = () => {
      setLogRefreshKey((prev) => prev + 1); // refresh LogList
      setReload((prev) => !prev); // refresh ItemList
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      window.location.href = '/login'; // redirect ke login
    };

    return (
      <div className="bg-gray-50 min-h-screen p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dashboard Stok Gudang & Etalase</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Tombol Tambah Barang */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Sembunyikan Form' : 'Tambah Barang'}
          </button>
        </div>

        {/* Form Tambah Barang */}
        {showForm && (
          <ItemForm
            onSuccess={() => setReload(!reload)}
            onActivitySuccess={refreshLogsAndItems}
          />
        )}

        {/* List Item */}
        <ItemList
          key={reload} // ⬅️ trigger ulang fetchItems saat reload berubah
          onActivitySuccess={refreshLogsAndItems}
        />

        {/* Audit Stok */}
        <h1 className="text-2xl font-bold text-center mt-6">Audit Stok Obat</h1>
        <LogList
          refreshKey={logRefreshKey}
          onActivitySuccess={refreshLogsAndItems}
        />
      </div>
    );
  }

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Halaman Login & Register */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Halaman Dashboard yang dilindungi */}
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
            element={<Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
