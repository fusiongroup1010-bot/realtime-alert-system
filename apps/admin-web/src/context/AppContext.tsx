'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Toast, { ToastData, SeverityType } from '@/components/ui/Toast';

// ─── Storage versioning (bump to reset localStorage on schema changes) ───────
const STORAGE_VERSION = 'v4';

// ─── Personnel mapping per team ───────────────────────────────────────────────
export const PERSONNEL: Record<string, { executor: string; manager: string }> = {
  'Online Sales':     { executor: 'Nguyễn Văn A',    manager: 'Trần Thị Quản Lý' },
  'Logistics':        { executor: 'Trần Thị B',       manager: 'Lê Văn Trưởng Nhóm' },
  'Customer Service': { executor: 'Lê Văn C',         manager: 'Phạm Thị Manager' },
  'Offline':          { executor: 'Phạm Thị D',       manager: 'Hoàng Văn Manager' },
  'System':           { executor: 'Hệ thống / System', manager: 'Hệ thống / System' },
};

// ─── ID Generator: FS-10AB-{ruleCode} where AB = 01, 02, 03... ───────────────
function generateIncidentId(ruleCode: string): string {
  const counterKey = 'alert_system_incident_counter';
  const current = parseInt(localStorage.getItem(counterKey) || '0', 10);
  const next = current + 1;
  localStorage.setItem(counterKey, String(next));
  const padded = String(next).padStart(2, '0');
  return `FS-10${padded}-${ruleCode}`;
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface Rule {
  id: string;
  code: string;
  name: string;
  metric: string;
  condition: string;
  target: string;
  severity: string;
  cooldown: string;
  status: 'Active' | 'Paused';
  triggers: number;
}

interface Incident {
  id: string;
  date: string;           // YYYY-MM-DD — which day this incident occurred
  ruleCode: string;
  time: string;
  status: 'NEW' | 'PROCESSING' | 'RESOLVED' | 'NOTIFY_CEO' | 'ESCALATED';
  team: string;
  assigneeExecutor: string;
  assigneeManager: string;
  slaDeadline: string | null;
  dept: string;
}

type Role = 'Executor' | 'Manager';

export interface NotificationItem {
  id: string;
  msg: string;
  en: string;
  time: string;
  severity: SeverityType;
  read: boolean;
  incidentId: string;
  targetRole?: Role;
}

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AppContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  currentTime: string;
  rules: Rule[];
  addRule: (rule: Omit<Rule, 'id' | 'triggers'>) => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  toggleRule: (id: string) => void;
  deleteRule: (id: string) => void;
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  evaluateMetrics: (metrics: Record<string, number>) => void;
  handleIncidentAction: (id: string, actionType: 'ACK' | 'RESOLVE' | 'NOTIFY') => void;
  currentUserRole: Role;
  setCurrentUserRole: (role: Role) => void;
  currentUser: User | null;
  login: (id: string, pw: string) => boolean;
  logout: () => void;
  showToast: (msg: string, en?: string, type?: SeverityType) => void;
  notifications: NotificationItem[];
  addNotification: (msg: string, en: string, severity: SeverityType, incidentId: string, targetRole?: Role) => void;
  markNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_RULES: Rule[] = [
  { id: 'R1', code: 'A1', name: 'ROAS Drop < 10',      metric: 'ROAS',             condition: '< 10',   target: '#online-ops',     severity: 'P1', cooldown: '15m', status: 'Active', triggers: 12 },
  { id: 'R2', code: 'A2', name: 'CS Response > 5m',    metric: 'CS First Response', condition: '> 5 min', target: '#cs-realtime',    severity: 'P2', cooldown: '10m', status: 'Active', triggers: 8  },
  { id: 'R3', code: 'A3', name: 'Stock Cover < 1.5x',  metric: 'Stock Cover Ratio', condition: '< 1.5x', target: '#logistics-stock', severity: 'P2', cooldown: '30m', status: 'Active', triggers: 4  },
  { id: 'R4', code: 'A4', name: 'Shop check in > 20',  metric: 'Shop check in',    condition: '> 20',   target: '#offline-ops',    severity: 'P3', cooldown: '60m', status: 'Active', triggers: 0  },
];

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TWO_DAYS_AGO = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

const DEFAULT_INCIDENTS: Incident[] = [
  {
    id: 'FS-1001-A1', date: TODAY, ruleCode: 'A1', time: '14:05', status: 'NEW',
    team: 'Online Sales', dept: 'Online',
    assigneeExecutor: PERSONNEL['Online Sales'].executor,
    assigneeManager:  PERSONNEL['Online Sales'].manager,
    slaDeadline: new Date(Date.now() + 15 * 60000).toISOString(),
  },
  {
    id: 'FS-1002-A3', date: TODAY, ruleCode: 'A3', time: '13:42', status: 'PROCESSING',
    team: 'Logistics', dept: 'Logistics',
    assigneeExecutor: PERSONNEL['Logistics'].executor,
    assigneeManager:  PERSONNEL['Logistics'].manager,
    slaDeadline: new Date(Date.now() + 8 * 60000).toISOString(),
  },
  {
    id: 'FS-1003-A2', date: TODAY, ruleCode: 'A2', time: '13:10', status: 'RESOLVED',
    team: 'Customer Service', dept: 'CS',
    assigneeExecutor: PERSONNEL['Customer Service'].executor,
    assigneeManager:  PERSONNEL['Customer Service'].manager,
    slaDeadline: null,
  },
  {
    id: 'FS-1004-A1', date: YESTERDAY, ruleCode: 'A1', time: '10:15', status: 'RESOLVED',
    team: 'Online Sales', dept: 'Online',
    assigneeExecutor: PERSONNEL['Online Sales'].executor,
    assigneeManager:  PERSONNEL['Online Sales'].manager,
    slaDeadline: null,
  },
  {
    id: 'FS-1005-A2', date: YESTERDAY, ruleCode: 'A2', time: '08:45', status: 'RESOLVED',
    team: 'Customer Service', dept: 'CS',
    assigneeExecutor: PERSONNEL['Customer Service'].executor,
    assigneeManager:  PERSONNEL['Customer Service'].manager,
    slaDeadline: null,
  },
  {
    id: 'FS-1006-A3', date: TWO_DAYS_AGO, ruleCode: 'A3', time: '11:20', status: 'RESOLVED',
    team: 'Logistics', dept: 'Logistics',
    assigneeExecutor: PERSONNEL['Logistics'].executor,
    assigneeManager:  PERSONNEL['Logistics'].manager,
    slaDeadline: null,
  },
];

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime]   = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<Role>('Executor');
  const [activeToasts, setActiveToasts] = useState<ToastData[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const incidentsRef = useRef<Incident[]>([]);
  const rulesRef     = useRef<Rule[]>([]);
  const roleRef      = useRef<Role>('Executor');

  const [rules,     setRules]     = useState<Rule[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // ── Initialize: check storage version, load or set defaults ────────────────
  useEffect(() => {
    const storedVersion = localStorage.getItem('alert_system_version');

    // If version mismatch, clear old storage and reinitialise
    if (storedVersion !== STORAGE_VERSION) {
      localStorage.removeItem('alert_system_rules');
      localStorage.removeItem('alert_system_incidents');
      localStorage.removeItem('alert_system_incident_counter');
      localStorage.setItem('alert_system_version', STORAGE_VERSION);
      // Seed counter so next new incident starts at 6
      localStorage.setItem('alert_system_incident_counter', '5');
    }

    const savedRules     = localStorage.getItem('alert_system_rules');
    const savedIncidents = localStorage.getItem('alert_system_incidents');

    setRules(savedRules ? JSON.parse(savedRules) : DEFAULT_RULES);

    if (savedIncidents) {
      // Migration: add date field to old incidents that don't have it
      const parsed: any[] = JSON.parse(savedIncidents);
      const today = new Date().toISOString().split('T')[0];
      const migrated = parsed.map(inc => (inc.date ? inc : { ...inc, date: today }));
      setIncidents(migrated);
    } else {
      setIncidents(DEFAULT_INCIDENTS);
    }

    const savedUser = localStorage.getItem('alert_system_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentUserRole(user.role);
    }
  }, []);

  // ── Persist state to localStorage ─────────────────────────────────────────
  useEffect(() => { if (rules.length > 0)     localStorage.setItem('alert_system_rules',     JSON.stringify(rules));     }, [rules]);
  useEffect(() => { if (incidents.length > 0) localStorage.setItem('alert_system_incidents', JSON.stringify(incidents)); }, [incidents]);

  // ── Keep refs fresh ────────────────────────────────────────────────────────
  useEffect(() => {
    incidentsRef.current = incidents;
    rulesRef.current     = rules;
    roleRef.current      = currentUserRole;
  }, [incidents, rules, currentUserRole]);

  // ── Request browser notification permission ─────────────────────────────────
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showToast = (message: string, enMessage: string = '', type: SeverityType = 'info', incidentId?: string) => {
    const id = incidentId ? `toast-${incidentId}` : `toast-${Date.now()}-${Math.random()}`;
    setActiveToasts(prev => {
      if (incidentId && prev.some(t => t.id === id)) return prev;
      return [...prev, { id, message, enMessage, type }];
    });
  };

  const removeToast = (id: string) => setActiveToasts(prev => prev.filter(t => t.id !== id));

  // ── Notification helpers ───────────────────────────────────────────────────
  const addNotification = (msg: string, en: string, severity: SeverityType, incidentId: string, targetRole?: Role) => {
    setNotifications(prev => {
      // Allow multiple notifications for the same incident if they are different messages (e.g. triggered vs escalated)
      return [{
        id: `NOTIF-${Date.now()}`,
        msg, en, severity,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        incidentId,
        targetRole,
      }, ...prev];
    });
  };

  const markNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const sendBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  // ── Clock + SLA auto-escalation loop ──────────────────────────────────────
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      const toEscalate = incidentsRef.current.filter(inc =>
        (inc.status === 'NEW' || inc.status === 'PROCESSING') &&
        inc.slaDeadline && now.getTime() >= new Date(inc.slaDeadline).getTime()
      );

      if (toEscalate.length > 0) {
        toEscalate.forEach(inc => {
          const rule     = rulesRef.current.find(r => r.code === inc.ruleCode);
          const severity = (rule ? rule.severity : 'P3') as SeverityType;
          if (roleRef.current === 'Executor') {
            showToast(`⚠️ Sự cố ${inc.id} vượt quá SLA - Đã tự động Báo Quản Lý`, 'Auto-escalated to Manager due to SLA timeout', 'P1', inc.id);
            addNotification(`Sự cố ${inc.id} vượt quá SLA: Đã tự động Báo Quản Lý`, `Incident ${inc.id} escalated to Manager (SLA Timeout)`, 'P1', inc.id, 'Manager');
          } else {
            showToast(`[SLA PING] Sự cố ${inc.id} quá hạn xử lý!`, 'Needs immediate Manager intervention', severity, inc.id);
            addNotification(`[SLA PING] Sự cố ${inc.id} quá hạn xử lý!`, `Critical SLA timeout for incident ${inc.id}`, severity, inc.id, 'Manager');
            sendBrowserNotification('Báo Động SLA (Manager)', `Sự cố ${inc.id} vượt quá ngưỡng an toàn!`);
          }
        });

        setIncidents(prev => prev.map(inc =>
          toEscalate.find(e => e.id === inc.id)
            ? { ...inc, status: 'ESCALATED', slaDeadline: null }
            : inc
        ));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Rule CRUD ──────────────────────────────────────────────────────────────
  const addRule = (newRule: Omit<Rule, 'id' | 'triggers'>) => {
    setRules(prev => [...prev, { ...newRule, id: `R${prev.length + 1}`, triggers: 0 }]);
  };

  const updateRule = (id: string, updates: Partial<Rule>) =>
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

  const toggleRule = (id: string) =>
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r));

  const deleteRule = (id: string) => setRules(prev => prev.filter(r => r.id !== id));

  // ── addIncident (new FS-10AB-Ax format) ───────────────────────────────────
  const addIncident = (incident: Omit<Incident, 'id'>) => {
    const id = generateIncidentId(incident.ruleCode);
    const today = new Date().toISOString().split('T')[0];
    const newIncident: Incident = { ...incident, id, date: incident.date || today };
    setIncidents(prev => [newIncident, ...prev]);
    setRules(prev => prev.map(r => r.code === incident.ruleCode ? { ...r, triggers: r.triggers + 1 } : r));
  };

  // ── evaluateMetrics: compare uploaded data against active rules ────────────
  const evaluateMetrics = (metrics: Record<string, number>) => {
    const metricToRule: Record<string, string> = { roas: 'A1', csResponse: 'A2', stockCover: 'A3', shopCheckIn: 'A4' };
    const metricLabels: Record<string, string> = {
      roas: 'ROAS', csResponse: 'CS First Response', stockCover: 'Stock Cover Ratio', shopCheckIn: 'Shop check in',
    };
    const teamMap: Record<string, string> = {
      roas: 'Online Sales', csResponse: 'Customer Service', stockCover: 'Logistics', shopCheckIn: 'Offline',
    };
    const deptMap: Record<string, string> = { roas: 'Online', csResponse: 'CS', stockCover: 'Logistics', shopCheckIn: 'Offline' };

    Object.entries(metrics).forEach(([metricKey, value]) => {
      const ruleCode = metricToRule[metricKey];
      if (!ruleCode) return;
      const rule = rulesRef.current.find(r => r.code === ruleCode && r.status === 'Active');
      if (!rule) return;

      // Parse threshold from rule.condition
      const condMatch = rule.condition.match(/(>|<)\s*([\d.]+)/);
      if (!condMatch) return;
      const op        = condMatch[1];
      const threshold = parseFloat(condMatch[2]);
      const violated  = op === '<' ? value < threshold : value > threshold;

      if (violated) {
        const severity    = rule.severity as SeverityType;
        const teamName    = teamMap[metricKey] || 'System';
        const incidentId  = generateIncidentId(ruleCode);

        const newInc: Incident = {
          id:               incidentId,
          date:             new Date().toISOString().split('T')[0],
          ruleCode,
          time:             new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status:           'NEW',
          team:             teamName,
          dept:             deptMap[metricKey] || 'System',
          assigneeExecutor: (PERSONNEL[teamName] || PERSONNEL['System']).executor,
          assigneeManager:  (PERSONNEL[teamName] || PERSONNEL['System']).manager,
          slaDeadline:      new Date(Date.now() + 15 * 60000).toISOString(),
        };

        setIncidents(prev => [newInc, ...prev]);
        setRules(prev => prev.map(r => r.code === ruleCode ? { ...r, triggers: r.triggers + 1 } : r));

        showToast(
          `🚨 Quy tắc ${ruleCode} bị kích hoạt! ${metricLabels[metricKey]} = ${value}`,
          `Rule ${ruleCode} triggered! ${metricLabels[metricKey]} = ${value} violates ${rule.condition}`,
          severity, incidentId
        );
        addNotification(
          `Quy tắc ${ruleCode} kích hoạt: ${rule.name}`,
          `Rule ${ruleCode} triggered: ${rule.name}`,
          severity, incidentId
        );
      }
    });
  };

  // ── Incident action handler ────────────────────────────────────────────────
  const handleIncidentAction = (id: string, actionType: 'ACK' | 'RESOLVE' | 'NOTIFY') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      removeToast(`toast-${id}`);
      if (actionType === 'ACK')     return { ...inc, status: 'PROCESSING',   slaDeadline: new Date(Date.now() + 10 * 60000).toISOString() };
      if (actionType === 'RESOLVE') return { ...inc, status: 'RESOLVED',      slaDeadline: null };
      if (actionType === 'NOTIFY') {
        addNotification(
          `Nhân viên ${currentUser?.name || ''} đã chuyển sự cố ${id} cho bạn`,
          `Staff ${currentUser?.name || ''} manually escalated incident ${id}`,
          'P2', id, 'Manager'
        );
        return { ...inc, status: 'NOTIFY_CEO', slaDeadline: null };
      }
      return inc;
    }));
  };

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = (id: string, pw: string) => {
    if (pw !== 'FS1234') return false;
    let user: User | null = null;
    if (id === 'SaleOnlFS') user = { id, name: 'Nguyễn Văn A', role: 'Executor' };
    if (id === 'SalOnlMGFS') user = { id, name: 'Trần Thị Quản Lý', role: 'Manager' };

    if (user) {
      setCurrentUser(user);
      setCurrentUserRole(user.role);
      localStorage.setItem('alert_system_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('alert_system_user');
  };

  return (
    <AppContext.Provider value={{
      selectedDate, setSelectedDate, currentTime,
      rules, addRule, updateRule, toggleRule, deleteRule,
      incidents, addIncident, evaluateMetrics, handleIncidentAction,
      currentUserRole, setCurrentUserRole,
      currentUser, login, logout,
      showToast, notifications, addNotification, markNotificationsRead,
    }}>
      {children}
      <Toast toasts={activeToasts} onClose={removeToast} />
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
