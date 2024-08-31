import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

import blankAppState, { cleanerObject } from './blankAppState';
import { Lexicon, LexiconBlankSorts, LexiconColumn, LexiconState, SorterFunc } from './types';
import log from '../components/Logging';

const initialState = blankAppState.lexicon;

const sortBlank = (dir: boolean, method: LexiconBlankSorts) => {
	// returns [xIsBlank, yIsBlank]
	const sort = (dir ? "descending-" : "ascending-") + method;
	switch (sort) {
		case "descending-last":
		case "ascending-first":
		case "descending-alphaFirst":
		case "ascending-alphaFirst":
			return [-1, 1];
		case "ascending-last":
		case "descending-first":
		case "descending-alphaLast":
		case "ascending-alphaLast":
			return [1, -1];
	}
	return [0, 0];
};
const sortLexicon = (
	lexicon: Lexicon[],
	sortPattern: number[],
	sortDir: boolean,
	blankSort: LexiconBlankSorts,
	stringSorter: SorterFunc
) => {
	const maxCol = sortPattern.length;
	const [xIsBlank, yIsBlank] = sortBlank(sortDir, blankSort);
	let newLexicon = [...lexicon];
	function sortFunction (a: Lexicon, b: Lexicon) {
		const columnsA = a.columns;
		const columnsB = b.columns;
		let comp = 0;
		let col = 0;
		// Check each column until we find a non-equal comparison
		//   (or we run out of columns)
		do {
			const sortingCol = sortPattern[col];
			const x = columnsA[sortingCol];
			const y = columnsB[sortingCol];
			try {
				if(!x && !y) {
					// Blanks are equal
					comp = 0;
				} else if (!x) {
					// first is blank
					comp = xIsBlank;
				} else if (!y) {
					// last is blank
					comp = yIsBlank;
				} else {
					comp = stringSorter(x, y);
				}
			} catch(error) {
				comp = 0;
				log(null, ["Lexicon Slice / sortFunction", error]);
			}
		} while (!comp && ++col < maxCol);
		if(col === maxCol) {
			// Completely equal? Sort by IDs to keep things consistent.
			const x = a.id;
			const y = b.id;
			// X SHOULD NEVER EQUAL Y
			comp = x > y ? 1 : -1;
		}
		if(sortDir && comp) {
			// Reverse order
			return comp * -1;
		}
		return comp;
	};
	newLexicon.sort(sortFunction);
	return newLexicon;
};


const cleanStateFunc = (state: LexiconState, action: PayloadAction | null) => {
	const temp: any = {};
	cleanerObject.lexicon.forEach(key => {
		if((key === "customSort") || (state[key] !== undefined)) {
			temp[key] = state[key];
		}
	});
	const final: LexiconState = {...temp};
	return final;
};

