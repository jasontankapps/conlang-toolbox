//import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch } from 'redux';

import {
	CustomStorageWE,
	CustomStorageWG,
	DeclenjugatorStorage,
	LexiconStorage,
	MorphoSyntaxStorage
} from '../components/PersistentInfo';
import log from '../components/Logging';

import { cleanStateWG } from './wgSlice';
import { cleanStateWE } from './weSlice';
import { cleanStateMS } from './msSlice';
import { cleanStateDJ } from './declenjugatorSlice';
import { cleanStateConcepts } from './conceptsSlice';
import { cleanStateLexicon } from './lexiconSlice';
import { cleanStateSettings } from './settingsSlice';
import { cleanStateSortSettings } from './sortingSlice';
import { cleanStateEC } from './extraCharactersSlice';
import { saveToLog, setLastClean } from './internalsSlice';
import blankAppState, { cleanerObject } from './blankAppState';
import {
	VALIDATE_Lex,
	VALIDATE_djStoredInfo,
	VALIDATE_ms,
	VALIDATE_weStoredInfo,
	VALIDATE_wgStoredInfo
} from './validators';
import {
	Base_WG,
	Lexicon,
	LexiconBlankSorts,
	LexiconColumn,
	LexiconState,
	MSBool,
	MSNum,
	MSText,
	SyllableDropoffs,
	Two_Fifteen,
	WECharGroupObject,
	WEPresetObject,
	WESoundChangeObject,
	WETransformDirection,
	WETransformObject,
	WGCharGroupObject,
	WGSettings,
	WGSyllables,
	WGTransformObject,
	Zero_Fifty,
	Zero_OneHundred
} from './types';


const ensureString = (input: unknown, alternate: string): string => (typeof input) === "string" ? alternate : (input as string);
const ensureNumber = (input: unknown, alternate: number): number => (
	typeof (input) !== "number"
	|| isNaN(input)
	|| Math.round(input) !== input
	? alternate : input
);
const ensureLimit = (input: unknown, alternate: number, min: number, max: number): number => (
	typeof (input) !== "number"
	|| isNaN(input)
	|| Math.round(input) !== input
	|| input < min
	|| input > max
	? alternate : input
);
const ensureBoolean = (input: unknown, alternate: boolean): boolean => typeof (input) !== "boolean" ? alternate : input;

const isString = (input: unknown) => typeof input === "string";
const isNumber = (input: unknown) => typeof input === "number" && !isNaN(input) && Math.round(input) === input;
const isObject = (input: unknown) => input && (typeof input === "object");


const interval = (
	1000 // 1000 miliseconds per second
	* 60 // 60 seconds per minute
	* 60 // 60 minutes per hour
	* 24 // 24 hours per day
);
// Arbitrary date
const cleanStoreIfLastCleanBefore = 1700726000000;

const maybeCleanState = (dispatch: Dispatch, lastClean: number) => {
	const now = Date.now();
	// Maybe Clean Storages
	if(
		// Cleaning Storage should be assured at least once (when state changes)...
		lastClean < cleanStoreIfLastCleanBefore
		|| (
			// ...but otherwise can be less frequent.
			(now - interval < lastClean)
			&& (Math.random() * 7) < 1
		)
	) {
		cleanStorages(dispatch);
	}
	// Clean State
	if(now - interval < lastClean) {
		// We've cleaned recently.
		return;
	}
	dispatch(cleanStateWG());
	dispatch(cleanStateWE());
	dispatch(cleanStateMS());
	dispatch(cleanStateDJ());
	dispatch(cleanStateConcepts());
	dispatch(cleanStateLexicon());
	dispatch(cleanStateSettings());
	dispatch(cleanStateSortSettings());
	dispatch(cleanStateEC());
	// Call with null to clean logs
	dispatch(saveToLog(null));
	// Mark that we've cleaned.
	dispatch(setLastClean(now));
};

export default maybeCleanState;

type StorageInfo = [string, any][];

type EasyLogger = (x: any[], ...y: any[]) => void;

