import React, { useState } from 'react';
import { STEP_BY_STEP_GUIDE } from '../data/caseStudyContent';
import { 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  AlertTriangle, 
  Terminal, 
  HardDrive, 
  Wifi, 
  Radio, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Cpu, 
  FileCode,
  ShieldAlert
} from 'lucide-react';

interface StepByStepGuideProps {
  onNavigateToCode: () => void;
  onNavigateToSim: () => void;
}

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({ onNavigateToCode, onNavigateToSim }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [selectedOsTab, setSelectedOsTab] = useState<Record<number, number>>({ 17: 0 });
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / STEP_BY_STEP_GUIDE.length) * 100);

  return (
    <div className="space-y-8">
      {/* Hero / Case Study Brief Header */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>Topic 4 · Networking Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Difficulty: Medium</span>
              <span aria-hidden="true">·</span>
              <span>Duration: 1 Session (2 Hours)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Case Study 4: Comparing Access-Network Technologies using MQTT
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Objective: Empirically measure and compare how different access-network technologies
              (Wired Ethernet, Wi-Fi 2.4/5GHz, and Mobile Cellular Hotspot) impact the latency and reliability
              of sensor telemetry delivered to an Edge Gateway running the Mosquitto MQTT broker.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> 2 Hours Lab Runtime
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Gateway: Raspberry Pi / Linux PC
              </span>
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" /> Protocol: MQTT 3.1.1 on TCP/1883
              </span>
            </div>
          </div>

          {/* Interactive Progress Meter */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 sm:p-5 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Lab Execution Progress</span>
              <span className="font-mono text-cyan-400 tabular-nums font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-white font-semibold tabular-nums">{completedCount}</span> of {STEP_BY_STEP_GUIDE.length} steps completed
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={onNavigateToSim}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <span>Launch Virtual Simulator</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Bench Setup & Architecture Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Physical Hardware Setup</span>
            <span className="text-xs text-slate-400 font-mono">Gateway + Publisher + Hotspot</span>
          </div>
          <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
            <img 
              src="/src/assets/images/edge_network_lab_setup_1790341337534.jpg" 
              alt="Physical laboratory bench setup with Raspberry Pi Edge Gateway, Ethernet cable, and Smartphone Hotspot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-sm p-2 rounded border border-slate-800">
              Real-world physical bench: Raspberry Pi (Broker), Ethernet link, Wi-Fi AP, and Smartphone 4G Hotspot.
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Network Topology Architecture</span>
            <span className="text-xs text-slate-400 font-mono">Multi-Access Ingestion Model</span>
          </div>
          <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
            <img 
              src="/src/assets/images/mqtt_edge_arch_1790341353525.jpg" 
              alt="Network architecture schematic showing access network links connecting to Mosquitto Edge Gateway"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-sm p-2 rounded border border-slate-800">
              Access networks (Ethernet, Wi-Fi, 4G Hotspot) delivering timestamped telemetry to local Mosquitto broker.
            </div>
          </div>
        </div>
      </div>

      {/* Hardware & Software Checklist */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>Required Hardware & Software Inventory</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-1.5">
            <div className="font-semibold text-cyan-300">1. Edge Gateway Node</div>
            <p className="text-slate-300">One Raspberry Pi 4 (or Linux/Mac/Windows Laptop) running Mosquitto Broker daemon.</p>
            <div className="text-slate-400 font-mono pt-1">OS: Linux / Raspberry Pi OS</div>
          </div>
          
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-1.5">
            <div className="font-semibold text-cyan-300">2. Publisher Device(s)</div>
            <p className="text-slate-300">One or two client devices: Laptop running Python, ESP32 microcontroller, or Phone MQTT client.</p>
            <div className="text-slate-400 font-mono pt-1">Library: paho-mqtt &ge; 1.6</div>
          </div>
          
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-1.5">
            <div className="font-semibold text-cyan-300">3. 3 Access Channels</div>
            <p className="text-slate-300">(a) Shared Wi-Fi router, (b) Smartphone Mobile Hotspot (4G/5G), (c) RJ45 Cat5e/Cat6 Ethernet cable.</p>
            <div className="text-slate-400 font-mono pt-1">Target Port: 1883 TCP</div>
          </div>
        </div>
      </div>

      {/* Critical Real-World Physics Alert: Clock Synchronization */}
      <div className="border border-amber-900/60 bg-amber-950/20 rounded-xl p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="font-semibold text-amber-300">
            Real-World Physics Pitfall: Clock Skew & One-Way Latency
          </div>
          <p className="text-slate-300 leading-relaxed">
            Calculating one-way latency via <code className="text-amber-200 font-mono">latency = (receive_time - send_time)</code> requires
            that both the Publisher machine and Edge Gateway machine have synchronized system clocks. If their clocks differ by even 50ms,
            the calculated latency will appear artificially high or negative!
          </p>
          <div className="text-xs text-amber-300/90 font-mono pt-1">
            <strong>Solution:</strong> Either run <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200">sudo chronyd -q 'server pool.ntp.org iburst'</code> on both devices, OR run our publisher with the <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200">--rtt-mode</code> flag which measures exact round-trip ping-pong latency on a single self-consistent clock.
          </div>
        </div>
      </div>

      {/* Detailed Step-by-Step Procedure (Steps 17 through 24) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Step-by-Step Procedure Execution</span>
          </h2>
          <span className="text-xs text-slate-400">Follow sequentially in lab</span>
        </div>

        <div className="space-y-6">
          {STEP_BY_STEP_GUIDE.map((step) => {
            const isCompleted = !!completedSteps[step.stepNumber];
            return (
              <div 
                key={step.stepNumber}
                className={`border rounded-xl transition-all ${
                  isCompleted 
                    ? 'border-emerald-800/60 bg-slate-900/40' 
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                {/* Step Header */}
                <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                      title={isCompleted ? "Mark incomplete" : "Mark completed"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                        <span>Step {step.stepNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{step.timeEstimate}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        {step.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap hidden sm:block ${
                      isCompleted 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Mark Done'}
                  </button>
                </div>

                {/* Step Body */}
                <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
                  {/* Objective */}
                  <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                    <div className="text-slate-400 text-xs font-semibold mb-1">TASK OBJECTIVE</div>
                    <div className="text-slate-200">{step.objective}</div>
                  </div>

                  {/* Critical Warning if any */}
                  {step.criticalWarning && (
                    <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>{step.criticalWarning}</div>
                    </div>
                  )}

                  {/* Multi-OS Commands (Step 17) */}
                  {step.commands && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-300">Execution Commands by Platform:</div>
                      
                      {/* OS Tabs */}
                      <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
                        {step.commands.map((c, idx) => (
                          <button
                            key={c.os}
                            onClick={() => setSelectedOsTab(prev => ({ ...prev, [step.stepNumber]: idx }))}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                              (selectedOsTab[step.stepNumber] || 0) === idx
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {c.os}
                          </button>
                        ))}
                      </div>

                      {/* Code Block with Copy */}
                      <div className="relative group">
                        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">
                          {step.commands[selectedOsTab[step.stepNumber] || 0].cmd}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(step.commands[selectedOsTab[step.stepNumber] || 0].cmd, `step-${step.stepNumber}`)}
                          className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                        >
                          {copiedIndex === `step-${step.stepNumber}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 18 Payload Schema */}
                  {step.payloadSchema && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>Expected JSON Telemetry Message Schema:</span>
                        <button
                          onClick={onNavigateToCode}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>View publisher.py code</span>
                        </button>
                      </div>
                      <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                        {step.payloadSchema}
                      </pre>
                    </div>
                  )}

                  {/* Verification or Procedure Bullet Points */}
                  {step.verificationSteps && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Verification Checklist:</div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {step.verificationSteps.map((v, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-mono">›</span>
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Test Procedure Details (Steps 20, 21, 22) */}
                  {step.procedureDetails && (
                    <div className="space-y-2 bg-slate-950/40 p-4 rounded-lg border border-slate-800">
                      <div className="text-xs font-semibold text-slate-300 mb-2">Detailed Lab Procedure:</div>
                      <ol className="space-y-2 text-xs text-slate-300">
                        {step.procedureDetails.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Key Insights (Step 23) */}
                  {step.keyInsights && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Empirical Expectations:</div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {step.keyInsights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-mono">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deliverable Metrics (Step 24) */}
                  {step.deliverableMetrics && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Deliverable Metrics to Calculate:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {step.deliverableMetrics.map((metric, idx) => (
                          <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300 font-mono">
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
