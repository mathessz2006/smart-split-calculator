import { useState, useEffect } from 'react';
import { DollarSign, Users, Receipt, Copy, RefreshCw, Globe, ArrowRight } from 'lucide-react';
import './App.css';

const SAMPLE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.50,
  JPY: 155.00,
  CAD: 1.36,
  AUD: 1.50
};

const CURRENCIES = Object.keys(SAMPLE_RATES);

function App() {
  const [bill, setBill] = useState<string>('');
  const [tipPercent, setTipPercent] = useState<number | null>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [people, setPeople] = useState<string>('2');
  const [tax, setTax] = useState<string>('');
  const [roundUp, setRoundUp] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Currency state
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(SAMPLE_RATES);

  // Fetch live rates on mount
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          // Merge live rates with sample rates just in case
          setExchangeRates(prev => ({ ...prev, ...data.rates }));
        }
      })
      .catch(err => {
        console.error("Could not fetch live rates, using sample rates.", err);
      });
  }, []);

  // Conversion logic
  const convertAmount = (amount: number, from: string, to: string) => {
    if (from === to) return amount;
    const rateFrom = exchangeRates[from] || 1;
    const rateTo = exchangeRates[to] || 1;
    const amountInUSD = amount / rateFrom;
    return amountInUSD * rateTo;
  };

  // Calculations (in Base Currency)
  const billVal = Math.max(0, parseFloat(bill) || 0);
  const taxVal = Math.max(0, parseFloat(tax) || 0);
  const peopleVal = Math.max(1, parseInt(people) || 1);
  
  let tipAmountBase = 0;
  if (tipPercent !== null) {
    tipAmountBase = billVal * (tipPercent / 100);
  } else {
    tipAmountBase = billVal * (Math.max(0, parseFloat(customTip) || 0) / 100);
  }

  let totalAmountBase = billVal + tipAmountBase + taxVal;
  let perPersonAmountBase = totalAmountBase / peopleVal;

  if (roundUp) {
    perPersonAmountBase = Math.ceil(perPersonAmountBase);
    totalAmountBase = perPersonAmountBase * peopleVal;
    tipAmountBase = totalAmountBase - billVal - taxVal;
  }

  // Convert to Target Currency for display
  const billValTarget = convertAmount(billVal, baseCurrency, targetCurrency);
  const taxValTarget = convertAmount(taxVal, baseCurrency, targetCurrency);
  const tipAmountTarget = convertAmount(tipAmountBase, baseCurrency, targetCurrency);
  const totalAmountTarget = convertAmount(totalAmountBase, baseCurrency, targetCurrency);
  const perPersonAmountTarget = convertAmount(perPersonAmountBase, baseCurrency, targetCurrency);

  // Formatting helper
  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  };

  const handleCopy = () => {
    const text = `Split Bill Details:
Bill: ${formatCurrency(billValTarget, targetCurrency)}
Tax: ${formatCurrency(taxValTarget, targetCurrency)}
Tip: ${formatCurrency(tipAmountTarget, targetCurrency)}
Total: ${formatCurrency(totalAmountTarget, targetCurrency)}
Split (${peopleVal} people): ${formatCurrency(perPersonAmountTarget, targetCurrency)} per person`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setBill('');
    setTipPercent(15);
    setCustomTip('');
    setPeople('2');
    setTax('');
    setRoundUp(false);
    setBaseCurrency('USD');
    setTargetCurrency('USD');
  };

  const isPeopleInvalid = parseInt(people) <= 0;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Smart Split</h1>
        <p>I built this because splitting expenses manually is annoying, error-prone, and time-consuming.</p>
      </header>

      <main className="main-content">
        {/* Input Section */}
        <div className="card">
          
          <div className="input-group" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1 }}>
              <div className="input-label">
                <label>Base Currency</label>
              </div>
              <div className="input-wrapper">
                <Globe className="input-icon" size={18} />
                <select 
                  value={baseCurrency} 
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="styled-input"
                  style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.75rem', color: 'var(--text-muted)' }}>
              <ArrowRight size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="input-label">
                <label>Convert To</label>
              </div>
              <div className="input-wrapper">
                <Globe className="input-icon" size={18} />
                <select 
                  value={targetCurrency} 
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="styled-input"
                  style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">
              <label htmlFor="bill">Bill Amount ({baseCurrency})</label>
            </div>
            <div className="input-wrapper">
              <DollarSign className="input-icon" size={20} />
              <input
                id="bill"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="styled-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">
              <label>Select Tip %</label>
            </div>
            <div className="tip-grid">
              {[0, 5, 10, 15, 20].map((percent) => (
                <button
                  key={percent}
                  className={`tip-button ${tipPercent === percent ? 'active' : ''}`}
                  onClick={() => {
                    setTipPercent(percent);
                    setCustomTip('');
                  }}
                >
                  {percent}%
                </button>
              ))}
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Custom %"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                  setTipPercent(null);
                }}
                onClick={() => setTipPercent(null)}
                className={`styled-input custom-tip-input ${tipPercent === null ? 'active' : ''}`}
                style={{ paddingLeft: '1rem', border: tipPercent === null ? '1px solid var(--primary)' : '' }}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">
              <label htmlFor="tax">Tax / Service Charge ({baseCurrency})</label>
            </div>
            <div className="input-wrapper">
              <Receipt className="input-icon" size={20} />
              <input
                id="tax"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="styled-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">
              <label htmlFor="people">Number of People</label>
              {isPeopleInvalid && <span className="error-text">Can't be zero</span>}
            </div>
            <div className="input-wrapper">
              <Users className="input-icon" size={20} />
              <input
                id="people"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className={`styled-input ${isPeopleInvalid ? 'error' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="card results-card">
          {baseCurrency !== targetCurrency && (
            <div style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--accent)' }}>
              Values converted from {baseCurrency} to {targetCurrency}
            </div>
          )}

          <div className="result-row">
            <div className="result-label">
              <h3>Subtotal</h3>
            </div>
            <div className="result-value">
              {formatCurrency(billValTarget, targetCurrency)}
            </div>
          </div>
          
          <div className="result-row">
            <div className="result-label">
              <h3>Tax / Service</h3>
            </div>
            <div className="result-value">
              {formatCurrency(taxValTarget, targetCurrency)}
            </div>
          </div>

          <div className="result-row">
            <div className="result-label">
              <h3>Tip Amount</h3>
            </div>
            <div className="result-value">
              {formatCurrency(tipAmountTarget, targetCurrency)}
            </div>
          </div>
          
          <div className="result-row">
            <div className="result-label">
              <h3>Total Amount</h3>
            </div>
            <div className="result-value">
              {formatCurrency(totalAmountTarget, targetCurrency)}
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <div className="toggle-wrapper">
              <label htmlFor="roundUp" style={{ fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                Round Per Person Up
              </label>
              <label className="toggle-switch">
                <input
                  id="roundUp"
                  type="checkbox"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="result-row total">
            <div className="result-label">
              <h3>Per Person</h3>
              <p>Amount to pay</p>
            </div>
            <div className="result-value large">
              {formatCurrency(perPersonAmountTarget, targetCurrency)}
            </div>
          </div>

          <button className="btn-primary" onClick={handleCopy}>
            <Copy size={20} />
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
          
          <button className="btn-secondary" onClick={handleReset}>
            <RefreshCw size={20} />
            Reset
          </button>
        </div>
      </main>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Enter bill amount</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Add tip or tax if needed</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>See the amount each person should pay</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <a 
          href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="digital-heroes-btn"
        >
          Built for Digital Heroes
        </a>
        <p>Built by Mathesh </p>
        <p>Email: mathessz2006@gmail.com</p>
        <p style={{ fontSize: '0.875rem', marginTop: '1rem', opacity: 0.8 }}>
          This project was built for the Digital Heroes trial
        </p>
      </footer>
    </div>
  );
}

export default App;
