import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Main from './1main/main.jsx';
import Serve from './2serve/serve.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/invest" element={<Serve />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;