import { createRoot } from 'react-dom/client';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { RecoilLogger } from 'recoil-devtools-logger';
import { DockMonitor } from 'recoil-devtools-dock';
import { LogMonitor } from 'recoil-devtools-log-monitor';
import './styles.css';

// Define example atoms
const counterAtom = atom({
  key: 'counter',
  default: 0,
});

const messageAtom = atom({
  key: 'message',
  default: 'Hello Recoil DevTools!',
});

const doubledSelector = selector({
  key: 'doubled',
  get: ({ get }) => get(counterAtom) * 2,
});

const statusSelector = selector({
  key: 'status',
  get: ({ get }) => {
    const count = get(counterAtom);
    return count > 10 ? 'High!' : count > 5 ? 'Growing' : 'Low';
  },
});

// Main App Component
function App() {
  const [count, setCount] = useRecoilState(counterAtom);
  const [message, setMessage] = useRecoilState(messageAtom);
  const doubled = useRecoilValue(doubledSelector);
  const status = useRecoilValue(statusSelector);

  return (
    <div className="app">
      <h1>Recoil DevTools Demo</h1>
      
      <div className="controls">
        <p>Counter: {count}</p>
        <p>Doubled: {doubled}</p>
        <p>Status: {status}</p>
        
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>

      <div className="input-section">
        <label>
          Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <p>Current message: {message}</p>
      </div>

      <p className="hint">
        Press <kbd>Ctrl</kbd>+<kbd>H</kbd> to toggle dock visibility
      </p>
      <p className="hint">
        Press <kbd>Ctrl</kbd>+<kbd>Q</kbd> to change dock position
      </p>
    </div>
  );
}

// Root component with RecoilDevTools wrapper
function Root() {
  return (
    <RecoilRoot>
      <RecoilLogger />
      <DockMonitor>
        <LogMonitor />
      </DockMonitor>
      <App />
    </RecoilRoot>
  );
}

// Mount the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);
root.render(<Root />);