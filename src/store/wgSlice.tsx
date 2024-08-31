import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import blankAppState, { cleanerObject } from './blankAppState';
import {
	Fifty_OneThousand,
	Five_OneHundred,
	SyllableDropoffs,
	SyllableTypes,
	Two_Fifteen,
	Base_WG,
	WGCharGroupObject,
	WGOutputTypes,
	WGState,
	WGTransformObject,
	Zero_Fifty,
	Zero_OneHundred,
	WECharGroupObject
} from './types';
import log from '../components/Logging';

const initialState: WGState = blankAppState.wg;

// GROUPS
const addCharacterGroupFunc = (state: WGState, action: PayloadAction<WGCharGroupObject>) => {
	// {label, description, run, ?dropoff}
	state.characterGroups.push(action.payload);
	return state;
};
const deleteCharacterGroupFunc = (state: WGState, action: PayloadAction<WGCharGroupObject | null>) => {
	if(!action.payload) {
		state.characterGroups = [];
		return state;
	}
	const { label } = action.payload;
	state.characterGroups = state.characterGroups.filter(group => group.label !== label);
	return state;
};
const editCharacterGroupFunc = (state: WGState, action: PayloadAction<{ old: WGCharGroupObject, edited: WGCharGroupObject }>) => {
	const {old, edited} = action.payload;
	const { label } = old;
	state.characterGroups = state.characterGroups.map(group => group.label === label ? edited : group);
	return state;
};
const copyCharacterGroupsFromElsewhereFunc = (state: WGState, action: PayloadAction<WECharGroupObject[]>) => {
	const newCharacterGroups = action.payload;
	const { characterGroups } = state;
	const incoming: { [key: string]: WGCharGroupObject } = {};
	newCharacterGroups.forEach(cg => {
		const {
			title,
			label,
			run
		} = cg;
		const output: WGCharGroupObject = {
			title,
			label: label!,
			run
		};
		incoming[label!] = output;
	});
	const final: WGCharGroupObject[] = [];
	characterGroups.forEach(cg => {
		const {label} = cg;
		// Check for replacement
		if(incoming[label]) {
			// Use replacement
			final.push(incoming[label]);
			delete incoming[label];
		} else {
			// Use original
			final.push(cg);
		}
	});
	newCharacterGroups.forEach(cg => {
		const {label} = cg;
		// Only save if we haven't used this to replace an old one
		if(incoming[label!]) {
			final.push(incoming[label!]);
		}
	});
	state.characterGroups = final;
	return state;
};

// SYLLABLES

const setMultipleSyllableTypesFunc = (state: WGState, action: PayloadAction<boolean>) => {
	state.multipleSyllableTypes = action.payload;
	return state;
};
const setSyllablesFunc = (state: WGState, action: PayloadAction<{ syllables: SyllableTypes, value: string, override: Zero_Fifty | null }>) => {
	const { syllables, value, override } = action.payload;
	state[syllables] = value.replace(/(?:\s*\r?\n\s*)+/g, "\n").trim();
	state.syllableDropoffOverrides[syllables] = override;
	return state;
};
const clearSyllablesFunc = (state: WGState, action: PayloadAction) => {
	state.singleWord = "";
	state.wordInitial = "";
	state.wordMiddle = "";
	state.wordFinal = "";
	state.syllableDropoffOverrides = {
		singleWord: null,
		wordInitial: null,
		wordMiddle: null,
		wordFinal: null
	};
	return state;
};

// TRANSFORMS
const addTransformFunc = (state: WGState, action: PayloadAction<WGTransformObject>) => {
	// { id, search, replace, ?description }
	state.transforms.push(action.payload);
	return state;
};
const deleteTransformFunc = (state: WGState, action: PayloadAction<string | null>) => {
	if(!action.payload) {
		state.transforms = [];
		return state;
	}
	const id = action.payload;
	state.transforms = state.transforms.filter(t => t.id !== id);
	return state;
};
const editTransformFunc = (state: WGState, action: PayloadAction<WGTransformObject>) => {
	const item = action.payload;
	const { id } = item;
	state.transforms = state.transforms.map(t => t.id === id ? item : t);
	return state;
};
const rearrangeTransformsFunc = (state: WGState, action: PayloadAction<WGTransformObject[]>) => {
	state.transforms = action.payload;
	return state;
};

