# app.py
# -------------------------------------------------------
# Streamlit stock analysis dashboard — multi-ticker edition
# Run with:  uv run streamlit run app.py
# -------------------------------------------------------

import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
from datetime import date, timedelta
import math
import time
import numpy as np
from scipy import stats
from scipy.optimize import minimize

# ---------------------------------------------------------------------------
# Patch yfinance's underlying requests session with a browser User-Agent.
# Yahoo Finance blocks requests from cloud datacenter IPs (Streamlit Cloud /
# AWS) that don't look like a real browser. Patching here is version-agnostic
# and does NOT require passing a session kwarg to yf.download().
# ---------------------------------------------------------------------------
try:
    import requests as _req
    _UA = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
    # yfinance ≥ 0.2 exposes a shared cache/session via yfinance.utils
    import yfinance.utils as _yfu
    if hasattr(_yfu, "requests"):
        _yfu.requests.utils.default_user_agent = lambda: _UA
except Exception:
    pass

# -- Page configuration ----------------------------------
st.set_page_config(page_title="Stock Analysis Dashboard", layout="wide")
st.title("Stock Analysis Dashboard")

# ================================================================
# SIDEBAR: All user inputs + About section
# ================================================================
st.sidebar.header("Configuration")

tickers_input = st.sidebar.text_input(
    "Stock Tickers (3–10, comma-separated)",
    value="AAPL, MSFT, GOOGL",
    help="Enter 3–10 valid Yahoo Finance tickers separated by commas (e.g. AAPL, MSFT, TSLA, AMZN)",
)

# Default date range: two years back from today
default_start = date.today() - timedelta(days=730)
start_date = st.sidebar.date_input("Start Date", value=default_start, min_value=date(1900, 1, 1))
end_date = st.sidebar.date_input("End Date", value=date.today())

# Risk-free rate input
risk_free_rate = st.sidebar.number_input(
    "Risk-Free Rate (Annual %)",
    value=2.0,
    min_value=0.0,
    max_value=100.0,
    step=0.1,
    help="Annualized risk-free rate used for Sharpe/Sortino calculations.",
) / 100.0

st.sidebar.divider()

# ----------------------------------------------------------------
# About & Methodology (sidebar expander)
# ----------------------------------------------------------------
with st.sidebar.expander("About & Methodology", expanded=False):
    st.markdown("""
**Data Source**
All price data is sourced from [Yahoo Finance](https://finance.yahoo.com/) via the `yfinance` library. Prices are **adjusted closing prices** (splits and dividends accounted for). The S&P 500 (`^GSPC`) is included automatically as a benchmark.

---

**Key Assumptions**
- **Returns**: Simple (arithmetic) daily returns: rₜ = (Pₜ − Pₜ₋₁) / Pₜ₋₁
- **Annualization**: Assumes 252 trading days per year.
- **Risk-free rate**: User-configurable annual rate, converted to daily based on 252 days.
- **No short-selling**: Portfolio optimization enforces weights in [0, 1]

---

**Analytical Methods**

*Sharpe Ratio*: Annualized excess return over the risk-free rate, divided by annualized volatility.

*Sortino Ratio*: Like Sharpe, but divides only by **downside** deviation (negative excess returns).

*Drawdown*: Percentage decline from the rolling peak price. Maximum drawdown is the worst such decline in the period.

*Global Minimum Variance (GMV)*: Minimizes portfolio variance subject to weights summing to 1, with no shorting. Uses `scipy.optimize.minimize` (SLSQP).

*Maximum Sharpe (Tangency)*: Maximizes the Sharpe ratio subject to the same constraints.

*Risk Contribution (PRC)*: Measures each asset's fractional contribution to total portfolio variance. PRCᵢ = (wᵢ × (Σw)ᵢ) / σ²ₚ.

*HHI*: Herfindahl-Hirschman Index of risk concentration. Equal risk contribution gives HHI = 1/N.

---

**Limitations**
- Historical performance does not predict future results.
- Optimization uses sample statistics which may not be stable out-of-sample.
""")

# ================================================================
# INPUT VALIDATION
# ================================================================
# Parse and deduplicate tickers (accept commas or spaces as separators)
raw_tickers = [t.strip().upper() for t in tickers_input.replace(";", ",").split(",") if t.strip()]
seen: set = set()
tickers = [t for t in raw_tickers if not (t in seen or seen.add(t))]

errors = []
if len(tickers) < 3:
    errors.append(f"Please enter **at least 3** ticker symbols (you entered {len(tickers)}).")
elif len(tickers) > 10:
    errors.append(
        f"Please enter **no more than 10** ticker symbols "
        f"(you entered {len(tickers)} — remove {len(tickers) - 10})."
    )

if start_date is None or end_date is None:
    errors.append("Please select both a **Start Date** and an **End Date**.")
elif start_date >= end_date:
    errors.append("Start date must be **before** end date.")
elif (end_date - start_date).days < 730:
    errors.append("Date range must be at least 2 years (730 days) for meaningful analysis.")

if errors:
    for err in errors:
        st.error(err)
    st.info("Adjust the settings in the sidebar and the analysis will update automatically.")
    st.stop()

# ================================================================
# DATA LOADING FUNCTIONS
# ================================================================
def _yf_download(symbol: str, start: date, end: date) -> pd.DataFrame:
    """
    Download OHLCV data with up to 3 attempts and exponential backoff.
    Primary method: yf.download()
    Fallback:       yf.Ticker().history()  (different code path in yfinance)
    """
    for attempt in range(3):
        # --- primary ---
        try:
            df = yf.download(symbol, start=start, end=end,
                             progress=False, auto_adjust=True)
            if df is not None and not df.empty:
                return df
        except Exception:
            pass

        # --- fallback ---
        try:
            df = yf.Ticker(symbol).history(start=str(start), end=str(end),
                                           auto_adjust=True)
            if df is not None and not df.empty:
                return df
        except Exception:
            pass

        if attempt < 2:
            time.sleep(2 ** attempt)   # 1 s, then 2 s

    return pd.DataFrame()


@st.cache_data(show_spinner=False, ttl=3600)
def load_data(ticker: str, start: date, end: date):
    """Download adjusted closing prices from Yahoo Finance."""
    try:
        df = _yf_download(ticker, start, end)
        if df.empty:
            return None, "no_data"
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        result = df[["Close"]].copy()
        result.columns = [ticker]
        return result, None
    except Exception as e:
        return None, str(e)


@st.cache_data(show_spinner=False, ttl=3600)
def load_benchmark(start: date, end: date):
    """Download S&P 500 benchmark data."""
    try:
        df = _yf_download("^GSPC", start, end)
        if df.empty:
            return None
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        result = df[["Close"]].copy()
        result.columns = ["SP500"]
        return result
    except Exception:
        return None


def handle_partial_data(data_dict: dict, max_missing_pct: float = 5.0):
    """Combine multiple data series; warn about and drop tickers with heavy missing data."""
    if not data_dict:
        return None

    combined = pd.concat(data_dict.values(), axis=1)

    overlap_start = combined.apply(lambda s: s.first_valid_index()).max()
    overlap_end = combined.apply(lambda s: s.last_valid_index()).min()

    if pd.isna(overlap_start) or pd.isna(overlap_end) or overlap_start >= overlap_end:
        return None

    combined = combined.loc[overlap_start:overlap_end]
    missing_pct = (combined.isnull().sum() / len(combined)) * 100
    bad_tickers = missing_pct[missing_pct > max_missing_pct]
    good_tickers = missing_pct[missing_pct <= max_missing_pct].index

    if len(bad_tickers) > 0:
        st.warning(
            f"Dropped ticker(s) with >{max_missing_pct}% missing data "
            f"in the overlapping range: {', '.join(bad_tickers.index)}"
        )

    if not good_tickers.any():
        return None

    combined = combined[good_tickers]

    if combined.isnull().any().any():
        st.info(
            f"Data aligned to overlapping date range: "
            f"{combined.dropna().index[0].date()} → {combined.dropna().index[-1].date()}"
        )

    return combined.dropna()


