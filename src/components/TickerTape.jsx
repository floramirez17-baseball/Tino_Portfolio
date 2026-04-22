import { useState, useEffect } from 'react';

const TICKERS = [
  'NVDA','AMD','TSM','PLTR','SPY','QQQ',
  'O','WPC','PLD','EQIX','VNQ','WY','WELL','VTR','EXR','ESS','CBRE','JLL',
];

const API_KEY = import.meta.env.VITE_FINNHUB_KEY;

function useQuotes() {
  const [quotes, setQuotes] = useState(() =>
    TICKERS.map(s => ({ symbol: s, price: null, change: null, changePercent: null }))
  );

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        TICKERS.map(s =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${API_KEY}`)
            .then(r => r.json())
            .then(d => ({ symbol: s, price: d.c, change: d.d, changePercent: d.dp }))
        )
      );
      setQuotes(
        results.map((r, i) =>
          r.status === 'fulfilled' && r.value.price
            ? r.value
            : { symbol: TICKERS[i], price: null, change: null, changePercent: null }
        )
      );
    };

    fetchAll();
    const id = setInterval(fetchAll, 300_000);
    return () => clearInterval(id);
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
