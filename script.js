document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById("root");
  const departing = "MEL";
  const destination = "LST";
  const url = `https://digitalapi.jetstar.com/v1/farecache/flights/batch/availability-with-fareclasses?flightCount=5&includeSoldOut=false&requestType=StarterAndMember&from=2025-11-01&end=2025-12-01&departures=${departing}&arrivals=${destination}&direction=outbound&paxCount=1&includeFees=true`;

  (async () => {
    const response = await fetch(url);
    const respBody = await response.json();
    const results = {};
    
    for (const respObj of respBody) {
      const { flights } = respObj.routes[`${departing.toLowerCase()}${destination.toLowerCase()}`];
  
      for (const flightDetails of Object.values(flights)) {
        for (const flight of flightDetails) {
          const { price, departureTime } = flight;
  
          price in results
            ? results[price].push(departureTime)
            : results[price] = [departureTime]
        }
      }
    }
  
    console.log(`${departing} -> ${destination}`, results);
  })();
});
