import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  // Try to get token from Authorization header or from cookies if needed
  const authHeader = req.headers.get('authorization');
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return { error: 'Not authorized, no token', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    return { user: decoded };
  } catch (error) {
    console.error(error);
    return { error: 'Not authorized, token failed', status: 401 };
  }
}
