const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    })
  }
}

module.exports = verifyToken