// SETTINGS
const setMonosyllablesRateFunc = (state: WGState, action: PayloadAction<Zero_OneHundred>) => {
	state.monosyllablesRate = action.payload;
	return state;
};
const setMaxSyllablesPerWordFunc = (state: WGState, action: PayloadAction<Two_Fifteen>) => {
	state.maxSyllablesPerWord = action.payload;
	return state;
};
const setCharacterGroupDropoffFunc = (state: WGState, action: PayloadAction<Zero_Fifty>) => {
	state.characterGroupDropoff = action.payload;
	return state;
};
const setSyllableBoxDropoffFunc = (state: WGState, action: PayloadAction<Zero_Fifty>) => {
	state.syllableBoxDropoff = action.payload;
	return state;
};
const setCapitalizeSentencesFunc = (state: WGState, action: PayloadAction<boolean>) => {
	state.capitalizeSentences = action.payload;
	return state;
};
const setDeclarativeSentencePreFunc = (state: WGState, action: PayloadAction<string>) => {
	state.declarativeSentencePre = action.payload;
	return state;
};
const setDeclarativeSentencePostFunc = (state: WGState, action: PayloadAction<string>) => {
	state.declarativeSentencePost = action.payload;
	return state;
};
const setInterrogativeSentencePreFunc = (state: WGState, action: PayloadAction<string>) => {
	state.interrogativeSentencePre = action.payload;
	return state;
};
const setInterrogativeSentencePostFunc = (state: WGState, action: PayloadAction<string>) => {
	state.interrogativeSentencePost = action.payload;
	return state;
};
const setExclamatorySentencePreFunc = (state: WGState, action: PayloadAction<string>) => {
	state.exclamatorySentencePre = action.payload;
	return state;
};
const setExclamatorySentencePostFunc = (state: WGState, action: PayloadAction<string>) => {
	state.exclamatorySentencePost = action.payload;
	return state;
};
const setOutputFunc = (state: WGState, action: PayloadAction<WGOutputTypes>) => {
	state.output = action.payload;
	return state;
};
const setCustomSortFunc = (state: WGState, action: PayloadAction<string | null>) => {
	state.customSort = action.payload;
	log(null, [action.payload]);
	return state;
};
const setShowSyllableBreaksFunc = (state: WGState, action: PayloadAction<boolean>) => {
	state.showSyllableBreaks = action.payload;
	return state;
};
const setSentencesPerTextFunc = (state: WGState, action: PayloadAction<Five_OneHundred>) => {
	state.sentencesPerText = action.payload;
	return state;
};
const setCapitalizeWordsFunc = (state: WGState, action: PayloadAction<boolean>) => {
	state.capitalizeWords = action.payload;
	return state;
};
const setSortWordlistFunc = (state: WGState, action: PayloadAction<boolean>) => {
	state.sortWordlist = action.payload;
	return state;
};
const setWordlistMultiColumnFunc = (state: WGState, action: PayloadAction<boolean>) => {
	state.wordlistMultiColumn = action.payload;
	return state;
};
const setWordsPerWordlistFunc = (state: WGState, action: PayloadAction<Fifty_OneThousand>) => {
	state.wordsPerWordlist = action.payload;
	return state;
};

// LOAD INFO and CLEAR ALL
const loadStateFunc = (state: WGState, action: PayloadAction<Base_WG | null>) => {
	// If payload is null (or falsy), then initialState is used
	const {
		characterGroups,
		multipleSyllableTypes,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		syllableDropoffOverrides,
		transforms,
		monosyllablesRate,
		maxSyllablesPerWord,
		characterGroupDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost,
		customSort
	} = action.payload || initialState;
	return {
		...cleanStateFunc(state, null),
		characterGroups: [...characterGroups],
		multipleSyllableTypes,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		transforms: [...transforms],
		syllableDropoffOverrides: {...syllableDropoffOverrides},
		monosyllablesRate,
		maxSyllablesPerWord,
		characterGroupDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost,
		customSort
	};
};

const cleanStateFunc = (state: WGState, action: PayloadAction | null) => {
	const temp: any = {};
	cleanerObject.wg.forEach(key => {
		state[key] !== undefined && (temp[key] = state[key]);
	});
	const final: WGState = {...temp};
	return final;
};


