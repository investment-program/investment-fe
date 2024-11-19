import './serve.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../0header/header';
import Result from '../3result/result2';

export default function Serve() {
  const [inputValue, setInputValue] = useState('');
  const [stock_names, setStocks] = useState([]);
  const [message, setMessage] = useState('');
  const [allStocks, setAllStocks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [backtestingPeriod, setBacktestingPeriod] = useState({
    start_year: 2000,
    start_month: 1,
    end_year: 2000,
    end_month: 2,
  });
  const [showResult, setShowResult] = useState(false);
  const [payloadData, setPayloadData] = useState(null);

  // Fetch stock data on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('https://www.investment-up.shop/stocks/all');
        setAllStocks(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
    fetchStocks();
  }, []);

  const handleAddStock = () => {
    if (stock_names.length >= 5) {
      setMessage('최대 5개 종목만 추가할 수 있습니다.');
      return;
    }

    if (allStocks.includes(inputValue)) {
      if (!stock_names.includes(inputValue)) {
        setStocks((prevStocks) => [...prevStocks, inputValue]);
        setMessage('');
      } else {
        setMessage('이미 추가된 종목입니다.');
      }
    } else {
      setMessage('없는 종목입니다.');
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleRemoveStock = (stockToRemove) => {
    setStocks((prevStocks) => prevStocks.filter((stock) => stock !== stockToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    if (value) {
      const filteredSuggestions = allStocks.filter((stock) =>
        stock.toUpperCase().startsWith(value)
      );
      setSuggestions(filteredSuggestions.slice(0, 10));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handlePeriodChange = (e) => {
    const { name, value } = e.target;
    setBacktestingPeriod((prevPeriod) => ({
      ...prevPeriod,
      [name]: parseInt(value, 10),
    }));
  };

  const handleShowResult = () => {
    if (stock_names.length === 0) {
      setMessage('최소 1개 종목을 추가해야 합니다.');
      return;
    }

    const payload = {
      stock_names: stock_names,
      backtesting_period: {
        start_year: backtestingPeriod.start_year,
        start_month: backtestingPeriod.start_month,
        end_year: backtestingPeriod.end_year,
        end_month: backtestingPeriod.end_month,
      },
    };

    console.log('Payload to pass to Result:', payload);
    setPayloadData(payload);
    setShowResult(true);
  };

  return (
    <div className="Main2">
      <Header />
      <main className="main-container2">
          <div className="input-container">
            <div className="left-panel">
              <div className="input-group2">
                <label>백테스트 기간</label>
                <div className="date-range">
                  <input
                    type="number"
                    name="start_year"
                    onChange={handlePeriodChange}
                    value={backtestingPeriod.start_year}
                    placeholder="년"
                    min="1966"
                    max="2100"
                  />
                  <input
                    type="number"
                    name="start_month"
                    onChange={handlePeriodChange}
                    value={backtestingPeriod.start_month}
                    placeholder="월"
                    min="1"
                    max="12"
                  />
                  <span> ~ </span>
                  <input
                    type="number"
                    name="end_year"
                    onChange={handlePeriodChange}
                    value={backtestingPeriod.end_year}
                    placeholder="년"
                    min="1966"
                    max="2100"
                  />
                  <input
                    type="number"
                    name="end_month"
                    onChange={handlePeriodChange}
                    value={backtestingPeriod.end_month}
                    placeholder="월"
                    min="1"
                    max="12"
                  />
                </div>
              </div>
              <div className="input-group2">
                <label>종목 입력</label>
                <input
                  type="text"
                  placeholder="종목 입력"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <button onClick={handleAddStock}>추가</button>
                {stock_names.length > 0 && (
                  <button className="submit-button2" onClick={handleShowResult}>
                    설정 완료
                  </button>
                )}
              </div>
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              {message && <p className={`message ${message === '없는 종목입니다.' ? 'error' : ''}`}>{message}</p>}
            </div>
            <div className="right-panel">
              <h3>추가된 종목</h3>
              <ul className="stock-list">
                {stock_names.map((stock, index) => (
                  <li key={index} className="stock-item">
                    {stock}
                    <button
                      className="remove-stock-button"
                      onClick={() => handleRemoveStock(stock)}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Result data={payloadData} />
      </main>
    </div>
  );
}