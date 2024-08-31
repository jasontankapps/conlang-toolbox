import { useEffect, useState } from "react";
import { SetBooleanState, SetState } from "../store/types";

// This returns a function which can then be used to create properties for a modal
function modalPropertiesFunc (
	modals: SetBooleanState[],
	setModals: SetState<SetBooleanState[]>
) {
	return function (isOpen: boolean, setIsOpen: SetBooleanState) {
		const [previous, setPrevious] = useState<boolean>(isOpen);
		useEffect(() => {
			if(isOpen === previous) {
				// nada
			} else {
				setPrevious(isOpen);
				if(isOpen) {
					setModals([setIsOpen, ...modals]);
				} else {
					const newModals = modals.filter(m => m !== setIsOpen);
					setModals(newModals);
				}
			}
		}, [isOpen, setIsOpen, previous]);
		return {
			isOpen,
			setIsOpen
		};
	};
};

export default modalPropertiesFunc;
