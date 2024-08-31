import { Dispatch } from "redux";
import { loadStateConcepts } from "../store/conceptsSlice";
import { loadStateEC } from "../store/extraCharactersSlice";
import { loadStateLex } from "../store/lexiconSlice";
import { loadStateMS } from "../store/msSlice";
import { loadStateSettings } from "../store/settingsSlice";
import {
	AppSettings,
	ConceptDisplay,
	ConceptDisplayObject,
	ExtraCharactersDisplayName,
	ExtraCharactersState,
	Fifty_OneThousand,
	Five_OneHundred,
	LexiconState,
	MSBool,
	MSNum,
	MSState,
	MSText,
	ThemeNames,
	WEState,
	WGOutputTypes,
	WGState
} from "../store/types";
import { loadStateWE } from "../store/weSlice";
import { loadStateWG } from "../store/wgSlice";
import * as oldTypes from "./oldReduxTypes";

// Updating to 0.10.0
function doUpdate (incomingState: oldTypes.StateObject, dispatch: Dispatch) {
	dispatch(loadStateWG(updateWG(incomingState)));
	dispatch(loadStateWE(updateWE(incomingState)));
	dispatch(loadStateMS(updateMS(incomingState)));
	dispatch(loadStateLex(updateLex(incomingState)));
	dispatch(loadStateConcepts(updateConcepts(incomingState)));
	dispatch(loadStateEC(updateEC(incomingState)));
	dispatch(loadStateSettings(updateSettings(incomingState)));
}

function updateWG (incomingState: oldTypes.StateObject) {
	const {
		wordgenCharGroups,
		wordgenSyllables,
		wordgenTransforms,
		wordgenSettings
	} = incomingState;
	const {
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal
	} = wordgenSyllables.objects;
	const { charGroupRunDropoff, output, ...rest } = {
		output: "text",
		showSyllableBreaks: false,
		sentencesPerText: 10 as Five_OneHundred,
		capitalizeWords: false,
		sortWordlist: true,
		wordlistMultiColumn: true,
		wordsPerWordlist: 500 as Fifty_OneThousand,
		...wordgenSettings
	};
	const wg: WGState = {
		characterGroups: wordgenCharGroups.map.map(([label, object]) => ({...object, label})),
		multipleSyllableTypes: wordgenSyllables.toggle,
		singleWord: singleWord.components.join("\n"),
		wordInitial: wordInitial.components.join("\n"),
		wordMiddle: wordMiddle.components.join("\n"),
		wordFinal: wordFinal.components.join("\n"),
		syllableDropoffOverrides: {
			singleWord: singleWord.dropoffOverride === undefined ? null : singleWord.dropoffOverride,
			wordInitial: wordInitial.dropoffOverride === undefined ? null : wordInitial.dropoffOverride,
			wordMiddle: wordMiddle.dropoffOverride === undefined ? null : wordMiddle.dropoffOverride,
			wordFinal: wordFinal.dropoffOverride === undefined ? null : wordFinal.dropoffOverride,
		},
		transforms: wordgenTransforms.list.map(obj => ({
			id: obj.key,
			seek: obj.seek,
			replace: obj.replace,
			description: obj.description
		})),
		characterGroupDropoff: charGroupRunDropoff,
		output: output as WGOutputTypes,
		customSort: null,
		...rest
	};
	return wg;
};

function updateWE (incomingState: oldTypes.StateObject) {
	const {
		wordevolveCharGroups,
		wordevolveTransforms,
		wordevolveSoundChanges,
		wordevolveInput,
		wordevolveSettings
	} = incomingState;
	const we: WEState = {
		input: wordevolveInput.join("\n"),
		characterGroups: wordevolveCharGroups.map.map(([label, object]) => ({...object, label})),
		transforms: wordevolveTransforms.list.map(obj => {
			const {key, ...rest} = obj;
			return {
				id: key,
				...rest
			};
		}),
		soundChanges: wordevolveSoundChanges.list.map(obj => {
			const {key, ...rest} = obj;
			return {
				id: key,
				...rest
			};
		}),
		outputStyle: wordevolveSettings.output,
		inputLower: false,
		inputAlpha: false,
		customSort: null
	};
	return we;
}

function updateMS (incomingState: oldTypes.StateObject) {
	const { morphoSyntaxInfo } = incomingState;
	const { key, lastSave, title, description, bool, text, num } = morphoSyntaxInfo;
	const BOOL: { [key in MSBool]?: boolean } = {};
	const TEXT: { [key in MSText]?: string } = {};
	const NUM: { [key in MSNum]?: number } = {};
	Object.keys(bool).forEach(key => {
		const newProp: MSBool = "BOOL_" + key as MSBool;
		BOOL[newProp] = true;
	});
	Object.keys(text).forEach((key) => {
		const newProp: MSText = "TEXT_" + key as MSText;
		TEXT[newProp] = text[key as keyof oldTypes.MorphoSyntaxTextObject];
	});
	Object.keys(num).forEach(key => {
		const newProp: MSNum = "NUM_" + key as MSNum;
		NUM[newProp] = num[key as keyof oldTypes.MorphoSyntaxNumberObject];
	});
	const ms: MSState = {
		id: key,
		lastSave,
		title,
		description,
		...BOOL,
		...NUM,
		...TEXT
	};
	return ms;
}

function updateLex (incomingState: oldTypes.StateObject) {
	const lex: LexiconState = {
		...incomingState.lexicon,
		customSort: undefined
	};
	return lex;
}

function updateConcepts (incomingState: oldTypes.StateObject) {
	const { display: oldDisplay, ...etc } = incomingState.conceptsState;
	const display: ConceptDisplayObject = {};
	(Object.keys(oldDisplay) as ConceptDisplay[]).forEach((prop) => {
		display[prop] = true;
	});
	return {display, ...etc};
}

function updateEC (incomingState: oldTypes.StateObject) {
	const {
		display,
		saved,
		showNames,
		copyImmediately,
		copyLater
	} = incomingState.extraCharactersState;
	const ec: ExtraCharactersState = {
		nowShowing: display as ExtraCharactersDisplayName,
		toCopy: copyLater,
		showNames,
		copyImmediately,
		faves: saved
	};
	return ec;
}

function updateSettings (incomingState: oldTypes.StateObject) {
	const {
		theme,
		disableConfirms
	} = incomingState.appSettings;
	const settings: AppSettings = {
		theme: theme as ThemeNames,
		disableConfirms
	};
	return settings;
}

export default doUpdate
