import React, { useCallback, useMemo, useState, FC } from 'react';
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonMenuButton,
	IonButtons,
	IonTitle,
	IonButton,
	IonIcon,
	useIonAlert,
	useIonToast,
	useIonRouter,
	AlertInput
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";
import {
	caretForwardCircleOutline,
	settingsOutline,
	saveOutline,
	helpCircleOutline,
	copyOutline
} from 'ionicons/icons';
import { TFunction } from 'i18next';

import {
	WGTransformObject,
	WGCharGroupObject,
	PageData,
	LexiconColumn,
	StateObject,
	SortObject,
	WGState,
	SetBooleanState
} from '../../store/types';
import { addItemsToLexiconColumn } from '../../store/lexiconSlice';
import useTranslator from '../../store/translationHooks';

import { $a, $i } from '../../components/DollarSignExports';
import ModalWrap from "../../components/ModalWrap";
import calculateCharGroupReferenceRegex from '../../components/CharGroupRegex';
import toaster from '../../components/toaster';
import { LexiconOutlineIcon } from '../../components/icons';
import makeSorter from '../../components/stringSorter';
import PermanentInfo from '../../components/PermanentInfo';
import log from '../../components/Logging';
import copyText from '../../components/copyText';
import useI18Memo from '../../components/useI18Memo';

import OutputOptionsModal from './modals/OutputOptions';
import { OutCard } from "./WGinfo";

interface GeneratorResponse {
	copy: string,
	list?: string[],
	string?: string,
	html?: string[][],
	error?: string
}

const commons = [ "Generate", "Cancel", "Help", "Loading", "Output", "Save" ];
const translations = [
	"missingSyllableTypesMsg",
	"noCharGroupsDefinedMsg",
	"noSyllablesDefinedMsg"
];

