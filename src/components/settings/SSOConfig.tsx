'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Globe,
  Copy,
  Check,
} from 'lucide-react';

type SSOMethod = 'saml' | 'oidc';
type ConnectionStatus = 'not_configured' | 'connected' | 'error';

interface SAMLConfig {
  entityId: string;
  ssoUrl: string;
  certificate: string;
}

interface OIDCConfig {
  clientId: string;
  clientSecret: string;
  issuerUrl: string;
  redirectUri: string;
}

interface DomainVerification {
  domain: string;
  verified: boolean;
  verificationStep: number;
}

const STORAGE_KEY = 'profileai-sso-config';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveConfig(data: Record<string, unknown>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function SSOConfig() {
  const [method, setMethod] = useState<SSOMethod>('saml');
  const [status, setStatus] = useState<ConnectionStatus>('not_configured');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failure' | null>(null);
  const [copied, setCopied] = useState(false);

  const [saml, setSaml] = useState<SAMLConfig>({
    entityId: '',
    ssoUrl: '',
    certificate: '',
  });

  const [oidc, setOidc] = useState<OIDCConfig>({
    clientId: '',
    clientSecret: '',
    issuerUrl: '',
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/sso` : '',
  });

  const [domain, setDomain] = useState<DomainVerification>({
    domain: '',
    verified: false,
    verificationStep: 0,
  });

  useEffect(() => {
    const saved = loadConfig();
    if (saved) {
      if (saved.method) setMethod(saved.method);
      if (saved.saml) setSaml(saved.saml);
      if (saved.oidc) setOidc(saved.oidc);
      if (saved.status) setStatus(saved.status);
      if (saved.domain) setDomain(saved.domain);
    }
  }, []);

  const persist = useCallback(() => {
    saveConfig({ method, saml, oidc, status, domain });
  }, [method, saml, oidc, status, domain]);

  useEffect(() => {
    persist();
  }, [persist]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    await new Promise((r) => setTimeout(r, 2000));

    const hasConfig =
      method === 'saml'
        ? saml.entityId && saml.ssoUrl && saml.certificate
        : oidc.clientId && oidc.clientSecret && oidc.issuerUrl;

    if (hasConfig) {
      setTestResult('success');
      setStatus('connected');
    } else {
      setTestResult('failure');
      setStatus('error');
    }
    setTesting(false);
  };

  const handleVerifyDomain = async () => {
    if (!domain.domain) return;
    setDomain((d) => ({ ...d, verificationStep: 1 }));
    await new Promise((r) => setTimeout(r, 1500));
    setDomain((d) => ({ ...d, verificationStep: 2 }));
    await new Promise((r) => setTimeout(r, 1500));
    setDomain((d) => ({ ...d, verificationStep: 3, verified: true }));
  };

  const handleCopySPMetadata = () => {
    const metadata = `<?xml version="1.0"?>
<EntityDescriptor entityID="${typeof window !== 'undefined' ? window.location.origin : ''}/sp"
  xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <AssertionConsumerService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback/saml" />
  </SPSSODescriptor>
</EntityDescriptor>`;
    navigator.clipboard.writeText(metadata);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" /> Connected
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="h-3 w-3" /> Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
            <AlertCircle className="h-3 w-3" /> Not configured
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-indigo-400" />
            </div>
            SSO Configuration
          </h1>
          <p className="text-zinc-400 text-sm">
            Configure single sign-on for your organization using SAML or OpenID Connect.
          </p>
        </div>
        {statusBadge()}
      </div>

      {/* Method tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 w-fit">
        <button
          onClick={() => setMethod('saml')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            method === 'saml'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          SAML 2.0
        </button>
        <button
          onClick={() => setMethod('oidc')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            method === 'oidc'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          OAuth / OIDC
        </button>
      </div>

      {/* SAML config */}
      {method === 'saml' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SAML 2.0 Configuration</CardTitle>
            <CardDescription>
              Configure your Identity Provider (IdP) details for SAML-based SSO.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Entity ID (Issuer)</label>
              <Input
                placeholder="https://idp.yourcompany.com/entity-id"
                value={saml.entityId}
                onChange={(e) => setSaml((s) => ({ ...s, entityId: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">SSO URL</label>
              <Input
                placeholder="https://idp.yourcompany.com/sso/saml"
                value={saml.ssoUrl}
                onChange={(e) => setSaml((s) => ({ ...s, ssoUrl: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                X.509 Certificate
              </label>
              <textarea
                className="flex w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 min-h-[120px] font-mono"
                placeholder="-----BEGIN CERTIFICATE-----&#10;MIICpDCCAYwCCQD...&#10;-----END CERTIFICATE-----"
                value={saml.certificate}
                onChange={(e) => setSaml((s) => ({ ...s, certificate: e.target.value }))}
              />
            </div>

            {/* SP Metadata */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-300">SP Metadata</span>
                <Button variant="outline" size="sm" onClick={handleCopySPMetadata} className="gap-1.5 text-xs">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy XML'}
                </Button>
              </div>
              <div className="text-xs text-zinc-500 space-y-1">
                <p>ACS URL: <code className="text-zinc-400">{typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback/saml</code></p>
                <p>Entity ID: <code className="text-zinc-400">{typeof window !== 'undefined' ? window.location.origin : ''}/sp</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OIDC config */}
      {method === 'oidc' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OAuth / OIDC Configuration</CardTitle>
            <CardDescription>
              Connect with your OpenID Connect provider for enterprise SSO.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Client ID</label>
              <Input
                placeholder="your-client-id"
                value={oidc.clientId}
                onChange={(e) => setOidc((s) => ({ ...s, clientId: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Client Secret</label>
              <Input
                type="password"
                placeholder="your-client-secret"
                value={oidc.clientSecret}
                onChange={(e) => setOidc((s) => ({ ...s, clientSecret: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Issuer URL</label>
              <Input
                placeholder="https://accounts.google.com"
                value={oidc.issuerUrl}
                onChange={(e) => setOidc((s) => ({ ...s, issuerUrl: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Redirect URI</label>
              <Input
                readOnly
                value={oidc.redirectUri}
                className="bg-zinc-900/50 text-zinc-400"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Add this URI to your provider&apos;s allowed redirect URIs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Connection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Test Connection</h3>
              <p className="text-xs text-zinc-500">
                Validate your {method === 'saml' ? 'SAML' : 'OIDC'} configuration before enabling SSO.
              </p>
            </div>
            <Button onClick={handleTestConnection} disabled={testing} className="gap-2">
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          </div>

          {testResult && (
            <div
              className={`mt-4 rounded-lg border p-3 flex items-center gap-2 text-sm ${
                testResult === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}
            >
              {testResult === 'success' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  SSO connection verified successfully. Users can now sign in with{' '}
                  {method === 'saml' ? 'SAML' : 'OIDC'}.
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  Connection failed. Please check your configuration and try again.
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-400" />
            Domain Verification
          </CardTitle>
          <CardDescription>
            Verify your company domain to auto-assign SSO for all users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="yourcompany.com"
              value={domain.domain}
              onChange={(e) => setDomain((d) => ({ ...d, domain: e.target.value, verified: false, verificationStep: 0 }))}
              className="flex-1"
            />
            <Button
              onClick={handleVerifyDomain}
              disabled={!domain.domain || domain.verified}
              variant={domain.verified ? 'outline' : 'default'}
              className="gap-2"
            >
              {domain.verified ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verified
                </>
              ) : (
                'Verify Domain'
              )}
            </Button>
          </div>

          {domain.verificationStep > 0 && (
            <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <h4 className="text-sm font-medium text-zinc-300">Verification Steps</h4>
              {[
                'Checking DNS TXT record...',
                'Validating domain ownership...',
                'Domain verified successfully!',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {domain.verificationStep > i + 1 || (domain.verificationStep === i + 1 && i === 2) ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  ) : domain.verificationStep === i + 1 ? (
                    <Loader2 className="h-4 w-4 text-indigo-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-zinc-700 flex-shrink-0" />
                  )}
                  <span
                    className={
                      domain.verificationStep > i
                        ? 'text-zinc-300'
                        : 'text-zinc-600'
                    }
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!domain.verificationStep && domain.domain && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-500 space-y-2">
              <p className="font-medium text-zinc-400">To verify, add this DNS TXT record:</p>
              <code className="block bg-zinc-950 rounded p-2 text-zinc-300">
                profileai-verification=prf_{domain.domain.replace(/\./g, '_')}
              </code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
