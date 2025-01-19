import axios from 'axios'
//require ('dotenv').config()
import { AK1, AK2, AK3, AK4, AK5 } from './apikeys';
 

export async function extractImages(setImages, cohereInfo) {

    console.log("cohere", cohereInfo)
    let prompt1 = "Create a realistic image of the following country and what it might be famous for: " + cohereInfo.country;
    let prompt2 = "Create a realistic image of a factory that produces fast fashion clothes in this country: " + cohereInfo.country;
    let prompt3 = "Create a realistic image of the materials that are given in the following list " + JSON.stringify(cohereInfo.fabric);
    let prompt4 = "Create a realistic image of poor people and children in this country: " + cohereInfo.country;
    let prompt5 = "Create a realistic image of the sources (plant and animal) that are needed in the following list: " + JSON.stringify(cohereInfo.fabric );
    console.log("ok",JSON.stringify(prompt1))
    try {
        // Promise.all([
          axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', cohereInfo, {
            headers: {
              Authorization: "Bearer " + AK1,
              "Content-Type": "application/json",
            }, method: "POST",
			body: JSON.stringify({'"prompt"': prompt1}),
          })
        //   axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', cohereInfo, {
        //     headers: {
        //       Authorization: "Bearer " + AK2,
        //       "Content-Type": "application/json",
        //     },method: "POST",
		// 	body: JSON.stringify(prompt2),
        //   }),
        //   axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', cohereInfo, {
        //     headers: {
        //       Authorization: "Bearer " + AK3,
        //       "Content-Type": "application/json",
        //     }, 
        //     method: "POST",
		// 	body: JSON.stringify(prompt3),
        //   }),
        //   axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', cohereInfo, {
        //     headers: {
        //       Authorization: "Bearer " + AK4,
        //       "Content-Type": "application/json",
        //     }, 
        //     method: "POST",
		// 	body: JSON.stringify(prompt4),
        //   }),
        //   axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', cohereInfo, {
        //     headers: {
        //       Authorization: "Bearer " + AK5,
        //       "Content-Type": "application/json",
        //     }, 
        //     method: "POST",
		// 	body: JSON.stringify(prompt5),
        //   })
        .then((response) => {console.log(response)})
  
        //setImages([response1.data, response2.data, response3.data, response4.data, response5.data]);
  
      } catch (error) {
        throw new Error(error)
      } 
}

export async function extractInfo(cohere, setData, setCohereInfo) {
    try {
        console.log("COHERE: " + cohere)
        const response = await fetch(`http://localhost:5000/extract/${cohere}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
        setCohereInfo(data)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
		{
			headers: {
				Authorization: "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}