import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle2, 
  Building, 
  Briefcase, 
  Landmark, 
  Truck, 
  Lock, 
  Phone,
  ArrowLeft,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Send,
  Folder,
  Shield,
  Download,
  Activity,

  Calculator,
  X,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Bell,
  Printer,
  Banknote,
  ClipboardList,
  Clock,
  User,
  BarChart,
  Settings,
  PartyPopper,
  CheckCircle,
  Users,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { LoginScreen, KycScreen } from './screens/AuthScreens';
import GlobalHeader from './components/GlobalHeader';
import { DocumentGeneratorModal } from './components/DocumentGeneratorModal';
import { FinancierDashboard } from './screens/FinancierDashboard/FinancierDashboard';
import { CeoDashboard } from './screens/CeoDashboard/CeoDashboard';
import { SupplierSidebar, BuyerSidebar } from './components/Sidebars';
import { useAppContext } from './context/AppContext';
import { NewDispatchTab } from './screens/SupplierDashboard/NewDispatchTab';
import { TransactionsLedgerTab } from './screens/SupplierDashboard/TransactionsLedgerTab';
import { IncomingRequestsTab } from './screens/SupplierDashboard/IncomingRequestsTab';
import { BuyerApprovalsTab } from './screens/BuyerDashboard/BuyerApprovalsTab';
import { CreateRequestTab } from './screens/BuyerDashboard/CreateRequestTab';
import './App.css';

