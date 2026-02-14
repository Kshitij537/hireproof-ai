import { Router, Request, Response } from 'express';

const router = Router();

// Mock analysis data
const mockAnalysisData = {
  authenticityScore: 85,
  confidenceLevel: "High",
  recommendation: "SHORTLIST",
  skills: [
    {
      name: "React",
      confidence: 92,
      verified: true
    },
    {
      name: "Node.js",
      confidence: 85,
      verified: true
    },
    {
      name: "TypeScript",
      confidence: 88,
      verified: true
    },
    {
      name: "MongoDB",
      confidence: 78,
      verified: true
    },
    {
      name: "Machine Learning",
      confidence: 60,
      verified: false
    },
    {
      name: "AWS",
      confidence: 55,
      verified: false
    }
  ],
  projects: [
    {
      name: "Canteen Management System",
      technologies: ["React", "Node.js", "MongoDB"],
      confidence: 90,
      authenticity: "High"
    },
    {
      name: "E-Commerce Platform",
      technologies: ["React", "Express", "PostgreSQL"],
      confidence: 87,
      authenticity: "High"
    },
    {
      name: "Task Management App",
      technologies: ["TypeScript", "Node.js", "Redis"],
      confidence: 82,
      authenticity: "Medium"
    }
  ],
  risks: [
    "Machine Learning skill not strongly verified",
    "AWS experience claims need validation"
  ],
  roleMatchScore: 88,
  summary: "Candidate demonstrates strong backend and frontend skills with real project evidence. The profile shows consistent commit history and well-documented projects. Technical skills align well with modern web development practices."
};

/**
 * GET /api/analysis-result
 * Returns resume authenticity analysis data
 */
router.get('/analysis-result', (req: Request, res: Response) => {
  try {
    // Simulate API delay
    setTimeout(() => {
      res.status(200).json(mockAnalysisData);
    }, 800);
  } catch (error) {
    console.error('Error fetching analysis result:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis result',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;