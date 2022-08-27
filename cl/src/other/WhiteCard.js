import React from 'react';

import './WhiteCard.css';

const WhiteCard = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default WhiteCard;
