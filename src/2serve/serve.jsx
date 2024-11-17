import './serve.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../0header/header';

export default function Serve() {
  const [inputValue, setInputValue] = useState('');
  const [stocks, setStocks] = useState([]);
  const [message, setMessage] = useState('');
  const [allStocks, setAllStocks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
    if (stocks.length >= 5) {
      setMessage('최대 5개 종목만 추가할 수 있습니다.');
      return;
    }

    if (allStocks.includes(inputValue)) {
      if (!stocks.includes(inputValue)) {
        setStocks([...stocks, inputValue]);
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

  const handleSubmit = () => {
    console.log("선택한 종목:", stocks);
  };

  return (
    <div className="Main2">
      <Header />
      <main className="main-container2">
        <div className="inputfield">
          <div className="input-group2">
            <input
              type="text"
              placeholder="종목 입력"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={handleAddStock}>추가</button>
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
          {message && <p className="message">{message}</p>}
          <ul>
            {stocks.map((stock, index) => (
              <li key={index}>{stock}</li>
            ))}
          </ul>
          {stocks.length > 0 && (
            <button className="submit-button2" onClick={handleSubmit}>
              설정 완료
            </button>
          )}
        </div>
      </main>
    </div>
  );
}