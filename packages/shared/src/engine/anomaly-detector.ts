// packages/shared/src/engine/anomaly-detector.ts
import { RuleConfig, MetricPoint, Severity } from '../types';

export class AnomalyDetector {
  /**
   * Evaluates a rule against a metric value.
   * thresholdExpr is a simple string like "val < 5.5"
   */
  public static checkThreshold(value: number, thresholdExpr: string): boolean {
    try {
      // Basic expression evaluator (could be replaced with a safer parser like mathjs)
      // For now, we use a simple regex/eval approach restricted to 'val'
      const expression = thresholdExpr.replace(/val/g, value.toString());
      // CAUTION: eval is used here for simplicity in this demo, in prod use a safe evaluator
      return !!(eval(expression));
    } catch (e) {
      console.error(`Error evaluating threshold: ${thresholdExpr}`, e);
      return false;
    }
  }

  /**
   * Determines the severity based on the formula.
   * severityFormula is like "val < 4.0 ? 'P1' : 'P2'"
   */
  public static calculateSeverity(value: number, severityFormula: string): Severity {
    try {
      const expression = severityFormula.replace(/val/g, value.toString());
      const result = eval(expression);
      return (result as Severity) || 'P2';
    } catch (e) {
      console.error(`Error evaluating severity: ${severityFormula}`, e);
      return 'P2';
    }
  }
}
