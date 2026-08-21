import React, { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

const GlobalHeader = ({ 
  title, 
  entityName, 
  role, 
  switchRoleSafe, 
  tradeMode, 
  setTradeMode,
  profilePic
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="global-header">
      <div className="logo-title" style={{ fontSize: '14px', fontWeight: '700' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {profilePic && (
          <img 
            src={profilePic} 
            alt="Profile" 
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#71717a' }}>
          {entityName}
        </div>

        {/* Role Toggle Switch: Supplier | Buyer */}
        {(role === 'supplier' || role === 'buyer') && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1.5px solid var(--steampunk-gold)',
              borderRadius: '20px',
              overflow: 'hidden',
              fontSize: '11px',
              fontWeight: '600',
              height: '28px'
            }}>
              <button
                onClick={() => switchRoleSafe('supplier')}
                style={{
                  padding: '0 14px', height: '100%', border: 'none', cursor: 'pointer',
                  background: role === 'supplier' ? 'var(--steampunk-gold)' : 'transparent',
                  color: role === 'supplier' ? '#ffffff' : '#71717a',
                  transition: 'all 0.2s'
                }}
              >Supplier</button>
              <button
                onClick={() => switchRoleSafe('buyer')}
                style={{
                  padding: '0 14px', height: '100%', border: 'none', cursor: 'pointer',
                  background: role === 'buyer' ? 'var(--steampunk-gold)' : 'transparent',
                  color: role === 'buyer' ? '#ffffff' : '#71717a',
                  transition: 'all 0.2s'
                }}
              >Buyer</button>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              overflow: 'hidden',
              fontSize: '11px',
              fontWeight: '600',
              height: '28px'
            }}>
              <button
                onClick={() => setTradeMode('domestic')}
                style={{
                  padding: '0 14px', height: '100%', border: 'none', cursor: 'pointer',
                  background: tradeMode === 'domestic' ? '#0f172a' : 'transparent',
                  color: tradeMode === 'domestic' ? '#ffffff' : '#71717a',
                  transition: 'all 0.2s'
                }}
              >Domestic</button>
              <button
                onClick={() => setTradeMode('global')}
                style={{
                  padding: '0 14px', height: '100%', border: 'none', cursor: 'pointer',
                  background: tradeMode === 'global' ? '#0f172a' : 'transparent',
                  color: tradeMode === 'global' ? '#ffffff' : '#71717a',
                  transition: 'all 0.2s'
                }}
              >Global</button>
            </div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9' }}
          >
            <Bell style={{ width: '16px', height: '16px', color: 'var(--foreground)' }} />
            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div>
          </div>
          
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '300px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '12px 0',
              zIndex: 50
            }}>
              <div style={{ padding: '0 16px 8px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', fontSize: '13px' }}>
                Notifications
              </div>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16a34a', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)' }}>Transaction Verified</div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>TXN-2024-541 has been verified by Financier.</div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16a34a', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)' }}>Funds Disbursed</div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>80% advance released for TXN-2024-118.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
