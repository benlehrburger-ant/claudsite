# Code Review Based on Anthropic Best Practices

Review the recent code changes against Anthropic's engineering best practices.

## Steps

1. **Identify changes to review** - Run `git diff HEAD~1` or check staged changes with `git diff --cached` to see what code needs review

2. **Review for the following criteria:**

### Code Quality

- **Simplicity** - Is the code as simple as possible? Avoid over-engineering and unnecessary abstractions
- **Readability** - Is the code self-documenting? Are variable and function names clear?
- **No dead code** - Remove unused imports, variables, and functions completely
- **DRY but not premature** - Avoid duplication, but don't abstract too early

### Security

- **No hardcoded secrets** - API keys, passwords, tokens should never be in code
- **Input validation** - Validate user input at system boundaries
- **OWASP Top 10** - Check for XSS, SQL injection, command injection vulnerabilities
- **Least privilege** - Code should request minimal permissions

### Error Handling

- **Graceful failures** - Handle errors appropriately without crashing
- **Meaningful messages** - Error messages should help debugging
- **No silent failures** - Don't swallow exceptions without logging

### Testing

- **Test coverage** - Are new features tested?
- **Edge cases** - Are boundary conditions handled?
- **Test clarity** - Are tests readable and focused?

### Performance

- **No obvious bottlenecks** - Watch for N+1 queries, unnecessary loops
- **Resource cleanup** - Close connections, clear timeouts

3. **Provide feedback** - List specific issues with file paths and line numbers, categorized by severity (critical, warning, suggestion)

4. **Suggest improvements** - Offer concrete fixes for any issues found
