/**
 * {
 * "cotton": 25,
 * "polyester": 75
 * }
 * @param {*} fabrics
 */
export function getWater(fabrics) {
    // Water usage rates (L/g)
    const waterRates = {
      "Linen": 2.5,
      "Cotton": 10,
      "Polyester": 1 / 100,
      "Rayon": 10,
      "Chiffon": 0.5,
      "Wool": 100,
      "Jersey": 10,
      "Leather": 15,
      "Silk": 5
    };
  
    let water = 0; 
  
    // Loop 
    for (const [fabricName, quantity] of Object.entries(fabrics.fabric)) {
      const normalizedFabricName = fabricName.charAt(0).toUpperCase() + fabricName.slice(1).toLowerCase();
      
      // Check 
      if (waterRates[normalizedFabricName]) {
        // Multiply with water rate
        water += waterRates[normalizedFabricName] * quantity;
      }
      else{
        water += 10 * quantity;
      }
    }
  
    return water;
  }
  