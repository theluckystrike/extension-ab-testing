# extension-ab-testing — A/B Testing Framework
> **Built by [Zovo](https://zovo.one)** | `npm i extension-ab-testing`

Weighted variants, conversion tracking, statistical significance testing at 95% confidence.

```typescript
import { ABTesting } from 'extension-ab-testing';
const ab = new ABTesting();
ab.define('cta_test', 'CTA Color', ['blue', 'green'], [50, 50]);
const variant = ab.getVariant('cta_test');
ab.convert('cta_test');
const significant = ab.isSignificant('cta_test');
```
MIT License
