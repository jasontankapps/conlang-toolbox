import { compare } from "compare-versions";
import {
	Base_WG,
	DJState,
	ImportExportObject,
	LexiconState,
	MSBool,
	MSState,
	MSText,
	WEPresetObject,
	WEState,
	WGState
} from "./types";
import { cleanerObject, currentVersion } from "./blankAppState";
import { createCleanWordEvolveStorageObject, createCleanWordGenStorageObject } from "./cleaning";

const notObject = (input: unknown) => {
	return !input || typeof(input) !== "object" || Array.isArray(input);
};
const notString = (input: unknown) => typeof (input) !== "string";
const notNumber = (input: unknown) => typeof (input) !== "number" || isNaN(input) || Math.round(input) !== input;
const notBoolean = (input: unknown) => typeof (input) !== "boolean";
const notArray = (input: unknown) => !Array.isArray(input);
const notArrayOf = <T extends unknown>(
	input: unknown,
	func: ((x: T, flag?: boolean) => boolean)
) => notArray(input) || (input as T[]).some((item: T) => func(item));

const invalidCharGroupObject = (object: unknown, flag = false) => {
	if(notObject(object)) {
		return true;
	}
	let requiredProperties = 0;
	const test = Object.entries(object as object).some(([key, value]) => {
		switch(key) {
			case "title":
			case "label":
			case "run":
				requiredProperties++;
				return notString(value);
			case "dropoffOverride":
				return flag || notNumber(value) || (value as number) < 0 || (value as number) > 50;
		}
		return true;
	});
	return test || requiredProperties !== 3;
};
const invalidDropoffObject = (object: unknown) => {
	if(notObject(object)) {
		return true;
	}
	const pairs = Object.entries(object as object);
	return (pairs.length !== 4 || pairs.some(([key, value]) => {
		if(value !== null && notNumber(value) && ((value as number) < 0 || (value as number) > 50)) {
			return true;
		}
		switch(key) {
			case "singleWord":
			case "wordInitial":
			case "wordMiddle":
			case "wordFinal":
				return false;
		}
		return true;
	}))
};
const invalidTransformObject = (object: unknown, flag = false) => {
	if(notObject(object)) {
		return true;
	}
	let requiredProperties = 0;
	const test = Object.entries(object as object).some(([key, value]) => {
		switch(key) {
			case "id":
			case "seek":
			case "replace":
			case "description":
				requiredProperties++;
				return notString(value);
			case "direction":
				requiredProperties++;
				return (
					notString(value)
					|| (
						value !== "both"
						&& value !== "in"
						&& value !== "out"
						&& value !== "double"
					)
				);
		}
		return true;
	});
	return test || requiredProperties !== (flag ? 5 : 4);
};

const invalidWGState = (object: unknown, storedInfoFlag: boolean = false) => {
	let error = "";
	if(notObject(object)) {
		error = "301: Invalid WordGen State object";
	} else {
		const pairs = Object.entries(object as object);
		const base = storedInfoFlag ? 20 : 27;
		if(pairs.length < base) {
			error = "302: WordGen State object seems to be missing"
				+ ` ${base - pairs.length} propert${pairs.length === (base - 1) ? "y" : "ies"}`;
		} else if (pairs.length > base) {
			error = "303: WordGen State object seems to have"
				+ ` ${pairs.length - base} extra propert${pairs.length === (base + 1) ? "y" : "ies"}`;
		} else {
			while(!error && pairs.length > 0) {
				const [key, value] = pairs.shift()!
				let flag = false;
				switch (key) {
					case "monosyllablesRate":
						flag = (notNumber(value) || (value as number) < 0 || (value as number) > 100);
						break;
					case "maxSyllablesPerWord":
						flag = (notNumber(value) || (value as number) < 2 || (value as number) > 15);
						break;
					case "sentencesPerText":
						flag = (storedInfoFlag || notNumber(value) || (value as number) < 5 || (value as number) > 100);
						break;
					case "wordsPerWordlist":
						flag = (storedInfoFlag || notNumber(value) || (value as number) < 50 || (value as number) > 1000);
						break;
					case "characterGroupDropoff":
					case "syllableBoxDropoff":
						flag = (notNumber(value) || (value as number) < 0 || (value as number) > 50);
						break;
					case "declarativeSentencePre":
					case "declarativeSentencePost":
					case "interrogativeSentencePre":
					case "interrogativeSentencePost":
					case "exclamatorySentencePre":
					case "exclamatorySentencePost":
					case "singleWord":
					case "wordInitial":
					case "wordMiddle":
					case "wordFinal":
						if(notString(value)) {
							flag = true;
						}
						break;
					case "customSort":
						if(notString(value) && value !== null) {
							flag = true;
						}
						break;
					case "output":
						if(
							storedInfoFlag
							|| notString(value)
							|| (
								value !== "text"
								&& value !== "wordlist"
								&& value !== "syllables"
							)
						) {
							flag = true;
						}
						break;
					case "capitalizeSentences":
					case "multipleSyllableTypes":
						flag = notBoolean(value);
						break;
					case "showSyllableBreaks":
					case "capitalizeWords":
					case "sortWordlist":
					case "wordlistMultiColumn":
						flag = storedInfoFlag || notBoolean(value);
						break;
					case "characterGroups":
						flag = notArrayOf(value, invalidCharGroupObject);
						break;
					case "syllableDropoffOverrides":
						flag = invalidDropoffObject(value);
						break;
					case "transforms":
						flag = notArrayOf(value, invalidTransformObject);
						break;
					default:
						flag = true;
				}
				if(flag) {
					error = `304: WordGen State has invalid property "${key}"`;
				}
			}
		}
	}
	return error || false;
};

