import React, { useState, useEffect } from 'react';
import { X, FileText, Send, Printer, FileSignature, MapPin, CheckCircle2, XCircle, Minus, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserInvoiceTemplate } from './UserInvoiceTemplate';
import { UserPOTemplate } from './UserPOTemplate';

export const DocumentGeneratorModal = ({ config, onClose }) => {
  const { tradeMode, handleRaisePO, handleDispatch, handleGenerateBill, handleConfirmStock, handleRejectPR } = useAppContext();
  const { txn, docType, prefill } = config; // docType: 'pr', 'po', 'challan', 'invoice'

  // Editable Form State
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReasonModal, setRejectReasonModal] = useState('');
  const [notes, setNotes] = useState(prefill?.notes || '');
  const [editableItems, setEditableItems] = useState(
    (txn.items || []).map(item => ({ ...item }))
  );
  const [terms, setTerms] = useState(
    docType === 'pr' ? '1. This is a Purchase Request.\n2. Goods must match specs.' :
    docType === 'po' ? '1. Goods received subject to quality inspection.\n2. Quantities reflect accepted goods only.' :
    docType === 'invoice' ? (tradeMode === 'global' ? '1. Payment due within 60 days via LC/SWIFT.\n2. Subject to international trade jurisdiction.' : '1. Payment due within 60 days.\n2. Subject to Indian jurisdiction.') :
    '1. Goods received in good condition.'
  );

  const currency = tradeMode === 'global' ? '$' : '₹';

  const title = docType === 'pr' ? 'Purchase Request' : docType === 'po' ? 'Purchase Order' : docType === 'challan' ? (tradeMode === 'global' ? 'Bill of Lading' : 'Delivery Challan') : (tradeMode === 'global' ? 'Commercial Invoice' : 'Bill of Supply (Invoice)');
  const docId = docType === 'pr' ? txn.id : docType === 'po' ? txn.id.replace('PR', 'PO').replace('TXN', 'PO') : docType === 'challan' ? (tradeMode === 'global' ? txn.id.replace('PR', 'BL').replace('PO', 'BL').replace('TXN', 'BL') : txn.id.replace('PR', 'DC').replace('PO', 'DC').replace('TXN', 'DC')) : txn.id.replace('PO', 'INV').replace('PR', 'INV').replace('TXN', 'INV');

  const editableAmount = editableItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const removeItem = (indexToRemove) => {
    setEditableItems(editableItems.filter((_, idx) => idx !== indexToRemove));
  };

  const updateItemQty = (idx, delta) => {
    setEditableItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const newQty = Math.max(0, (item.quantity || 0) + delta);
      return { ...item, quantity: newQty, amount: newQty * (item.unitPrice || 0) };
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (docType === 'po') {
      const validItems = editableItems.filter(item => item.quantity > 0);
      if (validItems.length === 0) {
        alert("You cannot issue a Purchase Order with zero items or zero quantities.");
        return;
      }
      const finalAmount = validItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      handleRaisePO(txn.id, validItems, finalAmount);
    } else if (docType === 'challan') {
      handleDispatch(txn.id, prefill.vehicleNo, prefill.paymentMode, prefill.resolvedBank, null, null);
    } else if (docType === 'invoice') {
      handleGenerateBill(txn.id);
    }
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content" style={{ width: '95vw', maxWidth: '1200px', height: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '16px' }}>
            <FileSignature style={{ color: 'var(--steampunk-gold)' }} />
            {config.readonly ? 'View' : 'Generate'} {title}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Split View Container */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Left: Form Inputs */}
          <div style={{ width: '380px', borderRight: '1px solid #e4e4e7', background: '#ffffff', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {config.readonly && docType === 'pr' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#18181b' }}>Review Purchase Request</div>
                <p style={{ fontSize: '13px', color: '#71717a', lineHeight: '1.5' }}>
                  Please carefully review the items, quantities, and pricing in the document generated by the buyer. 
                  Once verified, you can confirm stock to issue a Purchase Order.
                </p>
                {!rejectMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                    <button type="button" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '14px', background: '#166534', border: 'none', color: '#fff' }} onClick={() => { handleConfirmStock(txn.id); onClose(); }}>
                      <CheckCircle2 size={18} style={{marginRight: '8px'}} /> Confirm Stock
                    </button>
                    <button type="button" className="btn btn-secondary" style={{ width: '100%', height: '48px', fontSize: '14px', color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => setRejectMode(true)}>
                      <XCircle size={18} style={{marginRight: '8px'}} /> Reject Request
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                    <textarea className="form-input" rows="3" placeholder="Reason for rejection..." value={rejectReasonModal} onChange={e => setRejectReasonModal(e.target.value)} required />
                    <button type="button" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '14px' }} onClick={() => { if(!rejectReasonModal){ alert('Provide a reason'); return; } handleRejectPR(txn.id, rejectReasonModal); onClose(); }}>
                      Submit Rejection
                    </button>
                    <button type="button" className="btn btn-secondary" style={{ width: '100%', height: '48px', fontSize: '14px' }} onClick={() => setRejectMode(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : config.readonly ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#18181b' }}>Document Viewer</div>
                <p style={{ fontSize: '13px', color: '#71717a', lineHeight: '1.5' }}>
                  This document has been locked and digitally signed. It is available here for your records.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" style={{ width: '100%', height: '48px', fontSize: '14px' }} onClick={() => window.print()}>
                    <Printer size={18} style={{marginRight: '8px'}} /> Print Document
                  </button>
                  <button type="button" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '14px' }} onClick={onClose}>
                    Close Viewer
                  </button>
                </div>
              </div>
            ) : (
            <form id="doc-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              <div className="form-group">
                <label>Document Date</label>
                <input type="date" className="form-input" value={docDate} onChange={(e) => setDocDate(e.target.value)} required />
              </div>

              {/* PO: Order Correction Controls */}
              {docType === 'po' && (
                <div className="form-group">
                  <label style={{ fontWeight: '600', color: '#166534' }}>Order Correction (Adjust Accepted Qty)</label>
                  <p style={{ fontSize: '11px', color: '#71717a', margin: '4px 0 8px 0' }}>
                    Reduce quantity or remove items that were damaged or not received.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {editableItems.map((item, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '8px 10px' }}>
                        <div style={{ fontWeight: '600', fontSize: '12px', marginBottom: '6px' }}>{item.variety}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button type="button" onClick={() => updateItemQty(idx, -50)} style={{ background: '#e4e4e7', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>−</button>
                            <span style={{ fontWeight: '700', minWidth: '60px', textAlign: 'center', fontSize: '13px' }}>{item.quantity} {item.unit}</span>
                            <button type="button" onClick={() => updateItemQty(idx, 50)} style={{ background: '#e4e4e7', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>+</button>
                          </div>
                          <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', fontSize: '11px' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', padding: '8px', background: '#f0fdf4', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <strong>Accepted Total:</strong>
                    <strong style={{ color: '#166534' }}>{currency}{editableAmount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Additional Notes / Remarks</label>
                <textarea className="form-input" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter any extra instructions..." />
              </div>

              <div className="form-group">
                <label>Terms & Conditions</label>
                <textarea className="form-input" rows="4" value={terms} onChange={(e) => setTerms(e.target.value)} required />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '15px' }}>
                  <Send size={18} /> Issue {title}
                </button>
                <p style={{ fontSize: '11px', color: '#71717a', textAlign: 'center', marginTop: '12px' }}>
                  This will digitally sign and lock the document, making it visible to the counterparty.
                </p>
              </div>
            </form>
            )}
          </div>

          {/* Right: Live Preview Template */}
          <div style={{ flex: 1, background: '#f1f5f9', padding: '24px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            
            {docType === 'po' || docType === 'pr' ? (
              <UserPOTemplate 
                txn={txn} 
                editableItems={editableItems} 
                docDate={docDate} 
                docId={docId} 
              />
            ) : docType === 'invoice' || docType === 'challan' ? (
              <UserInvoiceTemplate 
                txn={txn} 
                editableItems={editableItems} 
                docDate={docDate} 
                docId={docId} 
                docType={docType} 
              />
            ) : (
              <div style={{ 
                width: '210mm', minHeight: '297mm', background: '#ffffff', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '40px',
                fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#000000'
              }}>
                
                {/* Document Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
                  <div>
                    <img src="/assets/miledeep_logo.svg" alt="Miledeep" style={{ width: '140px', marginBottom: '12px' }} />
                    <div style={{ fontSize: '10px', color: '#52525b', maxWidth: '200px' }}>
                      Authorized Digital Ecosystem for Aqua Trade Finance
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {title}
                    </h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                      <div><strong>Doc Ref No:</strong> {docId}</div>
                      <div><strong>Date:</strong> {docDate}</div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', borderBottom: '1px solid #e4e4e7', paddingBottom: '4px', marginBottom: '8px' }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Consignor / Supplier
                    </div>
                    <strong>{txn.supplier}</strong><br/>
                    <span style={{ color: '#52525b' }}>
                      GSTM/ID: 29AABCU9603R1ZX<br/>
                      {tradeMode === 'global' ? 'Marine Exports Park, Visakhapatnam' : 'Aqua Park, Bhimavaram, AP'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', borderBottom: '1px solid #e4e4e7', paddingBottom: '4px', marginBottom: '8px' }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Consignee / Buyer
                    </div>
                    <strong>{txn.buyer}</strong><br/>
                    <span style={{ color: '#52525b' }}>
                      GSTM/ID: 33BBDCD8483J1ZQ<br/>
                      {tradeMode === 'global' ? 'Port Terminal, Dubai, UAE' : 'Industrial Estate, Chennai, TN'}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ background: '#f4f4f5', borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '700' }}>S.No</th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '700' }}>Description of Goods</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '700' }}>HSN</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700' }}>Qty</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700' }}>Rate</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableItems.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #e4e4e7' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #e4e4e7' }}>
                          <strong>{item.variety}</strong><br/>
                          <span style={{ fontSize: '10px', color: '#52525b' }}>Size/Count: {item.count}</span>
                        </td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #e4e4e7', textAlign: 'center' }}>030617</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #e4e4e7', textAlign: 'right' }}>
                          {item.quantity} <span style={{ fontSize: '10px' }}>{item.unit}</span>
                        </td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #e4e4e7', textAlign: 'right' }}>
                          {currency}{item.unitPrice?.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #e4e4e7', textAlign: 'right', fontWeight: '600' }}>
                          {currency}{item.amount?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <div style={{ width: '280px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid #e4e4e7' }}>
                      <span>Subtotal:</span>
                      <strong>{currency}{editableAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '2px solid #000', fontSize: '14px' }}>
                      <strong>Grand Total:</strong>
                      <strong style={{ color: 'var(--steampunk-gold)' }}>
                        {currency}{editableAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms */}
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div style={{ flex: 2 }}>
                    {notes && (
                      <div style={{ marginBottom: '16px' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Remarks:</strong>
                        <div style={{ color: '#52525b', whiteSpace: 'pre-wrap' }}>{notes}</div>
                      </div>
                    )}
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>Terms & Conditions:</strong>
                      <div style={{ color: '#52525b', whiteSpace: 'pre-wrap', fontSize: '10px' }}>{terms}</div>
                    </div>
                  </div>
                  
                  {/* Signatures */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '40px' }}>
                    <div style={{ width: '100%', borderBottom: '1px solid #000', marginBottom: '8px' }}></div>
                    <strong>Authorized Signatory</strong>
                    <span style={{ fontSize: '10px', color: '#52525b' }}>Digitally Signed by MBD</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
