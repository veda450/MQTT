import React, { useState } from 'react';
import { CODE_FILES } from '../data/caseStudyContent';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Cpu, 
  Settings, 
  BarChart, 
  ExternalLink 
} from 'lucide-react';

export const CodeWorkspace: React.FC = () => {
  const [activeFileKey, setActiveFileKey] = useState<keyof typeof CODE_FILES>('publisher');
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = CODE_FILES[activeFileKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const fileTabs = [
    { key: 'publisher', label: 'publisher.py', icon: Terminal, category: 'Python Client' },
    { key: 'subscriber', label: 'subscriber.py', icon: Terminal, category: 'Python Gateway' },
    { key: 'esp32', label: 'esp32_mqtt_publisher.ino', icon: Cpu, category: 'C++ Arduino' },
    { key: 'mosquitto_conf', label: 'mosquitto.conf', icon: Settings, category: 'Broker Config' },
    { key: 'analyze_py', label: 'analyze_results.py', icon: BarChart, category: 'Matplotlib Script' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Production Code Repository</span>
              <span aria-hidden="true">·</span>
              <span>Hardware & Gateway Scripts</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Case Study 4 Executable Source Code
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Clean, documented Python, Arduino C++, and configuration scripts ready to run on your Raspberry Pi,
              laptop, or ESP32 sensor. Includes sequence tracking, one-way NTP latency calculation, and CSV exporters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
          {fileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFileKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFileKey(tab.key as keyof typeof CODE_FILES)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span className="text-[10px] text-slate-400 font-mono ml-1 px-1.5 py-0.5 rounded bg-slate-950/60">
                  {tab.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden">
        {/* File Metadata Bar */}
        <div className="p-3.5 px-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-white font-semibold">{activeFile.filename}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">{activeFile.language.toUpperCase()}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {activeFile.description}
          </div>
        </div>

        {/* Source Code Container */}
        <div className="p-4 sm:p-5 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed selection:bg-cyan-500/30">
            <code>{activeFile.code}</code>
          </pre>
        </div>

        {/* Terminal Run Guide Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-xs space-y-2">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Terminal Quick-Run Command:</span>
          </div>

          {activeFileKey === 'publisher' && (
            <div className="space-y-1 font-mono text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded border border-slate-800">
              <div># Install dependency: pip install paho-mqtt</div>
              <div>python3 publisher.py --broker 192.168.1.105 --network wifi --count 120</div>
              <div className="text-slate-400"># For unsynchronized clocks, add --rtt-mode:</div>
              <div>python3 publisher.py --broker 192.168.1.105 --network wifi --rtt-mode</div>
            </div>
          )}

          {activeFileKey === 'subscriber' && (
            <div className="space-y-1 font-mono text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded border border-slate-800">
              <div># Run on Edge Gateway machine (Raspberry Pi):</div>
              <div>python3 subscriber.py --network wifi --output wifi_latency.csv</div>
            </div>
          )}

          {activeFileKey === 'esp32' && (
            <div className="space-y-1 font-mono text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
              <div>1. Open Arduino IDE &gt; Select Board: "ESP32 Dev Module"</div>
              <div>2. Install Library: "PubSubClient" & "ArduinoJson" from Library Manager</div>
              <div>3. Configure Wi-Fi SSID & Password and Broker IP, then Flash via USB-C/Micro-USB</div>
            </div>
          )}

          {activeFileKey === 'mosquitto_conf' && (
            <div className="space-y-1 font-mono text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded border border-slate-800">
              <div>sudo cp mosquitto.conf /etc/mosquitto/conf.d/edge_lab.conf</div>
              <div>sudo systemctl restart mosquitto && sudo systemctl status mosquitto</div>
            </div>
          )}

          {activeFileKey === 'analyze_py' && (
            <div className="space-y-1 font-mono text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded border border-slate-800">
              <div># Requires pandas and matplotlib:</div>
              <div>pip install pandas matplotlib numpy</div>
              <div>python3 analyze_results.py</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
