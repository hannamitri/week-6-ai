import React, { useEffect, useState } from "react";

function Remove({ base64Image }) {
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (base64Image) {
      removeBackground(base64Image);
    }
  }, [base64Image]);

  const removeBackground = async (base64Image) => {
    setLoading(true);

    const url =
      "https://background-removal4.p.rapidapi.com/v1/results?mode=fg-image";
    const blob = await (await fetch(base64Image)).blob();
    const data = new FormData();
    data.append("image", blob);

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "d0e5ce08c0msh3d48815283e3916p149b26jsna7d8edb11e4e",
        "x-rapidapi-host": "background-removal4.p.rapidapi.com",
      },
      body: data,
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const imageLink = result.results[0].entities[0].image;
      setProcessedImage(`data:image/png;base64,${imageLink}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to remove the background. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-page">
      <h2>Background Removal</h2>
      <div className="image-comparison">
        {base64Image && (
          <div className="image-container">
            <h3>Original Image:</h3>
            <img
              src={base64Image}
              alt="Original"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="spinner__wrapper">
            <i className="fas fa-solid fa-spinner"></i>
          </div>
        ) : (
          processedImage && (
            <div className="image-container">
              <h3>Processed Image:</h3>
              <img
                src={processedImage}
                alt="Processed"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Remove;
