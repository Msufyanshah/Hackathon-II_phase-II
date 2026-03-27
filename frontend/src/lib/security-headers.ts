// Security headers and CSP policies for Vercel deployment

// Content Security Policy configuration
export const cspHeaders = {
  // Define the Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.todo-app.local https://api.todo-app.vercel.app",
    "frame-ancestors 'none'", // Prevent clickjacking
    "object-src 'none'", // Prevent plugins
    "base-uri 'self'",
    "report-uri /csp-report" // Endpoint to receive CSP violations
  ].join('; '),

  // X-Frame-Options to prevent clickjacking
  'X-Frame-Options': 'DENY',

  // X-Content-Type-Options to prevent MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Referrer Policy to control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy to control browser features
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

  // XSS Protection (for older browsers)
  'X-XSS-Protection': '1; mode=block',

  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

// Security middleware function
export const addSecurityHeaders = (res: any) => {
  Object.entries(cspHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
};

// Generate CSP nonce for inline scripts
export const generateNonce = () => {
  // In a real implementation, this would generate a cryptographically secure random value
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get CSP header with nonce for inline scripts
export const getCspHeaderWithNonce = (nonce: string) => {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' https://cdn.jsdelivr.net https://unpkg.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.todo-app.local https://api.todo-app.vercel.app",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');
};

// Security policies for Next.js
export const securityConfig = {
  // Headers configuration for Next.js
  headers: () => {
    return [
      {
        source: '/(.*)',
        headers: Object.entries(cspHeaders).map(([key, value]) => ({
          key,
          value
        }))
      }
    ];
  },

  // Redirect HTTP to HTTPS in production
  redirects: () => {
    return [
      {
        source: '/(.*)',
        destination: 'https://todo-app.vercel.app/:path*',
        permanent: true,
        basePath: false,
        has: [
          {
            type: 'host',
            value: 'www.todo-app.local',
          },
        ],
      },
    ];
  }
};

// Validate incoming request for security
export const validateRequestSecurity = (req: any) => {
  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'x-originating-ip'
  ];

  // Basic validation to detect potential security issues
  const userAgent = req.headers.get('user-agent') || '';
  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';

  // Block requests with suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // Potential XSS
    /javascript:/i, // Potential XSS
    /vbscript:/i // Potential XSS
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(req.url) || pattern.test(userAgent) || pattern.test(origin) || pattern.test(referer)) {
      throw new Error('Suspicious request blocked');
    }
  }

  // Validate content type for POST requests
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers.get('content-type');
    if (contentType && !contentType.startsWith('application/json') &&
        !contentType.startsWith('multipart/form-data') &&
        !contentType.startsWith('application/x-www-form-urlencoded')) {
      throw new Error('Invalid content type');
    }
  }

  return true;
};

// Sanitize user input
export const sanitizeInput = (input: string) => {
  // Basic sanitization to prevent XSS
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Generate security report
export const generateSecurityReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    cspEnabled: true,
    xssProtectionEnabled: true,
    clickjackingProtectionEnabled: true,
    hstsEnabled: true,
    contentTypeSniffingProtection: true,
    securityHeaders: Object.keys(cspHeaders)
  };

  return report;
};

// Security utilities for API routes
export const apiSecurity = {
  // Rate limiting (simplified implementation)
  rateLimit: (identifier: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
    // In a real implementation, this would track requests in a database
    // For now, just return a mock implementation
    return {
      check: async () => {
        // This would check the database for request count
        return { allowed: true, remaining: maxRequests };
      }
    };
  },

  // Input validation
  validateInput: (data: any, schema: any) => {
    // In a real implementation, this would validate against a schema
    // For now, just return true
    return { valid: true, errors: [] };
  }
};

export default {
  cspHeaders,
  addSecurityHeaders,
  generateNonce,
  getCspHeaderWithNonce,
  securityConfig,
  validateRequestSecurity,
  sanitizeInput,
  generateSecurityReport,
  apiSecurity
};