const invalidSoundChangeObject = (object: unknown) => {
	if(notObject(object)) {
		return true;
	}
	let requiredProperties = 0;
	const test = Object.entries(object as object).some(([key, value]) => {
		switch(key) {
			case "id":
			case "seek":
			case "replace":
			case "description":
			case "context":
			case "anticontext":
				requiredProperties++;
				return notString(value);
		}
		return true;
	});
	return test || requiredProperties !== 6;
};
const invalidWEState = (object: unknown, storedInfoFlag: boolean = false) => {
	let error = "";
	if(notObject(object)) {
		error = "401: Invalid WordEvolve State object";
	} else {
		const pairs = Object.entries(object as object);
		const max = storedInfoFlag ? 3 : 8;
		if(pairs.length < max) {
			error = "402: WordEvolve State object seems to be missing"
				+ ` ${max - pairs.length} propert${(max - pairs.length) === 1 ? "y" : "ies"}`;
		} else if (pairs.length > max) {
			error = "403: WordEvolve State object seems to have"
				+ ` ${pairs.length - max} extra propert${(pairs.length - max) === 1 ? "y" : "ies"}`;
		} else {
			while(!error && pairs.length > 0) {
				const [key, value] = pairs.shift()!
				let flag = false;
				switch (key) {
					case "input":
						flag = storedInfoFlag || notString(value);
						break;
					case "customSort":
						flag = storedInfoFlag || (notString(value) && value !== null);
						break;
					case "outputStyle":
						flag = (
							storedInfoFlag
							|| notString(value)
							|| (
								value !== "outputOnly"
								&& value !== "rulesApplied"
								&& value !== "inputFirst"
								&& value !== "outputFirst"
							)
						);
						break;
					case "inputLower":
					case "inputAlpha":
						flag = storedInfoFlag || notBoolean(value);
						break;
					case "characterGroups":
						flag = notArray(value) || (value as any[]).some(obj => invalidCharGroupObject(obj, true))
						break;
					case "transforms":
						flag = notArray(value) || (value as any[]).some(obj => invalidTransformObject(obj, true));
						break;
					case "soundChanges":
						flag = notArrayOf(value, invalidSoundChangeObject);
						break;
					default:
						flag = true;
				}
				if(flag) {
					error = `404: WordEvolve State has invalid property "${key}"`;
				}
			}
		}
	}
	return error || false;
};

