// server/src/routes/auth.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();
const DEV_PASSWORD = process.env.DEV_AUTH_PASSWORD || 'password123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user database (replace with real database later)
const mockUsers = {
  recruiters: [
    {
      email: 'recruiter@test.com',
      passwordHash: bcrypt.hashSync(DEV_PASSWORD, 10),
      name: 'John Recruiter',
      company: 'TechCorp'
    }
  ],
  candidates: [
    {
      email: 'candidate@test.com',
      passwordHash: bcrypt.hashSync(DEV_PASSWORD, 10),
      name: 'Jane Candidate',
      github: 'janedoe'
    }
  ]
};

// Recruiter Login
router.post('/recruiter/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find user (replace with database query)
    const user = mockUsers.recruiters.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        role: 'recruiter',
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: 'recruiter',
        name: user.name,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Candidate Login
router.post('/candidate/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find user (replace with database query)
    const user = mockUsers.candidates.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        role: 'candidate',
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: 'candidate',
        name: user.name,
        github: user.github
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Verify Token (for protected routes)
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
