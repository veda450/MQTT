import React, { useState } from 'react';
import { EDGE_SCENARIOS } from '../data/caseStudyContent';
import { EdgeScenario, NetworkType } from '../types';
import { 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Truck, 
  Sprout, 
  Building2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ApplicationMatrix: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('factory_robot');
  const [customLatency, setCustomLatency] = useState<string>('low');
  const [customMobility, setCustomMobility] = useState<string>('stationary');
  const [customEnv, setCustomEnv] = useState<string>('industrial');

  const selectedScenario = EDGE_SCENARIOS.find(s => s.id === selectedScenarioId) || EDGE_SCENARIOS[0];

  const scenarioIcons: Record<string, any> = {
    factory_robot: Cpu,
    delivery_agv: Truck,
    smart_agriculture: Sprout,
    building_hvac: Building2
  };

  // Dynamic recommendation based on custom parameters
  const getDynamicRecommendation = () => {
    if (customMobility === 'high_speed') {
      return {
        tech: 'Cellular 5G NR / LTE',
        reason: 'High-speed roaming across disparate zones requires cellular base-station handovers and wide-area coverage.'
      };
    }
    if (customMobility === 'local_roaming') {
      return {
        tech: 'Wi-Fi 6 (802.11ax) with 802.11r Fast BSS Transition',
        reason: 'Indoor automated guided vehicles benefit from campus enterprise Wi-Fi with fast handover roaming.'
      };
    }
    if (customLatency === 'ultra_low' || customEnv === 'industrial') {
      return {
        tech: 'Wired Industrial Ethernet (Cat6A / TSN)',
        reason: 'Deterministic sub-millisecond execution, zero RF contention, and immunity to high motor EMI.'
      };
    }
    if (customEnv === 'rural') {
      return {
        tech: 'LPWAN (LoRaWAN / NB-IoT)',
        reason: 'Long-range (10+ km) sub-GHz propagation on single battery cells where cabling is cost-prohibitive.'
      };
    }
    return {
      tech: 'Wi-Fi 5 GHz (802.11ac)',
      reason: 'Cost-effective indoor fixed deployments utilizing existing building infrastructure.'
    };
  };

  const dynamicRec = getDynamicRecommendation();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Expected Deliverable Part B</span>
          <span aria-hidden="true">·</span>
          <span>Architectural Technology Selection</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Edge Access-Technology Application Matrix
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Detailed explanation and architectural justification of access-network selection for real-world
          hypothetical edge applications: Factory-Floor Sensor vs. Mobile Delivery Robot vs. Smart Agriculture.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {EDGE_SCENARIOS.map((scenario) => {
          const Icon = scenarioIcons[scenario.id] || Layers;
          const isSelected = selectedScenarioId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-slate-100 leading-tight">
                  {scenario.title}
                </div>
              </div>
              <div className="mt-3 text-[11px] font-mono text-cyan-400">
                {scenario.recommendationName.split(' ')[0]} {scenario.recommendationName.split(' ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Scenario Card */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Application Profile Assessment
            </span>
            <h3 className="text-lg font-bold text-white">
              {selectedScenario.title}
            </h3>
            <p className="text-xs text-slate-300">
              {selectedScenario.environment}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-right shrink-0">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Optimal Choice</div>
            <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
              {selectedScenario.recommendationName}
            </div>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">Latency Constraint:</div>
            <div className="font-mono font-semibold text-white">{selectedScenario.latencyConstraint}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">Reliability Requirement:</div>
            <div className="font-mono font-semibold text-white">{selectedScenario.reliabilityRequirement}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">Mobility Profile:</div>
            <div className="font-mono font-semibold text-white">{selectedScenario.mobility}</div>
          </div>
        </div>

        {/* Detailed Architectural Justification */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/50 space-y-1.5">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Architectural Selection Justification:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {selectedScenario.justification}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-900/50 space-y-1.5">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Trade-off & Rejection Analysis (Why other tech fails):</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {selectedScenario.tradeoffAnalysis}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Custom Decision Engine */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Interactive Architectural Trade-off Evaluator</span>
        </h3>
        <p className="text-xs text-slate-300">
          Configure your custom edge deployment parameters to compute the mathematically and architecturally optimal access network:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Latency Sensitivity */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Latency Budget:</label>
            <select
              value={customLatency}
              onChange={(e) => setCustomLatency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ultra_low">&lt; 5 ms (Real-time safety / Motion)</option>
              <option value="low">&lt; 30 ms (Telemetry & AGV guidance)</option>
              <option value="relaxed">&lt; 500 ms (Building climate / HVAC)</option>
              <option value="tolerant">&gt; 2,000 ms (Agriculture / Environmental)</option>
            </select>
          </div>

          {/* Mobility Profile */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Mobility Level:</label>
            <select
              value={customMobility}
              onChange={(e) => setCustomMobility(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="stationary">Stationary (Bolted to floor/wall)</option>
              <option value="local_roaming">Indoor Roaming (Warehouse AGV)</option>
              <option value="high_speed">High-Speed WAN (Delivery van / Drone)</option>
            </select>
          </div>

          {/* Operating Environment */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Operating Environment:</label>
            <select
              value={customEnv}
              onChange={(e) => setCustomEnv(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="industrial">Heavy Industrial (High EMI motors)</option>
              <option value="commercial">Commercial / Office (Existing Wi-Fi)</option>
              <option value="rural">Rural / Outdoor Field (No power grid)</option>
            </select>
          </div>
        </div>

        {/* Evaluator Output */}
        <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-cyan-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Evaluator Decision Output
            </div>
            <div className="text-sm font-bold text-white">
              Recommended Technology: <span className="text-cyan-300">{dynamicRec.tech}</span>
            </div>
            <div className="text-xs text-slate-300">
              {dynamicRec.reason}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
