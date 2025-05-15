import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Main from './Main';

// export const serverRoute = 'http://localhost:8080'
export const serverRoute = 'https://palabank-server.onrender.com'

function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route element={<Main/>} path='/'/>
          </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
