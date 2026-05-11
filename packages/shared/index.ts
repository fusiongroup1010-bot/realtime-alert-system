// packages/shared/index.ts
export * from './src/types/index.ts';
import defaultRules from './src/rules/default-rules.json' with { type: 'json' };
export { defaultRules };

export class AnomalyDetector {
  public static checkThreshold(value: number, thresholdExpr: string): boolean {
    try {
      const expression = thresholdExpr.replace(/val/g, value.toString());
      return !!(eval(expression));
    } catch (e) {
      console.error(`Error evaluating threshold: ${thresholdExpr}`, e);
      return false;
    }
  }

  public static calculateSeverity(value: number, severityFormula: string): any {
    try {
      const expression = severityFormula.replace(/val/g, value.toString());
      const result = eval(expression);
      return result || 'P2';
    } catch (e) {
      console.error(`Error evaluating severity: ${severityFormula}`, e);
      return 'P2';
    }
  }
}
