import { createContext } from 'react';
import { ModalProperties, SetBooleanState } from '../store/types';

export const ModalMakingContext = createContext<(x:boolean, y:SetBooleanState) => ModalProperties>(
	(isOpen, setIsOpen) => ({ isOpen, setIsOpen })
);
export const ExCharContext = createContext(
	() => { console.log("ExCharContext") }
);
