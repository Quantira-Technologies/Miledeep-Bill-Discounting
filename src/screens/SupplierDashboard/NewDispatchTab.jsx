import React, { useState } from 'react';
import { Calculator, UploadCloud, ClipboardList, Briefcase, Truck, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const NewDispatchTab = () => {
  const {
    tradeMode,
    transactions,
    handleDispatch,
    setSelectedTxn,
    setDocGeneratorConfig,
    setShowChallanPreview
  } = useAppContext();

  const [selectedPO, setSelectedPO] = useState(null);
  
  // Logistics form state
  const [vehicleType, setVehicleType] = useState('reefer');
  const [vehicleNo, setVehicleNo] = useState('');
  const [fastagId, setFastagId] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  // Payment agreement state
  const [paymentMode, setPaymentMode] = useState('nbfc');

  const pendingPOs = transactions.filter(t => t.status === 'Stock Confirmed' || t.status === 'PO Issued' || t.status === 'Dispatch Requested');
  const currency = tradeMode === 'global' ? '$' : '₹';

  const submitDispatch = (e) => {
    e.preventDefault();
    if (!selectedPO) return;
    
    // Resolve Bank based on variety of first item and payment mode
    let resolvedBank = null;
    if (paymentMode === 'nbfc') {
      const variety = selectedPO.items[0]?.variety?.toLowerCase() || '';
      const isShrimp = variety.includes('shrimp') || variety.includes('vannamei');
      const isPrawn = variety.includes('prawn') || variety.includes('scampi');
      resolvedBank = isShrimp ? 'HDFC Bank' : isPrawn ? 'Axis Bank' : 'HDFC Bank';
    } else if (paymentMode === 'drip') {
      resolvedBank = 'Drip Capital Factoring';
    } else if (paymentMode === 'global_govt') {
      resolvedBank = 'Global Govt Bank (LC)';
    }

    handleDispatch(selectedPO.id, vehicleNo, paymentMode, resolvedBank, null, null);
    
    setSelectedPO(null);
    setVehicleNo('');
    setFastagId('');
    setDeliveryTime('');
  };

  const renderItems = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map(i => `${i.variety} (${i.quantity}${i.unit})`).join(', ');
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      
      <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Step 1: Select PO */}
        <div className="panel-card" style={{ margin: 0 }}>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            Step 1: Select Confirmed PR to Dispatch
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Buyer</th>
                  <th>Items</th>
                  <th>Total Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPOs.length > 0 ? (
                  pendingPOs.map(t => (
                    <tr 
                      key={t.id} 
                      style={{ background: selectedPO?.id === t.id ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                      onClick={() => setSelectedTxn(t)}
                      onMouseEnter={e => { if (selectedPO?.id !== t.id) e.currentTarget.style.background='#f8fafc'; }}
                      onMouseLeave={e => { if (selectedPO?.id !== t.id) e.currentTarget.style.background='transparent'; }}
                    >
                      <td><strong>{t.id}</strong></td>
                      <td>{t.buyer}</td>
                      <td style={{ fontSize: '11px' }}>{renderItems(t.items)}</td>
                      <td><strong>{currency}{t.amount.toLocaleString('en-IN')}</strong></td>
                      <td onClick={e => e.stopPropagation()}>
                        <button 
                          className="btn btn-primary" 
                          style={{ height: '26px', padding: '0 8px', fontSize: '11px', background: selectedPO?.id === t.id ? '#166534' : 'var(--foreground)', color: '#ffffff', border: 'none' }} 
                          onClick={() => setSelectedPO(t)}
                        >
                          {selectedPO?.id === t.id ? 'Selected ✓' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                      No Confirmed Purchase Requests ready for dispatch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2: Logistics & Payment Agreement */}
        {selectedPO && (
          <form className="panel-card" style={{ margin: 0 }} onSubmit={submitDispatch}>
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} />
              Step 2: Logistics & Dispatch Details
            </div>
            
            <div className="form-grid" style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select className="form-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="reefer">Refrigerated Truck (Reefer)</option>
                  <option value="container">Insulated Container (20ft)</option>
                  <option value="insulated">Insulated Van</option>
                  <option value="open">Open Truck (Not Recommended)</option>
                </select>
              </div>
              <div className="form-group">
                <label>{tradeMode === 'global' ? 'Vessel Name / Container ID' : 'Vehicle Registration No.'}</label>
                <input type="text" className="form-input" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} required placeholder={tradeMode === 'global' ? 'e.g. MSC ANNA / MSCU1234567' : 'e.g. AP-16-TJ-4829'} />
              </div>
              <div className="form-group">
                <label>{tradeMode === 'global' ? 'Voyage No / Booking Ref' : 'FASTag ID (Auto-Toll Tracking)'}</label>
                <input type="text" className="form-input" value={fastagId} onChange={(e) => setFastagId(e.target.value)} placeholder={tradeMode === 'global' ? 'e.g. VOY-9283' : 'e.g. 3489201928'} />
              </div>
              <div className="form-group">
                <label>Estimated Transit Time ({tradeMode === 'global' ? 'Days' : 'Hours'})</label>
                <input type="number" className="form-input" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required placeholder={tradeMode === 'global' ? 'e.g. 30' : 'e.g. 12'} />
              </div>
            </div>

            <div style={{ border: '2px solid #000000', borderRadius: '6px', padding: '14px', background: 'var(--background)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <ClipboardList size={14} /> Pre-Dispatch Payment Mode Agreement
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {tradeMode === 'global' && (
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px',
                    border: `2px solid ${paymentMode === 'drip' ? 'var(--steampunk-gold)' : '#e4e4e7'}`,
                    borderRadius: '6px', cursor: 'pointer',
                    background: paymentMode === 'drip' ? '#f4f4f5' : '#ffffff'
                  }}>
                    <input type="radio" name="paymentMode" value="drip" checked={paymentMode === 'drip'} onChange={() => setPaymentMode('drip')} style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700' }}>Drip Capital Factoring</div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Drip Capital pays you <strong>80% immediately</strong>. Buyer repays Drip at maturity.</div>
                    </div>
                  </label>
                )}

                <label style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px',
                  border: `2px solid ${paymentMode === 'nbfc' ? 'var(--steampunk-gold)' : '#e4e4e7'}`,
                  borderRadius: '6px', cursor: 'pointer',
                  background: paymentMode === 'nbfc' ? '#f4f4f5' : '#ffffff'
                }}>
                  <input type="radio" name="paymentMode" value="nbfc" checked={paymentMode === 'nbfc'} onChange={() => setPaymentMode('nbfc')} style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700' }}>NBFC Bill Discounting</div>
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Bank pays you <strong>80% immediately</strong>. Buyer repays bank at maturity.</div>
                  </div>
                </label>

                {tradeMode === 'global' && (
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px',
                    border: `2px solid ${paymentMode === 'global_govt' ? 'var(--steampunk-gold)' : '#e4e4e7'}`,
                    borderRadius: '6px', cursor: 'pointer',
                    background: paymentMode === 'global_govt' ? '#f4f4f5' : '#ffffff'
                  }}>
                    <input type="radio" name="paymentMode" value="global_govt" checked={paymentMode === 'global_govt'} onChange={() => setPaymentMode('global_govt')} style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700' }}>Global Govt Bank (LC)</div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Requires Verification of LC. Bank processes payment upon LC confirmation.</div>
                    </div>
                  </label>
                )}

                <label style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px',
                  border: `2px solid ${paymentMode === 'direct' ? 'var(--steampunk-gold)' : '#e4e4e7'}`,
                  borderRadius: '6px', cursor: 'pointer',
                  background: paymentMode === 'direct' ? '#f4f4f5' : '#ffffff'
                }}>
                  <input type="radio" name="paymentMode" value="direct" checked={paymentMode === 'direct'} onChange={() => setPaymentMode('direct')} style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700' }}>Direct Trade Credit</div>
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Full amount receivable at maturity. You bear credit risk.</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '14px', marginTop: '20px' }}>
              {tradeMode === 'global' ? 'Generate Bill of Lading & Dispatch' : 'Generate Delivery Challan & Dispatch'}
            </button>
          </form>
        )}
      </div>

      {/* Side panel for estimation */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {selectedPO ? (
          <div className="calc-side-card" style={{ border: '2px solid #000000', padding: '16px' }}>
            <h4 style={{ fontSize: '10px', fontWeight: '700', color: 'var(--steampunk-gold)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator style={{ width: '13px', height: '13px' }} />
              Payout Estimate
            </h4>
            {(() => {
              const inv = selectedPO.amount;
              const totalQty = selectedPO.items.reduce((sum, i) => sum + parseFloat(i.quantity || 0), 0);
              
              const iceCost = totalQty * 3;
              const logisticsBase = vehicleType === 'reefer' ? 12000 : vehicleType === 'container' ? 18000 : 8000;
              const fastagToll = 1450;
              const labourCost = Math.ceil(totalQty / 500) * 800;
              const packagingCost = totalQty * 5;
              const totalOps = iceCost + logisticsBase + fastagToll + labourCost + packagingCost;

              let netAfterOps = inv - totalOps;
              let deductions = [];
              let title = 'Net Receivable';

              if (paymentMode === 'nbfc' || paymentMode === 'drip') {
                const advance = inv * 0.80;
                const discountFee = inv * 0.02;
                netAfterOps = advance - discountFee - totalOps;
                deductions.push(['Advance (80%)', advance, true]);
                deductions.push(['Bank Discount Fee (2%)', -discountFee]);
                title = 'Net Cash In Hand';
              } else if (paymentMode === 'global_govt') {
                const lcProcessingFee = inv * 0.005;
                netAfterOps = inv - lcProcessingFee - totalOps;
                deductions.push(['LC Processing Fee (0.5%)', -lcProcessingFee]);
                title = 'Net (Upon LC Presentation)';
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#71717a' }}>Invoice Value</span>
                    <strong>{currency}{inv.toLocaleString('en-IN')}</strong>
                  </div>
                  {deductions.map(([label, val, isPositive], idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: isPositive ? '#71717a' : '#dc2626' }}>{label}</span>
                      <strong style={{ color: isPositive ? 'var(--steampunk-gold)' : '#dc2626' }}>{isPositive ? '' : ''}{currency}{Math.abs(val).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#dc2626' }}>Ops & Dispatch Costs</span>
                    <span style={{ color: '#dc2626' }}>-{currency}{totalOps.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9', fontWeight: '700' }}>
                    <span>{title}</span>
                    <span style={{ color: '#166534' }}>{currency}{netAfterOps.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="panel-card" style={{ padding: '24px', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
            Select a Purchase Order to view payout estimates.
          </div>
        )}
      </div>

    </div>
  );
};
