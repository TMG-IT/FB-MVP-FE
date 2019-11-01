import React from 'react';
import ReactDOM from 'react-dom';
import SessionCodeEntry from './SessionCodeEntry';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SessionCodeEntry />, div);
  ReactDOM.unmountComponentAtNode(div);
});
