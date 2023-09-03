import { useContext } from 'react';
import { ConfirmContext } from '~/context/confirmContext/ConfirmProvider';

function useConfirmContext() {
  const value = useContext(ConfirmContext);
  if (!value)
    throw new Error('Confirm context must be use inside confirm provider');
  return value;
}

export default useConfirmContext;
