// packages/shared/src/types/index.ts
import { z } from 'zod';

export const SeveritySchema = z.enum(['P1', 'P2', 'P3']);
export type Severity = z.infer<typeof SeveritySchema>;

export const AlertStatusSchema = z.enum(['OPEN', 'ACK', 'RESOLVED', 'ESCALATED']);
export type AlertStatus = z.infer<typeof AlertStatusSchema>;

export interface RuleConfig {
  code: string;
  name: string;
  description?: string;
  source: string;
  metric: string;
  windowSeconds: number;
  thresholdExpr: string;
  severityFormula: string;
  channelTarget: string;
  mentionList: string[];
  templateId: string;
  buttons: AlertButton[];
  escalationPolicy: EscalationPolicy;
}

export interface AlertButton {
  label: string;
  action: string;
  role?: 'executor' | 'leader' | 'ceo';
}

export interface EscalationPolicy {
  stage1_m: number; // minutes for overdue_ack
  stage2_m: number; // minutes for manager escalation
}

export interface MetricPoint {
  entityId: string;
  metric: string;
  value: number;
  timestamp: string; // ISO format
}
