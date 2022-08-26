import { Routes, Route } from "react-router-dom";
import BoardView from './components/BoardView';
import ThreadView from './components/ThreadView';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/board/:board/page/:page" element={<BoardView/>}/>
        <Route path='/board/:board/thread/:threadId' element={<ThreadView/>}/>
      </Routes>
    </div>
  );
}

export default App;
