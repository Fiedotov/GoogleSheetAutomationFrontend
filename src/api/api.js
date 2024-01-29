const API_BASE_URL = 'http://95.164.44.248:3909/api/v1'; // Change this to your actual API base URL

export const fetchSheets = async () => {
  const response = await fetch(`${API_BASE_URL}/sheet`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createSheet = async (data) => {
  const response = await fetch(`${API_BASE_URL}/sheet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const updateSheet = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/sheet/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteSheet = async (id) => {
  const response = await fetch(`${API_BASE_URL}/sheet/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
