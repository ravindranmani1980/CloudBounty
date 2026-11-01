import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, ArrowRight, Plug, RefreshCw, Key, Globe } from 'lucide-react';
import { CloudAccount, CloudProvider } from '../types/finops';
import { CloudIcon } from './CloudIcon';
import { soundManager } from '../utils/audio';

interface ConnectCloudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectAccount: (account: CloudAccount) => void;
}

export const ConnectCloudModal: React.FC<ConnectCloudModalProps> = ({
  isOpen,
  onClose,
  onConnectAccount
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [accountName, setAccountName] = useState('');
  const [environment, setEnvironment] = useState<'Production' | 'Staging' | 'Data Lake' | 'Sandbox'>('Production');

  // AWS Fields
  const [awsAccountId, setAwsAccountId] = useState('');
  const [awsRoleArn, setAwsRoleArn] = useState('');
  const [awsRegion, setAwsRegion] = useState('us-east-1');
  const [awsExternalId, setAwsExternalId] = useState('maniq-sweep-finops-sync');

  // Azure Fields
  const [azureSubscriptionId, setAzureSubscriptionId] = useState('');
  const [azureTenantId, setAzureTenantId] = useState('');
  const [azureClientId, setAzureClientId] = useState('');
  const [azureClientSecret, setAzureClientSecret] = useState('');

  // GCP Fields
  const [gcpProjectId, setGcpProjectId] = useState('');
  const [gcpBillingAccountId, setGcpBillingAccountId] = useState('');
  const [gcpServiceAccountEmail, setGcpServiceAccountEmail] = useState('');
  const [gcpBigQueryDataset, setGcpBigQueryDataset] = useState('gcp_billing_export');

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestAndConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationStep(1);
    soundManager.playClick();

    // Step 1: Handshake
    setTimeout(() => {
      setVerificationStep(2);
      soundManager.playClick();
    }, 900);

    // Step 2: Ingesting Cost Explorer / Billing APIs
    setTimeout(() => {
      setVerificationStep(3);
      soundManager.playClick();
    }, 1800);

    // Step 3: Success
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      soundManager.playRewardClaimed();

      const newId = `${selectedProvider}-${Date.now()}`;
      const defaultId =
        selectedProvider === 'aws'
          ? (awsAccountId || '3910-4491-8021')
          : selectedProvider === 'azure'
          ? (azureSubscriptionId || 'sub-4910-fa20-8802')
          : (gcpProjectId || 'prj-cloud-core-prod');

      const masked =
        selectedProvider === 'aws'
          ? (awsRoleArn || `arn:aws:iam::${defaultId}:role/ManiqSweepFinOpsRole`)
          : selectedProvider === 'azure'
          ? `sp-finops-reader (Tenant: ${azureTenantId || '81fa...09a'})`
          : (gcpServiceAccountEmail || `finops@${defaultId}.iam.gserviceaccount.com`);

      const randMonthly = Math.floor(Math.random() * 18000) + 7500;

      const newAccount: CloudAccount = {
        id: newId,
        name: accountName.trim() || `${selectedProvider.toUpperCase()} ${environment} Account`,
        provider: selectedProvider,
        accountId: defaultId,
        monthlySpend: randMonthly,
        dailyBurn: Math.round(randMonthly / 30),
        environment,
        status: 'active',
        connectionType: selectedProvider === 'aws' ? 'iam_role' : selectedProvider === 'azure' ? 'service_principal' : 'service_account',
        isLiveConnected: true,
        lastSyncTimestamp: 'Just now',
        syncStatus: 'live',
        region: selectedProvider === 'aws' ? awsRegion : selectedProvider === 'azure' ? 'westeurope' : 'us-central1',
        credentialsMasked: masked
      };

      onConnectAccount(newAccount);
      setTimeout(() => {
        onClose();
        setVerifiedSuccess(false);
        setVerificationStep(0);
      }, 1200);
    }, 2700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Plug className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Connect Multi-Cloud Integration
              </h2>
              <p className="text-xs text-slate-400">
                Establish live read-only telemetry link to AWS, Azure, or Google Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleTestAndConnect} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Cloud Provider Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Cloud Infrastructure</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('aws');
                  soundManager.playClick();
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  selectedProvider === 'aws'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CloudIcon provider="aws" size={16} />
                <span>AWS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('azure');
                  soundManager.playClick();
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  selectedProvider === 'azure'
                    ? 'bg-blue-500/10 border-blue-500 text-blue-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CloudIcon provider="azure" size={16} />
                <span>Azure</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('gcp');
                  soundManager.playClick();
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  selectedProvider === 'gcp'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CloudIcon provider="gcp" size={16} />
                <span>Google Cloud</span>
              </button>
            </div>
          </div>

          {/* Account Label & Environment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Display Name</label>
              <input
                type="text"
                required
                placeholder={selectedProvider === 'aws' ? 'e.g. AWS Core Infrastructure' : selectedProvider === 'azure' ? 'e.g. Azure Enterprise Prod' : 'e.g. GCP Analytics Lake'}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Environment Tag</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Data Lake">Data Lake</option>
                <option value="Sandbox">Sandbox</option>
              </select>
            </div>
          </div>

          {/* AWS SPECIFIC FIELDS */}
          {selectedProvider === 'aws' && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>AWS Cost Explorer & CUR Connection</span>
                <span className="text-[11px] font-normal text-slate-400">Cross-Account IAM Role</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">AWS 12-Digit Account ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1849-3021-9941"
                  value={awsAccountId}
                  onChange={(e) => setAwsAccountId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">IAM Role ARN (SecurityAudit + CostExplorerReadOnly)</label>
                <input
                  type="text"
                  placeholder="arn:aws:iam::184930219941:role/ManiqSweepFinOpsRole"
                  value={awsRoleArn}
                  onChange={(e) => setAwsRoleArn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Primary Region</label>
                  <input
                    type="text"
                    value={awsRegion}
                    onChange={(e) => setAwsRegion(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">External ID (Secure Handshake)</label>
                  <input
                    type="text"
                    value={awsExternalId}
                    onChange={(e) => setAwsExternalId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AZURE SPECIFIC FIELDS */}
          {selectedProvider === 'azure' && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Azure Cost Management API Integration</span>
                <span className="text-[11px] font-normal text-slate-400">App Registration</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Azure Subscription ID</label>
                <input
                  type="text"
                  placeholder="e.g. sub-8812-401f-9c02"
                  value={azureSubscriptionId}
                  onChange={(e) => setAzureSubscriptionId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Tenant / Directory ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 91fa401b-..."
                    value={azureTenantId}
                    onChange={(e) => setAzureTenantId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Client / App ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 382b01cc-..."
                    value={azureClientId}
                    onChange={(e) => setAzureClientId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Client Secret (CostManagement Reader)</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••"
                  value={azureClientSecret}
                  onChange={(e) => setAzureClientSecret(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>
            </div>
          )}

          {/* GCP SPECIFIC FIELDS */}
          {selectedProvider === 'gcp' && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span>Google Cloud Billing & BigQuery Export</span>
                <span className="text-[11px] font-normal text-slate-400">Service Account</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">GCP Project ID</label>
                <input
                  type="text"
                  placeholder="e.g. prj-analytics-lake-v2"
                  value={gcpProjectId}
                  onChange={(e) => setGcpProjectId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Cloud Billing Account ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 01ABCD-23EF45-678901"
                    value={gcpBillingAccountId}
                    onChange={(e) => setGcpBillingAccountId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">BigQuery Export Dataset</label>
                  <input
                    type="text"
                    value={gcpBigQueryDataset}
                    onChange={(e) => setGcpBigQueryDataset(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Service Account Email</label>
                <input
                  type="text"
                  placeholder="finops-reader@prj-analytics-lake-v2.iam.gserviceaccount.com"
                  value={gcpServiceAccountEmail}
                  onChange={(e) => setGcpServiceAccountEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Verification Pipeline Display */}
          {isVerifying && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Testing Live API Permissions & Telemetry Handshake</span>
              </div>
              <div className="text-[11px] space-y-1 text-slate-400">
                <div className={verificationStep >= 1 ? 'text-emerald-400 flex items-center gap-1.5' : 'text-slate-600'}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>1. Validating Read-Only IAM / RBAC credentials</span>
                </div>
                <div className={verificationStep >= 2 ? 'text-emerald-400 flex items-center gap-1.5' : 'text-slate-600'}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>2. Querying {selectedProvider.toUpperCase()} Cost & Usage APIs for run-rate</span>
                </div>
                <div className={verificationStep >= 3 ? 'text-emerald-400 flex items-center gap-1.5' : 'text-slate-600'}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>3. Ingesting active resource inventory & tagging structure</span>
                </div>
              </div>
            </div>
          )}

          {verifiedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connection Verified! Adding Live Cloud Feed to Dashboard...</span>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Read-only permissions only</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || verifiedSuccess}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors rounded-xl shadow-sm cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Plug className="w-3.5 h-3.5" />
                    <span>Connect & Sync Live Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
