import React, { useState, useEffect, useRef, use } from "react";
import Tesseract from "tesseract.js";
import './App.css';
import { extractInfo, extractImages } from "./utilities.js";


export function Story({res}) {
  const [slide1, setSlide1] = useState(true)
  const [slide2, setSlide2] = useState(false)
  const [slide3, setSlide3] = useState(false)
  const [slide4, setSlide4] = useState(false)
  const [slide5, setSlide5] = useState(false)



  const [images, setImages] = useState([]);
  const [prompt, setPrompt] = useState("")

let p1 = "http://localhost:5000/factoryimage/" + "Create a realistic image of the following country and what it might be famous for: " + res.country
        let p2 = "http://localhost:5000/factoryimage2/" + "Create a realistic image of a factory that produces fast fashion clothes in this country: " + res.country
        let p3 = "http://localhost:5000/factoryimage3/" + "Create a realistic image of the materials that are given in the following list " + JSON.stringify(res.fabric)
        let p4 = "http://localhost:5000/factoryimage4/" + "Create a realistic image of poor people and children in this country: " + res.country
        let p5 = "http://localhost:5000/factoryimage5/" + "Create a realistic image of the sources (plant and animal) that are needed in the following list: " + JSON.stringify(res.fabric)



  useEffect(() => {
    setPrompt(p1)
    setTimeout(() => {
      setSlide1(false)
      setSlide2(true)
      setPrompt(p2)
      setTimeout(() => {
        setSlide2(false)
        setSlide3(true)
        setPrompt(p3)
        setTimeout(() => {
          setSlide3(false)
          setSlide4(true)
          setPrompt(p4)
          setTimeout(() => {
            setSlide4(false)
            setSlide5(true)
            setPrompt(p5)
          }, 10000)
        }, 10000)
      }, 10000)
    }, 10000)
  }, [])

  return (
    <div><img src={prompt}/></div>
  );
}

export function PhotoUpload(props) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [brand, setBrand] = useState("brand");
  const [error, setError] = useState("");
  const [cohere, setCohere] = useState("");
  const [uploaded1, setUploaded1] = useState(false)
  const [uploaded2, setUploaded2] = useState(false);
  const [cohereInfo, setCohereInfo] = useState(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const sendToCohere = async () => {

    await extractInfo(cohere, props.setRes);  // Assuming you want to send some result here

  };

  useEffect(() => {sendToCohere()}, [cohere]);

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

    setBrand(event.target.value)
  };

  
  const validateFields = () => {
    if (text !== "" && brand !== "brand" && text2 !=="") {
      setCohere(`Brand: ${brand}, Text: ${text + " " + text2}`);
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
    </div>
  );
}

function App() {
  const [res, setRes] = useState("");  // State to track result

  const [images, setImages] = useState([]);

  const [arr, setArr] = useState({
    "country": "Denmark",
    "fabric": {
        "Cotton": 25,
        "Polyester": 50,
        "Rayon": 10,
        "Silk": 25
    }
})
  
  const updateRes = (response) => {
    setRes(response)
  }

  return (
    <div>
      {res === "" ? (
        <PhotoUpload setRes={setRes} setImages={setImages}/> // Pass the update function to the child
      ) : (
        <Story res={res} />
      )}
    </div>
  );
}

export default App