# ================================================================
# ANALYTICS HELPER FUNCTIONS
# ================================================================
def calculate_drawdown(prices: pd.Series) -> pd.Series:
    running_max = prices.expanding().max()
    return (prices - running_max) / running_max * 100


def calculate_sharpe_ratio(returns: pd.Series, rf: float, days_per_year: float) -> float:
    daily_rf = rf / days_per_year
    excess = returns - daily_rf
    if excess.std() == 0:
        return 0.0
    return float((excess.mean() / excess.std()) * math.sqrt(days_per_year))


def calculate_sortino_ratio(returns: pd.Series, rf: float, days_per_year: float) -> float:
    daily_rf = rf / days_per_year
    excess = returns - daily_rf
    downside = excess[excess < 0]
    if len(downside) == 0:
        return 0.0
    downside_dev = math.sqrt((downside ** 2).mean())
    if downside_dev == 0:
        return 0.0
    return float((excess.mean() / downside_dev) * math.sqrt(days_per_year))


def portfolio_volatility(weights, cov_matrix):
    return float(np.sqrt(weights @ cov_matrix @ weights))


def portfolio_return(weights, mean_returns):
    return float(weights @ mean_returns)


def negative_sharpe_ratio(weights, mean_returns, cov_matrix, rf_rate):
    p_ret = portfolio_return(weights, mean_returns)
    p_vol = portfolio_volatility(weights, cov_matrix)
    return -(p_ret - rf_rate) / p_vol if p_vol > 0 else 0.0


def calculate_portfolio_metrics(weights, returns_df, mean_ret, cov_mat, rf_rate, days_per_year):
    p_returns = weights @ returns_df.T
    p_return_annual = float(p_returns.mean() * days_per_year)
    p_vol = portfolio_volatility(weights, cov_mat)
    p_sharpe = (p_return_annual - rf_rate) / p_vol if p_vol > 0 else 0.0

    p_excess = p_returns - (rf_rate / days_per_year)
    p_downside = p_excess[p_excess < 0]
    p_sortino = 0.0
    if len(p_downside) > 0:
        p_downside_dev = float(np.sqrt((p_downside ** 2).mean()))
        p_sortino = float((p_excess.mean() / p_downside_dev) * np.sqrt(days_per_year)) if p_downside_dev > 0 else 0.0

    p_wealth = (1 + p_returns).cumprod()
    p_drawdown = calculate_drawdown(pd.Series(p_wealth.values))
    p_max_dd = float(p_drawdown.min())

    return {
        "return": p_return_annual,
        "volatility": p_vol,
        "sharpe": p_sharpe,
        "sortino": p_sortino,
        "max_dd": p_max_dd,
        "wealth": p_wealth,
    }


def calculate_risk_contribution(weights, cov_matrix):
    weights = np.asarray(weights).flatten()
    cov_matrix = np.asarray(cov_matrix)
    p_vol = float(np.sqrt(weights @ cov_matrix @ weights))
    p_var = p_vol ** 2
    mcr = cov_matrix @ weights
    cr = weights * mcr
    prc = cr / p_var if p_var > 0 else cr
    return np.asarray(prc).flatten(), np.asarray(cr).flatten(), p_vol


@st.cache_data(show_spinner=False)
def run_optimization(returns_df: pd.DataFrame, rf: float, tpyr: int) -> dict:
    """Compute GMV, tangency weights, and efficient frontier (all annualized)."""
    mean_ret = returns_df.mean() * tpyr
    cov = returns_df.cov() * tpyr
    n = len(returns_df.columns)
    bounds = tuple((0.0, 1.0) for _ in range(n))
    eq_con = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
    init_w = np.full(n, 1.0 / n)

    gmv_res = minimize(
        portfolio_volatility, init_w, args=(cov,), method="SLSQP",
        bounds=bounds, constraints=eq_con, options={"ftol": 1e-12, "maxiter": 1000},
    )
    gmv_w = gmv_res.x if gmv_res.success else init_w.copy()

    ms_res = minimize(
        negative_sharpe_ratio, init_w, args=(mean_ret, cov, rf), method="SLSQP",
        bounds=bounds, constraints=eq_con, options={"ftol": 1e-12, "maxiter": 1000},
    )
    ms_w = ms_res.x if ms_res.success else init_w.copy()

    # Efficient frontier: trace min-variance portfolio for each target return
    gmv_ret = float(portfolio_return(gmv_w, mean_ret))
    max_ret = max(float(mean_ret.max()), gmv_ret + 0.01)
    ef_vols, ef_rets = [], []
    for tr in np.linspace(gmv_ret, max_ret, 80):
        cons = [
            eq_con,
            {"type": "eq", "fun": lambda w, t=tr: float(portfolio_return(w, mean_ret)) - t},
        ]
        res = minimize(
            portfolio_volatility, init_w, args=(cov,), method="SLSQP",
            bounds=bounds, constraints=cons, options={"ftol": 1e-9, "maxiter": 500},
        )
        if res.success:
            ef_vols.append(float(portfolio_volatility(res.x, cov)))
            ef_rets.append(float(tr))

    return {
        "gmv_w": gmv_w, "gmv_ok": gmv_res.success,
        "ms_w": ms_w,  "ms_ok": ms_res.success,
        "mean_ret": mean_ret, "cov": cov,
        "ef_vols": ef_vols, "ef_rets": ef_rets,
    }


# ================================================================
# DATA LOADING
# ================================================================
loaded_data: dict = {}
failed_tickers: list = []

with st.spinner("Fetching stock data..."):
    for t in tickers:
        data, err = load_data(t, start_date, end_date)
        if err or data is None:
            failed_tickers.append(t)
        else:
            loaded_data[t] = data

if failed_tickers:
    st.warning(f"Could not load data for: **{', '.join(failed_tickers)}**. These tickers will be excluded.")

valid_user_tickers = [t for t in tickers if t in loaded_data]

if len(valid_user_tickers) < 3:
    st.error(
        f"Only **{len(valid_user_tickers)}** ticker(s) returned valid data — need at least 3. "
        "Check your ticker symbols and date range."
    )
    st.stop()

benchmark_data = load_benchmark(start_date, end_date)
if benchmark_data is not None:
    loaded_data["SP500"] = benchmark_data

df = handle_partial_data(loaded_data)

if df is None or df.empty:
    st.error("No overlapping data found for the selected date range. Try widening the date range.")
    st.stop()

# Re-check that at least 3 user tickers survived the overlap alignment
user_cols = [t for t in valid_user_tickers if t in df.columns]
if len(user_cols) < 3:
    st.error(
        f"After aligning date ranges, only **{len(user_cols)}** ticker(s) have overlapping data. "
        "Try a narrower date range or different tickers."
    )
    st.stop()

if len(df) < 30:
    st.warning(f"Only {len(df)} trading days found for this date range. Results may be unreliable.")

price_cols = list(df.columns)  # user tickers + SP500 if available

# ================================================================
# MAIN TABS
# ================================================================
TRADING_DAYS_PER_YEAR = 252

tab_overview, tab_performance, tab_risk, tab_corr, tab_portfolio = st.tabs([
    "Overview",
    "Price & Performance",
    "Risk Analysis",
    "Correlation & Covariance",
    "Portfolio Optimization",
])

