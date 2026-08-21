import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';

export const IncomingRequestsTab = () => {
  const { transactions, handleConfirmStock, handleRejectPR, tradeMode, setDocGeneratorConfig, setSelectedTxn } = useAppContext();
  const currency = tradeMode === 'global' ? '$' : '₹';

  const incomingPRs = transactions.filter(t => t.status === 'PR Sent');

  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const renderItems = (items) => {
    if (!items || items.length === 0) return 'No items';
    return (
      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#3f3f46' }}>
        {items.map((i, idx) => (
          <li key={idx}>{i.variety} - {i.quantity}{i.unit} @ {currency}{i.unitPrice}</li>
        ))}
      </ul>
    );
  };

  const submitReject = () => {
    if (!rejectReason) {
      alert("Please provide a reason for rejection.");
      return;
    }
    handleRejectPR(rejectingId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="panel-card">
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#0284c7" />
          Incoming Purchase Requests
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Buyer</th>
                <th>Requested Items</th>
                <th>Total Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomingPRs.length > 0 ? (
                incomingPRs.map(t => (
                  <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                    <td><strong>{t.id}</strong></td>
                    <td>{t.buyer}</td>
                    <td>{renderItems(t.items)}</td>
                    <td><strong>{currency}{t.amount.toLocaleString('en-IN')}</strong></td>
                    <td>
                      {rejectingId === t.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            style={{ height: '26px', fontSize: '11px', width: '150px' }} 
                            placeholder="Reason for rejection..." 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                          <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px' }} onClick={submitReject}>Confirm</button>
                          <button className="btn" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: 'none', border: 'none', color: '#71717a' }} onClick={() => setRejectingId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }} onClick={() => setDocGeneratorConfig({ txn: t, docType: 'pr', readonly: true })}>
                            <FileText size={14} /> View Request
                          </button>
                          <button className="btn btn-primary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: '#166534', color: '#ffffff', border: 'none' }} onClick={() => handleConfirmStock(t.id)}>
                            <CheckCircle2 size={14} /> Confirm
                          </button>
                          <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => setRejectingId(t.id)}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                    No pending purchase requests from buyers.
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
