import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const INITIAL_PERSONAS = [
  {
    phone: 'supplier1',
    password: 'password123',
    role: 'supplier',
    tradeMode: 'domestic',
    legalName: 'ABC Aqua Exports',
    proprietor: 'Ramu K.',
    pan: 'ABCDE1234F',
    gstin: '37ABCDE1234F1Z5',
    bankName: 'State Bank of India',
    accountNo: '30928392039',
    ifsc: 'SBIN0001829',
    profilePic: 'https://images.unsplash.com/photo-1620959409867-074474704cc4?w=150'
  },
  {
    phone: 'buyer1',
    password: 'password123',
    role: 'buyer',
    tradeMode: 'domestic',
    corporateName: 'Suryamitra Seafoods',
    gstin: '37AAJCS6258G1ZY',
    factoryAddress: 'Yannamadurru, AP',
    bankName: 'HDFC Bank',
    accountNo: '50200012345678',
    ifsc: 'HDFC0001234',
    profilePic: 'https://images.unsplash.com/photo-1577700204738-9c169d273760?w=150'
  },
  {
    phone: 'admin',
    password: 'admin',
    role: 'financier',
    tradeMode: 'domestic',
    legalName: 'HDFC Bank (Admin)',
    proprietor: 'Admin',
    bankName: 'HDFC Bank',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    phone: 'ceo',
    password: 'ceo',
    role: 'ceo',
    tradeMode: 'domestic',
    legalName: 'Miledeep CEO',
    proprietor: 'CEO',
    profilePic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
  }
];