const cleanStorages = (dispatch: Dispatch) => {
	const lexS: StorageInfo = [];
	const msS: StorageInfo = [];
	const wgS: StorageInfo = [];
	const weS: StorageInfo = [];
	const djS: StorageInfo = [];
	const logger: EasyLogger = (main, ...args) => log(dispatch, main, ...args);
	LexiconStorage.iterate((value: any, key: string) => {
		lexS.push([key, value]);
		return; // Blank return keeps the loop going
	}).then(() => MorphoSyntaxStorage.iterate((value: any, key: string) => {
		msS.push([key, value]);
		return; // Blank return keeps the loop going
	})).then(() => CustomStorageWE.iterate((value: any, title: string) => {
		weS.push([title, value]);
		return; // Blank return keeps the loop going
	})).then(() => CustomStorageWG.iterate((value: any, title: string) => {
		wgS.push([title, value]);
		return; // Blank return keeps the loop going
	})).then(() => DeclenjugatorStorage.iterate((value: any, title: string) => {
		djS.push([title, value]);
		return; // Blank return keeps the loop going
	})).then(() => {
		// The meat of the operations
		cleanLexiconStorage(lexS, logger);
		cleanWordGenStorage(wgS, logger);
		cleanMorphoSyntaxStorage(msS, logger);
		cleanWordEvolveStorage(weS, logger);
		cleanDeclenjugatorStorage(djS, logger);
	}).catch((reason: any) => {
		logger(["Error trying to clean storages", reason]);
	});
};

const cleanLexiconStorage = (input: StorageInfo, logger: EasyLogger) => {
	input.forEach(pair => {
		const [originalKey, originalObj] = pair;
		try {
			VALIDATE_Lex(originalObj);
		} catch(e) {
			// Invalid Lex
			if(isObject(originalObj)) {
				const {
					id, key, lastSave, title, description, columns, columnOrder, columnTitles,
					columnSizes, sortPattern, sort, sortDir, lexicon, truncateColumns, lexiconWrap,
					blankSort, customSort
				} = originalObj;
				if(Array.isArray(lexicon)) {
					let flag: false | number = false;
					const newColumns: LexiconColumn[] = [];
					const newPattern: number[] = [];
					const savedOrder: number[] = [];
					if(isNumber(columns) && [columnOrder, columnTitles, columnSizes, sort].every(arr => Array.isArray(arr))) {
						// Old style
						if(
							columns === columnOrder.length
							&& columns === columnSizes.length
							&& columns === columnTitles.length
							&& columns === sort.length
						) {
							for(let pos = 0; pos < columns; pos++) {
								let newPos = -1;
								for(let x = 0; x < columns && pos !== newPos; x++) {
									newPos = columnOrder[x];
								}
								newColumns.push({
									id: uuidv4(),
									size: ["s", "m", "l"].includes(columnSizes[newPos]!) ? columnSizes[newPos]! : "m",
									label: columnTitles[newPos]!
								});
								newPattern.push(sort[newPos]!);
								savedOrder.push(newPos);
							}
							flag = columns;
						}
					} else if (Array.isArray(columns) && Array.isArray(sortPattern)) {
						// New style
						newPattern.push(...sortPattern);
						newColumns.push(...columns);
						savedOrder.push(...columns.map((col, i) => i));
						flag = columns.length;
					}
					if(flag !== false) {
						const newLexicon: Lexicon[] = [];
						if(lexicon.every(lex => {
							if(isObject(lex)) {
								const {id, key, columns} = lex;
								if(columns.length !== flag || !columns.every((col: any) => isString(col))) {
									return false;
								}
								newLexicon.push({
									id: ensureString(id || key, uuidv4()),
									columns: savedOrder.map(i => columns[i]!)
								});
								return true;
							}
							return false;
						})) {
							const lex = blankAppState.lexicon;
							const newObj: LexiconState = {
								id: ensureString(id || key, uuidv4()),
								lastSave: ensureNumber(lastSave, 0),
								title: ensureString(title, "[error]"),
								description: ensureString(description, ""),
								columns: newColumns,
								truncateColumns: ensureBoolean(
									lexiconWrap === undefined ? truncateColumns : !lexiconWrap,
									lex.truncateColumns
								),
								lexicon: newLexicon,
								sortDir: ensureBoolean(sortDir, lex.sortDir),
								sortPattern: newPattern,
								blankSort: ["alphaFirst", "alphaLast", "first", "last"].includes(blankSort)
									? blankSort as LexiconBlankSorts
									: lex.blankSort,
								customSort: customSort || undefined
							};
							try {
								VALIDATE_Lex(newObj);
								LexiconStorage.setItem(originalKey, newObj);
							} catch (e) {
								logger(
									["Constructed Lexicon object was invalid [error, constructed, old]", e],
									newObj,
									originalObj
								);
							}
							return;
						}
					}
				}
			}
			// If we get to this point, there's been an error
			logger(
				["Error trying to convert WordGen storage to new format", e],
				originalKey,
				originalObj
			);
		}
	});
};

