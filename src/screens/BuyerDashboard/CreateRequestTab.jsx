import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShoppingCart, Plus, Trash2, Send } from 'lucide-react';

export const CreateRequestTab = () => {
  const { handleCreatePR, personas, tradeMode, buyerActiveTab, setBuyerActiveTab } = useAppContext();
  
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState([
    { id: 1, variety: 'Vannamei Shrimp', count: '30 Count', quantity: 1000, unitPrice: 850 }
  ]);
  
  const suppliers = personas.filter(p => p.role === 'supplier');
  const currency = tradeMode === 'global' ? '$' : '₹';

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), variety: '', count: '', quantity: 0, unitPrice: 0 }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplier) {
      alert('Please select a supplier');
      return;
    }
    const cleanItems = items.map(item => ({
      variety: item.variety,
      count: item.count,
      quantity: parseFloat(item.quantity),
      unit: 'KG',
      unitPrice: parseFloat(item.unitPrice),
      amount: parseFloat(item.quantity) * parseFloat(item.unitPrice)
    }));
    handleCreatePR(selectedSupplier, cleanItems, totalAmount);
    setItems([{ id: Date.now(), variety: 'Vannamei Shrimp', count: '30 Count', quantity: 1000, unitPrice: 850 }]);
    setSelectedSupplier('');
    setBuyerActiveTab('approvals');
  };

  return (
    <div className="panel-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShoppingCart size={18} />
        Create Purchase Request (Cart)
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Select Supplier</label>
          <select 
            className="input-field" 
            value={selectedSupplier} 
            onChange={(e) => setSelectedSupplier(e.target.value)}
            required
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <option value="">-- Choose Supplier --</option>
            {suppliers.map(s => (
              <option key={s.phone} value={s.legalName}>{s.legalName} ({s.proprietor})</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#18181b' }}>Cart Items</h4>
            <button type="button" className="btn btn-secondary" onClick={handleAddItem} style={{ height: '30px', padding: '0 12px', fontSize: '11px' }}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead style={{ background: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Product / Variety</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Size / Count</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Quantity (KG)</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Unit Price ({currency})</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const lineTotal = (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0));
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px' }}>
                        <input type="text" className="input-field" style={{ height: '32px', fontSize: '12px', width: '100%' }} value={item.variety} onChange={(e) => handleChange(item.id, 'variety', e.target.value)} placeholder="e.g. Tiger Prawns" required />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type="text" className="input-field" style={{ height: '32px', fontSize: '12px', width: '100%' }} value={item.count} onChange={(e) => handleChange(item.id, 'count', e.target.value)} placeholder="e.g. 20 Count" required />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type="number" className="input-field" style={{ height: '32px', fontSize: '12px', width: '100%' }} value={item.quantity} onChange={(e) => handleChange(item.id, 'quantity', e.target.value)} required min="1" />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type="number" className="input-field" style={{ height: '32px', fontSize: '12px', width: '100%' }} value={item.unitPrice} onChange={(e) => handleChange(item.id, 'unitPrice', e.target.value)} required min="0.1" step="0.1" />
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600' }}>
                        {currency}{lineTotal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <button type="button" onClick={() => handleRemoveItem(item.id)} disabled={items.length === 1} style={{ background: 'none', border: 'none', cursor: items.length === 1 ? 'not-allowed' : 'pointer', color: items.length === 1 ? '#a1a1aa' : '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <div style={{ padding: '16px', background: '#fafafa', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px', borderTop: '1px solid #e4e4e7' }}>
              <div style={{ fontSize: '14px', color: '#71717a' }}>Estimated Total:</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#18181b' }}>{currency}{totalAmount.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', height: '40px', fontSize: '13px' }}>
            <Send size={16} /> Send Purchase Request
          </button>
        </div>
      </form>
    </div>
  );
};