# ================================================================
# TAB 1: OVERVIEW
# ================================================================
with tab_overview:
    st.header("Overview")

    primary_ticker = st.selectbox(
        "Select ticker for detailed metrics:",
        options=user_cols,
        index=0,
        key="overview_primary",
    )

    st.caption(
        f"Data range: {df.index[0].date()} → {df.index[-1].date()}  |  "
        f"{len(df)} trading days  |  Risk-free rate: {risk_free_rate:.2%} p.a."
    )

    # Key metrics for the selected primary ticker
    pt_prices = df[primary_ticker]
    pt_returns = pt_prices.pct_change().dropna()
    latest_close    = float(pt_prices.iloc[-1])
    total_return    = (latest_close / float(pt_prices.iloc[0])) - 1
    ann_volatility  = float(pt_returns.std()) * math.sqrt(TRADING_DAYS_PER_YEAR)
    max_close       = float(pt_prices.max())
    min_close       = float(pt_prices.min())
    sharpe_ratio    = calculate_sharpe_ratio(pt_returns, risk_free_rate, TRADING_DAYS_PER_YEAR)
    sortino_ratio   = calculate_sortino_ratio(pt_returns, risk_free_rate, TRADING_DAYS_PER_YEAR)
    max_drawdown    = float(calculate_drawdown(pt_prices).min())

    c1, c2, c3 = st.columns(3)
    c1.metric("Latest Close", f"${latest_close:,.2f}")
    c2.metric("Total Return", f"{total_return:.2%}")
    c3.metric("Annualized Volatility", f"{ann_volatility:.2%}")

    c4, c5, c6 = st.columns(3)
    c4.metric("Period High", f"${max_close:,.2f}")
    c5.metric("Period Low", f"${min_close:,.2f}")
    c6.metric("Sharpe Ratio", f"{sharpe_ratio:.2f}")

    c7, c8, c9 = st.columns(3)
    c7.metric("Sortino Ratio", f"{sortino_ratio:.2f}")
    c8.metric("Max Drawdown", f"{max_drawdown:.2f}%")
    c9.metric("Trading Days", f"{len(df)}")

    st.divider()

    st.subheader("Closing Price History")
    fig_price = go.Figure()
    fig_price.add_trace(go.Scatter(
        x=df.index, y=df[primary_ticker],
        mode="lines", name=primary_ticker,
        line=dict(width=1.8, color="royalblue"),
    ))
    fig_price.update_layout(
        title=f"{primary_ticker} — Adjusted Closing Price",
        xaxis_title="Date",
        yaxis_title="Price (USD)",
        template="plotly_white",
        height=420,
        hovermode="x unified",
    )
    st.plotly_chart(fig_price, use_container_width=True)

    st.divider()

    st.subheader("Summary Statistics — All Tickers")
    summary_rows = []
    for col in price_cols:
        ret = df[col].pct_change().dropna()
        summary_rows.append({
            "Ticker":           col,
            "Ann. Mean Return": f"{ret.mean() * TRADING_DAYS_PER_YEAR:.2%}",
            "Ann. Volatility":  f"{ret.std() * math.sqrt(TRADING_DAYS_PER_YEAR):.2%}",
            "Sharpe Ratio":     f"{calculate_sharpe_ratio(ret, risk_free_rate, TRADING_DAYS_PER_YEAR):.4f}",
            "Sortino Ratio":    f"{calculate_sortino_ratio(ret, risk_free_rate, TRADING_DAYS_PER_YEAR):.4f}",
            "Skewness":         f"{ret.skew():.4f}",
            "Excess Kurtosis":  f"{ret.kurtosis():.4f}",
            "Min Daily Return": f"{ret.min():.2%}",
            "Max Daily Return": f"{ret.max():.2%}",
        })
    st.dataframe(pd.DataFrame(summary_rows), use_container_width=True, hide_index=True)


# ================================================================
# TAB 2: PRICE & PERFORMANCE
# ================================================================
with tab_performance:
    st.header("Price & Performance")

    # ---- Cumulative Wealth Index ----------------------------------------
    st.subheader("Cumulative Wealth Index")
    st.caption("Growth of a hypothetical $10,000 initial investment.")

    selected_tickers = st.multiselect(
        "Tickers to display:",
        options=price_cols,
        default=price_cols,
        key="wealth_multiselect",
    )

    if not selected_tickers:
        st.warning("Select at least one ticker to display the wealth index.")
    else:
        wealth_df = pd.DataFrame(index=df.index)
        for t in selected_tickers:
            wealth_df[t] = (1 + df[t].pct_change()).cumprod() * 10_000

        fig_wealth = go.Figure()
        for t in selected_tickers:
            fig_wealth.add_trace(go.Scatter(
                x=wealth_df.index, y=wealth_df[t],
                mode="lines", name=t, line=dict(width=2),
            ))
        fig_wealth.update_layout(
            title="Cumulative Wealth Index — $10,000 Initial Investment",
            xaxis_title="Date",
            yaxis_title="Portfolio Value (USD)",
            template="plotly_white",
            height=450,
            hovermode="x unified",
        )
        st.plotly_chart(fig_wealth, use_container_width=True)

    st.divider()

    # ---- Rolling Volatility ---------------------------------------------
    st.subheader("Rolling Annualized Volatility")

    window_length = st.select_slider(
        "Rolling window (trading days):",
        options=[20, 30, 60, 90, 120],
        value=30,
        key="vol_window",
    )

    if len(df) <= window_length:
        st.warning(f"Not enough data for a {window_length}-day rolling window. Try a shorter window or wider date range.")
    else:
        with st.spinner("Computing rolling volatility…"):
            rolling_vol_df = pd.DataFrame(index=df.index)
            for t in price_cols:
                rolling_vol_df[t] = (
                    df[t].pct_change().rolling(window=window_length).std()
                    * math.sqrt(TRADING_DAYS_PER_YEAR)
                )

        fig_vol = go.Figure()
        for t in price_cols:
            fig_vol.add_trace(go.Scatter(
                x=rolling_vol_df.index, y=rolling_vol_df[t],
                mode="lines", name=t, line=dict(width=2),
            ))
        fig_vol.update_layout(
            title=f"Rolling Annualized Volatility ({window_length}-day window)",
            xaxis_title="Date",
            yaxis_title="Annualized Volatility",
            template="plotly_white",
            height=430,
            hovermode="x unified",
        )
        st.plotly_chart(fig_vol, use_container_width=True)

    st.divider()

    # ---- S&P 500 Benchmark ----------------------------------------------
    if "SP500" in df.columns:
        st.subheader("S&P 500 Benchmark Comparison")

        bench_ticker = st.selectbox(
            "Select ticker to compare against S&P 500:",
            options=user_cols,
            index=0,
            key="bench_compare",
        )

        fig_bench = go.Figure()
        norm_stock = df[bench_ticker] / df[bench_ticker].iloc[0] * 100
        norm_sp500 = df["SP500"] / df["SP500"].iloc[0] * 100

        fig_bench.add_trace(go.Scatter(
            x=df.index, y=norm_stock,
            mode="lines", name=bench_ticker,
            line=dict(width=2, color="royalblue"),
        ))
        fig_bench.add_trace(go.Scatter(
            x=df.index, y=norm_sp500,
            mode="lines", name="S&P 500",
            line=dict(width=2, color="orange", dash="dash"),
        ))
        fig_bench.update_layout(
            title=f"{bench_ticker} vs S&P 500 — Normalized to 100",
            xaxis_title="Date",
            yaxis_title="Indexed Price (Base = 100)",
            template="plotly_white",
            height=430,
            hovermode="x unified",
        )
        st.plotly_chart(fig_bench, use_container_width=True)
    else:
        st.info("S&P 500 benchmark data could not be loaded for this date range.")