export const createCleanWordGenStorageObject = (...objects: any[]) => {
	const [groups, sylls, transformers, setts] = objects;
	const parseGroups = (input: any): WGCharGroupObject[] | false => {
		if(isObject(input)) {
			if(input.map && Array.isArray(input.map)) {
				const groups: WGCharGroupObject[] = [];
				const ok = input.map.every((pair: any) => {
					if(Array.isArray(pair) && pair.length === 2) {
						const [label, obj] = pair;
						if(isString(label) && isObject(obj)) {
							const {title, run} = obj;
							if(isString(title) && isString(run)) {
								groups.push({
									title,
									label,
									run
								});
								return true;
							}
						}
					}
					return false;
				});
				return ok ? groups : false;
			}
		}
		return false;
	};
	const parseTransforms = (input: any): WGTransformObject[] | false => {
		if(isObject(input)) {
			if(input.list && Array.isArray(input.list)) {
				const groups: WGTransformObject[] = [];
				const ok = input.list.every((obj: any) => {
					const {key, seek, replace, description} = obj;
					if(
						isString(key)
						&& isString(seek)
						&& isString(replace)
						&& isString(description)
					) {
						groups.push({
							id: key,
							seek,
							replace,
							description
						});
						return true;
					}
					return false;
				});
				return ok ? groups : false;
			}
		}
		return false;
	};
	const parseSyllables = (input: any): WGSyllables | false => {
		if(isObject(input)) {
			const { toggle, objects } = input;
			if(isObject(objects)) {
				const { singleWord, wordInitial, wordMiddle, wordFinal } = objects;
				if([singleWord, wordInitial, wordMiddle, wordFinal].every(obj => {
					if(isObject(obj)) {
						const components = obj.components;
						return Array.isArray(components) && components.every(str => isString(str));
					}
					return false;
				})) {
					const getOverride = (input: any): null | Zero_Fifty => {
						if(input === 0) {
							return input;
						} else if (!input) {
							return null;
						}
						return isNumber(input) ? Math.min(50, Math.max(0, input)) as Zero_Fifty : null;
					};
					let flag: boolean = false;
					const sw = singleWord.components.join("\n");
					const wi = wordInitial.components.join("\n");
					const wm = wordMiddle.components.join("\n");
					const wf = wordFinal.components.join("\n");
					const multipleSyllableTypes = ensureBoolean(toggle, flag);
					const syllableDropoffOverrides: SyllableDropoffs = {
						singleWord: getOverride(singleWord.dropoffOverride),
						wordInitial: getOverride(wordInitial.dropoffOverride),
						wordMiddle: getOverride(wordMiddle.dropoffOverride),
						wordFinal: getOverride(wordFinal.dropoffOverride)
					};
					const final: WGSyllables = {
						multipleSyllableTypes,
						syllableDropoffOverrides,
						singleWord: sw,
						wordInitial: wi,
						wordMiddle: wm,
						wordFinal: wf
					};
					return final;
				}
			}
		}
		return false;
	};
	const parseSettings = (input: any): WGSettings | false => {
		if(isObject(input)) {
			const base = blankAppState.wg;
			const final: WGSettings = {
				monosyllablesRate: ensureLimit(input.monosyllablesRate, base.monosyllablesRate, 0, 100) as Zero_OneHundred,
				maxSyllablesPerWord: ensureLimit(input.maxSyllablesPerWord, base.maxSyllablesPerWord, 0, 100) as Two_Fifteen,
				characterGroupDropoff: ensureLimit(input.characterGroupDropoff, base.characterGroupDropoff, 0, 100) as Zero_Fifty,
				syllableBoxDropoff: ensureLimit(input.syllableBoxDropoff, base.syllableBoxDropoff, 0, 100) as Zero_Fifty,
				capitalizeSentences: ensureBoolean(input.capitalizeSentences, base.capitalizeSentences),
				declarativeSentencePre: ensureString(input.declarativeSentencePre, base.declarativeSentencePre),
				declarativeSentencePost: ensureString(input.declarativeSentencePost, base.declarativeSentencePost),
				interrogativeSentencePre: ensureString(input.interrogativeSentencePre, base.interrogativeSentencePre),
				interrogativeSentencePost: ensureString(input.interrogativeSentencePost, base.interrogativeSentencePost),
				exclamatorySentencePre: ensureString(input.exclamatorySentencePre, base.exclamatorySentencePre),
				exclamatorySentencePost: ensureString(input.exclamatorySentencePost, base.exclamatorySentencePost),
				customSort: null
			};
			return final;
		}
		return false;
	};
	const characterGroups = parseGroups(groups);
	const transforms = parseTransforms(transformers);
	const syllables = parseSyllables(sylls);
	const settings = parseSettings(setts);
	if(characterGroups && transforms && syllables && settings) {
		const newObj: Base_WG = {
			characterGroups,
			transforms,
			...syllables,
			...settings
		};
		return newObj;
	}
	return false;
};
const cleanWordGenStorage = (input: StorageInfo, logger: EasyLogger) => {
	input.forEach(pair => {
		const [key, obj] = pair;
		try {
			VALIDATE_wgStoredInfo(obj);
		} catch(e) {
			// Invalid WG
			if(Array.isArray(obj) && obj.length === 4) {
				const newObj = createCleanWordGenStorageObject(...obj);
				if(!newObj) {
					logger(["Unable to reconstruct WordGen object", e], newObj);
				} else {
					try {
						VALIDATE_wgStoredInfo(newObj);
						CustomStorageWG.setItem(key, newObj);
					} catch (e2) {
						logger(["Constructed WordGen object was invalid", e2], newObj);
					}
				}
				return;
			}
			// If we get to this point, there's been an error
			logger(
				["Error trying to convert WordGen storage to new format", e],
				key,
				obj
			);
		}
	});
};

