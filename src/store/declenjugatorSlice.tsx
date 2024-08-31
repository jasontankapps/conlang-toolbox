import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DJCustomInfo, DJGroup, DJState } from './types';
import blankAppState, { cleanerObject } from './blankAppState';

interface DJGroupPayload {
	type: keyof DJCustomInfo
	group: DJGroup
}
interface DJGroupsPayload {
	type: keyof DJCustomInfo
	groups: DJGroup[]
}

const initialState = blankAppState.dj;

const setInputFunc = (state: DJState, action: PayloadAction<string>) => {
	state.input = action.payload;
	return state;
};

const addGroupFunc = (state: DJState, action: PayloadAction<DJGroupPayload>) => {
	const { type, group } = action.payload;
	state[type].push(group);
	return state;
};

const editGroupFunc = (state: DJState, action: PayloadAction<DJGroupPayload>) => {
	const { type, group } = action.payload;
	const { id } = group;
	state[type] = state[type].map((obj => {
		if(obj.id === id) {
			return group;
		}
		return obj;
	}));
	return state;
};

const deleteGroupFunc = (state: DJState, action: PayloadAction<[keyof DJCustomInfo, string] | null>) => {
	const { payload } = action;
	if(payload) {
		const [type, id] = payload;
		state[type] = id ? state[type].filter(obj => (obj.id !== id)) : [];
	} else {
		state.declensions = [];
		state.conjugations = [];
		state.other = [];
	}
	return state;
};

const reorderGroupsFunc = (state: DJState, action: PayloadAction<DJGroupsPayload>) => {
	const { type, groups } = action.payload;
	state[type] = groups;
	return state;
};

// LOAD INFO and CLEAR ALL
const loadStateFunc = (state: DJState, action: PayloadAction<DJCustomInfo | null>) => {
	// If payload is null (or falsy), then initialState is used
	const {
		declensions,
		conjugations,
		other
	} = action.payload || initialState;
	return {
		...cleanStateFunc(state),
		declensions,
		conjugations,
		other
	};
};

const cleanStateFunc = (state: DJState) => {
	const temp: any = {};
	cleanerObject.dj.forEach(key => {
		(temp[key] = state[key] || initialState[key]);
	});
	const final: DJState = {...temp};
	return final;
};

const declenjugatorSlice = createSlice({
	name: 'dj',
	initialState,
	reducers: {
		setInput: setInputFunc,
		addGroup: addGroupFunc,
		editGroup: editGroupFunc,
		deleteGroup: deleteGroupFunc,
		reorderGroups: reorderGroupsFunc,
		loadStateDJ: loadStateFunc,
		cleanStateDJ: cleanStateFunc
	}
});

export const {
	setInput,
	addGroup,
	editGroup,
	deleteGroup,
	reorderGroups,
	loadStateDJ,
	cleanStateDJ
} = declenjugatorSlice.actions;

export default declenjugatorSlice.reducer;
