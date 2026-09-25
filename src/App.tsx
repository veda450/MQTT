import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepByStepGuide } from './components/StepByStepGuide';
import { LiveSimulator } from './components/LiveSimulator';
import { CodeWorkspace } from './components/CodeWorkspace';
import { BenchmarkComparison } from './components/BenchmarkComparison';
import { ApplicationMatrix } from './components/ApplicationMatrix';
import { VivaVoceMastery } from './components/VivaVoceMastery';
import { LabReportModal } from './components/LabReportModal';
import { DEFAULT_BENCHMARK_RESULTS } from './data/caseStudyContent';
import { BenchmarkResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('guide');
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>(DEFAULT_BENCHMARK_RESULTS);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Allow simulator to update or append results to benchmark comparisons
  const handleSaveSimulatedResult = (newResult: BenchmarkResult) => {
    setBenchmarkResults(prev => {
      const existingIdx = prev.findIndex(r => r.networkType === newResult.networkType);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newResult;
        return copy;
      }
      return [...prev, newResult];
    });
  };

  const handleResetBenchmarks = () => {
    setBenchmarkResults(DEFAULT_BENCHMARK_RESULTS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Bar adhering to the 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Main Container - 1440px baseline */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'guide' && (
          <StepByStepGuide
            onNavigateToCode={() => setActiveTab('code')}
            onNavigateToSim={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <LiveSimulator
            onSaveResult={handleSaveSimulatedResult}
          />
        )}

        {activeTab === 'code' && (
          <CodeWorkspace />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarkComparison
            results={benchmarkResults}
            onUpdateResults={setBenchmarkResults}
            onResetToDefault={handleResetBenchmarks}
          />
        )}

        {activeTab === 'scenarios' && (
          <ApplicationMatrix />
        )}

        {activeTab === 'viva' && (
          <VivaVoceMastery />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Edge Computing Case Study 4</span>
            <span aria-hidden="true">·</span>
            <span>Networking Architecture &amp; MQTT Access Technologies</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Mosquitto Broker v2.0</span>
            <span aria-hidden="true">·</span>
            <span>TCP Port 1883</span>
            <span aria-hidden="true">·</span>
            <span>Paho-MQTT 3.1.1</span>
          </div>
        </div>
      </footer>

      {/* Printable / Downloadable Lab Report Modal */}
      <LabReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        results={benchmarkResults}
      />
    </div>
  );
}
