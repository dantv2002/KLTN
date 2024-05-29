import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState('My App');

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

TitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};