const loadStateFunc = (state: LexiconState, action: PayloadAction<LexiconState>) => {
	const final = {
		...cleanStateFunc(state, null),
		...action.payload,
		truncateColumns: state.truncateColumns
	};
	return final;
};
const updateLexiconTextFunc = (state: LexiconState, action: PayloadAction<["title" | "description" | "id", string]>) => {
	const [ prop, value ] = action.payload;
	state[prop] = value;
	return state;
};
const updateLexiconNumberFunc = (state: LexiconState, action: PayloadAction<["lastSave", number]>) => {
	const [ prop, value ] = action.payload;
	state[prop] = value;
	return state;
};
const addLexiconItemFunc = (state: LexiconState, action: PayloadAction<[Lexicon, SorterFunc]>) => {
	const [lexObj, sorter] = action.payload;
	state.lexicon = sortLexicon([lexObj, ...state.lexicon], state.sortPattern, state.sortDir, state.blankSort, sorter);
	return state;
};
const addItemsToLexiconColumnFunc = (state: LexiconState, action: PayloadAction<[ string[], string, SorterFunc ]>) => {
	const totalNumberOfColumns = state.columns.length;
	const [items, columnId, sorter] = action.payload;
	let columnNumber = 0;
	state.columns.every((c, i) => {
		if(c.id === columnId) {
			columnNumber = i;
			return false;
		}
		return true;
	});
	items.forEach((item: string) => {
		const obj: Lexicon = {
			id: uuidv4(),
			columns: []
		};
		for(let x = 0; x < totalNumberOfColumns; x++) {
			obj.columns.push(x === columnNumber ? item : "");
		}
		state.lexicon.push(obj);
	});
	//addMultipleItemsAsColumn({words: [array], column: "id"})
	state.lexicon = sortLexicon(state.lexicon, state.sortPattern, state.sortDir, state.blankSort, sorter);
	return state;
};
const editLexiconItemFunc = (state: LexiconState, action: PayloadAction<[Lexicon, SorterFunc]>) => {
	//editLexiconItem({item})
	const [editedItem, sorter] = action.payload;
	const editedID = editedItem.id;
	const editedLexicon = state.lexicon.map(item => item.id === editedID ? editedItem : item);
	state.lexicon = sortLexicon(editedLexicon, state.sortPattern, state.sortDir, state.blankSort, sorter);
	return state;
};
const deleteLexiconItemFunc = (state: LexiconState, action: PayloadAction<string>) => {
	//deleteLexiconItem("id")
	const id = action.payload;
	state.lexicon = state.lexicon.filter(item => item.id !== id);
	return state;
};
const deleteMultipleLexiconItemsFunc = (state: LexiconState, action: PayloadAction<string[]>) => {
	//deleteLexiconItem("id")
	const ids = action.payload;
	state.lexicon = state.lexicon.filter(item => {
		const { id } = item;
		return ids.every(del => del !== id);
	});
	return state;
};
const updateLexiconSortFunc = (state: LexiconState, action: PayloadAction<[number[], SorterFunc]>) => {
	const [sortPattern, sorter] = action.payload;
	state.sortPattern = sortPattern;
	state.lexicon = sortLexicon([...state.lexicon], sortPattern, state.sortDir, state.blankSort, sorter);
	return state;
};
const updateLexiconSortDirFunc = (state: LexiconState, action: PayloadAction<[boolean, SorterFunc]>) => {
	const [sortDir, sorter] = action.payload;
	state.sortDir = sortDir;
	state.lexicon = sortLexicon([...state.lexicon], state.sortPattern, sortDir, state.blankSort, sorter);
	return state;
};
const toggleLexiconWrapFunc = (state: LexiconState) => {
	//setTruncate(boolean)
	state.truncateColumns = !state.truncateColumns;
	return state;
};
const setFontTypeFunc = (state: LexiconState, action: PayloadAction<string>) => {
	//setFontType("Noto Serif" | "Noto Sans" | "Source Code Pro")
	//  SEE: consts.fontsMap
	state.fontType = action.payload;
	return state;
};
const mergeLexiconItemsFunc = ( state: LexiconState, action: PayloadAction<[Lexicon[], Lexicon, SorterFunc]>) => {
	const [lexiconItemsBeingMerged, merged, sorter] = action.payload;
	merged.id = uuidv4();
	const newLexicon = [merged, ...state.lexicon.filter((lex) => lexiconItemsBeingMerged.every((lx) => lx.id !== lex.id))];
	state.lexicon = sortLexicon(newLexicon, state.sortPattern, state.sortDir, state.blankSort, sorter);
	return state;
};
const updateLexiconColumarInfoFunc = (
	state: LexiconState,
	action: PayloadAction<[
		Lexicon[],
		LexiconColumn[],
		number[],
		boolean,
		LexiconBlankSorts,
		string | undefined,
		SorterFunc]>
) => {
	const [
		lex,
		columns,
		sortPattern,
		truncateColumns,
		blankSort,
		customSort,
		sorter
	] = action.payload;
	const final: LexiconState = {
		...state,
		columns,
		sortPattern,
		truncateColumns,
		blankSort,
		customSort,
		lexicon: sortLexicon(lex, sortPattern, state.sortDir, blankSort, sorter)
	};
	return final;
};

