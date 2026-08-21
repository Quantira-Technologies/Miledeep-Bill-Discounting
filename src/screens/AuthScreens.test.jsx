import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginScreen } from './AuthScreens';

describe('LoginScreen', () => {
  it('renders login form and demo credentials', () => {
    render(
      <LoginScreen 
        phone=""
        setPhone={() => {}}
        otp=""
        setOtp={() => {}}
        handleOtpVerify={() => {}}
        bypassAuthForDemo={() => {}}
      />
    );
    
    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('triggers bypassAuthForDemo when Skip to Demo Dashboard is clicked', () => {
    const bypassAuthForDemo = vi.fn();
    render(
      <LoginScreen 
        phone=""
        setPhone={() => {}}
        otp=""
        setOtp={() => {}}
        handleOtpVerify={() => {}}
        bypassAuthForDemo={bypassAuthForDemo}
      />
    );
    
    const skipLink = screen.getByText(/Skip to Demo Dashboard/i);
    fireEvent.click(skipLink);
    expect(bypassAuthForDemo).toHaveBeenCalled();
  });

  it('triggers handleOtpVerify on submit', () => {
    const handleOtpVerify = vi.fn(e => e.preventDefault());
    render(
      <LoginScreen 
        phone="supplier1"
        setPhone={() => {}}
        otp="password123"
        setOtp={() => {}}
        handleOtpVerify={handleOtpVerify}
        bypassAuthForDemo={() => {}}
      />
    );
    
    const form = screen.getByText('Username').closest('form');
    fireEvent.submit(form);
    expect(handleOtpVerify).toHaveBeenCalled();
  });
});