export const createCleanWordEvolveStorageObject = (...objects: any[]) => {
	const parseGroups = (input: any): WECharGroupObject[] | false => {
		if(isObject(input)) {
			if(input.map && Array.isArray(input.map)) {
				const groups: WECharGroupObject[] = [];
				const ok = input.map.every((pair: any) => {
					if(Array.isArray(pair) && pair.length === 2) {
						const [label, obj] = pair;
						if(isString(label) && isObject(obj)) {
							const {title, run} = obj;
							if(isString(title) && isString(run)) {
								groups.push({
									title,
									label,
									run
								});
								return true;
							}
						}
					}
					return false;
				});
				return ok ? groups : false;
			}
		}
		return false;
	};
	const parseTransforms = (input: any): WETransformObject[] | false => {
		if(isObject(input)) {
			if(input.list && Array.isArray(input.list)) {
				const groups: WETransformObject[] = [];
				const ok = input.list.every((obj: any) => {
					const {key, seek, replace, direction, description} = obj;
					if(
						isString(key)
						&& isString(seek)
						&& isString(replace)
						&& isString(direction)
						&& isString(description)
						&& (
							["both", "double", "in", "out"].includes(direction)
						)
					) {
						groups.push({
							id: key,
							seek,
							replace,
							direction: direction as WETransformDirection,
							description
						});
						return true;
					}
					return false;
				});
				return ok ? groups : false;
			}
		}
		return false;
	};
	const parseChanges = (input: any): WESoundChangeObject[] | false => {
		if(isObject(input)) {
			if(input.list && Array.isArray(input.list)) {
				const groups: WESoundChangeObject[] = [];
				const ok = input.list.every((obj: any) => {
					const {key, seek, replace, context, anticontext, description} = obj;
					if(
						isString(key)
						&& isString(seek)
						&& isString(replace)
						&& isString(context)
						&& isString(anticontext)
						&& isString(description)
					) {
						groups.push({
							id: key,
							seek,
							replace,
							context,
							anticontext,
							description
						});
						return true;
					}
					return false;
				});
				return ok ? groups : false;
			}
		}
		return false;
	};
	const [groups, transformers, soundchanges] = objects;
	const characterGroups = parseGroups(groups);
	const transforms = parseTransforms(transformers);
	const soundChanges = parseChanges(soundchanges);
	if(characterGroups && transforms && soundChanges) {
		const newObj: WEPresetObject = {
			characterGroups,
			transforms,
			soundChanges
		};
		return newObj;
	}
	return false;
};
const cleanWordEvolveStorage = (input: StorageInfo, logger: EasyLogger) => {
	input.forEach(pair => {
		const [key, obj] = pair;
		try {
			VALIDATE_weStoredInfo(obj);
		} catch(e) {
			// Invalid WE
			if(Array.isArray(obj) && obj.length === 3) {
				const newObj = createCleanWordEvolveStorageObject(...obj);
				if(!newObj) {
					logger(["Unable to reconstruct WordEvolve object", e], newObj);
				} else {
					try {
						VALIDATE_weStoredInfo(newObj);
						CustomStorageWE.setItem(key, newObj);
					} catch (e) {
						logger(["Constructed WordEvolve object was invalid", e], newObj);
					}
					return;
				}
			}
			// If we get to this point, there's been an error
			logger(
				["Error trying to convert WordEvolve storage to new format", e],
				key,
				obj
			);
		}
	});
};

