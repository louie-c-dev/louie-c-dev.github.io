const { Components } = window;
const { DatePicker, Button } = Components;

const { useState, useEffect } = React;

const App = () => {
  const [fromDate, setFromDate ] = useState('');
  const [toDate, setToDate ] = useState('');
  const [flights, setFlights] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const today = new Date();
    const endDate = new Date(new Date().setMonth(today.getMonth() + 1));
    const formattedFromDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const formattedToDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    setFromDate(formattedFromDate);
    setToDate(formattedToDate);
    setTrigger(true);
  }, []);

  useEffect(() => {
    if (trigger) getFlights();
  }, [trigger])

  const fetchFlights = async (departing, destination) => {
    const url = `https://digitalapi.jetstar.com/v1/farecache/flights/batch/availability-with-fareclasses?flightCount=5&includeSoldOut=false&requestType=StarterAndMember&from=${fromDate}&end=${toDate}&departures=${departing}&arrivals=${destination}&direction=outbound&paxCount=1&includeFees=true`;
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

    return results;
  }

  const getFlights = async () => {
    const outbound = await fetchFlights("MEL", "LST");
    const inbound =  await fetchFlights("LST", "MEL");

    setFlights([
      ["MEL → LST", outbound],
      ["LST → MEL", inbound]
    ]);
  }

  return (
    <>
      <DatePicker id="from-date" name="fromDate" label="From:" value={fromDate} changeHandler={setFromDate} />
      <DatePicker id="to-date" name="toDate" label="To:" value={toDate} changeHandler={setToDate} />
      <Button label="Refetch" eventHandler={getFlights} />
      {flights.map(([direction, flightData], idx) => (
        <React.Fragment key={idx}>
          <h1>{direction}</h1>
          <div style={{ display: 'flex', width: '100vw', flexWrap: 'wrap', marginBottom: '32px' }}>
            {Object.entries(flightData).map(([price, flightTimes], jdx) => (
              <React.Fragment key={jdx}>
                <span>
                  <h3 style={{ marginBottom: 0 }}>${price}</h3>
                  <ul>
                    {flightTimes.map((flight, kdx) => (
                      <li key={kdx}>{new Date(flight).toLocaleString()}</li>
                    ))}
                  </ul>
                </span>
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