const invalidMSState = (object: unknown, storedInfoFlag: boolean = false) => {
	let error = "";
	if(notObject(object)) {
		error = "501: Invalid MorphoSyntax State object";
	} else {
		let requiredProperties = 0;
		const pairs = Object.entries(object as object);
		while(!error && pairs.length > 0) {
			const [key, value] = pairs.shift()!;
			let flag = false;
			switch (key) {
				case "lastSave":
					requiredProperties++;
					flag = notNumber(value);
					break;
				case "id":
				case "key":
				case "title":
				case "description":
				case "lastView":
					requiredProperties++;
					flag = notString(value);
					break;
				case "NUM_synthesis":
				case "NUM_fusion":
					flag = notNumber(value) || (value as number) < 0 || (value as number) > 10;
					break;
				case "NUM_stemMod":
				case "NUM_suppletion":
				case "NUM_redupe":
				case "NUM_supraMod":
				case "NUM_headDepMarked":
					flag = notNumber(value) || (value as number) < 0 || (value as number) > 4;
					break;
				// OLD MS STYLE
				case "bool":
					// just ignore
					break;
				case "boolStrings":
					flag = notArrayOf(value, (input: unknown) => {
						return input !== "ergAcc"
							&& input !== "chianLast"
							&& !cleanerObject.msBool.includes("BOOL_" + input as MSBool);
					});
					break;
				case "num":
					flag = notObject(value) || Object.entries(value as object).some(([k, v]) => {
						switch(k) {
							case "synthesis":
							case "fusion":
								return notNumber(v) || (v as number) < 0 || (v as number) > 10;
							case "stemMod":
							case "suppletion":
							case "redupe":
							case "supraMod":
							case "headDepMarked":
								return notNumber(v) || (v as number) < 0 || (v as number) > 4;
						}
						return true;
					});
					break;
				case "text":
					flag = notObject(value) || Object.entries(value as object).some(([k, v]) => {
						if(k === "case" || cleanerObject.msText.includes("TEXT_" + k as MSText)) {
							return notString(v);
						}
						return true;
					});
					break;
				default:
					// HANDLE 'BOOL_' AND 'TEXT_' PROPS
					if(cleanerObject.msBool.includes(key as MSBool)) {
						flag = notBoolean(value);
					} else if (cleanerObject.msText.includes(key as MSText)) {
						flag = notString(value);
					} else {
						flag = true;
					}
			}
			if(flag) {
				error = `504: MorphoSyntax State has invalid property "${key}"`;
			}
		}
		if(!error && requiredProperties < 4) {
			error = "502: MorphoSyntax State object is missing"
				+ ` ${4 - requiredProperties} propert${requiredProperties === 3 ? "y" : "ies"}`;
		}
	}
	return error || false;
};

const invalidDeclenjugation = (object: unknown) => {
	if(notObject(object)) {
		return true;
	}
	let requiredProperties = 0;
	const test = Object.entries(object as object).some(([key, value]) => {
		switch(key) {
			case "id":
			case "title":
				requiredProperties++;
			// eslint-disable-next-line no-fallthrough
			case "prefix":
			case "suffix":
				return notString(value);
			case "useWholeWord":
				requiredProperties++;
				return notBoolean(value);
			case "regex":
				return notArrayOf(value, notString) || (value as any[]).length !== 2;
		}
		return true;
	});
	return test || requiredProperties !== 3;
};
const invalidDJGroup = (object: unknown) => {
	if(notObject(object)) {
		return true;
	}
	let requiredProperties = 0;
	const test = Object.entries(object as object).some(([key, value]) => {
		switch(key) {
			case "title":
			case "appliesTo":
			case "id":
				requiredProperties++;
				return notString(value);
			case "separator":
				requiredProperties++;
				return notString(value) || !(
					value === ","
					|| value === ";"
					|| value === " "
					|| value === "/"
				);
			case "startsWith":
			case "endsWith":
				requiredProperties++;
				return notArrayOf(value, notString);
			case "declenjugations":
				requiredProperties++;
				return notArrayOf(value, invalidDeclenjugation);
			case "regex":
				return notArrayOf(value, notString) || (value as any[]).length !== 2;
		}
		return true;
	});
	return test || requiredProperties !== 7;
};
const invalidDJState = (object: unknown, storedInfoFlag: boolean = false) => {
	let error = "";
	if(notObject(object)) {
		error = "601: Invalid Declenjugator State object";
	} else {
		const pairs = Object.entries(object as object);
		const target = storedInfoFlag ? 3 : 4;
		if(pairs.length < target) {
			error = "602: Declenjugator State object seems to be missing"
				+ ` ${target - pairs.length} propert${(pairs.length) === (target - 1) ? "y" : "ies"}`;
		} else if (pairs.length > 4) {
			error = "603: Declenjugator State object seems to have"
				+ ` ${pairs.length - target} extra propert${pairs.length === (target + 1) ? "y" : "ies"}`;
		} else {
			while(!error && pairs.length > 0) {
				const [key, value] = pairs.shift()!
				let flag = false;
				switch (key) {
					case "input":
						flag = storedInfoFlag || notString(value);
						break;
					case "declensions":
					case "conjugations":
					case "other":
						flag = notArrayOf(value, invalidDJGroup);
						break;
					default:
						flag = true;
				}
				if(flag) {
					error = `604: Declenjugator State has invalid property "${key}"`;
				}
			}
		}
	}
	return error || false;
};