const cleanMorphoSyntaxStorage = (input: StorageInfo, logger: EasyLogger) => {
	input.forEach(pair => {
		const [key, obj] = pair;
		try {
			VALIDATE_ms(obj);
		} catch(e) {
			const newObj = {...blankAppState.ms};
			Object.entries(obj).forEach(([key, value]) => {
				switch(key) {
					case "id":
					case "key":
						newObj.id = ensureString(value, uuidv4());
						break;
					case "lastSave":
						newObj.lastSave = ensureNumber(value, 0);
						break;
					case "title":
					case "description":
					case "TEXT_tradTypol":
					case "TEXT_morphProcess":
					case "TEXT_headDepMark":
					case "TEXT_propNames":
					case "TEXT_possessable":
					case "TEXT_countMass":
					case "TEXT_pronounAnaphClitic":
					case "TEXT_semanticRole":
					case "TEXT_verbClass":
					case "TEXT_verbStructure":
					case "TEXT_propClass":
					case "TEXT_quantifier":
					case "TEXT_numeral":
					case "TEXT_adverb":
					case "TEXT_mainClause":
					case "TEXT_verbPhrase":
					case "TEXT_nounPhrase":
					case "TEXT_adPhrase":
					case "TEXT_compare":
					case "TEXT_questions":
					case "TEXT_COType":
					case "TEXT_compounding":
					case "TEXT_denoms":
					case "TEXT_nNumberOpt":
					case "TEXT_nNumberObl":
					case "TEXT_nCase":
					case "TEXT_articles":
					case "TEXT_demonstratives":
					case "TEXT_possessors":
					case "TEXT_classGender":
					case "TEXT_dimAug":
					case "TEXT_predNom":
					case "TEXT_predLoc":
					case "TEXT_predEx":
					case "TEXT_predPoss":
					case "TEXT_ergative":
					case "TEXT_causation":
					case "TEXT_applicatives":
					case "TEXT_dativeShifts":
					case "TEXT_datOfInt":
					case "TEXT_possessRaising":
					case "TEXT_refls":
					case "TEXT_recips":
					case "TEXT_passives":
					case "TEXT_inverses":
					case "TEXT_middleCon":
					case "TEXT_antiP":
					case "TEXT_objDemOmInc":
					case "TEXT_verbNoms":
					case "TEXT_verbComp":
					case "TEXT_tense":
					case "TEXT_aspect":
					case "TEXT_mode":
					case "TEXT_locDirect":
					case "TEXT_evidence":
					case "TEXT_miscVerbFunc":
					case "TEXT_pragFocusEtc":
					case "TEXT_negation":
					case "TEXT_declaratives":
					case "TEXT_YNQs":
					case "TEXT_QWQs":
					case "TEXT_imperatives":
					case "TEXT_serialVerbs":
					case "TEXT_complClauses":
					case "TEXT_advClauses":
					case "TEXT_clauseChainEtc":
					case "TEXT_relClauses":
					case "TEXT_coords":
						newObj[key] = ensureString(value, newObj[key]!);
						break;
					case "BOOL_prefixMost":
					case "BOOL_prefixLess":
					case "BOOL_suffixMost":
					case "BOOL_suffixLess":
					case "BOOL_circumfixMost":
					case "BOOL_circumfixLess":
					case "BOOL_infixMost":
					case "BOOL_infixLess":
					case "BOOL_actions":
					case "BOOL_actionProcesses":
					case "BOOL_weather":
					case "BOOL_states":
					case "BOOL_involuntaryProcesses":
					case "BOOL_bodyFunctions":
					case "BOOL_motion":
					case "BOOL_position":
					case "BOOL_factive":
					case "BOOL_cognition":
					case "BOOL_sensation":
					case "BOOL_emotion":
					case "BOOL_utterance":
					case "BOOL_manipulation":
					case "BOOL_otherVerbClass":
					case "BOOL_lexVerb":
					case "BOOL_lexNoun":
					case "BOOL_lexVN":
					case "BOOL_lexVorN":
					case "BOOL_adjectives":
					case "BOOL_baseFive":
					case "BOOL_baseTen":
					case "BOOL_baseTwenty":
					case "BOOL_baseOther":
					case "BOOL_numGL":
					case "BOOL_numLG":
					case "BOOL_numNone":
					case "BOOL_multiNumSets":
					case "BOOL_inflectNum":
					case "BOOL_APV":
					case "BOOL_AVP":
					case "BOOL_PAV":
					case "BOOL_PVA":
					case "BOOL_VAP":
					case "BOOL_VPA":
					case "BOOL_preP":
					case "BOOL_postP":
					case "BOOL_circumP":
					case "BOOL_numSing":
					case "BOOL_numDual":
					case "BOOL_numTrial":
					case "BOOL_numPaucal":
					case "BOOL_numPlural":
					case "BOOL_classGen":
					case "BOOL_classAnim":
					case "BOOL_classShape":
					case "BOOL_classFunction":
					case "BOOL_classOther":
					case "BOOL_dimAugYes":
					case "BOOL_dimAugObligatory":
					case "BOOL_dimAugProductive":
					case "BOOL_nomAcc":
					case "BOOL_ergAbs":
					case "BOOL_markInv":
					case "BOOL_markDirInv":
					case "BOOL_verbAgreeInv":
					case "BOOL_wordOrderChange":
					case "BOOL_tenseMorph":
					case "BOOL_aspectMorph":
					case "BOOL_modeMorph":
					case "BOOL_otherMorph":
					case "BOOL_chainFirst":
					case "BOOL_chainLast":
					case "BOOL_chainN":
					case "BOOL_chainV":
					case "BOOL_chainCj":
					case "BOOL_chainT":
					case "BOOL_chainA":
					case "BOOL_chainPer":
					case "BOOL_chainNum":
					case "BOOL_chainOther":
					case "BOOL_relPre":
					case "BOOL_relPost":
					case "BOOL_relInternal":
					case "BOOL_relHeadless":
					case "BOOL_coordMid":
					case "BOOL_coordTwo":
					case "BOOL_coordLast":
						newObj[key] = ensureBoolean(value, newObj[key]!);
						break;
					case "NUM_synthesis":
					case "NUM_fusion":
					case "NUM_stemMod":
					case "NUM_suppletion":
					case "NUM_redupe":
					case "NUM_supraMod":
					case "NUM_headDepMarked":
						newObj[key] = ensureNumber(value, newObj[key]!);
						break;
					case "boolStrings":
						if(Array.isArray(value)) {
							const props = cleanerObject.msBool;
							const prop = ("BOOL_" + value);
							if(props.includes(prop as MSBool)) {
								newObj[prop as MSBool] = true;
							} else {
								// Handle changed properties
								switch(prop) {
									case "BOOL_ergAcc":
										newObj.BOOL_ergAbs = true;
										break;
									case "BOOL_chianLast":
										newObj.BOOL_chainLast = true;
										break;
								}
								// Ignore all other failed properties
							}
						}
						break;
					case "num":
						if(value && isObject(value)) {
							const props = cleanerObject.msNum;
							Object.entries(value as object).forEach(([innerKey, innerValue]) => {
								const prop = ("NUM_" + innerKey) as MSNum;
								if(props.includes(prop)) {
									newObj[prop] = ensureNumber(innerValue, newObj[prop]!);
								}
								// Ignore all failed properties
							});
						}
						break;
					case "text":
						if(value && isObject(value)) {
							const props = cleanerObject.msText;
							Object.entries(value as object).forEach(([innerKey, innerValue]) => {
								const prop = ("TEXT_" + innerKey) as MSText;
								if(props.includes(prop)) {
									newObj[prop] = ensureString(innerValue, newObj[prop]!);
								} else if(innerKey === "case") {
									newObj.TEXT_nCase = ensureString(innerValue, newObj.TEXT_nCase!);
								}
								// Ignore all other failed properties
							});
						}
						break;
				}
			});
			try {
				VALIDATE_ms(newObj);
				MorphoSyntaxStorage.setItem(key, newObj);
			} catch (e) {
				logger(["Constructed MS object was invalid", e], newObj);
			}
		}
	});
};

const cleanDeclenjugatorStorage = (input: StorageInfo, logger: EasyLogger) => {
	input.forEach(pair => {
		const [key, obj] = pair;
		try {
			VALIDATE_djStoredInfo(obj);
		} catch(e) {
			// Invalid DJ - should not exist yet
			logger(
				["Error in Declenjugator storage", e],
				key,
				obj
			);
		}
	});
};
