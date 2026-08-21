import React from 'react';
import { ShieldCheck, ArrowRight, Lock, ArrowLeft, Briefcase, UploadCloud, CheckCircle2, Zap } from 'lucide-react';

export const LoginScreen = ({ 
  phone, setPhone, otp, setOtp, handleOtpVerify, bypassAuthForDemo,
  isSignUp, setIsSignUp, handleSignUp
}) => {
  const [newUsername, setNewUsername] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newRole, setNewRole] = React.useState('supplier');
  const [newCompany, setNewCompany] = React.useState('');

  return (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--steampunk-gold)', alignItems: 'center', justifyContent: 'center' }}>

    <div className="onboarding-container" style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <img src="/assets/miledeep_logo.svg" alt="Miledeep Logo" style={{ width: '200px' }} />
        </div>
        <p className="subheading" style={{fontSize: '12px', background: '#fef3c7', padding: '10px', borderRadius: '6px', color: '#92400e', textAlign: 'left', border: '1px solid #fcd34d'}}>
          <strong>Demo Credentials:</strong><br/>
          Supplier: <code>supplier1</code> / <code>password123</code><br/>
          Buyer: <code>buyer1</code> / <code>password123</code><br/>
          Admin: <code>admin</code> / <code>admin</code><br/>
          CEO: <code>ceo</code> / <code>ceo</code>
        </p>

        
          <form onSubmit={handleOtpVerify}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" value={otp} onChange={e => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <span>Sign In</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </form>

        <div style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: 'var(--steampunk-gold)', textDecoration: 'none' }} onClick={bypassAuthForDemo}>
            <Zap style={{ width: '14px', height: '14px' }} /> Skip to Demo Dashboard
          </a>
          <button 
            onClick={(e) => { setPhone('admin'); setOtp('admin'); handleOtpVerify(e, 'admin', 'admin'); }}
            style={{ 
              background: 'var(--steampunk-gold)', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', 
              border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <Briefcase style={{ width: '16px', height: '16px' }} />
            Financier Portal (Admin)
          </button>
          <button 
            onClick={(e) => { setPhone('ceo'); setOtp('ceo'); handleOtpVerify(e, 'ceo', 'ceo'); }}
            style={{ 
              background: '#ffffff', color: 'var(--steampunk-gold)', padding: '8px 16px', borderRadius: '6px', 
              border: '1px solid var(--steampunk-gold)', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px'
            }}
          >
            <Briefcase style={{ width: '16px', height: '16px' }} />
            CEO Portal (Super Admin)
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export const KycScreen = ({ 
  tradeMode, kycStep, setKycStep, handleNextKycStep, 
  form, setForm, uploads, handleUploadClick, setUploads 
}) => (
  <div className="onboarding-container">
    <div className="card" style={{ maxWidth: '640px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Briefcase style={{ width: '24px', height: '24px', color: 'var(--steampunk-gold)' }} />
        <h2 className="heading">
          {tradeMode === 'domestic' ? 'Domestic Entity Onboarding' : 'Global (International) Onboarding'}
        </h2>
      </div>

      {/* Step progress indicators */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid #e4e4e7', paddingBottom: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', background: kycStep >= 1 ? 'var(--steampunk-gold)' : '#ffffff', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: kycStep >= 1 ? '#ffffff' : '#71717a'
          }}>1</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: kycStep >= 1 ? 'var(--steampunk-gold)' : '#71717a' }}>Entity Profile</span>
            <span style={{ fontSize: '10px', color: '#71717a' }}>Business details</span>
          </div>
        </div>
        <div style={{ flex: 1, height: '1px', background: '#e4e4e7' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', background: kycStep > 1 ? 'var(--steampunk-gold)' : '#ffffff', border: kycStep >= 2 ? '1px solid #000000' : '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: kycStep > 1 ? '#ffffff' : (kycStep === 2 ? 'var(--steampunk-gold)' : '#71717a')
          }}>2</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: kycStep >= 2 ? 'var(--steampunk-gold)' : '#71717a' }}>KYC Docs</span>
            <span style={{ fontSize: '10px', color: '#71717a' }}>Upload files</span>
          </div>
        </div>
        <div style={{ flex: 1, height: '1px', background: '#e4e4e7' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', background: kycStep === 3 ? 'var(--steampunk-gold)' : '#ffffff', border: kycStep === 3 ? '1px solid #000000' : '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: kycStep === 3 ? '#ffffff' : '#71717a'
          }}>3</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: kycStep === 3 ? 'var(--steampunk-gold)' : '#71717a' }}>Bank Details</span>
            <span style={{ fontSize: '10px', color: '#71717a' }}>Payout details</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleNextKycStep}>
        {kycStep === 1 && (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label>Legal Business Name</label>
                <input type="text" className="form-input" value={form.legalName} onChange={(e) => setForm({...form, legalName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Permanent Account Number (PAN)</label>
                <input type="text" className="form-input" value={form.pan} onChange={(e) => setForm({...form, pan: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              {tradeMode === 'domestic' ? (
                <div className="form-group">
                  <label>GSTIN Number</label>
                  <input type="text" className="form-input" value={form.gstin} onChange={(e) => setForm({...form, gstin: e.target.value})} required />
                </div>
              ) : (
                <div className="form-group">
                  <label>Import Export Code (IEC)</label>
                  <input type="text" className="form-input" value={form.iec} onChange={(e) => setForm({...form, iec: e.target.value})} required />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary">
                <span>Save & Next</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {kycStep === 2 && (
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Attach documents below to verify your entity.
            </p>
            <div className="doc-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className={`doc-card ${uploads.Pan ? 'uploaded' : ''}`} onClick={() => handleUploadClick('Pan')}>
                <UploadCloud style={{ width: '24px', height: '24px', color: uploads.Pan ? 'var(--steampunk-gold)' : '#71717a' }} />
                <div style={{ fontSize: '13px', fontWeight: '600' }}>PAN Card</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{uploads.Pan ? <><CheckCircle2 size={12} style={{ display: 'inline', marginBottom: '-2px' }} /> Document Verified</> : 'Click to Upload'}</div>
              </div>
              {tradeMode === 'domestic' ? (
                <div className={`doc-card ${uploads.Gst ? 'uploaded' : ''}`} onClick={() => handleUploadClick('Gst')}>
                  <UploadCloud style={{ width: '24px', height: '24px', color: uploads.Gst ? 'var(--steampunk-gold)' : '#71717a' }} />
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>GSTIN Certificate</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{uploads.Gst ? <><CheckCircle2 size={12} style={{ display: 'inline', marginBottom: '-2px' }} /> Document Verified</> : 'Click to Upload'}</div>
                </div>
              ) : (
                <div className={`doc-card ${uploads.Iec ? 'uploaded' : ''}`} onClick={() => handleUploadClick('Iec')}>
                  <UploadCloud style={{ width: '24px', height: '24px', color: uploads.Iec ? 'var(--steampunk-gold)' : '#71717a' }} />
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>IEC Registration</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{uploads.Iec ? <><CheckCircle2 size={12} style={{ display: 'inline', marginBottom: '-2px' }} /> Document Verified</> : 'Click to Upload'}</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setKycStep(1)}>Back</button>
              <button type="submit" className="btn btn-primary" onClick={() => setUploads({ Pan: true, Gst: true, Iec: true })}>
                <span>Save & Next</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {kycStep === 3 && (
          <div>
            <div className="form-group">
              <label>Company Bank Name</label>
              <input type="text" className="form-input" value={form.bankName} onChange={(e) => setForm({...form, bankName: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Account Number</label>
                <input type="text" className="form-input" value={form.accountNo} onChange={(e) => setForm({...form, accountNo: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{tradeMode === 'global' ? 'SWIFT Code' : 'IFSC Code'}</label>
                <input type="text" className="form-input" value={form.routingCode} onChange={(e) => setForm({...form, routingCode: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setKycStep(2)}>Back</button>
              <button type="submit" className="btn btn-primary">Complete Verification</button>
            </div>
          </div>
        )}
      </form>
    </div>
  </div>
);
