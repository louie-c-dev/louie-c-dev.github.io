document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const reFetchButton = document.getElementById('refetch-btn');

  const today = new Date();
  const endDate = new Date(new Date().setMonth(today.getMonth() + 1));

  const formattedFromDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const formattedToDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  const fromDate = document.getElementById('from-date');
  const toDate = document.getElementById('to-date');

  fromDate.value = formattedFromDate;
  toDate.value = formattedToDate;

  const getFlights = async (departing, destination) => {
    const url = `https://digitalapi.jetstar.com/v1/farecache/flights/batch/availability-with-fareclasses?flightCount=5&includeSoldOut=false&requestType=StarterAndMember&from=${fromDate.value}&end=${toDate.value}&departures=${departing}&arrivals=${destination}&direction=outbound&paxCount=1&includeFees=true`;
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

    const row = document.createElement('div');
    Object.assign(row.style, {
      display: 'flex',
      width: '100vw',
      flexWrap: 'wrap',
      marginBottom: '32px'
    });

    const heading = document.createElement('h1');
    heading.textContent = `${departing} → ${destination}`;

    container.appendChild(heading);
    container.appendChild(row);

    for (const [key, values] of Object.entries(results)) {
      const span = document.createElement('span');

      let rawHtml = `<h3 style="margin-bottom: 0;">$${key}</h3><ul>`;
      for (const val of values) {
        rawHtml += `<li>${new Date(val).toLocaleString()}</li>`;
      }
      rawHtml += `</ul>`;
      span.innerHTML = rawHtml;

      row.appendChild(span);
    }
  }

  reFetchButton.addEventListener('click', () => {
    container.innerHTML = '';

    getFlights("LST", "MEL");
    getFlights("MEL", "LST");
  });

  getFlights("LST", "MEL");
  getFlights("MEL", "LST");
});
