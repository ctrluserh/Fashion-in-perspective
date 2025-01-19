import React, { useState, useEffect, useRef, use } from "react";
import Tesseract from "tesseract.js";
import './App.css';
import { extractInfo, extractImages } from "./utilities.js";
import {formattedData} from "./min_wage.js"
import { getWater } from "./fabric_water.js";


export function Story({res}) {
  const [slide1, setSlide1] = useState(true)
  const [slide2, setSlide2] = useState(false)
  const [slide3, setSlide3] = useState(false)
  const [slide4, setSlide4] = useState(false)
  const [slide5, setSlide5] = useState(false)
  const [images, setImages] = useState([]);
  const [prompt, setPrompt] = useState("")
  const minWage = useRef(formattedData[res.country.toLowerCase()])
  const water = useRef(getWater(res))
  // TEMP 
  useEffect(() => {console.log("water", water)}, [water])
  let materials = ""

  for (let key in res.fabric) {
    materials +=  key + " "
  }

  let p1s = "Your clothing article was made in" + res.country
  let p2s = "These were the working conditions of your workers. It's not always easy to see the people behind the clothes we wear, but they are there. "
  let p3s = "Your clothing article was made out of " + materials + ". " + water.current + " litres of water was used to create 100 grams of your clothes" 
  let p4s = "Your workers made an average of" + minWage.current + "CAD an hour. "
  let p5s = "These were the origins of your clothing article"

  let p1 = "http://localhost:5000/factoryimage/" + "Create a highly detailed, realistic image of the country " + res.country + ". The image should reflect what the country is most famous for, whether it be its natural landscapes, cultural heritage, or economic achievements. Include iconic landmarks, environmental features, or cultural elements that are closely associated with this country.";
  let p2 = "http://localhost:5000/factoryimage2/" + "Create a highly realistic and detailed image of a large-scale factory located in " + res.country + ", producing fast fashion clothes. The factory should feature rows of sewing machines, textile workers, and a variety of clothing materials being processed. It should have a bustling, industrial feel with a focus on the production process of trendy, mass-produced garments.";
  let p3 = "http://localhost:5000/factoryimage3/" + "Create a highly detailed, realistic image of the raw materials used in the production of clothing. These materials are based on the following fabric types: " + JSON.stringify(res.fabric) + ". Include elements such as cotton fields, polyester fibers, rayon textures, and silk threads. The image should showcase the natural or synthetic origins of these fabrics in realistic environments like farms or manufacturing facilities.";
  let p4 = "http://localhost:5000/factoryimage4/" + "Create a highly realistic, emotional image of the living conditions of impoverished people, including children, in " + res.country + ". The image should show the harsh reality of poverty, with people living in run-down areas, struggling with basic needs. The scene should evoke a sense of urgency and empathy while highlighting the economic disparity in the country.";
  let p5 = "http://localhost:5000/factoryimage5/" + "Create a highly realistic and detailed image showcasing the natural sources of plant and animal materials used in fabric production. Based on the following list of fabrics: " + JSON.stringify(res.fabric) + ", depict cotton plants, polyester derived from petroleum, rayon fibers, and silkworms. The scene should emphasize the connection between nature and the textile industry in a vivid, natural setting.";
  
  const speakText = (speech) => {
    if (speech !== '') {
      const utterance = new SpeechSynthesisUtterance(speech); 
      utterance.rate = 1;  
      utterance.pitch = 1; 
      utterance.volume = 1; 

      window.speechSynthesis.speak(utterance);
    }
  };


  useEffect(() => {
    setPrompt(p1)
    speakText(p1s)
    setTimeout(() => {
      setSlide1(false)
      setSlide2(true)
      setPrompt(p2)
      speakText(p2s)
      setTimeout(() => {
        setSlide2(false)
        setSlide3(true)
        setPrompt(p3)
        speakText(p3s)
        setTimeout(() => {
          setSlide3(false)
          setSlide4(true)
          setPrompt(p4)
          speakText(p4s)
          setTimeout(() => {
            setSlide4(false)
            setSlide5(true)
            setPrompt(p5)
            speakText(p5s)
          }, 10000)
        }, 10000)
      }, 10000)
    }, 10000)
  }, [])

  return (
    <div className="Images"><img src={prompt}/></div>
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