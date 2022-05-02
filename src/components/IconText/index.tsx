import React from 'react';

interface IIconTextProps {
  icon: any;
  text: string;
  [key: string]: any;
}
const IconText = ({ icon, text, ...rest }: IIconTextProps) => (
  <span {...rest}>
    {React.createElement(icon, { style: { marginRight: 4 } })}
    {text}
  </span>
);

export default IconText;
