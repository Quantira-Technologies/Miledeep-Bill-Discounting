import React from 'react';

export const UserInvoiceTemplate = ({ txn, editableItems, docDate, docId, docType }) => {
  const isInvoice = docType === 'invoice';
  const title = isInvoice ? 'BILL OF SUPPLY' : 'DELIVERY CHALLAN/NOTE';
  const totalWeight = editableItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = editableItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <>
      <style>
        {`
          .doc-container {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 11px;
              color: #000;
              background: #fff;
              width: 210mm;
              min-height: 297mm;
              padding: 10mm 12mm;
              margin: 0 auto;
              position: relative;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .doc-container .doc-title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              text-decoration: underline;
              margin-bottom: 10px;
              letter-spacing: 1px;
          }
          .doc-container .header-row {
              display: flex;
              border: 1px solid #000;
              margin-bottom: 0;
          }
          .doc-container .header-left {
              width: 55%;
              border-right: 1px solid #000;
              padding: 6px 8px;
          }
          .doc-container .header-right {
              width: 45%;
              padding: 6px 8px;
          }
          .doc-container p { margin: 2px 0; line-height: 1.4; }
          .doc-container .firm-name { font-weight: bold; font-size: 13px; text-transform: uppercase; }
          .doc-container .billed-shipped { display: flex; border: 1px solid #000; border-top: none; }
          .doc-container .billed-box { width: 55%; border-right: 1px solid #000; padding: 6px 8px; }
          .doc-container .shipped-box { width: 45%; padding: 6px 8px; }
          .doc-container .section-label { font-weight: bold; }
          .doc-container .conditions { border: 1px solid #000; border-top: none; padding: 4px 8px; font-style: italic; }
          .doc-container .data-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; margin-top: 0; }
          .doc-container .data-table th, .doc-container .data-table td { border: 1px solid #000; padding: 4px 5px; text-align: center; vertical-align: middle; }
          .doc-container .data-table th { font-weight: bold; font-size: 10px; background: #fff; }
          .doc-container .data-table td { font-size: 11px; }
          .doc-container .text-left { text-align: left; }
          .doc-container .text-right { text-align: right; }
          .doc-container .total-row td { font-weight: bold; }
          .doc-container .tax-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
          .doc-container .tax-table td { border: 1px solid #000; padding: 4px 5px; text-align: center; }
          .doc-container .amount-words { border: 1px solid #000; border-top: none; display: flex; }
          .doc-container .amount-words .words { width: 75%; border-right: 1px solid #000; padding: 6px 8px; font-weight: bold; }
          .doc-container .amount-words .amount { width: 25%; padding: 6px 8px; text-align: right; font-weight: bold; font-size: 13px; }
          .doc-container .signature-section { border: 1px solid #000; border-top: none; display: flex; min-height: 80px; }
          .doc-container .signature-left { width: 75%; border-right: 1px solid #000; padding: 6px 8px; }
          .doc-container .signature-right { width: 25%; padding: 6px 8px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
          .doc-container .signature-right .for-firm { font-weight: bold; margin-bottom: 30px; text-align: center; text-transform: uppercase; }
          .doc-container .signature-right .proprietor { font-size: 10px; }
        `}
      </style>
      <div className="doc-container">
        <div className="doc-title">{title}</div>

        <div className="header-row">
            <div className="header-left">
                <p className="firm-name">{txn.supplier}</p>
                <p>Proprietor</p>
                <p><strong>Address:</strong></p>
                <p>Aqua Park, Bhimavaram, West Godavari Dist,</p>
                <p>Andhra Pradesh, Pincode -534201.</p>
            </div>
            <div className="header-right">
                <p><strong>{isInvoice ? 'Invoice No.' : 'D.C. No.'}</strong> {docId}</p>
                <p><strong>Dt:</strong> {docDate}</p>
                <p style={{ marginTop: '15px' }}><strong>Ref.No:</strong> {txn.id}</p>
            </div>
        </div>

        <div className="billed-shipped">
            <div className="billed-box">
                <p className="section-label">Billed To:</p>
                <p>{txn.buyer}</p>
                <p>Industrial Estate, Dirusumarru Road,</p>
                <p>Yannamadurru, Bhimavaram Mandal,</p>
                <p>A.P. Pincode - 534239.</p>
                <p style={{ marginTop: '5px' }}>GSTIN ID: 37AAJCS6258G1ZY State Code:37</p>
            </div>
            <div className="shipped-box">
                <p className="section-label">Shipped To:</p>
                <p>{txn.buyer}</p>
                <p>Industrial Estate, Dirusumarru Road,</p>
                <p>Yannamadurru, Bhimavaram Mandal,</p>
                <p>A.P. Pincode - 534239.</p>
                <p style={{ marginTop: '5px' }}>GSTIN ID: 37AAJCS6258G1ZY State Code:37</p>
            </div>
        </div>

        <div className="conditions">
            <p>Conditions, if any: Goods received subject to quality inspection.</p>
        </div>

        <table className="data-table">
            <thead>
                <tr>
                    <th style={{ width: '12%' }}>Variety</th>
                    <th style={{ width: '10%' }}>Count</th>
                    <th style={{ width: '10%' }}>HSN CODE</th>
                    <th style={{ width: '15%' }}>Weight in Kgs.</th>
                    <th style={{ width: '10%' }}>No. of Boxes</th>
                    <th style={{ width: '10%' }}>Rate</th>
                    <th style={{ width: '18%' }}>Total Amount Rs.</th>
                </tr>
            </thead>
            <tbody>
                {editableItems.map((item, idx) => (
                    <tr key={idx}>
                        <td className="text-left">{item.variety}</td>
                        <td>{item.count}</td>
                        <td>0306</td>
                        <td>{item.quantity?.toFixed(3)}</td>
                        <td></td>
                        <td>{item.unitPrice?.toFixed(2)}</td>
                        <td className="text-right">{item.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                ))}
                
                {Array.from({ length: Math.max(0, 4 - editableItems.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ height: '22px' }}>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                ))}
                
                <tr className="total-row">
                    <td className="text-left"><strong>Total</strong></td>
                    <td></td>
                    <td></td>
                    <td>{totalWeight.toFixed(3)}</td>
                    <td></td>
                    <td></td>
                    <td className="text-right">{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
            </tbody>
        </table>

        <table className="tax-table">
            <tbody>
                <tr>
                    <td style={{ width: '25%' }}></td>
                    <td style={{ width: '15%' }}>CGST</td>
                    <td style={{ width: '10%' }}>0%</td>
                    <td style={{ width: '25%' }}></td>
                    <td style={{ width: '25%' }}></td>
                </tr>
                <tr>
                    <td></td>
                    <td>SGST</td>
                    <td>0%</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td>/IGST</td>
                    <td>0%</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td>TDS</td>
                    <td>0%</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <div className="amount-words">
            <div className="words">Total Value (in words)</div>
            <div className="amount">{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="signature-section">
            <div className="signature-left"></div>
            <div className="signature-right">
                <p className="for-firm">For {txn.supplier}</p>
                <p className="proprietor">Proprietor</p>
            </div>
        </div>
      </div>
    </>
  );
};
