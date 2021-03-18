import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import DockMonitor from "recoil-devtools-dock";

const RandomImage: React.FC<{ num: number }> = ({ num }) => {
  const style = {
     width: '100%',
     height: '100%',
     display: 'flex',
     margin: 2,
     backgroundImage: `url(https://unsplash.it/150/200?image=${num})`,
     transition: 'background-image 1s ease-in-out',
  };

  return (
    <a href="#" style={style} />
  );
}


const App = () => {
  return (
    <RecoilRoot>
      <DockMonitor
        toggleVisibilityKey="ctrl-h"
        changePositionKey="ctrl-p"
        changeMonitorKey="ctrl-m" // Unnecessary for our app, because we only have one Recoil store
        defaultIsVisible
      >
        <RandomImage num={1} />
        <RandomImage num={2} />
        <RandomImage num={3} />
        <RandomImage num={4} />
      </DockMonitor>
    </RecoilRoot>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
