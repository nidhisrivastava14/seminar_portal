

const express = require('express')  // Express helps us create the server
const cors    = require('cors')     // CORS allows React to talk to this server
require('dotenv').config()          // This reads our .env file
 

const app = express()
 
 
app.use(cors({
  origin: 'http://localhost:5173', // Only allow requests from our React app
  credentials: true
}))
 
app.use(express.json()) // This lets us read JSON data sent from React
 
const eventsRouter        = require('./routes/events')        // Events API
const registrationsRouter = require('./routes/registrations') // Registrations API
const authRouter          = require('./routes/auth')          // Login/Auth API
 
app.use('/api/events',        eventsRouter)
app.use('/api/registrations', registrationsRouter)
app.use('/api/auth',          authRouter)
 

app.get('/', (req, res) => {
  res.json({ message: 'AcademiX Backend is running! 🚀' })
})
 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})