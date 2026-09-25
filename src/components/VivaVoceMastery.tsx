import React, { useState } from 'react';
import { VIVA_QUESTIONS } from '../data/caseStudyContent';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Award, 
  BookMarked, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const VivaVoceMastery: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [activeMode, setActiveMode] = useState<'study' | 'quiz'>('study');
  
  // Interactive Quiz State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const quizQuestions = [
    {
      q: "Which access technology guarantees the lowest latency variance (jitter), and what is the primary physical reason?",
      options: [
        "Wi-Fi 5 GHz, because it uses 80 MHz channel bonding",
        "Wired Ethernet, because full-duplex point-to-point links have zero airtime contention or CSMA/CA backoff",
        "Mobile 4G Hotspot, because cellular base stations assign dedicated TDMA slots to every device",
        "LoRaWAN, because sub-GHz RF penetrations avoid indoor reflections"
      ],
      correct: 1,
      explanation: "Wired Ethernet utilizes dedicated full-duplex copper twisted pairs. There are zero collisions, no RF fading, and no exponential backoff delays."
    },
    {
      q: "If 20 sensor nodes simultaneously publish MQTT telemetry over Wi-Fi instead of 1 node, what happens?",
      options: [
        "Latency drops because the access point enters high-throughput mode",
        "Ethernet latency increases by 1000% due to packet queues",
        "Wi-Fi latency and packet loss spike exponentially because CSMA/CA binary exponential backoff expands contention windows",
        "The Mosquitto broker crashes immediately due to lack of RAM"
      ],
      correct: 2,
      explanation: "Under 802.11 CSMA/CA, every device shares the same wireless channel. More transmitting nodes exponentially increases collision likelihood and backoff times."
    },
    {
      q: "Why wasn't LPWAN (e.g. LoRaWAN) directly tested in this MQTT benchmark?",
      options: [
        "LoRa operates exclusively on underwater acoustic channels",
        "Standard MQTT runs over TCP which requires heavy handshakes, while LoRa has strict duty-cycle limits (1%) and small payload constraints",
        "LoRaWAN only works when paired with 5G cellular antennas",
        "Mosquitto broker does not support sensors with sequence numbers"
      ],
      correct: 1,
      explanation: "LoRaWAN devices in Europe are legally limited to a 1% duty cycle (36s/hour) and ~51-222 byte payloads. TCP 3-way handshakes and 1 Hz publishing violate regulatory and link constraints."
    },
    {
      q: "What architectural role does the local MQTT broker play in a multi-tier edge network?",
      options: [
        "It acts strictly as an optical physical layer transceiver",
        "It replaces the cloud database permanently without any synchronization",
        "It serves as the local Edge Ingestion and Decoupling Bus, enabling local autonomous control and bridging to cloud",
        "It is merely a web browser proxy for HTTP REST requests"
      ],
      correct: 2,
      explanation: "The edge broker decouples publishers from subscribers, provides local QoS store-and-forward caching during internet outages, and bridges filtered telemetry to the cloud."
    }
  ];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent double select
    setSelectedOption(idx);
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Topic 4 · Oral Examination & Defense Preparation</span>
              <span aria-hidden="true">·</span>
              <span>Case Studies Manual Page 6</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Viva-Voce & Discussion Questions Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Thorough, academically rigorous answers for all 4 viva-voce questions from the lab manual.
              Master the physical layer, MAC protocol contention, LPWAN trade-offs, and multi-tier edge architecture.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveMode('study')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeMode === 'study'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Study Mode
            </button>
            <button
              onClick={() => setActiveMode('quiz')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeMode === 'quiz'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Study Mode: In-Depth Question Cards */}
      {activeMode === 'study' ? (
        <div className="space-y-4">
          {VIVA_QUESTIONS.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden transition-all"
              >
                {/* Question Accordion Header */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                      Q{item.id}
                    </span>
                    <div>
                      <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                        {item.category}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-white">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className="p-1 rounded bg-slate-800 text-slate-400 shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="p-5 pt-0 space-y-4 text-xs sm:text-sm border-t border-slate-800/80 mt-1">
                    {/* Quick Oral Viva Answer */}
                    <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-900/50 space-y-1">
                      <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                        Quick Oral Answer (Exam Ready):
                      </div>
                      <div className="text-slate-200 font-medium leading-relaxed">
                        "{item.shortAnswer}"
                      </div>
                    </div>

                    {/* In-Depth Technical Justification */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300">
                        In-Depth Architectural & Physical Layer Justification:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {item.inDepthExplanation.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-cyan-400 font-mono font-bold mt-0.5">›</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Architectural Takeaway */}
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong className="text-emerald-400">Core Edge Principle: </strong>
                        {item.keyTakeaway}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Quiz Mode: Interactive Self-Check */
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-6">
          {!quizFinished ? (
            <div className="space-y-5">
              {/* Question Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                <span>Question {quizIndex + 1} of {quizQuestions.length}</span>
                <span className="font-mono text-cyan-400">Score: {quizScore} / {quizQuestions.length}</span>
              </div>

              {/* Question Prompt */}
              <h3 className="text-base font-semibold text-white leading-relaxed">
                {quizQuestions[quizIndex].q}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {quizQuestions[quizIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === quizQuestions[quizIndex].correct;
                  const showFeedback = selectedOption !== null;

                  let optionStyle = 'border-slate-800 bg-slate-950/70 hover:bg-slate-800 text-slate-300';
                  if (showFeedback) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-950/30 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showFeedback}
                      className={`w-full p-3.5 rounded-lg border text-left text-xs transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded font-mono text-[11px] flex items-center justify-center bg-slate-800 text-slate-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Next Button */}
              {selectedOption !== null && (
                <div className="space-y-4 pt-2">
                  <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                    selectedOption === quizQuestions[quizIndex].correct
                      ? 'bg-emerald-950/30 border-emerald-900 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-900 text-rose-200'
                  }`}>
                    <strong>{selectedOption === quizQuestions[quizIndex].correct ? 'Correct! ' : 'Incorrect. '}</strong>
                    {quizQuestions[quizIndex].explanation}
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors ml-auto shadow-sm"
                  >
                    <span>{quizIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-4">
              <Award className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">
                Viva Practice Quiz Completed!
              </h3>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-cyan-400 font-mono text-lg">{quizScore} / {quizQuestions.length}</strong> ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {quizScore === quizQuestions.length 
                  ? 'Outstanding! You have complete mastery of the networking principles governing Case Study 4.'
                  : 'Good review! Review the Study Mode tabs to strengthen your edge networking arguments.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
