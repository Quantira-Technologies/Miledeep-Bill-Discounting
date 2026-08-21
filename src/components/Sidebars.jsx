import React from 'react';
import { LayoutDashboard, PlusCircle, FileText, Send, Folder, Activity, ShieldCheck, Building, CheckCircle2, Landmark, Truck } from 'lucide-react';

export const SupplierSidebar = ({ activeTab, setActiveTab, setActiveFilter, supplierForm, setScreen }) => {
  return (
    <aside className="sidebar">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', paddingLeft: '8px' }}>
          <img src="/assets/miledeep_logo.svg" alt="Miledeep" style={{ width: '120px' }} />
        </div>
        
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setActiveFilter('All'); }}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </li>
          <li className={`sidebar-item ${activeTab === 'incoming_requests' ? 'active' : ''}`} onClick={() => setActiveTab('incoming_requests')}>
            <CheckCircle2 />
            <span>Incoming PRs</span>
          </li>
          <li className={`sidebar-item ${activeTab === 'newTrans' ? 'active' : ''}`} onClick={() => setActiveTab('newTrans')}>
            <Truck />
            <span>Dispatch (Challan)</span>
          </li>
          <li className={`sidebar-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => { setActiveTab('transactions'); setActiveFilter('All'); }}>
            <FileText />
            <span>My Transactions</span>
          </li>
          <li className={`sidebar-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
            <Send />
            <span>Discount Requests</span>
          </li>
          <li className={`sidebar-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
            <Folder />
            <span>Documents</span>
          </li>
          <li className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Activity />
            <span>Settings</span>
          </li>
        </ul>
      </div>

      <div style={{ borderTop: '1px solid var(--gold-shade-80)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ paddingLeft: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gold-tint-10)' }}>{supplierForm?.legalName || 'Supplier'}</div>
          <div style={{ fontSize: '10px', color: 'var(--gold-tint-40)', marginTop: '2px' }}>GST: {supplierForm?.gstin || 'N/A'}</div>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%', height: '30px', fontSize: '11px' }} onClick={() => setScreen('login')}>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export const BuyerSidebar = ({ buyerActiveTab, setBuyerActiveTab, buyerForm, setScreen }) => {
  return (
    <aside className="sidebar">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', paddingLeft: '8px' }}>
          <img src="/assets/miledeep_logo.svg" alt="Miledeep" style={{ width: '120px' }} />
        </div>
        
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${buyerActiveTab === 'dashboard' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('dashboard')}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </li>
          <li className={`sidebar-item ${buyerActiveTab === 'create_request' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('create_request')}>
            <PlusCircle />
            <span>Create PR (Cart)</span>
          </li>
          <li className={`sidebar-item ${buyerActiveTab === 'approvals' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('approvals')}>
            <CheckCircle2 />
            <span>Confirmations & Deliveries</span>
          </li>
          <li className={`sidebar-item ${buyerActiveTab === 'payables' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('payables')}>
            <Landmark />
            <span>Payables Ledger</span>
          </li>
          <li className={`sidebar-item ${buyerActiveTab === 'purchase_orders' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('purchase_orders')}>
            <FileText />
            <span>Purchase Orders (POs)</span>
          </li>
          <li className={`sidebar-item ${buyerActiveTab === 'documents' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('documents')}>
            <Folder />
            <span>Business Documents</span>
          </li>
          <li className={`sidebar-item ${buyerActiveTab === 'settings' ? 'active' : ''}`} onClick={() => setBuyerActiveTab('settings')}>
            <Activity />
            <span>Plant Operations</span>
          </li>
        </ul>
      </div>

      <div style={{ borderTop: '1px solid var(--gold-shade-80)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ paddingLeft: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gold-tint-10)' }}>{buyerForm?.corporateName || 'Buyer'}</div>
          <div style={{ fontSize: '10px', color: 'var(--gold-tint-40)', marginTop: '2px' }}>ap@suryamitra.in</div>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%', height: '30px', fontSize: '11px' }} onClick={() => setScreen('login')}>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
