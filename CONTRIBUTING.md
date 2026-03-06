# Contributing to extension-ab-testing

Thank you for your interest in contributing.

## Reporting Issues

When reporting issues, please include:

1. A clear description of the problem
2. Steps to reproduce the issue
3. Expected behavior versus actual behavior
4. Chrome extension version and manifest version (MV2/MV3)
5. Any relevant error messages or console output

Use the issue tracker to report bugs and feature requests.

## Development Workflow

1. Fork the repository
2. Clone your fork: `git clone https://github.com/theluckystrike/extension-ab-testing.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests if applicable
7. Commit with a clear commit message
8. Push to your fork and submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns in the repository
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Run `npm run build` to verify TypeScript compiles without errors

## Testing

Before submitting a pull request, verify the build works:

```bash
npm run build
```

Ensure no TypeScript errors are present.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
