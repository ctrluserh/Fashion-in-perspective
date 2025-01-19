import React, { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import './App.css';

export function Story() {
  return (
    <div>Here is the story.</div>
  );
}

function PhotoUpload({ setRes }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [brand, setBrand] = useState("brand");
  const [error, setError] = useState("");
  const [cohere, setCohere] = useState("");
  const [uploaded1, setUploaded1] = useState(false)
  const [uploaded2, setUploaded2] = useState(false);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const sendToCohere = () => {
    setRes("hello");  // Assuming you want to send some result here
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);  // Create a URL for the file
      setSelectedPhoto(photoURL);
    }
  };

  const handleFileChange1 = () => {
    fileInputRef1.current.click();  // Trigger file input click
    setUploaded1(true)
  };

  const handleFileChange2 = () => {
    fileInputRef2.current.click();  // Trigger file input click
    setUploaded2(true)
  };

  const updateBrand = (event) => {
    setBrand(event.target.value);
  };

  const validateFields = () => {
    if (text !== "" && brand !== "brand" && text2 !=="") {
      setCohere(`Brand: ${brand}, Text: ${text + " " + text2}`);
      sendToCohere();  // Call function to send data
    } else {
      setError("Fields are not valid.");
    }
  };

  // Extract text using Tesseract when selectedPhoto changes
  useEffect(() => {
    if (!selectedPhoto) return;  // Don't process if no photo is selected
    setLoading(true);  // Show loading spinner

    Tesseract.recognize(selectedPhoto, "eng", {
      logger: (info) => console.log(info),  // Log progress to the console
    })
      .then(({ data: { text } }) => {
        if (uploaded2) {
          setText2(text)
        } else {
          setText(text)
        }
        setLoading(false);  // Set loading to false after processing
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);  // Set loading to false in case of error
      });
  }, [selectedPhoto]);  // Runs when selectedPhoto changes

  return (
    <div className="Page">
      <div className="InputBox">
        <div className="Buttons">
          <div className="Uploads">
            <button 
              type="button" 
              onClick={handleFileChange1} 
              style={{ padding: "1rem", width: "7rem", borderRadius: "0.5rem", borderStyle: "none", marginTop: "1rem" }}>
              Upload front of tag
            </button>
            <button 
              type="button" 
              onClick={handleFileChange2} 
              style={{ padding: "1rem", width: "7rem", borderRadius: "0.5rem", borderStyle: "none", marginTop: "1rem" }}>
              Upload back of tag
            </button>

            <input
              type="file"
              accept="image/*"  // Restrict to image files
              onChange={handleFileChange}
              ref={fileInputRef1}  // Attach the ref to the file input
              style={{ display: "none" }}  // Hide the default file input
            />
            <input
              type="file"
              accept="image/*"  // Restrict to image files
              onChange={handleFileChange}
              ref={fileInputRef2}  // Attach the ref to the file input
              style={{ display: "none" }}  // Hide the default file input
            />
          </div>

          <div className="ProductInfo">
            <input 
              style={{ padding: "1rem", width: "15rem", borderRadius: "0.5rem", borderStyle: "none" }} 
              type="text" 
              onChange={updateBrand} 
              placeholder="Brand"
            />
          </div>

          <div className="Story">
            <button 
              style={{ padding: "1rem", width: "15rem", borderRadius: "0.5rem", borderStyle: "none" }} 
              onClick={validateFields}>
              Get Story
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}
          </div>
        </div>
      </div>
      {cohere}
    </div>
  );
}

export function App() {
  const [res, setRes] = useState("");  // State to track result

  return (
    <div>
      {res === "" ? <PhotoUpload setRes={setRes} /> : <Story />}
    </div>
  );
}

export default PhotoUpload;
