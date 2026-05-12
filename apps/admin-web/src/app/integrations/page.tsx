'use client';
import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle2, AlertTriangle, Clock, TrendingDown, TrendingUp, ArrowRight, Info, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/context/AppContext';

interface MetricRow {
  id: string;
  timestamp: string;
  roas: string;
  csResponse: string;
  stockCover: string;
  shopCheckIn: string;
  status: 'pending' | 'evaluated' | 'violation';
  violations: string[];
}

const STORAGE_KEY = 'alert_system_data_uploads';

export default function DataUploadPage() {
  const { rules, evaluateMetrics, showToast } = useAppContext();
  const [form, setForm] = useState({ roas: '', csResponse: '', stockCover: '', shopCheckIn: '' });
  const [history, setHistory] = useState<MetricRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load upload history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (rows: MetricRow[]) => {
    setHistory(rows);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  };

  // Get rule threshold info for display
  const getRuleInfo = (code: string) => rules.find(r => r.code === code);
  const roas_rule = getRuleInfo('A1');
  const cs_rule = getRuleInfo('A2');
  const stock_rule = getRuleInfo('A3');
  const shop_rule = getRuleInfo('A4');

  const evaluateValue = (metricKey: string, value: number): boolean => {
    const ruleMap: Record<string, string> = { roas: 'A1', csResponse: 'A2', stockCover: 'A3', shopCheckIn: 'A4' };
    const rule = rules.find(r => r.code === ruleMap[metricKey] && r.status === 'Active');
    if (!rule) return false;
    const condMatch = rule.condition.match(/(>|<)\s*([\d.]+)/);
    if (!condMatch) return false;
    const op = condMatch[1];
    const threshold = parseFloat(condMatch[2]);
    return op === '<' ? value < threshold : value > threshold;
  };

  const handleSubmit = () => {
    if (!form.roas && !form.csResponse && !form.stockCover && !form.shopCheckIn) {
      showToast('Vui lòng nhập ít nhất một chỉ số!', 'Please enter at least one metric!', 'info');
      return;
    }

    setIsSubmitting(true);

    const metrics: Record<string, number> = {};
    if (form.roas) metrics.roas = parseFloat(form.roas);
    if (form.csResponse) metrics.csResponse = parseFloat(form.csResponse);
    if (form.stockCover) metrics.stockCover = parseFloat(form.stockCover);
    if (form.shopCheckIn) metrics.shopCheckIn = parseFloat(form.shopCheckIn);

    // Find violations for history row display
    const violations: string[] = [];
    if (form.roas && evaluateValue('roas', parseFloat(form.roas))) violations.push('A1');
    if (form.csResponse && evaluateValue('csResponse', parseFloat(form.csResponse))) violations.push('A2');
    if (form.stockCover && evaluateValue('stockCover', parseFloat(form.stockCover))) violations.push('A3');
    if (form.shopCheckIn && evaluateValue('shopCheckIn', parseFloat(form.shopCheckIn))) violations.push('A4');

    // Trigger rule evaluation → creates incidents in context
    evaluateMetrics(metrics);

    const newRow: MetricRow = {
      id: `UP-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      roas: form.roas || '-',
      csResponse: form.csResponse || '-',
      stockCover: form.stockCover || '-',
      shopCheckIn: form.shopCheckIn || '-',
      status: violations.length > 0 ? 'violation' : 'evaluated',
      violations,
    };

    const updated = [newRow, ...history];
    saveHistory(updated);

    setTimeout(() => {
      setIsSubmitting(false);
      setForm({ roas: '', csResponse: '', stockCover: '', shopCheckIn: '' });
      showToast(
        violations.length > 0
          ? `⚠️ Đã phát hiện ${violations.length} vi phạm! Kiểm tra Bảng Sự Cố.`
          : '✅ Dữ liệu hợp lệ – không vi phạm quy tắc nào.',
        violations.length > 0
          ? `Detected ${violations.length} rule violation(s)! Check the Incident Table.`
          : 'Data looks good – no rule violations detected.',
        violations.length > 0 ? 'P1' : 'P3'
      );
    }, 800);
  };

  const handleDelete = (id: string) => {
    const updated = history.filter(r => r.id !== id);
    saveHistory(updated);
  };

  const statusBadge = {
    pending: 'bg-surface text-textSecondary border-borderSubtle',
    evaluated: 'bg-green-500/10 text-green-400 border-green-500/30',
    violation: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  const statusLabel = {
    pending: 'Chờ xử lý',
    evaluated: 'Hợp lệ',
    violation: 'Vi phạm',
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Nạp Dữ Liệu / Data Upload</h2>
          <p className="text-sm text-textSecondary mt-1">
            Nhập chỉ số vận hành – hệ thống sẽ tự động đối chiếu với Bộ Quy Tắc và tạo Sự Cố nếu vi phạm /
            Enter operational metrics – the system will auto-evaluate against active rules and trigger incidents if violated
          </p>
        </div>
      </div>

      {/* Rule Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { rule: roas_rule, label: 'ROAS', icon: TrendingDown, metricKey: 'roas', unit: '', hint: 'Tỷ lệ ROAS quảng cáo' },
          { rule: cs_rule, label: 'CS Response', icon: Clock, metricKey: 'csResponse', unit: 'phút', hint: 'Thời gian phản hồi CS (phút)' },
          { rule: stock_rule, label: 'Stock Cover', icon: TrendingUp, metricKey: 'stockCover', unit: 'x', hint: 'Hệ số tồn kho an toàn' },
          { rule: shop_rule, label: 'Shop check in', icon: CheckCircle2, metricKey: 'shopCheckIn', unit: '', hint: 'Số lượng Shop check in' },
        ].map(({ rule, label, icon: Icon, unit, hint }) => (
          <div key={label} className="glass-panel rounded-xl p-4 flex items-start space-x-3">
            <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
              rule?.status === 'Active' ? 'bg-accentGlow/10' : 'bg-surface')}>
              <Icon className={clsx('w-4 h-4', rule?.status === 'Active' ? 'text-accentGlow' : 'text-textSecondary')} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-[10px] text-textSecondary">{hint}</p>
              {rule ? (
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-background rounded border border-borderSubtle text-white">
                    Ngưỡng: {rule.condition} {unit}
                  </span>
                  <span className={clsx('text-[10px] px-1.5 py-0.5 rounded border font-semibold',
                    rule.status === 'Active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-surface text-textSecondary border-borderSubtle')}>
                    {rule.status === 'Active' ? '● Đang chạy' : '⏸ Tạm dừng'}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-textSecondary mt-1 block">Chưa có quy tắc</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-5">
          <Upload className="w-5 h-5 text-accentGlow" />
          <h3 className="text-base font-semibold text-white">Nhập chỉ số mới / Enter New Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* ROAS */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-textSecondary uppercase tracking-wider">
              ROAS
              <span className="text-[10px] font-normal text-accentGlow normal-case">(A1: {roas_rule?.condition ?? 'chưa có quy tắc'})</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="VD: 4.8"
                value={form.roas}
                onChange={e => setForm(f => ({ ...f, roas: e.target.value }))}
                className={clsx(
                  'w-full bg-background border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow transition-colors',
                  form.roas && roas_rule && evaluateValue('roas', parseFloat(form.roas))
                    ? 'border-red-500/60 bg-red-500/5'
                    : form.roas
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-borderSubtle'
                )}
              />
              {form.roas && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {roas_rule && evaluateValue('roas', parseFloat(form.roas))
                    ? <AlertTriangle className="w-4 h-4 text-red-400" />
                    : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </span>
              )}
            </div>
            {form.roas && roas_rule && evaluateValue('roas', parseFloat(form.roas)) && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />Vi phạm quy tắc A1 – sẽ tạo sự cố P1!
              </p>
            )}
          </div>

          {/* CS Response */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-textSecondary uppercase tracking-wider">
              CS Response (phút)
              <span className="text-[10px] font-normal text-accentGlow normal-case">(A2: {cs_rule?.condition ?? 'chưa có'})</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                placeholder="VD: 7.5"
                value={form.csResponse}
                onChange={e => setForm(f => ({ ...f, csResponse: e.target.value }))}
                className={clsx(
                  'w-full bg-background border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow transition-colors',
                  form.csResponse && cs_rule && evaluateValue('csResponse', parseFloat(form.csResponse))
                    ? 'border-red-500/60 bg-red-500/5'
                    : form.csResponse
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-borderSubtle'
                )}
              />
              {form.csResponse && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {cs_rule && evaluateValue('csResponse', parseFloat(form.csResponse))
                    ? <AlertTriangle className="w-4 h-4 text-red-400" />
                    : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </span>
              )}
            </div>
            {form.csResponse && cs_rule && evaluateValue('csResponse', parseFloat(form.csResponse)) && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />Vi phạm quy tắc A2 – sẽ tạo sự cố P2!
              </p>
            )}
          </div>

          {/* Stock Cover */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-textSecondary uppercase tracking-wider">
              Stock Cover (x)
              <span className="text-[10px] font-normal text-accentGlow normal-case">(A3: {stock_rule?.condition ?? 'chưa có'})</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="VD: 1.2"
                value={form.stockCover}
                onChange={e => setForm(f => ({ ...f, stockCover: e.target.value }))}
                className={clsx(
                  'w-full bg-background border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow transition-colors',
                  form.stockCover && stock_rule && evaluateValue('stockCover', parseFloat(form.stockCover))
                    ? 'border-red-500/60 bg-red-500/5'
                    : form.stockCover
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-borderSubtle'
                )}
              />
              {form.stockCover && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {stock_rule && evaluateValue('stockCover', parseFloat(form.stockCover))
                    ? <AlertTriangle className="w-4 h-4 text-red-400" />
                    : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </span>
              )}
            </div>
            {form.stockCover && stock_rule && evaluateValue('stockCover', parseFloat(form.stockCover)) && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />Vi phạm quy tắc A3 – sẽ tạo sự cố P2!
              </p>
            )}
          </div>

          {/* Shop check in */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-textSecondary uppercase tracking-wider">
              Shop check in
              <span className="text-[10px] font-normal text-accentGlow normal-case">(A4: {shop_rule?.condition ?? 'chưa có'})</span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="VD: 25"
                value={form.shopCheckIn}
                onChange={e => setForm(f => ({ ...f, shopCheckIn: e.target.value }))}
                className={clsx(
                  'w-full bg-background border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow transition-colors',
                  form.shopCheckIn && shop_rule && evaluateValue('shopCheckIn', parseFloat(form.shopCheckIn))
                    ? 'border-red-500/60 bg-red-500/5'
                    : form.shopCheckIn
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-borderSubtle'
                )}
              />
              {form.shopCheckIn && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {shop_rule && evaluateValue('shopCheckIn', parseFloat(form.shopCheckIn))
                    ? <AlertTriangle className="w-4 h-4 text-red-400" />
                    : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </span>
              )}
            </div>
            {form.shopCheckIn && shop_rule && evaluateValue('shopCheckIn', parseFloat(form.shopCheckIn)) && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />Vi phạm quy tắc A4 – sẽ tạo sự cố P3!
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-borderSubtle">
          <div className="flex items-start gap-2 text-[11px] text-textSecondary max-w-lg">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accentGlow" />
            <span>
              Khi nhấn <strong className="text-white">Nạp & Kiểm tra</strong>, hệ thống sẽ so sánh với các quy tắc đang chạy.
              Nếu phát hiện vi phạm, sự cố mới sẽ tự động xuất hiện tại <strong className="text-white">Tháp Điều Khiển</strong> và <strong className="text-white">Sự Cố Trực Tiếp</strong>.
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-accentGlow text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xử lý...</span>
            ) : (
              <><Upload className="w-4 h-4" />Nạp &amp; Kiểm tra / Submit &amp; Evaluate<ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </div>

      {/* Upload History Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-borderSubtle flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Lịch sử nạp dữ liệu / Upload History</h3>
            <p className="text-[10px] text-textSecondary mt-0.5">Dữ liệu được lưu tự động / Data is auto-saved locally</p>
          </div>
          <span className="text-xs text-textSecondary">{history.length} bản ghi</span>
        </div>

        {history.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Upload className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm text-textSecondary">Chưa có dữ liệu nào được nạp / No data uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 border-b border-borderSubtle text-textSecondary font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>Thời gian</span><span className="opacity-60 lowercase font-normal">Timestamp</span></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>ROAS</span><span className="opacity-60 lowercase font-normal">Ad Return</span></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>CS Response</span><span className="opacity-60 lowercase font-normal">Minutes</span></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>Stock Cover</span><span className="opacity-60 lowercase font-normal">Ratio (x)</span></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>Shop Check In</span><span className="opacity-60 lowercase font-normal">Count</span></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>Trạng thái</span><span className="opacity-60 lowercase font-normal">Status</span></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex flex-col"><span>Vi phạm</span><span className="opacity-60 lowercase font-normal">Violations</span></div>
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors group">
                    <td className="px-6 py-3 text-xs text-textSecondary font-mono whitespace-nowrap">{row.timestamp}</td>
                    <td className="px-6 py-3">
                      <span className={clsx('font-mono text-sm font-medium',
                        row.violations.includes('A1') ? 'text-red-400' : 'text-white')}>
                        {row.roas}
                      </span>
                      {row.violations.includes('A1') && <AlertTriangle className="inline w-3 h-3 text-red-400 ml-1" />}
                    </td>
                    <td className="px-6 py-3">
                      <span className={clsx('font-mono text-sm font-medium',
                        row.violations.includes('A2') ? 'text-orange-400' : 'text-white')}>
                        {row.csResponse}
                      </span>
                      {row.violations.includes('A2') && <AlertTriangle className="inline w-3 h-3 text-orange-400 ml-1" />}
                    </td>
                    <td className="px-6 py-3">
                      <span className={clsx('font-mono text-sm font-medium',
                        row.violations.includes('A3') ? 'text-orange-400' : 'text-white')}>
                        {row.stockCover}
                      </span>
                      {row.violations.includes('A3') && <AlertTriangle className="inline w-3 h-3 text-orange-400 ml-1" />}
                    </td>
                    <td className="px-6 py-3">
                      <span className={clsx('font-mono text-sm font-medium',
                        row.violations.includes('A4') ? 'text-red-400' : 'text-white')}>
                        {row.shopCheckIn}
                      </span>
                      {row.violations.includes('A4') && <AlertTriangle className="inline w-3 h-3 text-red-400 ml-1" />}
                    </td>
                    <td className="px-6 py-3">
                      <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border', statusBadge[row.status])}>
                        {row.status === 'violation' && <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
                        {row.status === 'evaluated' && <CheckCircle2 className="w-2.5 h-2.5 mr-1" />}
                        {statusLabel[row.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {row.violations.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {row.violations.map(v => (
                            <span key={v} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                              {v}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-400 text-xs">✓ Không vi phạm</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-textSecondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-background border border-borderSubtle rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