const SEED_TRANSACTIONS = [

  // ── STAGE 1: Fresh PR — Catfish & Tika Fish (User Test Order) ──
  {
    id: 'PR-2026-888', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Catfish',   count: '30 Count', quantity: 500, unit: 'KG', unitPrice: 900, amount: 450000 },
      { variety: 'Tika Fish', count: '30 Count', quantity: 500, unit: 'KG', unitPrice: 890, amount: 445000 }
    ],
    amount: 895000, dueDate: 'TBD', status: 'PR Sent', statusClass: 'warning',
    vehicleNo: null, repaymentStatus: 'Awaiting Repayment',
    paymentMode: null, financierBank: null, utrRef: null,
    docs: { challan: false, fastag: false, gatepass: false, billOfSupply: false }
  },

  // ── STAGE 1: Fresh PR — Mixed Shrimp order ──
  {
    id: 'PR-2026-901', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Vannamei Shrimp', count: '40 Count', quantity: 2000, unit: 'KG', unitPrice: 400, amount: 800000 },
      { variety: 'Vannamei Shrimp', count: '60 Count', quantity: 3000, unit: 'KG', unitPrice: 320, amount: 960000 }
    ],
    amount: 1760000, dueDate: 'TBD', status: 'PR Sent', statusClass: 'warning',
    vehicleNo: null, repaymentStatus: 'Awaiting Repayment',
    paymentMode: null, financierBank: null, utrRef: null,
    docs: { challan: false, fastag: false, gatepass: false, billOfSupply: false }
  },

  // ── STAGE 2: Stock Confirmed — Awaiting Dispatch Request ──
  {
    id: 'TXN-2026-104', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Vannamei Shrimp', count: '60 Count', quantity: 5000, unit: 'KG', unitPrice: 320, amount: 1600000 },
      { variety: 'Black Tiger Prawn', count: '30 Count', quantity: 1000, unit: 'KG', unitPrice: 750, amount: 750000 }
    ],
    amount: 2350000, dueDate: '20/09/2026', status: 'Stock Confirmed', statusClass: 'info',
    vehicleNo: null, repaymentStatus: 'Awaiting Repayment',
    paymentMode: null, financierBank: null, utrRef: null,
    docs: { challan: false, fastag: false, gatepass: false, billOfSupply: false }
  },

  // ── STAGE 2: Dispatch Requested by Buyer ──
  {
    id: 'TXN-2026-115', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Rohu Fish',  count: '50 Count', quantity: 2000, unit: 'KG', unitPrice: 180, amount: 360000 },
      { variety: 'Catla Fish', count: '40 Count', quantity: 1500, unit: 'KG', unitPrice: 220, amount: 330000 }
    ],
    amount: 690000, dueDate: '25/09/2026', status: 'Dispatch Requested', statusClass: 'info',
    vehicleNo: null, repaymentStatus: 'Awaiting Repayment',
    paymentMode: null, financierBank: null, utrRef: null,
    docs: { challan: false, fastag: false, gatepass: false, billOfSupply: false }
  },

  // ── STAGE 3: Dispatched — NBFC financing, In Transit ──
  {
    id: 'TXN-2026-101', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Vannamei Shrimp', count: '30 Count', quantity: 4500, unit: 'KG', unitPrice: 480, amount: 2160000 }
    ],
    amount: 2160000, dueDate: '10/09/2026', status: 'Dispatched', statusClass: 'primary',
    vehicleNo: 'AP-39-XD-9111', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: null,
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: false }
  },

  // ── STAGE 3: Dispatched — Pomfret & Mackerel ──
  {
    id: 'TXN-2026-118', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Pomfret',  count: '20 Count', quantity: 800,  unit: 'KG', unitPrice: 650, amount: 520000 },
      { variety: 'Mackerel', count: '40 Count', quantity: 1200, unit: 'KG', unitPrice: 210, amount: 252000 }
    ],
    amount: 772000, dueDate: '05/09/2026', status: 'Dispatched', statusClass: 'primary',
    vehicleNo: 'AP-12-ZK-8834', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: null,
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: false }
  },

  // ── STAGE 4: Invoice Raised — Awaiting Financier Underwriting ──
  {
    id: 'TXN-2026-107', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Snapper Fish', count: '25 Count', quantity: 1200, unit: 'KG', unitPrice: 580, amount: 696000 },
      { variety: 'Grouper Fish', count: '20 Count', quantity: 800,  unit: 'KG', unitPrice: 720, amount: 576000 }
    ],
    amount: 1272000, dueDate: '02/09/2026', status: 'Invoice Raised', statusClass: 'success',
    vehicleNo: 'AP-28-HJ-3310', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: null,
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 4: Invoice Raised — Surmai & Bombil ──
  {
    id: 'TXN-2026-122', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Surmai (Kingfish)', count: '30 Count', quantity: 1000, unit: 'KG', unitPrice: 550, amount: 550000 },
      { variety: 'Bombil (Bombay Duck)', count: '50 Count', quantity: 600, unit: 'KG', unitPrice: 190, amount: 114000 }
    ],
    amount: 664000, dueDate: '30/08/2026', status: 'Invoice Raised', statusClass: 'success',
    vehicleNo: 'AP-07-RL-5591', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: null,
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 5: Pending Disbursal — Tiger Prawns (Verified by Finance) ──
  {
    id: 'TXN-2026-110', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Tiger Prawns', count: '20 Count', quantity: 1500, unit: 'KG', unitPrice: 850, amount: 1275000 }
    ],
    amount: 1275000, dueDate: '28/08/2026', status: 'Pending Disbursal', statusClass: 'info',
    vehicleNo: 'AP-16-TJ-4829', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: null,
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 5: Pending Disbursal — Sole & Hilsa ──
  {
    id: 'TXN-2026-125', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Sole Fish',  count: '40 Count', quantity: 900,  unit: 'KG', unitPrice: 380, amount: 342000 },
      { variety: 'Hilsa Fish', count: '30 Count', quantity: 1100, unit: 'KG', unitPrice: 620, amount: 682000 }
    ],
    amount: 1024000, dueDate: '27/08/2026', status: 'Pending Disbursal', statusClass: 'info',
    vehicleNo: 'AP-33-MN-7742', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: null,
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 6: Disbursed — Active Collections ──
  {
    id: 'TXN-2026-108', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Vannamei Shrimp', count: '100 Count', quantity: 10000, unit: 'KG', unitPrice: 240, amount: 2400000 }
    ],
    amount: 2400000, dueDate: '25/08/2026', status: 'Disbursed', statusClass: 'success',
    vehicleNo: 'AP-37-CK-5522', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: 'HDFC98234098234',
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 6: Disbursed — Crab & Lobster ──
  {
    id: 'TXN-2026-099', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Mud Crab',  count: '10 Count', quantity: 500, unit: 'KG', unitPrice: 1200, amount: 600000 },
      { variety: 'Rock Lobster', count: '8 Count', quantity: 300, unit: 'KG', unitPrice: 2500, amount: 750000 }
    ],
    amount: 1350000, dueDate: '20/08/2026', status: 'Disbursed', statusClass: 'success',
    vehicleNo: 'AP-14-QP-2201', repaymentStatus: 'Awaiting Repayment',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: 'HDFC76234019823',
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 6: Disbursed — Settled ──
  {
    id: 'TXN-2026-091', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Seabass', count: '25 Count', quantity: 2000, unit: 'KG', unitPrice: 450, amount: 900000 },
      { variety: 'Red Snapper', count: '20 Count', quantity: 1000, unit: 'KG', unitPrice: 600, amount: 600000 }
    ],
    amount: 1500000, dueDate: '15/08/2026', status: 'Closed', statusClass: 'success',
    vehicleNo: 'AP-22-BN-4490', repaymentStatus: 'Settled by Buyer',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: 'HDFC45129837423',
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  },

  // ── STAGE 6: Disbursed — Settled ──
  {
    id: 'TXN-2026-083', supplierPhone: 'supplier1', buyerPhone: 'buyer1',
    supplier: 'ABC Aqua Exports', buyer: 'Suryamitra Seafoods', tradeMode: 'domestic',
    items: [
      { variety: 'Yellowfin Tuna', count: '15 Count', quantity: 800, unit: 'KG', unitPrice: 850, amount: 680000 },
      { variety: 'Sardine',        count: '80 Count', quantity: 3000, unit: 'KG', unitPrice: 90, amount: 270000 }
    ],
    amount: 950000, dueDate: '10/08/2026', status: 'Closed', statusClass: 'success',
    vehicleNo: 'AP-09-DK-7781', repaymentStatus: 'Settled by Buyer',
    paymentMode: 'nbfc', financierBank: 'HDFC Bank', utrRef: 'HDFC23019827312',
    docs: { challan: true, fastag: true, gatepass: true, billOfSupply: true }
  }

];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [personas, setPersonas] = useState(INITIAL_PERSONAS);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState(INITIAL_PERSONAS[0].role);
  const [screen, setScreen] = useState('login');
  const [tradeMode, setTradeMode] = useState('domestic');
  const [isSignUp, setIsSignUp] = useState(true);
  
  // Input fields state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  // Wizard progress step
  const [kycStep, setKycStep] = useState(1);
  
  // Dual Independent KYC states
  const [domesticKycCompleted, setDomesticKycCompleted] = useState(false);
  const [globalKycCompleted, setGlobalKycCompleted] = useState(false);

  // Form states
  const [supplierForm, setSupplierForm] = useState({
    legalName: 'ABC Aqua Exports',
    proprietor: 'Ramu K.',
    pan: 'ABCDE1234F',
    gstin: '37ABCDE1234F1Z5',
    bankName: 'State Bank of India',
    accountNo: '30928392039',
    ifsc: 'SBIN0001829'
  });

  const [buyerForm, setBuyerForm] = useState({
    corporateName: 'Suryamitra Exim Private Limited',
    gstin: '37AAJCS6258G1ZY',
    factoryAddress: 'R.S.No - 130, Dirusumarru Road, Yannamadurru, Bhimavaram Mandal, West Godavari Dist., A.P. Pincode - 534239.',
    bankName: 'HDFC Bank',
    accountNo: '50200029302839',
    ifsc: 'HDFC0000283',
    iceCapacity: '45', 
    coldRoomTemp: '-18.5', 
    weighbridgeStatus: 'Calibrated & Certified (Valid till Dec 2026)',
    dailyProcessingCap: '12' 
  });

  // Simulated document upload states
  const [uploads, setUploads] = useState({
    Pan: false,
    Gst: false,
    Bank: false,
    Factory: false
  });

  // Credit Line Assessment States
  const [assessmentState, setAssessmentState] = useState('approved');
  const [approvedLimit, setApprovedLimit] = useState(5000000); 
  const [showChallanPreview, setShowChallanPreview] = useState(false);
  const [docGeneratorConfig, setDocGeneratorConfig] = useState(null);
  
  // Bill Discounting Trigger States
  const [withdrawTxn, setWithdrawTxn] = useState(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [disbursalReceipt, setDisbursalReceipt] = useState(null); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  // Optimizations states
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [docType, setDocType] = useState('challan'); 
  
  // Buyer flow active tab
  const [buyerActiveTab, setBuyerActiveTab] = useState('dashboard');
  const [reqSubTab, setReqSubTab] = useState('pending');       
  const [settingsTab, setSettingsTab] = useState('profile');   
  const [selectedVerifyTxn, setSelectedVerifyTxn] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Active Tab inside Supplier Dashboard Screen
  const [activeTab, setActiveTab] = useState('dashboard');

  // Transactions State
  const [isGistLoading, setIsGistLoading] = useState(!!supabase);
  const [gistError, setGistError] = useState(null);

  const syncToSupabase = async (newPersonas, newTxns) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('mbd_data')
        .upsert({ id: 'singleton', personas: newPersonas, transactions: newTxns });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to sync to Supabase:', err);
    }
  };

  useEffect(() => {
    if (!supabase) return;

    const fetchSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('mbd_data')
          .select('*')
          .eq('id', 'singleton')
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'

        if (data && data.personas && data.transactions) {
          setPersonas(data.personas);
          setTransactionsState(data.transactions);
          localStorage.setItem('mbd_transactions', JSON.stringify(data.transactions));
        } else {
          // Empty database, push seed data
          await syncToSupabase(INITIAL_PERSONAS, SEED_TRANSACTIONS);
        }
      } catch (err) {
        console.error(err);
        setGistError(err.message);
      } finally {
        setIsGistLoading(false);
      }
    };
    
    fetchSupabase();

    // Set up Supabase Realtime subscription
    const subscription = supabase
      .channel('mbd_data_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mbd_data', filter: 'id=eq.singleton' },
        (payload) => {
          if (payload.new && payload.new.personas && payload.new.transactions) {
            setPersonas(payload.new.personas);
            setTransactionsState(payload.new.transactions);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const [transactions, setTransactionsState] = useState(() => {
    try {
      const saved = localStorage.getItem('mbd_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear old cached data that had 'BlueWave' buyer (stale global data)
        const hasStaleData = parsed.some(t => t.buyer === 'BlueWave Imports LLC' && t.tradeMode === 'global');
        if (hasStaleData) {
          localStorage.removeItem('mbd_transactions');
          return SEED_TRANSACTIONS;
        }
        return parsed;
      }
      return SEED_TRANSACTIONS;
    } catch {
      return SEED_TRANSACTIONS;
    }
  });

  const setTransactions = (newValue) => {
    setTransactionsState(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      localStorage.setItem('mbd_transactions', JSON.stringify(next));
      if (supabase) syncToSupabase(personas, next);
      return next;
    });
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'mbd_transactions' && e.newValue) {
        setTransactionsState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Modal State
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Search Filter for My Transactions
  const [searchQuery, setSearchQuery] = useState('');

  // New Transaction Form State
  const [newTxnForm, setNewTxnForm] = useState({
    buyer: 'Suryamitra Exim Private Limited',
    variety: 'Vannamei Shrimp',
    count: '30 Count',
    creditPeriod: '30',
    quantity: '2450',
    totalValue: '1865000',
    paymentMode: 'nbfc' 
  });

  const [newTxnDocs, setNewTxnDocs] = useState({
    challan: false,
    fastag: false,
    gatepass: false
  });

  const [companyUsers, setCompanyUsers] = useState([
    { id: 'usr-1', name: 'John Doe', email: 'john@abcaqua.in', role: 'Admin', domain: 'All' },
    { id: 'usr-2', name: 'Jane Smith', email: 'jane@abcaqua.in', role: 'Domain Admin', domain: 'Finance' },
    { id: 'usr-3', name: 'Bob Johnson', email: 'bob@abcaqua.in', role: 'Domain User', domain: 'Seller' }
  ]);

  const handleUploadClick = (docKey) => {
    setUploads(prev => ({ ...prev, [docKey]: true }));
  };

  const handleVerifyDocuments = (txnId) => {
    setTransactions(prev => prev.map(t => 
      t.id === txnId ? { ...t, status: 'Pending Disbursal' } : t
    ));
    triggerToast(`Transaction ${txnId} approved — ready for disbursal.`);
  };

  const handleDisburseFunds = (txnId) => {
    setTransactions(prev => prev.map(t => 
      t.id === txnId ? { ...t, status: 'Disbursed', utrRef: `${t.tradeMode === 'global' ? 'DRIP' : 'HDFC'}${Date.now()}` } : t
    ));
    triggerToast(`Funds disbursed for Transaction ${txnId}.`);
  };

  const handleCollectRepayment = (txnId) => {
    setTransactions(prev => prev.map(t => 
      t.id === txnId ? { ...t, status: 'Closed', repaymentStatus: 'Settled by Buyer' } : t
    ));
    triggerToast(`Repayment collected for Transaction ${txnId}.`);
  };

  const handleAddAdmin = (newAdmin) => {
    setPersonas(prev => {
      const next = [...prev, newAdmin];
      if (supabase) syncToSupabase(next, transactions);
      return next;
    });
    triggerToast(`New Admin created: ${newAdmin.legalName}`);
  };

  
  const handleSignUp = (e, newUsername, newPassword, newRole, newCompanyName) => {
    e?.preventDefault?.();
    if (personas.some(p => p.phone === newUsername)) {
      alert("Username already exists!");
      return;
    }
    
    const newPersona = {
      phone: newUsername,
      password: newPassword,
      role: newRole,
      tradeMode: 'global',
      legalName: newRole === 'supplier' ? newCompanyName : undefined,
      corporateName: newRole === 'buyer' ? newCompanyName : undefined,
      proprietor: newUsername,
      profilePic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
    };

    setPersonas(prev => {
      const next = [...prev, newPersona];
      if (supabase) syncToSupabase(next, transactions);
      return next;
    });

    // Auto login bypassing the stale closure array
    setLoggedInUser(newPersona);
    setRole(newPersona.role);
    setTradeMode('domestic'); // Always default to domestic
    if (newPersona.role === 'supplier') {
      setSupplierForm(prev => ({...prev, ...newPersona}));
      setActiveTab('dashboard');
    } else {
      setBuyerForm(prev => ({...prev, ...newPersona}));
      setBuyerActiveTab('dashboard');
    }
    setDomesticKycCompleted(true);
    setGlobalKycCompleted(true);
    setScreen('dashboard');
    triggerToast();
  };

  const handleOtpVerify = (e, manualUsername, manualPassword) => {
    e?.preventDefault?.();
    const currentUsername = manualUsername || phone;
    const currentPassword = manualPassword || otp;
    const persona = personas.find(p => p.phone === currentUsername && p.password === currentPassword);
    
    if (!persona) {
      alert("Invalid username or password. Please try supplier1 / password123");
      return;
    }
    
    setLoggedInUser(persona);
    setRole(persona.role);
    setTradeMode('domestic'); // Always default to domestic on login
    if (persona.role === 'supplier') {
      setSupplierForm(prev => ({...prev, ...persona}));
    } else {
      setBuyerForm(prev => ({...prev, ...persona}));
    }
    setDomesticKycCompleted(true);
    setGlobalKycCompleted(true);
    setScreen('dashboard');
    if (persona.role === 'supplier') {
      setActiveTab('dashboard');
    } else {
      setBuyerActiveTab('dashboard');
    }
    triggerToast(`Welcome back, ${persona.legalName || persona.corporateName || 'User'}`);
  };

  const handleNextKycStep = (e) => {
    e.preventDefault();
    if (kycStep < 3) {
      setKycStep(prev => prev + 1);
    } else {
      if (tradeMode === 'domestic') {
        setDomesticKycCompleted(true);
      } else {
        setGlobalKycCompleted(true);
      }
      setScreen('completed');
    }
  };

  // --- New Lifecycle Handlers ---
  const handleCreatePR = (supplierName, items, totalAmount) => {
    const txnId = 'PR-2024-' + Math.floor(Math.random() * 900 + 100);
    const targetSupplier = personas.find(p => p.role === 'supplier' && p.legalName === supplierName) || {};
    const newTxn = {
      id: txnId,
      buyer: buyerForm.corporateName,
      supplier: supplierName,
      buyerPhone: loggedInUser?.phone,
      supplierPhone: targetSupplier.phone || 'supplier1',
      items: items,
      amount: totalAmount,
      dueDate: 'TBD',
      status: 'PR Sent',
      statusClass: 'warning',
      vehicleNo: null,
      repaymentStatus: 'Awaiting Repayment',
      paymentMode: null,
      financierBank: null,
      utrRef: null,
      docs: { challan: false, fastag: false, gatepass: false, billOfSupply: false }
    };
    setTransactions([newTxn, ...transactions]);
    triggerToast(`Purchase Request ${txnId} sent to ${supplierName}`);
  };

  const handleConfirmStock = (txnId) => {
    setTransactions(transactions.map(t => t.id === txnId ? { ...t, status: 'Stock Confirmed', statusClass: 'info' } : t));
    triggerToast(`Stock confirmed for Request ${txnId}`);
  };

  const handleRejectPR = (txnId, reason) => {
    setTransactions(transactions.map(t => t.id === txnId ? { ...t, status: 'PR Rejected', statusClass: 'danger', rejectionReason: reason } : t));
    triggerToast(`Purchase Request ${txnId} rejected`);
  };

  const handleRequestDispatch = (txnId) => {
    setTransactions(transactions.map(t => {
      if (t.id === txnId) {
        return {
          ...t,
          status: 'Dispatch Requested',
          statusClass: 'info'
        };
      }
      return t;
    }));
    triggerToast(`Dispatch requested from supplier.`);
  };

  const handleRaisePO = (txnId, itemsOverride, amountOverride) => {
    setTransactions(transactions.map(t => {
      if (t.id === txnId) {
        // If it was already dispatched, raising the PO means goods are verified.
        const nextStatus = t.status === 'Dispatched' ? 'Buyer Confirmed' : 'PO Issued';
        return {
          ...t,
          status: nextStatus,
          statusClass: 'success',
          id: t.id.replace('PR', 'PO'),
          items: itemsOverride || t.items,
          amount: amountOverride !== undefined ? amountOverride : t.amount
        };
      }
      return t;
    }));
    triggerToast(`Purchase Order verified and issued successfully`);
  };

  const handleDispatch = (txnId, vehicleNo, paymentMode, resolvedBank, itemsOverride, totalAmountOverride) => {
    setTransactions(transactions.map(t => {
      if (t.id === txnId) {
        return {
          ...t,
          status: 'Dispatched',
          statusClass: 'info',
          vehicleNo: vehicleNo,
          paymentMode: paymentMode,
          financierBank: resolvedBank,
          items: itemsOverride || t.items,
          amount: totalAmountOverride || t.amount,
          docs: { ...t.docs, challan: true, fastag: true }
        };
      }
      return t;
    }));
    triggerToast(`${tradeMode === 'global' ? 'Bill of Lading' : 'Delivery Challan'} generated and Goods Dispatched for ${txnId}`);
  };

  const handleConfirmDelivery = (txnId) => {
    setTransactions(transactions.map(t => t.id === txnId ? { ...t, status: 'Delivered', statusClass: 'success' } : t));
    triggerToast(`Delivery confirmed for ${txnId}`);
  };

  const handleGenerateBill = (txnId) => {
    setTransactions(transactions.map(t => {
      if (t.id === txnId) {
        return {
          ...t,
          status: 'Invoice Raised',
          // Auto-route to NBFC financing if no mode was set at dispatch time
          paymentMode: t.paymentMode || 'nbfc',
          financierBank: t.financierBank || 'HDFC Bank',
          docs: { ...t.docs, billOfSupply: true }
        };
      }
      return t;
    }));
    triggerToast(`Invoice generated. Sent to Finance for verification.`);
  };


  const downloadFastagCSV = (vehicleNo) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Toll Plaza,Timestamp,Vehicle Number,Direction,Amount Debited\n";
    csvContent += `Bhimavaram NH-16 Toll,${new Date().toLocaleString('en-IN')},${vehicleNo},Outward,₹230\n`;
    csvContent += `Kakinada Port Entrance Toll,${new Date(Date.now() + 2*3600*1000).toLocaleString('en-IN')},${vehicleNo},Inward,₹150\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fastag_statement_${vehicleNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("FASTag log CSV downloaded.");
  };

  const downloadPayoutAdviceCSV = (txn) => {
    const utr = txn.utrRef || `HDFC${Date.now()}`;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "FINANCING PAYOUT ADVICE - OFFICIAL RECEIPT\n";
    csvContent += `Transaction ID,${txn.id}\n`;
    csvContent += `UTR / Transfer Reference,${utr}\n`;
    csvContent += `Financier Bank,${txn.financierBank || 'HDFC Bank'}\n`;
    csvContent += `Credited To Account,SBI ****${supplierForm.accountNo.slice(-4)}\n`;
    csvContent += `Buyer Processor,${txn.buyer}\n`;
    csvContent += `Invoice Value,Rs.${txn.amount.toLocaleString('en-IN')}\n`;
    csvContent += `Bank Advance (80%),Rs.${(txn.amount * 0.8).toLocaleString('en-IN')}\n`;
    csvContent += `Bank Processing Fee (2%),Rs.${(txn.amount * 0.02).toLocaleString('en-IN')}\n`;
    csvContent += `NET AMOUNT CREDITED,Rs.${(txn.amount * 0.8 - txn.amount * 0.02).toLocaleString('en-IN')}\n`;
    csvContent += `Maturity Holdback (20%),Rs.${(txn.amount * 0.2).toLocaleString('en-IN')}\n`;
    csvContent += `Transfer Timestamp,${new Date().toLocaleString('en-IN')}\n`;
    csvContent += `Payment Mode,NEFT/RTGS\n`;
    csvContent += `Status,SUCCESS\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payout_advice_${txn.id}_${utr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Payout advice downloaded with UTR reference.");
  };

  const bypassAuthForDemo = () => {
    const dummyUser = role === 'supplier' ? personas.find(p => p.phone === 'supplier1') : personas.find(p => p.phone === 'buyer1');
    setLoggedInUser(dummyUser || { phone: role === 'supplier' ? 'supplier1' : 'buyer1', role });
    setScreen('dashboard');
    setActiveTab('dashboard');
    setBuyerActiveTab('dashboard');
    setApprovedLimit(5000000);
    setAssessmentState('approved');
    setDomesticKycCompleted(true);
    setGlobalKycCompleted(true);
    triggerToast(`Welcome to Demo Workspace as ${role.toUpperCase()}!`);
  };

  const switchRoleSafe = (targetRole) => {
    setRole(targetRole);
    const targetUser = personas.find(p => p.role === targetRole && (p.phone === 'supplier1' || p.phone === 'buyer1')) || { phone: targetRole === 'supplier' ? 'supplier1' : 'buyer1', role: targetRole };
    setLoggedInUser(targetUser);
    
    if (targetRole === 'supplier') {
      setScreen('dashboard');
      setActiveTab('dashboard');
    } else {
      setScreen('dashboard');
      setBuyerActiveTab('dashboard');
    }
  };

  const switchTradeModeSafe = (targetMode) => {
    if (targetMode === 'domestic') {
      if (!domesticKycCompleted) {
        setTradeMode('domestic');
        setKycStep(1);
        setScreen('kyc');
        triggerToast("Domestic Trade KYC Required.");
      } else {
        setTradeMode('domestic');
      }
    } else {
      if (!globalKycCompleted) {
        setTradeMode('global');
        setKycStep(1);
        setScreen('kyc');
        triggerToast("Global Trade KYC Required.");
      } else {
        setTradeMode('global');
      }
    }
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      screen, setScreen,
      tradeMode, setTradeMode,
    isGistLoading, gistError,
      isSignUp, setIsSignUp,
      phone, setPhone,
      otp, setOtp,
      kycStep, setKycStep,
      domesticKycCompleted, setDomesticKycCompleted,
      globalKycCompleted, setGlobalKycCompleted,
      supplierForm, setSupplierForm,
      buyerForm, setBuyerForm,
      uploads, setUploads,
      assessmentState, setAssessmentState,
      approvedLimit, setApprovedLimit,
      showChallanPreview, setShowChallanPreview,
    docGeneratorConfig, setDocGeneratorConfig,
      withdrawTxn, setWithdrawTxn,
      withdrawalLoading, setWithdrawalLoading,
      disbursalReceipt, setDisbursalReceipt,
      showNotifications, setShowNotifications,
      unreadCount, setUnreadCount,
      toast, setToast,
      activeFilter, setActiveFilter,
      currentPage, setCurrentPage,
      docType, setDocType,
      buyerActiveTab, setBuyerActiveTab,
      reqSubTab, setReqSubTab,
      settingsTab, setSettingsTab,
      selectedVerifyTxn, setSelectedVerifyTxn,
      selectedPO, setSelectedPO,
      triggerToast,
      activeTab, setActiveTab,
      transactions, setTransactions,
      selectedTxn, setSelectedTxn,
      searchQuery, setSearchQuery,
      newTxnForm, setNewTxnForm,
      newTxnDocs, setNewTxnDocs,
      companyUsers, setCompanyUsers,
      personas,
      handleAddAdmin,
      loggedInUser, setLoggedInUser,
      handleUploadClick,
      handleNextKycStep,
      handleCreatePR,
      handleConfirmStock,
      handleRejectPR,
      handleRequestDispatch,
      handleRaisePO,
      handleDispatch,
      handleConfirmDelivery,
      handleGenerateBill,
      handleOtpVerify,
      handleSignUp,
      handleVerifyDocuments,
      handleDisburseFunds,
      handleCollectRepayment,
      downloadFastagCSV,
      downloadPayoutAdviceCSV,
      bypassAuthForDemo,
      switchRoleSafe,
      switchTradeModeSafe
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