const invalidSettings = (object: any) => {
	let error = "";
	if(notObject(object)) {
		error = "201: Invalid Settings object";
	} else {
		const copyObject = {...object};
		// This property may or may not exist. It should be ignored.
		delete copyObject.currentSort;
		const pairs = Object.entries(copyObject);
		if(pairs.length < 2) {
			error = "202: Settings object seems to be missing"
				+ ` ${2 - pairs.length} propert${pairs.length === 1 ? "y" : "ies"}`;
		} else if (pairs.length > 2) {
			error = "203: Settings object seems to have"
				+ ` ${pairs.length - 2} extra propert${pairs.length === 3 ? "y" : "ies"}`;
		} else {
			while(!error && pairs.length > 0) {
				const [key, value] = pairs.shift()!
				let flag = false;
				switch (key) {
					case "theme":
						flag = notString(value) || !(
							value === "Default"
							|| value === "Dark"
							|| value === "Light"
							|| value === "Solarized Dark"
							|| value === "Solarized Light"
						);
						break;
					case "disableConfirms":
						flag = notBoolean(value);
						break;
					default:
						flag = true;
				}
				if(flag) {
					error = `204: Settings has invalid property "${key}"`;
				}
			}
		}
	}
	return error || false;
};

const invalidLexColumn = (object: object) => {
	const pairs = Object.entries(object);
	if(pairs.length !== 3) {
		return true;
	}
	return pairs.some(([key, value]) => {
		switch(key) {
			case "id":
			case "label":
				return notString(value);
			case "size":
				return value !== "s" && value !== "m" && value !== "l";
		}
		return true;
	});
};
const checkLexObjectInvalidity = (object: unknown, cols: number | null) => {
	let columns = cols;
	if(notObject(object)) {
		return true;
	}
	const pairs = Object.entries(object as object);
	if(pairs.length !== 2) {
		return true;
	} else if (pairs.some(([key, value]) => {
		if(key === "id") {
			return notString(value);
		} else if (key !== "columns" || notArray(value)) {
			return true;
		}
		if(columns === null) {
			columns = (value as any[]).length;
		} else if ((value as any[]).length !== columns) {
			return true;
		}
		return (value as any[]).some(str => notString(str));
	})) {
		return true;
	}
	if(cols !== columns) {
		return columns;
	}
	return false;
};
const invalidLexiconState = (object: unknown, v: string, storedInfoFlag: boolean = false) => {
	let error = "";
	const beforeVersionTen = compare(v, "0.10.0", "<");
	if(notObject(object)) {
		error = "701: Invalid Lexicon State object";
	} else {
		let requiredProperties = 0;
		let foundColumns: number | null = null;
		const pairs = Object.entries(object as object);
		while(!error && pairs.length > 0) {
			const [key, value] = pairs.shift()!
			let flag = false;
			switch (key) {
				case "id":
				case "title":
				case "description":
					requiredProperties++;
				// eslint-disable-next-line no-fallthrough
				case "fontType":
					flag = notString(value);
					break;
				case "blankSort":
					if(compare(v, "0.9.5", "<")) {
						flag = true;
					} else {
						requiredProperties++;
						flag = (
							value !== "alphaFirst"
							&& value !== "alphaLast"
							&& value !== "first"
							&& value !== "last"
						);
					}
					break;
				case "lexicon":
					requiredProperties++;
					if(notArray(value)) {
						flag = true;
						break;
					}
					const array = (value as any[]);
					if(array.length === 0) {
						break;
					} else if(!foundColumns) {
						const first = array.shift()!;
						const result = checkLexObjectInvalidity(first, foundColumns);
						if(result === true) {
							flag = true;
							break;
						} else if (result !== false) {
							foundColumns = result;
						}
					}
					const cols = foundColumns as number;
					flag = array.some(obj => checkLexObjectInvalidity(obj, cols));
					break;
				case "truncateColumns":
				case "sortDir":
					requiredProperties++;
					flag = notBoolean(value);
					break;
				case "lastSave":
					requiredProperties++;
					flag = notNumber(value);
					break;
				case "sortPattern":
					requiredProperties++;
					if(notArrayOf(value, notNumber)) {
						flag = true;
					} else if (foundColumns === null) {
						foundColumns = (value as number[]).length;
					} else if (foundColumns !== (value as number[]).length) {
						error = `707: Lexicon expected ${foundColumns} columns but encountered ${(value as number[]).length} in "${key}"`;
						continue;
					}
					break;
				case "columns":
					requiredProperties++;
					if(notArrayOf(value, invalidLexColumn)) {
						flag = true;
					} else if (foundColumns === null) {
						foundColumns = (value as any[]).length;
					} else if (foundColumns !== (value as any[]).length) {
						error = `707: Lexicon expected ${foundColumns} columns but encountered ${(value as any[]).length} in "${key}"`;
						continue;
					}
					break;
				case "customSort":
					requiredProperties++;
					flag = beforeVersionTen || (value !== undefined && notString(value));
					break;
				default:
					flag = !storedInfoFlag;
			}
			if(flag) {
				error = `704: Lexicon State has invalid property "${key}"`;
			}
		}
		beforeVersionTen && requiredProperties++;
		if(!error && !storedInfoFlag && requiredProperties < 10) {
			error = "702: Lexicon State object is missing"
				+ ` ${10 - requiredProperties} propert${(requiredProperties - 10) === 1 ? "y" : "ies"}`;
		}
	}
	return error || false;
};

