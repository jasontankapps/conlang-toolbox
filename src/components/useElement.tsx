import { RefObject, useCallback, useEffect, useRef, useState } from "react";

type ElementRef<T extends Element> = (node: T | null) => void;

// Takes optional argument extraFunc (T | null) => void
// Must define T as an Element when using the hook
//   The function will be called whenever the reference is set or changes 
// Returns [Element, ElementRef]
//   Element is an HTML element or `null`
//   ElementRef is a fucntion that can be used as the argument for a ref attribute
const useElement = <T extends Element>(extraFunc?: (node: T | null) => void): [T | null, ElementRef<T>] => {
	const [el, setEl] = useState<T | null>(null);
	const ref: ElementRef<T> = useCallback((node: T | null) => {
		if(node && node !== el) {
			setEl(node);
			extraFunc && extraFunc(node);
		}
	}, [el, extraFunc]);
	return [el, ref];
};

export default useElement;

// useElementList(array, functionThatGetsAnIdFromArrayMember)
//   => [RefObject, functionThatUpdatesRefObject, functionThatClearsRefObject]

export const useElementList = <A,T>(
	input: A[],
	getIdFunc: ((x:A) => string)
): [ RefObject<{[key: string]: T}>, (item: A, el: T) => void, () => void ] => {
	// Managing element references
	const inputElements = useRef<{ [key: string]: T }>({});
	useEffect(() => {
		const newObj: { [key: string]: T } = {};
		input.forEach(bit => {
			const id = getIdFunc(bit);
			newObj[id] = inputElements.current[id];
		});
		inputElements.current = newObj;
	}, [input, getIdFunc]);
	const updateInputElement = (item: A, el: T) => {
		const id = getIdFunc(item);
		inputElements.current[id] = el;
	};
	const clearInputElement = () => (inputElements.current = {});
	return [inputElements, updateInputElement, clearInputElement];
};
