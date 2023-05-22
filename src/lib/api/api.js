const { REACT_APP_API_URL: API_URL } = process.env;

const mappingDataEndpoint = `${API_URL}/mapping-data`;

export async function postMappingData(mappingData) {
  return fetch(mappingDataEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mappingData),
  });
}

export async function getMappingData() {
  return (await fetch(mappingDataEndpoint)).json();
}
