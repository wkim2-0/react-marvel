import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

import './style/style.scss';

//React > 18
ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    // <React.StrictMode>
    //   <App />
    // </React.StrictMode>,
    <App/>
  )

//React < 18

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

