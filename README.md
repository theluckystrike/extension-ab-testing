# extension-ab-testing — A/B Testing Framework for Chrome Extensions

[![npm version](https://img.shields.io/npm/v/extension-ab-testing.svg)](https://www.npmjs.com/package/extension-ab-testing)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)]()

> **Built by [Zovo](https://zovo.one)** — A/B testing across 18+ Chrome extensions

**Weighted variant selection, conversion tracking, and statistical significance testing** at 95% confidence level. Zero runtime dependencies.

## 📦 Install

```bash
npm install extension-ab-testing
```

## 🚀 Quick Start

```typescript
import { ABTesting } from 'extension-ab-testing';

// Create A/B testing instance
const ab = new ABTesting();

// Define an experiment with variants
ab.define('cta_test', 'CTA Button Color Test', ['blue', 'green'], [50, 50]);

// Get variant for current user (deterministic per user)
const variant = ab.getVariant('cta_test');

// Track conversion when user takes action
ab.convert('cta_test');

// Check results
const results = ab.getResults('cta_test');
/*
{
  blue: { impressions: 150, conversions: 30, rate: 20 },
  green: { impressions: 142, conversions: 45, rate: 31.69 }
}
*/

// Check statistical significance
if (ab.isSignificant('cta_test')) {
    console.log('Test is statistically significant!');
}
```

## ✨ Features

### Weighted Variants

Assign different weights to variants to control traffic distribution:

```typescript
// 80% control, 20% treatment
ab.define('feature_test', 'New Feature', ['control', 'treatment'], [80, 20]);
```

### Persistence

Save and load experiment state:

```typescript
// Save to chrome.storage
await ab.save();

// Load from chrome.storage
await ab.load();
```

### Statistical Significance

Built-in z-test for 95% confidence:

```typescript
ab.isSignificant('experiment_id');
// Returns true if results are statistically significant (requires 30+ impressions per variant)
```

## API Reference

### `ABTesting`

| Method | Description |
|--------|-------------|
| `define(id, name, variants, weights?)` | Define a new experiment |
| `getVariant(id)` | Get assigned variant for user |
| `convert(id)` | Track a conversion |
| `getResults(id)` | Get impressions, conversions, rates |
| `isSignificant(id)` | Check 95% confidence |
| `deactivate(id)` | Stop an experiment |
| `save()` | Persist to chrome.storage |
| `load()` | Load from chrome.storage |

## 📄 License

MIT — [Zovo](https://zovo.one)
