import React from 'react';
import { useAppContext } from '../../context/AppContext';

export const TransactionsLedgerTab = ({ displayedTxns }) => {
  const {
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    currentPage, setCurrentPage,
    setSelectedTxn, setWithdrawTxn, setDocGeneratorConfig, handleGenerateBill
  } = useAppContext();

  return (
    <div className="panel-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div className="panel-title" style={{ margin: 0 }}>My Aquaculture Transactions Ledger</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search ID, Buyer..." 
            style={{ height: '30px', width: '160px', fontSize: '11px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '4px', border: '1px solid #e4e4e7', borderRadius: '4px', padding: '2px', background: 'var(--background)' }}>
            {['All', 'Dispatched', 'Buyer Confirmed', 'Disbursed'].map(f => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f)} 
                style={{
                  border: 'none',
                  background: activeFilter === f ? 'var(--foreground)' : 'none',
                  color: activeFilter === f ? '#ffffff' : '#71717a',
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Request/PO ID</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Value</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedTxns.slice((currentPage - 1) * 5, currentPage * 5).map(t => {
              const renderItems = (items) => {
                if (!items || items.length === 0) return 'No items';
                return items.map(i => `${i.variety} (${i.quantity}${i.unit})`).join(', ');
              };
              
              return (
              <tr key={t.id} onClick={() => setSelectedTxn(t)} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background=''}>
                <td><strong>{t.id}</strong></td>
                <td>{t.buyer}</td>
                <td style={{ fontSize: '11px' }}>{renderItems(t.items)}</td>
                <td><strong>₹{t.amount.toLocaleString('en-IN')}</strong></td>
                <td>{t.dueDate}</td>
                <td>
                  <span style={{
                    display: 'inline-flex',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: t.status === 'Dispatched' ? '#eff6ff' : (t.status === 'Delivered' ? '#fcf6e4' : '#f0fdf4'),
                    color: t.status === 'Dispatched' ? '#1e40af' : (t.status === 'Delivered' ? '#854d0e' : '#166534')
                  }}>{t.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px' }} onClick={() => setSelectedTxn(t)}>
                      Details
                    </button>
                    {(t.status === 'PO Issued' || t.status === 'Buyer Confirmed') && !t.docs?.billOfSupply && (
                      <button className="btn btn-primary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: 'var(--steampunk-gold)', color: '#000000', border: 'none' }} onClick={() => handleGenerateBill(t.id)}>
                        Generate Bill
                      </button>
                    )}
                    {t.docs?.billOfSupply && (
                      <button className="btn btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }} onClick={() => setDocGeneratorConfig({ txn: t, docType: 'invoice', readonly: true })}>
                        View Invoice
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '11px', color: '#71717a' }}>
        <div>
          Showing {displayedTxns.length > 0 ? (currentPage - 1) * 5 + 1 : 0} to {Math.min(currentPage * 5, displayedTxns.length)} of {displayedTxns.length} entries
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
            disabled={currentPage * 5 >= displayedTxns.length}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
