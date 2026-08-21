import React from 'react';

export const UserPOTemplate = ({ txn, editableItems, docDate, docId }) => {
  const totalAmount = editableItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <>
      <style>
        {`
          .po-container {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              color: #000;
              background: #fff;
              width: 210mm;
              min-height: 297mm;
              padding: 12mm 15mm;
              margin: 0 auto;
              position: relative;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .po-container .company-header {
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 10px;
          }
          .po-container .company-name {
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
          }
          .po-container .company-address {
              font-size: 11px;
              margin-top: 2px;
          }
          .po-container .doc-title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              text-decoration: underline;
              margin: 15px 0;
              letter-spacing: 2px;
          }
          .po-container .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              border: 1px solid #000;
              padding: 8px 10px;
          }
          .po-container .info-left, .po-container .info-right {
              width: 50%;
          }
          .po-container .info-right {
              text-align: right;
          }
          .po-container .info-row p, .po-container .party-section p, .po-container .farmer-section p {
              margin: 3px 0;
              line-height: 1.5;
          }
          .po-container .info-label {
              font-weight: bold;
          }
          .po-container .party-section {
              border: 1px solid #000;
              padding: 8px 10px;
              margin-bottom: 10px;
          }
          .po-container .farmer-section {
              display: flex;
              border: 1px solid #000;
              border-top: none;
              padding: 8px 10px;
              margin-bottom: 10px;
          }
          .po-container .farmer-left, .po-container .farmer-right {
              width: 50%;
          }
          .po-container .items-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #000;
              margin-bottom: 10px;
          }
          .po-container .items-table th, .po-container .items-table td {
              border: 1px solid #000;
              padding: 6px 8px;
              text-align: left;
          }
          .po-container .items-table th {
              font-weight: bold;
              background: #fff;
          }
          .po-container .right-align {
              text-align: right;
          }
          .po-container .total-row td {
              font-weight: bold;
          }
          .po-container .amount-words {
              border: 1px solid #000;
              border-top: none;
              padding: 8px 10px;
              margin-bottom: 20px;
          }
          .po-container .amount-words .label {
              font-weight: bold;
          }
          .po-container .footer-section {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
          }
          .po-container .footer-left {
              width: 40%;
          }
          .po-container .footer-right {
              width: 55%;
              text-align: right;
          }
          .po-container .footer-section p {
              margin: 3px 0;
              line-height: 1.5;
          }
          .po-container .signature-box {
              border: 1px solid #000;
              padding: 8px 10px;
              margin-top: 10px;
              min-height: 60px;
          }
          .po-container .signature-label {
              font-size: 10px;
              margin-top: 5px;
          }
          .po-container .stamp-area {
              border: 1px solid #000;
              padding: 8px 10px;
              margin-top: 10px;
              min-height: 80px;
              text-align: center;
          }
          .po-container .user-info {
              font-size: 11px;
              margin-top: 10px;
          }
        `}
      </style>

      <div className="po-container">

          <div className="company-header">
              <div className="company-name">{txn.buyer}</div>
              <div className="company-address">
                  Industrial Estate, Dirusumarru Road<br/>
                  Yanamadurru Village<br/>
                  Bhimavaram Mandal - 534239
              </div>
          </div>

          <div className="doc-title">PURCHASE ORDER</div>

          <div className="info-row">
              <div className="info-left">
                  <p><span className="info-label">No:</span> {docId}</p>
                  <p><span className="info-label">Ref:</span> {txn.id}</p>
              </div>
              <div className="info-right">
                  <p><span className="info-label">Dated:</span> {docDate}</p>
              </div>
          </div>

          <div className="party-section">
              <p><span className="info-label">Party's Name:</span> {txn.supplier}</p>
              <p>Aqua Park, Bhimavaram</p>
              <p>West Godavari District, Andhra Pradesh</p>
          </div>

          <div className="farmer-section">
              <div className="farmer-left">
                  <p><span className="info-label">Farmer Name:</span> Standard Farm Source</p>
              </div>
              <div className="farmer-right">
                  <p><span className="info-label">Farmer Address:</span> Andhra Pradesh Region</p>
              </div>
          </div>

          <table className="items-table">
              <thead>
                  <tr>
                      <th style={{ width: '50%' }}>Particulars</th>
                      <th style={{ width: '25%' }}>Qty & Rate</th>
                      <th style={{ width: '25%' }} className="right-align">Amount</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td colSpan="3"><strong>Raw Material Purchase</strong></td>
                  </tr>
                  
                  {editableItems.map((item, idx) => (
                    <tr key={idx}>
                        <td>{item.variety} ({item.count})</td>
                        <td>{item.quantity?.toLocaleString('en-IN', { minimumFractionDigits: 3 })} {item.unit?.toLowerCase()} @ {item.unitPrice?.toFixed(2)}/{item.unit?.toLowerCase()}</td>
                        <td className="right-align">{item.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  
                  {Array.from({ length: Math.max(0, 3 - editableItems.length) }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                        <td style={{ height: '24px' }}></td><td></td><td></td>
                    </tr>
                  ))}

                  <tr className="total-row">
                      <td></td>
                      <td></td>
                      <td className="right-align">{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="total-row">
                      <td></td>
                      <td></td>
                      <td className="right-align" style={{ fontSize: '14px' }}>{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
              </tbody>
          </table>

          <div className="amount-words">
              <p><span className="label">Amount (in words):</span> INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Only</p>
          </div>

          <div className="footer-section">
              <div className="footer-left">
                  <p className="user-info">Entered User Name: Admin</p>
                  <div className="signature-box">
                      <p className="signature-label">Receiver's Signature</p>
                  </div>
              </div>
              <div className="footer-right">
                  <p>for {txn.buyer}</p>
                  <div className="signature-box">
                      <p className="signature-label">Checked Signatory</p>
                  </div>
                  <div className="stamp-area">
                      <p className="signature-label">Authorised Signatory</p>
                  </div>
              </div>
          </div>

      </div>
    </>
  );
};
