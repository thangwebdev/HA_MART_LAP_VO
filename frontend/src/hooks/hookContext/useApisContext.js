import { useContext } from 'react';
import { ApisContext } from '~/context/apisContext';

const useApisContext = () => {
  const value = useContext(ApisContext);
  if (!value) {
    throw new Error('Aois context must be used inside apis provider');
  }
  return value;
};
export default useApisContext;
