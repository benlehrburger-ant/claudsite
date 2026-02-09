---
name: security-scan
description: Scan the codebase for security vulnerabilities and provide remediation advice (runs as background agent)
allowed-tools: Bash, Glob, Grep, Read, Task
model: opus
---

# Security Vulnerability Scan

Run this as a background subagent to scan for security vulnerabilities autonomously.

## Instructions

Use the Task tool with `subagent_type: "general-purpose"` and `run_in_background: true` to spawn an agent that performs the following security review.

## Scan Areas

Review the following security concerns:

### 1. Injection Vulnerabilities

- **SQL Injection**: Check database queries in `server.js` and any database interactions for unsanitized user input
- **Command Injection**: Look for any shell command execution with user-controlled input
- **XSS (Cross-Site Scripting)**: Review EJS templates in `views/` for unescaped user content

### 2. Authentication & Authorization

- Check for missing authentication on admin routes (`/admin/*`)
- Review session management and cookie security settings
- Look for hardcoded credentials or API keys

### 3. Data Exposure

- Check for sensitive data in logs or error messages
- Review API responses for data leakage
- Look for secrets committed to the repository

### 4. Dependency Vulnerabilities

- Run `npm audit` to check for known vulnerabilities in dependencies
- Review `package.json` for outdated packages with security issues

### 5. Configuration Security

- Check for debug mode enabled in production
- Review CORS configuration
- Check for missing security headers (CSP, X-Frame-Options, etc.)

### 6. Input Validation

- Review all user input handling in routes
- Check file upload handling if present
- Validate URL parameters and query strings

## Output Format

For each finding, provide:

1. **Severity**: Critical / High / Medium / Low
2. **Location**: File path and line number
3. **Description**: What the vulnerability is
4. **Recommendation**: How to fix it
5. **Code Example**: Show the fix if applicable

Start by scanning the main entry points: `server.js`, routes, and templates.