const invalidWordListsState = (object: unknown) => {
	let error = "";
	if(notObject(object)) {
		error = "801: Invalid Concepts State object";
	} else {
		const pairs = Object.entries(object as object);
		if(pairs.length < 2) {
			error = "802: Concepts State object seems to be missing"
				+ ` ${2 - pairs.length} propert${pairs.length === 1 ? "y" : "ies"}`;
		} else if (pairs.length > 2) {
			error = "803: Concepts State object seems to have"
				+ ` ${pairs.length - 2} extra propert${(pairs.length === 3) ? "y" : "ies"}`;
		} else if (pairs.some(([key, value]) => {
			switch(key) {
				case "centerTheDisplayedWords":
					return notArray(value)
						|| ((value as any[]).length === 1 && (value as any[])[0] !== "center")
						|| (value as any[]).length > 0;
				case "listsDisplayed":
					if(notObject(value)) {
						return true;
					}
					return value && Object.keys(value as object).some(key => {
						return ![
							"asjp",
							"lj",
							"sy",
							"d",
							"s100",
							"s207",
							"ssl"
						].includes(key)
					});
			}
			return true;
		})) {
			error = `804: Concepts State has at least one invalid property`;
		}
	}
	return error || false;
};

const invalidConceptCombo = (object: unknown) => {
	let error = "";
	if(notObject(object)) {
		return true;
	}
	let requiredProperties = 0;
	const pairs = Object.entries(object as object);
	while(!error && pairs.length > 0) {
		const [key, value] = pairs.shift()!
		let flag = true;
		switch (key) {
			case "id":
			case "word":
				requiredProperties++;
				flag = notString(value);
				break;
			case "asjp":
			case "lj":
			case "d":
			case "sy":
			case "s100":
			case "s201":
			case "ssl":
			case "l200":
				flag = notBoolean(value);
				break;
		}
		if(flag) {
			return true;
		}
	}
	if(requiredProperties < 2) {
		return true;
	}
	return false;
};
const invalidConceptCombinations = (object: unknown) => {
	if(notObject(object)) {
		return true;
	}
	return Object.entries(object as object).some(([key, value]) => {
		switch(key) {
			case "id":
				return notString(value);
			case "parts":
				return notArrayOf(value, invalidConceptCombo);
		}
		return true;
	});
};
const invalidConceptsState = (object: unknown, v: string) => {
	let error = "";
	if(notObject(object)) {
		error = "801: Invalid Concepts State object";
	} else {
		const pairs = Object.entries(object as object);
		if(pairs.length < 4) {
			error = "802: Concepts State object seems to be missing"
				+ ` ${4 - pairs.length} propert${pairs.length === 3 ? "y" : "ies"}`;
		} else if(pairs.length > 4) {
			error = "803: Concepts State object seems to have"
				+ ` ${pairs.length - 4} extra propert${pairs.length === 5 ? "y" : "ies"}`;
		}
		while(!error && pairs.length > 0) {
			const [key, value] = pairs.shift()!
			let flag = false;
			let note: string = "";
			switch (key) {
				case "display":
					if(compare(v, "0.12.0", "<")) {
						flag = notArrayOf(value, (str: unknown) => {
							const result = !([
								"asjp",
								"lj",
								"d",
								"sy",
								"s100",
								"s207",
								"ssl",
								"l200",
							] as unknown[]).includes(str);
							result && (note = ` (${str})`);
							return result;
						});
					} else {
						flag = notObject(value)
							|| Object.keys(value).some(prop => !([
								"asjp",
								"lj",
								"d",
								"sy",
								"s100",
								"s207",
								"ssl",
								"l200",
							] as unknown[]).includes(prop));
					}
					break;
				case "combinations":
					flag = notArrayOf(value, invalidConceptCombinations);
					break;
				case "showingCombos":
				case "textCenter":
					flag = notBoolean(value);
					break;
				default:
					flag = true;
			}
			if(flag) {
				error = `804: Concepts State has invalid property "${key}"${note}`;
			}
		}
	}
	return error || false;
};

