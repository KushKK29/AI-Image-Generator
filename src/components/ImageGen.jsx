import "./ImageGen.css";
import default_image from "../assets/default_image.svg";
import { useState, useRef } from "react";

const ImageGen = () => {
  const [image_url, setimage_url] = useState("/"); // Default image URL
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const query = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: "Bearer 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", // Your Hugging Face Token
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching image: " + response.statusText);
    }

    const result = await response.blob();
    return result;
  };

  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      return;
    }
    setLoading(true);

    try {
      const blob = await query({ inputs: inputRef.current.value });

      // Create a new URL for the blob and set it to the image source
      const imageBlobUrl = window.URL.createObjectURL(blob);
      setimage_url(imageBlobUrl); // Update the state with the new image URL
    } catch (error) {
      console.error("Error generating image: ", error);
      alert("Failed to generate image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          {/* Display generated image or default image */}
          <img
            src={image_url === "/" ? default_image : image_url}
            alt="Generated AI"
          />
          <div className="loading">
            <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
            <div className={loading ? "loading-text" : "display-none"}>
              Loading...
            </div>
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What you want to see"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGen;