const lexiconSlice = createSlice({
	name: 'lexicon',
	initialState,
	reducers: {
		loadStateLex: loadStateFunc,
		updateLexiconText: updateLexiconTextFunc,
		updateLexiconNumber: updateLexiconNumberFunc,
		addLexiconItem: addLexiconItemFunc,
		addItemsToLexiconColumn: addItemsToLexiconColumnFunc,
		doEditLexiconItem: editLexiconItemFunc,
		deleteLexiconItem: deleteLexiconItemFunc,
		deleteMultipleLexiconItems: deleteMultipleLexiconItemsFunc,
		updateLexiconSort: updateLexiconSortFunc,
		updateLexiconSortDir: updateLexiconSortDirFunc,
		toggleLexiconWrap: toggleLexiconWrapFunc,
	// TO-DO: custom info, font settings?
	setFontType: setFontTypeFunc,
		mergeLexiconItems: mergeLexiconItemsFunc,
		updateLexiconColumarInfo: updateLexiconColumarInfoFunc,
		cleanStateLexicon: cleanStateFunc
	}
});

export const {
	loadStateLex,
	updateLexiconText,
	updateLexiconNumber,
	addLexiconItem,
	addItemsToLexiconColumn,
	doEditLexiconItem,
	deleteLexiconItem,
	deleteMultipleLexiconItems,
	updateLexiconSort,
	updateLexiconSortDir,
	toggleLexiconWrap,
setFontType,
	mergeLexiconItems,
	updateLexiconColumarInfo,
	cleanStateLexicon
} = lexiconSlice.actions;

export default lexiconSlice.reducer;

// Constants are not changeable.
export const consts = {
	absoluteMaxColumns: 30,
	fontsMap: [
		["Serif", "Noto Serif"],
		["Sans-Serif", "Noto Sans"],
		["Monospace", "Source Code Pro"]
	]
};

// An equality-check function
export const equalityCheck = (stateA: LexiconState, stateB: LexiconState) => {
	if (stateA === stateB) {
		return true;
	}
	// stateA
	const titleA = stateA.title;
	const descriptionA = stateA.description;
	const lexiconA = stateA.lexicon;
	const truncateColumnsA = stateA.truncateColumns;
	const columnsA = stateA.columns;
	const sortDirA = stateA.sortDir;
	const sortPatternA = stateA.sortPattern;
	const blankSortA = stateA.blankSort;
	const fontTypeA = stateA.fontType;
	const customSortA = stateA.customSort;
	// stateB
	const titleB = stateB.title;
	const descriptionB = stateB.description;
	const lexiconB = stateB.lexicon;
	const truncateColumnsB = stateB.truncateColumns;
	const columnsB = stateB.columns;
	const sortDirB = stateB.sortDir;
	const sortPatternB = stateB.sortPattern;
	const blankSortB = stateB.blankSort;
	const fontTypeB = stateB.fontType;
	const customSortB = stateB.customSort;
	if (
		titleA !== titleB
		|| descriptionA !== descriptionB
		|| truncateColumnsA !== truncateColumnsB
		|| sortDirA !== sortDirB
		|| blankSortA !== blankSortB
		|| fontTypeA !== fontTypeB
		|| customSortA !== customSortB
		|| String(sortPatternA) !== String(sortPatternB)
	) {
		return false;
	}
	if(columnsA !== columnsB) {
		// Cols bad?
		const col = columnsA.every((col, i) => {
			const otherCol = columnsB[i];
			return col === otherCol ||
				(
					col.label === otherCol.label
					&& col.size === otherCol.size
				);
		});
		if(!col) {
			// if still bad, we're unequal
			return false;
		}
	}
	// Cols good. Lex bad?
	return (lexiconA === lexiconB) || lexiconA.every((lex, i) => {
		const otherLex = lexiconB[i];
		return lex === otherLex ||
			(
				lex.id === otherLex.id
				&& String(lex.columns) === String(otherLex.columns)
			);
	});
};