const invalidECState = (object: unknown) => {
	let error = "";
	if(notObject(object)) {
		error = "210: Invalid Extra Characters State object";
	} else {
		const pairs = Object.entries(object as object);
		if(pairs.length < 5) {
			error = "212: Extra Characters State object seems to be missing"
				+ ` ${5 - pairs.length} propert${pairs.length === 4 ? "y" : "ies"}`;
		} else if(pairs.length > 5) {
			error = "213: Extra Characters State object seems to have"
				+ ` ${pairs.length - 5} extra propert${pairs.length === 6 ? "y" : "ies"}`;
		}
		while(!error && pairs.length > 0) {
			const [key, value] = pairs.shift()!
			let flag = false;
			switch (key) {
				case "toCopy":
					flag = notString(value);
					break;
				case "copyImmediately":
				case "showNames":
					flag = notBoolean(value);
					break;
				case "faves":
					break;
				case "nowShowing":
					break;
				default:
					flag = true;
			}
			if(flag) {
				error = `214: Extra Characters State has invalid property "${key}"`;
			}
		}
	}
	return error || false;
};

const invalidSortSubObject = (object: object) => {
	let both = 0;
	let rel = 0;
	let eq = 0;
	const test = Object.entries(object).some(([key, value]) => {
		switch (key) {
			case "id":
			case "base":
				both++;
				return notString(value);
			case "separator":
				both++;
				return value !== ""
					&& value !== ","
					&& value !== ";"
					&& value !== " "
					&& value !== ".";
			case "pre":
			case "post":
				rel++;
				eq--;
			// eslint-disable-next-line no-fallthrough
			case "equals":
				eq++;
				return notArrayOf(value, notString);
		}
		return true;
	});
	return test || both !== 3 || !((rel === 2 && eq === 0) || (eq === 1 && rel === 0));
};
const invalidSortObject = (object: unknown) => {
	if(notObject(object)) {
		return true;
	}
	const pairs = Object.entries(object as object);
	let requiredProperties = 0;
	const test = pairs.some(([key, value]) => {
		switch(key) {
			case "id":
			case "title":
				requiredProperties++;
			// eslint-disable-next-line no-fallthrough
			case "sortLanguage":
				return notString(value);
			case "separator":
				return value !== ""
					&& value !== ","
					&& value !== ";"
					&& value !== " "
					&& value !== ".";
			case "sensitivity":
				return value !== "base"
					&& value !== "accent"
					&& value !== "case"
					&& value !== "variant";
			case "customAlphabet":
			case "multiples":
				return notArrayOf(value, notString);
			case "customizations":
				return notArrayOf(value, invalidSortSubObject);
		}
		return true;
	});
	return test || requiredProperties !== 2;
};
const invalidSortingState = (object: unknown) => {
	let error = "";
	if(notObject(object)) {
		error = "220: Invalid Sort Settings object";
	} else {
		let requiredProperties = 0;
		const pairs = Object.entries(object as object);
		while(!error && pairs.length > 0) {
			const [key, value] = pairs.shift()!
			let flag = false;
			switch (key) {
				case "defaultCustomSort":
				case "sortLanguage":
					flag = notString(value);
					break;
				case "sensitivity":
					requiredProperties++;
					flag = value !== "base"
						&& value !== "accent"
						&& value !== "case"
						&& value !== "variant";
					break;
				case "customSorts":
					requiredProperties++;
					flag = notArrayOf(value, invalidSortObject);
					break;
				default:
					flag = true;
			}
			if(flag) {
				error = `224: Sort Settings has invalid property "${key}"`;
			}
		}
		if(!error && requiredProperties < 2) {
			error = "222: Sort Settings object is missing"
				+ ` ${2 - requiredProperties} propert${requiredProperties === 1 ? "y" : "ies"}`;
		}
	}
	return error || false;
};