function App() {
  const {
    role, setRole,
    screen, setScreen,
    tradeMode, setTradeMode,
    isGistLoading, gistError,
    isSignUp, setIsSignUp,
    phone, setPhone,
    otp, setOtp,
    kycStep, setKycStep,
    domesticKycCompleted, setDomesticKycCompleted,
    globalKycCompleted, setGlobalKycCompleted,
    supplierForm, setSupplierForm,
    buyerForm, setBuyerForm,
    uploads, setUploads,
    assessmentState, setAssessmentState,
    approvedLimit, setApprovedLimit,
    showChallanPreview, setShowChallanPreview,
    withdrawTxn, setWithdrawTxn,
    withdrawalLoading, setWithdrawalLoading,
    disbursalReceipt, setDisbursalReceipt,
    showNotifications, setShowNotifications,
    unreadCount, setUnreadCount,
    toast, setToast,
    activeFilter, setActiveFilter,
    currentPage, setCurrentPage,
    docType, setDocType,
    buyerActiveTab, setBuyerActiveTab,
    reqSubTab, setReqSubTab,
    settingsTab, setSettingsTab,
    selectedVerifyTxn, setSelectedVerifyTxn,
    selectedPO, setSelectedPO,
    triggerToast,
    loggedInUser,
    activeTab, setActiveTab,
    transactions, setTransactions,
    selectedTxn, setSelectedTxn,
    searchQuery, setSearchQuery,
    newTxnForm, setNewTxnForm,
    newTxnDocs, setNewTxnDocs,
    handleUploadClick,
    handleNextKycStep,
    handleCreateTxn,
    handleOtpVerify,
    handleSignUp,
    downloadFastagCSV,
    downloadPayoutAdviceCSV,
    bypassAuthForDemo,
    switchRoleSafe,
    switchTradeModeSafe,
    companyUsers,
    setCompanyUsers,
    docGeneratorConfig, setDocGeneratorConfig} = useAppContext();

  // --------------------------------------------------------------------------
  // Outer Screens Renders
  // --------------------------------------------------------------------------
  if (isGistLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e4e4e7', borderTopColor: 'var(--steampunk-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', fontWeight: '600', color: 'var(--steampunk-gold)' }}>Connecting to Cloud Database...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen 
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        tradeMode={tradeMode}
        setTradeMode={setTradeMode}
        phone={phone}
        setPhone={setPhone}
        otp={otp}
        setOtp={setOtp}
        handleOtpVerify={handleOtpVerify}
        handleSignUp={handleSignUp}
        setScreen={setScreen}
        bypassAuthForDemo={bypassAuthForDemo}
      />
    );
  }



  if (screen === 'kyc') {
    return (
      <KycScreen 
        tradeMode={tradeMode}
        kycStep={kycStep}
        setKycStep={setKycStep}
        handleNextKycStep={handleNextKycStep}
        form={supplierForm}
        setForm={setSupplierForm}
        uploads={uploads}
        handleUploadClick={handleUploadClick}
        setUploads={setUploads}
      />
    );
  }

  if (screen === 'completed') {
    return (
      <div className="onboarding-container">
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <CheckCircle2 style={{ width: '56px', height: '56px', color: 'var(--steampunk-gold)', margin: '0 auto 20px auto' }} />
          <h3 className="heading" style={{ color: 'var(--steampunk-gold)', marginBottom: '8px' }}>Registration Completed</h3>
          <p className="subheading" style={{ maxWidth: '380px', margin: '0 auto 24px auto' }}>
            Your KYC details for **{tradeMode.toUpperCase()}** trade have been uploaded successfully.
          </p>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setScreen('dashboard')}>
            <span>Enter Portal Dashboard</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Main Dashboard View (React Redesign - Locked Sticky App Layout)
  // --------------------------------------------------------------------------
  if (screen === 'dashboard') {
    // Filter transactions based on logged-in user
    const myTransactions = transactions.filter(t => 
      (role === 'supplier' && (t.supplierPhone || 'supplier1') === loggedInUser?.phone) || 
      (role === 'buyer' && (t.buyerPhone || 'buyer1') === loggedInUser?.phone)
    );

    // Supplier Limits Calculations
    const utilized = myTransactions.filter(t => t.status === 'Disbursed' || t.status === 'Closed')
                                 .reduce((acc, curr) => acc + curr.amount * 0.8, 0);
    const available = Math.max(0, approvedLimit - utilized);

    // Apply Filter & Search logic
    const displayedTxns = myTransactions.filter(t => {
      const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (t.items && t.items.length > 0 && (t.items[0].variety || '').toLowerCase().includes(searchQuery.toLowerCase()));
      if (activeFilter === 'All') return matchesSearch;
      if (activeFilter === 'Dispatched') return matchesSearch && t.status === 'Dispatched';
      if (activeFilter === 'Invoiced') return matchesSearch && (t.status === 'Invoice Raised' || t.status === 'Pending Financier' || t.status === 'Pending Disbursal');
      if (activeFilter === 'Disbursed') return matchesSearch && t.status === 'Disbursed';
      if (activeFilter === 'Closed') return matchesSearch && t.status === 'Closed';
      return matchesSearch;
    });

    // ------------------------------------------------------------------------
    // RENDER: Supplier Dashboard Flow
    // ------------------------------------------------------------------------
    if (role === 'supplier') {
      return (
        <div className="dashboard-layout">
          
          {/* Left Fixed Sidebar */}
          <SupplierSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setActiveFilter={setActiveFilter} 
            supplierForm={supplierForm} 
            setScreen={setScreen} 
          />

          {/* Right Content Section Wrapper */}
          <div className="main-wrapper">
            {/* Top Sticky Header */}
            <GlobalHeader 
              title={
                activeTab === 'newTrans' ? 'New Dispatch Transaction'
                  : activeTab === 'transactions' ? 'My Transactions Ledger'
                  : activeTab === 'requests' ? 'Discount Requests'
                  : activeTab === 'notifications' ? 'Notifications'
                  : activeTab === 'settings' ? 'Settings'
                  : activeTab === 'documents' ? 'Documents'
                  : 'Dashboard'
              }
              entityName={loggedInUser?.legalName || loggedInUser?.corporateName || "Demo Company"}
              role={role}
              switchRoleSafe={switchRoleSafe}
              tradeMode={tradeMode}
              setTradeMode={switchTradeModeSafe}
              profilePic={loggedInUser?.profilePic}
            />

            {/* Internal Scrollable Content Workspace */}
            <main className="main-content">
              
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Business-Focused KPI Metrics Grid */}
                  {(() => {
                    const totalRevenue = myTransactions.reduce((acc, t) => acc + t.amount, 0);
                    const activeLoads = myTransactions.filter(t => t.status === 'Dispatched' || t.status === 'Buyer Confirmed').length;
                    const pendingCollections = myTransactions
                      .filter(t => t.status === 'Disbursed' || t.status === 'Buyer Confirmed')
                      .reduce((acc, t) => acc + t.amount, 0);
                    const avgInvoice = myTransactions.length > 0 ? totalRevenue / myTransactions.length : 0;
                    return (
                      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div className="metric-card" style={{ border: '2px solid #000000' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="metric-label" style={{ fontWeight: '700', color: 'var(--steampunk-gold)' }}>
                              {tradeMode === 'global' ? 'Total Export Volume' : 'Total Trade Revenue'}
                            </span>
                            <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--steampunk-gold)' }} />
                          </div>
                          <div className="metric-value" style={{ fontWeight: '800' }}>
                            {tradeMode === 'global' ? '$' : '₹'}{(totalRevenue / 100000).toFixed(1)} {tradeMode === 'global' ? 'K' : 'L'}
                          </div>
                          <div className="metric-sub">
                            {tradeMode === 'global' ? 'Cumulative overseas shipments' : 'Cumulative invoice value dispatched'}
                          </div>
                        </div>

                        <div className="metric-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="metric-label">
                              {tradeMode === 'global' ? 'Active Export Shipments' : 'Active Loads'}
                            </span>
                            <Truck style={{ width: '16px', height: '16px', color: '#71717a' }} />
                          </div>
                          <div className="metric-value">{activeLoads}</div>
                          <div className="metric-sub">
                            {tradeMode === 'global' ? 'In-transit to overseas buyers' : 'In-transit or pending PO confirmation'}
                          </div>
                        </div>

                        <div className="metric-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="metric-label">
                              {tradeMode === 'global' ? 'Financed Advances (80%)' : 'Pending Collections'}
                            </span>
                            <Landmark style={{ width: '16px', height: '16px', color: '#71717a' }} />
                          </div>
                          <div className="metric-value">
                            {tradeMode === 'global' ? '$' : '₹'}
                            {tradeMode === 'global' ? ((totalRevenue * 0.8) / 100000).toFixed(1) : (pendingCollections / 100000).toFixed(1)} {tradeMode === 'global' ? 'K' : 'L'}
                          </div>
                          <div className="metric-sub">
                            {tradeMode === 'global' ? 'Upfront capital disbursed' : 'Amounts outstanding from buyers'}
                          </div>
                        </div>

                        <div className="metric-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="metric-label">
                              {tradeMode === 'global' ? 'Balance Payables (20%)' : 'Avg. Invoice Value'}
                            </span>
                            <Calculator style={{ width: '16px', height: '16px', color: '#71717a' }} />
                          </div>
                          <div className="metric-value">
                            {tradeMode === 'global' ? '$' : '₹'}
                            {tradeMode === 'global' ? ((totalRevenue * 0.2) / 100000).toFixed(1) : (avgInvoice / 100000).toFixed(1)} {tradeMode === 'global' ? 'K' : 'L'}
                          </div>
                          <div className="metric-sub">
                            {tradeMode === 'global' ? 'Pending release from buyers' : 'Per transaction average deal size'}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="panel-card">
                    {/* Ledger Header & Quick Filters */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Active Aqua Transactions Ledger</div>
                      <div style={{ display: 'flex', gap: '4px', border: '1px solid #e4e4e7', borderRadius: '4px', padding: '2px', background: 'var(--background)' }}>
                        {['All', 'Dispatched', 'Invoiced', 'Disbursed'].map(f => (
                          <button 
                            key={f} 
                            onClick={() => setActiveFilter(f)} 
                            style={{
                              border: 'none',
                              background: activeFilter === f ? 'var(--foreground)' : 'none',
                              color: activeFilter === f ? '#ffffff' : '#71717a',
                              fontSize: '10px',
                              fontWeight: '600',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Buyer / Processor</th>
                            <th>Variety</th>
                            <th>Quantity</th>
                            <th>Total Value</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedTxns.slice((currentPage - 1) * 3, currentPage * 3).map(t => (
                            <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                              <td><strong>{t.id}</strong></td>
                              <td>{t.buyer}</td>
                              <td>{t.items?.[0]?.variety || ''} ({t.items?.[0]?.count || ''})</td>
                              <td>{(t.items?.[0]?.quantity || 0).toLocaleString('en-IN')} {t.items?.[0]?.unit || ''}</td>
                              <td>
                                <strong>₹{t.amount.toLocaleString('en-IN')}</strong>
                                <br />
                                <span style={{ fontSize: '10px', color: t.repaymentStatus === 'Settled by Buyer' ? '#166534' : '#71717a', fontWeight: '600' }}>
                                  {t.repaymentStatus === 'Settled by Buyer' ? <><CheckCircle size={14} style={{display:"inline", marginBottom:"-2px"}} /> Settled by Buyer</> : <><Clock size={14} style={{display:"inline", marginBottom:"-2px"}} /> Awaiting Repayment</>}
                                </span>
                              </td>
                              <td>{t.dueDate}</td>
                              <td>
                                <span style={{
                                  display: 'inline-flex',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  background: t.status === 'Dispatched' ? '#eff6ff' : (t.status === 'Buyer Confirmed' ? '#fcf6e4' : '#f0fdf4'),
                                  color: t.status === 'Dispatched' ? '#1e40af' : (t.status === 'Buyer Confirmed' ? '#854d0e' : '#166534')
                                }}>
                                  {t.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px' }} onClick={() => setSelectedTxn(t)}>
                                    Details
                                  </button>
                                  {t.status === 'Buyer Confirmed' && (
                                    <button className="btn btn-primary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: 'var(--foreground)', color: '#ffffff' }} onClick={() => setWithdrawTxn(t)}>
                                      Bill Discount
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '11px', color: '#71717a' }}>
                      <div>
                        Showing {displayedTxns.length > 0 ? (currentPage - 1) * 3 + 1 : 0} to {Math.min(currentPage * 3, displayedTxns.length)} of {displayedTxns.length} entries
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ height: '24px', padding: '0 6px', fontSize: '10px' }}
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                          Prev
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ height: '24px', padding: '0 6px', fontSize: '10px' }}
                          disabled={currentPage * 3 >= displayedTxns.length}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* New Transaction Tab */}
              {activeTab === 'incoming_requests' && <IncomingRequestsTab />}
              {activeTab === 'newTrans' && <NewDispatchTab />}

              {/* My Transactions Tab */}
              {activeTab === 'transactions' && <TransactionsLedgerTab displayedTxns={displayedTxns} />}

              {/* Discount Requests Tab */}
              {activeTab === 'requests' && (() => {
                const pendingNbfc = myTransactions.filter(t => t.paymentMode === 'nbfc' && t.status === 'Buyer Confirmed');
                const submitted = myTransactions.filter(t => t.paymentMode === 'nbfc' && (t.status === 'Disbursed' || t.status === 'Closed'));
                const direct = myTransactions.filter(t => t.paymentMode === 'direct');
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Sub-tab bar */}
                    <div style={{ display: 'flex', gap: '0', border: '1px solid #e4e4e7', borderRadius: '6px', overflow: 'hidden', background: 'var(--background)', width: 'fit-content' }}>
                      {[['pending', <div style={{display:'flex', alignItems:'center', gap:'4px'}}><Clock size={14}/> Pending Approval</div>], ['submitted', <div style={{display:'flex', alignItems:'center', gap:'4px'}}><CheckCircle size={14}/> Submitted to Bank</div>], ['disbursed', <div style={{display:'flex', alignItems:'center', gap:'4px'}}><Banknote size={14}/> Disbursed</div>], ['direct', <div style={{display:'flex', alignItems:'center', gap:'4px'}}><Briefcase size={14}/> Direct Credit</div>], ['history', <div style={{display:'flex', alignItems:'center', gap:'4px'}}><ClipboardList size={14}/> Full History</div>]].map(([key, label]) => (
                        <button key={key} onClick={() => setReqSubTab(key)} style={{
                          padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                          background: reqSubTab === key ? 'var(--steampunk-gold)' : 'transparent',
                          color: reqSubTab === key ? '#ffffff' : '#71717a',
                          borderRight: '1px solid #e4e4e7'
                        }}>{label}</button>
                      ))}
                    </div>

                    {/* ── Pending Approval ── */}
                    {reqSubTab === 'pending' && (
                      <div className="panel-card">
                        <div className="panel-title">Pending Bank Approval — {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Bill Discounting</div>
                        <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '12px' }}>These loads have been buyer-confirmed (PO issued). Awaiting your Bill Discount request submission to bank.</p>
                        {pendingNbfc.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '24px', color: '#71717a', fontSize: '12px' }}>No pending requests. All {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} loads are submitted or in transit.</div>
                        ) : pendingNbfc.map(t => (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '12px', marginBottom: '10px', background: '#ffffff' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '12px' }}>{t.id} <span style={{ fontWeight: '400', color: '#71717a' }}>· {t.items?.[0]?.variety || ''}</span></div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Buyer: {t.buyer} · Due: {t.dueDate}</div>
                              <div style={{ fontSize: '11px', marginTop: '4px' }}>Invoice: <strong>₹{t.amount.toLocaleString('en-IN')}</strong> · Bank: <strong>{t.financierBank}</strong></div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>₹{(t.amount * 0.78).toLocaleString('en-IN')}</div>
                              <div style={{ fontSize: '10px', color: '#71717a' }}>Eligible (80% - 2% fee)</div>
                              <button className="btn btn-primary" style={{ marginTop: '8px', height: '28px', fontSize: '10px', padding: '0 12px' }} onClick={() => setWithdrawTxn(t)}>Bill Discount →</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Submitted to Bank ── */}
                    {reqSubTab === 'submitted' && (
                      <div className="panel-card">
                        <div className="panel-title">Submitted to Bank — Awaiting Disbursal</div>
                        <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '12px' }}>These discount requests have been sent to the bank for processing.</p>
                        {submitted.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '24px', color: '#71717a', fontSize: '12px' }}>No requests submitted yet.</div>
                        ) : submitted.map(t => (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '12px', marginBottom: '10px', background: '#f0fdf4' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '12px' }}>{t.id} <span style={{ fontWeight: '400', color: '#71717a' }}>· {t.items?.[0]?.variety || ''}</span></div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Buyer: {t.buyer} · Bank: {t.financierBank}</div>
                              {t.utrRef && <div style={{ fontSize: '10px', fontFamily: 'monospace', marginTop: '4px', color: '#166534' }}>UTR: {t.utrRef}</div>}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', background: '#dcfce7', padding: '3px 10px', borderRadius: '99px' }}><CheckCircle size={12} style={{display:"inline", marginBottom:"-2px"}} /> {t.status}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Disbursed ── */}
                    {reqSubTab === 'disbursed' && (
                      <div className="panel-card">
                        <div className="panel-title">Disbursed — Cash Released to Your Account</div>
                        <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '12px' }}>Loads where cash advance has been credited. Holdback (20%) released on buyer repayment.</p>
                        {myTransactions.filter(t => t.status === 'Disbursed').length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '24px', color: '#71717a', fontSize: '12px' }}>No disbursed loads yet.</div>
                        ) : myTransactions.filter(t => t.status === 'Disbursed').map(t => (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '12px', marginBottom: '10px', background: '#ffffff' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '12px' }}>{t.id} · {t.items?.[0]?.variety || ''}</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Cash Credited: <strong style={{ color: '#166534' }}>₹{(t.amount * 0.78).toLocaleString('en-IN')}</strong></div>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>Holdback Pending: ₹{(t.amount * 0.2).toLocaleString('en-IN')} · Due: {t.dueDate}</div>
                              {t.utrRef && <div style={{ fontSize: '10px', fontFamily: 'monospace', marginTop: '4px', color: '#166534' }}>UTR: {t.utrRef}</div>}
                            </div>
                            <button className="btn btn-secondary" style={{ height: '28px', fontSize: '10px', padding: '0 12px' }} onClick={() => downloadPayoutAdviceCSV(t)}>Download Advice</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Direct Credit ── */}
                    {reqSubTab === 'direct' && (
                      <div className="panel-card">
                        <div className="panel-title">Direct Trade Credit — Awaiting Buyer Payment</div>
                        <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '12px' }}>These loads use direct credit terms. No bank is involved. You wait for the buyer to pay at maturity.</p>
                        {myTransactions.filter(t => t.paymentMode === 'direct').length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '24px', color: '#71717a', fontSize: '12px' }}>No direct credit transactions.</div>
                        ) : myTransactions.filter(t => t.paymentMode === 'direct').map(t => (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '12px', marginBottom: '10px', background: '#fefce8' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '12px' }}>{t.id} · {t.items?.[0]?.variety || ''}</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Buyer owes: <strong>₹{t.amount.toLocaleString('en-IN')}</strong> · Due: {t.dueDate}</div>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>Status: {t.status}</div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#92400e', background: '#fef3c7', padding: '3px 10px', borderRadius: '99px' }}><Clock size={12} style={{display:"inline", marginBottom:"-2px"}} /> Due {t.dueDate}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Full History ── */}
                    {reqSubTab === 'history' && (
                      <div className="panel-card">
                        <div className="panel-title">Full Discount Request History</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                          <thead>
                            <tr style={{ background: '#f4f4f5' }}>
                              {['Txn ID', 'Variety', 'Invoice (₹)', 'Payment Mode', 'Bank', 'UTR Ref', 'Status', 'Due'].map(h => (
                                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', borderBottom: '1px solid #e4e4e7' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {myTransactions.map(t => (
                              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedTxn(t)} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                                <td style={{ padding: '8px 10px', fontWeight: '600' }}>{t.id}</td>
                                <td style={{ padding: '8px 10px', color: '#71717a' }}>{t.items?.[0]?.variety || ''}</td>
                                <td style={{ padding: '8px 10px', fontWeight: '700' }}>₹{(t.amount/100000).toFixed(1)}L</td>
                                <td style={{ padding: '8px 10px' }}><span style={{ background: t.paymentMode === 'nbfc' || t.paymentMode === 'drip' ? '#eff6ff' : t.paymentMode === 'global_govt' ? '#f0fdf4' : '#fef3c7', color: t.paymentMode === 'nbfc' || t.paymentMode === 'drip' ? '#1e40af' : t.paymentMode === 'global_govt' ? '#166534' : '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>{t.paymentMode === 'nbfc' ? 'NBFC' : t.paymentMode === 'drip' ? 'Drip Capital' : t.paymentMode === 'global_govt' ? 'Govt Bank' : 'Direct'}</span></td>
                                <td style={{ padding: '8px 10px', color: '#71717a' }}>{t.financierBank || '—'}</td>
                                <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: '10px', color: '#166534' }}>{t.utrRef || '—'}</td>
                                <td style={{ padding: '8px 10px' }}><span style={{ background: t.status === 'Disbursed' || t.status === 'Closed' ? '#f0fdf4' : '#f4f4f5', color: t.status === 'Disbursed' || t.status === 'Closed' ? '#166534' : '#71717a', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>{t.status}</span></td>
                                <td style={{ padding: '8px 10px', color: '#71717a' }}>{t.dueDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="panel-card">
                  <div className="panel-title">Attached Cargo Documents & FASTag Slips</div>
                  <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="doc-card" style={{ background: '#ffffff', cursor: 'default' }}>
                      <FileCheck style={{ width: '22px', height: '22px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>Active GSTIN.pdf</div>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>Verified Onboarding</span>
                    </div>
                    <div className="doc-card" style={{ background: '#ffffff', cursor: 'default' }}>
                      <FileCheck style={{ width: '22px', height: '22px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>Active PAN.pdf</div>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>Verified Onboarding</span>
                    </div>
                    <div className="doc-card" style={{ background: '#ffffff', cursor: 'default' }}>
                      <FileCheck style={{ width: '22px', height: '22px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>FASTag toll slip (Active)</div>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>Transit logs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Dedicated Page */}
              {activeTab === 'notifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#71717a' }}>All activity alerts for your account</div>
                    <button className="btn btn-secondary" style={{ height: '28px', fontSize: '10px', padding: '0 12px' }} onClick={() => setUnreadCount(0)}>Mark all read</button>
                  </div>
                  {[
                    { id: 1, icon: <Banknote size={20} />, type: 'Disbursal', title: 'Cash Transfer Successful', body: 'TXN-2024-087 · ₹18,28,700 credited to SBI ****2039 via NEFT. UTR: HDFC20260812149302', time: '2 mins ago', unread: true },
                    { id: 2, icon: <CheckCircle size={20} />, type: 'PO Confirmed', title: 'Buyer Issued Purchase Order', body: 'Suryamitra Exim Pvt. Ltd. confirmed receipt for TXN-2024-087 (2,450 KG Vannamei Shrimp)', time: '1 hr ago', unread: true },
                    { id: 3, icon: <Truck size={20} />, type: 'Dispatch', title: 'Load Dispatched', body: 'TXN-2024-082 dispatched. Vehicle AP-21-BH-9203 en route. FASTag active.', time: '3 hrs ago', unread: true },
                    { id: 4, icon: <img src={tradeMode === 'global' ? '/assets/drip_capital_logo.jpg' : '/assets/hdfc_bank_logo.png'} style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="Bank"/>, type: 'Bank Update', title: 'HDFC Bank Limit Activated', body: `Your ${tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Bill Discounting facility of ₹50L is live for Vannamei Shrimp & Mackerel trades.`, time: 'Yesterday', unread: false },
                    { id: 5, icon: <ClipboardList size={20} />, type: 'KYC', title: 'Supplier Profile Approved', body: 'Your PAN, GSTIN and Bank Account have been verified by the underwriting team.', time: '2 days ago', unread: false },
                    { id: 6, icon: <AlertTriangle size={20} />, type: 'Reminder', title: 'Payment Due in 7 Days', body: 'TXN-2024-082 — Buyer repayment of ₹9,80,000 due on 08/09/2026.', time: '2 days ago', unread: false },
                    { id: 7, icon: <PartyPopper size={20} />, type: 'Milestone', title: 'First Successful Trade Closed', body: 'TXN-2024-075 closed successfully. Buyer settled ₹6,25,000 to bank on time.', time: '5 days ago', unread: false },
                  ].map(n => (
                    <div key={n.id} style={{
                      display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '14px 16px', borderRadius: '8px',
                      border: `1.5px solid ${n.unread ? 'var(--steampunk-gold)' : '#e4e4e7'}`,
                      background: n.unread ? 'var(--background)' : '#ffffff'
                    }}>
                      <div style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: '700' }}>{n.title}</div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>{n.time}</div>
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', marginTop: '1px' }}>{n.type}</div>
                        <div style={{ fontSize: '11px', color: '#52525b', marginTop: '4px', lineHeight: '1.5' }}>{n.body}</div>
                      </div>
                      {n.unread && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--steampunk-gold)', flexShrink: 0, marginTop: '4px' }}></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Settings Tab — Advanced */}
              {activeTab === 'settings' && (() => {
                return (
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Settings left nav */}
                    <div style={{ width: '180px', flexShrink: 0 }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', paddingLeft: '4px' }}>Settings</div>
                      {[
                        ['profile', <div style={{display:'flex', alignItems:'center', gap:'8px'}}><User size={14}/> Profile</div>],
                        ['users', <div style={{display:'flex', alignItems:'center', gap:'8px'}}><Users size={14}/> User Management</div>],
                        ['bank', <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src={tradeMode === 'global' ? '/assets/drip_capital_logo.jpg' : '/assets/hdfc_bank_logo.png'} style={{ height: '14px', objectFit: 'contain' }} alt="Bank"/> Settlement Account</div>],
                        ['notifications_pref', <div style={{display:'flex', alignItems:'center', gap:'8px'}}><Bell size={14}/> Notifications</div>],
                        ['discounting', <div style={{display:'flex', alignItems:'center', gap:'8px'}}><BarChart size={14}/> Discounting Prefs</div>],
                        ['security', <div style={{display:'flex', alignItems:'center', gap:'8px'}}><Lock size={14}/> Security</div>],
                        ['advanced', <div style={{display:'flex', alignItems:'center', gap:'8px'}}><Settings size={14}/> Advanced</div>],
                      ].map(([key, label]) => (
                        <div key={key} onClick={() => setSettingsTab(key)} style={{
                          padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                          marginBottom: '2px',
                          background: settingsTab === key ? 'var(--steampunk-gold)' : 'transparent',
                          color: settingsTab === key ? '#ffffff' : '#52525b'
                        }}>{label}</div>
                      ))}
                    </div>

                    {/* Settings content */}
                    <div style={{ flex: 1 }}>

                      {/* Profile */}
                      {settingsTab === 'profile' && (
                        <div className="panel-card">
                          <div className="panel-title">Business Profile</div>
                          <form onSubmit={(e) => { e.preventDefault(); triggerToast('Profile saved.'); }}>
                            <div className="form-grid">
                              <div className="form-group"><label>Legal Business Name</label><input type="text" className="form-input" value={supplierForm.legalName} onChange={(e) => setSupplierForm({...supplierForm, legalName: e.target.value})} /></div>
                              <div className="form-group"><label>Proprietor / Director Name</label><input type="text" className="form-input" value={supplierForm.proprietor} onChange={(e) => setSupplierForm({...supplierForm, proprietor: e.target.value})} /></div>
                              <div className="form-group"><label>GSTIN</label><input type="text" className="form-input" value={supplierForm.gstin} onChange={(e) => setSupplierForm({...supplierForm, gstin: e.target.value})} /></div>
                              <div className="form-group"><label>PAN</label><input type="text" className="form-input" value={supplierForm.pan} onChange={(e) => setSupplierForm({...supplierForm, pan: e.target.value})} /></div>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Registered Address</label><input type="text" className="form-input" defaultValue="Survey No. 48, Bhimavaram Mandal, West Godavari Dist., A.P. - 534239" /></div>
                              <div className="form-group"><label>Contact Email</label><input type="email" className="form-input" defaultValue="contact@abcaqua.in" /></div>
                              <div className="form-group"><label>Mobile Number</label><input type="tel" className="form-input" defaultValue="+91 98765 43210" /></div>
                            </div>
                            
                            <button type="submit" className="btn btn-primary">Save Profile</button>
                          </form>
                        </div>
                      )}

                      {/* Bank Account */}
                      {settingsTab === 'bank' && (
                        <div className="panel-card">
                          <div className="panel-title">Settlement Bank Account</div>
                          <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '14px' }}>Cash advances from Bill Discounting are credited to this account via NEFT/RTGS.</p>
                          <form onSubmit={(e) => { e.preventDefault(); triggerToast('Bank details saved.'); }}>
                            <div className="form-grid">
                              <div className="form-group"><label>Bank Name</label><input type="text" className="form-input" value={supplierForm.bankName} onChange={(e) => setSupplierForm({...supplierForm, bankName: e.target.value})} /></div>
                              <div className="form-group"><label>Account Number</label><input type="text" className="form-input" value={supplierForm.accountNo} onChange={(e) => setSupplierForm({...supplierForm, accountNo: e.target.value})} /></div>
                              <div className="form-group"><label>IFSC Code</label><input type="text" className="form-input" value={supplierForm.ifsc} onChange={(e) => setSupplierForm({...supplierForm, ifsc: e.target.value})} /></div>
                              <div className="form-group"><label>Account Type</label><select className="form-input" defaultValue="current"><option value="current">Current Account</option><option value="savings">Savings Account</option></select></div>
                            </div>
                            <div style={{ marginTop: '12px', padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '11px', color: '#166534' }}>
                              <CheckCircle size={12} style={{display:"inline", marginBottom:"-2px"}} /> Bank account verified and linked to your {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} discounting facility.
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '14px' }}>Update Bank Details</button>
                          </form>
                        </div>
                      )}

                      {/* Notification Prefs */}
                      {settingsTab === 'notifications_pref' && (
                        <div className="panel-card">
                          <div className="panel-title">Notification Preferences</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                              ['SMS Alerts for Cash Transfers', true],
                              ['Email on PO Confirmation from Buyer', true],
                              ['WhatsApp Dispatch Reminders', false],
                              ['Email on Bank Approval / Rejection', true],
                              ['Weekly Portfolio Summary', false],
                              ['Payment Due Date Reminders (3 days prior)', true],
                            ].map(([label, defaultOn]) => (
                              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                                <span style={{ fontSize: '12px' }}>{label}</span>
                                <div style={{ width: '36px', height: '20px', background: defaultOn ? 'var(--steampunk-gold)' : '#d1d5db', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                  <div style={{ position: 'absolute', top: '3px', left: defaultOn ? '19px' : '3px', width: '14px', height: '14px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Discounting Prefs */}
                      {settingsTab === 'discounting' && (
                        <div className="panel-card">
                          <div className="panel-title">Discounting Preferences</div>
                          <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '14px' }}>Set your default trade finance preferences for each product category.</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                              { variety: 'Vannamei Shrimp', bank: 'HDFC Bank', rate: '2%', limit: '₹30L' },
                              { variety: 'Black Tiger Prawn', bank: 'Axis Bank', rate: '2.5%', limit: '₹20L' },
                              { variety: 'Scampi / Lobster', bank: 'Axis Bank', rate: '2.5%', limit: '₹10L' },
                              { variety: 'Mackerel / Sardine', bank: 'HDFC Bank', rate: '3%', limit: '₹5L' },
                            ].map(row => (
                              <div key={row.variety} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px', background: 'var(--background)' }}>
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: '700' }}>{row.variety}</div>
                                  <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Financier: {row.bank} · Fee: {row.rate} · Sub-limit: {row.limit}</div>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: '700', background: 'var(--steampunk-gold)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: '14px', padding: '10px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '6px', fontSize: '11px', color: '#92400e' }}>
                            ⚠️ Bank-product mapping is configured by your {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} underwriter. Contact support to modify sub-limits.
                          </div>
                        </div>
                      )}

                      {/* Security */}
                      {settingsTab === 'security' && (
                        <div className="panel-card">
                          <div className="panel-title">Security & Access</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700' }}>Two-Factor Authentication (OTP)</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>OTP sent to +91 98765 43210 on every login.</div>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#166534' }}><CheckCircle size={12} style={{display:"inline", marginBottom:"-2px"}} /> Enabled</span>
                            </div>
                            <div style={{ padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700' }}>Active Sessions</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>MacBook Pro · Chrome · Bhimavaram, AP · Active now</div>
                              <button className="btn btn-secondary" style={{ marginTop: '8px', height: '26px', fontSize: '10px', padding: '0 12px' }}>Revoke Other Sessions</button>
                            </div>
                            <div style={{ padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700' }}>API Access Keys</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Generate keys for ERP or tally integrations.</div>
                              <button className="btn btn-secondary" style={{ marginTop: '8px', height: '26px', fontSize: '10px', padding: '0 12px' }}>Generate API Key</button>
                            </div>
                          </div>
                        </div>
                      )}

                      
                      {/* Users Management */}
                      {settingsTab === 'users' && (
                        <div className="panel-card">
                          <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>User & Role Management</span>
                            <button className="btn btn-primary" style={{ height: '30px', fontSize: '11px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => triggerToast('Open Add User Modal')}>
                              <Plus size={14} /> Add User
                            </button>
                          </div>
                          
                          <div style={{ marginBottom: '24px', padding: '16px', background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Role Hierarchy</div>
                            <div style={{ fontSize: '11px', color: '#71717a', lineHeight: '1.6' }}>
                              <strong>Admin:</strong> Full access to company settings, users, and all transactions.<br/>
                              <strong>Domain Admin (Seller/Buyer/Finance):</strong> Manage and approve transactions within their specific domain.<br/>
                              <strong>Domain User:</strong> Read-only or restricted access to operational tasks.
                            </div>
                          </div>

                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: '#f4f4f5', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e4e4e7' }}>Name</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e4e4e7' }}>Role</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e4e4e7' }}>Domain</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e4e4e7', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {companyUsers.map(u => (
                                <tr key={u.id}>
                                  <td style={{ padding: '12px', borderBottom: '1px solid #e4e4e7' }}>
                                    <div style={{ fontWeight: '600' }}>{u.name}</div>
                                    <div style={{ fontSize: '10px', color: '#71717a' }}>{u.email}</div>
                                  </td>
                                  <td style={{ padding: '12px', borderBottom: '1px solid #e4e4e7' }}>
                                    <span style={{ 
                                      background: u.role === 'Admin' ? '#fefce8' : '#eff6ff', 
                                      color: u.role === 'Admin' ? '#92400e' : '#1e40af', 
                                      padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700' 
                                    }}>
                                      {u.role}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px', borderBottom: '1px solid #e4e4e7' }}>{u.domain}</td>
                                  <td style={{ padding: '12px', borderBottom: '1px solid #e4e4e7', textAlign: 'right' }}>
                                    <button className="btn btn-secondary" style={{ padding: '4px', border: 'none', background: 'transparent' }} onClick={() => triggerToast('Edit User')}><Edit size={14} color="#71717a" /></button>
                                    <button className="btn btn-secondary" style={{ padding: '4px', border: 'none', background: 'transparent' }} onClick={() => {
                                      setCompanyUsers(companyUsers.filter(user => user.id !== u.id));
                                      triggerToast('User removed.');
                                    }}><Trash2 size={14} color="#dc2626" /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Advanced */}
                      {settingsTab === 'advanced' && (
                        <div className="panel-card">
                          <div className="panel-title">Advanced Options</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700' }}>Default Credit Period</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px', marginBottom: '8px' }}>Set default credit period for new transactions.</div>
                              <select className="form-input" style={{ width: '180px' }}><option>30 Days</option><option>60 Days</option><option>90 Days</option></select>
                            </div>
                            <div style={{ padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700' }}>Auto-Submit Bill Discount Requests</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Automatically submit bill discount to bank when buyer confirms PO (no manual click needed).</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                <div style={{ width: '36px', height: '20px', background: '#d1d5db', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}><div style={{ position: 'absolute', top: '3px', left: '3px', width: '14px', height: '14px', background: '#fff', borderRadius: '50%' }}></div></div>
                                <span style={{ fontSize: '11px', color: '#71717a' }}>Off (Manual submission)</span>
                              </div>
                            </div>
                            <div style={{ padding: '12px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700' }}>Vehicle / FASTag Auto-Tracking</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Link VAHAN API to auto-populate FASTag data on dispatch.</div>
                              <button className="btn btn-secondary" style={{ marginTop: '8px', height: '26px', fontSize: '10px', padding: '0 12px' }}>Connect VAHAN API</button>
                            </div>
                            <div style={{ padding: '12px', border: '1.5px solid #ef4444', borderRadius: '6px', background: '#fef2f2' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626' }}>Danger Zone</div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Permanently close your supplier account. All data will be archived.</div>
                              <button className="btn btn-secondary" style={{ marginTop: '8px', height: '26px', fontSize: '10px', padding: '0 12px', border: '1px solid #dc2626', color: '#dc2626' }}>Close Account</button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}
            </main>
          </div>

          {/* Modal Overlays */}
          {selectedTxn && (
            <div className="modal-overlay active">
              <div className="modal-content" style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Transaction Ledger Details - {selectedTxn.id}</h3>
                  <span className="close-btn" onClick={() => setSelectedTxn(null)}><X style={{ width: '18px', height: '18px' }} /></span>
                </div>
                <div className="modal-body" style={{ maxHeight: '520px', overflowY: 'auto' }}>

                  {/* ── Status Badge ── */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      display: 'inline-flex', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700',
                      background: selectedTxn.status === 'Closed' ? '#f0fdf4' : selectedTxn.status === 'Disbursed' ? '#eff6ff' : selectedTxn.status === 'Buyer Confirmed' ? '#fefce8' : '#f4f4f5',
                      color: selectedTxn.status === 'Closed' ? '#166534' : selectedTxn.status === 'Disbursed' ? '#1e40af' : selectedTxn.status === 'Buyer Confirmed' ? '#92400e' : '#71717a'
                    }}>{selectedTxn.status}</span>
                    <span style={{ fontSize: '10px', color: '#71717a' }}>Created: {new Date().toLocaleDateString('en-IN')}</span>
                  </div>

                  {/* ── Logistics Transit Tracker ── */}
                  <div style={{ marginBottom: '20px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '16px' }}>
                    <h5 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck style={{ width: '14px', height: '14px' }} />
                      <span>Logistics Transit Tracker</span>
                    </h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '20px' }}>
                      <div style={{ position: 'absolute', top: '8px', left: '20px', right: '20px', height: '1px', background: '#e4e4e7', zIndex: 1 }}></div>
                      {['Dispatched', 'Toll Plaza', 'In Transit', 'Arrived', 'Verified'].map((step, idx) => {
                        const statusOrder = { 'Dispatched': 1, 'Buyer Confirmed': 3, 'Disbursed': 4, 'Closed': 5 };
                        const currentLevel = statusOrder[selectedTxn.status] || 1;
                        const isActive = idx < currentLevel;
                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: isActive ? 'var(--steampunk-gold)' : '#e4e4e7', border: '2px solid #ffffff' }}></div>
                            <span style={{ fontSize: '8px', marginTop: '4px', fontWeight: '600', color: isActive ? 'var(--steampunk-gold)' : '#71717a' }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── From → To Address ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', marginBottom: '20px', padding: '14px', border: '1px solid #e4e4e7', borderRadius: '6px', background: '#ffffff' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>From (Supplier)</div>
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>{supplierForm.legalName}</div>
                      <div style={{ fontSize: '10px', color: '#71717a', marginTop: '2px', lineHeight: '1.5' }}>
                        D.No: 19-16-109/1, Katari Compound,<br/>
                        Y Junction, Bhimavaram,<br/>
                        West Godavari Dist, A.P. - 534201
                      </div>
                      <div style={{ fontSize: '10px', color: '#71717a', marginTop: '3px' }}>GSTIN: {supplierForm.gstin}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', color: '#71717a' }}>→</div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>To (Buyer / Plant)</div>
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>{selectedTxn.buyer}</div>
                      <div style={{ fontSize: '10px', color: '#71717a', marginTop: '2px', lineHeight: '1.5' }}>
                        Plot No. 23, Sector 7, APIIC,<br/>
                        Kakinada SEZ, East Godavari,<br/>
                        A.P. - 533005
                      </div>
                      <div style={{ fontSize: '10px', color: '#71717a', marginTop: '3px' }}>GSTIN: 37BCDEG5678H1Z9</div>
                    </div>
                  </div>

                  {/* ── Order Items ── */}
                  <div style={{ marginBottom: '20px', border: '1px solid #e4e4e7', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', background: '#fafafa', borderBottom: '1px solid #e4e4e7', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#71717a' }}>
                      Order Items
                    </div>
                    <div style={{ padding: '14px', background: '#fff', fontSize: '12px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ color: '#71717a', borderBottom: '1px solid #e4e4e7' }}>
                            <th style={{ paddingBottom: '8px', fontWeight: '600' }}>Variety (Size)</th>
                            <th style={{ paddingBottom: '8px', fontWeight: '600' }}>Qty</th>
                            <th style={{ paddingBottom: '8px', fontWeight: '600' }}>Rate</th>
                            <th style={{ paddingBottom: '8px', fontWeight: '600', textAlign: 'right' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedTxn.items || [{ variety: selectedTxn.variety, count: selectedTxn.count, quantity: selectedTxn.quantity, unit: selectedTxn.unit, unitPrice: selectedTxn.amount / (selectedTxn.quantity || 1), amount: selectedTxn.amount }]).map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f4f4f5' }}>
                              <td style={{ padding: '8px 0', fontWeight: '600' }}>{item.variety} ({item.count || '-'})</td>
                              <td style={{ padding: '8px 0' }}>{item.quantity?.toLocaleString('en-IN')} {item.unit}</td>
                              <td style={{ padding: '8px 0' }}>{selectedTxn.tradeMode === 'global' ? '$' : '₹'}{item.unitPrice?.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '600' }}>{selectedTxn.tradeMode === 'global' ? '$' : '₹'}{item.amount?.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── Trade Details Grid ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '12px' }}>
                    <div style={{ padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Due Date</div>
                      <strong>{selectedTxn.dueDate}</strong>
                    </div>
                    <div style={{ padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Payment Mode</div>
                      <strong style={{ color: selectedTxn.paymentMode === 'nbfc' || selectedTxn.paymentMode === 'drip' ? '#1e40af' : selectedTxn.paymentMode === 'global_govt' ? '#166534' : '#92400e' }}>
                        {selectedTxn.paymentMode === 'nbfc' ? 'NBFC Bill Discounting' : selectedTxn.paymentMode === 'drip' ? 'Drip Capital Factoring' : selectedTxn.paymentMode === 'global_govt' ? 'Govt Bank (LC)' : 'Direct Trade Credit'}
                      </strong>
                    </div>
                    <div style={{ padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Credit Period</div>
                      <strong>{selectedTxn.creditPeriod || 30} Days</strong>
                    </div>
                    <div style={{ padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Financier Bank</div>
                      <strong>{selectedTxn.financierBank || '—'}</strong>
                    </div>
                  </div>

                  {/* ── Vehicle & Transport ── */}
                  {selectedTxn.vehicleNo && (
                    <div style={{ marginBottom: '20px', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '14px', background: '#fafafa' }}>
                      <h5 style={{ fontSize: '11px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a' }}>Vehicle & Transport Details</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                        <div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>Vehicle Type</div>
                          <strong>{selectedTxn.vehicleType ? selectedTxn.vehicleType.replace(/^./, c => c.toUpperCase()) : 'Refrigerated Truck (Reefer)'}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>Vehicle Number</div>
                          <strong style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{selectedTxn.vehicleNo}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>FASTag ID</div>
                          <strong style={{ fontFamily: 'monospace', fontSize: '11px' }}>{selectedTxn.fastagId || 'FASTAG-340928103'}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>Est. Delivery Time</div>
                          <strong>{selectedTxn.deliveryTime ? `${selectedTxn.deliveryTime} Hours` : '6 Hours'}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>Driver Contact</div>
                          <strong>+91 94407 23198</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>Temperature Set</div>
                          <strong>-18°C (Frozen)</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Dispatch Cost Breakdown ── */}
                  {selectedTxn.vehicleNo && (
                    <div style={{ marginBottom: '20px', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '14px' }}>
                      <h5 style={{ fontSize: '11px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a' }}>Dispatch Costs</h5>
                      {(() => {
                        const qty = selectedTxn.quantity || 2450;
                        const iceCost = qty * 3;
                        const logistics = 12000;
                        const fastag = 1450;
                        const labour = Math.ceil(qty / 500) * 800;
                        const packaging = qty * 5;
                        const total = iceCost + logistics + fastag + labour + packaging;
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px' }}>
                            {[
                              ['Ice / Cold Storage', iceCost],
                              ['Logistics (Reefer Truck)', logistics],
                            ['FASTag Toll Charges', fastag],
                            ['Loading Labour', labour],
                            ['Packaging / Thermocol', packaging],
                          ].map(([label, val]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px dashed #f1f5f9' }}>
                              <span style={{ color: '#71717a' }}>{label}</span>
                              <span>₹{val.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', paddingTop: '4px' }}>
                            <span>Total Dispatch Cost</span>
                            <span style={{ color: '#dc2626' }}>₹{total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })()}
                    </div>
                  )}

                  {/* ── Financing Breakdown ── */}
                  <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '16px' }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: '700' }}>Financing Breakdown</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#71717a' }}>Invoice Value</span>
                      <strong>₹{selectedTxn.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    {selectedTxn.paymentMode === 'nbfc' || selectedTxn.paymentMode === 'drip' ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <span style={{ color: '#71717a' }}>Eligible Advance (80%)</span>
                          <strong>₹{(selectedTxn.amount * 0.8).toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <span style={{ color: '#dc2626' }}>Bank Discount Fee (2%)</span>
                          <span style={{ color: '#dc2626' }}>-₹{(selectedTxn.amount * 0.02).toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px dashed #e4e4e7', paddingTop: '8px', marginTop: '6px' }}>
                          <span style={{ fontWeight: '700' }}>Instant Disbursal Amount</span>
                          <strong style={{ color: '#166534' }}>₹{(selectedTxn.amount * 0.8 - selectedTxn.amount * 0.02).toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
                          <span style={{ color: '#71717a' }}>Holdback (20% — released after buyer repays)</span>
                          <span>₹{(selectedTxn.amount * 0.2).toLocaleString('en-IN')}</span>
                        </div>
                        {selectedTxn.utrRef && (
                          <div style={{ marginTop: '8px', padding: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '10px', color: '#166534' }}>
                            UTR Reference: <strong style={{ fontFamily: 'monospace' }}>{selectedTxn.utrRef}</strong>
                          </div>
                        )}
                      </>
                    ) : selectedTxn.paymentMode === 'global_govt' ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <span style={{ color: '#dc2626' }}>LC Processing Fee (0.5%)</span>
                          <span style={{ color: '#dc2626' }}>-₹{(selectedTxn.amount * 0.005).toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px dashed #e4e4e7', paddingTop: '8px', marginTop: '6px' }}>
                          <span style={{ fontWeight: '700' }}>Net Receivable (Upon LC Presentation)</span>
                          <strong style={{ color: '#166534' }}>₹{(selectedTxn.amount - selectedTxn.amount * 0.005).toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ marginTop: '8px', padding: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '10px', color: '#1e40af' }}>
                          Payment will be processed by Govt Bank upon successful presentation and verification of LC documents.
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <span style={{ color: '#71717a' }}>Bank Fee</span>
                          <span style={{ color: '#166534' }}>None (Direct Credit)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px dashed #e4e4e7', paddingTop: '8px', marginTop: '6px' }}>
                          <span style={{ fontWeight: '700' }}>Full Amount at Maturity</span>
                          <strong style={{ color: '#166534' }}>₹{selectedTxn.amount.toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ marginTop: '8px', padding: '8px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '10px', color: '#92400e' }}>
                          Buyer pays full invoice at {selectedTxn.creditPeriod || 30}-day maturity. No immediate payout.
                        </div>
                      </>
                    )}
                  </div>

                  {/* ── Download Actions ── */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e4e4e7' }}>
                    {selectedTxn.status === 'Disbursed' && (
                      <button className="btn btn-primary" style={{ height: '30px', fontSize: '11px', flex: 1 }} onClick={() => downloadPayoutAdviceCSV(selectedTxn)}>
                        <Download style={{ width: '12px', height: '12px' }} />
                        <span>Download Payout Advice</span>
                      </button>
                    )}
                    <button className="btn btn-secondary" style={{ height: '30px', fontSize: '11px', flex: 1 }} onClick={() => downloadFastagCSV(selectedTxn.vehicleNo)}>
                      <Download style={{ width: '12px', height: '12px' }} />
                      <span>Download FASTag Logs</span>
                    </button>
                  </div>

                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" style={{ height: '32px' }} onClick={() => setSelectedTxn(null)}>Close Details</button>
                </div>
              </div>
            </div>
          )}

          {/* Challan/Invoice Preview Modal */}
          {showChallanPreview && (
            <div className="modal-overlay active" style={{ zIndex: 3000 }}>
              <div className="modal-content" style={{ maxWidth: '850px', background: '#f4f4f5', padding: '12px' }}>
                <div className="modal-header" style={{ background: '#ffffff', borderBottom: '1px solid #e4e4e7' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn" 
                      style={{ 
                        height: '28px', 
                        fontSize: '11px', 
                        background: docType === 'challan' ? 'var(--steampunk-gold)' : '#ffffff', 
                        color: docType === 'challan' ? '#ffffff' : 'var(--steampunk-gold)',
                        border: '1px solid #000000'
                      }} 
                      onClick={() => setDocType('challan')}
                    >
                      {tradeMode === 'global' ? 'Bill of Lading Format' : 'Delivery Challan Format'}
                    </button>
                    <button 
                      className="btn" 
                      style={{ 
                        height: '28px', 
                        fontSize: '11px', 
                        background: docType === 'bill' ? 'var(--steampunk-gold)' : '#ffffff', 
                        color: docType === 'bill' ? '#ffffff' : 'var(--steampunk-gold)',
                        border: '1px solid #000000'
                      }} 
                      onClick={() => setDocType('bill')}
                    >
                      {tradeMode === 'global' ? 'Bill of Lading Format' : 'Bill of Supply Format'}
                    </button>
                  </div>
                  <span className="close-btn" onClick={() => setShowChallanPreview(false)}><X style={{ width: '18px', height: '18px' }} /></span>
                </div>
                
                <div className="modal-body" style={{ padding: '12px', overflowY: 'auto', maxHeight: '480px' }}>
                  <div style={{ background: '#ffffff', padding: '20px', border: '2px solid #000000', fontFamily: 'Arial, sans-serif', color: 'var(--steampunk-gold)', fontSize: '12px' }}>
                    <h1 style={{ textDecoration: 'underline', fontSize: '18px', textAlign: 'center', fontWeight: 'bold', margin: '0 0 16px 0', letterSpacing: '1px' }}>
                      {tradeMode === 'global' 
                        ? (docType === 'bill' ? 'BILL OF LADING' : 'COMMERCIAL INVOICE') 
                        : (docType === 'bill' ? 'BILL OF SUPPLY' : 'DELIVERY CHALLAN/NOTE')}
                    </h1>

                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000000' }}>
                      <tbody>
                        {/* Header details */}
                        <tr>
                          <td colSpan="4" style={{ border: '1px solid #000000', padding: '6px 8px', verticalAlign: 'top', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 'bold' }}>{supplierForm.legalName.toUpperCase()}</span><br />
                            Proprietor Sri. {supplierForm.proprietor}<br />
                            <span style={{ fontWeight: 'bold' }}>Address:</span><br />
                            D.No : 19-16-109/1, Katari Compound, Y Junction, Near<br />
                            Shankara Matam, Bhimavaram, West Godavari Dist,<br />
                            Pincode - 534201.
                          </td>
                          <td colSpan="3" style={{ border: '1px solid #000000', padding: '6px 8px', verticalAlign: 'top', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 'bold' }}>
                              {tradeMode === 'global' 
                                ? (docType === 'bill' ? 'B/L No.' : 'Invoice No.') 
                                : (docType === 'bill' ? 'Invoice No.' : 'D.C .No.')}
                            </span> ARB/2021-22/153<br />
                            <span style={{ fontWeight: 'bold' }}>Dt:</span> {new Date().toLocaleDateString('en-IN')}.<br /><br />
                            <span style={{ fontWeight: 'bold' }}>Ref.No:</span> DEC/133 <span style={{ fontWeight: 'bold' }}>Dt:</span> {new Date().toLocaleDateString('en-IN')}.
                          </td>
                        </tr>

                        {/* Billed To / Shipped To */}
                        <tr>
                          <td colSpan="3" style={{ border: '1px solid #000000', padding: '6px 8px', verticalAlign: 'top', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 'bold' }}>Billed To:</span><br /><br />
                            {newTxnForm.buyer.toUpperCase()}<br />
                            R.S.No - 130, Dirusumarru Road,<br />
                            Yannamadurru, Bhimavaram Mandal, West<br />
                            Godavari Dist., A.P. Pincode - 534239.<br /><br />
                            GSTIN ID: 37AAJCS6258G1ZY State Code: 37
                          </td>
                          <td colSpan="4" style={{ border: '1px solid #000000', padding: '6px 8px', verticalAlign: 'top', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 'bold' }}>Shipped To:</span><br /><br />
                            {newTxnForm.buyer.toUpperCase()}<br />
                            R.S.No - 130, Dirusumarru Road,<br />
                            Yannamadurru, Bhimavaram Mandal, West<br />
                            Godavari Dist., A.P. Pincode - 534239.<br /><br />
                            GSTIN ID: 37AAJCS6258G1ZY State Code: 37
                          </td>
                        </tr>

                        {/* Conditions */}
                        <tr>
                          <td colSpan="7" style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold' }}>Conditions, if any;</td>
                        </tr>

                        {/* Table headers */}
                        <tr style={{ background: '#fcfcfc', textAlign: 'center' }}>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>Variety</th>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>Count</th>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>HSN CODE</th>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>Weight in Kgs.</th>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>No. of Boxes</th>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>Rate</th>
                          <th style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold', fontSize: '11px' }}>Total Amount Rs.</th>
                        </tr>

                        {/* Table row */}
                        <tr>
                          <td style={{ border: '1px solid #000000', padding: '6px' }}>{newTxnForm.variety}</td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'center' }}>{newTxnForm.count}</td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'center' }}>0306</td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'center' }}>{parseFloat(newTxnForm.quantity).toFixed(3)}</td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'center' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'right' }}>{(parseFloat(newTxnForm.totalValue) / parseFloat(newTxnForm.quantity)).toFixed(2)}</td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'right' }}>{parseFloat(newTxnForm.totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>

                        {/* Blank rows */}
                        {[1, 2, 3].map((_, idx) => (
                          <tr key={idx} style={{ height: '22px' }}>
                            <td style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000', textAlign: 'right' }}>-</td>
                          </tr>
                        ))}

                        {/* Total */}
                        <tr>
                          <td style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold' }}>Total</td>
                          <td style={{ border: '1px solid #000000' }}></td>
                          <td style={{ border: '1px solid #000000' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{parseFloat(newTxnForm.quantity).toFixed(3)}</td>
                          <td colSpan="2" style={{ border: '1px solid #000000' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{parseFloat(newTxnForm.totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>

                        {/* Taxes */}
                        <tr>
                          <td colSpan="2" style={{ border: '1px solid #000000', padding: '4px', textAlign: 'center' }}>CGST</td>
                          <td colSpan="2" style={{ border: '1px solid #000000', padding: '4px', textAlign: 'center' }}>0%</td>
                          <td colSpan="2" style={{ border: '1px solid #000000' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '4px', textAlign: 'right' }}>-</td>
                        </tr>
                        <tr>
                          <td colSpan="2" style={{ border: '1px solid #000000', padding: '4px', textAlign: 'center' }}>SGST</td>
                          <td colSpan="2" style={{ border: '1px solid #000000', padding: '4px', textAlign: 'center' }}>0%</td>
                          <td colSpan="2" style={{ border: '1px solid #000000' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '4px', textAlign: 'right' }}>-</td>
                        </tr>
                        {docType === 'bill' && (
                          <tr>
                            <td colSpan="2" style={{ border: '1px solid #000000', padding: '4px', textAlign: 'center' }}>TDS</td>
                            <td colSpan="2" style={{ border: '1px solid #000000', padding: '4px', textAlign: 'center' }}>0%</td>
                            <td colSpan="2" style={{ border: '1px solid #000000' }}></td>
                            <td style={{ border: '1px solid #000000', padding: '4px', textAlign: 'right' }}>-</td>
                          </tr>
                        )}

                        {/* Rounded off & Grand Total */}
                        <tr>
                          <td colSpan="6" style={{ border: '1px solid #000000', padding: '6px' }}>Rounded off</td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'right' }}>0.00</td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ border: '1px solid #000000', padding: '6px', fontWeight: 'bold' }}>
                            Rupees {parseFloat(newTxnForm.totalValue) === 1865000 ? 'Eighteen Lakhs Sixty Five Thousand Only' : 'Tax Invoice Amount In Words Only'}
                          </td>
                          <td style={{ border: '1px solid #000000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{parseFloat(newTxnForm.totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>

                        {/* Signature block */}
                        <tr>
                          <td colSpan="4" style={{ border: '1px solid #000000', height: '60px' }}></td>
                          <td colSpan="3" rowSpan="2" style={{ border: '1px solid #000000', padding: '8px', verticalAlign: 'top', height: '90px' }}>
                            <span style={{ fontWeight: 'bold' }}>For {supplierForm.legalName.toUpperCase()}</span><br /><br />
                            <span style={{ fontFamily: 'cursive', fontSize: '16px', display: 'inline-block', margin: '4px 0' }}>{supplierForm.proprietor}</span><br />
                            PROPRIETOR
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4" style={{ border: '1px solid #000000', padding: '4px' }}>Proprietor</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="modal-footer" style={{ background: '#ffffff' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ height: '32px' }} 
                    onClick={() => {
                      setNewTxnDocs({...newTxnDocs, challan: true});
                      setShowChallanPreview(false);
                      triggerToast("Invoice / Challan generated and attached.");
                    }}
                  >
                    Confirm & Attach Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bill Discounting Disbursal Modal (Opened when clicking "Bill Discount" action) */}
          {withdrawTxn && (
            <div className="modal-overlay active" style={{ zIndex: 2500 }}>
              <div className="modal-content" style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '13px', fontWeight: '700' }}>
                    {disbursalReceipt ? '✅ Payment Confirmation Receipt' : 'Bill Discount Disbursal Panel'}
                  </h3>
                  <span className="close-btn" onClick={() => { setWithdrawTxn(null); setDisbursalReceipt(null); }}>
                    <X style={{ width: '18px', height: '18px' }} />
                  </span>
                </div>

                {/* STATE 1: Confirmation Form */}
                {!withdrawalLoading && !disbursalReceipt && (
                  <div className="modal-body">
                    <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '14px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                        <img src={tradeMode === 'global' ? '/assets/drip_capital_logo.jpg' : '/assets/hdfc_bank_logo.png'} style={{ height: '16px', objectFit: 'contain' }} alt="Bank"/>
                        <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
                          {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Bill Discounting via <span style={{ textDecoration: 'underline' }}>{withdrawTxn.financierBank || (((withdrawTxn.items?.[0]?.variety || withdrawTxn.variety || '').toLowerCase().includes('shrimp') || (withdrawTxn.items?.[0]?.variety || withdrawTxn.variety || '').toLowerCase().includes('vannamei')) ? 'HDFC Bank' : 'Axis Bank')}</span>
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                        Locked for variety: {withdrawTxn.items?.[0]?.variety || withdrawTxn.variety} · Credit Period: {withdrawTxn.dueDate}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#71717a' }}>Total Invoice Amount:</span>
                        <strong>₹{withdrawTxn.amount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#71717a' }}>Eligible Advance (80%):</span>
                        <strong>₹{(withdrawTxn.amount * 0.8).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#71717a' }}>Bank Processing Fee (2%):</span>
                        <strong style={{ color: '#ef4444' }}>- ₹{(withdrawTxn.amount * 0.02).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000000', paddingTop: '10px', marginTop: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '13px' }}>💰 You Will Receive:</span>
                        <strong style={{ color: '#166534', fontSize: '16px' }}>₹{(withdrawTxn.amount * 0.8 - withdrawTxn.amount * 0.02).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', fontSize: '10px', color: '#71717a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '4px' }}>
                      ℹ️ Amount will be transferred to your <strong>SBI Account ****{supplierForm.accountNo.slice(-4)}</strong> via NEFT/RTGS within minutes of confirmation.
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '10px', color: '#71717a', background: '#fefce8', border: '1px solid #fde68a', padding: '10px', borderRadius: '4px' }}>
                      ⚠️ Remaining 20% (₹{(withdrawTxn.amount * 0.2).toLocaleString('en-IN')}) will be released after buyer settles repayment to bank at maturity.
                    </div>

                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      style={{ width: '100%', marginTop: '16px' }}
                      onClick={() => {
                        setWithdrawalLoading(true);
                        const utrRef = `${(withdrawTxn.financierBank || 'HDFC').replace(' Bank','').toUpperCase()}${Date.now().toString().slice(-12)}`;
                        const netAmount = withdrawTxn.amount * 0.8 - withdrawTxn.amount * 0.02;
                        const bank = withdrawTxn.financierBank || 'HDFC Bank';
                        setTimeout(() => {
                          setTransactions(prev => prev.map(t => 
                            t.id === withdrawTxn.id ? { ...t, status: 'Disbursed', repaymentStatus: 'Awaiting Repayment', utrRef } : t
                          ));
                          setWithdrawalLoading(false);
                          setDisbursalReceipt({
                            utrRef,
                            netAmount,
                            bank,
                            accountNo: supplierForm.accountNo,
                            timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                            txn: { ...withdrawTxn, utrRef }
                          });
                        }, 2000);
                      }}
                    >
                      Confirm Disbursal & Transfer Cash →
                    </button>
                  </div>
                )}

                {/* STATE 2: Loading spinner */}
                {withdrawalLoading && (
                  <div className="modal-body" style={{ textAlign: 'center', padding: '40px 32px' }}>
                    <div style={{ border: '3px solid #f3f3f3', borderTop: '3px solid #000000', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
                    <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Processing Bank Transfer...</h4>
                    <p style={{ fontSize: '11px', color: '#71717a' }}>Interfacing with {withdrawTxn.financierBank || 'HDFC Bank'} NEFT gateway...</p>
                  </div>
                )}

                {/* STATE 3: UTR Payment Confirmation Receipt */}
                {disbursalReceipt && !withdrawalLoading && (
                  <div className="modal-body" style={{ padding: '0' }}>
                    {/* Green success banner */}
                    <div style={{ background: '#166534', color: '#ffffff', padding: '20px 24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', marginBottom: '4px' }}>✅</div>
                      <div style={{ fontSize: '15px', fontWeight: '800' }}>Transfer Successful</div>
                      <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px' }}>
                        ₹{disbursalReceipt.netAmount.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '4px' }}>
                        Credited to SBI Account ****{disbursalReceipt.accountNo.slice(-4)}
                      </div>
                    </div>

                    {/* Receipt details */}
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a', fontWeight: '600' }}>UTR Reference No.</span>
                        <strong style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--steampunk-gold)' }}>{disbursalReceipt.utrRef}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a' }}>Financier Bank</span>
                        <strong>{disbursalReceipt.bank}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a' }}>Payment Mode</span>
                        <strong>NEFT / RTGS</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a' }}>Timestamp</span>
                        <strong>{disbursalReceipt.timestamp}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a' }}>Invoice Value</span>
                        <strong>₹{disbursalReceipt.txn.amount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a' }}>Bank Fee (2%)</span>
                        <strong style={{ color: '#ef4444' }}>- ₹{(disbursalReceipt.txn.amount * 0.02).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#71717a' }}>Holdback at Maturity (20%)</span>
                        <strong>₹{(disbursalReceipt.txn.amount * 0.2).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#71717a' }}>Transaction Status</span>
                        <strong style={{ color: '#166534' }}>✅ DISBURSED</strong>
                      </div>
                    </div>

                    <div style={{ padding: '0 20px 20px 20px', display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, height: '36px' }}
                        onClick={() => { downloadPayoutAdviceCSV(disbursalReceipt.txn); }}
                      >
                        <Download style={{ width: '14px', height: '14px' }} />
                        <span>Download Payout Advice</span>
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, height: '36px' }}
                        onClick={() => { setWithdrawTxn(null); setDisbursalReceipt(null); }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Floating Toast Notification */}
          {toast && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--foreground)',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 style={{ width: '14px', height: '14px', color: '#ffffff' }} />
              <span>{toast}</span>
            </div>
          )}

        </div>
      );
    }
    
    // ------------------------------------------------------------------------
    // RENDER: CEO (Super Admin) Dashboard Flow
    // ------------------------------------------------------------------------
    if (role === 'ceo') {
      return <CeoDashboard />;
    }

    // ------------------------------------------------------------------------
    // RENDER: Financier (Admin) Dashboard Flow
    // ------------------------------------------------------------------------
    if (role === 'financier') {
      return <FinancierDashboard />;
    }

    // ------------------------------------------------------------------------
    // RENDER: Buyer Processor Dashboard Flow
    // ------------------------------------------------------------------------
    if (role === 'buyer') {
      const pendingDispatches = myTransactions.filter(t => t.status === 'Dispatched');
      const activePayables = myTransactions.filter(t => t.status === 'Disbursed');
      const settledPayables = myTransactions.filter(t => t.status === 'Closed');

      return (
        <div className="dashboard-layout">
          
          {/* Left Fixed Sidebar (Buyer Version) */}
          <BuyerSidebar 
            buyerActiveTab={buyerActiveTab} 
            setBuyerActiveTab={setBuyerActiveTab} 
            buyerForm={buyerForm} 
            setScreen={setScreen} 
          />

          {/* Right Content Section Wrapper */}
          <div className="main-wrapper">
            {/* Top Header */}
            <GlobalHeader 
              title={
                buyerActiveTab === 'dashboard' ? 'Buyer Overview' 
                  : buyerActiveTab === 'approvals' ? 'Dispatched Cargo & Inspection Queue' 
                  : buyerActiveTab === 'payables' ? 'Outstanding Payments Ledger' 
                  : buyerActiveTab === 'purchase_orders' ? 'Issued Purchase Orders' 
                  : buyerActiveTab === 'documents' ? 'Business Documents' 
                  : 'Plant Operations Monitor'
              }
              entityName={loggedInUser?.corporateName || loggedInUser?.legalName || "Demo Company"} 
              role={role}
              switchRoleSafe={switchRoleSafe}
              tradeMode={tradeMode}
              setTradeMode={switchTradeModeSafe}
              profilePic={loggedInUser?.profilePic}
            />

            {/* Scrollable Content Workspace */}
            <main className="main-content">

              {/* Dashboard */}
              {buyerActiveTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="metric-card">
                      <span className="metric-label">Total Value Purchased</span>
                      <div className="metric-value">{tradeMode === 'global' ? '$' : '₹'}{myTransactions.filter(t => t.status === 'Closed' || t.status === 'Disbursed' || t.status === 'Buyer Confirmed').reduce((acc, c) => acc + c.amount, 0).toLocaleString('en-IN')}</div>
                      <span className="metric-sub">Cumulative POs Issued</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-label">Total Amount to Repay</span>
                      <div className="metric-value">{tradeMode === 'global' ? '$' : '₹'}{activePayables.reduce((acc, c) => acc + c.amount, 0).toLocaleString('en-IN')}</div>
                      <span className="metric-sub">Outstanding to financiers</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-label">Active Suppliers</span>
                      <div className="metric-value">{new Set(myTransactions.map(t => t.buyer)).size}</div>
                      <span className="metric-sub">Total enrolled vendors</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-label">Pending Approvals</span>
                      <div className="metric-value">{pendingDispatches.length}</div>
                      <span className="metric-sub">Shipments awaiting PO</span>
                    </div>

                    {tradeMode === 'global' && (
                      <div className="metric-card">
                        <span className="metric-label">Letter of Credit (LC)</span>
                        <div className="metric-value" style={{ color: '#166534', fontSize: '18px', paddingTop: '4px' }}>Active & Verified</div>
                        <span className="metric-sub">International Buyer Line</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="panel-card">
                    <div className="panel-title">Recent Transactions</div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Variety</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTransactions.slice(0, 5).map(t => (
                            <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                              <td><strong>{t.id}</strong></td>
                              <td>{t.items?.[0]?.variety || ''} ({t.items?.[0]?.count || ''})</td>
                              <td>{(t.items?.[0]?.quantity || 0).toLocaleString('en-IN')} {t.items?.[0]?.unit || ''}</td>
                              <td><strong>{tradeMode === 'global' ? '$' : '₹'}{t.amount.toLocaleString('en-IN')}</strong></td>
                              <td>
                                <span style={{
                                  display: 'inline-flex',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  background: t.status === 'Closed' ? '#f0fdf4' : '#eff6ff',
                                  color: t.status === 'Closed' ? '#166534' : '#1e40af'
                                }}>
                                  {t.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Create Purchase Request (Cart) */}
              {buyerActiveTab === 'create_request' && <CreateRequestTab />}
              
              {/* Tab 1: Confirmations & Deliveries */}
              {buyerActiveTab === 'approvals' && <BuyerApprovalsTab />}

              {/* Tab 2: Payables Ledger */}
              {buyerActiveTab === 'payables' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="metric-card">
                      <span className="metric-label">Outstanding payables</span>
                      <div className="metric-value">₹{activePayables.reduce((acc, c) => acc + c.amount, 0).toLocaleString('en-IN')}</div>
                      <span className="metric-sub">Funded by bank partner</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-label">Settled Bills</span>
                      <div className="metric-value">₹{settledPayables.reduce((acc, c) => acc + c.amount, 0).toLocaleString('en-IN')}</div>
                      <span className="metric-sub">Direct payments made to bank</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-label">Active Financiers</span>
                      <div className="metric-value">HDFC Bank / Axis Bank</div>
                      <span className="metric-sub">{tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Lending Partners</span>
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-title">Repayment Ledger Accounts</div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Variety</th>
                            <th>Quantity</th>
                            <th>Maturity Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTransactions.filter(t => t.status === 'Disbursed' || t.status === 'Closed').map(t => (
                            <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                              <td><strong>{t.id}</strong></td>
                              <td>{t.items?.[0]?.variety || ''} ({t.items?.[0]?.count || ''})</td>
                              <td>{(t.items?.[0]?.quantity || 0).toLocaleString('en-IN')} {t.items?.[0]?.unit || ''}</td>
                              <td><strong>₹{t.amount.toLocaleString('en-IN')}</strong></td>
                              <td>{t.dueDate}</td>
                              <td>
                                <span style={{
                                  display: 'inline-flex',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  background: t.status === 'Closed' ? '#f0fdf4' : '#eff6ff',
                                  color: t.status === 'Closed' ? '#166534' : '#1e40af'
                                }}>
                                  {t.status === 'Closed' ? 'Settled to Bank' : 'Outstanding Payable'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  {t.status === 'Disbursed' ? (
                                    <button 
                                      className="btn btn-secondary" 
                                      style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                      onClick={() => {
                                        setTransactions(prev => prev.map(item => 
                                          item.id === t.id ? { ...item, status: 'Closed', repaymentStatus: 'Settled by Buyer' } : item
                                        ));
                                        triggerToast(`Bill payment for ${t.id} settled directly to Financier.`);
                                      }}
                                    >
                                      Pay Financier
                                    </button>
                                  ) : (
                                    <span style={{ fontSize: '11px', color: '#71717a' }}><CheckCircle size={12} style={{display:"inline", marginBottom:"-2px"}} /> Closed</span>
                                  )}
                                  {t.docs?.billOfSupply && (
                                    <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }} onClick={() => setDocGeneratorConfig({ txn: t, docType: 'invoice', readonly: true })}>
                                      View Invoice
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Purchase Orders Archive */}
              {buyerActiveTab === 'purchase_orders' && (
                <div className="panel-card">
                  <div className="panel-title">Purchase Orders (PO) Archive</div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>PO Reference</th>
                          <th>Transaction ID</th>
                          <th>Supplier Name</th>
                          <th>Product Category</th>
                          <th>Weight Confirmed</th>
                          <th>Issued Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myTransactions.filter(t => t.status === 'PO Issued' || t.status === 'Invoice Raised' || t.status === 'Pending Financier' || t.status === 'Buyer Confirmed' || t.status === 'Disbursed' || t.status === 'Closed').map(t => (
                          <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                            <td><strong>PO-{t.id}</strong></td>
                            <td>{t.id}</td>
                            <td>ABC Aqua Exports</td>
                            <td>{t.items?.[0]?.variety || ''} ({t.items?.[0]?.count || ''})</td>
                            <td>{(t.items?.[0]?.quantity || 0)} KG</td>
                            <td>{new Date().toLocaleDateString('en-IN')}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-primary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: 'var(--foreground)', color: '#ffffff' }} onClick={() => setDocGeneratorConfig({ txn: t, docType: 'po', readonly: true })}>
                                  View PO
                                </button>
                                {t.docs?.billOfSupply && (
                                  <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }} onClick={() => setDocGeneratorConfig({ txn: t, docType: 'invoice', readonly: true })}>
                                    View Invoice
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}



              {/* Tab 5: Business Documents */}
              {buyerActiveTab === 'documents' && (
                <div className="panel-card">
                  <div className="panel-title">Uploaded Business Documents</div>
                  <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="doc-card" style={{ background: '#ffffff', cursor: 'default' }}>
                      <FileCheck style={{ width: '22px', height: '22px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>Factory_License.pdf</div>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>Verified Plant Document</span>
                    </div>
                    <div className="doc-card" style={{ background: '#ffffff', cursor: 'default' }}>
                      <FileCheck style={{ width: '22px', height: '22px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>Corporate_PAN.pdf</div>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>Verified Identity</span>
                    </div>
                    <div className="doc-card" style={{ background: '#ffffff', cursor: 'default' }}>
                      <FileCheck style={{ width: '22px', height: '22px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '600' }}>HDFC_Bank_Mandate.pdf</div>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>Escrow Mandate</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Plant Operations Tab */}
              {buyerActiveTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="panel-card" style={{ maxWidth: '650px', margin: 0 }}>
                    <div className="panel-title">Plant Environmental & Operations Monitor</div>
                    <form onSubmit={(e) => { e.preventDefault(); triggerToast("Plant operational logs updated."); }}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Cold Room Temperature Target (°C)</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={buyerForm.coldRoomTemp} 
                            onChange={(e) => setBuyerForm({...buyerForm, coldRoomTemp: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Daily Ice Stock Capacity (Tons)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={buyerForm.iceCapacity} 
                            onChange={(e) => setBuyerForm({...buyerForm, iceCapacity: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Weighbridge Calibration status</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={buyerForm.weighbridgeStatus} 
                            onChange={(e) => setBuyerForm({...buyerForm, weighbridgeStatus: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Daily Processing Capacity (Tons)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={buyerForm.dailyProcessingCap} 
                            onChange={(e) => setBuyerForm({...buyerForm, dailyProcessingCap: e.target.value})} 
                            required 
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                        Save Operational Log Parameters
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </main>
          </div>


          {selectedPO && (
            <div className="modal-overlay active" style={{ zIndex: 3000 }}>
              <div className="modal-content" style={{ maxWidth: '850px', padding: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e4e4e7', background: 'var(--background)', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Purchase Order Details</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {selectedPO.status === 'Dispatched' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ height: '30px', padding: '0 12px', fontSize: '11px', background: '#166534', color: '#ffffff', display: 'flex', gap: '6px', alignItems: 'center' }}
                        onClick={() => {
                          if (tradeMode === 'global' && !window.confirm("By issuing this Export PO, you confirm verification of the Bill of Lading and agree to remit 100% of the invoice value directly to the Financier at maturity. Proceed?")) return;
                          
                          setTransactions(prev => prev.map(item => 
                            item.id === selectedPO.id ? { ...item, status: 'Buyer Confirmed' } : item
                          ));
                          setSelectedPO(null);
                          triggerToast(`PO issued for load ${selectedPO.id}. Supplier notified.`);
                        }}
                      >
                        <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                        {tradeMode === 'global' ? 'Verify B/L & Issue Export PO' : 'Confirm & Send PO'}
                      </button>
                    )}
                    <button className="btn btn-secondary" style={{ height: '30px', fontSize: '11px', display: 'flex', gap: '6px' }} onClick={() => window.print()}>
                      <Printer style={{ width: '14px', height: '14px' }} />
                      Print
                    </button>
                    <span className="close-btn" onClick={() => setSelectedPO(null)}><X style={{ width: '18px', height: '18px' }} /></span>
                  </div>
                </div>
                
                <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                  <style>
                    {`
                      .po-page { max-width: 900px; margin: 0 auto; background: #fff; padding: 20px 30px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #000; position: relative; border: 1px solid #eee; }
                      .hand-note { position: absolute; top: 15px; right: 30px; font-family: cursive; font-size: 14px; text-align: center; transform: rotate(-12deg); color: #222; }
                      .po-header { text-align: center; }
                      .po-header h2 { margin: 0; font-size: 16px; }
                      .po-header p  { margin: 2px 0; line-height: 1.5; }
                      .po-title { text-align: center; font-size: 15px; letter-spacing: 1px; margin: 20px 0; font-weight: bold; }
                      .po-meta { display: flex; justify-content: space-between; margin-bottom: 18px; }
                      .po-meta .left  { width: 50%; }
                      .po-meta .right { width: 50%; text-align: right; }
                      .party { margin-bottom: 15px; line-height: 1.55; }
                      .items { width: 100%; border-collapse: collapse; margin: 10px 0 25px 0; }
                      .items th, .items td { padding: 5px 8px; vertical-align: top; border-bottom: 1px solid #ddd; }
                      .items th { border-bottom: 1px solid #000; text-align: left; }
                      .items th.amt, .items td.amt { border-left: 1px solid #000; text-align: right; width: 22%; }
                      .sub { padding-left: 20px; }
                      .sub span { display: inline-block; }
                      .sub .var { width: 90px; }
                      .sub .qty { width: 130px; }
                      .total { font-weight: bold; }
                      .words { line-height: 1.6; margin-bottom: 30px; }
                      .sign-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; }
                      .sig-left  { width: 30%; line-height: 1.8; }
                      .sig-mid   { width: 34%; text-align: center; }
                      .sig-right { width: 33%; text-align: center; line-height: 1.6; }
                      .sign { font-family: cursive; font-size: 20px; display: inline-block; margin-bottom: 4px; }
                      .stamp-wrap { position: relative; height: 100px; margin: 8px auto; display: flex; justify-content: center; }
                      .stamp-wrap svg { opacity: 0.75; }
                      .stamp-sign { position: absolute; top: 30px; font-family: cursive; font-size: 20px; transform: rotate(-8deg); }
                    `}
                  </style>

                  <div className="po-page" id="po-print-area">
                      <div className="hand-note">PO-{selectedPO.id}<br/>{new Date().toLocaleDateString('en-IN')}</div>
                      
                      <div className="po-header">
                          <h2>{buyerForm.corporateName} (From 1-Apr-2021)</h2>
                          <p>{buyerForm.factoryAddress}<br/>
                          GSTIN: {buyerForm.gstin}</p>
                      </div>

                      <div className="po-title">PURCHASE INVOICE</div>

                      <div className="po-meta">
                          <div className="left">
                              No. &nbsp;: &nbsp;<strong>PO-{selectedPO.id}</strong><br/>
                              Ref.: {selectedPO.vehicleNo}
                          </div>
                          <div className="right">
                              Dated &nbsp;: &nbsp;<strong>{new Date().toLocaleDateString('en-IN')}</strong>
                          </div>
                      </div>

                      <div className="party">
                          Party's Name &nbsp;: &nbsp;<strong>ABC Aqua Exports</strong><br/>
                          &nbsp;&nbsp;&nbsp;Registered Supplier Vendor<br/>
                      </div>

                      <table className="items">
                          <thead>
                              <tr>
                                  <th>Particulars</th>
                                  <th className="amt">Amount*</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td><strong>Raw Material Purchase</strong></td>
                                  <td className="amt">{selectedPO.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              </tr>
                              <tr>
                                  <td className="sub">
                                      <span className="var">{selectedPO.items?.[0]?.variety || selectedPO.variety}</span>
                                      <span className="qty">{selectedPO.items?.[0]?.quantity || selectedPO.quantity} {selectedPO.items?.[0]?.unit || selectedPO.unit}</span>
                                      <span>Count: {selectedPO.items?.[0]?.count || selectedPO.count}</span>
                                  </td>
                                  <td className="amt">{selectedPO.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              </tr>
                              <tr>
                                  <td>Round Off Ac</td>
                                  <td className="amt">0.00</td>
                              </tr>
                              <tr>
                                  <td></td>
                                  <td className="amt total">₹ {selectedPO.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              </tr>
                          </tbody>
                      </table>

                      <p className="words">
                          <strong>Amount (in words) :</strong><br/>
                          INR {selectedPO.amount.toLocaleString('en-IN')} Only
                      </p>

                      <div className="sign-row">
                          <div className="sig-left">
                              Receiver's Signature:<br/>
                              <strong>Entered User Name : Rabia</strong>
                          </div>

                          <div className="sig-mid">
                              <span className="sign">P. Sanjeeva</span><br/>
                              Checked Signatory
                          </div>

                          <div className="sig-right">
                              for <strong>{buyerForm.corporateName}</strong>
                              <div className="stamp-wrap">
                                  <svg width="100" height="100" viewBox="0 0 120 120">
                                      <defs>
                                          <path id="circ" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"/>
                                      </defs>
                                      <circle cx="60" cy="60" r="57" fill="none" stroke="#3a4a7a" strokeWidth="2"/>
                                      <circle cx="60" cy="60" r="32" fill="none" stroke="#3a4a7a" strokeWidth="1.5"/>
                                      <text fontSize="9.5" fill="#3a4a7a" fontWeight="bold">
                                          <textPath href="#circ">* {buyerForm.corporateName.substring(0, 15)} * CERTIFIED *</textPath>
                                      </text>
                                      <text x="60" y="57" textAnchor="middle" fontSize="8" fill="#3a4a7a">SIGNATURE</text>
                                  </svg>
                                  <div className="stamp-sign">Suri</div>
                              </div>
                              Authorised Signatory
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Toast Notification */}
          {toast && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--foreground)',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 style={{ width: '14px', height: '14px', color: '#ffffff' }} />
              <span>{toast}</span>
            </div>
          )}

          {/* ===== DOCUMENT GENERATOR MODAL ===== */}
          {docGeneratorConfig && (
            <DocumentGeneratorModal
              config={docGeneratorConfig}
              onClose={() => setDocGeneratorConfig(null)}
            />
          )}

        </div>
      );
    }
  }
}

export default App;
