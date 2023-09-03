import React, { createContext, useState } from 'react';
import ModalConfirm from '~/components/modal/ModalConfirm';

export const ConfirmContext = createContext();

function ConfirmProvider({ children }) {
  const [confirmOption, setConfirmOption] = useState({
    open: false,
    title: '',
    content: '',
    handleConfirm: null,
  });
  const confirmContext = ({ title, content, onConfirm }) => {
    setConfirmOption({
      open: true,
      title,
      content,
      handleConfirm: onConfirm,
    });
  };
  const handleClose = () => {
    setConfirmOption({
      open: false,
      title: '',
      content: '',
      handleConfirm: null,
    });
  };
  return (
    <ConfirmContext.Provider value={confirmContext}>
      {confirmOption.open && (
        <ModalConfirm
          open={confirmOption.open}
          handleClose={handleClose}
          title={confirmOption.title}
          onConfirm={confirmOption.handleConfirm}
        >
          {confirmOption.content}
        </ModalConfirm>
      )}
      {children}
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
