import React, { useState } from 'react';
import { 
  FileCheck, DollarSign, Wallet, FileText, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, ShieldCheck,
  FolderOpen, AlertOctagon, X, CheckSquare, Square, Eye, Download,
  Globe, MapPin, Package
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import GlobalHeader from '../../components/GlobalHeader';

export const FinancierDashboard = () => {
  const {
    loggedInUser,
    role,
    switchRoleSafe,
    tradeMode,
    switchTradeModeSafe,
    transactions,
    setScreen,
    handleVerifyDocuments,
    handleDisburseFunds,
    handleCollectRepayment
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('verifications');
  const [subTab, setSubTab] = useState('domestic');
  const [verificationTxn, setVerificationTxn] = useState(null);
  const [verificationChecks, setVerificationChecks] = useState({
    invoiceValue: false, gstMatch: false, ewayBill: false, bankDetails: false
  });
  const [viewDoc, setViewDoc] = useState(null);

  // All NBFC-financed transactions
  const nbfcTxns = transactions.filter(t =>
    t.paymentMode === 'nbfc' || t.paymentMode === 'drip' || t.paymentMode === 'global_govt'
  );

  // Filter by domestic/global subtab
  const filteredTxns = nbfcTxns.filter(t => t.tradeMode === subTab);

  // Queue buckets
  const pendingVerifications = filteredTxns.filter(t =>
    ['Buyer Confirmed', 'Dispatched', 'Delivered', 'Invoice Raised', 'Pending Financier'].includes(t.status)
  );
  const pendingDisbursals = filteredTxns.filter(t => t.status === 'Pending Disbursal');
  const activeCollections = filteredTxns.filter(t => t.status === 'Disbursed');

  // KPI totals from filteredTxns (domestic by default)
  const totalDisbursed = filteredTxns.filter(t => t.status === 'Disbursed').reduce((s, t) => s + t.amount * 0.8, 0);
  const expectedCollections = filteredTxns.filter(t => t.status === 'Disbursed').reduce((s, t) => s + t.amount, 0);

  // Document vault — all transactions
  const vaultDocs = transactions.flatMap(t => {
    const docs = [
      { id: `INV-${t.id}`, txnId: t.id, type: 'Commercial Invoice', entity: t.supplier, date: t.dueDate || 'TBD', size: '1.2 MB' },
      { id: `EWB-${t.id}`, txnId: t.id, type: 'E-Way Bill', entity: t.supplier, date: t.dueDate || 'TBD', size: '0.8 MB' }
    ];
    if (t.tradeMode === 'global') {
      docs.push({ id: `BOL-${t.id}`, txnId: t.id, type: 'Bill of Lading', entity: t.buyer, date: t.dueDate || 'TBD', size: '2.5 MB' });
    }
    return docs;
  });

  const handleUnderwriteApprove = () => {
    handleVerifyDocuments(verificationTxn.id);
    setVerificationTxn(null);
    setVerificationChecks({ invoiceValue: false, gstMatch: false, ewayBill: false, bankDetails: false });
  };

  const isFullyChecked = Object.values(verificationChecks).every(Boolean);

  const currency = subTab === 'global' ? '$' : '₹';

  const renderItems = (t) => {
    if (!t.items || t.items.length === 0) return `${t.quantity || '—'} KG`;
    return t.items.map(i => `${i.variety} (${i.quantity}${i.unit})`).join(', ');
  };

  const StatusBadge = ({ status }) => {
    const map = {
      'Invoice Raised':    { bg: '#f0fdf4', color: '#166534', label: 'Invoice Raised' },
      'Buyer Confirmed':   { bg: '#eff6ff', color: '#1e40af', label: 'Buyer Confirmed' },
      'Dispatched':        { bg: '#eff6ff', color: '#1e40af', label: 'Dispatched' },
      'Delivered':         { bg: '#fefce8', color: '#854d0e', label: 'Delivered' },
      'Pending Disbursal': { bg: '#fdf4ff', color: '#7e22ce', label: 'Pending Disbursal' },
      'Disbursed':         { bg: '#f0fdf4', color: '#166534', label: 'Disbursed ✓' },
    };
    const s = map[status] || { bg: '#f4f4f5', color: '#71717a', label: status };
    return (
      <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ overflowY: 'auto' }}>
        <div>
          <div className="sidebar-logo">
            <img src="/assets/miledeep_logo.svg" alt="Miledeep" style={{ width: '120px' }} />
          </div>
          <nav className="sidebar-nav">
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', padding: '0 12px', marginTop: '12px', marginBottom: '8px', letterSpacing: '0.05em' }}>Operations</div>
            {[
              { id: 'verifications', icon: <FileCheck className="nav-icon" />, label: `Underwriting Queue (${pendingVerifications.length})` },
              { id: 'disbursals',    icon: <DollarSign className="nav-icon" />, label: `Pending Disbursals (${pendingDisbursals.length})` },
              { id: 'collections',  icon: <Wallet className="nav-icon" />,     label: `Active Collections (${activeCollections.length})` },
            ].map(item => (
              <a key={item.id} href="#" className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                {item.icon}{item.label}
              </a>
            ))}
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', padding: '0 12px', marginTop: '24px', marginBottom: '8px', letterSpacing: '0.05em' }}>Document Control</div>
            <a href="#" className={`nav-item ${activeTab === 'vault' ? 'active' : ''}`} onClick={() => setActiveTab('vault')}>
              <FolderOpen className="nav-icon" /> Document Vault
            </a>
            <a href="#" className={`nav-item ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
              <AlertOctagon className="nav-icon" /> Risk & Exposure
            </a>
          </nav>
        </div>
        <div style={{ borderTop: '1px solid var(--gold-shade-80)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gold-tint-10)' }}>{loggedInUser?.legalName || 'HDFC Bank (Admin)'}</div>
            <div style={{ fontSize: '10px', color: 'var(--gold-tint-40)', marginTop: '2px' }}>finance@miledeep.com</div>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', height: '30px', fontSize: '11px' }} onClick={() => setScreen('login')}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-wrapper">
        <GlobalHeader
          title="Financier Command Center"
          entityName={loggedInUser?.legalName || 'Admin'}
          role={role}
          switchRoleSafe={switchRoleSafe}
          tradeMode={tradeMode}
          setTradeMode={switchTradeModeSafe}
          profilePic={loggedInUser?.profilePic}
        />

        <main className="main-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* KPI Cards */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="metric-card">
                <span className="metric-label">Verifications Queue</span>
                <div className="metric-value">{pendingVerifications.length}</div>
                <span className="metric-sub">Pending underwriting ({subTab})</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Ready to Disburse</span>
                <div className="metric-value">{pendingDisbursals.length}</div>
                <span className="metric-sub">Verified, awaiting funds ({subTab})</span>
              </div>
              <div className="metric-card" style={{ border: '2px solid #000' }}>
                <span className="metric-label" style={{ color: 'var(--steampunk-gold)', fontWeight: '700' }}>Total Disbursed (80%)</span>
                <div className="metric-value" style={{ fontWeight: '800' }}>₹{(totalDisbursed / 100000).toFixed(2)} L</div>
                <span className="metric-sub">Capital deployed ({subTab})</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Expected Collections</span>
                <div className="metric-value">₹{(expectedCollections / 100000).toFixed(2)} L</div>
                <span className="metric-sub">At maturity ({subTab})</span>
              </div>
            </div>

            {/* Domestic / Global Tabs */}
            {['verifications', 'disbursals', 'collections'].includes(activeTab) && (
              <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--border)' }}>
                <button
                  className={`btn ${subTab === 'domestic' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
                  onClick={() => setSubTab('domestic')}
                >
                  <MapPin style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Domestic Trade
                </button>
                <button
                  className={`btn ${subTab === 'global' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
                  onClick={() => setSubTab('global')}
                >
                  <Globe style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Global Trade
                </button>
              </div>
            )}

            {/* ── Underwriting Queue ── */}
            {activeTab === 'verifications' && (
              <div className="panel-card" style={{ borderTopLeftRadius: 0 }}>
                <div className="panel-title">Underwriting Queue — {subTab === 'domestic' ? 'Domestic' : 'Global'} Trade</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>
                  Verify delivery and commercial documents before releasing funds.
                </p>
                {pendingVerifications.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>
                    <Package size={40} style={{ color: '#d4d4d8', marginBottom: '12px' }} />
                    <div>No transactions pending underwriting for <strong>{subTab}</strong> trade.</div>
                    <div style={{ fontSize: '12px', marginTop: '8px', color: '#a1a1aa' }}>
                      Transactions appear here after the supplier generates a Bill of Supply.
                    </div>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Supplier → Buyer</th>
                        <th>Items</th>
                        <th>Invoice Value</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingVerifications.map(t => (
                        <tr key={t.id}>
                          <td><strong>{t.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: '600', fontSize: '12px' }}>{t.supplier}</div>
                            <div style={{ fontSize: '11px', color: '#71717a' }}>→ {t.buyer}</div>
                          </td>
                          <td style={{ fontSize: '11px', color: '#52525b', maxWidth: '160px' }}>{renderItems(t)}</td>
                          <td><strong>{currency}{t.amount.toLocaleString('en-IN')}</strong></td>
                          <td><StatusBadge status={t.status} /></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => {
                                setVerificationTxn(t);
                                setVerificationChecks({ invoiceValue: false, gstMatch: false, ewayBill: false, bankDetails: false });
                              }}
                            >
                              <ShieldCheck style={{ width: '14px', height: '14px', marginRight: '4px' }} /> Underwrite
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Pending Disbursals ── */}
            {activeTab === 'disbursals' && (
              <div className="panel-card" style={{ borderTopLeftRadius: 0 }}>
                <div className="panel-title">Pending Disbursals — {subTab === 'domestic' ? 'Domestic' : 'Global'} Trade</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>Verified transactions ready for 80% capital release to supplier.</p>
                {pendingDisbursals.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>
                    <div>No transactions awaiting disbursal for <strong>{subTab}</strong> trade.</div>
                    <div style={{ fontSize: '12px', marginTop: '8px', color: '#a1a1aa' }}>Approve transactions in Underwriting Queue first.</div>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Supplier</th>
                        <th>Items</th>
                        <th>Invoice Value</th>
                        <th>80% Advance</th>
                        <th>Supplier Bank</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDisbursals.map(t => (
                        <tr key={t.id}>
                          <td><strong>{t.id}</strong></td>
                          <td>{t.supplier}</td>
                          <td style={{ fontSize: '11px', color: '#52525b' }}>{renderItems(t)}</td>
                          <td>{currency}{t.amount.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: '700', color: 'var(--steampunk-gold)' }}>
                            {currency}{(t.amount * 0.8).toLocaleString('en-IN')}
                          </td>
                          <td>
                            <div style={{ fontSize: '11px' }}>HDFC Bank</div>
                            <div style={{ fontSize: '10px', color: '#71717a' }}>IFSC: HDFC0000283</div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--steampunk-gold)', color: '#000' }}
                              onClick={() => handleDisburseFunds(t.id)}
                            >
                              <ArrowUpRight style={{ width: '14px', height: '14px' }} /> Release Funds
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Active Collections ── */}
            {activeTab === 'collections' && (
              <div className="panel-card" style={{ borderTopLeftRadius: 0 }}>
                <div className="panel-title">Active Collections — {subTab === 'domestic' ? 'Domestic' : 'Global'} Trade</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>Track and collect 100% maturity value from buyers at due date.</p>
                {activeCollections.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>No active collections for <strong>{subTab}</strong> trade.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Supplier → Buyer</th>
                        <th>Items</th>
                        <th>Due Date</th>
                        <th>Collection Amount</th>
                        <th>UTR Ref</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCollections.map(t => (
                        <tr key={t.id}>
                          <td><strong>{t.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: '600', fontSize: '12px' }}>{t.supplier}</div>
                            <div style={{ fontSize: '11px', color: '#71717a' }}>→ {t.buyer}</div>
                          </td>
                          <td style={{ fontSize: '11px', color: '#52525b' }}>{renderItems(t)}</td>
                          <td>{t.dueDate || 'TBD'}</td>
                          <td style={{ fontWeight: '700' }}>{currency}{t.amount.toLocaleString('en-IN')}</td>
                          <td style={{ fontSize: '11px', fontFamily: 'monospace', color: '#52525b' }}>{t.utrRef || '—'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '12px', color: '#16a34a', borderColor: '#16a34a' }}
                              onClick={() => handleCollectRepayment(t.id)}
                            >
                              <ArrowDownRight style={{ width: '14px', height: '14px' }} /> Mark Paid
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Document Vault ── */}
            {activeTab === 'vault' && (
              <div className="panel-card">
                <div className="panel-title">Document Vault</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>All trade documents generated across transactions.</p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Type</th>
                      <th>Transaction</th>
                      <th>Entity</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaultDocs.map((doc, idx) => (
                      <tr key={`${doc.id}-${idx}`}>
                        <td><strong>{doc.id}</strong></td>
                        <td>{doc.type}</td>
                        <td style={{ fontSize: '11px', color: '#52525b' }}>{doc.txnId}</td>
                        <td>{doc.entity}</td>
                        <td>{doc.date}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }} onClick={() => setViewDoc(doc)}>
                            <Eye style={{ width: '13px', height: '13px' }} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Risk & Exposure ── */}
            {activeTab === 'risk' && (
              <div className="panel-card">
                <div className="panel-title">Risk & Concentration Exposure</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>Monitor capital deployment across buyers to prevent overexposure.</p>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Live Buyer Exposure (from transactions)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(() => {
                    const buyerMap = {};
                    transactions.filter(t => t.status === 'Disbursed').forEach(t => {
                      buyerMap[t.buyer] = (buyerMap[t.buyer] || 0) + t.amount;
                    });
                    const maxVal = Math.max(...Object.values(buyerMap), 1);
                    return Object.entries(buyerMap).map(([buyer, val]) => (
                      <div key={buyer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                          <strong>{buyer}</strong>
                          <span>₹{(val / 100000).toFixed(2)} L</span>
                        </div>
                        <div style={{ height: '8px', background: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(val / maxVal) * 100}%`, background: (val / maxVal) > 0.7 ? '#ef4444' : 'var(--steampunk-gold)', borderRadius: '4px' }} />
                        </div>
                      </div>
                    ));
                  })()}
                  {transactions.filter(t => t.status === 'Disbursed').length === 0 && (
                    <div style={{ textAlign: 'center', color: '#71717a', padding: '20px' }}>No disbursed transactions yet.</div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Underwriting Modal */}
      {verificationTxn && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', padding: '40px', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '1100px', display: 'flex', margin: 0, padding: 0, overflow: 'hidden' }}>

            {/* Left: Invoice Preview */}
            <div style={{ flex: 2, background: '#18181b', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: '#fff', fontSize: '15px' }}>Invoice: {verificationTxn.id}</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: '#27272a', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>Commercial Invoice</span>
                  <span style={{ background: 'transparent', color: '#a1a1aa', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>E-Way Bill</span>
                </div>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '32px', overflowY: 'auto', fontSize: '13px' }}>
                <div style={{ borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>INVOICE</h1>
                    <div style={{ color: '#555', fontSize: '11px' }}>No. INV-{verificationTxn.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '14px' }}>{verificationTxn.supplier}</strong>
                    <div style={{ fontSize: '11px', color: '#555' }}>GSTIN: 37ABCDE1234F1Z5</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>Billed To</div>
                    <strong>{verificationTxn.buyer}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>Invoice Total</div>
                    <strong style={{ fontSize: '20px' }}>{currency}{verificationTxn.amount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f4f4f5' }}>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Item</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ccc' }}>Qty</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ccc' }}>Rate</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ccc' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(verificationTxn.items || []).map((item, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{item.variety} ({item.count})</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{item.quantity} {item.unit}</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{currency}{item.unitPrice?.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: '600' }}>{currency}{item.amount?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3" style={{ padding: '10px 8px', fontWeight: '700', textAlign: 'right' }}>Total</td>
                      <td style={{ padding: '10px 8px', fontWeight: '800', fontSize: '15px', textAlign: 'right' }}>{currency}{verificationTxn.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
                {verificationTxn.vehicleNo && (
                  <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '12px' }}>
                    <strong>Transport Details:</strong> Vehicle {verificationTxn.vehicleNo}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Checklist */}
            <div style={{ flex: 1, background: '#fff', padding: '32px', display: 'flex', flexDirection: 'column', minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Underwriting Checklist</h2>
                <X style={{ cursor: 'pointer', color: '#71717a' }} onClick={() => setVerificationTxn(null)} />
              </div>
              <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '24px' }}>
                Manually verify all documents against system records before approving funds release.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {[
                  { key: 'invoiceValue', title: 'Verify Invoice Value', desc: `Matches ${currency}${verificationTxn.amount.toLocaleString('en-IN')}` },
                  { key: 'gstMatch',    title: 'Verify GST / Tax ID',   desc: 'Supplier GSTIN: 37ABCDE1234F1Z5' },
                  { key: 'ewayBill',    title: 'Verify Transport Bill',  desc: verificationTxn.vehicleNo ? `Vehicle: ${verificationTxn.vehicleNo}` : 'E-Way Bill number matches' },
                  { key: 'bankDetails', title: 'Verify Bank Account',    desc: 'Supplier disbursal account verified' },
                ].map(({ key, title, desc }) => (
                  <label key={key} style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px' }} onClick={() => setVerificationChecks(prev => ({ ...prev, [key]: !prev[key] }))}>
                      {verificationChecks[key] ? <CheckSquare style={{ color: '#16a34a', width: '20px', height: '20px' }} /> : <Square style={{ color: '#a1a1aa', width: '20px', height: '20px' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{title}</div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                {!isFullyChecked && (
                  <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', textAlign: 'center' }}>
                    ⚠ Complete all 4 checks to approve
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '14px', opacity: isFullyChecked ? 1 : 0.4, cursor: isFullyChecked ? 'pointer' : 'not-allowed' }}
                  disabled={!isFullyChecked}
                  onClick={handleUnderwriteApprove}
                >
                  ✓ Approve & Move to Disbursal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '480px', margin: 0, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <X style={{ cursor: 'pointer', color: '#71717a' }} onClick={() => setViewDoc(null)} />
            </div>
            <FolderOpen style={{ width: '48px', height: '48px', color: 'var(--steampunk-gold)', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{viewDoc.type}</h2>
            <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '4px' }}>Document ID: {viewDoc.id}</div>
            <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '4px' }}>Transaction: {viewDoc.txnId}</div>
            <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '24px' }}>Entity: {viewDoc.entity}</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setViewDoc(null)}>
                <Eye style={{ width: '13px', height: '13px', marginRight: '6px' }} /> Preview
              </button>
              <button className="btn btn-primary" onClick={() => setViewDoc(null)}>
                <Download style={{ width: '13px', height: '13px', marginRight: '6px' }} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
