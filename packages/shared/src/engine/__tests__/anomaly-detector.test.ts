// packages/shared/src/engine/__tests__/anomaly-detector.test.ts
import { AnomalyDetector } from '../anomaly-detector';

describe('AnomalyDetector', () => {
  test('should detect anomaly when value is below threshold', () => {
    const threshold = 'val < 5.5';
    expect(AnomalyDetector.checkThreshold(3.8, threshold)).toBe(true);
    expect(AnomalyDetector.checkThreshold(6.0, threshold)).toBe(false);
  });

  test('should calculate P1 severity for critical deviation', () => {
    const formula = "val < 4.0 ? 'P1' : 'P2'";
    expect(AnomalyDetector.calculateSeverity(3.5, formula)).toBe('P1');
    expect(AnomalyDetector.calculateSeverity(4.5, formula)).toBe('P2');
  });
});
