import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function LogList({ refreshKey, onActivitySuccess }) {
  const [logs, setLogs] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs().format('YYYY-MM-DD'));
  const [jenis, setJenis] = useState('all');
  const [loading, setLoading] = useState(false);

  const [editLog, setEditLog] = useState(null);
  const [editJumlah, setEditJumlah] = useState(0);
  const [editType, setEditType] = useState('input');

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`https://faststockbackend-production.up.railway.app/api/logs`, { params: { date: tanggal, type: jenis } });
      setLogs(Array.isArray(res.data) ? res.data : res.data.logs || []);
    } catch (err) {
      console.error('Gagal mengambil data log:', err);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshKey, tanggal, jenis]);

  const handleExport = () => {
    const url = `https://faststockbackend-production.up.railway.app/api/logs/export?date=${tanggal}&type=${jenis}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `log-${tanggal}-${jenis}.xlsx`;
    link.click();
  };

  const handleDeleteLogs = async () => {
    if (!window.confirm(`Hapus semua log tanggal ${tanggal}?`)) return;

    setLoading(true);
    try {
      await axios.delete('https://faststockbackend-production.up.railway.app/api/logs', { data: { date: tanggal } });
      await fetchLogs();
      onActivitySuccess?.();
    } catch (err) {
      alert('Gagal menghapus log');
      console.error(err);
    }
    setLoading(false);
  };

  const handleDeleteLog = async (id) => {
    if (!confirm('Yakin ingin menghapus log ini? Stok akan dikembalikan.')) return;
    try {
      await axios.delete(`https://faststockbackend-production.up.railway.app/api/logs/${id}`);
      await fetchLogs();
      onActivitySuccess?.();
    } catch (err) {
      console.error('Gagal menghapus log:', err);
      alert('Terjadi kesalahan saat menghapus log.');
    }
  };

  const openEditModal = (log) => {
    setEditLog(log);
    setEditJumlah(log.jumlah);
    setEditType(log.type);
  };

  const handleUpdateLog = async () => {
    if (!editLog) return;

    try {
      await axios.put(`https://faststockbackend-production.up.railway.app/api/logs/${editLog._id}`, {
        itemId: editLog.itemId,
        itemName: editLog.itemName,
        type: editType,
        jumlah: Number(editJumlah),
      });

      setEditLog(null);
      await fetchLogs();
      onActivitySuccess?.();
    } catch (err) {
      console.error('Gagal mengupdate log:', err);
      alert('Terjadi kesalahan saat mengedit log.');
    }
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Filter dan aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <label className="mr-2 text-sm">Tanggal:</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
          </div>

          <div>
            <label className="mr-2 text-sm">Jenis Log:</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="all">Semua</option>
              <option value="input">Input</option>
              <option value="mutasi">Mutasi</option>
              <option value="penjualan">Penjualan</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Export Excel
          </button>
        </div>

        <button
          onClick={handleDeleteLogs}
          disabled={loading}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          {loading ? 'Menghapus...' : 'Hapus Log Tanggal Ini'}
        </button>
      </div>

      {/* Tabel log */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Waktu</th>
              <th className="p-2">Item</th>
              <th className="p-2">Jenis</th>
              <th className="p-2">Jumlah</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500"
                >
                  Tidak ada log
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t"
                >
                  <td className="p-2 whitespace-nowrap">{dayjs(log.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                  <td className="p-2">{log.itemName}</td>
                  <td className="p-2 capitalize">{log.type}</td>
                  <td className="p-2">{log.jumlah}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(log)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      className="text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {editLog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
          <div className="bg-white p-4 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Edit Log</h2>
            <div className="mb-4">
              <label className="block mb-1">Jumlah:</label>
              <input
                type="number"
                value={editJumlah}
                onChange={(e) => setEditJumlah(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditLog(null)}
                className="px-3 py-1 border rounded"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateLog}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
