import React, { useState } from 'react';
import { 
  Eye, ShieldCheck, Users, Briefcase, FileText, CheckCircle2, 
  BarChart3, UserPlus, X, Building, Search, Network, 
  AlertTriangle, TrendingUp, Globe, MapPin, Activity, AlertOctagon,
  Clock, Server, BarChart, PieChart, ShieldAlert, Scale, CreditCard,
  ChevronRight, Download, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import GlobalHeader from '../../components/GlobalHeader';

export const CeoDashboard = () => {
  const {
    loggedInUser,
    role,
    switchRoleSafe,
    tradeMode,
    switchTradeModeSafe,
    transactions,
    personas,
    handleAddAdmin
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('eagle-eye');
  const [subTab, setSubTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [suspendEntity, setSuspendEntity] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  
  const [newAdmin, setNewAdmin] = useState({
    phone: '',
    legalName: '',
    bankName: '',
    proprietor: ''
  });

  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalDisbursed = transactions.filter(t => t.status === 'Disbursed').reduce((acc, t) => acc + (t.amount * 0.8), 0);
  const admins = personas.filter(p => p.role === 'financier');
  const networkEntities = personas.filter(p => p.role === 'supplier' || p.role === 'buyer');

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.buyer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEntities = networkEntities.filter(p =>
    (p.legalName || p.corporateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const platformRevenue = totalVolume * 0.005; // 0.5% average spread/commission
  const globalVolume = transactions.filter(t => t.tradeMode === 'global').reduce((acc, t) => acc + t.amount, 0);
  const domesticVolume = transactions.filter(t => t.tradeMode === 'domestic').reduce((acc, t) => acc + t.amount, 0);

  const [mockLogs] = useState([
    { id: 1, time: '10 mins ago', user: 'Drip Capital (Admin)', action: 'Disbursed $45,000 for TXN-2024-101', type: 'success' },
    { id: 2, time: '1 hour ago', user: 'HDFC Bank Underwriting', action: 'Approved ₹50L facility for ABC Aqua Exports', type: 'info' },
    { id: 3, time: '3 hours ago', user: 'Axis Bank (Admin)', action: 'Flagged TXN-2024-098 due to E-Way bill mismatch', type: 'warning' },
    { id: 4, time: 'Yesterday', user: 'System Auto-Sweep', action: 'Settled ₹12,00,000 holdback to Coastal Catch Fisheries', type: 'success' },
  ]);

  const handleAction = (actionName, txnId) => {
    alert(`[Super Admin Override]: Executing '${actionName}' on transaction ${txnId}.`);
  };

  const handleSuspend = (e) => {
    e.preventDefault();
    alert(`[Super Admin]: Entity ${suspendEntity} suspended for: ${suspendReason}`);
    setSuspendEntity(null);
    setSuspendReason('');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    handleAddAdmin({
      phone: newAdmin.phone,
      role: 'financier',
      tradeMode: 'global',
      legalName: newAdmin.legalName,
      proprietor: newAdmin.proprietor || 'Admin',
      bankName: newAdmin.bankName || 'HDFC Bank',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    setShowCreateModal(false);
    setNewAdmin({ phone: '', legalName: '', bankName: '', proprietor: '' });
  };

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar" style={{ overflowY: 'auto' }}>
        <div className="sidebar-logo">
          <img src="/assets/miledeep_logo.svg" alt="Miledeep" style={{ width: '120px' }} />
        </div>
        <nav className="sidebar-nav">
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', padding: '0 12px', marginTop: '12px', marginBottom: '8px', letterSpacing: '0.05em' }}>Core Oversight</div>
          <a href="#" className={`nav-item ${activeTab === 'eagle-eye' ? 'active' : ''}`} onClick={() => { setActiveTab('eagle-eye'); setSubTab(''); }}>
            <Eye className="nav-icon" />
            Eagle Eye View
          </a>
          <a href="#" className={`nav-item ${activeTab === 'network' ? 'active' : ''}`} onClick={() => { setActiveTab('network'); setSubTab(''); }}>
            <Network className="nav-icon" />
            Network Entities
          </a>
          
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', padding: '0 12px', marginTop: '24px', marginBottom: '8px', letterSpacing: '0.05em' }}>Deep Hubs</div>
          <a href="#" className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setSubTab('volume'); }}>
            <BarChart className="nav-icon" />
            BI & Analytics
          </a>
          <a href="#" className={`nav-item ${activeTab === 'treasury' ? 'active' : ''}`} onClick={() => { setActiveTab('treasury'); setSubTab('facilities'); }}>
            <CreditCard className="nav-icon" />
            Treasury & Liquidity
          </a>
          <a href="#" className={`nav-item ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => { setActiveTab('risk'); setSubTab('pending-kyc'); }}>
            <ShieldAlert className="nav-icon" />
            Risk & Compliance
          </a>
          <a href="#" className={`nav-item ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => { setActiveTab('disputes'); setSubTab('active'); }}>
            <Scale className="nav-icon" />
            Dispute Resolution
          </a>

          <div style={{ fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', padding: '0 12px', marginTop: '24px', marginBottom: '8px', letterSpacing: '0.05em' }}>System</div>
          <a href="#" className={`nav-item ${activeTab === 'admin-management' ? 'active' : ''}`} onClick={() => setActiveTab('admin-management')}>
            <ShieldCheck className="nav-icon" />
            Admin Management
          </a>
          <a href="#" className={`nav-item ${activeTab === 'system-logs' ? 'active' : ''}`} onClick={() => setActiveTab('system-logs')}>
            <Activity className="nav-icon" />
            System Audit Logs
          </a>
          <a href="#" className={`nav-item ${activeTab === 'master-settings' ? 'active' : ''}`} onClick={() => setActiveTab('master-settings')}>
            <Briefcase className="nav-icon" />
            Master Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <GlobalHeader 
          title="CEO (Super Admin) Portal"
          entityName={loggedInUser?.legalName || "CEO"}
          role={role}
          switchRoleSafe={switchRoleSafe}
          tradeMode={tradeMode}
          setTradeMode={switchTradeModeSafe}
          profilePic={loggedInUser?.profilePic}
        />

        <main className="main-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Global Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px' }}>
              <Search style={{ width: '20px', height: '20px', color: 'var(--muted-foreground)', marginRight: '12px' }} />
              <input 
                type="text" 
                placeholder="Search transactions, suppliers, buyers, or phone numbers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent', color: 'var(--foreground)' }}
              />
            </div>

            {/* KPI Metrics */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="metric-card">
                <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp style={{width:'14px', height:'14px'}}/> Total Trade Volume</span>
                <div className="metric-value">₹{(totalVolume / 100000).toFixed(2)} L</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '11px' }}>
                  <span style={{ color: '#0284c7' }}><Globe style={{width:'10px', height:'10px', display:'inline'}}/> Global: ₹{(globalVolume / 100000).toFixed(2)}L</span>
                  <span style={{ color: '#ea580c' }}><MapPin style={{width:'10px', height:'10px', display:'inline'}}/> Dom: ₹{(domesticVolume / 100000).toFixed(2)}L</span>
                </div>
              </div>
              <div className="metric-card" style={{ border: '2px solid var(--steampunk-gold)' }}>
                <span className="metric-label" style={{ color: 'var(--steampunk-gold)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase style={{width:'14px', height:'14px'}}/> Platform Revenue (0.5%)</span>
                <div className="metric-value" style={{ fontWeight: '800', color: 'var(--steampunk-gold)' }}>₹{(platformRevenue / 100000).toFixed(2)} L</div>
                <span className="metric-sub">Est. commission earned</span>
              </div>
              <div className="metric-card">
                <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server style={{width:'14px', height:'14px'}}/> Capital Deployed</span>
                <div className="metric-value">₹{(totalDisbursed / 100000).toFixed(2)} L</div>
                <div style={{ background: '#f4f4f5', height: '4px', width: '100%', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--steampunk-gold)', width: '65%', height: '100%' }}></div>
                </div>
                <span className="metric-sub" style={{ marginTop: '4px', display: 'block' }}>65% of Total Credit Line utilized</span>
              </div>
              <div className="metric-card" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                <span className="metric-label" style={{ color: '#be123c', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertOctagon style={{width:'14px', height:'14px'}}/> Risk & Disputes</span>
                <div className="metric-value" style={{ color: '#be123c' }}>0</div>
                <span className="metric-sub" style={{ color: '#f43f5e' }}>0 active defaults / flags</span>
              </div>
            </div>

            {/* Eagle Eye Tab */}
            {activeTab === 'eagle-eye' && (
              <div className="panel-card">
                <div className="panel-title">Global Transaction Ledger</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>Complete oversight of every transaction flowing through the platform.</p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>TXN ID</th>
                      <th>Mode</th>
                      <th>Supplier</th>
                      <th>Buyer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Super Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.id}</strong></td>
                        <td>
                           <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}>
                             {t.tradeMode === 'global' ? <><Globe size={12} style={{marginRight: '4px'}} /> Global</> : <><MapPin size={12} style={{marginRight: '4px'}} /> Domestic</>}
                           </span>
                        </td>
                        <td>{t.supplier}</td>
                        <td>{t.buyer}</td>
                        <td>{t.tradeMode === 'global' ? '$' : '₹'}{t.amount.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge badge-${t.statusClass || 'info'}`}>{t.status}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }} onClick={() => setSelectedTxn(t)}>
                              <Eye style={{ width: '12px', height: '12px', marginRight: '4px' }} /> View
                            </button>
                            <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }} onClick={() => handleAction('Halt Trade', t.id)}>
                              <AlertTriangle style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Halt
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Network Entities Tab */}
            {activeTab === 'network' && (
              <div className="panel-card">
                <div className="panel-title">Network Entities</div>
                <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>Complete directory of all Traders, Suppliers, and Buyers operating on the platform.</p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Entity Name</th>
                      <th>Role</th>
                      <th>Trade Mode</th>
                      <th>Phone (Login ID)</th>
                      <th>Connected Bank</th>
                      <th>GST / Tax ID</th>
                      <th style={{ textAlign: 'right' }}>Master Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntities.map((e, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={e.profilePic} alt="pic" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                            <strong>{e.legalName || e.corporateName}</strong>
                          </div>
                        </td>
                        <td>
                           <span style={{ fontSize: '12px', background: 'var(--background)', padding: '2px 6px', borderRadius: '4px', textTransform: 'capitalize', fontWeight: '600' }}>
                             {e.role}
                           </span>
                        </td>
                        <td>
                           <span style={{ fontSize: '12px', background: 'var(--background)', padding: '2px 6px', borderRadius: '4px', textTransform: 'capitalize' }}>
                             {e.tradeMode}
                           </span>
                        </td>
                        <td>{e.phone}</td>
                        <td>{e.bankName}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{e.gstin || 'N/A'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }} onClick={() => handleAction('Edit Credit Limits', e.phone)}>
                              Limits
                            </button>
                            <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }} onClick={() => setSuspendEntity(e.phone)}>
                              Suspend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Admin Management Tab */}
            {activeTab === 'admin-management' && (
              <div className="panel-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <div className="panel-title">Admin Management</div>
                    <p style={{ fontSize: '13px', color: '#71717a' }}>Manage and provision new Financier/Admin roles for the platform.</p>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowCreateModal(true)}
                    style={{ background: 'var(--steampunk-gold)', color: 'var(--primary-foreground)' }}
                  >
                    <UserPlus style={{ width: '16px', height: '16px' }} />
                    Create New Admin
                  </button>
                </div>
                
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Entity Name</th>
                      <th>Proprietor</th>
                      <th>Phone (Login ID)</th>
                      <th>Bank Affiliation</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={a.profilePic} alt="pic" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                            <strong>{a.legalName}</strong>
                          </div>
                        </td>
                        <td>{a.proprietor}</td>
                        <td>{a.phone}</td>
                        <td>{a.bankName}</td>
                        <td><span className="badge badge-success">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* System Logs Tab */}
            {activeTab === 'system-logs' && (
              <div className="panel-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <div className="panel-title">System Audit Logs</div>
                    <p style={{ fontSize: '13px', color: '#71717a' }}>Real-time immutable ledger of all financier and operator actions.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: '12px' }}>Export CSV</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockLogs.map(log => (
                    <div key={log.id} style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', background: '#ffffff', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: log.type === 'success' ? '#dcfce7' : log.type === 'warning' ? '#fef3c7' : '#e0e7ff',
                        color: log.type === 'success' ? '#166534' : log.type === 'warning' ? '#92400e' : '#3730a3'
                      }}>
                        {log.type === 'success' ? <CheckCircle2 style={{ width: '16px', height: '16px' }} /> : log.type === 'warning' ? <AlertTriangle style={{ width: '16px', height: '16px' }} /> : <Activity style={{ width: '16px', height: '16px' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{log.user}</span>
                          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{log.time}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#3f3f46' }}>{log.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Master Settings Tab */}
            {activeTab === 'master-settings' && (
              <div className="panel-card">
                <div className="panel-title">Master Platform Settings</div>
                <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '24px' }}>Global configurations that affect all users and transactions on the platform.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Financing Configurations</h4>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Default Advance Rate (%)</label>
                      <input type="number" defaultValue={80} className="form-input" style={{ width: '100%' }} />
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Platform Commission Spread (%)</label>
                      <input type="number" defaultValue={0.5} step="0.1" className="form-input" style={{ width: '100%' }} />
                    </div>
                  </div>
                  
                  <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Security & Auto-Approvals</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>Auto-Approve Transactions Under $10k</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>Bypass manual admin verification for small trades</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>Strict KYC Enforcement</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>Block unverified accounts from creating orders</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => handleAction('Save Master Settings', 'global')}>
                    Save Global Configuration
                  </button>
                </div>
              </div>
            )}

            {/* Analytics Hub */}
            {activeTab === 'analytics' && (
              <div className="panel-card">
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                  <button className={`btn ${subTab === 'volume' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }} onClick={() => setSubTab('volume')}>Volume Trends</button>
                  <button className={`btn ${subTab === 'entity' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }} onClick={() => setSubTab('entity')}>Entity Leaderboard</button>
                </div>
                {subTab === 'volume' && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Month-over-Month Trade Volume (Simulated)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px', padding: '24px', background: '#fafafa', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      {[40, 55, 45, 70, 90, 120].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', height: `${h}px`, background: i === 5 ? 'var(--steampunk-gold)' : '#e4e4e7', borderRadius: '4px 4px 0 0' }}></div>
                          <div style={{ fontSize: '11px', color: '#71717a' }}>Month {i+1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {subTab === 'entity' && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Top Performing Entities</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['Global Importers LLC', 'Suryamitra Exim', 'Coastal Catch Fisheries'].map((name, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <div style={{ fontWeight: '600' }}>#{i+1} {name}</div>
                          <div style={{ color: 'var(--steampunk-gold)', fontWeight: '700' }}>{120 - i*30} Trades YTD</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Treasury Hub */}
            {activeTab === 'treasury' && (
              <div className="panel-card">
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                  <button className={`btn ${subTab === 'facilities' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }} onClick={() => setSubTab('facilities')}>Active Facilities</button>
                  <button className={`btn ${subTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }} onClick={() => setSubTab('calendar')}>Maturity Calendar</button>
                </div>
                {subTab === 'facilities' && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Capital Deployed by Partner</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ padding: '16px', border: '1px solid var(--steampunk-gold)', borderRadius: '8px', background: '#fefce8' }}>
                        <div style={{ fontWeight: '700', marginBottom: '8px' }}>Drip Capital (Global)</div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--steampunk-gold)' }}>$4.5M <span style={{fontSize: '12px', color: '#71717a'}}>out of $10M</span></div>
                        <div style={{ background: '#e4e4e7', height: '6px', borderRadius: '3px', marginTop: '12px' }}><div style={{ background: 'var(--steampunk-gold)', width: '45%', height: '100%', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: '700', marginBottom: '8px' }}>HDFC Bank (Domestic)</div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>₹12.5Cr <span style={{fontSize: '12px', color: '#71717a'}}>out of ₹50Cr</span></div>
                        <div style={{ background: '#e4e4e7', height: '6px', borderRadius: '3px', marginTop: '12px' }}><div style={{ background: '#3f3f46', width: '25%', height: '100%', borderRadius: '3px' }}></div></div>
                      </div>
                    </div>
                  </div>
                )}
                {subTab === 'calendar' && (
                  <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px', color: '#71717a' }}>
                    Calendar view coming soon. No upcoming maturities this week.
                  </div>
                )}
              </div>
            )}

            {/* Risk Hub */}
            {activeTab === 'risk' && (
              <div className="panel-card">
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                  <button className={`btn ${subTab === 'pending-kyc' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }} onClick={() => setSubTab('pending-kyc')}>Pending KYC</button>
                  <button className={`btn ${subTab === 'suspended' ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }} onClick={() => setSubTab('suspended')}>Suspended Accounts</button>
                </div>
                {subTab === 'pending-kyc' && (
                  <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px', color: '#71717a' }}>
                    <ShieldCheck style={{ width: '32px', height: '32px', margin: '0 auto 12px', color: '#a1a1aa' }} />
                    No pending KYC requests at the moment.
                  </div>
                )}
                {subTab === 'suspended' && (
                  <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px', color: '#71717a' }}>
                    All accounts are in good standing.
                  </div>
                )}
              </div>
            )}

            {/* Disputes Hub */}
            {activeTab === 'disputes' && (
              <div className="panel-card">
                <div className="panel-title">Active Disputes</div>
                <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px', color: '#71717a' }}>
                  <Scale style={{ width: '32px', height: '32px', margin: '0 auto 12px', color: '#a1a1aa' }} />
                  Zero active disputes across the platform. Operations are running smoothly!
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '400px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Create Admin Role</h3>
              <X 
                style={{ cursor: 'pointer', width: '20px', height: '20px', color: '#71717a' }} 
                onClick={() => setShowCreateModal(false)}
              />
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Legal Entity Name</label>
                <input 
                  type="text" className="form-input" required 
                  value={newAdmin.legalName} onChange={e => setNewAdmin({...newAdmin, legalName: e.target.value})}
                  placeholder="e.g. SBI Operations"
                />
              </div>
              <div className="form-group">
                <label>Admin Name (Proprietor)</label>
                <input 
                  type="text" className="form-input" required 
                  value={newAdmin.proprietor} onChange={e => setNewAdmin({...newAdmin, proprietor: e.target.value})}
                  placeholder="e.g. Ramesh Singh"
                />
              </div>
              <div className="form-group">
                <label>Bank Affiliation</label>
                <input 
                  type="text" className="form-input" required 
                  value={newAdmin.bankName} onChange={e => setNewAdmin({...newAdmin, bankName: e.target.value})}
                  placeholder="e.g. State Bank of India"
                />
              </div>
              <div className="form-group">
                <label>Phone Number (Login ID)</label>
                <input 
                  type="tel" className="form-input" required pattern="[0-9]{10}"
                  value={newAdmin.phone} onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})}
                  placeholder="e.g. 7777777777"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', background: 'var(--steampunk-gold)', color: 'var(--primary-foreground)' }}>
                Provision Admin Account
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Selected Transaction Deep-Dive Modal */}
      {selectedTxn && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', margin: 0, padding: '32px', position: 'relative' }}>
            <X 
              style={{ position: 'absolute', top: '24px', right: '24px', cursor: 'pointer', color: '#71717a' }} 
              onClick={() => setSelectedTxn(null)}
            />
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--steampunk-gold)' }}>Transaction Master View</h2>
            <div style={{ fontSize: '14px', color: '#71717a', marginBottom: '24px' }}>ID: {selectedTxn.id}</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ padding: '16px', background: '#f4f4f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '8px' }}>Supplier</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedTxn.supplier}</div>
              </div>
              <div style={{ padding: '16px', background: '#f4f4f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '8px' }}>Buyer</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedTxn.buyer}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Lifecycle Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '12px', borderLeft: '2px solid var(--steampunk-gold)', paddingLeft: '20px', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--steampunk-gold)' }}></div>
                <div style={{ fontWeight: '600' }}>{selectedTxn.docs?.isManual ? 'Invoice Uploaded Manually' : 'Invoice Generated'}</div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>Amount: {selectedTxn.tradeMode === 'global' ? '$' : '₹'}{selectedTxn.amount.toLocaleString()}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--steampunk-gold)' }}></div>
                <div style={{ fontWeight: '600' }}>Financier Approval ({selectedTxn.financierBank || 'N/A'})</div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>{selectedTxn.docs?.isManual ? 'Manual documents verified' : 'System auto-verified documents'}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#09090b', outline: '2px solid var(--steampunk-gold)' }}></div>
                <div style={{ fontWeight: '600', color: 'var(--steampunk-gold)' }}>Current Status: {selectedTxn.status}</div>
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => handleAction('Reverse Transaction', selectedTxn.id)}>Force Reverse</button>
              <button className="btn btn-primary" onClick={() => handleAction('Force Settle', selectedTxn.id)}>Force Settle</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Entity Modal */}
      {suspendEntity && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '400px', margin: 0 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#b91c1c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle style={{ width: '20px', height: '20px' }} /> Suspend Account
            </h3>
            <p style={{ fontSize: '13px', color: '#3f3f46', marginBottom: '16px' }}>
              You are about to suspend <strong>{suspendEntity}</strong>. This will instantly revoke their ability to create or accept trades.
            </p>
            <form onSubmit={handleSuspend}>
              <div className="form-group">
                <label>Reason for Suspension</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  required
                  placeholder="e.g., Suspicious KYC activity"
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSuspendEntity(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}>Confirm Suspend</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