# ================================================================
# TAB 3: RISK ANALYSIS
# ================================================================
with tab_risk:
    st.header("Risk Analysis")

    risk_tab1, risk_tab2 = st.tabs([
        "Drawdown", "Return Distribution"
    ])

    # ---- Drawdown -------------------------------------------------------
    with risk_tab1:
        st.subheader("Drawdown Analysis")
        st.caption("Percentage decline from the rolling peak price.")

        drawdown_ticker = st.selectbox(
            "Select ticker for drawdown analysis:",
            options=price_cols,
            index=0,
            key="drawdown_ticker",
        )

        dd = calculate_drawdown(df[drawdown_ticker])
        max_dd = float(dd.min())

        d1, d2, d3 = st.columns(3)
        d1.metric("Maximum Drawdown", f"{max_dd:.2f}%")
        d2.metric("Current Drawdown", f"{dd.iloc[-1]:.2f}%")
        d3.metric("Days in Data", f"{len(df)}")

        fig_dd = go.Figure()
        fig_dd.add_trace(go.Scatter(
            x=df.index, y=dd,
            mode="lines", name="Drawdown",
            fill="tozeroy",
            line=dict(color="crimson", width=1),
            fillcolor="rgba(220,20,60,0.18)",
        ))
        fig_dd.add_hline(
            y=max_dd,
            line_dash="dash", line_color="darkred",
            annotation_text=f"Max: {max_dd:.2f}%",
            annotation_position="right",
        )
        fig_dd.update_layout(
            title=f"Drawdown from Running Peak — {drawdown_ticker}",
            xaxis_title="Date",
            yaxis_title="Drawdown (%)",
            template="plotly_white",
            height=430,
        )
        st.plotly_chart(fig_dd, use_container_width=True)

    # ---- Return Distribution --------------------------------------------
    with risk_tab2:
        st.subheader("Return Distribution Analysis")

        dist_ticker = st.selectbox(
            "Select ticker:",
            options=price_cols,
            index=0,
            key="dist_ticker",
        )
        plot_type = st.radio(
            "View:",
            options=["Histogram with Normal Fit", "Q-Q Plot"],
            horizontal=True,
            key="dist_plot_type",
        )

        ret_dist = df[dist_ticker].pct_change().dropna()

        if len(ret_dist) < 10:
            st.warning("Not enough return data for distribution analysis.")
        else:
            if plot_type == "Histogram with Normal Fit":
                mu, sigma = ret_dist.mean(), ret_dist.std()
                x_range = np.linspace(ret_dist.min(), ret_dist.max(), 200)
                normal_pdf = stats.norm.pdf(x_range, mu, sigma)

                fig_hist = go.Figure()
                fig_hist.add_trace(go.Histogram(
                    x=ret_dist, nbinsx=60, name="Daily Returns",
                    opacity=0.70, histnorm="probability density",
                    marker_color="steelblue",
                ))
                fig_hist.add_trace(go.Scatter(
                    x=x_range, y=normal_pdf,
                    mode="lines", name="Normal Fit",
                    line=dict(color="red", width=2),
                ))
                fig_hist.update_layout(
                    title=f"Daily Return Distribution — {dist_ticker}",
                    xaxis_title="Daily Return",
                    yaxis_title="Probability Density",
                    template="plotly_white",
                    height=430,
                    barmode="overlay",
                )
                st.plotly_chart(fig_hist, use_container_width=True)

                s1, s2, s3, s4 = st.columns(4)
                s1.metric("Mean", f"{mu:.4%}")
                s2.metric("Std Dev", f"{sigma:.4%}")
                s3.metric("Skewness", f"{ret_dist.skew():.4f}")
                s4.metric("Excess Kurtosis", f"{ret_dist.kurtosis():.4f}")

            else:  # Q-Q Plot
                quantiles, _ = stats.probplot(ret_dist)
                th_q, sample_q = quantiles[0], quantiles[1]
                min_v = min(th_q.min(), sample_q.min())
                max_v = max(th_q.max(), sample_q.max())

                fig_qq = go.Figure()
                fig_qq.add_trace(go.Scatter(
                    x=th_q, y=sample_q,
                    mode="markers", name="Data",
                    marker=dict(size=5, color="steelblue", opacity=0.7),
                ))
                fig_qq.add_trace(go.Scatter(
                    x=[min_v, max_v], y=[min_v, max_v],
                    mode="lines", name="Normal Reference",
                    line=dict(color="red", width=2),
                ))
                fig_qq.update_layout(
                    title=f"Q-Q Plot — {dist_ticker}",
                    xaxis_title="Theoretical Quantiles",
                    yaxis_title="Sample Quantiles",
                    template="plotly_white",
                    height=430,
                )
                st.plotly_chart(fig_qq, use_container_width=True)

        st.divider()
        st.subheader("Risk-Adjusted Metrics — All Tickers")
        st.caption(f"Risk-free rate: {risk_free_rate:.2%} p.a.")

        ra_rows = []
        for col in price_cols:
            ret = df[col].pct_change().dropna()
            ra_rows.append({
                "Ticker":          col,
                "Ann. Return":     f"{ret.mean() * TRADING_DAYS_PER_YEAR:.2%}",
                "Ann. Volatility": f"{ret.std() * math.sqrt(TRADING_DAYS_PER_YEAR):.2%}",
                "Sharpe Ratio":    f"{calculate_sharpe_ratio(ret, risk_free_rate, TRADING_DAYS_PER_YEAR):.4f}",
                "Sortino Ratio":   f"{calculate_sortino_ratio(ret, risk_free_rate, TRADING_DAYS_PER_YEAR):.4f}",
            })
        st.dataframe(pd.DataFrame(ra_rows), use_container_width=True, hide_index=True)


# ================================================================
# TAB 4: CORRELATION & COVARIANCE
# ================================================================
with tab_corr:
    st.header("Correlation & Covariance")

    if len(price_cols) < 2:
        st.info("Correlation analysis requires at least two data series.")
    else:
        returns_df = pd.DataFrame({c: df[c].pct_change() for c in price_cols}).dropna()
        corr_matrix = returns_df.corr()
        cov_matrix_daily = returns_df.cov()

        corr_subtab1, corr_subtab2, corr_subtab3 = st.tabs([
            "Correlation Heatmap", "Rolling Correlation", "Covariance Matrix"
        ])

        with corr_subtab1:
            fig_corr = go.Figure(data=go.Heatmap(
                z=corr_matrix.values,
                x=list(corr_matrix.columns),
                y=list(corr_matrix.index),
                colorscale="RdBu",
                zmid=0, zmin=-1, zmax=1,
                text=np.round(corr_matrix.values, 3),
                texttemplate="%{text}",
                textfont={"size": 11},
                colorbar=dict(title="Correlation"),
            ))
            fig_corr.update_layout(
                title="Pairwise Correlation Matrix of Daily Returns",
                xaxis_title="Asset",
                yaxis_title="Asset",
                template="plotly_white",
                height=480,
            )
            st.plotly_chart(fig_corr, use_container_width=True)
            st.caption("**Full Correlation Matrix**")
            st.dataframe(corr_matrix.style.format("{:.4f}"), use_container_width=True)

        with corr_subtab2:
            ca, cb = st.columns(2)
            with ca:
                stock_a = st.selectbox(
                    "First asset:",
                    options=price_cols,
                    index=0,
                    key="rc_a",
                )
            with cb:
                default_b_idx = 1 if len(price_cols) > 1 else 0
                stock_b = st.selectbox(
                    "Second asset:",
                    options=price_cols,
                    index=default_b_idx,
                    key="rc_b",
                )

            rc_window = st.select_slider(
                "Rolling window (days):",
                options=[20, 30, 60, 90, 120],
                value=60,
                key="rc_window",
            )

            if stock_a == stock_b:
                st.warning("Please select two **different** assets.")
            elif len(df) <= rc_window:
                st.warning(f"Not enough data for a {rc_window}-day rolling window.")
            else:
                rolling_corr = returns_df[stock_a].rolling(rc_window).corr(returns_df[stock_b])

                fig_rc = go.Figure()
                fig_rc.add_trace(go.Scatter(
                    x=rolling_corr.index, y=rolling_corr.values,
                    mode="lines", name=f"{stock_a} vs {stock_b}",
                    line=dict(width=2, color="steelblue"),
                    fill="tozeroy", fillcolor="rgba(70,130,180,0.18)",
                ))
                fig_rc.add_hline(
                    y=0, line_dash="dash", line_color="gray",
                    annotation_text="Zero Correlation",
                )
                fig_rc.update_layout(
                    title=f"Rolling {rc_window}-day Correlation: {stock_a} vs {stock_b}",
                    xaxis_title="Date",
                    yaxis_title="Correlation",
                    template="plotly_white",
                    height=430,
                    hovermode="x unified",
                    yaxis=dict(range=[-1, 1]),
                )
                st.plotly_chart(fig_rc, use_container_width=True)

                valid_corr = rolling_corr.dropna()
                if len(valid_corr) > 0:
                    rc1, rc2, rc3, rc4 = st.columns(4)
                    rc1.metric("Current", f"{valid_corr.iloc[-1]:.4f}")
                    rc2.metric("Mean", f"{valid_corr.mean():.4f}")
                    rc3.metric("Max", f"{valid_corr.max():.4f}")
                    rc4.metric("Min", f"{valid_corr.min():.4f}")

        with corr_subtab3:
            cov_annual = cov_matrix_daily * TRADING_DAYS_PER_YEAR

            fig_cov = go.Figure(data=go.Heatmap(
                z=cov_annual.values,
                x=list(cov_annual.columns),
                y=list(cov_annual.index),
                colorscale="Viridis",
                text=np.round(cov_annual.values, 6),
                texttemplate="%{text}",
                textfont={"size": 9},
                colorbar=dict(title="Covariance"),
            ))
            fig_cov.update_layout(
                title="Annualized Covariance Matrix of Daily Returns",
                xaxis_title="Asset",
                yaxis_title="Asset",
                template="plotly_white",
                height=480,
            )
            st.plotly_chart(fig_cov, use_container_width=True)

            st.caption("**Daily Covariance Matrix**")
            st.dataframe(cov_matrix_daily.style.format("{:.8f}"), use_container_width=True)
            st.caption(f"**Annualized Covariance Matrix** (× {TRADING_DAYS_PER_YEAR})")
            st.dataframe(cov_annual.style.format("{:.6f}"), use_container_width=True)


