import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GlobalHeader from './GlobalHeader';

describe('GlobalHeader', () => {
  it('renders the title and entity name', () => {
    render(
      <GlobalHeader 
        title="Supplier Dashboard" 
        entityName="ABC Aqua Exports" 
        role="supplier" 
        tradeMode="domestic"
      />
    );
    
    expect(screen.getByText('Supplier Dashboard')).toBeInTheDocument();
    expect(screen.getByText('ABC Aqua Exports')).toBeInTheDocument();
  });

  it('calls switchRoleSafe when a role button is clicked', () => {
    const switchRoleSafe = vi.fn();
    render(
      <GlobalHeader 
        role="supplier" 
        switchRoleSafe={switchRoleSafe} 
      />
    );
    
    const buyerButton = screen.getByText('Buyer');
    fireEvent.click(buyerButton);
    expect(switchRoleSafe).toHaveBeenCalledWith('buyer');
  });

  it('calls setTradeMode when a trade mode button is clicked', () => {
    const setTradeMode = vi.fn();
    render(
      <GlobalHeader 
        role="supplier"
        tradeMode="domestic" 
        setTradeMode={setTradeMode} 
      />
    );
    
    const globalButton = screen.getByText('Global');
    fireEvent.click(globalButton);
    expect(setTradeMode).toHaveBeenCalledWith('global');
  });
});
