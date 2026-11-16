import { useState, useEffect } from "react";
export default function Gallery({ setToken }) {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/files/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      // If token is bad, log them out
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
    const response = await fetch(`http://localhost:5000/api/files/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setFiles(files.filter((f) => f.id !== id));
    }
  }

  async function handleUpload() {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:5000/api/files/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (response.ok) {
      fetchFiles();
    }
  }

  return (
    <div>
      <h2>My Gallery</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {files.map((file) => (
        <div key={file.id}>
          <img src={file.url} />
          <button onClick={() => handleDelete(file.id)}>Delete</button>{" "}
          <p>{file.original_name}</p>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
