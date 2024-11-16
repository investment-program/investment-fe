import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './result.css';

export default function Result({ data }) {
  const [portfolio, setPortfolio] = useState(null);  
  const [benchmark, setBenchmark] = useState(null);  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPortfolio(null);  
        setBenchmark(null);  
        setError(null);  

        console.log("보내는 요청 데이터:", data);  

        const response = await axios.post('https://www.investment-up.shop/run-backtest', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("백엔드 반환 데이터:", response.data);

        setPortfolio(response.data.portfolio);  
        setBenchmark(response.data.benchmark);  
      } catch (err) {
        console.error("Error fetching backtest data:", err);
        setError(err.response?.data?.detail || "데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [data]);  

  if (!portfolio || !benchmark) {
    return <div className="result-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="result-container error">오류: {JSON.stringify(error)}</div>;
  }

  // console.log로 데이터를 확인
  console.log(portfolio.visualizations);

  return (
    <div className="result-container">
      <h2>백테스트 결과</h2>

      {/* 텍스트와 이미지를 나란히 배치하는 영역 */}
      <div className="result-flex-container">
        {/* 백테스트 메트릭스 텍스트 섹션 */}
        <div className="result-section">
          <h3>포트폴리오 메트릭스</h3>
          <ul>
            <li>최종 가치: {portfolio.final_value.toLocaleString()} 원</li>
            <li>총 수익률: {(portfolio.total_return * 100).toFixed(2)}%</li>
            <li>연간 변동성: {(portfolio.annual_volatility * 100).toFixed(2)}%</li>
            <li>샤프 비율: {portfolio.sharpe_ratio.toFixed(2)}</li>
            <li>최대 낙폭: {(portfolio.max_drawdown * 100).toFixed(2)}%</li>
            <li>승률: {(portfolio.win_rate * 100).toFixed(2)}%</li>
          </ul>
        </div>

        {/* 이미지를 나란히 배치 */}
        <div className="result-image-section">
  <h3>백테스트 시각화</h3>
  {portfolio.visualizations?.value_changes ? (
    <div className="image-container">
      <img 
        src={`data:image/png;base64,${portfolio.visualizations.value_changes}`} 
        alt="Portfolio Value Changes"
        className="result-image"
      />
    </div>
  ) : (
    <p>포트폴리오 값 변화 이미지가 없습니다.</p>
  )}
  {portfolio.visualizations?.composition ? (
        <div className="image-container">
            <img 
                src={`data:image/png;base64,${portfolio.visualizations.composition}`} 
                alt="Portfolio Composition"
                className="result-image"
            />
        </div>
            ) : (
                <p>포트폴리오 구성 이미지가 없습니다.</p>
            )}
            {portfolio.visualizations?.risk_return ? (
                <div className="image-container">
                <img 
                    src={`data:image/png;base64,${portfolio.visualizations.risk_return}`} 
                    alt="Risk-Return Scatter"
                    className="result-image"
                />
                </div>
            ) : (
                <p>위험-수익 이미지가 없습니다.</p>
            )}
        </div>
      </div>

      {/* 포트폴리오 구성 */}
      <div className="result-section">
        <h3>포트폴리오 구성</h3>
        <ul>
          {portfolio.composition && portfolio.composition.length > 0 ? (
            portfolio.composition.map((stock, index) => (
              <li key={index}>
                {stock.name} ({stock.code}): {(stock.weight * 100).toFixed(2)}%
              </li>
            ))
          ) : (
            <li>포트폴리오 구성이 없습니다.</li>
          )}
        </ul>
      </div>

      {/* 벤치마크 메트릭스 */}
      <div className="result-section">
        <h3>벤치마크 메트릭스</h3>
        <ul>
          <li>최종 가치: {benchmark.final_value.toLocaleString()} 원</li>
          <li>총 수익률: {(benchmark.total_return * 100).toFixed(2)}%</li>
          <li>연간 변동성: {(benchmark.annual_volatility * 100).toFixed(2)}%</li>
        </ul>
      </div>

      {/* 개별 종목 성과 */}
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
            {data?.stocks?.length > 0 ? (
              data.stocks.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{(stock.return * 100).toFixed(2)}%</td>
                  <td>{(stock.dividend_yield * 100).toFixed(2)}%</td>
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
