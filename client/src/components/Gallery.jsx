import { useState, useEffect } from "react";

export default function Gallery({ setToken }) {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://pern-cloudshare.onrender.com/api/files/",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) {
      localStorage.removeItem("token");
      setToken(null);
      return;
    }
    const data = await response.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://pern-cloudshare.onrender.com/api/files/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (response.ok) {
      setFiles(files.filter((f) => f.id !== id));
    }
  }

  async function handleUpload() {
    if (!file) return;
    setIsUploading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      "https://pern-cloudshare.onrender.com/api/files/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    if (response.ok) {
      fetchFiles();
      setFile(null); // Reset input
    } else {
      const data = await response.json();
      alert(data.error); // This will show "Only image files are allowed!"
    }
    setIsUploading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            My Cloud Gallery
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4 border border-gray-100">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {/* Gallery Grid */}
        {files.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No files uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-100"
              >
                <img
                  src={f.url}
                  alt={f.original_name}
                  className="w-full h-48 object-cover bg-gray-200"
                />
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <p className="text-sm text-gray-700 font-medium truncate mb-4">
                    {f.original_name}
                  </p>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="text-red-500 text-sm font-semibold hover:underline text-left"
                  >
                    Delete File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
