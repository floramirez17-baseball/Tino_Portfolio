import { useState, useEffect } from 'react';

const TICKERS = [
  'NVDA','AMD','TSMC','PLTR','SPY','QQQ',
  'O','WPC','PLD','EQIX','VNQ','WY','WELL','VTR','EXR','ESS','CBRE','JLL',
];

function useQuotes() {
  const [quotes, setQuotes] = useState(() =>
    TICKERS.map(s => ({ symbol: s, price: null, change: null, changePercent: null }))
  );

  useEffect(() => {
    const fill = () =>
      setQuotes(TICKERS.map(s => ({
        symbol: s,
        price: +(Math.random() * 280 + 30).toFixed(2),
        change: +(Math.random() * 12 - 6).toFixed(2),
        changePercent: +(Math.random() * 5 - 2.5).toFixed(2),
      })));

    fill();
    const id = setInterval(fill, 300_000);
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
