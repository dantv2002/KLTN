import { useContext } from 'react';
import { TitleContext } from './TitleContext';

export const useTitle = () => useContext(TitleContext);