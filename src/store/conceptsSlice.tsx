import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import blankAppState, { cleanerObject } from './blankAppState';
import { Concept, ConceptsState,  ConceptDisplayObject } from './types';
import { v4 as uuidv4 } from 'uuid';

const initialState = blankAppState.concepts;

const updateConceptsDisplayFunc = (state: ConceptsState, action: PayloadAction<ConceptDisplayObject>) => {
	state.display = action.payload;
	return state;
};

const toggleConceptsBooleanFunc = (state: ConceptsState, action: PayloadAction<"textCenter" | "showingCombos">) => {
	state[action.payload] = !state[action.payload];
	return state;
};

const addCustomHybridMeaningFunc = (state: ConceptsState, action: PayloadAction<Concept[]>) => {
	state.combinations.push({
		id: uuidv4(),
		parts: action.payload
	});
	return state;
};

const removeCustomHybridMeaningsFunc = (state: ConceptsState, action: PayloadAction<string[]>) => {
	state.combinations = state.combinations.filter(combo => action.payload.every((id: string) => id !== combo.id));
	return state;
};

const loadStateConceptsFunc = (state: ConceptsState, action: PayloadAction<ConceptsState>) => {
	const final = {
		...cleanStateFunc(state, null),
		...action.payload
	};
	return final;
};

const cleanStateFunc = (state: ConceptsState, action: PayloadAction | null) => {
	const temp: any = {};
	cleanerObject.concepts.forEach(key => {
		state[key] !== undefined && (temp[key] = state[key]);
	});
	const final: ConceptsState = {...temp};
	return final;
};


const conceptsSlice = createSlice({
	name: 'concepts',
	initialState,
	reducers: {
		updateConceptsDisplay: updateConceptsDisplayFunc,
		toggleConceptsBoolean: toggleConceptsBooleanFunc,
		addCustomHybridMeaning: addCustomHybridMeaningFunc,
		deleteCustomHybridMeanings: removeCustomHybridMeaningsFunc,
		loadStateConcepts: loadStateConceptsFunc,
		cleanStateConcepts: cleanStateFunc
	}
});

export const {
	updateConceptsDisplay,
	toggleConceptsBoolean,
	addCustomHybridMeaning,
	deleteCustomHybridMeanings,
	loadStateConcepts,
	cleanStateConcepts
} = conceptsSlice.actions;

export default conceptsSlice.reducer;

/*
export const equalityCheck = (stateA: ConceptsState, stateB: ConceptsState) => {
	if (stateA === stateB) {
		return true;
	} else if (stateA.textCenter !== stateB.textCenter) {
		// the basics are unequal
		return false;
	}
	try {
		const keytester = (keysA, keysB) => {
			return (
				keysA.length === keysB.length
					&& String(keysA.sort()) === String(keysB.sort())
			);
		};
		const listA = stateA.listsDisplayed;
		const listB = stateB.listsDisplayed;
		if(listA !== listB) {
			if (!keytester(Object.keys(listA), Object.keys(listB))) {
				// the lists displayed are unequal
				return false;
			}
		}
		const saveA = stateA.savingForLexicon;
		const saveB = stateB.savingForLexicon;
		if(saveA !== saveB) {
			if (!keytester(Object.keys(saveA), Object.keys(saveB))) {
				// the items to be saved are unequal
				return false;
			}
		}
		// equality!
		return true;
	} catch (error) {
		console.log(error);
		// Assume false
		return false;
	}
};
*/
