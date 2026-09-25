import { BenchmarkResult, EdgeScenario, NetworkProfile, VivaQuestion } from '../types';

export const NETWORK_PROFILES: Record<string, NetworkProfile> = {
  ethernet: {
    id: 'ethernet',
    name: 'Wired Ethernet (Cat6)',
    category: 'Wired',
    physicalMedium: '802.3 1000BASE-T Copper Twisted Pair',
    baseLatencyMs: 1.2,
    jitterMs: 0.35,
    lossRatePercent: 0.0,
    bandwidthMbps: '1000 Mbps (Full Duplex)',
    mobilitySupport: 'Stationary',
    powerProfile: 'High / Mains',
    description: 'Dedicated point-to-point collision-free channel with hardware-switched full-duplex transmission.'
  },
  wifi_5ghz: {
    id: 'wifi_5ghz',
    name: 'Wi-Fi 5 GHz (802.11ac/ax)',
    category: 'Wireless Local',
    physicalMedium: 'OFDMA 5 GHz Wireless RF Spectrum',
    baseLatencyMs: 4.8,
    jitterMs: 1.8,
    lossRatePercent: 0.2,
    bandwidthMbps: '300 - 867 Mbps',
    mobilitySupport: 'Local Roaming',
    powerProfile: 'Medium',
    description: 'High frequency wireless band with wider channel widths (40/80MHz) and lower co-channel interference.'
  },
  wifi_24ghz: {
    id: 'wifi_24ghz',
    name: 'Wi-Fi 2.4 GHz (802.11n/b/g)',
    category: 'Wireless Local',
    physicalMedium: 'CSMA/CA 2.4 GHz ISM Spectrum (Shared)',
    baseLatencyMs: 14.5,
    jitterMs: 8.2,
    lossRatePercent: 1.7,
    bandwidthMbps: '72 - 150 Mbps',
    mobilitySupport: 'Local Roaming',
    powerProfile: 'Medium',
    description: 'Crowded 2.4 GHz ISM band subject to Bluetooth/microwave noise, multi-path fading, and CSMA/CA contention.'
  },
  cellular_hotspot_4g: {
    id: 'cellular_hotspot_4g',
    name: 'Mobile Hotspot (4G LTE)',
    category: 'Cellular WAN',
    physicalMedium: 'Licensed Cellular E-UTRA Band (eNodeB Scheduling)',
    baseLatencyMs: 42.6,
    jitterMs: 19.4,
    lossRatePercent: 3.3,
    bandwidthMbps: '20 - 75 Mbps (Down) / 10 Mbps (Up)',
    mobilitySupport: 'High Speed WAN',
    powerProfile: 'Medium-High',
    description: 'Multi-hop cellular topology traversing local Wi-Fi hotspot tethering, cellular base station (eNodeB), and mobile core network (EPC).'
  },
  cellular_hotspot_5g: {
    id: 'cellular_hotspot_5g',
    name: 'Mobile Hotspot (5G Sub-6)',
    category: 'Cellular WAN',
    physicalMedium: '5G NR (gNodeB with Low-Latency TDD Uplink)',
    baseLatencyMs: 18.2,
    jitterMs: 6.5,
    lossRatePercent: 0.8,
    bandwidthMbps: '100 - 450 Mbps',
    mobilitySupport: 'High Speed WAN',
    powerProfile: 'Medium-High',
    description: 'Fifth-generation radio access with flexible numerology, shorter slot durations, and streamlined user plane.'
  },
  lpwan_lora: {
    id: 'lpwan_lora',
    name: 'LPWAN (LoRaWAN Reference)',
    category: 'LPWAN',
    physicalMedium: 'Sub-GHz Chirp Spread Spectrum (868/915 MHz)',
    baseLatencyMs: 1450.0,
    jitterMs: 320.0,
    lossRatePercent: 8.5,
    bandwidthMbps: '0.0003 - 0.05 Mbps (0.3-50 kbps)',
    mobilitySupport: 'Fixed/Long Range',
    powerProfile: 'Ultra-Low',
    description: 'Ultra-long range (5-15km) low-power modulation for small packets. Not designed for real-time TCP MQTT transport.'
  }
};

export const DEFAULT_BENCHMARK_RESULTS: BenchmarkResult[] = [
  {
    networkType: 'ethernet',
    networkName: 'Wired Ethernet (Cat6)',
    totalSent: 120,
    totalReceived: 120,
    lostPackets: 0,
    packetLossPercent: 0.0,
    minLatencyMs: 0.8,
    maxLatencyMs: 2.1,
    avgLatencyMs: 1.25,
    jitterStdDevMs: 0.28,
    p95LatencyMs: 1.62
  },
  {
    networkType: 'wifi_5ghz',
    networkName: 'Wi-Fi 5 GHz (802.11ac)',
    totalSent: 120,
    totalReceived: 120,
    lostPackets: 0,
    packetLossPercent: 0.0,
    minLatencyMs: 3.1,
    maxLatencyMs: 11.4,
    avgLatencyMs: 4.82,
    jitterStdDevMs: 1.65,
    p95LatencyMs: 7.95
  },
  {
    networkType: 'wifi_24ghz',
    networkName: 'Wi-Fi 2.4 GHz (802.11n)',
    totalSent: 120,
    totalReceived: 118,
    lostPackets: 2,
    packetLossPercent: 1.67,
    minLatencyMs: 8.5,
    maxLatencyMs: 46.8,
    avgLatencyMs: 15.34,
    jitterStdDevMs: 7.92,
    p95LatencyMs: 29.4
  },
  {
    networkType: 'cellular_hotspot_4g',
    networkName: 'Mobile Hotspot (4G LTE)',
    totalSent: 120,
    totalReceived: 116,
    lostPackets: 4,
    packetLossPercent: 3.33,
    minLatencyMs: 27.4,
    maxLatencyMs: 118.2,
    avgLatencyMs: 44.15,
    jitterStdDevMs: 18.6,
    p95LatencyMs: 78.4
  },
  {
    networkType: 'cellular_hotspot_5g',
    networkName: 'Mobile Hotspot (5G Sub-6)',
    totalSent: 120,
    totalReceived: 119,
    lostPackets: 1,
    packetLossPercent: 0.83,
    minLatencyMs: 12.3,
    maxLatencyMs: 38.7,
    avgLatencyMs: 18.9,
    jitterStdDevMs: 5.8,
    p95LatencyMs: 28.1
  }
];

