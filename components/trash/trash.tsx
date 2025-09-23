import React from 'react';
import CustomDialogTrigger from '../global/customdialogtrigger';
import Trashrestore from './trashrestore';

interface TrashProps {
  children: React.ReactNode;
}

const Trash: React.FC<TrashProps> = ({ children }) => {
  return (
    <CustomDialogTrigger
      header="Trash"
      content={<Trashrestore />}
    >
      {children}
    </CustomDialogTrigger>
  );
};

export default Trash;