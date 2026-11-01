import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  ExternalLink,
  Printer
} from 'lucide-react';
import { CloudAccount, OptimizationOpportunity, AnomalyAlert } from '../types/finops';
import { generateExecutivePdf, PdfReportData } from '../utils/pdfExport';
import { soundManager } from '../utils/audio';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CloudAccount[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  openOpportunitiesSavings: number;
  openOpportunitiesCount: number;
  anomalies: AnomalyAlert[];
  opportunities: OptimizationOpportunity[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  accounts,
  totalMonthlySpend,
  totalMonthlySavings,
  openOpportunitiesSavings,
  openOpportunitiesCount,
  anomalies,
  opportunities
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    soundManager.playClick();

    setTimeout(() => {
      try {
        const reportData: PdfReportData = {
          accounts,
          totalMonthlySpend,
          totalMonthlySavings,
          openOpportunitiesSavings,
          openOpportunitiesCount,
          anomalies,
          opportunities,
          reportTitle: 'Maniq | Sweep Multi-Cloud Executive FinOps Report',
          preparedBy: 'Mani Ravindran (ravindran.in)'
        };

        generateExecutivePdf(reportData);
        soundManager.playRewardClaimed();
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } catch (err) {
        console.error('Failed to generate PDF:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081420]/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Navy Header Strip */}
        <div className="px-6 py-5 bg-[#081420] text-[#F3F5F1] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#5FD3BF]/15 border border-[#5FD3BF]/35 text-[#5FD3BF] shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="xh-kicker">Maniq | Sweep · Executive Reporting</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-[#9AB3C8] border border-white/15">
                  A4 PDF BRIEFING
                </span>
              </div>
              <h2
                className="text-xl font-bold text-[#F3F5F1] tracking-tight"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Download Executive FinOps Summary
              </h2>
              <p className="text-xs text-[#9AB3C8] leading-relaxed">
                Generate a board-ready executive PDF briefing summarizing multi-cloud spend across AWS, Azure, and Google Cloud, 6-month savings forecast, and verified carbon abatement.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9AB3C8] hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-[#16232F]">
          {/* Author & Provenance Badge */}
          <div className="flex items-center justify-between p-3 bg-[#F3F5F1] rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#566676] font-mono uppercase text-[11px]">Report Architect:</span>
              <span className="font-bold text-[#16232F]">Mani Ravindran</span>
            </div>
            <a
              href="https://ravindran.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#0D9488] hover:text-[#0F766E] font-mono font-semibold"
            >
              <span>ravindran.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Executive Summary Metrics Preview Box */}
          <div className="space-y-2">
            <div className="rm-kicker">Document Telemetry Snapshot</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <div className="text-[10px] font-mono uppercase text-[#566676]">Monthly Spend</div>
                <div className="text-sm font-bold font-mono text-[#16232F] mt-0.5">
                  ${totalMonthlySpend.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#6E8090]">{accounts.length} Clouds Connected</div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <div className="text-[10px] font-mono uppercase text-[#566676]">Realized Savings</div>
                <div className="text-sm font-bold font-mono text-[#0D9488] mt-0.5">
                  +${totalMonthlySavings.toLocaleString()}/mo
                </div>
                <div className="text-[10px] text-[#0D9488]">Verified Remediations</div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <div className="text-[10px] font-mono uppercase text-[#566676]">Sweep Pipeline</div>
                <div className="text-sm font-bold font-mono text-[#B7791F] mt-0.5">
                  ${openOpportunitiesSavings.toLocaleString()}/mo
                </div>
                <div className="text-[10px] text-[#6E8090]">{openOpportunitiesCount} Open Bounties</div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <div className="text-[10px] font-mono uppercase text-[#566676]">Carbon Abatement</div>
                <div className="text-sm font-bold font-mono text-[#0D9488] mt-0.5">
                  2,920 kg
                </div>
                <div className="text-[10px] text-[#0D9488]">+23.7% MoM Reduction</div>
              </div>
            </div>
          </div>

          {/* Report Sections Checklist */}
          <div className="p-4 bg-[#F3F5F1] rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-[#16232F]">Sections Included in Generated PDF:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#566676]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                <span>Multi-Cloud Accounts (AWS, Azure, GCP)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                <span>6-Month Projected vs. Actual Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                <span>Carbon Abatement (kg CO2e) by Cloud</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                <span>Top 5 Actionable Cost Remediations</span>
              </div>
            </div>
          </div>

          {/* Feedback message if downloaded */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Maniq | Sweep PDF Summary successfully generated and downloaded!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#16232F] bg-[#F3F5F1] hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print View</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#566676] hover:text-[#16232F] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="xh-btn primary cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
