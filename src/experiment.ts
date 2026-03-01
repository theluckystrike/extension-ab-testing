/**
 * A/B Testing — Experiment framework with variants and conversion tracking
 */
export interface Experiment {
    id: string; name: string; variants: string[];
    weights?: number[]; active: boolean;
    conversions: Record<string, number>;
    impressions: Record<string, number>;
}

export class ABTesting {
    private experiments = new Map<string, Experiment>();
    private assignments = new Map<string, string>();
    private storageKey: string;

    constructor(storageKey: string = '__ab_tests__') { this.storageKey = storageKey; }

    /** Define an experiment */
    define(id: string, name: string, variants: string[], weights?: number[]): this {
        const conversions: Record<string, number> = {};
        const impressions: Record<string, number> = {};
        variants.forEach((v) => { conversions[v] = 0; impressions[v] = 0; });
        this.experiments.set(id, { id, name, variants, weights, active: true, conversions, impressions });
        return this;
    }

    /** Get assigned variant for user (deterministic) */
    getVariant(experimentId: string): string | null {
        const exp = this.experiments.get(experimentId);
        if (!exp || !exp.active) return null;

        const cached = this.assignments.get(experimentId);
        if (cached && exp.variants.includes(cached)) return cached;

        let variant: string;
        if (exp.weights) {
            const total = exp.weights.reduce((s, w) => s + w, 0);
            let rand = Math.random() * total;
            let idx = 0;
            for (let i = 0; i < exp.weights.length; i++) { rand -= exp.weights[i]; if (rand <= 0) { idx = i; break; } }
            variant = exp.variants[idx];
        } else {
            variant = exp.variants[Math.floor(Math.random() * exp.variants.length)];
        }

        this.assignments.set(experimentId, variant);
        exp.impressions[variant]++;
        return variant;
    }

    /** Track a conversion */
    convert(experimentId: string): void {
        const exp = this.experiments.get(experimentId);
        const variant = this.assignments.get(experimentId);
        if (exp && variant) exp.conversions[variant]++;
    }

    /** Get conversion rate per variant */
    getResults(experimentId: string): Record<string, { impressions: number; conversions: number; rate: number }> | null {
        const exp = this.experiments.get(experimentId);
        if (!exp) return null;
        const results: Record<string, { impressions: number; conversions: number; rate: number }> = {};
        exp.variants.forEach((v) => {
            const imp = exp.impressions[v]; const conv = exp.conversions[v];
            results[v] = { impressions: imp, conversions: conv, rate: imp > 0 ? Math.round((conv / imp) * 10000) / 100 : 0 };
        });
        return results;
    }

    /** Check if result is statistically significant (basic chi-squared) */
    isSignificant(experimentId: string): boolean {
        const exp = this.experiments.get(experimentId);
        if (!exp || exp.variants.length !== 2) return false;
        const [a, b] = exp.variants;
        const nA = exp.impressions[a]; const nB = exp.impressions[b];
        const cA = exp.conversions[a]; const cB = exp.conversions[b];
        if (nA < 30 || nB < 30) return false;
        const pA = cA / nA; const pB = cB / nB;
        const p = (cA + cB) / (nA + nB);
        const se = Math.sqrt(p * (1 - p) * (1 / nA + 1 / nB));
        if (se === 0) return false;
        const z = Math.abs(pA - pB) / se;
        return z > 1.96; // 95% confidence
    }

    /** Deactivate experiment */
    deactivate(experimentId: string): void {
        const exp = this.experiments.get(experimentId);
        if (exp) exp.active = false;
    }

    /** Save state to storage */
    async save(): Promise<void> {
        await chrome.storage.local.set({
            [this.storageKey]: { experiments: Object.fromEntries(this.experiments), assignments: Object.fromEntries(this.assignments) },
        });
    }

    /** Load state from storage */
    async load(): Promise<void> {
        const result = await chrome.storage.local.get(this.storageKey);
        const data = result[this.storageKey];
        if (data?.experiments) Object.entries(data.experiments).forEach(([k, v]) => this.experiments.set(k, v as Experiment));
        if (data?.assignments) Object.entries(data.assignments).forEach(([k, v]) => this.assignments.set(k, v as string));
    }
}
