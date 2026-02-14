// server/src/routes/auth.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();
const DEV_PASSWORD = process.env.DEV_AUTH_PASSWORD || 'password123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DEV_RECRUITER_EMAIL = 'recruiter@test.com';
const DEV_CANDIDATE_EMAIL = 'candidate@test.com';

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

async function verifyPassword(inputPassword: string, passwordHash: string): Promise<boolean> {
  const raw = inputPassword.trim();
  if (!raw) return false;

  const hashMatch = await bcrypt.compare(raw, passwordHash);
  if (hashMatch) return true;

  // Dev fallback so local login does not fail due to stale hash/env mismatch.
  return raw === DEV_PASSWORD;
}

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

    const normalizedEmail = normalizeEmail(email);

    // Find user (replace with database query)
    const user = mockUsers.recruiters.find(u => normalizeEmail(u.email) === normalizedEmail);
    
    if (!user) {
      return res.status(401).json({
        error: `Invalid email or password. Dev recruiter: ${DEV_RECRUITER_EMAIL} / ${DEV_PASSWORD}`,
      });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({
        error: `Invalid email or password. Dev recruiter: ${DEV_RECRUITER_EMAIL} / ${DEV_PASSWORD}`,
      });
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

    const normalizedEmail = normalizeEmail(email);

    // Find user (replace with database query)
    const user = mockUsers.candidates.find(u => normalizeEmail(u.email) === normalizedEmail);
    
    if (!user) {
      return res.status(401).json({
        error: `Invalid email or password. Dev candidate: ${DEV_CANDIDATE_EMAIL} / ${DEV_PASSWORD}`,
      });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({
        error: `Invalid email or password. Dev candidate: ${DEV_CANDIDATE_EMAIL} / ${DEV_PASSWORD}`,
      });
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

// OAuth Login bridge (Supabase/Google -> app JWT session)
router.post('/oauth/login', (req, res) => {
  const { email, name, role } = req.body as {
    email?: string;
    name?: string;
    role?: string;
  };

  if (typeof email !== 'string' || typeof role !== 'string') {
    return res.status(400).json({ error: 'email and role are required' });
  }

  const normalizedEmail = normalizeEmail(email);
  const selectedRole = role === 'candidate' ? 'candidate' : 'recruiter';

  const fallbackName =
    typeof name === 'string' && name.trim().length > 0
      ? name.trim()
      : selectedRole === 'candidate'
        ? 'Candidate User'
        : 'Recruiter User';

  const user =
    selectedRole === 'candidate'
      ? {
          email: normalizedEmail,
          role: 'candidate' as const,
          name: fallbackName,
          github: normalizedEmail.split('@')[0],
        }
      : {
          email: normalizedEmail,
          role: 'recruiter' as const,
          name: fallbackName,
          company: 'Google OAuth',
        };

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    token,
    user,
  });
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

router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string; role?: string; name?: string };
    if (!decoded.email || !decoded.role) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    if (decoded.role === 'recruiter') {
      const user = mockUsers.recruiters.find((u) => normalizeEmail(u.email) === normalizeEmail(decoded.email || ''));
      if (!user) {
        return res.status(404).json({ error: 'Recruiter profile not found' });
      }
      return res.json({
        email: user.email,
        role: 'recruiter',
        name: user.name,
        company: user.company,
      });
    }

    if (decoded.role === 'candidate') {
      const user = mockUsers.candidates.find((u) => normalizeEmail(u.email) === normalizeEmail(decoded.email || ''));
      if (!user) {
        return res.status(404).json({ error: 'Candidate profile not found' });
      }
      return res.json({
        email: user.email,
        role: 'candidate',
        name: user.name,
        github: user.github,
      });
    }

    return res.status(401).json({ error: 'Invalid role in token' });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
