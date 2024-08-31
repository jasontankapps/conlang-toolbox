import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InternalState,  SortLanguage } from './types';
import blankAppState from './blankAppState';

const initialState: InternalState = blankAppState.internals;

const NinetyDays =
	1000
	* 60
	* 60
	* 24
	* 90;

const logFunc = (state: InternalState, action: PayloadAction<string[] | null>) => {
	// Call with null to clean logs
	const { payload } = action;
	const time = Date.now();
	const then = time - NinetyDays;
	const logs = state.logs.filter(log => log.time > then);
	payload && logs.push({
		time,
		log: payload
	});
	return {
		...state,
		logs
	};
};

const clearLogsFunc = (state: InternalState) => {
	return { ...state, logs: [] };
};

const setDefaultSortLanguageFunc = (state: InternalState, action: PayloadAction<SortLanguage>) => {
	state.defaultSortLanguage = action.payload;
	return state;
};

const setLastCleanFunc = (state: InternalState, action: PayloadAction<number>) => {
	state.lastClean = action.payload;
	return state;
};

const setLastViewMSFunc = (state: InternalState, action: PayloadAction<string>) => {
	state.lastViewMS = action.payload;
	return state;
};


const internalsSlice = createSlice({
	name: 'internals',
	initialState,
	reducers: {
		saveToLog: logFunc,
		setDefaultSortLanguage: setDefaultSortLanguageFunc,
		setLastClean: setLastCleanFunc,
		setLastViewMS: setLastViewMSFunc,
		clearLogs: clearLogsFunc
	}
});

export const {
	saveToLog,
	setDefaultSortLanguage,
	setLastClean,
	setLastViewMS,
	clearLogs
} = internalsSlice.actions;

export default internalsSlice.reducer;
