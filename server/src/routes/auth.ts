// server/src/routes/auth.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

// Mock user database (replace with real database later)
const mockUsers = {
  recruiters: [
    {
      email: 'recruiter@test.com',
      password: '$2b$10$XqZ9R1h7Z8JZL6Xq9R1h7O9J9J9J9J9J9J9J9J9J9J9J9J9J9J9J', // "password123"
      name: 'John Recruiter',
      company: 'TechCorp'
    }
  ],
  candidates: [
    {
      email: 'candidate@test.com',
      password: '$2b$10$XqZ9R1h7Z8JZL6Xq9R1h7O9J9J9J9J9J9J9J9J9J9J9J9J9J9J9J', // "password123"
      name: 'Jane Candidate',
      github: 'janedoe'
    }
  ]
};

// Recruiter Login
router.post('/recruiter/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    // Find user (replace with database query)
    const user = mockUsers.recruiters.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password (for now, accept any password in development)
    // In production, use: const isValid = await bcrypt.compare(password, user.password);
    const isValid = true; // DEVELOPMENT ONLY
    
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
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
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
    // Find user (replace with database query)
    const user = mockUsers.candidates.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password (for now, accept any password in development)
    const isValid = true; // DEVELOPMENT ONLY
    
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
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;