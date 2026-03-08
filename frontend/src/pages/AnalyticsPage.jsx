import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { PRICE_TRENDS, LOCALITIES } from '../data/mockData'
import { FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi'

Chart.register(...registerables)

export default function AnalyticsPage() {
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    useEffect(() => {
        if (!chartRef.current) return
        if (chartInstance.current) chartInstance.current.destroy()
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: PRICE_TRENDS,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#9898b0', font: { family: 'Inter', size: 12 } } },
                    tooltip: { backgroundColor: '#16161f', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#f0f0f5', bodyColor: '#9898b0' }
                },
                scales: {
                    x: { ticks: { color: '#5a5a72' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                    y: { ticks: { color: '#5a5a72', callback: v => `₹${v.toLocaleString()}` }, grid: { color: 'rgba(255,255,255,0.04)' } }
                }
            }
        })
        return () => chartInstance.current?.destroy()
    }, [])

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <div className="container">
                    <p className="section-eyebrow">📈 Market Intelligence</p>
                    <h1 className="section-title">Price Analytics</h1>
                    <p className="section-sub">Real-time price trends across Bangalore's top localities</p>

                    {/* Chart */}
                    <div className="analytics-chart-card card">
                        <div className="chart-header">
                            <h3>Price Trend — Per Sqft (2025)</h3>
                            <span className="badge badge-green"><FiTrendingUp size={12} /> Market Rising</span>
                        </div>
                        <div style={{ height: 360 }}>
                            <canvas ref={chartRef} />
                        </div>
                    </div>

                    {/* Locality Table */}
                    <h2 className="section-title" style={{ marginTop: 48, marginBottom: 24 }}>Locality Performance</h2>
                    <div className="analytics-table card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Locality</th>
                                    <th>Avg Price/sqft</th>
                                    <th>YoY Growth</th>
                                    <th>Rental Yield</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LOCALITIES.map(l => (
                                    <tr key={l.id}>
                                        <td><strong>{l.name}</strong></td>
                                        <td>{l.avgPrice}</td>
                                        <td className="growth-pos"><FiArrowUp size={12} /> {l.yoyGrowth}</td>
                                        <td>{l.rentYield}</td>
                                        <td>
                                            <div className="score-bar-wrap">
                                                <div className="score-bar" style={{ width: `${l.score}%` }} />
                                                <span>{l.score}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
        .section-eyebrow { font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .analytics-chart-card { padding: 28px; margin-bottom: 8px; }
        .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .chart-header h3 { font-size: 1rem; font-weight: 700; }
        .analytics-table { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { padding: 14px 20px; text-align: left; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); border-bottom: 1px solid var(--border); font-weight: 600; }
        .data-table td { padding: 15px 20px; font-size: 0.875rem; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        .data-table td strong { color: var(--text-primary); }
        .growth-pos { color: var(--green); font-weight: 600; display: flex; align-items: center; gap: 3px; }
        .score-bar-wrap { display: flex; align-items: center; gap: 10px; }
        .score-bar { height: 6px; background: var(--accent); border-radius: 3px; transition: width 0.5s ease; }
        .score-bar-wrap span { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); min-width: 28px; }
      `}</style>
        </div>
    )
}
