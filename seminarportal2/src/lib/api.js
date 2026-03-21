// This file handles ALL communication between React and our backend
// Instead of calling Supabase directly, we call our Express API

const API_URL = 'http://localhost:5000/api'

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken')
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  })

  const data = await response.json()
  if (!data.success) throw new Error(data.message)
  return data
}

// Events API
export const eventsAPI = {
  getAll:  ()         => apiCall('/events'),
  getOne:  (id)       => apiCall(`/events/${id}`),
  create:  (data)     => apiCall('/events', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id, data) => apiCall(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:  (id)       => apiCall(`/events/${id}`, { method: 'DELETE' }),
}

// Registrations API
export const registrationsAPI = {
  create:  (data) => apiCall('/registrations', { method: 'POST', body: JSON.stringify(data) }),
  getByEvent: (eventId) => apiCall(`/registrations/${eventId}`),
  getAll:  ()     => apiCall('/registrations'),
}

// Auth API
export const authAPI = {
  login:  (email, password) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  verify: ()                => apiCall('/auth/verify'),
}