# extension-ab-testing

A/B testing framework for Chrome extensions. Built by theluckystrike.

## Overview

extension-ab-testing provides weighted variant selection, conversion tracking, and statistical significance testing for Chrome extensions. The library works with Manifest V3 and requires zero runtime dependencies.

## Install

```bash
npm install extension-ab-testing
```

## Quick Start

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

## Weighted Variants

Assign different weights to variants to control traffic distribution:

```typescript
// 80% control, 20% treatment
ab.define('feature_test', 'New Feature', ['control', 'treatment'], [80, 20]);
```

## Persistence

Save and load experiment state:

```typescript
// Save to chrome.storage
await ab.save();

// Load from chrome.storage
await ab.load();
```

## Statistical Significance

Built-in z-test for 95% confidence:

```typescript
ab.isSignificant('experiment_id');
// Returns true if results are statistically significant (requires 30+ impressions per variant)
```

## API Reference

### ABTesting Class

**constructor(storageKey?: string)**
Creates a new A/B testing instance. Default storage key is `__ab_tests__`.

**define(id: string, name: string, variants: string[], weights?: number[]): this**
Defines a new experiment with the given ID, name, variants, and optional weights.

**getVariant(experimentId: string): string | null**
Returns the assigned variant for the current user. Returns null if experiment is not found or inactive.

**convert(experimentId: string): void**
Records a conversion for the given experiment.

**getResults(experimentId: string): Record<string, { impressions: number; conversions: number; rate: number }> | null**
Returns impressions, conversions, and conversion rate per variant.

**isSignificant(experimentId: string): boolean**
Checks if the result is statistically significant at 95% confidence level. Requires 30+ impressions per variant.

**deactivate(experimentId: string): void**
Stops an experiment by setting its active flag to false.

**save(): Promise<void>**
Persists experiment state to chrome.storage.local.

**load(): Promise<void>**
Loads experiment state from chrome.storage.local.

## Experiment Interface

```typescript
interface Experiment {
    id: string;
    name: string;
    variants: string[];
    weights?: number[];
    active: boolean;
    conversions: Record<string, number>;
    impressions: Record<string, number>;
}
```

## Requirements

- Chrome Extensions API (@types/chrome)
- TypeScript 5.0+
- Manifest V3

## License

MIT License Copyright (c) 2025 theluckystrike

## About

extension-ab-testing is maintained by theluckystrike. Built for Chrome extension experimentation at zovo.one.