const wgSlice = createSlice({
	name: 'wg',
	initialState,
	reducers: {
		addCharGroupWG: addCharacterGroupFunc,
		deleteCharGroupWG: deleteCharacterGroupFunc,
		editCharacterGroupWG: editCharacterGroupFunc,
		copyCharacterGroupsFromElsewhere: copyCharacterGroupsFromElsewhereFunc,
		setMultipleSyllableTypes: setMultipleSyllableTypesFunc,
		setSyllables: setSyllablesFunc,
		clearSyllables: clearSyllablesFunc,
		addTransformWG: addTransformFunc,
		deleteTransformWG: deleteTransformFunc,
		editTransformWG: editTransformFunc,
		rearrangeTransformsWG: rearrangeTransformsFunc,
		setMonosyllablesRate: setMonosyllablesRateFunc,
		setMaxSyllablesPerWord: setMaxSyllablesPerWordFunc,
		setCharacterGroupDropoff: setCharacterGroupDropoffFunc,
		setSyllableBoxDropoff: setSyllableBoxDropoffFunc,
		setCapitalizeSentences: setCapitalizeSentencesFunc,
		setDeclarativeSentencePre: setDeclarativeSentencePreFunc,
		setDeclarativeSentencePost: setDeclarativeSentencePostFunc,
		setInterrogativeSentencePre: setInterrogativeSentencePreFunc,
		setInterrogativeSentencePost: setInterrogativeSentencePostFunc,
		setExclamatorySentencePre: setExclamatorySentencePreFunc,
		setExclamatorySentencePost: setExclamatorySentencePostFunc,
		setOutputTypeWG: setOutputFunc,
		setCustomSort: setCustomSortFunc,
		setSyllableBreaksWG: setShowSyllableBreaksFunc,
		setSentencesPerTextWG: setSentencesPerTextFunc,
		setCapitalizeWordsWG: setCapitalizeWordsFunc,
		setSortWordlistWG: setSortWordlistFunc,
		setWordlistMulticolumnWG: setWordlistMultiColumnFunc,
		setWordsPerWordlistWG: setWordsPerWordlistFunc,
		loadStateWG: loadStateFunc,
		cleanStateWG: cleanStateFunc
	}
});

export const {
	addCharGroupWG,
	deleteCharGroupWG,
	editCharacterGroupWG,
	copyCharacterGroupsFromElsewhere,
	setMultipleSyllableTypes,
	setSyllables,
	clearSyllables,
	addTransformWG,
	deleteTransformWG,
	editTransformWG,
	rearrangeTransformsWG,
	setMonosyllablesRate,
	setMaxSyllablesPerWord,
	setCharacterGroupDropoff,
	setSyllableBoxDropoff,
	setCapitalizeSentences,
	setDeclarativeSentencePre,
	setDeclarativeSentencePost,
	setInterrogativeSentencePre,
	setInterrogativeSentencePost,
	setExclamatorySentencePre,
	setExclamatorySentencePost,
	setOutputTypeWG,
	setCustomSort,
	setSyllableBreaksWG,
	setSentencesPerTextWG,
	setCapitalizeWordsWG,
	setSortWordlistWG,
	setWordlistMulticolumnWG,
	setWordsPerWordlistWG,
	loadStateWG,
	cleanStateWG
} = wgSlice.actions;

export default wgSlice.reducer;