export const STEP_BY_STEP_GUIDE = [
  {
    stepNumber: 17,
    title: 'Install & Configure Mosquitto MQTT Broker on the Edge Gateway',
    timeEstimate: '15 min',
    summary: 'Turn your Raspberry Pi, Linux PC, or laptop into a dedicated local MQTT edge ingestion broker.',
    objective: 'Ensure the Mosquitto daemon accepts remote TCP connections on port 1883 across all access networks.',
    criticalWarning: 'Mosquitto version 2.0+ binds only to localhost (127.0.0.1) by default! You MUST configure `listener 1883 0.0.0.0` and `allow_anonymous true`, otherwise remote publishers over Wi-Fi and Hotspot will face "Connection Refused" errors.',
    commands: [
      {
        os: 'Ubuntu / Debian / Raspberry Pi OS',
        cmd: 'sudo apt update\nsudo apt install -y mosquitto mosquitto-clients\n\n# Configure external access listener\nsudo bash -c \'cat > /etc/mosquitto/conf.d/external.conf << EOF\nlistener 1883 0.0.0.0\nallow_anonymous true\nEOF\'\n\n# Restart and enable broker service\nsudo systemctl restart mosquitto\nsudo systemctl enable mosquitto\n\n# Check broker status\nsudo systemctl status mosquitto'
      },
      {
        os: 'macOS (Homebrew)',
        cmd: 'brew install mosquitto\n\n# Append listener to config\necho -e "listener 1883 0.0.0.0\\nallow_anonymous true" >> $(brew --prefix)/etc/mosquitto/mosquitto.conf\n\n# Start service\nbrew services restart mosquitto'
      },
      {
        os: 'Windows (PowerShell / Command Prompt)',
        cmd: '# Download installer from https://mosquitto.org/download/\n# In C:\\Program Files\\mosquitto\\mosquitto.conf, ensure:\n# listener 1883\n# allow_anonymous true\n\n# Start Mosquitto in PowerShell:\ncd "C:\\Program Files\\mosquitto"\n.\\mosquitto.exe -c mosquitto.conf -v'
      }
    ],
    verificationSteps: [
      'Find Edge Gateway local IP: run `hostname -I` or `ip a` (e.g., 192.168.1.105 or 172.20.10.2).',
      'Test local loopback publication: Open terminal 1: `mosquitto_sub -h localhost -t "edge/test"` and terminal 2: `mosquitto_pub -h localhost -t "edge/test" -m "broker_active"`.'
    ]
  },
  {
    stepNumber: 18,
    title: 'Develop the Edge Publisher Script (Python / ESP32)',
    timeEstimate: '20 min',
    summary: 'Implement a timestamped, sequence-numbered telemetry emitter using the Paho-MQTT library.',
    objective: 'Emit a lightweight JSON payload every 1.0 second containing accurate epoch send timestamps and incrementing sequence IDs.',
    criticalWarning: 'Time Synchronization Physics: When computing one-way latency (receive_time - send_time), both machines MUST have sub-millisecond clock synchronization via NTP or chrony. We also provide a built-in Round-Trip Time (RTT Echo) mode in the scripts to prevent negative latency if the clocks have drift.',
    codeSnippet: 'publisher.py',
    payloadSchema: `{
  "seq": 42,
  "device_id": "sensor-node-01",
  "timestamp_send": 1711234567.891234,
  "network": "wifi_5ghz",
  "data": {
    "temperature": 24.3,
    "vibration_rms": 0.042
  }
}`
  },
  {
    stepNumber: 19,
    title: 'Develop the Gateway Latency & Reliability Subscriber',
    timeEstimate: '20 min',
    summary: 'Deploy subscriber script on the edge gateway to log receive timestamps and evaluate packet health.',
    objective: 'Subscribe to `edge/telemetry/#`, record `timestamp_recv`, compute latency in milliseconds, track missing sequence IDs to detect packet drops, and save to CSV.',
    criticalWarning: 'Sequence Gap Detection Formula: if (current_seq - last_seq) > 1, then exactly (current_seq - last_seq - 1) packets were dropped in transit by the access network.',
    codeSnippet: 'subscriber.py'
  },
  {
    stepNumber: 20,
    title: 'Execute Test Run 1: Local Wi-Fi Access Network',
    timeEstimate: '15 min',
    summary: 'Connect publisher device to the local Wi-Fi router / Access Point alongside the edge gateway.',
    objective: 'Run continuous publication for 120 seconds (120 messages) at 1 Hz and log latency profile.',
    procedureDetails: [
      '1. Verify both Publisher and Gateway are connected to the same Wi-Fi SSID.',
      '2. Ping the Gateway IP from publisher: `ping <GATEWAY_IP>` (note baseline ICMP latency ~3-10ms).',
      '3. On Gateway, run: `python3 subscriber.py --network wifi --output wifi_latency.csv`',
      '4. On Publisher, run: `python3 publisher.py --broker <GATEWAY_IP> --network wifi --count 120`',
      '5. Observe sequence delivery, observe occasional jitter spikes due to beacon intervals & CSMA/CA contention.'
    ]
  },
  {
    stepNumber: 21,
    title: 'Execute Test Run 2: Mobile Phone Hotspot Tethering',
    timeEstimate: '15 min',
    summary: 'Enable mobile hotspot on a smartphone and connect both gateway and publisher to the hotspot.',
    objective: 'Measure cellular scheduling delay, radio resource control (RRC) state transitions, and jitter over 120 seconds.',
    procedureDetails: [
      '1. Enable Personal Hotspot on your smartphone (4G LTE or 5G).',
      '2. Connect both the Edge Gateway and Publisher to this hotspot network.',
      '3. Check gateway new IP assigned by the hotspot DHCP (typically in `172.20.10.x` or `192.168.43.x`).',
      '4. Run subscriber: `python3 subscriber.py --network hotspot --output hotspot_latency.csv`',
      '5. Run publisher: `python3 publisher.py --broker <HOTSPOT_GATEWAY_IP> --network hotspot --count 120`',
      '6. Notice higher base latency (30-60ms) and higher variance due to cellular scheduling and mobile carrier NAT.'
    ]
  },
  {
    stepNumber: 22,
    title: 'Execute Test Run 3: Wired Ethernet Direct / Switched Cable',
    timeEstimate: '15 min',
    summary: 'Connect publisher directly to the gateway via an RJ45 Cat5e/Cat6 patch cable or Gigabit switch.',
    objective: 'Measure baseline physical wire limits with zero RF interference, full duplex, and zero packet loss.',
    procedureDetails: [
      '1. Connect Ethernet cable between publisher and gateway (or through a Gigabit Ethernet switch).',
      '2. If direct peer-to-peer cable is used without a DHCP router, assign static IPs (e.g., Gateway: `192.168.2.1/24`, Publisher: `192.168.2.2/24`).',
      '3. Verify link: `ping 192.168.2.1` (should be < 1.0 ms).',
      '4. Run subscriber: `python3 subscriber.py --network ethernet --output ethernet_latency.csv`',
      '5. Run publisher: `python3 publisher.py --broker 192.168.2.1 --network ethernet --count 120`',
      '6. Notice near-flat line latency (~0.8 to 1.5ms) with 0.00% packet loss.'
    ]
  },
  {
    stepNumber: 23,
    title: 'Extract Sequence Numbers & Quantify Packet Drop Rate',
    timeEstimate: '10 min',
    summary: 'Compute total sent, total received, missing sequence gaps, and calculate loss percentage.',
    formula: 'Packet Loss (%) = ((Total Sent - Total Received) / Total Sent) * 100',
    keyInsights: [
      'Ethernet: Typically 0% packet loss due to dedicated collision domains.',
      'Wi-Fi: Minor loss (0-2%) primarily from RF interference or sudden channel re-scans.',
      'Hotspot: Moderate loss (1-4%) during cellular uplink grant delays or carrier handoffs.'
    ]
  },
  {
    stepNumber: 24,
    title: 'Tabulate, Graph & Analyze Benchmark Findings',
    timeEstimate: '15 min',
    summary: 'Run automated analysis script or use interactive dashboard to plot latency distributions and compare metrics.',
    deliverableMetrics: [
      'Average Latency (ms): Mean transmission delay',
      'Jitter / Standard Deviation (ms): Latency predictability and stability',
      'Packet Loss Rate (%): Reliability of the access layer',
      'P95 Latency (ms): Tail latency impact for safety-critical edge loops'
    ]
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: 'Which access technology gave the most consistent (lowest-variance) latency, and why?',
    category: 'Consistency & Variance',
    shortAnswer: 'Wired Ethernet (Cat6) produced the lowest variance and highest consistency with standard deviation < 0.5 ms.',
    inDepthExplanation: [
      'Physical Layer Independence: Wired Ethernet uses dedicated copper twisted pairs (1000BASE-T) with full-duplex transmission, eliminating collisions entirely through point-to-point switch fabric.',
      'No Contention Backoff: Unlike Wi-Fi which relies on CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) requiring random exponential backoff intervals when channels are busy, Ethernet has zero airtime contention.',
      'Zero Electromagnetic Multipath Interference: Wireless RF links suffer from multipath reflections, Doppler shift, physical obstacles (attenuation), and co-channel interference from microwaves or nearby routers, causing sporadic retransmissions at the MAC layer.'
    ],
    keyTakeaway: 'In safety-critical edge computing (e.g. robotic emergency stops), low jitter is often more crucial than raw throughput. Ethernet provides deterministic delivery.'
  },
  {
    id: 2,
    question: 'How would your results likely change if 20 publisher devices were sending data simultaneously instead of 1–2?',
    category: 'Device Scalability',
    shortAnswer: 'Wi-Fi latency and packet loss would increase exponentially due to CSMA/CA collision cascades; Ethernet would remain stable; Cellular hotspot would experience uplink scheduling bottlenecks.',
    inDepthExplanation: [
      'Wi-Fi Collision Explosion: Under 802.11 CSMA/CA, all 20 devices compete for the same radio channel. As node count increases, collision probability rises quadratically. The binary exponential backoff expands contention windows, causing average latency to surge from ~15ms to 150-300ms, with increased dropped packets.',
      'Wired Ethernet Micro-Segmentation: Modern switches provide dedicated full-duplex lines per port. 20 devices on a 24-port Gigabit switch do not collide. Latency remains ~1-2ms as long as the gateway ingress port is not bandwidth-saturated.',
      'Mobile Hotspot Tethering Bottleneck: Smartphone hotspot processors are not enterprise access points. Handling 20 concurrent Wi-Fi associations + NAT routing + single-carrier LTE uplink grants will cause severe packet queueing, device thermal throttling, and connection drops.'
    ],
    keyTakeaway: 'For industrial dense sensor deployments (100+ sensors), switched Ethernet or private 5G / Wi-Fi 6 with OFDMA resource units is mandatory to avoid CSMA/CA collapse.'
  },
  {
    id: 3,
    question: 'Where would LPWAN (e.g., LoRaWAN) fit into this comparison, and why wasn’t it tested directly here?',
    category: 'LPWAN Tradeoffs',
    shortAnswer: 'LoRaWAN provides kilometers of range at milliwatt power, but has 1,000–5,000 ms latency and duty-cycle caps. It was not tested directly because it cannot support standard TCP/IP MQTT without specialized MQTT-SN gateways.',
    inDepthExplanation: [
      'Protocol Mismatch (TCP vs Raw Packets): Standard MQTT operates on top of TCP, requiring a 3-way handshake (SYN, SYN-ACK, ACK), 20-byte TCP headers, and frequent keep-alive pings. LoRaWAN max payload sizes are typically only 51 to 222 bytes, making raw TCP/IP highly inefficient.',
      'Severe Duty Cycle Regulations: In European 868 MHz ISM bands, devices are legally restricted to a 1% duty cycle (max 36 seconds of transmission per hour). Sending 1 message per second as in this lab would violate federal telecom regulations within minutes!',
      'Extreme Latency Profile: LoRaWAN relies on Chirp Spread Spectrum with low bitrates (300 bps to 50 kbps). Uplink airtime alone is 100-800 ms, and downlinks (Class A) must wait for receive windows (1-2 seconds after TX).',
      'Proper Edge Role: LoRaWAN uses MQTT-SN (MQTT for Sensor Networks) or connects to a LoRa Gateway via Packet Forwarder / Semtech UDP, which transforms packets into MQTT at the Edge Gateway layer.'
    ],
    keyTakeaway: 'LPWAN is optimized for deep rural/outdoor low-frequency telemetry (1 packet every 15 minutes over 10 km on battery for 5 years), not high-frequency 1 Hz edge feedback control.'
  },
  {
    id: 4,
    question: 'What role does the MQTT broker itself play in a real multi-tier edge network — is it the ‘edge layer’ or something else?',
    category: 'Edge Architecture',
    shortAnswer: 'The MQTT broker serves as the local Edge Ingestion & Decoupling Bus, operating at the Edge Gateway/Fog tier with bridging capabilities to Cloud.',
    inDepthExplanation: [
      'Temporal & Spatial Decoupling: In a 3-tier architecture (Sensors -> Edge Gateway -> Cloud), the MQTT broker decouples data producers from consumers. Sensors do not need to know where inference containers, local time-series databases (InfluxDB), or cloud sync services are located.',
      'Local Autonomy (Store & Forward): If WAN internet connectivity fails, the local Mosquitto broker continues queuing telemetry and serving local closed-loop edge controllers (e.g. SCADA/Node-RED).',
      'Edge-to-Cloud Bridge: Modern edge architectures run a local broker that aggregates and filters high-frequency sensor streams (e.g., downsampling 100 Hz vibration to 1-minute summaries) and bridges selected topics to AWS IoT Core, Azure IoT Hub, or Google Cloud Pub/Sub via TLS MQTT bridging.'
    ],
    keyTakeaway: 'The MQTT broker is the central nervous system of the Edge Gateway layer, providing protocol mediation, QoS caching, and edge autonomy.'
  }
];