const invalidWGStorage = (object: unknown) => {
	if(notArray(object)) {
		return "910.1: invalid WordGen storage property"
	}
	const pairs = [...object as [unknown, unknown][]];
	let error: string | false = false;
	while(!error && pairs.length > 0) {
		const [label, obj] = pairs.shift()!;
		if(notString(label)) {
			error = "911.1: invalid WordGen storage object label"
		} else if (notArray(obj) && !notObject(obj)) {
			const result = invalidWGState(obj, true);
			error = result && result.replace(
				/^3([0-9][0-9]):(.+?)WordGen State/,
				`9$1.1$2item "${label}" in WordGen storage`
			);
		} else if (notArray(obj) || (obj as any[]).length !== 4) {
			error = `912.1: invalid WordGen storage object "${label}"`;
		} else {
			const newObj = createCleanWordGenStorageObject(...obj as any[]);
			const result = invalidWGState(newObj, true);
			error = result && result.replace(
				/^3([0-9][0-9]):(.+?)WordGen State/,
				`9$1.1$2item "${label}" in WordGen storage`
			);
		}
	}
	return error || false;
};

const invalidWEStorage = (object: unknown) => {
	if(notArray(object)) {
		return "910.2: invalid WordEvolve storage property"
	}
	const pairs = [...object as [unknown, unknown][]];
	let error: string | false = false;
	while(!error && pairs.length > 0) {
		const [label, obj] = pairs.shift()!;
		if(notString(label)) {
			error = "911.2: invalid WordEvolve storage object label"
		} else if (notArray(obj) && !notObject(obj)) {
			const result = invalidWEState(obj, true);
			error = result && result.replace(
				/^4([0-9][0-9]):(.+?)WordEvolve State/,
				`9$1.1$2item "${label}" in WordEvolve storage`
			);
		} else if (notArray(obj) || (obj as any[]).length !== 3) {
			error = `912.2: invalid WordGen storage object "${label}"`
		} else {
			const newObj = createCleanWordEvolveStorageObject(...obj as any[]);
			const result = invalidWEState(newObj, true);
			error = result && result.replace(
				/^4([0-9][0-9]):(.+?)WordEvolve State/,
				`9$1.2$2item "${label}" in WordEvolve storage`
			);
		}
	}
	return error || false;
};

const invalidMSStorage = (object: unknown) => {
	if(notArray(object)) {
		return "910.3: invalid MorphoSyntax storage property"
	}
	const pairs = [...object as [unknown, unknown][]];
	let error: string | false = false;
	while(!error && pairs.length > 0) {
		const [label, obj] = pairs.shift()!;
		if(notString(label)) {
			error = "911.3: invalid MorphoSyntax storage object label"
		} else if (notObject(obj)) {
			error = "912.3: invalid MorphoSyntax storage object";
		} else {
			const result = invalidMSState(obj, true);
			error = result && result.replace(/^5([0-9][0-9]):(.+?)MorphoSyntax State/, "9$1.3$2item in MorphoSyntax storage");
		}
	}
	return error || false;
};

const invalidDJStorage = (object: unknown) => {
	if(notArray(object)) {
		return "910.5: invalid Declenjugator storage property"
	}
	const pairs = [...object as [unknown, unknown][]];
	let error: string | false = false;
	while(!error && pairs.length > 0) {
		const [label, obj] = pairs.shift()!;
		if(notString(label)) {
			error = "911.5: invalid Declenjugator storage object label"
		} else if (notObject(obj)) {
			error = "912.5: invalid Declenjugator storage object";
		} else {
			const result = invalidDJState(obj, true);
			error = result && result.replace(/^6([0-9][0-9]):(.+?)Declenjugator State/, "9$1.5$2item in Declenjugator storage");
		}
	}
	return error || false;
};

const invalidLexStorage = (object: unknown, v: string) => {
	if(notArray(object)) {
		return "910.4: invalid Lexicon storage property"
	}
	const pairs = [...object as [unknown, unknown][]];
	let error: string | false = false;
	while(!error && pairs.length > 0) {
		const [label, obj] = pairs.shift()!;
		if(notString(label)) {
			error = "911.4: invalid Lexicon storage object label";
		} else if (notObject(obj)) {
			error = "912.4: invalid Lexicon storage object";
		} else {
			const result = invalidLexiconState(obj, v, true);
			error = result && result.replace(/^7([0-9][0-9]):(.+?)Lexicon State/, "9$1.4$2item in Lexicon storage");
		}
	}
	return error || false;
};

