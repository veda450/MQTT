import React, { useState } from 'react';
import { BenchmarkResult } from '../types';
import { VIVA_QUESTIONS, EDGE_SCENARIOS } from '../data/caseStudyContent';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  CheckCircle2 
} from 'lucide-react';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: BenchmarkResult[];
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  results
}) => {
  const [studentName, setStudentName] = useState<string>('Engineering Student');
  const [rollNumber, setRollNumber] = useState<string>('EDGE-2026-CS04');
  const [institution, setInstitution] = useState<string>('Department of Computer Science & Engineering');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownReport = () => {
    return `# LABORATORY EXPERIMENT REPORT
## Case Study 4: Comparing Access-Network Technologies using MQTT
**Topic 4: Networking Architecture | Edge Computing Architecture & Essentials**

---
- **Student Name**: ${studentName}
- **Roll / Registration No**: ${rollNumber}
- **Department / Institution**: ${institution}
- **Date of Experiment**: ${new Date().toLocaleDateString()}
- **MQTT Protocol**: v3.1.1 on TCP/1883
- **Edge Gateway Broker**: Eclipse Mosquitto on Linux / Raspberry Pi

---

### 1. Objective
To empirically measure and compare how different access-network technologies (Wired Ethernet, Wi-Fi 5 GHz, Wi-Fi 2.4 GHz, and Mobile Cellular Hotspot) affect the latency, jitter, and reliability of sensor data delivery to an edge gateway.

---

### 2. Experimental Hardware & Software Setup
1. **Edge Gateway**: Raspberry Pi 4 / Linux Gateway running Mosquitto MQTT Broker daemon.
2. **Publisher Device**: Python 3.10 node utilizing \`paho-mqtt\` client library.
3. **Access Networks Evaluated**:
   - Wired Ethernet (Cat6 1000BASE-T)
   - Local Wi-Fi (5 GHz 802.11ac)
   - Local Wi-Fi (2.4 GHz 802.11n)
   - Mobile Phone Hotspot (4G LTE / 5G Tethering)

---

### 3. Empirical Results & Tabulation (Step 24)

| Access Network Technology | Sent | Received | Lost | Packet Loss (%) | Avg Latency (ms) | Jitter ±σ (ms) | Min / Max (ms) |
|---|---|---|---|---|---|---|---|
${results.map(r => `| ${r.networkName} | ${r.totalSent} | ${r.totalReceived} | ${r.lostPackets} | ${r.packetLossPercent}% | ${r.avgLatencyMs} ms | ${r.jitterStdDevMs} ms | ${r.minLatencyMs} / ${r.maxLatencyMs} ms |`).join('\n')}

---

### 4. Technical Analysis & Discussion

#### A. Consistency & Variance (Viva Question 1)
- **Lowest Latency & Jitter**: Wired Ethernet consistently delivered the lowest latency (~${results.find(r => r.networkType === 'ethernet')?.avgLatencyMs || '1.2'} ms) and near-zero jitter (±${results.find(r => r.networkType === 'ethernet')?.jitterStdDevMs || '0.3'} ms).
- **Physical Explanation**: Switched Ethernet operates over dedicated copper twisted pairs in full-duplex mode without RF multipath fading or airtime contention. In contrast, Wi-Fi uses CSMA/CA, requiring random exponential backoff during channel busy states.

#### B. Scalability under 20 Concurrent Nodes (Viva Question 2)
- Under 20 simultaneous nodes, Wi-Fi latency degrades exponentially due to collision domain saturation and widening contention windows. Switched Ethernet maintains deterministic line-rate performance.

#### C. Role of the MQTT Broker in Multi-Tier Edge Networks (Viva Question 4)
- The local Mosquitto broker functions as the **Edge Ingestion Bus**, providing temporal and spatial decoupling between field sensors and edge compute analytics, local store-and-forward persistence during WAN outages, and selective bridging to cloud platforms.

---

### 5. Application Recommendations (Step 24 Deliverable)
1. **Factory-Floor Sensor**: **Wired Ethernet (Cat6)** is mandatory due to extreme EMI immunity, deterministic sub-millisecond delivery, and zero frame loss.
2. **Mobile Delivery Robot (AGV)**: **Private 5G / Enterprise Wi-Fi with 802.11r Fast Roaming** is required to accommodate mobile velocity while maintaining reliable telemetry.

---
*Report certified by student: ${studentName} (${rollNumber})*
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Case Study 4 Official Laboratory Report Generator</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied MD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Printable Document */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm bg-slate-900 print:bg-white print:text-black">
          {/* Metadata Edit Header */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 print:border-none print:p-0">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Student Name:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Roll / Reg Number:</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Department / Institution:</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Academic Report Document Header */}
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <div className="text-xs font-mono text-cyan-400">
              Edge Computing Architecture &amp; Essentials — Case Studies Manual (Page 6)
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white print:text-black">
              Case Study 4: Comparing Access-Network Technologies using MQTT
            </h1>
            <div className="text-xs text-slate-400 print:text-slate-700">
              Topic 4 – Networking Architecture | Lab Session Duration: 2 Hours
            </div>
          </div>

          {/* Section 1: Objective */}
          <div className="space-y-1.5">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider print:text-black">
              1. Objective &amp; Scope
            </h3>
            <p className="text-slate-300 leading-relaxed print:text-slate-800 text-xs">
              To measure and compare how different access-network technologies (Wired Ethernet, Wi-Fi 5 GHz,
              Wi-Fi 2.4 GHz, and Mobile Phone Hotspot) affect the delivery latency, transmission jitter, and
              reliability (packet loss rate) of sensor telemetry delivered to an edge gateway running the Mosquitto MQTT broker.
            </p>
          </div>

          {/* Section 2: Hardware & Software Used */}
          <div className="space-y-1.5">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider print:text-black">
              2. Apparatus &amp; Experimental Architecture
            </h3>
            <ul className="space-y-1 text-slate-300 text-xs list-disc pl-5 print:text-slate-800">
              <li><strong>Edge Gateway:</strong> Raspberry Pi 4 Model B running Linux &amp; Eclipse Mosquitto v2.0 Broker daemon on TCP port 1883.</li>
              <li><strong>Sensor Publisher:</strong> Python 3.10 client script using <code className="font-mono bg-slate-950 px-1 py-0.5 rounded">paho-mqtt</code> emitting 120 timestamped JSON packets at 1 Hz.</li>
              <li><strong>Subscriber Analyzer:</strong> High-precision gateway listener logging (t_recv - t_send) latency and evaluating sequence gaps.</li>
              <li><strong>Access Network Channels:</strong> Cat6 RJ45 patch cable, 5GHz 802.11ac Wi-Fi router, 2.4GHz 802.11n Wi-Fi, and 4G/5G Smartphone Hotspot.</li>
            </ul>
          </div>

          {/* Section 3: Official Observations Table (Step 24) */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider print:text-black">
              3. Experimental Observations &amp; Tabulated Metrics (Step 24)
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-x-auto print:border-black">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 font-mono border-b border-slate-800 print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="py-2 px-3">Network Type</th>
                    <th className="py-2 px-3">Sent / Recv</th>
                    <th className="py-2 px-3">Dropped</th>
                    <th className="py-2 px-3">Loss (%)</th>
                    <th className="py-2 px-3">Avg Latency (ms)</th>
                    <th className="py-2 px-3">Jitter ±σ (ms)</th>
                    <th className="py-2 px-3">Min / Max (ms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-200 print:divide-slate-300 print:text-black">
                  {results.map((r) => (
                    <tr key={r.networkType}>
                      <td className="py-2 px-3 font-semibold">{r.networkName}</td>
                      <td className="py-2 px-3">{r.totalReceived} / {r.totalSent}</td>
                      <td className="py-2 px-3">{r.lostPackets}</td>
                      <td className="py-2 px-3">{r.packetLossPercent.toFixed(2)} %</td>
                      <td className="py-2 px-3 font-bold text-cyan-300 print:text-black">{r.avgLatencyMs.toFixed(2)} ms</td>
                      <td className="py-2 px-3">{r.jitterStdDevMs.toFixed(2)} ms</td>
                      <td className="py-2 px-3">{r.minLatencyMs.toFixed(1)} / {r.maxLatencyMs.toFixed(1)} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Viva Voce & Discussion Deliverable */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider print:text-black">
              4. Answers to Viva-Voce Discussion Questions
            </h3>
            <div className="space-y-2 text-xs text-slate-300 print:text-slate-800">
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800 print:border-slate-300">
                <strong>Q1. Lowest Variance Technology:</strong> Wired Ethernet exhibited the lowest variance and highest predictability with standard deviation &lt; 0.5 ms. This is because switched full-duplex Ethernet eliminates airtime contention, collisions, and RF multi-path fading inherent in wireless CSMA/CA.
              </div>
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800 print:border-slate-300">
                <strong>Q2. Impact of 20 Concurrent Nodes:</strong> Wi-Fi latency surges exponentially due to 802.11 CSMA/CA binary exponential backoff collisions. In contrast, switched Ethernet lines scale smoothly without packet collisions.
              </div>
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800 print:border-slate-300">
                <strong>Q3. LPWAN (LoRaWAN) Placement:</strong> LoRaWAN is suited for ultra-low-power long-range (5-15km) sensors sending packets infrequently. It was excluded from direct testing due to strict 1% ISM duty cycles and high packet airtime (~1-5 seconds) which cannot sustain 1 Hz TCP MQTT streams.
              </div>
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800 print:border-slate-300">
                <strong>Q4. Edge Broker Role:</strong> The MQTT broker serves as the local Edge Ingestion and Decoupling Bus, enabling local store-and-forward caching, autonomous offline operation, and upstream cloud synchronization.
              </div>
            </div>
          </div>

          {/* Section 5: Application Suitability Conclusion */}
          <div className="space-y-1.5 border-t border-slate-800 pt-3 print:border-black">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider print:text-black">
              5. Final Application Recommendation (Deliverable)
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs print:text-slate-800">
              • <strong>Factory-Floor Sensor:</strong> Requires <strong>Wired Ethernet</strong> to guarantee sub-5ms deterministic response, absolute immunity to motor electromagnetic interference, and zero packet loss for safety-critical closed-loop control.<br />
              • <strong>Mobile Delivery Robot (AGV):</strong> Requires <strong>Cellular 5G or Enterprise Wi-Fi with 802.11r</strong> to enable continuous roaming across warehouse zones where physical cabling is impossible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
