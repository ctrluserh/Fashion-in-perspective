import React, { useState, useEffect, useRef} from "react";
import Tesseract from "tesseract.js";
import './App.css'

function PhotoUpload() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [brand, setBrand] = useState("brand")
  const [error, setError] = useState("")
  const [cohere, setCohere] = useState("")
  const [res, setRes] = useState("")
  const fileInputRef1 = useRef(null)
  const fileInputRef2 = useRef(null)

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      const photoURL = URL.createObjectURL(file); // Create an object URL for the file
      setSelectedPhoto(photoURL); // Set the selected photo to trigger text extraction
      setText(""); // Clear previous text when a new file is selected
    }
  };

  const handleFileChange1 = (event) => {
    fileInputRef1.current.click()
  };

  const handleFileChange2 = (event) => {
    fileInputRef2.current.click()
  };

  const updateBrand = (event) => {
    setBrand(event.target.value)
  }

  const validateFields = () => {
    if(text != "" && brand != "brand" ) {
      setCohere(`Brand: ${brand}, Text: ${text}`)
      sendToCohere()
    } else {
      setError("Fields are not valid") 
    }
  }

  // Extract text using Tesseract when selectedPhoto changes
  useEffect(() => {
    if (!selectedPhoto) return; // Don't extract text if no photo is selected
    setLoading(true); // Set loading to true while processing

    Tesseract.recognize(selectedPhoto, "eng", {
      logger: (info) => console.log(info), // Log progress
    })
      .then(({ data: { text } }) => {
        setText(text); // Set the extracted text to state
        setLoading(false); // Set loading to false after processing is complete
      })
      .catch((err) => {
        console.error(err); // Log any errors
        setLoading(false); // Set loading to false on error
      });
  }, [selectedPhoto]); // Effect runs whenever selectedPhoto changes


  return (
    <div className="Page">
      <div className="InputBox">
        <div className="Buttons">
        <div className="Uplaods">
          <button type="button" onClick={handleFileChange1} style={{ padding: "1rem", width: "7rem", borderRadius: "0.5rem", borderStyle: "None", marginTop: "1rem"}}>
            upload font of tag
          </button>
          <button type="button" onClick={handleFileChange2} style={{ padding: "1rem", width: "7rem", borderRadius: "0.5rem", borderStyle: "None", marginTop: "1rem"}}>
            upload back of tag
          </button>
          <input
            type="file"
            accept="image/*" // Restrict to image files
            onChange={handleFileChange}
            ref={fileInputRef1} // Attach the ref to the file input
            style={{ display: "none" }} // Hide the default file input

          />
          <input
            type="file"
            accept="image/*" // Restrict to image files
            onChange={handleFileChange}
            ref={fileInputRef2} // Attach the ref to the file input
            style={{ display: "none" }} // Hide the default file input
          />
        </div>
        <div className="ProductInfo">
          <input style={{ padding: "1rem", width: "15rem", borderRadius: "0.5rem", borderStyle: "None"}} type="Text" onChange={updateBrand} placeholder="Brand"/>
        </div> 
        <div className="Story">
          <button style={{ padding: "1rem", width: "15rem", borderRadius: "0.5rem", borderStyle: "None"}} onClick={validateFields}>Get Story</button>
        </div>      
        </div>
         
 
      </div>
      
    </div>
  );
}

export default PhotoUpload;


