import { useRef, useState } from 'react';
import axios from 'axios';

export default function ItemForm({ onSuccess, onActivitySuccess }) {
  const [form, setForm] = useState({
    name: '',
    image: '',
    stockGudang: 0,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview image
    } else {
      setPreview(null);
    }
  };

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('image', form.image);
    formData.append('stockGudang', form.stockGudang);

    try {
      await axios.post('https://faststockbackend-production.up.railway.app/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ name: '', image: null, stockGudang: 0 });
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // ⬅️ kosongkan input file
      }

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
      {/* Custom Upload */}
      <div>
        <label className="block mb-1 font-medium">Gambar Item</label>
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded inline-block hover:bg-blue-600">
          Pilih Gambar
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

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