# ================================================================
# TAB 5: PORTFOLIO OPTIMIZATION
# ================================================================
with tab_portfolio:
    st.header("Portfolio Optimization")
    st.caption(
        "Mean-variance optimization constructs portfolios on the **efficient frontier** — "
        "the set of portfolios offering the highest return for a given level of risk. "
        "No short-selling is allowed (all weights ≥ 0)."
    )


    if len(price_cols) < 2:
        st.info("Portfolio analysis requires at least two assets.")
    else:
        returns_opt = pd.DataFrame({c: df[c].pct_change() for c in price_cols}).dropna()
        n_assets = len(price_cols)

        with st.spinner("Running portfolio optimization…"):
            try:
                opt = run_optimization(returns_opt, risk_free_rate, TRADING_DAYS_PER_YEAR)
                gmv_weights        = opt["gmv_w"]
                max_sharpe_weights = opt["ms_w"]
                mean_returns_opt   = opt["mean_ret"]
                cov_opt            = opt["cov"]
                eq_weights         = np.full(n_assets, 1.0 / n_assets)

                eq_metrics  = calculate_portfolio_metrics(eq_weights,         returns_opt, mean_returns_opt, cov_opt, risk_free_rate, TRADING_DAYS_PER_YEAR)
                gmv_metrics = calculate_portfolio_metrics(gmv_weights,        returns_opt, mean_returns_opt, cov_opt, risk_free_rate, TRADING_DAYS_PER_YEAR)
                ms_metrics  = calculate_portfolio_metrics(max_sharpe_weights, returns_opt, mean_returns_opt, cov_opt, risk_free_rate, TRADING_DAYS_PER_YEAR)

                if not opt["gmv_ok"]:
                    st.warning("GMV optimization did not fully converge. Results may be approximate.")
                if not opt["ms_ok"]:
                    st.warning("Max Sharpe optimization did not fully converge. Results may be approximate.")

                optimization_ok = True
            except Exception as e:
                st.error(f"Portfolio optimization failed: {e}")
                optimization_ok = False

        if optimization_ok:
            port_tab1, port_tab2, port_tab3, port_tab4, port_tab5, port_tab6, port_tab7 = st.tabs([
                "Equal-Weight",
                "GMV",
                "Tangency",
                "Custom Portfolio",
                "Efficient Frontier",
                "Comparison",
                "Estimation Window",
            ])

            # ---- Equal-Weight ------------------------------------------
            with port_tab1:
                st.subheader("Equal-Weight Portfolio")
                st.caption("Each asset receives equal weight. Simple, transparent diversification.")

                e1, e2, e3 = st.columns(3)
                e1.metric("Annualized Return",    f"{eq_metrics['return']:.2%}")
                e2.metric("Annualized Volatility", f"{eq_metrics['volatility']:.2%}")
                e3.metric("Sharpe Ratio",          f"{eq_metrics['sharpe']:.4f}")
                e4, e5, e6 = st.columns(3)
                e4.metric("Sortino Ratio",         f"{eq_metrics['sortino']:.4f}")
                e5.metric("Maximum Drawdown",      f"{eq_metrics['max_dd']:.2f}%")
                e6.metric("Weight per Asset",      f"{1 / n_assets:.2%}")

                st.caption("**Portfolio Composition**")
                st.dataframe(
                    pd.DataFrame({"Ticker": price_cols, "Weight": [f"{eq_weights[i]:.2%}" for i in range(n_assets)]}),
                    use_container_width=True, hide_index=True,
                )

                eq_wealth = (1 + (returns_opt @ eq_weights)).cumprod() * 10_000
                fig_eq = go.Figure()
                for t in price_cols:
                    fig_eq.add_trace(go.Scatter(
                        x=returns_opt.index, y=(1 + returns_opt[t]).cumprod() * 10_000,
                        mode="lines", name=t, line=dict(width=1, dash="dot"), opacity=0.45,
                    ))
                fig_eq.add_trace(go.Scatter(
                    x=returns_opt.index, y=eq_wealth,
                    mode="lines", name="Equal-Weight Portfolio",
                    line=dict(width=3, color="royalblue"),
                ))
                fig_eq.update_layout(
                    title="Equal-Weight Portfolio Growth — $10,000 Initial Investment",
                    xaxis_title="Date", yaxis_title="Portfolio Value (USD)",
                    template="plotly_white", height=430, hovermode="x unified",
                )
                st.plotly_chart(fig_eq, use_container_width=True)

            # ---- GMV ---------------------------------------------------
            with port_tab2:
                st.subheader("Global Minimum Variance (GMV) Portfolio")
                st.caption("Minimizes portfolio volatility. No short-selling allowed.")

                g1, g2, g3 = st.columns(3)
                g1.metric("Annualized Return",    f"{gmv_metrics['return']:.2%}")
                g2.metric("Annualized Volatility", f"{gmv_metrics['volatility']:.2%}")
                g3.metric("Sharpe Ratio",          f"{gmv_metrics['sharpe']:.4f}")
                g4, g5, g6 = st.columns(3)
                g4.metric("Sortino Ratio",         f"{gmv_metrics['sortino']:.4f}")
                g5.metric("Maximum Drawdown",      f"{gmv_metrics['max_dd']:.2f}%")

                st.caption("**Portfolio Weights**")
                st.dataframe(
                    pd.DataFrame({"Ticker": price_cols, "Weight": [f"{w:.2%}" for w in gmv_weights]}),
                    use_container_width=True, hide_index=True,
                )

                wp1, wp2 = st.columns(2)
                with wp1:
                    fig_gp = go.Figure(data=[go.Pie(labels=price_cols, values=gmv_weights, hole=0.3)])
                    fig_gp.update_layout(title="GMV Weights — Pie Chart", height=380)
                    st.plotly_chart(fig_gp, use_container_width=True)
                with wp2:
                    fig_gb = go.Figure(data=[go.Bar(x=price_cols, y=gmv_weights, marker_color="steelblue")])
                    fig_gb.update_layout(title="GMV Weights — Bar Chart", xaxis_title="Asset", yaxis_title="Weight", height=380)
                    st.plotly_chart(fig_gb, use_container_width=True)

                st.subheader("Risk Contribution")
                gmv_prc, _, _ = calculate_risk_contribution(gmv_weights, cov_opt)
                st.dataframe(
                    pd.DataFrame({"Asset": price_cols, "Weight": [f"{w:.2%}" for w in gmv_weights], "Risk Contribution": [f"{r:.2%}" for r in gmv_prc]}),
                    use_container_width=True, hide_index=True,
                )
                fig_gmv_rc = go.Figure()
                fig_gmv_rc.add_trace(go.Bar(x=price_cols, y=gmv_weights, name="Weight", marker_color="steelblue", opacity=0.8))
                fig_gmv_rc.add_trace(go.Bar(x=price_cols, y=gmv_prc, name="Risk Contribution", marker_color="crimson", opacity=0.8))
                fig_gmv_rc.update_layout(title="GMV: Weight vs Risk Contribution", xaxis_title="Asset", yaxis_title="Proportion", barmode="group", template="plotly_white", height=380)
                st.plotly_chart(fig_gmv_rc, use_container_width=True)

                hhi_gmv = float((gmv_prc ** 2).sum())
                rca, rcb, rcc = st.columns(3)
                mx = int(np.argmax(gmv_prc))
                rca.metric("Highest Risk Contributor", f"{price_cols[mx]}: {float(gmv_prc[mx]):.2%}")
                rcb.metric("Portfolio Volatility", f"{gmv_metrics['volatility']:.2%}")
                rcc.metric("HHI (Risk Concentration)", f"{hhi_gmv:.4f}")

            # ---- Tangency (Max Sharpe) -------------------------------------------
            with port_tab3:
                st.subheader("Tangency Portfolio (Maximum Sharpe Ratio)")
                st.caption("Maximizes the Sharpe ratio — the portfolio on the efficient frontier touched by the Capital Allocation Line. No short-selling allowed.")

                m1, m2, m3 = st.columns(3)
                m1.metric("Annualized Return",    f"{ms_metrics['return']:.2%}")
                m2.metric("Annualized Volatility", f"{ms_metrics['volatility']:.2%}")
                m3.metric("Sharpe Ratio",          f"{ms_metrics['sharpe']:.4f}")
                m4, m5, m6 = st.columns(3)
                m4.metric("Sortino Ratio",         f"{ms_metrics['sortino']:.4f}")
                m5.metric("Maximum Drawdown",      f"{ms_metrics['max_dd']:.2f}%")
            

                st.caption("**Portfolio Weights**")
                st.dataframe(
                    pd.DataFrame({"Ticker": price_cols, "Weight": [f"{w:.2%}" for w in max_sharpe_weights]}),
                    use_container_width=True, hide_index=True,
                )

                wp3, wp4 = st.columns(2)
                with wp3:
                    fig_mp = go.Figure(data=[go.Pie(labels=price_cols, values=max_sharpe_weights, hole=0.3)])
                    fig_mp.update_layout(title="Tangency Weights — Pie Chart", height=380)
                    st.plotly_chart(fig_mp, use_container_width=True)
                with wp4:
                    fig_mb = go.Figure(data=[go.Bar(x=price_cols, y=max_sharpe_weights, marker_color="darkgreen")])
                    fig_mb.update_layout(title="Tangency Weights — Bar Chart", xaxis_title="Asset", yaxis_title="Weight", height=380)
                    st.plotly_chart(fig_mb, use_container_width=True)

                st.subheader("Risk Contribution")
                ms_prc, _, _ = calculate_risk_contribution(max_sharpe_weights, cov_opt)
                st.dataframe(
                    pd.DataFrame({"Asset": price_cols, "Weight": [f"{w:.2%}" for w in max_sharpe_weights], "Risk Contribution": [f"{r:.2%}" for r in ms_prc]}),
                    use_container_width=True, hide_index=True,
                )
                fig_ms_rc = go.Figure()
                fig_ms_rc.add_trace(go.Bar(x=price_cols, y=max_sharpe_weights, name="Weight", marker_color="darkgreen", opacity=0.8))
                fig_ms_rc.add_trace(go.Bar(x=price_cols, y=ms_prc, name="Risk Contribution", marker_color="orange", opacity=0.8))
                fig_ms_rc.update_layout(title="Tangency: Weight vs Risk Contribution", xaxis_title="Asset", yaxis_title="Proportion", barmode="group", template="plotly_white", height=380)
                st.plotly_chart(fig_ms_rc, use_container_width=True)

                hhi_ms = float((ms_prc ** 2).sum())
                rcd, rce, rcf = st.columns(3)
                mx2 = int(np.argmax(ms_prc))
                rcd.metric("Highest Risk Contributor", f"{price_cols[mx2]}: {float(ms_prc[mx2]):.2%}")
                rce.metric("Portfolio Volatility", f"{ms_metrics['volatility']:.2%}")
                rcf.metric("HHI (Risk Concentration)", f"{hhi_ms:.4f}")

            # ---- Custom Portfolio -------------------------------------------
            with port_tab4:
                st.subheader("Custom Portfolio")
                st.caption(
                    "Set weights using the sliders below. Because sliders are independent, "
                    "values are **normalized** so the total always equals 100%. "
                    "Metrics update instantly as you adjust."
                )

                raw_weights = {}
                for t in price_cols:
                    raw_weights[t] = st.slider(
                        f"{t}",
                        min_value=0.0, max_value=1.0,
                        value=round(1.0 / n_assets, 4),
                        step=0.01,
                        key=f"cw_{t}",
                    )

                total_raw = sum(raw_weights.values())
                if total_raw == 0:
                    st.error("All weights are zero — set at least one slider above zero.")
                else:
                    custom_weights = np.array([raw_weights[t] / total_raw for t in price_cols])

                    st.subheader("Normalized Weights")
                    st.dataframe(
                        pd.DataFrame({
                            "Ticker": price_cols,
                            "Slider (raw)": [f"{raw_weights[t]:.2f}" for t in price_cols],
                            "Weight (normalized)": [f"{w:.2%}" for w in custom_weights],
                        }),
                        use_container_width=True, hide_index=True,
                    )

                    custom_metrics = calculate_portfolio_metrics(
                        custom_weights, returns_opt, mean_returns_opt, cov_opt,
                        risk_free_rate, TRADING_DAYS_PER_YEAR,
                    )

                    st.subheader("Custom Portfolio Metrics")
                    cu1, cu2, cu3 = st.columns(3)
                    cu1.metric("Annualized Return",    f"{custom_metrics['return']:.2%}")
                    cu2.metric("Annualized Volatility", f"{custom_metrics['volatility']:.2%}")
                    cu3.metric("Sharpe Ratio",          f"{custom_metrics['sharpe']:.4f}")
                    cu4, cu5 = st.columns(2)
                    cu4.metric("Sortino Ratio",         f"{custom_metrics['sortino']:.4f}")
                    cu5.metric("Maximum Drawdown",      f"{custom_metrics['max_dd']:.2f}%")

                    custom_wealth = (1 + (returns_opt @ custom_weights)).cumprod() * 10_000
                    fig_cw = go.Figure()
                    for t in price_cols:
                        fig_cw.add_trace(go.Scatter(
                            x=returns_opt.index, y=(1 + returns_opt[t]).cumprod() * 10_000,
                            mode="lines", name=t, line=dict(width=1, dash="dot"), opacity=0.4,
                        ))
                    fig_cw.add_trace(go.Scatter(
                        x=returns_opt.index, y=custom_wealth,
                        mode="lines", name="Custom Portfolio",
                        line=dict(width=3, color="purple"),
                    ))
                    fig_cw.update_layout(
                        title="Custom Portfolio Growth — $10,000 Initial Investment",
                        xaxis_title="Date", yaxis_title="Portfolio Value (USD)",
                        template="plotly_white", height=430, hovermode="x unified",
                    )
                    st.plotly_chart(fig_cw, use_container_width=True)

            # ---- Efficient Frontier -------------------------------------------
            with port_tab5:
                st.subheader("Efficient Frontier & Capital Allocation Line")
                st.markdown(
                    "The **efficient frontier** is the set of portfolios that deliver the maximum "
                    "expected return for each level of risk (standard deviation). Any portfolio "
                    "below the curve is suboptimal — you could get more return for the same risk. "
                    "The **Capital Allocation Line (CAL)** runs from the risk-free rate through the "
                    "tangency portfolio (the frontier point with the highest Sharpe ratio). Every "
                    "point on the CAL is a blend of the risk-free asset and the tangency portfolio, "
                    "and it dominates all other portfolios at equivalent risk levels."
                )

                ef_vols = opt["ef_vols"]
                ef_rets = opt["ef_rets"]

                if len(ef_vols) < 2:
                    st.warning("Not enough frontier points computed. Try a wider date range.")
                else:
                    # Read custom weights from session state
                    cw_raw = {t: st.session_state.get(f"cw_{t}", 1.0 / n_assets) for t in price_cols}
                    cw_total = sum(cw_raw.values())
                    cw_norm = np.array([cw_raw[t] / cw_total for t in price_cols]) if cw_total > 0 else eq_weights

                    # CAL: return = rf + sharpe_tangency * vol
                    t_vol = ms_metrics["volatility"]
                    t_ret = ms_metrics["return"]
                    cal_slope = (t_ret - risk_free_rate) / t_vol if t_vol > 0 else 0.0
                    cal_x_max = max(ef_vols) * 1.35
                    cal_x = [0.0, cal_x_max]
                    cal_y = [risk_free_rate, risk_free_rate + cal_slope * cal_x_max]

                    fig_ef = go.Figure()

                    # Efficient frontier curve
                    fig_ef.add_trace(go.Scatter(
                        x=ef_vols, y=ef_rets,
                        mode="lines", name="Efficient Frontier",
                        line=dict(width=3, color="steelblue"),
                        hovertemplate="Volatility: %{x:.2%}<br>Return: %{y:.2%}<extra>Efficient Frontier</extra>",
                    ))

                    # CAL
                    fig_ef.add_trace(go.Scatter(
                        x=cal_x, y=cal_y,
                        mode="lines", name="Capital Allocation Line (CAL)",
                        line=dict(width=2, color="orange", dash="dash"),
                        hovertemplate="Volatility: %{x:.2%}<br>CAL: %{y:.2%}<extra>CAL</extra>",
                    ))

                    # Risk-free rate point
                    fig_ef.add_trace(go.Scatter(
                        x=[0], y=[risk_free_rate],
                        mode="markers+text", name="Risk-Free Rate",
                        text=["Rf"], textposition="middle right",
                        marker=dict(size=10, color="gray", symbol="x"),
                        hovertemplate=f"Risk-Free Rate: {risk_free_rate:.2%}<extra></extra>",
                    ))

                    # Individual stocks / benchmark
                    for t in price_cols:
                        r = returns_opt[t]
                        t_v = float(r.std() * math.sqrt(TRADING_DAYS_PER_YEAR))
                        t_r = float(r.mean() * TRADING_DAYS_PER_YEAR)
                        is_sp = (t == "SP500")
                        fig_ef.add_trace(go.Scatter(
                            x=[t_v], y=[t_r],
                            mode="markers+text",
                            name="S&P 500 (benchmark)" if is_sp else t,
                            text=["S&P 500" if is_sp else t],
                            textposition="bottom right",
                            marker=dict(size=9, symbol="square" if is_sp else "circle",
                                        color="dimgray" if is_sp else None),
                            hovertemplate=f"{t}<br>Vol: %{{x:.2%}}<br>Return: %{{y:.2%}}<extra></extra>",
                        ))

                    # Named portfolio markers
                    cw_vol = portfolio_volatility(cw_norm, cov_opt)
                    cw_ret = float(portfolio_return(cw_norm, mean_returns_opt))
                    for p_name, p_vol, p_ret, p_color, p_sym, p_sz in [
                        ("Equal-Weight", eq_metrics["volatility"],  eq_metrics["return"],  "royalblue", "star",              16),
                        ("GMV",          gmv_metrics["volatility"], gmv_metrics["return"], "red",       "diamond",           16),
                        ("Tangency",     ms_metrics["volatility"],  ms_metrics["return"],  "green",     "star",              18),
                        ("Custom",       cw_vol,                    cw_ret,                "purple",    "star-triangle-up",  16),
                    ]:
                        fig_ef.add_trace(go.Scatter(
                            x=[p_vol], y=[p_ret],
                            mode="markers+text", name=p_name,
                            text=[p_name], textposition="top center",
                            marker=dict(size=p_sz, color=p_color, symbol=p_sym),
                            hovertemplate=f"{p_name}<br>Vol: %{{x:.2%}}<br>Return: %{{y:.2%}}<extra></extra>",
                        ))

                    fig_ef.update_layout(
                        title="Efficient Frontier with Capital Allocation Line",
                        xaxis_title="Annualized Volatility (Std Dev)",
                        yaxis_title="Annualized Return",
                        xaxis=dict(tickformat=".0%"),
                        yaxis=dict(tickformat=".0%"),
                        template="plotly_white",
                        height=600,
                        hovermode="closest",
                        legend=dict(orientation="v", x=1.01, y=1, xanchor="left"),
                    )
                    st.plotly_chart(fig_ef, use_container_width=True)

            # ---- Comparison -------------------------------------------
            with port_tab6:
                st.subheader("Portfolio Comparison")

                # Custom weights from session state
                cw_raw_c = {t: st.session_state.get(f"cw_{t}", 1.0 / n_assets) for t in price_cols}
                cw_tot_c = sum(cw_raw_c.values())
                cw_norm_c = np.array([cw_raw_c[t] / cw_tot_c for t in price_cols]) if cw_tot_c > 0 else eq_weights
                custom_metrics_c = calculate_portfolio_metrics(
                    cw_norm_c, returns_opt, mean_returns_opt, cov_opt, risk_free_rate, TRADING_DAYS_PER_YEAR,
                )

                cmp_rows = [
                    {"Portfolio": "Equal-Weight", "Ann. Return": f"{eq_metrics['return']:.2%}",          "Ann. Volatility": f"{eq_metrics['volatility']:.2%}",         "Sharpe Ratio": f"{eq_metrics['sharpe']:.4f}",        "Sortino Ratio": f"{eq_metrics['sortino']:.4f}",        "Max Drawdown": f"{eq_metrics['max_dd']:.2f}%"},
                    {"Portfolio": "GMV",          "Ann. Return": f"{gmv_metrics['return']:.2%}",         "Ann. Volatility": f"{gmv_metrics['volatility']:.2%}",        "Sharpe Ratio": f"{gmv_metrics['sharpe']:.4f}",       "Sortino Ratio": f"{gmv_metrics['sortino']:.4f}",       "Max Drawdown": f"{gmv_metrics['max_dd']:.2f}%"},
                    {"Portfolio": "Tangency",     "Ann. Return": f"{ms_metrics['return']:.2%}",          "Ann. Volatility": f"{ms_metrics['volatility']:.2%}",         "Sharpe Ratio": f"{ms_metrics['sharpe']:.4f}",        "Sortino Ratio": f"{ms_metrics['sortino']:.4f}",        "Max Drawdown": f"{ms_metrics['max_dd']:.2f}%"},
                    {"Portfolio": "Custom",       "Ann. Return": f"{custom_metrics_c['return']:.2%}",    "Ann. Volatility": f"{custom_metrics_c['volatility']:.2%}",   "Sharpe Ratio": f"{custom_metrics_c['sharpe']:.4f}",  "Sortino Ratio": f"{custom_metrics_c['sortino']:.4f}",  "Max Drawdown": f"{custom_metrics_c['max_dd']:.2f}%"},
                ]
                if "SP500" in returns_opt.columns:
                    sp_ret_c = returns_opt["SP500"]
                    sp_dd_c  = float(calculate_drawdown((1 + sp_ret_c).cumprod()).min())
                    cmp_rows.append({
                        "Portfolio":      "S&P 500 (Benchmark)",
                        "Ann. Return":    f"{sp_ret_c.mean() * TRADING_DAYS_PER_YEAR:.2%}",
                        "Ann. Volatility":f"{sp_ret_c.std() * math.sqrt(TRADING_DAYS_PER_YEAR):.2%}",
                        "Sharpe Ratio":   f"{calculate_sharpe_ratio(sp_ret_c, risk_free_rate, TRADING_DAYS_PER_YEAR):.4f}",
                        "Sortino Ratio":  f"{calculate_sortino_ratio(sp_ret_c, risk_free_rate, TRADING_DAYS_PER_YEAR):.4f}",
                        "Max Drawdown":   f"{sp_dd_c:.2f}%",
                    })

                st.caption("**Summary Metrics — All Portfolios & Benchmark**")
                st.dataframe(pd.DataFrame(cmp_rows), use_container_width=True, hide_index=True)

                st.divider()

                st.subheader("Cumulative Wealth — $10,000 Initial Investment")
                fig_wc = go.Figure()
                fig_wc.add_trace(go.Scatter(x=returns_opt.index, y=(1 + (returns_opt @ eq_weights)).cumprod()         * 10_000, mode="lines", name="Equal-Weight", line=dict(width=2, color="royalblue")))
                fig_wc.add_trace(go.Scatter(x=returns_opt.index, y=(1 + (returns_opt @ gmv_weights)).cumprod()        * 10_000, mode="lines", name="GMV",          line=dict(width=2, color="crimson",    dash="dash")))
                fig_wc.add_trace(go.Scatter(x=returns_opt.index, y=(1 + (returns_opt @ max_sharpe_weights)).cumprod() * 10_000, mode="lines", name="Tangency",     line=dict(width=2, color="green",      dash="dot")))
                fig_wc.add_trace(go.Scatter(x=returns_opt.index, y=(1 + (returns_opt @ cw_norm_c)).cumprod()          * 10_000, mode="lines", name="Custom",       line=dict(width=2, color="purple",     dash="dashdot")))
                if "SP500" in returns_opt.columns:
                    fig_wc.add_trace(go.Scatter(x=returns_opt.index, y=(1 + returns_opt["SP500"]).cumprod() * 10_000, mode="lines", name="S&P 500", line=dict(width=2, color="gray", dash="longdash")))
                fig_wc.update_layout(
                    title="Portfolio Wealth Comparison — $10,000 Initial Investment",
                    xaxis_title="Date", yaxis_title="Portfolio Value (USD)",
                    template="plotly_white", height=460, hovermode="x unified",
                )
                st.plotly_chart(fig_wc, use_container_width=True)

            # ---- Estimation Window Sensitivity -------------------------------------------
            with port_tab7:
                st.subheader("Estimation Window Sensitivity")
                st.info(
                    "Mean-variance optimization is only as stable as its inputs. Small changes in "
                    "estimated returns or covariances — caused by using a different historical window — "
                    "can produce dramatically different portfolio weights. The tables and charts below "
                    "show this sensitivity directly."
                )

                available_days = len(returns_opt)
                window_options: dict = {}
                if available_days >= 252:
                    window_options["1 Year (252 days)"] = 252
                if available_days >= 756:
                    window_options["3 Years (756 days)"] = 756
                if available_days >= 1260:
                    window_options["5 Years (1,260 days)"] = 1260
                window_options["Full Sample"] = available_days

                if len(window_options) < 2:
                    st.warning("Extend the date range to at least 2 years to compare multiple lookback windows.")
                else:
                    sel_wins = st.multiselect(
                        "Lookback windows to compare:",
                        options=list(window_options.keys()),
                        default=list(window_options.keys()),
                        key="est_windows",
                    )

                    if not sel_wins:
                        st.warning("Select at least one window.")
                    else:
                        with st.spinner("Computing window sensitivity…"):
                            win_results: dict = {}
                            for wn in sel_wins:
                                nd = window_options[wn]
                                rw = returns_opt.iloc[-nd:]
                                mw = rw.mean() * TRADING_DAYS_PER_YEAR
                                cw = rw.cov() * TRADING_DAYS_PER_YEAR
                                nw = len(price_cols)
                                bw = tuple((0.0, 1.0) for _ in range(nw))
                                ec = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
                                iw = np.full(nw, 1.0 / nw)

                                gr = minimize(portfolio_volatility, iw, args=(cw,), method="SLSQP",
                                              bounds=bw, constraints=ec, options={"ftol": 1e-12, "maxiter": 1000})
                                gw = gr.x if gr.success else iw.copy()

                                mr = minimize(negative_sharpe_ratio, iw, args=(mw, cw, risk_free_rate),
                                              method="SLSQP", bounds=bw, constraints=ec, options={"ftol": 1e-12, "maxiter": 1000})
                                mwt = mr.x if mr.success else iw.copy()

                                g_vol = portfolio_volatility(gw, cw)
                                m_vol = portfolio_volatility(mwt, cw)
                                win_results[wn] = {
                                    "gmv_w": gw,
                                    "gmv_ret": float(portfolio_return(gw, mw)),
                                    "gmv_vol": g_vol,
                                    "ms_w":   mwt,
                                    "ms_ret":  float(portfolio_return(mwt, mw)),
                                    "ms_vol":  m_vol,
                                    "ms_sharpe": (float(portfolio_return(mwt, mw)) - risk_free_rate) / m_vol if m_vol > 0 else 0.0,
                                }

                        st.subheader("GMV Portfolio — Weights & Metrics by Window")
                        gmv_rows = []
                        for wn in sel_wins:
                            row = {"Window": wn}
                            for i, t in enumerate(price_cols):
                                row[t] = f"{win_results[wn]['gmv_w'][i]:.2%}"
                            row["Ann. Return"]     = f"{win_results[wn]['gmv_ret']:.2%}"
                            row["Ann. Volatility"] = f"{win_results[wn]['gmv_vol']:.2%}"
                            gmv_rows.append(row)
                        st.dataframe(pd.DataFrame(gmv_rows), use_container_width=True, hide_index=True)

                        st.subheader("Tangency Portfolio — Weights & Metrics by Window")
                        ms_rows = []
                        for wn in sel_wins:
                            row = {"Window": wn}
                            for i, t in enumerate(price_cols):
                                row[t] = f"{win_results[wn]['ms_w'][i]:.2%}"
                            row["Ann. Return"]     = f"{win_results[wn]['ms_ret']:.2%}"
                            row["Ann. Volatility"] = f"{win_results[wn]['ms_vol']:.2%}"
                            row["Sharpe Ratio"]    = f"{win_results[wn]['ms_sharpe']:.4f}"
                            ms_rows.append(row)
                        st.dataframe(pd.DataFrame(ms_rows), use_container_width=True, hide_index=True)

                        st.subheader("Weight Comparison Across Windows")
                        for title, w_key in [("GMV Portfolio", "gmv_w"), ("Tangency Portfolio", "ms_w")]:
                            fig_wb = go.Figure()
                            for wn in sel_wins:
                                fig_wb.add_trace(go.Bar(name=wn, x=price_cols, y=win_results[wn][w_key]))
                            fig_wb.update_layout(
                                title=f"{title} Weights by Estimation Window",
                                xaxis_title="Asset", yaxis_title="Weight",
                                barmode="group", template="plotly_white", height=380,
                            )
                            st.plotly_chart(fig_wb, use_container_width=True)