export const EDGE_SCENARIOS: EdgeScenario[] = [
  {
    id: 'factory_robot',
    title: 'Automated Factory-Floor Robotic Arm with Safety Interlock',
    environment: 'Industrial shop floor with heavy electromagnetic noise from VFD motor drives and welders.',
    latencyConstraint: '< 5 ms (Deterministic, jitter < 1 ms)',
    reliabilityRequirement: '99.999% (Zero packet loss tolerance)',
    mobility: 'Fixed stationary installation',
    recommendedNetwork: 'ethernet',
    recommendationName: 'Wired Industrial Ethernet (Cat6A / TSN)',
    tradeoffAnalysis: 'Wireless (Wi-Fi/Cellular) is strictly unacceptable due to unpredictable RF interference, multipath fading, and variable CSMA/CA latency spikes that could trigger emergency safety halts.',
    justification: 'Guarantees sub-millisecond round-trip time, zero frame loss, and immunity to high EMI generated by adjacent induction equipment.'
  },
  {
    id: 'delivery_agv',
    title: 'Autonomous Mobile Robot (AGV) in a Multi-Building Campus',
    environment: 'Indoor warehouse transitioning to outdoor loading docks and inter-building transit pathways.',
    latencyConstraint: '< 30 ms (Sufficient for obstacle reporting & telemetry)',
    reliabilityRequirement: '99.0% with fail-safe local autonomy',
    mobility: 'High mobility (moving at 15 km/h across zones)',
    recommendedNetwork: 'cellular_hotspot_5g',
    recommendationName: 'Private 5G NR / Cellular LTE with Fast Roaming',
    tradeoffAnalysis: 'Wired Ethernet is physically impossible due to umbilical cord entanglement. Wi-Fi suffers from AP handover packet drops (BSS transitions) when crossing outdoor loading zones.',
    justification: '5G cellular offers seamless cellular handovers, wide outdoor coverage, uplink QoS priority slicing, and resilient mobile connectivity.'
  },
  {
    id: 'smart_agriculture',
    title: 'Soil Moisture & Microclimate Sensor Cluster in 500-Acre Orchard',
    environment: 'Remote agricultural field with dense canopy, no mains electricity, battery/solar powered.',
    latencyConstraint: '< 5,000 ms (Telemetry every 15 minutes)',
    reliabilityRequirement: '95.0% (Infrequent packet loss acceptable)',
    mobility: 'Stationary field probes',
    recommendedNetwork: 'lpwan_lora',
    recommendationName: 'LoRaWAN / LPWAN to Edge Gateway with Cellular Backhaul',
    tradeoffAnalysis: 'Wired cabling is cost-prohibitive over 500 acres. Wi-Fi range (<100m) requires too many repeaters and exhausts batteries in days. Cellular SIM on every sensor is economically unviable.',
    justification: 'LoRaWAN provides 10+ km coverage through foliage, operates on single AA batteries for 5+ years, and feeds an Edge Gateway that translates to MQTT.'
  },
  {
    id: 'building_hvac',
    title: 'Commercial Office Building Environmental & Air Quality Monitoring',
    environment: 'Multi-story office building with existing corporate enterprise Wi-Fi infrastructure.',
    latencyConstraint: '< 500 ms (Room temperature & CO2 updates)',
    reliabilityRequirement: '98.5%',
    mobility: 'Fixed ceiling and wall mounted sensors',
    recommendedNetwork: 'wifi_5ghz',
    recommendationName: 'Enterprise Wi-Fi 5GHz (WPA3 Enterprise)',
    tradeoffAnalysis: 'Trenching Ethernet cables through drywall and ceilings is costly ($150-$300 per drop). 5GHz band avoids 2.4GHz office interference from laptops and microwave ovens.',
    justification: 'Leverages existing commercial access points, offers low installation costs, and easily meets relaxed 1-second HVAC telemetry deadlines.'
  }
];

