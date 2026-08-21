const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'src', 'App.jsx');
let content1 = fs.readFileSync(file1, 'utf8');

// Replace static "NBFC" text with dynamic text based on tradeMode
content1 = content1.replace(/Pending Bank Approval — NBFC Bill Discounting/g, "Pending Bank Approval — {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Bill Discounting");
content1 = content1.replace(/All NBFC loads are submitted/g, "All {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} loads are submitted");
content1 = content1.replace(/\{t\.paymentMode === 'nbfc' \? 'NBFC' : 'Direct'\}/g, "{t.paymentMode === 'nbfc' ? (tradeMode === 'global' ? 'Drip Capital' : 'NBFC') : 'Direct'}");
content1 = content1.replace(/Your NBFC Bill Discounting facility/g, "Your {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Bill Discounting facility");
content1 = content1.replace(/linked to your NBFC discounting facility/g, "linked to your {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} discounting facility");
content1 = content1.replace(/configured by your NBFC underwriter/g, "configured by your {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} underwriter");
content1 = content1.replace(/🏦 NBFC Bill Discounting via/g, "🏦 {tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Bill Discounting via");
content1 = content1.replace(/NBFC Lending Partners/g, "{tradeMode === 'global' ? 'Drip Capital' : 'NBFC'} Lending Partners");
fs.writeFileSync(file1, content1);
console.log('Updated App.jsx');

const file2 = path.join(__dirname, 'src', 'screens', 'SupplierDashboard', 'NewDispatchTab.jsx');
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/🏦 NBFC Bill Discounting/g, "🏦 {tradeMode === 'global' ? 'Drip Capital Factoring' : 'NBFC Bill Discounting'}");
content2 = content2.replace(/Bank pays you 80%/g, "{tradeMode === 'global' ? 'Drip Capital pays you 80%' : 'Bank pays you 80%'}");
content2 = content2.replace(/Holdback released upon buyer payment/g, "{tradeMode === 'global' ? 'Holdback released upon global buyer payment' : 'Holdback released upon domestic buyer payment'}");
fs.writeFileSync(file2, content2);
console.log('Updated NewDispatchTab.jsx');

const file3 = path.join(__dirname, 'src', 'screens', 'CeoDashboard', 'CeoDashboard.jsx');
let content3 = fs.readFileSync(file3, 'utf8');
content3 = content3.replace(/Active NBFC advances/g, "Active Financier advances");
fs.writeFileSync(file3, content3);
console.log('Updated CeoDashboard.jsx');

const file4 = path.join(__dirname, 'src', 'context', 'AppContext.jsx');
let content4 = fs.readFileSync(file4, 'utf8');
content4 = content4.replace(/\+ 'NBFC Bill Discounting via '/g, "+ (newTxnForm.tradeMode === 'global' ? 'Drip Capital Factoring via ' : 'NBFC Bill Discounting via ')");
fs.writeFileSync(file4, content4);
console.log('Updated AppContext.jsx');