const invalidOldStorageObject = (object: unknown, v: string) => {
	if(notObject(object)) {
		return "910.0: invalid Storage property"
	}
	const pairs = Object.entries(object as object);
	if(pairs.length < 4) {
		return "912.0: Storage object seems to be missing"
			+ ` ${4 - pairs.length} propert${pairs.length === 3 ? "y" : "ies"}`;
	} else if(pairs.length > 4) {
		return "913.0: Storage object seems to have"
			+ ` ${pairs.length - 4} extra propert${pairs.length === 5 ? "y" : "ies"}`;
	}
	let error: string | false = false;
	pairs.some(([key, value]) => {
		switch(key) {
			case "lex":
				error = invalidLexStorage(value, v);
				break;
			case "wg":
				error = invalidWGStorage(value);
				break;
			case "we":
				error = invalidWEStorage(value);
				break;
			case "mx":
				error = invalidMSStorage(value);
				break;
			default:
				error = `902.0: Storage has invalid property "${key}"`;
		}
		return error;
	});
	return error;
};

export const validVersionRanges = [
	["0.12.0", currentVersion],
	["0.11.0", "0.11.3"],
	["0.10.0", "0.10.1"],
	["0.9.1", "0.9.5"]
];
// Error codes:
// 100 general
// 200 appSettings, sortSettings, extraCharacters
// 300 WG
// 400 WE
// 500 MS
// 600 DJ
// 700 Lexicon
// 800 Concepts
// 900 storages
export function VALIDATE_import (
	object: ImportExportObject
): asserts object is ImportExportObject {
	let error: string | false = false;
	const { currentVersion: v } = object;
	if(notString(v)) {
		error = "110: currentVersion is missing or invalid";
	} else if (
		compare(v, currentVersion, ">")
		|| !validVersionRanges.some(([begin, end]) => compare(begin, v, "<=") && compare(end, v, ">="))
	) {
		error = `111: currentVersion "${v}" is not supported`;
	} else {
		Object.entries(object).some(([key, value]) => {
			if (key === "wg") {
				error = invalidWGState(value);
			} else if (key === "we") {
				error = invalidWEState(value);
			} else if (key === "ms") {
				error = invalidMSState(value);
			} else if (key === "dj" && compare(v, "0.11.0", ">=")) {
				error = invalidDJState(value);
			} else if (key === "appSettings") {
				error = invalidSettings(value);
			} else if (key === "lexicon") {
				error = invalidLexiconState(value, v);
			} else if (key === "concepts" && compare(v, "0.9.4", ">")) {
				error = invalidConceptsState(value, v);
			} else if (key === "wordLists" && compare(v, "0.9.5", "<")) {
				error = invalidWordListsState(value);
			} else if (key === "ec") {
				error = invalidECState(value);
			} else if (key === "sortSettings") {
				error = invalidSortingState(value);
			} else if (key === "storages" && compare(v, "0.11.0", "<")) {
				error = invalidOldStorageObject(value, v);
			} else if (key === "wgStored" && compare(v, "0.11.0", ">=")) {
				error = invalidWGStorage(value);
			} else if (key === "weStored" && compare(v, "0.11.0", ">=")) {
				error = invalidWEStorage(value);
			} else if (key === "msStored" && compare(v, "0.11.0", ">=")) {
				error = invalidMSStorage(value);
			} else if (key === "djStored" && compare(v, "0.11.0", ">=")) {
				error = invalidDJStorage(value);
			} else if (key === "lexStored" && compare(v, "0.11.0", ">=")) {
				error = invalidLexStorage(value, v);
			} else if ([
				"dj",
				"concepts",
				"wordLists",
				"storages",
				"wgStored",
				"weStored",
				"msStored",
				"djStored",
				"lexStored",
			].includes(key)) {
				error = `109: unexpected property "${key}" in version ${v}`;
			} else if (key !== "currentVersion") {
				error = `105: invalid property "${key}"`;
			}
			return error;
		});
	}
	if(error) {
		throw new TypeError(`ERROR ${error}`);
	}
};

export function VALIDATE_wg (
	object: WGState
): asserts object is WGState {
	const judgment = invalidWGState(object);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_wgStoredInfo (
	object: Base_WG
): asserts object is Base_WG {
	const judgment = invalidWGState(object, true);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_we (
	object: WEState
): asserts object is WEState {
	const judgment = invalidWEState(object);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_weStoredInfo (
	object: WEPresetObject
): asserts object is WEState {
	const judgment = invalidWEState(object, true);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_ms (
	object: MSState
): asserts object is MSState {
	const judgment = invalidMSState(object);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_dj (
	object: DJState
): asserts object is DJState {
	const judgment = invalidDJState(object);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_djStoredInfo (
	object: DJState
): asserts object is DJState {
	const judgment = invalidDJState(object, true);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};

export function VALIDATE_Lex (
	object: LexiconState
): asserts object is LexiconState {
	const judgment = invalidLexiconState(object, "0.11.0", true);
	if(judgment) {
		throw new TypeError(`ERROR ${judgment}`);
	}
};
