import React, { useState, useEffect, useRef } from 'react';
import { NetworkType, PacketTelemetry, BenchmarkResult } from '../types';
import { NETWORK_PROFILES } from '../data/caseStudyContent';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Wifi, 
  Radio, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Sliders, 
  Download, 
  Layers
} from 'lucide-react';

interface LiveSimulatorProps {
  onSaveResult: (result: BenchmarkResult) => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({ onSaveResult }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('wifi_5ghz');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [publishRateHz, setPublishRateHz] = useState<number>(1); // 1 msg/sec standard
  const [deviceCount, setDeviceCount] = useState<number>(1); // 1 to 50 devices for Viva Q2
  const [rfNoise, setRfNoise] = useState<number>(10); // % interference
  const [totalTargetPackets, setTotalTargetPackets] = useState<number>(120); // 2 min at 1Hz

  const [currentSeq, setCurrentSeq] = useState<number>(0);
  const [packets, setPackets] = useState<PacketTelemetry[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const profile = NETWORK_PROFILES[selectedNetwork];

  // Calculate packet characteristics based on network physics & concurrency
  const generatePacket = (seq: number): PacketTelemetry => {
    const now = performance.now();
    
    // Concurrency impact physics (CSMA/CA vs Switched Ethernet vs Cellular scheduling)
    let concurrencyLatencyMultiplier = 1.0;
    let concurrencyLossBonus = 0.0;

    if (selectedNetwork === 'wifi_24ghz') {
      // 2.4GHz CSMA/CA contention rises sharply with device count
      concurrencyLatencyMultiplier = 1.0 + Math.pow(deviceCount - 1, 1.4) * 0.12;
      concurrencyLossBonus = (deviceCount - 1) * 0.45;
    } else if (selectedNetwork === 'wifi_5ghz') {
      // 5GHz with OFDMA handles devices better
      concurrencyLatencyMultiplier = 1.0 + Math.pow(deviceCount - 1, 1.1) * 0.05;
      concurrencyLossBonus = (deviceCount - 1) * 0.15;
    } else if (selectedNetwork === 'ethernet') {
      // Full duplex switch handles up to port limit with near zero degradation
      concurrencyLatencyMultiplier = 1.0 + (deviceCount > 24 ? 0.2 : 0.02);
      concurrencyLossBonus = 0.0;
    } else if (selectedNetwork === 'cellular_hotspot_4g') {
      // Hotspot CPU & uplink queue delays
      concurrencyLatencyMultiplier = 1.0 + (deviceCount - 1) * 0.18;
      concurrencyLossBonus = (deviceCount - 1) * 0.35;
    } else if (selectedNetwork === 'cellular_hotspot_5g') {
      concurrencyLatencyMultiplier = 1.0 + (deviceCount - 1) * 0.08;
      concurrencyLossBonus = (deviceCount - 1) * 0.12;
    } else if (selectedNetwork === 'lpwan_lora') {
      // Pure ALOHA collision breakdown above 5 devices
      concurrencyLatencyMultiplier = 1.0 + (deviceCount - 1) * 0.25;
      concurrencyLossBonus = Math.min(80, (deviceCount - 1) * 2.5);
    }

    // Noise factor
    const noiseMultiplier = 1.0 + (rfNoise / 100) * (selectedNetwork === 'ethernet' ? 0.05 : 0.8);
    const effectiveLossRate = Math.min(95, (profile.lossRatePercent + concurrencyLossBonus) * (1 + rfNoise / 80));

    // Determine drop
    const isDropped = Math.random() * 100 < effectiveLossRate;
    
    // Gaussian-like random jitter
    const u1 = Math.random();
    const u2 = Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.cos(2.0 * Math.PI * u2);
    
    let latency = profile.baseLatencyMs * concurrencyLatencyMultiplier * noiseMultiplier + randStdNormal * profile.jitterMs;
    // Physical floor
    latency = Math.max(0.5, latency);

    const isHighJitter = latency > (profile.baseLatencyMs * 2.2);

    return {
      seq,
      timestampSend: now,
      timestampRecv: isDropped ? 0 : now + latency,
      latencyMs: isDropped ? 0 : Number(latency.toFixed(2)),
      network: selectedNetwork,
      status: isDropped ? 'dropped' : (isHighJitter ? 'high_jitter' : 'delivered'),
      payloadBytes: 184 + Math.floor(Math.random() * 20)
    };
  };

  // Simulation tick loop
  useEffect(() => {
    if (isRunning) {
      const intervalMs = 1000 / publishRateHz;
      timerRef.current = window.setInterval(() => {
        setCurrentSeq(prevSeq => {
          const nextSeq = prevSeq + 1;
          if (nextSeq > totalTargetPackets) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prevSeq;
          }
          const newPacket = generatePacket(nextSeq);
          setPackets(prev => [...prev, newPacket]);
          return nextSeq;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, publishRateHz, selectedNetwork, deviceCount, rfNoise, totalTargetPackets]);

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSeq(0);
    setPackets([]);
    setSaveSuccess(false);
  };

  // Metrics derived from packets
  const deliveredPackets = packets.filter(p => p.status !== 'dropped');
  const droppedCount = packets.filter(p => p.status === 'dropped').length;
  const totalSent = packets.length;
  const lossRatePct = totalSent > 0 ? (droppedCount / totalSent) * 100 : 0;

  const validLatencies = deliveredPackets.map(p => p.latencyMs);
  const avgLatency = validLatencies.length > 0 
    ? validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length 
    : 0;

  const minLatency = validLatencies.length > 0 ? Math.min(...validLatencies) : 0;
  const maxLatency = validLatencies.length > 0 ? Math.max(...validLatencies) : 0;

  const variance = validLatencies.length > 1
    ? validLatencies.reduce((acc, val) => acc + Math.pow(val - avgLatency, 2), 0) / validLatencies.length
    : 0;
  const jitterStdDev = Math.sqrt(variance);

  const sortedLatencies = [...validLatencies].sort((a, b) => a - b);
  const p95Idx = Math.floor(sortedLatencies.length * 0.95);
  const p95Latency = sortedLatencies[p95Idx] || 0;

  const handleSaveToAnalytics = () => {
    if (totalSent === 0) return;
    const result: BenchmarkResult = {
      networkType: selectedNetwork,
      networkName: profile.name,
      totalSent,
      totalReceived: deliveredPackets.length,
      lostPackets: droppedCount,
      packetLossPercent: Number(lossRatePct.toFixed(2)),
      minLatencyMs: Number(minLatency.toFixed(2)),
      maxLatencyMs: Number(maxLatency.toFixed(2)),
      avgLatencyMs: Number(avgLatency.toFixed(2)),
      jitterStdDevMs: Number(jitterStdDev.toFixed(2)),
      p95LatencyMs: Number(p95Latency.toFixed(2)),
      isCustomData: true
    };
    onSaveResult(result);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Testbench Control Station */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Interactive Edge Hardware Simulator</span>
              <span aria-hidden="true">·</span>
              <span>Case Study 4 In-Browser Testbench</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Virtual MQTT Access Network Benchmark Engine
            </h2>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                disabled={currentSeq >= totalTargetPackets}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentSeq === 0 ? 'Start Benchmark (2 min)' : 'Resume Test'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {totalSent > 10 && (
              <button
                onClick={handleSaveToAnalytics}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 rounded-lg transition-colors whitespace-nowrap border border-cyan-800/80"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Saved to Table!' : 'Save Benchmark'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Network Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Select Access Network Technology under Test:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(Object.keys(NETWORK_PROFILES) as NetworkType[]).map((key) => {
              const net = NETWORK_PROFILES[key];
              const isSelected = selectedNetwork === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedNetwork(key);
                    handleReset();
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{net.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{net.category}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Physical Channel Characteristics Banner */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400">Physical Medium: </span>
            <span className="text-cyan-300 font-mono font-medium">{profile.physicalMedium}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono">
            <span>Bandwidth: <strong className="text-slate-200">{profile.bandwidthMbps}</strong></span>
            <span>Mobility: <strong className="text-slate-200">{profile.mobilitySupport}</strong></span>
            <span>Power: <strong className="text-slate-200">{profile.powerProfile}</strong></span>
          </div>
        </div>

        {/* Real-World Experimentation Sliders (Scale up to 20 devices for Viva Q2!) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          {/* Concurrency Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Simultaneous Publishers:</span>
              <span className="font-mono text-cyan-400 font-semibold tabular-nums">{deviceCount} {deviceCount === 1 ? 'node' : 'nodes'}</span>
            </div>
            <input 
              type="range"
              min={1}
              max={50}
              value={deviceCount}
              onChange={(e) => setDeviceCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              {deviceCount > 1 ? 'Tests Viva Q2: CSMA/CA collision breakdown' : 'Standard 1-node test'}
            </div>
          </div>

          {/* Publish Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Telemetry Rate:</span>
              <span className="font-mono text-cyan-400 font-semibold tabular-nums">{publishRateHz} Hz ({(1000/publishRateHz).toFixed(0)} ms)</span>
            </div>
            <input 
              type="range"
              min={1}
              max={10}
              value={publishRateHz}
              onChange={(e) => setPublishRateHz(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              Standard lab rate is 1.0 message/second
            </div>
          </div>

          {/* RF Channel Noise */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">RF Noise & Fading:</span>
              <span className="font-mono text-cyan-400 font-semibold tabular-nums">{rfNoise}%</span>
            </div>
            <input 
              type="range"
              min={0}
              max={50}
              value={rfNoise}
              onChange={(e) => setRfNoise(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              Simulates microwave, distance, and interference
            </div>
          </div>
        </div>
      </div>

      {/* Visual Network Transmission Pipeline */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4 sm:p-5">
        <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
          Live MQTT Network Topology Flow
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {/* Node 1: Sensor Publisher */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-semibold text-slate-200 truncate">Publisher Node(s)</div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                {deviceCount} Active Client{deviceCount > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Node 2: Access Network Link */}
          <div className={`p-3 rounded-lg border flex items-center gap-3 ${
            isRunning 
              ? 'border-cyan-500/50 bg-cyan-950/20' 
              : 'border-slate-800 bg-slate-950'
          }`}>
            <div className="w-9 h-9 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <Radio className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-semibold text-slate-200 truncate">{profile.name}</div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                {profile.category} Channel
              </div>
            </div>
          </div>

          {/* Node 3: Edge Mosquitto Broker */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-semibold text-slate-200 truncate">Mosquitto Broker</div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                TCP Port 1883
              </div>
            </div>
          </div>

          {/* Node 4: Gateway Subscriber */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-semibold text-slate-200 truncate">Edge Subscriber</div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                Latency: {packets.length > 0 && packets[packets.length - 1].status !== 'dropped' ? `${packets[packets.length - 1].latencyMs} ms` : '--'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Rolling Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 font-medium">Packets Sent</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {totalSent} <span className="text-xs text-slate-500 font-normal">/ {totalTargetPackets}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {((totalSent / totalTargetPackets) * 100).toFixed(0)}% Completed
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 font-medium">Delivered</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {deliveredPackets.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            QoS Level 0
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 font-medium">Packet Loss Rate</div>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
            lossRatePct === 0 ? 'text-slate-300' : (lossRatePct < 2 ? 'text-amber-400' : 'text-rose-400')
          }`}>
            {lossRatePct.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {droppedCount} Dropped Packets
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 font-medium">Average Latency</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums mt-1">
            {avgLatency.toFixed(2)} <span className="text-xs text-slate-500 font-normal">ms</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Min: {minLatency.toFixed(1)} · Max: {maxLatency.toFixed(1)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 font-medium">Jitter (StdDev)</div>
          <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums mt-1">
            {jitterStdDev.toFixed(2)} <span className="text-xs text-slate-500 font-normal">ms</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Stability Index
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400 font-medium">95th Percentile</div>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums mt-1">
            {p95Latency.toFixed(2)} <span className="text-xs text-slate-500 font-normal">ms</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Tail Latency Bound
          </div>
        </div>
      </div>

      {/* Real-Time Latency Wave Chart */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Latency Wave & Jitter Profile</span>
            </h3>
            <div className="text-xs text-slate-400">
              Displaying sequence timeline, transmission variations, and detected drops
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Delivered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Dropped
            </span>
          </div>
        </div>

        {/* Dynamic SVG Wave */}
        <div className="h-56 w-full bg-slate-950 rounded-lg p-2 border border-slate-800 relative overflow-hidden flex items-end">
          {packets.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Radio className="w-8 h-8 mb-2 opacity-30 text-cyan-400" />
              <span>Click "Start Benchmark" above to begin live data ingestion</span>
            </div>
          ) : (
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Baseline reference */}
              <text x="10" y="45" fill="#64748b" fontSize="10" fontFamily="monospace">
                High Latency
              </text>
              <text x="10" y="190" fill="#64748b" fontSize="10" fontFamily="monospace">
                0 ms
              </text>

              {/* Data points & polyline */}
              {(() => {
                const maxVal = Math.max(10, ...packets.map(p => p.latencyMs)) * 1.25;
                const points = packets.map((p, idx) => {
                  const x = (idx / Math.max(1, totalTargetPackets - 1)) * 800;
                  const y = p.status === 'dropped' ? 195 : 200 - (p.latencyMs / maxVal) * 180;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      points={points}
                      strokeLinejoin="round"
                    />
                    {packets.map((p, idx) => {
                      const x = (idx / Math.max(1, totalTargetPackets - 1)) * 800;
                      const y = p.status === 'dropped' ? 195 : 200 - (p.latencyMs / maxVal) * 180;
                      
                      if (p.status === 'dropped') {
                        return (
                          <circle
                            key={idx}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#ef4444"
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                        );
                      }
                      
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r={p.status === 'high_jitter' ? '3.5' : '2'}
                          fill={p.status === 'high_jitter' ? '#f59e0b' : '#38bdf8'}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          )}
        </div>
      </div>

      {/* Packet Inspector Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-white">
            Incoming MQTT Packet Inspector (Latest Arrivals)
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing last {Math.min(10, packets.length)} of {packets.length} packets
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Seq #</th>
                <th className="py-2.5 px-4">Network</th>
                <th className="py-2.5 px-4">Send Timestamp</th>
                <th className="py-2.5 px-4">Receive Timestamp</th>
                <th className="py-2.5 px-4">Latency (ms)</th>
                <th className="py-2.5 px-4">Payload Size</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {packets.slice(-10).reverse().map((pkt) => (
                <tr key={pkt.seq} className="hover:bg-slate-800/30">
                  <td className="py-2 px-4 text-cyan-400 font-bold">#{pkt.seq.toString().padStart(3, '0')}</td>
                  <td className="py-2 px-4 text-slate-300">{pkt.network}</td>
                  <td className="py-2 px-4 text-slate-400">{pkt.timestampSend.toFixed(3)}</td>
                  <td className="py-2 px-4 text-slate-400">{pkt.timestampRecv ? pkt.timestampRecv.toFixed(3) : 'DROPPED'}</td>
                  <td className="py-2 px-4 font-semibold">
                    {pkt.status === 'dropped' ? (
                      <span className="text-rose-400">LOST</span>
                    ) : (
                      <span className={pkt.status === 'high_jitter' ? 'text-amber-400' : 'text-emerald-400'}>
                        {pkt.latencyMs.toFixed(2)} ms
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-slate-400">{pkt.payloadBytes} B</td>
                  <td className="py-2 px-4">
                    {pkt.status === 'delivered' && (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <CheckCircle className="w-3 h-3" /> Delivered
                      </span>
                    )}
                    {pkt.status === 'high_jitter' && (
                      <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3 h-3" /> High Jitter
                      </span>
                    )}
                    {pkt.status === 'dropped' && (
                      <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                        <XCircle className="w-3 h-3" /> Dropped
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {packets.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No packet records in buffer. Start the simulation to generate telemetry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
