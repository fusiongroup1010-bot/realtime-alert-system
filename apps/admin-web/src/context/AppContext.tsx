'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '@/components/ui/Toast';

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
  ruleCode: string;
  time: string;
  status: 'NEW' | 'PROCESSING' | 'RESOLVED' | 'NOTIFY_CEO' | 'ESCALATED';
  team: string;
  assignee: string;
  slaDeadline: string | null;
  dept: string;
}

type Role = 'Executor' | 'Manager';
type SeverityType = 'P1' | 'P2' | 'P3' | 'info';

export interface NotificationItem {
  id: string;
  msg: string;
  en: string;
  time: string;
  severity: SeverityType;
  read: boolean;
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
  handleIncidentAction: (id: string, actionType: 'ACK' | 'RESOLVE' | 'NOTIFY') => void;
  currentUserRole: Role;
  setCurrentUserRole: (role: Role) => void;
  showToast: (msg: string, en?: string, type?: SeverityType) => void;
  notifications: NotificationItem[];
  addNotification: (msg: string, en: string, severity: SeverityType) => void;
  markNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<Role>('Executor');
  const [toast, setToast] = useState<{ visible: boolean; msg: string; en: string; type: SeverityType }>({ visible: false, msg: '', en: '', type: 'info' });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [rules, setRules] = useState<Rule[]>([
    { id: 'R1', code: 'A1', name: 'ROAS Drop < 5.5', metric: 'ROAS', condition: '< 5.5', target: '#online-ops', severity: 'P1', cooldown: '15m', status: 'Active', triggers: 12 },
    { id: 'R2', code: 'A2', name: 'CS Response > 5m', metric: 'CS First Response', condition: '> 5 min', target: '#cs-realtime', severity: 'P2', cooldown: '10m', status: 'Active', triggers: 8 },
    { id: 'R3', code: 'A3', name: 'Stock Cover < 1.5x', metric: 'Stock Cover Ratio', condition: '< 1.5x', target: '#logistics-stock', severity: 'P2', cooldown: '30m', status: 'Active', triggers: 4 },
    { id: 'R4', code: 'A4', name: 'Offline Popup Low Perf', metric: 'Popup Conversion', condition: '< 2%', target: '#offline-field', severity: 'P3', cooldown: '60m', status: 'Paused', triggers: 1 },
    { id: 'R5', code: 'A5', name: 'Delivery SLA Breach', metric: 'Delivery Time', condition: '> 48h', target: '#logistics-stock', severity: 'P1', cooldown: '20m', status: 'Active', triggers: 3 },
    { id: 'R6', code: 'A6', name: 'Cart Abandonment Spike', metric: 'Cart Abandon Rate', condition: '> 75%', target: '#online-ops', severity: 'P3', cooldown: '45m', status: 'Active', triggers: 6 },
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'ALT-101', ruleCode: 'A1', time: '14:05', status: 'NEW', team: 'Online Sales', assignee: 'Nguyen Van A', slaDeadline: new Date(Date.now() + 15 * 60000).toISOString(), dept: 'Online' },
    { id: 'ALT-102', ruleCode: 'A3', time: '13:42', status: 'PROCESSING', team: 'Logistics', assignee: 'Tran Thi B', slaDeadline: new Date(Date.now() + 8 * 60000).toISOString(), dept: 'Logistics' },
    { id: 'ALT-103', ruleCode: 'A2', time: '13:10', status: 'RESOLVED', team: 'Customer Service', assignee: 'Le Van C', slaDeadline: null, dept: 'CS' },
    { id: 'ALT-104', ruleCode: 'A4', time: '11:30', status: 'NOTIFY_CEO', team: 'Offline Sales', assignee: 'Pham Thi D', slaDeadline: null, dept: 'Offline' },
    { id: 'ALT-105', ruleCode: 'A1', time: '10:15', status: 'RESOLVED', team: 'Online Sales', assignee: 'Hoang Van E', slaDeadline: null, dept: 'Online' },
    { id: 'ALT-106', ruleCode: 'A5', time: '09:50', status: 'NEW', team: 'Logistics', assignee: 'Vu Thi F', slaDeadline: new Date(Date.now() + 1 * 60000).toISOString(), dept: 'Logistics' }, // Near expiry for testing
    { id: 'ALT-107', ruleCode: 'A6', time: '09:20', status: 'PROCESSING', team: 'Online Sales', assignee: 'Nguyen Van G', slaDeadline: new Date(Date.now() + 2 * 60000).toISOString(), dept: 'Online' },
    { id: 'ALT-108', ruleCode: 'A2', time: '08:45', status: 'RESOLVED', team: 'Customer Service', assignee: 'Le Thi H', slaDeadline: null, dept: 'CS' },
  ]);

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showToast = (msg: string, en: string = '', type: SeverityType = 'info') => {
    setToast({ visible: true, msg, en, type });
  };

  const addNotification = (msg: string, en: string, severity: SeverityType) => {
    const newItem: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      msg,
      en,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      severity,
      read: false
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sendBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, { body, icon: '/favicon.ico' });
      notification.onclick = function() {
        window.open('https://fusiongroup1010-bot.github.io/realtime-alert-system/', '_blank');
        window.focus();
        this.close();
      };
    }
  };

  // Clock Update & SLA Auto-Escalation Loop
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Auto Escalation Logic
      setIncidents(prevIncidents => {
        let hasChanges = false;
        const updated = prevIncidents.map(inc => {
          if ((inc.status === 'NEW' || inc.status === 'PROCESSING') && inc.slaDeadline) {
            const targetTime = new Date(inc.slaDeadline).getTime();
            if (now.getTime() >= targetTime) {
              hasChanges = true;
              
              // Trigger Notifications based on Role
              const rule = rules.find(r => r.code === inc.ruleCode);
              const severity = (rule ? rule.severity : 'P3') as SeverityType;

              if (currentUserRole === 'Executor') {
                showToast(`Sự cố ${inc.id} đã bị chuyển lên quản lý`, 'Do chưa xử lý nên đã được chuyển lên cấp quản lý', 'P2');
                addNotification(`Sự cố ${inc.id} đã bị chuyển lên quản lý`, 'Escalated due to inactivity', 'P2');
              } else if (currentUserRole === 'Manager') {
                showToast(`[PING] Sự cố ${inc.id} quá hạn SLA!`, 'Sự cố cần sự can thiệp của Quản lý', severity);
                addNotification(`[PING] Sự cố ${inc.id} quá hạn SLA!`, 'Sự cố cần sự can thiệp của Quản lý', severity);
                sendBrowserNotification('Báo Động SLA (Manager)', `Sự cố ${inc.id} vượt quá ngưỡng an toàn. Yêu cầu xử lý gấp!`);
              }

              return { ...inc, status: 'ESCALATED', slaDeadline: null };
            }
          }
          return inc;
        });
        
        return hasChanges ? updated : prevIncidents;
      });
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentUserRole, rules]);

  const addRule = (newRule: Omit<Rule, 'id' | 'triggers'>) => {
    const rule: Rule = {
      ...newRule,
      id: `R${rules.length + 1}`,
      triggers: 0
    };
    setRules(prev => [...prev, rule]);
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleIncidentAction = (id: string, actionType: 'ACK' | 'RESOLVE' | 'NOTIFY') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        if (actionType === 'ACK') {
          return { 
            ...inc, 
            status: 'PROCESSING', 
            // 10 minutes for PROCESSING
            slaDeadline: new Date(Date.now() + 10 * 60000).toISOString() 
          };
        }
        if (actionType === 'RESOLVE') {
          return { ...inc, status: 'RESOLVED', slaDeadline: null };
        }
        if (actionType === 'NOTIFY') {
          return { ...inc, status: 'NOTIFY_CEO', slaDeadline: null };
        }
      }
      return inc;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      selectedDate, setSelectedDate, currentTime, 
      rules, addRule, updateRule, toggleRule, deleteRule,
      incidents, handleIncidentAction,
      currentUserRole, setCurrentUserRole,
      showToast, notifications, addNotification, markNotificationsRead
    }}>
      {children}
      <Toast 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        message={toast.msg}
        enMessage={toast.en}
        type={toast.type as any}
      />
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
