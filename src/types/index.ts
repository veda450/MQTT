export type NetworkType = 
  | 'ethernet'
  | 'wifi_5ghz'
  | 'wifi_24ghz'
  | 'cellular_hotspot_4g'
  | 'cellular_hotspot_5g'
  | 'lpwan_lora';

export interface NetworkProfile {
  id: NetworkType;
  name: string;
  category: 'Wired' | 'Wireless Local' | 'Cellular WAN' | 'LPWAN';
  physicalMedium: string;
  baseLatencyMs: number;
  jitterMs: number;
  lossRatePercent: number;
  bandwidthMbps: string;
  mobilitySupport: 'Stationary' | 'Local Roaming' | 'High Speed WAN' | 'Fixed/Long Range';
  powerProfile: 'High / Mains' | 'Medium' | 'Medium-High' | 'Ultra-Low';
  description: string;
}

export interface PacketTelemetry {
  seq: number;
  timestampSend: number; // ms
  timestampRecv: number; // ms
  latencyMs: number;
  network: NetworkType;
  status: 'delivered' | 'dropped' | 'high_jitter';
  payloadBytes: number;
}

export interface BenchmarkResult {
  networkType: NetworkType;
  networkName: string;
  totalSent: number;
  totalReceived: number;
  lostPackets: number;
  packetLossPercent: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  avgLatencyMs: number;
  jitterStdDevMs: number;
  p95LatencyMs: number;
  isCustomData?: boolean;
}

export interface VivaQuestion {
  id: number;
  question: string;
  category: 'Consistency & Variance' | 'Device Scalability' | 'LPWAN Tradeoffs' | 'Edge Architecture';
  shortAnswer: string;
  inDepthExplanation: string[];
  keyTakeaway: string;
}

export interface EdgeScenario {
  id: string;
  title: string;
  environment: string;
  latencyConstraint: string;
  reliabilityRequirement: string;
  mobility: string;
  recommendedNetwork: NetworkType;
  recommendationName: string;
  tradeoffAnalysis: string;
  justification: string;
}
