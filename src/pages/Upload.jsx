import React, { useEffect, useState, useRef } from "react";
import { RxReset } from "react-icons/rx";
import { FaDownload } from "react-icons/fa6";

function Upload({ base64Image, setBase64Image }) {
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const useMockImage = true;

  useEffect(() => {
    const base64ImageFromLocal = window.localStorage.getItem("base64Image");

    if (base64ImageFromLocal) {
      console.log("base64Image found in localStorage");
      setBase64Image(base64ImageFromLocal);
    }

    if (!base64ImageFromLocal) {
      console.log("No base64Image found in localStorage");
      console.log("base64Image: ", base64Image);
      window.localStorage.setItem("base64Image", base64Image);
      setBase64Image(base64Image);
    }

    if (base64Image) {
      setError(null);
      if (useMockImage) {
        setTimeout(() => {
          setProcessedImage(
            "https://media.istockphoto.com/id/1167716273/photo/photo-of-successful-nice-enjoying-black-man-who-confidently-walks-on-his-way-to-conquering.webp?s=1024x1024&w=is&k=20&c=ECkrE6l3DX8NWUiw--P9kjs38sg7isAjy6IfOyMc4wg="
          );
        }, 2000);
      } else {
        removeBackground(base64Image);
      }
    }
  }, [base64Image]);

  const handleClick = () => fileInputRef.current.click();

  const handleFiles = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProcessedImage(null);
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    link.click();
  };

  const resetImage = () => {
    setBase64Image(null);
    setProcessedImage(null);
    window.localStorage.removeItem("base64Image");
  }

  const removeBackground = async (base64Image) => {
    setLoading(true);
    setError(null);

    const url =
      "https://background-removal4.p.rapidapi.com/v1/results?mode=fg-image";
    try {
      const blob = await (await fetch(base64Image)).blob();
      const data = new FormData();
      data.append("image", blob);

      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key":
            "5a520f2426msh5a93812f2f6b507p1c1095jsnaccee60b89e8",
          "x-rapidapi-host": "background-removal4.p.rapidapi.com",
        },
        body: data,
      };

      const response = await fetch(url, options);
      const result = await response.json();
      const imageLink = result.results[0].entities[0].image;
      setProcessedImage(`data:image/png;base64,${imageLink}`);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to remove the background. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!base64Image) {
    return (
      <div className="background-removal">
        <h2>Background Removal</h2>
        <p>Upload an image to get started.</p>
        <button onClick={handleClick}>Upload Image</button>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files[0])}
        />
      </div>
    );
  }

  return (
    <div className="background-removal">
      <h2>Background Removal</h2>

      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" className="error-icon">
            <path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
              fill="currentColor"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files[0])}
      />

      <div className="image-grid">
        <div className="image-card">
          <div className="card-header">
            <h3>Original Image</h3>
          </div>
          <div className="image-container">
            <img src={base64Image} alt="Original" className="image" />
          </div>
        </div>

        <div className="image-card">
          <div className="card-header">
            <h3>Processed Image</h3>
            <div id="image-buttons" class="icon__wrapper">
              <div id="reset-button" class="reset__icon--wrapper" onClick={resetImage}>
                <RxReset />
                Reset
              </div>
              <div id="download-button" class="download__icon--wrapper btn" onClick={downloadImage}>
                <FaDownload />
                Download
              </div>
            </div>
          </div>
          <div className="image-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Removing background...</p>
              </div>
            ) : processedImage ? (
              <img src={processedImage} alt="Processed" className="image" />
            ) : (
              <div className="loading-state">
                <p>Processing will begin shortly...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
