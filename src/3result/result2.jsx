import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './result.css';

export default function Result({ data }) {
  const [portfolio, setPortfolio] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [visualizations, setVisualizations] = useState(null);
  const [individual_stocks, setIndividual_stock] = useState([]); // 빈 배열로 초기화
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPortfolio(null);
        setBenchmark(null);
        setVisualizations(null);
        setIndividual_stock([]);
        setError(null);

        console.log("보내는 요청 데이터:", data);

        const response = await axios.post('https://www.investment-up.shop/specific-backtest', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("백엔드 반환 데이터:", response.data);

        setPortfolio(response.data.portfolio);
        setBenchmark(response.data.benchmark);
        setVisualizations(response.data.visualizations);
        setIndividual_stock(response.data.individual_stocks);
      } catch (err) {
        console.error("Error fetching backtest data:", err);
        setError(err.response?.data?.detail || "데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [data]);

  if (!portfolio || !benchmark || !visualizations || individual_stocks.length === 0) {
    return <div className="result-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="result-container error">오류: {JSON.stringify(error)}</div>;
  }

  console.log("Visualizations:", visualizations);

  return (
    <div className="result-container">
      <div className="result-flex-container">
        <div className="result-image-section">
          <h3>백테스트 시각화</h3>
          {visualizations?.value_changes ? (
            <div>
              <h4>포트폴리오 값 변화</h4>
              <img
                src={`data:image/png;base64,${visualizations.value_changes}`}
                alt="Portfolio Value Changes"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <p>포트폴리오 값 변화 이미지가 없습니다.</p>
          )}
        <div className="side-by-side-images">
          {visualizations?.composition ? (
            <div className="image-container">
              <h4>포트폴리오 구성</h4>
              <img
                src={`data:image/png;base64,${visualizations.composition}`}
                alt="Portfolio Composition"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <p>포트폴리오 구성 이미지가 없습니다.</p>
          )}

          {visualizations?.risk_return ? (
            <div className="image-container">
              <h4>위험-수익</h4>
              <img
                src={`data:image/png;base64,${visualizations.risk_return}`}
                alt="Risk-Return Scatter"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <p>위험-수익 이미지가 없습니다.</p>
          )}
        </div>
        </div>
        <div className="result-section">
          <h3>포트폴리오 메트릭스</h3>
          <ul>
            <li>최종 가치: {portfolio.final_value.toLocaleString()} 원</li>
            <li>총 수익률: {(portfolio.total_return).toFixed(2)}%</li>
            <li>연간 변동성: {(portfolio.annual_volatility).toFixed(2)}%</li>
            <li>샤프 비율: {portfolio.sharpe_ratio.toFixed(2)}</li>
            <li>최대 낙폭: {(portfolio.max_drawdown).toFixed(2)}%</li>
            <li>승률: {(portfolio.win_rate).toFixed(2)}%</li>
          </ul>
        </div>
      </div>

      <div className="result-section">
        <h3>포트폴리오 구성</h3>
        <ul>
          {portfolio.composition && portfolio.composition.length > 0 ? (
            portfolio.composition.map((stock, index) => (
              <li key={index}>
                {stock.name} ({stock.code}): {(stock.weight).toFixed(2)}%
              </li>
            ))
          ) : (
            <li>포트폴리오 구성이 없습니다.</li>
          )}
        </ul>
      </div>

      <div className="result-section">
        <h3>벤치마크 메트릭스</h3>
        <ul>
          <li>최종 가치: {benchmark.final_value.toLocaleString()} 원</li>
          <li>총 수익률: {(benchmark.total_return).toFixed(2)}%</li>
          <li>연간 변동성: {(benchmark.annual_volatility).toFixed(2)}%</li>
        </ul>
      </div>

      <div className="result-section">
        <h3>개별 종목 성과</h3>
        <table>
          <thead>
            <tr>
              <th>종목명</th>
              <th>수익률</th>
              <th>배당수익률</th>
            </tr>
          </thead>
          <tbody>
            {individual_stocks.length > 0 ? (
              individual_stocks.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.return_.toFixed(2)}%</td>
                  <td>{(stock.volatility ? stock.volatility.toFixed(2) : 'N/A')}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">개별 종목 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
