import './serve.css';
import React, { useState } from 'react';
import Header from '../0header/header';

export default function Serve() {
  const [inputValue, setInputValue] = useState('');
  const [stocks, setStocks] = useState([]);
  const [message, setMessage] = useState('');

  const databaseStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']; // 예시 종목 목록

  const handleAddStock = () => {
    if (stocks.length >= 5) {
      setMessage('최대 5개 종목만 추가할 수 있습니다.');
      return;
    }

    if (databaseStocks.includes(inputValue)) {
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
  };

  const handleSubmit = () => {
    // 설정 완료 버튼 클릭 시 처리할 로직
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
                    onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                />
                <button onClick={handleAddStock}>추가</button>
            </div>
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