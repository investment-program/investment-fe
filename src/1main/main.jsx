import React, { useState } from 'react';
import axios from 'axios';
import './main.css';
import Header from '../0header/header';
import Result from '../3result/result';

export default function Main() {
  const [formData, setFormData] = useState({
    n_stock: 1,
    min_dividend: 0,
    investment_style: '공격투자형',
    backtesting_period: {
      start_year: null,
      start_month: null,
      end_year: null,
      end_month: null,
    },
  });
  const [showResult, setShowResult] = useState(false); // Result 표시 상태
  const [resultData, setResultData] = useState(null); // API 응답 데이터 상태

  const handleSubmit = async () => {
    try {
      const updatedFormData = {
        ...formData,
        min_dividend: formData.min_dividend > 0 ? formData.min_dividend : 1,
        backtesting_period: {
          start_year: formData.backtesting_period.start_year || 2000,
          start_month: formData.backtesting_period.start_month || 1,
          end_year: formData.backtesting_period.end_year || 2020,
          end_month: formData.backtesting_period.end_month || 12,
        },
      };

      console.log('Updated Form Data:', updatedFormData);

      const response = await axios.post(
        'https://www.investment-up.shop/condition',
        updatedFormData
      );

      console.log('Response Data:', response.data);
      setResultData(response.data); // API 응답 데이터 저장
      setShowResult(true); // Result 표시 상태 활성화
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'min_dividend') {
      setFormData((prevData) => ({
        ...prevData,
        min_dividend: value >= 0 ? value : 0, // 음수값 방지
      }));
    } else if (name.includes('start') || name.includes('end')) {
      setFormData((prevData) => ({
        ...prevData,
        backtesting_period: {
          ...prevData.backtesting_period,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="Main1">
      <Header />
      <main className="main-container1">
        <div className="maindiv1">
          <div className="input-group1">
            <label>종목 수</label>
            <select name="n_stock" onChange={handleChange} value={formData.n_stock}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group1">
            <label>배당 수익률 (%)</label>
            <input
              type="number"
              name="min_dividend"
              onChange={handleChange}
              value={formData.min_dividend}
              placeholder="%"
              min="0"
              step="0.01"
            />
          </div>

          <div className="input-group1">
            <label>투자 성향</label>
            <select
              name="investment_style"
              onChange={handleChange}
              value={formData.investment_style}
            >
              {['공격투자형', '적극투자형', '위험중립형', '위험회피형', '안전추구형'].map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group1">
            <label>백테스트 기간</label>
            <div className="date-range">
              <input
                type="number"
                name="start_year"
                onChange={handleChange}
                value={formData.backtesting_period.start_year}
                placeholder="년"
                min="1966"
                max="2100"
              />
              <input
                type="number"
                name="start_month"
                onChange={handleChange}
                value={formData.backtesting_period.start_month}
                placeholder="월"
                min="1"
                max="12"
              />
              <span> ~ </span>
              <input
                type="number"
                name="end_year"
                onChange={handleChange}
                value={formData.backtesting_period.end_year}
                placeholder="년"
                min="1966"
                max="2100"
              />
              <input
                type="number"
                name="end_month"
                onChange={handleChange}
                value={formData.backtesting_period.end_month}
                placeholder="월"
                min="1"
                max="12"
              />
            </div>
          </div>

          <div className="button-container1">
            <button className="submit-button1" onClick={handleSubmit}>
              설정 완료
            </button>
          </div>

          {/* 설정 완료 버튼 아래에 Result 컴포넌트를 조건부 렌더링 */}
          {showResult && <Result data={resultData} />}
        </div>
      </main>
    </div>
  );
}
