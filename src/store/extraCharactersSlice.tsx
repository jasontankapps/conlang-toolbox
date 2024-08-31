import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import blankAppState, { cleanerObject } from './blankAppState';
import { ExtraCharactersDisplayName, ExtraCharactersList, ExtraCharactersState } from './types';

const initialState = blankAppState.ec;

const toggleCopyImmediatelyFunc = (state: ExtraCharactersState) => {
	state.copyImmediately = !state.copyImmediately;
	return state;
};
const toggleShowNamesFunc = (state: ExtraCharactersState) => {
	state.showNames = !state.showNames;
	return state;
};
const setToCopyFunc = (state: ExtraCharactersState, action: PayloadAction<string>) => {
	state.toCopy = action.payload;
	return state;
};
const setFavesFunc = (state: ExtraCharactersState, action: PayloadAction<ExtraCharactersList>) => {
	state.faves = action.payload;
	return state;
};
const setNowShowingFunc = (state: ExtraCharactersState, action: PayloadAction<ExtraCharactersDisplayName>) => {
	state.nowShowing = action.payload;
	return state;
};
const loadStateFunc = (state: ExtraCharactersState, action: PayloadAction<ExtraCharactersState>) => {
	const final = {
		...cleanStateFunc(state, null),
		...action.payload
	};
	return final;
};

const cleanStateFunc = (state: ExtraCharactersState, action: PayloadAction | null) => {
	const temp: any = {};
	cleanerObject.ec.forEach(key => {
		state[key] !== undefined && (temp[key] = state[key]);
	});
	const final: ExtraCharactersState = {...temp};
	return final;
};

const extraCharactersSlice = createSlice({
	name: 'extraCharacters',
	initialState,
	reducers: {
		toggleCopyImmediately: toggleCopyImmediatelyFunc,
		toggleShowNames: toggleShowNamesFunc,
		setToCopy: setToCopyFunc,
		setFaves: setFavesFunc,
		setNowShowing: setNowShowingFunc,
		loadStateEC: loadStateFunc,
		cleanStateEC: cleanStateFunc
	}
});

export const {
	toggleCopyImmediately,
	toggleShowNames,
	setToCopy,
	setFaves,
	setNowShowing,
	loadStateEC,
	cleanStateEC
} = extraCharactersSlice.actions;

export default extraCharactersSlice.reducer;
