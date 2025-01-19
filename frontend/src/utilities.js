export async function extractInfo(cohere, setData) {
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
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}