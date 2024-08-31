import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import blankAppState, { cleanerObject } from './blankAppState';
import {
	WECharGroupObject,
	WEOutputTypes,
	WEPresetObject,
	WESoundChangeObject,
	WEState,
	WETransformObject,
	WGCharGroupObject
} from './types';
import log from '../components/Logging';

const initialState: WEState = blankAppState.we as WEState;

// INPUT
const setInputFunc = (state: WEState, action: PayloadAction<string>) => {
	const { payload } = action;
	state.input = payload.trim().replace(/(\s*\r?\n\s*)+/g, "\n");
	return state;
};

// GROUPS
const addCharacterGroupFunc = (state: WEState, action: PayloadAction<WECharGroupObject>) => {
	// {label, description, run}
	state.characterGroups.push(action.payload);
	return state;
};
const deleteCharacterGroupFunc = (state: WEState, action: PayloadAction<WECharGroupObject | null>) => {
	if(!action.payload) {
		state.characterGroups = [];
		return state;
	}
	const { label } = action.payload;
	state.characterGroups = state.characterGroups.filter(group => group.label !== label);
	return state;
};
const editCharacterGroupFunc = (state: WEState, action: PayloadAction<{ label: string, edited: WECharGroupObject }>) => {
	const {label, edited} = action.payload;
	state.characterGroups = state.characterGroups.map(group => group.label === label ? edited : group);
	return state;
};
const copyCharacterGroupsFromElsewhereFunc = (state: WEState, action: PayloadAction<WGCharGroupObject[]>) => {
	const newCharacterGroups = action.payload;
	const { characterGroups } = state;
	const incoming: { [key: string]: WECharGroupObject } = {};
	newCharacterGroups.forEach(cg => {
		const { title, label, run } = cg;
		incoming[label] = {
			title,
			label,
			run
		};
	});
	const final: WECharGroupObject[] = [];
	characterGroups.forEach(cg => {
		const {label} = cg;
		// Check for replacement
		if(incoming[label!]) {
			// Use replacement
			final.push(incoming[label!]);
			delete incoming[label!];
		} else {
			// Use original
			final.push(cg);
		}
	});
	newCharacterGroups.forEach(cg => {
		const {label} = cg;
		// Only save if we haven't used this to replace an old one
		if(incoming[label]) {
			final.push(incoming[label]);
		}
	});
	state.characterGroups = final;
	return state;
};

// TRANSFORMS
const addTransformFunc = (state: WEState, action: PayloadAction<WETransformObject>) => {
	// { id, search, replace, direction, ?description }
	state.transforms.push(action.payload);
	return state;
};
const deleteTransformFunc = (state: WEState, action: PayloadAction<string | null>) => {
	if(!action.payload) {
		state.transforms = [];
		return state;
	}
	const id = action.payload;
	state.transforms = state.transforms.filter(t => t.id !== id);
	return state;
};
const editTransformFunc = (state: WEState, action: PayloadAction<WETransformObject>) => {
	const item = action.payload;
	const { id } = item;
	state.transforms = state.transforms.map(t => t.id === id ? item : t);
	return state;
};
const rearrangeTransformsFunc = (state: WEState, action: PayloadAction<WETransformObject[]>) => {
	state.transforms = action.payload;
	return state;
};

// SOUND CHANGES
const addSoundChangeFunc = (state: WEState, action: PayloadAction<WESoundChangeObject>) => {
	// { id, beginning, ending, context, exception }
	state.soundChanges.push(action.payload);
	return state;
};
const deleteSoundChangeFunc = (state: WEState, action: PayloadAction<string | null>) => {
	if(!action.payload) {
		state.soundChanges = [];
		return state;
	}
	const id = action.payload;
	state.soundChanges = state.soundChanges.filter(t => t.id !== id);
	return state;
};
const editSoundChangeFunc = (state: WEState, action: PayloadAction<WESoundChangeObject>) => {
	const item = action.payload;
	const { id } = item;
	state.soundChanges = state.soundChanges.map(t => t.id === id ? item : t);
	return state;
};
const rearrangeSoundChangesFunc = (state: WEState, action: PayloadAction<WESoundChangeObject[]>) => {
	state.soundChanges = action.payload;
	return state;
};

// SETTINGS
const setOutputFunc = (state: WEState, action: PayloadAction<WEOutputTypes>) => {
	const outputStyle = action.payload;
	switch(outputStyle) {
		case "outputOnly":
		case "inputFirst":
		case "outputFirst":
		case "rulesApplied":
			state.outputStyle = outputStyle;
			break;
		default:
			log(null, [`INVALID OUTPUT STYLE [${outputStyle}]`]);
	}
	return state;
};
const setFlagFunc = (state: WEState, action: PayloadAction<["inputLower" | "inputAlpha", boolean]>) => {
	const [prop, value] = action.payload;
	state[prop] = value;
	return state;
};
const setCustomSortFunc = (state: WEState, action: PayloadAction<string | null>) => {
	state.customSort = action.payload;
	return state;
};

// LOAD INFO and CLEAR ALL
const loadStateFunc = (state: WEState, action: PayloadAction<WEPresetObject>) => {
	// If payload is null (or falsy), then initialState is used
	const {
		characterGroups,
		transforms,
		soundChanges
	} = action.payload || initialState;
	const newState = {
		...cleanStateFunc(state, null),
		characterGroups: [...characterGroups],
		transforms: [...transforms],
		soundChanges: [...soundChanges]
	};
	return newState;
};

const cleanStateFunc = (state: WEState, action: PayloadAction | null) => {
	const temp: any = {};
	cleanerObject.we.forEach(key => {
		state[key] !== undefined && (temp[key] = state[key]);
	});
	const final: WEState = {...temp};
	return final;
};

const weSlice = createSlice({
	name: 'we',
	initialState,
	reducers: {
		setInputWE: setInputFunc,
		addCharacterGroupWE: addCharacterGroupFunc,
		deleteCharacterGroupWE: deleteCharacterGroupFunc,
		editCharacterGroupWE: editCharacterGroupFunc,
		copyCharacterGroupsFromElsewhere: copyCharacterGroupsFromElsewhereFunc,
		addTransformWE: addTransformFunc,
		deleteTransformWE: deleteTransformFunc,
		editTransformWE: editTransformFunc,
		rearrangeTransformsWE: rearrangeTransformsFunc,
		addSoundChangeWE: addSoundChangeFunc,
		deleteSoundChangeWE: deleteSoundChangeFunc,
		editSoundChangeWE: editSoundChangeFunc,
		rearrangeSoundChangesWE: rearrangeSoundChangesFunc,
		setOutputWE: setOutputFunc,
		setFlag: setFlagFunc,
		setCustomSort: setCustomSortFunc,
		loadStateWE: loadStateFunc,
		cleanStateWE: cleanStateFunc
	}
});

export const {
	setInputWE,
	addCharacterGroupWE,
	deleteCharacterGroupWE,
	editCharacterGroupWE,
	copyCharacterGroupsFromElsewhere,
	addTransformWE,
	deleteTransformWE,
	editTransformWE,
	rearrangeTransformsWE,
	addSoundChangeWE,
	deleteSoundChangeWE,
	editSoundChangeWE,
	rearrangeSoundChangesWE,
	setOutputWE,
	setFlag,
	setCustomSort,
	loadStateWE,
	cleanStateWE
} = weSlice.actions;

export default weSlice.reducer;
