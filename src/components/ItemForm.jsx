import { useState } from 'react';
import axios from 'axios';

export default function ItemForm({ onSuccess, onActivitySuccess }) {
  const [form, setForm] = useState({
    name: '',
    image: '',
    stockGudang: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('image', form.image);
    formData.append('stockGudang', form.stockGudang);

    try {
      await axios.post('faststockbackend-production.up.railway.app/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ name: '', image: null, stockGudang: 0 });

      // refresh list item + log
      onActivitySuccess?.();
      onSuccess?.();
    } catch (err) {
      console.error('Gagal tambah item', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 shadow rounded max-w-md mx-auto mt-6"
    >
      <h2 className="text-xl font-bold">Tambah Item Gudang</h2>
      <input
        type="text"
        name="name"
        placeholder="Nama item"
        className="w-full border p-2"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      <input
        type="number"
        name="stockGudang"
        placeholder="Stok gudang"
        className="w-full border p-2"
        value={form.stockGudang}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Simpan
      </button>
    </form>
  );
}