// An equality-check function
export const equalityCheck = (stateA: WGState, stateB: WGState) => {
	if (stateA === stateB) {
		return true;
	}
	const characterGroupsA = stateA.characterGroups;
	const multipleSyllableTypesA = stateA.multipleSyllableTypes;
	const singleWordA = stateA.singleWord;
	const wordInitialA = stateA.wordInitial;
	const wordMiddleA = stateA.wordMiddle;
	const wordFinalA = stateA.wordFinal;
	const syllableDropoffOverridesA = stateA.syllableDropoffOverrides;
	const transformsA = stateA.transforms;
	const monosyllablesRateA = stateA.monosyllablesRate;
	const maxSyllablesPerWordA = stateA.maxSyllablesPerWord;
	const characterGroupDropoffA = stateA.characterGroupDropoff;
	const syllableBoxDropoffA = stateA.syllableBoxDropoff;
	const capitalizeSentencesA = stateA.capitalizeSentences;
	const declarativeSentencePreA = stateA.declarativeSentencePre;
	const declarativeSentencePostA = stateA.declarativeSentencePost;
	const interrogativeSentencePreA = stateA.interrogativeSentencePre;
	const interrogativeSentencePostA = stateA.interrogativeSentencePost;
	const exclamatorySentencePreA = stateA.exclamatorySentencePre;
	const exclamatorySentencePostA = stateA.exclamatorySentencePost;
	const outputA = stateA.output;
	const customSortA = stateA.customSort;
	const showSyllableBreaksA = stateA.showSyllableBreaks;
	const sentencesPerTextA = stateA.sentencesPerText;
	const capitalizeWordsA = stateA.capitalizeWords;
	const sortWordlistA = stateA.sortWordlist;
	const wordlistMultiColumnA = stateA.wordlistMultiColumn;
	const wordsPerWordlistA = stateA.wordsPerWordlist;
	// stateB
	const characterGroupsB = stateB.characterGroups;
	const multipleSyllableTypesB = stateB.multipleSyllableTypes;
	const singleWordB = stateB.singleWord;
	const wordInitialB = stateB.wordInitial;
	const wordMiddleB = stateB.wordMiddle;
	const wordFinalB = stateB.wordFinal;
	const syllableDropoffOverridesB = stateB.syllableDropoffOverrides;
	const transformsB = stateB.transforms;
	const monosyllablesRateB = stateB.monosyllablesRate;
	const maxSyllablesPerWordB = stateB.maxSyllablesPerWord;
	const characterGroupDropoffB = stateB.characterGroupDropoff;
	const syllableBoxDropoffB = stateB.syllableBoxDropoff;
	const capitalizeSentencesB = stateB.capitalizeSentences;
	const declarativeSentencePreB = stateB.declarativeSentencePre;
	const declarativeSentencePostB = stateB.declarativeSentencePost;
	const interrogativeSentencePreB = stateB.interrogativeSentencePre;
	const interrogativeSentencePostB = stateB.interrogativeSentencePost;
	const exclamatorySentencePreB = stateB.exclamatorySentencePre;
	const exclamatorySentencePostB = stateB.exclamatorySentencePost;
	const outputB = stateB.output;
	const customSortB = stateB.customSort;
	const showSyllableBreaksB = stateB.showSyllableBreaks;
	const sentencesPerTextB = stateB.sentencesPerText;
	const capitalizeWordsB = stateB.capitalizeWords;
	const sortWordlistB = stateB.sortWordlist;
	const wordlistMultiColumnB = stateB.wordlistMultiColumn;
	const wordsPerWordlistB = stateB.wordsPerWordlist;
	// Test simple values
	if (
		multipleSyllableTypesA !== multipleSyllableTypesB
		|| singleWordA !== singleWordB
		|| wordInitialA !== wordInitialB
		|| wordMiddleA !== wordMiddleB
		|| wordFinalA !== wordFinalB
		|| monosyllablesRateA !== monosyllablesRateB
		|| maxSyllablesPerWordA !== maxSyllablesPerWordB
		|| characterGroupDropoffA !== characterGroupDropoffB
		|| syllableBoxDropoffA !== syllableBoxDropoffB
		|| capitalizeSentencesA !== capitalizeSentencesB
		|| declarativeSentencePreA !== declarativeSentencePreB
		|| declarativeSentencePostA !== declarativeSentencePostB
		|| interrogativeSentencePreA !== interrogativeSentencePreB
		|| interrogativeSentencePostA !== interrogativeSentencePostB
		|| exclamatorySentencePreA !== exclamatorySentencePreB
		|| exclamatorySentencePostA !== exclamatorySentencePostB
		|| outputA !== outputB
		|| customSortA !== customSortB
		|| showSyllableBreaksA !== showSyllableBreaksB
		|| sentencesPerTextA !== sentencesPerTextB
		|| capitalizeWordsA !== capitalizeWordsB
		|| sortWordlistA !== sortWordlistB
		|| wordlistMultiColumnA !== wordlistMultiColumnB
		|| wordsPerWordlistA !== wordsPerWordlistB
	) {
		return false;
	}
	// Test character groups
	if(testIfArrayOfObjectsAreUnequal(
		characterGroupsA,
		characterGroupsB,
		["description", "label", "run", "dropoff"]
	)) {
		// At least one group was unequal
		return false;
	}
	// Test transforms
	if(testIfArrayOfObjectsAreUnequal(
		transformsA,
		transformsB,
		["id", "search", "replace", "description"])
	) {
		// At least one transform was unequal
		return false;
	}
	// Test syllableDropoffOverrides
	if(testIfArrayOfObjectsAreUnequal(
		[syllableDropoffOverridesA],
		[syllableDropoffOverridesB],
		["singleWord", "wordInitial", "wordMiddle", "wordFinal"]
	)) {
		// At least one was unequal
		return false;
	}
	// Made it through everything?
	return true;
};

type Testing = WGCharGroupObject | WGTransformObject | SyllableDropoffs;
const testIfArrayOfObjectsAreUnequal = (A: Testing[], B: Testing[], props: string[]) => {
	return A.length !== B.length
		|| A.some((a, i) => {
			const b = B[i];
			return (a !== b) && props.some(p => a[p as keyof Testing] !== b[p as keyof Testing]);
		});
};
