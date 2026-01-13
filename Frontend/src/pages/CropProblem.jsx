import { useState } from "react";
import axios from "axios";

const CropProblem = () => {
  const [crop, setCrop] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // For showing image preview
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image selection (file or camera)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crop || !image) {
      alert("Select crop & image");
      return;
    }

    const formData = new FormData();
    formData.append("crop", crop);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/crop/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.result);
    } catch (err) {
      console.error("FRONTEND ERROR:", err.response?.data || err);
      alert("Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Analyze Crop Disease</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        >
          <option value="">Select Crop</option>
          <option value="Rice">Rice</option>
          <option value="Wheat">Wheat</option>
          <option value="Potato">Potato</option>
        </select>

        <input
          type="file"
          accept="image/*"
          capture="environment" // This opens camera on mobile
          onChange={handleImageChange}
          style={{ marginBottom: "15px" }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {result && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {typeof result === "object" ? JSON.stringify(result, null, 2) : result}
        </pre>
      )}
    </div>
  );
};

export default CropProblem;
