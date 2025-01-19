import axios from 'axios'

export async function extractImages(setImages, cohereInfo) {
    try {
        const [response1, response2, response3, response4, response5] = await Promise.all([
          axios.get('https://api.example.com/data1'),
          axios.get('https://api.example.com/data2'),
          axios.get('https://api.example.com/data3'),
          axios.get('https://api.example.com/data4'),
          axios.get('https://api.example.com/data5')
        ]);
  
        setImages([response1.data, response2.data, response3.data, response4.data, response5.data]);
  
      } catch (error) {
        throw new Error(error)
      } 
}

export async function extarctInfo(cohere, setData, setCohereInfo) {
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