import { useState, useEffect } from 'react';

const TICKERS = [
  'NVDA','MSFT','PLTR','LITE','JLL',
  'VNQ','JNJ','LLY','WY','CBRE',
];

const API_KEY = import.meta.env.VITE_FINNHUB_KEY;

function useQuotes() {
  const [quotes, setQuotes] = useState(() =>
    TICKERS.map(s => ({ symbol: s, price: null, change: null, changePercent: null }))
  );

  useEffect(() => {
    let cancelled = false;

    const fetchOne = async (symbol) => {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const d = await res.json();
      if (!d.c) throw new Error('no price');
      return { symbol, price: d.c, change: d.d, changePercent: d.dp };
    };

    const fetchAll = async () => {
      for (const s of TICKERS) {
        if (cancelled) return;
        try {
          const q = await fetchOne(s);
          if (cancelled) return;
          setQuotes(prev => prev.map(p => p.symbol === s ? q : p));
        } catch {
          // keep previous value on failure (rate-limit, stale, etc.)
        }
        await new Promise(r => setTimeout(r, 120));
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 300_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return quotes;
}

export default function TickerTape() {
  const quotes = useQuotes();

  const items = [...quotes, ...quotes];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((q, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-symbol">{q.symbol}</span>
            {q.price !== null && (
              <>
                <span className="ticker-price">${q.price.toFixed(2)}</span>
                <span className={q.change >= 0 ? 'ticker-change-pos' : 'ticker-change-neg'}>
                  {q.change >= 0 ? '+' : ''}{q.change.toFixed(2)} ({q.changePercent.toFixed(2)}%)
                </span>
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