const WGOut: FC<PageData> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tc ] = useTranslator('common');
	const [ tGenerate, tCancel, tHelp, tLoad, tOutput, tSave ] = useI18Memo(commons);
	const [ tMissing, tNoCG, tNoSyll ] = useI18Memo(translations, 'wg');

	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenOptions, setIsOpenOptions] = useState<boolean>(false);
	const [isPickingSaving, setIsPickingSaving] = useState<boolean>(false);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);

	const [copyString, setCopyString] = useState<string>("");
	const [errorString, setErrorString] = useState<string>("");
	const [displayString, setDisplayString] = useState<string>("");
	const [displayHTML, setDisplayHTML] = useState<string[][]>([]);
	const [displayList, setDisplayList] = useState<string[]>([]);
	const [colsNum, setColsNum] = useState<string>("auto");

	const [savedWords, setSavedWords] = useState<string[]>([]);
	const [savedWordsObject, setSavedWordsObject] = useState<{ [key: string]: boolean }>({});

	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const navigator = useIonRouter();

	// Pseudo-text needs no special formatting, wrap entirely in a <div>
	// Wordlists require columnWidth equal to the largest word's width (using determineWidth) and each word in a <div>
	const wg = useSelector((state: StateObject) => state.wg);
	const {
		characterGroups,
		multipleSyllableTypes,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		transforms,
		monosyllablesRate,
		customSort,
		wordlistMultiColumn
	} = wg;
	const {
		sortLanguage,
		sensitivity,
		defaultCustomSort,
		customSorts
	} = useSelector((state: StateObject) => state.sortSettings);
	const defaultSortLanguage = useSelector((state: StateObject) => state.internals.defaultSortLanguage);
	const {
		columns: lexColumns,
		customSort: customSortLex
	} = useSelector((state: StateObject) => state.lexicon);

	// // //
	// Memoized stuff
	// // //

	const [customSortObj, defaultCustomSortObj, customSortLexObj] = useMemo(() => {
		let customSortObj: SortObject | undefined;
		let defaultCustomSortObj: SortObject | undefined;
		let customSortLexObj: SortObject | undefined;
		customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).every(obj => {
			if(obj.id === customSortLex) {
				customSortLexObj = obj;
			}
			if(obj.id === customSort) {
				customSortObj = obj;
			}
			if (obj.id === defaultCustomSort) {
				defaultCustomSortObj = obj;
			}
			return !(customSortObj && defaultCustomSortObj && customSortLexObj);
		});
		return [customSortObj, defaultCustomSortObj, customSortLexObj];
	}, [customSort, customSorts, customSortLex, defaultCustomSort]);
	const wgSorter = useMemo(() => makeSorter(
		sortLanguage || defaultSortLanguage,
		sensitivity,
		customSortObj || defaultCustomSortObj
	), [ customSortObj, defaultCustomSortObj, sensitivity, sortLanguage, defaultSortLanguage ]);
	const lexSorter = useMemo(() => makeSorter(
		sortLanguage || defaultSortLanguage,
		sensitivity,
		customSortLexObj || defaultCustomSortObj
	), [ customSortLexObj, defaultCustomSortObj, sensitivity, sortLanguage, defaultSortLanguage ]);

	const maybeSaveThisWord = useCallback((text: string, id: string = "") => {
		if(isPickingSaving) {
			if(text) {
				const newObj = {...savedWordsObject};
				if(savedWordsObject[text]) {
					setSavedWords(savedWords.filter(word => word !== text));
					delete newObj[text];
					const el = id && $i(id);
					el && el.classList.remove("saved");
				} else {
					setSavedWords([...savedWords, text]);
					newObj[text] = true;
					const el = id && $i(id);
					el && el.classList.add("saved");
				}
				setSavedWordsObject(newObj);
			}
		}
	}, [savedWords, savedWordsObject, isPickingSaving]);
	const charGroupMap = useMemo(() => {
		const obj: {[key: string]: WGCharGroupObject} = {};
		characterGroups.forEach((cg: WGCharGroupObject) => {
			obj[cg.label] = cg;
		});
		return obj;
	}, [characterGroups]);
	const regExpMap = useMemo(() => {
		// Check transforms for %CharGroup references and update them if needed
		const newObj: { [key:string]: RegExp } = {};
		transforms.forEach((transform: WGTransformObject) => {
			const { seek, id } = transform;
			let regex: RegExp;
			if(transform.seek.indexOf("%") !== -1) {
				// Found a possibility.
				regex = calculateCharGroupReferenceRegex(seek, charGroupMap) as RegExp;
			} else {
				regex = new RegExp(seek, "g");
			}
			newObj[id] = regex;
		});
		return newObj;
	}, [transforms, charGroupMap]);

	const generateOutput = useCallback(async () => {
		const textWidthTester = document.createElement("canvas").getContext("2d");
		textWidthTester!.font = "var(--ion-default-font)";
		const determineWidth = (input: string) => {
			return textWidthTester!.measureText(input).width;
		};
		const getWidestWord = (words: string[]) => {
			const max = Math.max(...words.map(w => determineWidth(w))) * 2;
			return Math.ceil(max).toString() + "px";
		};
		const errors: string[] = [];
		// Clear any previous output.
		setDisplayList([]);
		setDisplayString("");
		setCopyString("");
		setDisplayHTML([]);
		setColsNum("auto");
		setErrorString("");
		// Sanity check
		if(characterGroups.length === 0) {
			errors.push(tNoCG);
		}
		if (!multipleSyllableTypes && singleWord.length === 0) {
			errors.push(tNoSyll);
		}
		if (multipleSyllableTypes &&
			(
				(monosyllablesRate > 0 && singleWord.length === 0)
				|| wordInitial.length === 0
				|| wordMiddle.length === 0
				|| wordFinal.length === 0
			)
		) {
			errors.push(tMissing);
		}
		if(errors.length > 0) {
			setErrorString(errors.join(" "));
			return;
		}

		const results = await generator(wg, charGroupMap, regExpMap, setIsGenerating, wgSorter, t);
		const { string, copy, html, list, error } = results;
		if(error) {
			setCopyString(copy);
			setErrorString(error);
			return;
		} if(html) {
			// Pseudo-text
			setDisplayHTML(html);
			setDisplayString(string || "");
			setCopyString(copy);
			return;
		} else if (!list) {
			// SHOULD NOT HAPPEN
			return;
		}
		// Every syllable, or a wordlist
		setColsNum(getWidestWord(list));
		setDisplayList(list);
		setCopyString(copy);
	}, [
		charGroupMap, characterGroups.length, monosyllablesRate,
		multipleSyllableTypes, regExpMap, singleWord.length, t, tMissing,
		tNoCG, tNoSyll, wg, wgSorter, wordFinal.length,
		wordInitial.length, wordMiddle.length
	]);

	// // //
	// Save to Lexicon
	// // //

	const saveToLexicon = useCallback((words: string[]) => {
		doAlert({
			header: tc("SelectAColumn"),
			message: tc("SaveToLexiconMessage"),
			inputs: lexColumns.map((col: LexiconColumn, i: number) => {
				const obj: AlertInput = {
					type: 'radio',
					label: col.label,
					value: col,
					checked: !i
				};
				return obj;
			}),
			buttons: [
				{
					text: tCancel,
					role: 'cancel',
					cssClass: "cancel"
				},
				{
					text: tSave,
					handler: (col: LexiconColumn | undefined) => {
						if(!col) {
							// Treat as cancel
							return;
						}
						log(dispatch, ["WG Send to Lexicon"], col);
						// Send off to the lexicon
						dispatch(addItemsToLexiconColumn([words, col.id, lexSorter]));
						// Clear info
						setSavedWords([]);
						setSavedWordsObject({});
						setIsPickingSaving(false);
						$a(".word.saved").forEach((obj) => obj.classList.remove("saved"));
						// Toast
						toaster({
							message: tc(
								"saveToLexColumn",
								{
									count: words.length,
									column: col.label
								}
							),
							duration: 3500,
							position: "top",
							buttons: [
								{
									text: tc("GoToLexicon"),
									handler: () => navigator.push("/lex")
								}
							],
							color: "success",
							toast
						});
					}
				}
			]
		});
	}, [dispatch, doAlert, lexColumns, lexSorter, navigator, tCancel, tSave, tc, toast]);
	const donePickingAndSaving = useCallback(() => {
		setIsPickingSaving(false);
		if(savedWords.length > 0) {
			// Attempt to save
			saveToLexicon(savedWords);
		} else {
			// Just stop picking
			setIsPickingSaving(false);
		}
	}, [saveToLexicon, savedWords]);
	const pickAndSave = useCallback(() => {
		if (isPickingSaving) {
			// Stop saving
			return donePickingAndSaving();
		}
		setIsPickingSaving(true);
		return toaster({
			message: tc("TapWordsToSave"),
			duration: 2500,
			position: "top",
			toast
		});
	}, [donePickingAndSaving, isPickingSaving, tc, toast]);

	// // //
	// Display
	// // //

	const parsedWords = useMemo(() => {
		return displayHTML.map((words: string[], i: number) => {
			const id = `createdWord${i}`;
			return <React.Fragment key={i}>
				<span
					className="word"
					id={id}
					onClick={() => maybeSaveThisWord(words[0], id)}
				>{words[1]}</span>{' '}
			</React.Fragment>;
		});
	}, [displayHTML, maybeSaveThisWord]);
	const parsedWordList = useMemo(() => {
		return displayList.map((word: string, i: number) => {
			const id = `createdWord${i}`;
			return (
				<div
					className="word"
					key={i}
					id={id}
					onClick={() => maybeSaveThisWord(word, id)}
				>{word}</div>
			);
		});
	}, [displayList, maybeSaveThisWord]);
	const theOutput = useMemo(() => {
		if(displayString) {
			if(isPickingSaving) {
				return parsedWords;
			}
			return [displayString];
		} else if (errorString) {
			return <h2 color="danger" className="ion-text-center">{errorString}</h2>;
		} else if (displayList.length > 0) {
			return parsedWordList;
		}
		return <></>;
	}, [displayList, displayString, errorString, parsedWords, parsedWordList, isPickingSaving]);

	const openInfo = useCallback(() => setIsOpenInfo(true), []);
	const openOptions = useCallback(() => setIsOpenOptions(true), []);
	const doCopy = useCallback(() => copyText(copyString, toast), [copyString, toast]);
	return (
		<IonPage>
			<OutputOptionsModal {...modalPropsMaker(isOpenOptions, setIsOpenOptions)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<OutCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton disabled={isPickingSaving} />
					</IonButtons>
					<IonTitle>{tOutput}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openInfo} aria-label={tHelp} disabled={isPickingSaving}>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<div id="WGoutput">
					<div className="leftHandSide">
						<IonButton
							strong={true}
							size="small"
							color="success"
							onClick={generateOutput}
							disabled={isPickingSaving}
						>
							{
								isGenerating ? (
									<span className="ital">{tLoad}</span>
								) : tGenerate
							}<IonIcon icon={caretForwardCircleOutline} />
						</IonButton>
						<div
							id="outputPane"
							style={{columnWidth: wordlistMultiColumn ? colsNum : "auto"}}
							className={"largePane selectable" + (isPickingSaving ? " pickAndSave" : "")}
						>
							{theOutput}
						</div>
					</div>
					<div className="rightHandSide">
						<IonButton
							expand="block"
							strong={false}
							color="secondary"
							onClick={openOptions}
							disabled={isPickingSaving}
						><IonIcon slot="icon-only" icon={settingsOutline} /></IonButton>
						<IonButton
							expand="block"
							strong={false}
							color="secondary"
							onClick={doCopy}
							disabled={isPickingSaving}
						><IonIcon slot="icon-only" icon={copyOutline} /></IonButton>
						<IonButton
							expand="block"
							strong={true}
							className={isPickingSaving ? "hide" : ""}
							color="secondary"
							onClick={pickAndSave}
						><LexiconOutlineIcon slot="icon-only" /></IonButton>
						<IonButton
							className={isPickingSaving ? "" : "hide"}
							id="doneSavingButton"
							expand="block"
							strong={true}
							color="success"
							onClick={donePickingAndSaving}
							aria-label={tSave}
						><IonIcon slot="icon-only" icon={saveOutline} /></IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default WGOut;


interface CGMap {
	[key: string]: WGCharGroupObject
}
interface RXMap {
	[key: string]: RegExp
}

const generator = async (
	wg: WGState,
	charGroupMap: CGMap,
	regExpMap: RXMap,
	setIsGenerating: SetBooleanState,
	wgSorter: (a: string, b: string) => number,
	t: TFunction<string[], undefined>
): Promise<GeneratorResponse> => {
	const {
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
		output,
		showSyllableBreaks,
		sentencesPerText,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost,
		capitalizeWords,
		sortWordlist,
		wordsPerWordlist
	} = wg;

	// // //
	// Generate a psuedo-text
	// // //
	const generatePseudoText = async () => {
		const textInfo: string[][] = [];
		const text: string[] = [];
		for(let sentenceNumber = 0; sentenceNumber < sentencesPerText; sentenceNumber++) {
			const words: (string[])[] = [];
			const sentence: string[] = [];
			let maxWords = 3;
			for(maxWords = 3; true; maxWords = Math.max((maxWords + 1) % 15, 3)) {
				// The 'true' in there means this loop never ends on its own.
				if ((Math.random() * 100) < (maxWords < 5 ? 35 : (maxWords < 9 ? 50 : 25))) {
					break;
				}
			}
			for(let wordNumber = 0; wordNumber < maxWords; wordNumber++) {
				const word = makeOneWord(!wordNumber && capitalizeSentences);
				words.push([word]);
				sentence.push(word);
			}
			let full = sentence.join(" ");
			const length = words.length - 1;
			const type = Math.random() * 12;
			if(type < 9) {
				// Declarative three-fourths the time
				full = declarativeSentencePre + full + declarativeSentencePost;
				declarativeSentencePre && words[0].unshift(declarativeSentencePre);
				declarativeSentencePost && words[length].push(declarativeSentencePost);
			} else if (type < 11) {
				// Interrogative one-sixth the time
				full = interrogativeSentencePre + full + interrogativeSentencePost;
				interrogativeSentencePre && words[0].unshift(interrogativeSentencePre);
				interrogativeSentencePost && words[length].push(interrogativeSentencePost);
			} else {
				// Exclamatory one-twelfth the time
				full = exclamatorySentencePre + full + exclamatorySentencePost;
				exclamatorySentencePre && words[0].unshift(exclamatorySentencePre);
				exclamatorySentencePost && words[length].push(exclamatorySentencePost);
			}
			text.push(full);
			textInfo.push(...words.map((word: string[], i: number) => {
				return [sentence[i], word.join('')];
			}));
		}
		const textString = text.join(" ");
		return {
			string: textString,
			copy: textString,
			html: textInfo
		};
	};

	// // //
	// Generate Syllables
	// // //
	const makeMonosyllable = () => {
		return makeSyllable(singleWord, syllableDropoffOverrides.singleWord || syllableBoxDropoff);
	};
	const makeFirstSyllable = () => {
		if(!multipleSyllableTypes) {
			return makeMonosyllable();
		}
		return makeSyllable(wordInitial, syllableDropoffOverrides.wordInitial || syllableBoxDropoff);
	};
	const makeMidSyllable = () => {
		if(!multipleSyllableTypes) {
			return makeMonosyllable();
		}
		return makeSyllable(wordMiddle, syllableDropoffOverrides.wordMiddle || syllableBoxDropoff);
	};
	const makeLastSyllable = () => {
		if(!multipleSyllableTypes) {
			return makeMonosyllable();
		}
		return makeSyllable(wordFinal, syllableDropoffOverrides.wordFinal || syllableBoxDropoff);
	};
	const makeSyllable = (syllables: string, rate: number) => {
		let chosen;
		const syllList = syllables.split(/\r?\n/);
		const max = syllList.length;
		if(rate === 0) {
			return translateSyllable(syllList[Math.floor(Math.random() * max)]);
		}
		const increasedRate = rate + 5;
		for(let toPick = 0; true; toPick = (toPick + 1) % max) {
			// The 'true' in there means this loop never ends on its own.
			if ((Math.random() * 100) < increasedRate) {
				chosen = syllList[toPick];
				break;
			}
		}
		return translateSyllable(chosen);
	};
	const translateSyllable = (syll: string) => {
		const chars: string[] = syll.split("");
		let result: string = "";
		const rate = characterGroupDropoff;
		while(chars.length > 0) {
			const current = chars.shift();
			const charGroup = charGroupMap[current!];
			if(charGroup === undefined) {
				result += current;
			} else {
				const {
					dropoffOverride,
					run
				} = charGroup;
				const thisRate = (dropoffOverride === undefined ? rate : dropoffOverride) + 5;
				const max = run.length;
				if(thisRate === 0) {
					result += run[Math.floor(Math.random() * max)];
				} else {
					for(let toPick = 0; true; toPick = (toPick + 1) % max) {
						// The 'true' in there means this loop never ends on its own.
						if ((Math.random() * 100) < thisRate) {
							result += run[toPick];
							break;
						}
					}
				}
			}
		}
		return result;
	};

	// // //
	// Generate One Word
	// // //
	const makeOneWord = (capitalize: boolean) => {
		let numberOfSyllables = 1;
		const word: string[] = [];
		let result: string;
		// Determine number of syllables
		if((Math.random() * 100) >= monosyllablesRate) {
			// More than 1. Add syllables, favoring a lower number of syllables.
			const max = maxSyllablesPerWord - 2;
			numberOfSyllables = 2;
			for(let toAdd = 0; true; toAdd = (toAdd + 1) % max) {
				// The 'true' in there means this loop never ends on its own.
				if ((Math.random() * 100) < 50) {
					numberOfSyllables += toAdd;
					break;
				}
			}
		}
		// Check if we're monosyllabic.
		if(numberOfSyllables === 1) {
			// Mono
			word.push( makeMonosyllable() );
		} else {
			// Polysyllabic
			word.push( makeFirstSyllable() );
			let current = 1;
			while(current < numberOfSyllables) {
				current++;
				if(current === numberOfSyllables) {
					word.push( makeLastSyllable() );
				} else {
					word.push( makeMidSyllable() );
				}
			}
		}
		// Check for syllable break insertion
		if(showSyllableBreaks) {
			result = word.join("\u00b7");
		} else {
			result = word.join("");
		}
		// Apply transformss
		result = doTransform(result);
		// Capitalize if needed
		if(capitalize) {
			result = result.charAt(0).toLocaleUpperCase() + result.slice(1);
		}
		return result;
	};


	// // //
	// Apply Transforms
	// // //
	const doTransform = (word: string) => {
		transforms.forEach((transform: WGTransformObject) => {
			word = word.replace(regExpMap[transform.id]!, transform.replace);
		});
		return word;
	};

	// // //
	// Generate Every Possible Syllable
	// // //
	const getEverySyllable = async () => {
		const result: string[] = [];
		let initial: string[] = singleWord.split(/\r?\n/);
		if(multipleSyllableTypes) {
			initial = initial.concat(
				wordInitial.split(/\r?\n/),
				wordMiddle.split(/\r?\n/),
				wordFinal.split(/\r?\n/)
			);
		}
		const syllables: string[][] = initial.map((syll: string) => ["", syll]);
		while(syllables.length > 0) {
			const [current, toGo] = syllables.shift()!;
			const res = recurseSyllables(current, toGo);
			const newOutput: string[] = [];
			res.then((res: { results: string[], next: string }) => {
				const { next, results } = res;
				if(next === "") {
					// This one is done - run through transforms
					newOutput.push(...results.map((word: string) => doTransform(word)));
				} else {
					// Add to syllables
					const converted: string[][] = results.map((word: string) => [word, next]);
					syllables.push(...converted);
				}
			});
			await res;
			result.push(...newOutput);
		}
		// Capitalize if needed
		if(capitalizeWords) {
			const length = result.length;
			for(let x = 0; x < length; x++) {
				const word = result.shift()!;
				result.push(word.charAt(0).toUpperCase() + word.slice(1));
			}
		}
		// Sort if needed
		if(sortWordlist) {
			result.sort(wgSorter);
		}
		// Remove duplicates
		let previous: string | undefined = undefined;
		return result.filter((word: string) => {
			if(word === previous) {
				return false;
			}
			previous = word;
			return true;
		});
	};
	const recurseSyllables = async (previous: string, toGo: string) => {
		const current = toGo.charAt(0);
		const next = toGo.slice(1);
		const charGroup = charGroupMap[current];
		if(charGroup === undefined) {
			// CharGroup not found - save as written
			return {
				results: [previous + current],
				next
			};
		}
		return {
			results: charGroup.run.split("").map(char => previous + char),
			next
		}
	};

	// // //
	// Wordlist
	// // //
	const makeWordlist = async () => {
		const tester: {[key: string]: boolean} = {};
		const words: string[] = [];
		let counter = wordsPerWordlist * 100;
		for (
			let n = 0;
			n < wordsPerWordlist && counter > 0;
			n = words.length
		) {
			const potential = makeOneWord(capitalizeWords);
			if(tester[potential]) {
				counter--;
			} else {
				words.push(potential);
				tester[potential] = true;
			}
		}
		if(counter <= 0) {
			return t("unableToCreateXWords", { amount: wordsPerWordlist, max: words.length });
		}
		// Sort if needed
		if(sortWordlist) {
			words.sort(wgSorter);
		}
		return words;
	};



	// Determine what we're making.
	if(output === "text") {
		// pseudotext
		return await generatePseudoText();
	}
	// Every syllable, or a wordlist
	setIsGenerating(true);
	const result = (output === "syllables") ? (await getEverySyllable()) : (await makeWordlist());
	/*
	const resolveFunc = (output === "syllables") ? getEverySyllable : makeWordlist;
	const result = await resolveFunc();
	*/
	if(typeof result === "string") {
		// Error
		setIsGenerating(false);
		return { copy: result, error: result };
	}
	// columnar stuff takes a bit to process, so delay a bit?
	setIsGenerating(false);

	return {
		list: result,
		copy: result.join("\n")
	};

};
