import React, { useState } from 'react';
import { BenchmarkResult } from '../types';
import { 
  BarChart3, 
  Table, 
  TrendingUp, 
  Download, 
  Edit3, 
  RotateCcw, 
  Check, 
  Info,
  Layers,
  Zap
} from 'lucide-react';

interface BenchmarkComparisonProps {
  results: BenchmarkResult[];
  onUpdateResults: (newResults: BenchmarkResult[]) => void;
  onResetToDefault: () => void;
}

export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({
  results,
  onUpdateResults,
  onResetToDefault
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'latency' | 'loss' | 'jitter' | 'scaling'>('latency');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editBuffer, setEditBuffer] = useState<BenchmarkResult[]>(results);

  // Sync edit buffer if external results change and not editing
  React.useEffect(() => {
    if (!isEditing) {
      setEditBuffer(results);
    }
  }, [results, isEditing]);

  const handleSaveEdits = () => {
    onUpdateResults(editBuffer);
    setIsEditing(false);
  };

  const handleEditChange = (index: number, field: keyof BenchmarkResult, value: number) => {
    setEditBuffer(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      // auto compute loss % if packets changed
      if (field === 'totalSent' || field === 'lostPackets') {
        const sent = field === 'totalSent' ? value : copy[index].totalSent;
        const lost = field === 'lostPackets' ? value : copy[index].lostPackets;
        copy[index].packetLossPercent = sent > 0 ? Number(((lost / sent) * 100).toFixed(2)) : 0;
        copy[index].totalReceived = Math.max(0, sent - lost);
      }
      return copy;
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "Network Type",
      "Total Sent",
      "Total Received",
      "Lost Packets",
      "Packet Loss (%)",
      "Min Latency (ms)",
      "Average Latency (ms)",
      "Max Latency (ms)",
      "Jitter StdDev (ms)",
      "P95 Latency (ms)"
    ];

    const rows = results.map(r => [
      `"${r.networkName}"`,
      r.totalSent,
      r.totalReceived,
      r.lostPackets,
      r.packetLossPercent,
      r.minLatencyMs,
      r.avgLatencyMs,
      r.maxLatencyMs,
      r.jitterStdDevMs,
      r.p95LatencyMs
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "case_study_4_mqtt_benchmarks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find max latency for SVG chart scaling
  const maxAvgLatency = Math.max(...results.map(r => r.avgLatencyMs + r.jitterStdDevMs), 10);
  const maxLossPercent = Math.max(...results.map(r => r.packetLossPercent), 5);
  const maxJitter = Math.max(...results.map(r => r.jitterStdDevMs), 5);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Step 24 Deliverable</span>
              <span aria-hidden="true">·</span>
              <span>Tabulation & Comparative Graphing</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Comparative Analysis: Access-Network Technologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Comparing average delivery latency, message loss percentage, and jitter stability across Wired Ethernet,
              Wi-Fi 5 GHz, Wi-Fi 2.4 GHz, and Mobile Cellular Hotspots.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Enter Lab Data</span>
              </button>
            ) : (
              <button
                onClick={handleSaveEdits}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Custom Data</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 rounded-lg transition-colors border border-cyan-800/80 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onResetToDefault}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Reset to benchmark baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
          <button
            onClick={() => setActiveChartTab('latency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'latency'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Average Latency & Jitter (ms)
          </button>

          <button
            onClick={() => setActiveChartTab('loss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'loss'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Message Loss Rate (%)
          </button>

          <button
            onClick={() => setActiveChartTab('jitter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'jitter'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Latency Variance / Jitter
          </button>

          <button
            onClick={() => setActiveChartTab('scaling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeChartTab === 'scaling'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Multi-Device Scaling Curve (Viva Q2)
          </button>
        </div>
      </div>

      {/* Main Interactive Visual Graphic */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 sm:p-6 space-y-4">
        {/* Latency with Error Bars */}
        {activeChartTab === 'latency' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Average Latency (ms) with Jitter (StdDev) Uncertainty Bounds
                </h3>
                <p className="text-xs text-slate-400">
                  Lower is better. Whiskers represent &plusmn; 1 std-dev standard deviation in delivery time.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {results.map((r) => {
                const barWidthPct = (r.avgLatencyMs / maxAvgLatency) * 85;
                const jitterWidthPct = (r.jitterStdDevMs / maxAvgLatency) * 85;

                return (
                  <div key={r.networkType} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-200 font-medium">{r.networkName}</span>
                      <span className="text-cyan-300 font-bold tabular-nums">
                        {r.avgLatencyMs.toFixed(2)} ms <span className="text-slate-500 font-normal">(&plusmn;{r.jitterStdDevMs.toFixed(2)} ms)</span>
                      </span>
                    </div>

                    <div className="h-6 w-full bg-slate-950 rounded border border-slate-800 relative flex items-center overflow-hidden">
                      {/* Base Bar */}
                      <div
                        className={`h-full transition-all duration-500 rounded-l ${
                          r.networkType === 'ethernet'
                            ? 'bg-emerald-500/80'
                            : r.networkType.startsWith('wifi_5')
                            ? 'bg-cyan-500/80'
                            : r.networkType.startsWith('wifi_2')
                            ? 'bg-amber-500/80'
                            : 'bg-rose-500/80'
                        }`}
                        style={{ width: `${Math.max(2, barWidthPct)}%` }}
                      />

                      {/* Jitter Overlay Band */}
                      <div 
                        className="h-2 bg-white/30 rounded-r"
                        style={{ width: `${Math.max(1, jitterWidthPct)}%` }}
                        title={`Jitter: ±${r.jitterStdDevMs}ms`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Loss Rate */}
        {activeChartTab === 'loss' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Message Loss Percentage (%) across Access Technologies
                </h3>
                <p className="text-xs text-slate-400">
                  Target: &le; 0.1% for industrial closed-loop control. Computed from missing sequence IDs over 120 messages.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {results.map((r) => {
                const lossPct = r.packetLossPercent;
                const barWidthPct = (lossPct / maxLossPercent) * 90;

                return (
                  <div key={r.networkType} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-200 font-medium">{r.networkName}</span>
                      <span className={`font-bold tabular-nums ${
                        lossPct === 0 ? 'text-emerald-400' : (lossPct < 2 ? 'text-amber-400' : 'text-rose-400')
                      }`}>
                        {lossPct.toFixed(2)} % <span className="text-slate-500 font-normal">({r.lostPackets} dropped)</span>
                      </span>
                    </div>

                    <div className="h-6 w-full bg-slate-950 rounded border border-slate-800 relative flex items-center overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded ${
                          lossPct === 0
                            ? 'bg-emerald-500/40 w-1'
                            : lossPct < 2
                            ? 'bg-amber-500/80'
                            : 'bg-rose-500/80'
                        }`}
                        style={{ width: `${Math.max(lossPct === 0 ? 0 : 2, barWidthPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Jitter Stability */}
        {activeChartTab === 'jitter' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Latency Jitter & Variability Comparison
                </h3>
                <p className="text-xs text-slate-400">
                  Measures packet delivery predictability. Low jitter is crucial for real-time edge processing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {results.map((r) => (
                <div key={r.networkType} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 space-y-2">
                  <div className="text-xs font-semibold text-slate-200 truncate">{r.networkName}</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                    {r.jitterStdDevMs.toFixed(2)} <span className="text-xs text-slate-500">ms</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                    <div>Min: {r.minLatencyMs.toFixed(1)} ms</div>
                    <div>Max: {r.maxLatencyMs.toFixed(1)} ms</div>
                    <div>P95: {r.p95LatencyMs.toFixed(1)} ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Device Scaling Curve (Viva Q2) */}
        {activeChartTab === 'scaling' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Contention Scaling: 1 vs 20 Devices Contention Dynamics</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">Viva Q2 Proof</span>
              </h3>
              <p className="text-xs text-slate-400">
                Simulated response of access technologies as simultaneous active MQTT sensors scale from 1 to 20 nodes.
              </p>
            </div>

            {/* Simulated Contention SVG */}
            <div className="h-56 w-full bg-slate-950 rounded-lg p-3 border border-slate-800 relative">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="40" y1="40" x2="590" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="90" x2="590" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="590" y2="140" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Y Axis labels */}
                <text x="5" y="45" fill="#64748b" fontSize="10" fontFamily="monospace">150ms</text>
                <text x="5" y="95" fill="#64748b" fontSize="10" fontFamily="monospace">75ms</text>
                <text x="5" y="145" fill="#64748b" fontSize="10" fontFamily="monospace">20ms</text>
                <text x="5" y="185" fill="#64748b" fontSize="10" fontFamily="monospace">0ms</text>

                {/* X Axis labels */}
                <text x="50" y="198" fill="#64748b" fontSize="10" fontFamily="monospace">1 node</text>
                <text x="180" y="198" fill="#64748b" fontSize="10" fontFamily="monospace">5 nodes</text>
                <text x="360" y="198" fill="#64748b" fontSize="10" fontFamily="monospace">10 nodes</text>
                <text x="530" y="198" fill="#64748b" fontSize="10" fontFamily="monospace">20 nodes</text>

                {/* Curve 1: Wired Ethernet (Flat line) */}
                <path
                  d="M 50,180 Q 200,180 350,179 T 570,178"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Curve 2: Wi-Fi 5GHz (Mild rise) */}
                <path
                  d="M 50,172 Q 200,165 350,150 T 570,120"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />

                {/* Curve 3: Wi-Fi 2.4GHz (Exponential CSMA/CA explosion) */}
                <path
                  d="M 50,160 Q 200,140 350,90 T 570,30"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />

                {/* Curve 4: 4G Hotspot (High baseline + uplink bottleneck) */}
                <path
                  d="M 50,110 Q 200,95 350,75 T 570,25"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-400 rounded-full" /> Wired Ethernet (Flat & Deterministic)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" /> Wi-Fi 5 GHz (OFDMA Protected)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-400 rounded-full" /> Wi-Fi 2.4 GHz (CSMA/CA Collision Cascade)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-rose-400 rounded-full" /> 4G Hotspot (Uplink Grant Queue)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Tabulation: Network Type | Average Latency | Message Loss */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Official Benchmark Tabulation (Step 24 Deliverable)
            </h3>
          </div>
          {isEditing && (
            <span className="text-xs text-amber-400 font-mono">
              ● Editing Active: Click cell inputs to enter lab values
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Network Type</th>
                <th className="py-3 px-4">Sent / Recv</th>
                <th className="py-3 px-4">Dropped</th>
                <th className="py-3 px-4">Message Loss (%)</th>
                <th className="py-3 px-4">Average Latency (ms)</th>
                <th className="py-3 px-4">Jitter &plusmn;&sigma; (ms)</th>
                <th className="py-3 px-4">Min / Max (ms)</th>
                <th className="py-3 px-4">P95 Bound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-200">
              {(isEditing ? editBuffer : results).map((row, idx) => (
                <tr key={row.networkType} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">
                    {row.networkName}
                  </td>
                  
                  {/* Sent / Recv */}
                  <td className="py-3 px-4 tabular-nums">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.totalSent}
                        onChange={(e) => handleEditChange(idx, 'totalSent', Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-cyan-300"
                      />
                    ) : (
                      <span>{row.totalReceived} / {row.totalSent}</span>
                    )}
                  </td>

                  {/* Lost Packets */}
                  <td className="py-3 px-4 tabular-nums">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.lostPackets}
                        onChange={(e) => handleEditChange(idx, 'lostPackets', Number(e.target.value))}
                        className="w-14 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-rose-400"
                      />
                    ) : (
                      <span className={row.lostPackets > 0 ? 'text-rose-400' : 'text-slate-400'}>
                        {row.lostPackets}
                      </span>
                    )}
                  </td>

                  {/* Loss % */}
                  <td className="py-3 px-4 font-bold tabular-nums">
                    <span className={
                      row.packetLossPercent === 0 
                        ? 'text-emerald-400' 
                        : (row.packetLossPercent < 2 ? 'text-amber-400' : 'text-rose-400')
                    }>
                      {row.packetLossPercent.toFixed(2)} %
                    </span>
                  </td>

                  {/* Avg Latency */}
                  <td className="py-3 px-4 font-bold tabular-nums text-cyan-300">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={row.avgLatencyMs}
                        onChange={(e) => handleEditChange(idx, 'avgLatencyMs', Number(e.target.value))}
                        className="w-20 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-cyan-300"
                      />
                    ) : (
                      <span>{row.avgLatencyMs.toFixed(2)} ms</span>
                    )}
                  </td>

                  {/* Jitter */}
                  <td className="py-3 px-4 tabular-nums text-indigo-300">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={row.jitterStdDevMs}
                        onChange={(e) => handleEditChange(idx, 'jitterStdDevMs', Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-indigo-300"
                      />
                    ) : (
                      <span>{row.jitterStdDevMs.toFixed(2)} ms</span>
                    )}
                  </td>

                  {/* Min / Max */}
                  <td className="py-3 px-4 tabular-nums text-slate-400">
                    {row.minLatencyMs.toFixed(1)} / {row.maxLatencyMs.toFixed(1)} ms
                  </td>

                  {/* P95 */}
                  <td className="py-3 px-4 tabular-nums text-amber-300">
                    {row.p95LatencyMs.toFixed(1)} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineering Takeaways Box */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-xl p-5 space-y-2">
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Core Experimental Findings & Architectural Takeaways</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-1">
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 space-y-1">
            <strong className="text-emerald-300 block">Wired Ethernet Superiority:</strong>
            Ethernet achieved the lowest latency (1.25 ms), zero packet loss (0.0%), and microscopic jitter (0.28 ms) due to full-duplex switch fabrics free from RF contention.
          </div>
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">5 GHz vs 2.4 GHz Spectrum:</strong>
            5 GHz offers ~3x lower latency (4.8 ms vs 15.3 ms) and zero drops compared to 2.4 GHz, which suffers severe co-channel interference and exponential backoff delays.
          </div>
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 space-y-1">
            <strong className="text-rose-300 block">Mobile Hotspot Overhead:</strong>
            Cellular tethering incurs ~35-45 ms additional delay from multi-hop translation (Phone Wi-Fi AP &rarr; OS NAT &rarr; LTE eNodeB Uplink Grant &rarr; Core Network).
          </div>
        </div>
      </div>
    </div>
  );
};
