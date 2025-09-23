import React from 'react';
import CustomDialogTrigger from '../global/customdialogtrigger';
import Trashrestore from './trashrestore';

type props=  {
  children: React.ReactNode; 
  size:number, 
  onClick:()=> void , 
  className?:string,
}

const Trash = ({ children ,size,onClick,className}:props) => {
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