document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('root');
  const departing = "MEL";
  const destination = "LST";
  const url = `https://digitalapi.jetstar.com/v1/farecache/flights/batch/availability-with-fareclasses?flightCount=5&includeSoldOut=false&requestType=StarterAndMember&from=2025-11-01&end=2025-12-01&departures=${departing}&arrivals=${destination}&direction=outbound&paxCount=1&includeFees=true`;

  (async () => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'culture': 'en-AU'
      }
    });
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

    const row = Object.assign(document.createElement('div'), {
      style: {
        display: 'flex'
      }
    });
    container.appendChild(row);

    for (const [key, values] of Object.entries(results) {
      const span = document.createElement('span');

      let rawHtml = `<h4>${key}</h4><ul>`;
      for (const val of values) {
        rawHtml += `<li>${val}</li>`;
      }
      rawHtml += `</ul>`;
      span.innerHTML = rawHtml;

      row.appendChild(span);
    }
  })();
});