export const CODE_FILES = {
  publisher: {
    filename: 'publisher.py',
    language: 'python',
    description: 'Timestamped MQTT publisher supporting one-way sync latency and round-trip RTT echo modes.',
    code: `#!/usr/bin/env python3
"""
Case Study 4: MQTT Publisher Script for Access Network Latency Benchmarking
Topic 4: Networking Architecture | Edge Computing Manual

Features:
- Publishes high-precision timestamped JSON payloads at regular intervals (default: 1.0s).
- Sequence numbered messages to detect packet loss at the gateway.
- Supports both One-Way Latency mode (NTP synced) and RTT Echo mode (self-contained clock).
- Configurable QoS (0, 1, 2) and network metadata tagging.
"""

import time
import json
import argparse
import sys
import paho.mqtt.client as mqtt

def parse_args():
    parser = argparse.ArgumentParser(description="Edge MQTT Publisher for Case Study 4")
    parser.add_argument("--broker", type=str, default="localhost", 
                        help="IP address or hostname of the Mosquitto Edge Gateway (e.g. 192.168.1.100)")
    parser.add_argument("--port", type=int, default=1883, help="MQTT broker port (default: 1883)")
    parser.add_argument("--network", type=str, default="wifi", 
                        choices=["ethernet", "wifi", "hotspot", "custom"],
                        help="Access network identifier being tested")
    parser.add_argument("--interval", type=float, default=1.0, help="Interval between messages in seconds (default: 1.0)")
    parser.add_argument("--count", type=int, default=120, help="Total messages to send (120 = 2 minutes at 1 Hz)")
    parser.add_argument("--qos", type=int, default=0, choices=[0, 1, 2], help="MQTT Quality of Service level")
    parser.add_argument("--rtt-mode", action="store_true", 
                        help="Enable Round-Trip-Time echo mode (ideal if gateway and publisher clocks are not NTP synced)")
    return parser.parse_args()

def main():
    args = parse_args()
    topic_pub = f"edge/telemetry/{args.network}"
    topic_echo = f"edge/echo/{args.network}"

    client = mqtt.Client(client_id=f"pub_{args.network}_{int(time.time())}", protocol=mqtt.MQTTv311)
    
    rtt_latencies = []

    def on_connect(c, userdata, flags, rc):
        if rc == 0:
            print(f"[OK] Connected successfully to Edge Broker at {args.broker}:{args.port}")
            if args.rtt_mode:
                c.subscribe(topic_echo)
                print(f"[INFO] Subscribed to echo topic '{topic_echo}' for RTT measurement")
        else:
            print(f"[ERROR] Connection failed with error code: {rc}")
            sys.exit(1)

    def on_message(c, userdata, msg):
        # Used only in RTT mode
        recv_time = time.time()
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            send_time = payload.get("timestamp_send", 0)
            seq = payload.get("seq", -1)
            rtt_ms = (recv_time - send_time) * 1000.0
            rtt_latencies.append(rtt_ms)
            print(f"[RTT ECHO] Seq #{seq:03d} | Round-Trip Latency: {rtt_ms:6.2f} ms")
        except Exception as e:
            print(f"[WARN] Error decoding echo message: {e}")

    client.on_connect = on_connect
    if args.rtt_mode:
        client.on_message = on_message

    print("=" * 65)
    print("  CASE STUDY 4: MQTT ACCESS NETWORK BENCHMARK (PUBLISHER)")
    print(f"  Target Broker : {args.broker}:{args.port}")
    print(f"  Network Mode  : {args.network.upper()}")
    print(f"  Publish Topic : {topic_pub}")
    print(f"  Message Count : {args.count} packets (Interval: {args.interval}s)")
    print(f"  Measurement   : {'Round-Trip Time (RTT)' if args.rtt_mode else 'One-Way Latency (Requires Sync)'}")
    print("=" * 65)

    try:
        client.connect(args.broker, args.port, keepalive=60)
    except Exception as e:
        print(f"[FATAL] Could not connect to broker at {args.broker}:{args.port}")
        print(f"        Details: {e}")
        print("        Troubleshooting tips:")
        print("        1. Check if Mosquitto is running on gateway: 'sudo systemctl status mosquitto'")
        print("        2. Ensure listener 1883 0.0.0.0 is configured in /etc/mosquitto/mosquitto.conf")
        print("        3. Ensure firewall allows port 1883: 'sudo ufw allow 1883'")
        sys.exit(1)

    client.loop_start()
    time.sleep(1.0) # Allow connection handshake to complete

    print("\n[START] Beginning transmission sequence...\n")
    start_test_time = time.time()

    for seq in range(1, args.count + 1):
        timestamp_send = time.time()
        
        # Sensor payload simulating industrial edge sensor
        payload = {
            "seq": seq,
            "device_id": f"edge-node-{args.network}",
            "timestamp_send": timestamp_send,
            "network": args.network,
            "data": {
                "temperature": round(23.5 + (seq % 10) * 0.2, 2),
                "vibration_rms": round(0.04 + (seq % 5) * 0.01, 3)
            }
        }
        
        json_payload = json.dumps(payload)
        client.publish(topic_pub, json_payload, qos=args.qos)
        
        if not args.rtt_mode:
            print(f"[TX] Seq #{seq:03d} | Timestamp: {timestamp_send:.6f} | Bytes: {len(json_payload)}")
        
        time.sleep(args.interval)

    total_test_duration = time.time() - start_test_time
    time.sleep(2.0) # Drain pending buffers
    client.loop_stop()
    client.disconnect()

    print("\n" + "=" * 65)
    print("[COMPLETED] All packets dispatched.")
    print(f"  Total Packets Sent : {args.count}")
    print(f"  Total Duration     : {total_test_duration:.2f} seconds")
    if args.rtt_mode and rtt_latencies:
        avg_rtt = sum(rtt_latencies) / len(rtt_latencies)
        print(f"  Average RTT Latency: {avg_rtt:.2f} ms")
        print(f"  Estimated 1-Way Lat: {avg_rtt / 2.0:.2f} ms (approx)")
    print("=" * 65)

if __name__ == "__main__":
    main()
`
  },
  subscriber: {
    filename: 'subscriber.py',
    language: 'python',
    description: 'Edge Gateway subscriber computing one-way latency, loss detection, and CSV export.',
    code: `#!/usr/bin/env python3
"""
Case Study 4: MQTT Subscriber & Latency Analyzer for Edge Gateway
Topic 4: Networking Architecture | Edge Computing Manual

Features:
- Runs directly on the Edge Gateway device (Raspberry Pi / Laptop).
- Subscribes to 'edge/telemetry/#' topics.
- Calculates network latency: (receive_timestamp - send_timestamp) * 1000 ms.
- Detects packet loss by identifying gaps in sequence numbers.
- Computes live rolling statistics: Mean, Jitter (StdDev), Min, Max, Packet Loss %.
- Automatically writes timestamped records to a clean CSV file.
- Supports optional Echo mode for RTT publishers.
"""

import time
import json
import csv
import argparse
import sys
import math
import paho.mqtt.client as mqtt

def parse_args():
    parser = argparse.ArgumentParser(description="Edge MQTT Gateway Subscriber & Latency Analyzer")
    parser.add_argument("--broker", type=str, default="localhost", help="MQTT broker address")
    parser.add_argument("--port", type=int, default=1883, help="MQTT broker port")
    parser.add_argument("--network", type=str, default="wifi", help="Target access network label (wifi/ethernet/hotspot)")
    parser.add_argument("--output", type=str, default="latency_log.csv", help="CSV filename to save results")
    parser.add_argument("--echo", action="store_true", help="Bounce back received payload to edge/echo topic for RTT")
    return parser.parse_args()

class LatencyTracker:
    def __init__(self, output_file, network_label):
        self.output_file = output_file
        self.network_label = network_label
        self.total_received = 0
        self.last_seq = None
        self.dropped_packets = 0
        self.latencies = []
        
        # Initialize CSV file
        self.csv_file = open(self.output_file, mode='w', newline='')
        self.csv_writer = csv.writer(self.csv_file)
        self.csv_writer.writerow([
            "seq", "network", "timestamp_send", "timestamp_recv", 
            "latency_ms", "jitter_ms", "status"
        ])
        self.csv_file.flush()

    def process_packet(self, seq, send_time, recv_time, raw_network):
        self.total_received += 1
        
        # Sequence drop check
        if self.last_seq is not None:
            seq_gap = seq - self.last_seq
            if seq_gap > 1:
                dropped = seq_gap - 1
                self.dropped_packets += dropped
                print(f"\\033[91m[PACKET LOSS ALERT] Missing {dropped} packet(s) between #{self.last_seq} and #{seq}!\\033[0m")
        self.last_seq = seq

        # Compute one-way latency
        latency_ms = (recv_time - send_time) * 1000.0
        
        # Guard against unsynchronized clocks
        if latency_ms < 0:
            status = "CLOCK_UNSYNC_WARNING"
        elif latency_ms > 200:
            status = "HIGH_JITTER"
        else:
            status = "NORMAL"

        self.latencies.append(latency_ms)
        
        # Calculate rolling stats
        count = len(self.latencies)
        avg = sum(self.latencies) / count
        variance = sum((x - avg) ** 2 for x in self.latencies) / count if count > 1 else 0.0
        jitter = math.sqrt(variance)

        # Write to CSV
        self.csv_writer.writerow([
            seq, self.network_label, f"{send_time:.6f}", f"{recv_time:.6f}",
            f"{latency_ms:.3f}", f"{jitter:.3f}", status
        ])
        self.csv_file.flush()

        # Terminal Visual Line
        print(f"[RX] Seq: #{seq:03d} | Latency: {latency_ms:6.2f} ms | Rolling Avg: {avg:5.2f} ms | Jitter: {jitter:4.2f} ms | Drops: {self.dropped_packets}")

    def print_summary(self):
        self.csv_file.close()
        print("\n" + "=" * 65)
        print("          EDGE GATEWAY BENCHMARK SUMMARY")
        print("=" * 65)
        print(f"  Network Tested       : {self.network_label.upper()}")
        print(f"  Total Packets Recv   : {self.total_received}")
        print(f"  Total Packets Dropped: {self.dropped_packets}")
        
        total_expected = self.total_received + self.dropped_packets
        loss_pct = (self.dropped_packets / total_expected * 100.0) if total_expected > 0 else 0.0
        print(f"  Calculated Loss Rate : {loss_pct:.2f} %")
        
        if self.latencies:
            valid_lats = [x for x in self.latencies if x >= 0]
            if valid_lats:
                avg = sum(valid_lats) / len(valid_lats)
                min_l = min(valid_lats)
                max_l = max(valid_lats)
                variance = sum((x - avg) ** 2 for x in valid_lats) / len(valid_lats)
                std_dev = math.sqrt(variance)
                
                sorted_l = sorted(valid_lats)
                p95_idx = int(0.95 * len(sorted_l))
                p95 = sorted_l[min(p95_idx, len(sorted_l) - 1)]

                print(f"  Min Latency          : {min_l:.2f} ms")
                print(f"  Max Latency          : {max_l:.2f} ms")
                print(f"  Average Latency      : {avg:.2f} ms")
                print(f"  Jitter (StdDev)      : {std_dev:.2f} ms")
                print(f"  95th Percentile      : {p95:.2f} ms")
        print(f"  Output CSV saved to  : {self.output_file}")
        print("=" * 65)

def main():
    args = parse_args()
    tracker = LatencyTracker(args.output, args.network)
    topic_sub = f"edge/telemetry/{args.network}"
    topic_echo = f"edge/echo/{args.network}"

    client = mqtt.Client(client_id=f"gateway_sub_{int(time.time())}", protocol=mqtt.MQTTv311)

    def on_connect(c, userdata, flags, rc):
        if rc == 0:
            print(f"[OK] Gateway subscriber connected to broker at {args.broker}:{args.port}")
            c.subscribe(topic_sub)
            print(f"[INFO] Listening on topic: '{topic_sub}'")
            print("[INFO] Waiting for incoming publisher packets... Press Ctrl+C to stop.")
        else:
            print(f"[ERROR] Failed to connect with code {rc}")

    def on_message(c, userdata, msg):
        recv_time = time.time()
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            seq = payload.get("seq")
            send_time = payload.get("timestamp_send")
            network = payload.get("network", args.network)

            if seq is not None and send_time is not None:
                tracker.process_packet(seq, send_time, recv_time, network)
                
                # Optional Echo bounce back for RTT mode
                if args.echo:
                    c.publish(topic_echo, msg.payload)

        except Exception as e:
            print(f"[WARN] Failed to parse JSON message: {e}")

    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(args.broker, args.port, keepalive=60)
        client.loop_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Manual termination received (Ctrl+C). Generating report...")
    finally:
        client.disconnect()
        tracker.print_summary()

if __name__ == "__main__":
    main()
`
  },
  esp32: {
    filename: 'esp32_mqtt_publisher.ino',
    language: 'cpp',
    description: 'Arduino C++ sketch for ESP32 microcontroller with Wi-Fi & NTP synchronization.',
    code: `/*
 * Case Study 4: ESP32 MQTT Publisher for Access Network Benchmarking
 * Hardware: ESP32 DevKit V1
 * Required Libraries: WiFi.h, PubSubClient, ArduinoJson, time.h
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "time.h"

// Network Configuration (Change to your Wi-Fi credentials)
const char* ssid = "YOUR_WIFI_OR_HOTSPOT_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Edge Gateway Mosquitto Broker Configuration
const char* mqtt_server = "192.168.1.105"; // IP of your Raspberry Pi / Gateway
const int mqtt_port = 1883;
const char* mqtt_topic = "edge/telemetry/wifi";

// NTP Server for Epoch Timestamp Synchronization
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 0;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsgTime = 0;
int seqNumber = 1;
const int MAX_PACKETS = 120; // 2 minutes test at 1 Hz

double getEpochTimeInSeconds() {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  return (double)tv.tv_sec + ((double)tv.tv_usec / 1000000.0);
}

void setup_wifi() {
  delay(10);
  Serial.printf("\\n[WIFI] Connecting to %s", ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\\n[WIFI] Connected successfully!");
  Serial.print("[WIFI] IP Address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("[MQTT] Attempting connection to Edge Broker...");
    String clientId = "ESP32Node-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println(" CONNECTED!");
    } else {
      Serial.print(" FAILED, rc=");
      Serial.print(client.state());
      Serial.println(" Trying again in 2 seconds...");
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  
  // Synchronize internal RTC clock via NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("[NTP] Synchronizing RTC clock...");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\\n[NTP] Time synchronized successfully!");

  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsgTime > 1000 && seqNumber <= MAX_PACKETS) {
    lastMsgTime = now;

    double sendTimestamp = getEpochTimeInSeconds();

    // Construct JSON Payload
    StaticJsonDocument<256> doc;
    doc["seq"] = seqNumber;
    doc["device_id"] = "esp32-node-01";
    doc["timestamp_send"] = sendTimestamp;
    doc["network"] = "wifi";
    
    JsonObject dataObj = doc.createNestedObject("data");
    dataObj["temperature"] = 24.5 + random(-10, 10) * 0.1;
    dataObj["rssi"] = WiFi.RSSI();

    char buffer[256];
    serializeJson(doc, buffer);

    boolean success = client.publish(mqtt_topic, buffer);
    if (success) {
      Serial.printf("[TX #%03d] Timestamp: %.4f | RSSI: %d dBm\\n", seqNumber, sendTimestamp, WiFi.RSSI());
    } else {
      Serial.printf("[FAIL #%03d] Publish error\\n", seqNumber);
    }

    seqNumber++;
    if (seqNumber > MAX_PACKETS) {
      Serial.println("\\n[COMPLETE] 120 packets transmitted! Test completed.");
    }
  }
}
`
  },
  mosquitto_conf: {
    filename: 'mosquitto.conf',
    language: 'ini',
    description: 'Mosquitto edge broker configuration enabling remote multi-network access.',
    code: `# Mosquitto Edge Gateway Configuration for Case Study 4
# Place in /etc/mosquitto/conf.d/edge_lab.conf (Linux/Raspberry Pi)

# 1. Listen on all network interfaces (Ethernet, Wi-Fi, Hotspot) on port 1883
listener 1883 0.0.0.0

# 2. Allow anonymous connections for testing (No username/password required)
allow_anonymous true

# 3. Connection and Queue Settings
max_connections -1
max_queued_messages 1000

# 4. Logging configuration for debugging network arrivals
log_dest stdout
log_dest file /var/log/mosquitto/mosquitto.log
log_type error
log_type warning
log_type notice
log_type information
connection_messages true
log_timestamp true
log_timestamp_format %Y-%m-%dT%H:%M:%S
`
  },
  analyze_py: {
    filename: 'analyze_results.py',
    language: 'python',
    description: 'Automated data visualization script generating required comparison graphs using matplotlib & pandas.',
    code: `#!/usr/bin/env python3
"""
Case Study 4: Latency & Message Loss Comparison Graph Generator
Generates:
1. Average Latency Bar Chart with Jitter (StdDev) error bars
2. Message Loss (%) Bar Chart
3. Latency Distribution Density / Box Plot across Access Technologies
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import sys
import os

def load_data():
    files = {
        'Wired Ethernet': 'ethernet_latency.csv',
        'Wi-Fi 5 GHz': 'wifi_5ghz_latency.csv',
        'Wi-Fi 2.4 GHz': 'wifi_24ghz_latency.csv',
        'Mobile Hotspot (4G)': 'hotspot_latency.csv'
    }
    
    datasets = {}
    for name, path in files.items():
        if os.path.exists(path):
            df = pd.read_csv(path)
            # Filter valid positive latency entries
            df = df[df['latency_ms'] >= 0]
            datasets[name] = df
            print(f"[LOADED] {name}: {len(df)} records from {path}")
        else:
            print(f"[NOTICE] {path} not found. (Run the benchmark step first)")
            
    return datasets

def plot_benchmarks(datasets):
    if not datasets:
        print("[ERROR] No CSV files found. Please ensure latency CSVs exist in current directory.")
        return

    networks = list(datasets.keys())
    avg_latencies = [datasets[n]['latency_ms'].mean() for n in networks]
    jitter_std = [datasets[n]['latency_ms'].std() for n in networks]
    
    # Calculate packet loss
    loss_percentages = []
    for n in networks:
        df = datasets[n]
        total_expected = 120 # Standard test duration
        total_received = len(df)
        loss = max(0.0, ((total_expected - total_received) / total_expected) * 100.0)
        loss_percentages.append(loss)

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    fig.suptitle('Case Study 4: Comparing Access-Network Technologies using MQTT', fontsize=15, fontweight='bold')

    # Chart 1: Average Latency with Error Bars (Jitter)
    colors = ['#10B981', '#06B6D4', '#F59E0B', '#EF4444']
    axes[0].bar(networks, avg_latencies, yerr=jitter_std, capsize=5, color=colors[:len(networks)], alpha=0.85, edgecolor='black')
    axes[0].set_ylabel('Latency (ms)', fontsize=12, fontweight='bold')
    axes[0].set_title('Average Network Latency & Jitter (StdDev)', fontsize=13)
    axes[0].grid(axis='y', linestyle='--', alpha=0.7)
    
    for i, v in enumerate(avg_latencies):
        axes[0].text(i, v + jitter_std[i] + 1.0, f"{v:.1f} ms", ha='center', fontweight='bold')

    # Chart 2: Message Loss Percentage
    axes[1].bar(networks, loss_percentages, color=['#10B981', '#06B6D4', '#F59E0B', '#EF4444'][:len(networks)], alpha=0.85, edgecolor='black')
    axes[1].set_ylabel('Packet Loss Rate (%)', fontsize=12, fontweight='bold')
    axes[1].set_title('Message Loss (%) across Access Technologies', fontsize=13)
    axes[1].set_ylim(0, max(5.0, max(loss_percentages) * 1.5 if loss_percentages else 5.0))
    axes[1].grid(axis='y', linestyle='--', alpha=0.7)

    for i, v in enumerate(loss_percentages):
        axes[1].text(i, v + 0.15, f"{v:.2f}%", ha='center', fontweight='bold')

    plt.tight_layout()
    output_png = "mqtt_access_network_comparison.png"
    plt.savefig(output_png, dpi=300)
    print(f"\n[SUCCESS] Generated comparison plot: {output_png}")
    plt.show()

if __name__ == "__main__":
    data = load_data()
    plot_benchmarks(data)
`
  }
};
