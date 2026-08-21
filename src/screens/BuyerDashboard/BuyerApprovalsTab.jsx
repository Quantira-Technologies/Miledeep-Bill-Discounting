import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Ship, Truck, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';

export const BuyerApprovalsTab = () => {
  const { tradeMode, transactions, setDocGeneratorConfig, handleConfirmDelivery, handleRequestDispatch, handleRaisePO, setSelectedTxn } = useAppContext();
  const currency = tradeMode === 'global' ? '$' : '₹';

  // PRs that the supplier has confirmed, ready for Buyer to raise PO
  const pendingConfirmations = transactions.filter(t => t.status === 'Stock Confirmed');
  
  // Dispatched POs that are in transit, ready for Buyer to confirm delivery
  const incomingShipments = transactions.filter(t => t.status === 'Dispatched');

  const renderItems = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map(i => `${i.variety} (${i.quantity}${i.unit})`).join(', ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ── Pending Supplier Confirmations (Request Dispatch) ── */}
      <div className="panel-card">
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="#92400e" />
          Confirmed Requests (Ready for Dispatch Request)
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Supplier</th>
                <th>Items Requested</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingConfirmations.length > 0 ? (
                pendingConfirmations.map(t => (
                  <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                    <td><strong>{t.id}</strong></td>
                    <td>{t.supplier}</td>
                    <td>{renderItems(t.items)}</td>
                    <td><strong>{currency}{t.amount.toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span style={{ color: '#92400e', fontWeight: '600', fontSize: '11px', background: '#fefce8', padding: '2px 8px', borderRadius: '12px' }}>
                        Supplier Confirmed Stock
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: '#1e40af', color: '#ffffff', border: 'none' }} onClick={(e) => { e.stopPropagation(); handleRequestDispatch(t.id); }}>
                        Confirm & Request Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                    No confirmed purchase requests awaiting PO generation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* ── Incoming Shipments (Verify Goods & Raise PO) ── */}
      <div className="panel-card">
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PackageCheck size={18} color="#166534" />
          Incoming Deliveries (Awaiting Goods Verification & PO Generation)
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PO ID</th>
                <th>Supplier</th>
                <th>Items Dispatched</th>
                <th>Total Value</th>
                <th>Transit Tracking</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incomingShipments.length > 0 ? (
                incomingShipments.map(t => (
                  <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                    <td><strong>{t.id}</strong></td>
                    <td>{t.supplier}</td>
                    <td>{renderItems(t.items)}</td>
                    <td><strong>{currency}{t.amount.toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span style={{ color: '#166534', fontWeight: '600', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {tradeMode === 'global' ? <><Ship size={14} /> B/L Issued (In Transit)</> : <><Truck size={14} /> Transit Active (Toll Passed)</>}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: 'var(--steampunk-gold)', color: '#000000', border: 'none' }} onClick={() => setDocGeneratorConfig({ txn: t, docType: 'po' })}>
                        Verify Goods & Raise PO
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                    No incoming shipments awaiting verification.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
