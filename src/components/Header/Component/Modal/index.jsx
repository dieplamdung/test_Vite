import { Modal } from '@mui/material';
import React, { useState } from 'react';
import ContentDeposit from '../ContentDeposit';
import ContentWithdraw from '../ContentWithdraw';

import { WrapperModal, WrapperTab, Tab, WrapperContentModal, Title, ContentModal } from './styled';

export default function ModalComponent({ open, onClose }) {
  const [tabSelect, setTabSelect] = useState('deposit');
  return (
    <WrapperModal>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          outline: 'none'
        }}>
        <ContentModal>
          <Title>Manage Balances</Title>
          <WrapperTab>
            <Tab
              color={tabSelect === 'deposit' ? '#A7273D' : null}
              onClick={() => {
                setTabSelect('deposit');
              }}>
              Deposit
            </Tab>
            <Tab
              color={tabSelect === 'withdraw' ? '#0B7CB6' : null}
              onClick={() => {
                setTabSelect('withdraw');
              }}>
              Withdraw
            </Tab>
          </WrapperTab>
          <WrapperContentModal>
            {tabSelect === 'deposit' && <ContentDeposit onClose={onClose} />}
            {tabSelect === 'withdraw' && <ContentWithdraw onClose={onClose} />}
          </WrapperContentModal>
        </ContentModal>
      </Modal>
    </WrapperModal>
  );
}
