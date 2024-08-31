import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SortSettings, SortLanguage, SortObject, SortSensitivity } from './types';
import blankAppState, { cleanerObject } from './blankAppState';

const initialState = blankAppState.sortSettings;

const checkForMultiples = (obj: SortObject) => {
	const {
		customAlphabet = [],
		customizations = []
	} = obj;
	const multiples = customAlphabet.concat(
		...customizations.map(o => {
			if("equals" in o) {
				return [
					o.base,
					...o.equals
				];
			}
			return [
				o.base,
				...o.pre,
				...o.post
			];
		})
	).filter(char => char.length > 1);
	return multiples;
};

const setSortLanguageCustomFunc = (state: SortSettings, action: PayloadAction<SortLanguage | null>) => {
	const value = action.payload;
	if(value) {
		state.sortLanguage = value;
	} else {
		delete state.sortLanguage;
	}
	return state;
};

const setSortSensitivityFunc = (state: SortSettings, action: PayloadAction<SortSensitivity>) => {
	state.sensitivity = action.payload;
	return state;
};

const addNewCustomSortFunc = (state: SortSettings, action: PayloadAction<SortObject>) => {
	const newObj = {...action.payload};
	newObj.multiples = checkForMultiples(newObj);
	state.customSorts.push(newObj);
	return state;
};

const editCustomSortFunc = (state: SortSettings, action: PayloadAction<SortObject>) => {
	const newObj = action.payload;
	const { id } = newObj;
	newObj.multiples = checkForMultiples(newObj);
	state.customSorts = state.customSorts.map((obj => {
		if(obj.id === id) {
			return newObj;
		}
		return obj;
	}));
	return state;
};

const deleteCustomSortFunc = (state: SortSettings, action: PayloadAction<string>) => {
	const { payload } = action;
	state.customSorts = state.customSorts.filter(obj => (obj.id !== payload));
	return state;
};

const setDefaultCustomSortFunc = (state: SortSettings, action: PayloadAction<string | null>) => {
	const { payload } = action;
	if(payload) {
		state.defaultCustomSort = payload;
	} else {
		delete state.defaultCustomSort;
	}
	return state;
};

const loadSortSettingsStateFunc = (state: SortSettings, action: PayloadAction<SortSettings>) => {
	const { payload } = action;
	return {
		...cleanStateFunc(state, null),
		...payload
	};
};

const cleanStateFunc = (state: SortSettings, action: PayloadAction | null) => {
	const temp: any = {};
	cleanerObject.sortSettings.forEach(key => {
		state[key] !== undefined && (temp[key] = state[key]);
	});
	const final: SortSettings = {...temp};
	return final;
};

const sortSettingsSlice = createSlice({
	name: 'sortSettings',
	initialState,
	reducers: {
		setSortLanguageCustom: setSortLanguageCustomFunc,
		setSortSensitivity: setSortSensitivityFunc,
		addNewCustomSort: addNewCustomSortFunc,
		editCustomSort: editCustomSortFunc,
		deleteCustomSort: deleteCustomSortFunc,
		setDefaultCustomSort: setDefaultCustomSortFunc,
		loadSortSettingsState: loadSortSettingsStateFunc,
		cleanStateSortSettings: cleanStateFunc
	}
});

export const {
	setSortLanguageCustom,
	setSortSensitivity,
	addNewCustomSort,
	editCustomSort,
	deleteCustomSort,
	setDefaultCustomSort,
	loadSortSettingsState,
	cleanStateSortSettings
} = sortSettingsSlice.actions;

export default sortSettingsSlice.reducer;
