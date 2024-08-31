import React, { useState, useCallback, useEffect, useMemo, FC } from 'react';
import {
	IonPage,
	IonContent,
	IonList,
	IonLabel,
	IonChip,
	IonItem,
	IonButton,
	IonIcon,
	useIonAlert,
	useIonToast,
	useIonRouter,
	AlertInput,
	IonCard,
	IonCardContent
} from '@ionic/react';
import {
	helpCircleOutline,
	saveOutline,
	checkmarkDoneOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import {
	updateConceptsDisplay,
	toggleConceptsBoolean,
	addCustomHybridMeaning,
	deleteCustomHybridMeanings
} from '../store/conceptsSlice';
import {
	LexiconColumn,
	PageData,
	Concept,
	ConceptCombo,
	StateObject,
	SortObject,
	ConceptDisplay,
	ConceptDisplayObject,
	ModalPropsMaker
} from '../store/types';
import { addItemsToLexiconColumn } from '../store/lexiconSlice';
import useTranslator from '../store/translationHooks';

import { Concepts, ConceptsSources } from '../components/Concepts';
import { ConceptsOutlineIcon, LexiconIcon, LexiconOutlineIcon } from '../components/icons';
import Header from '../components/Header';
import ModalWrap from "../components/ModalWrap";
import yesNoAlert from '../components/yesNoAlert';
import toaster from '../components/toaster';
import makeSorter from '../components/stringSorter';
import PermanentInfo from '../components/PermanentInfo';
import useI18Memo from '../components/useI18Memo';

interface SavedWord { id: string, word: string, parts?: Concept[] }

interface InnerHeaderProps {
	textCenter: boolean
	pickAndSave: boolean
	modalPropsMaker: ModalPropsMaker
}

const pair = ["Concepts", "Help"];
const InnerHeader: FC<InnerHeaderProps> = (props) => {
	const { textCenter, pickAndSave, modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [tConcepts, tHelp] = useI18Memo(pair);
	const endButtons = useMemo(() => {
		return [
			<IonButton key="conceptsTextCenterButton" onClick={() => dispatch(toggleConceptsBoolean("textCenter"))}>
				<IonIcon
					flipRtl
					size="small"
					slot="end"
					src={`svg/align-${textCenter ? "left" : "center" }-material.svg`}
				/>
			</IonButton>,
			<IonButton key="conceptsHelpButton" aria-label={tHelp} disabled={pickAndSave} onClick={() => setIsOpenInfo(true)}>
				<IonIcon icon={helpCircleOutline} />
			</IonButton>
		];
	}, [pickAndSave, tHelp, textCenter, dispatch]);
	return (<>
		<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}><ConceptCard /></ModalWrap>
		<Header
			title={tConcepts}
			endButtons={endButtons}
		/>
	</>);
};

interface WordItemProps {
	wordObj: Partial<Concept> & Partial<ConceptCombo> & Pick<Concept | ConceptCombo, "id">
	isSaved: boolean | undefined
	maybeSaveThisWord: (x: string, y: string, z?: Concept[] | undefined) => (() => void)
}
const WordItem: FC<WordItemProps> = (props) => {
	const { t } = useTranslation(['concepts']);
	const { wordObj, isSaved, maybeSaveThisWord } = props;
	const { id } = wordObj;
	const word = useMemo(() => {
		let word: string = "";
		if(wordObj.parts) {
			// Combination
			word = wordObj.parts.map((w: Concept) => t(w.word)).join("; ")
		} else {
			// Regular word
			word = t(wordObj.word!);
		}
		return word;
	}, [t, wordObj]);
	const isCombo = wordObj.parts;
	const classes =
		(isSaved ? "saved " : "")
		+ "word"
		+ (isCombo ? " combo" : "");
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const maybeSave = useCallback(maybeSaveThisWord(id!, word, isCombo), [maybeSaveThisWord]);
	return (
		<div
			onClick={maybeSave}
			key={id}
			id={id}
			className={classes}
		>{word}</div>
	);
};
const getItems = (
	input: Concept[] | ConceptCombo[],
	savedWordsObject: { [key: string]: boolean },
	maybeSaveThisWord: (x: string, y: string, z?: Concept[] | undefined) => (() => void)
) => input.map(wordObj =>
	<WordItem
		key={"word-item-" + wordObj.id}
		wordObj={wordObj}
		isSaved={savedWordsObject[wordObj.id]}
		maybeSaveThisWord={maybeSaveThisWord}
	/>
);

interface GroupChipProps {
	title: string
	isDisplayed: boolean | undefined
	index: number
	toggleFunc: () => void
}
const GroupChip: FC<GroupChipProps> = (props) => {
	const { t } = useTranslation(['concepts']);
	const { title, isDisplayed, index, toggleFunc } = props;
	const chipTitle = useMemo(() => t(title), [ t, title ]);
	return (
		<IonChip
			outline={!isDisplayed}
			onClick={toggleFunc}
			className={
				(index === 0 ?
					("ion-margin-start" + (isDisplayed ? " active" : ""))
				:
					(isDisplayed ? "active" : "")
				)
			}
		>
			<IonLabel>{chipTitle}</IonLabel>
		</IonChip>
	);
};
const getChips = (
	input: [string, ConceptDisplay][],
	display: ConceptDisplayObject,
	toggleChars: (x: ConceptDisplay) => (() => void)
) => input.map((pair, i) => {
	const [title, prop] = pair;
	const toggleFunc = toggleChars(prop);
	return <GroupChip key={prop} title={title} isDisplayed={display[prop]} index={i} toggleFunc={toggleFunc} />;
});

const ConceptsPage: FC<PageData> = (props) => {
	const [ t ] = useTranslator('concepts');
	const [ tc ] = useTranslator('common');
	const { modalPropsMaker } = props;
	const [pickAndSave, setPickAndSave] = useState<boolean>(false);
	const [linking, setLinking] = useState<boolean>(false);
	const [unlinking, setUnlinking] = useState<boolean>(false);
	const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
	const [savedWordsObject, setSavedWordsObject] = useState<{ [key: string]: boolean }>({});
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const {
		sortLanguage,
		sensitivity,
		defaultCustomSort,
		customSorts
	} = useSelector((state: StateObject) => state.sortSettings);
	const defaultSortLanguage = useSelector((state: StateObject) => state.internals.defaultSortLanguage);
	const {
		columns: lexColumns,
		customSort
	} = useSelector((state: StateObject) => state.lexicon);
	const sorter = useMemo(() => {
		let customSortObj: SortObject | undefined;
		let defaultCustomSortObj: SortObject | undefined;
		customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).every(obj => {
			if(obj.id === customSort) {
				customSortObj = obj;
			} else if (obj.id === defaultCustomSort) {
				defaultCustomSortObj = obj;
			}
			return !(customSortObj && defaultCustomSortObj);
		})
		return makeSorter(sortLanguage || defaultSortLanguage, sensitivity, customSortObj || defaultCustomSortObj);
	}, [customSort, customSorts, sortLanguage, defaultSortLanguage, sensitivity, defaultCustomSort]);
	const {
		display,
		showingCombos,
		combinations,
		textCenter
	} = useSelector((state: StateObject) => state.concepts);
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const navigator = useIonRouter();
	const toggleChars = useCallback((what: ConceptDisplay) => {
		// Returns a function that can be slotted into an onClick or whatever.
		return () => {
			const newDisplay = {...display};
			if(display[what]) {
				delete newDisplay[what];
			} else {
				newDisplay[what] = true;
			}
			dispatch(updateConceptsDisplay(newDisplay));
		}
	}, [dispatch, display]);
	const shown = useMemo(() => {
		const displaying = Object.keys(display) as ConceptDisplay[];
		return Concepts.filter((word: Concept) => displaying.some(p => word[p]));
	}, [display]);
	useEffect(() => {
		if(unlinking && (!showingCombos || combinations.length === 0)) {
			setUnlinking(false);
		}
	}, [showingCombos, unlinking, combinations]);

	// // //
	// Save to Lexicon
	// // //

	const saveToLexicon = useCallback((words: SavedWord[]) => {
		doAlert({
			header: tc("SelectAColumn"),
			message: t("addToColumnMsg"),
			inputs: lexColumns.map((col: LexiconColumn, i: number) => {
				const obj: AlertInput = {
					type: 'radio',
					label: col.label || "",
					value: col,
					checked: !i
				};
				return obj;
			}),
			buttons: [
				{
					text: t("Stop"),
					handler: () => {
						setSavedWords([]);
						setSavedWordsObject({});
						setPickAndSave(false);
					},
					cssClass: "danger"
				},
				{
					text: tc("Cancel"),
					role: 'cancel',
					cssClass: "cancel"
				},
				{
					text: tc("Save"),
					handler: (col: LexiconColumn | undefined) => {
						if(!col) {
							// Treat as cancel
							return;
						}
						// Send off to the lexicon
						dispatch(addItemsToLexiconColumn([words.map((obj: SavedWord) => t(obj.word)), col.id, sorter]));
						// Clear info
						setSavedWords([]);
						setSavedWordsObject({});
						setPickAndSave(false);
						// Toast
						toaster({
							message: t(
								'saveToLexColumn',
								{
									column: col.label,
									count: words.length
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
	}, [dispatch, doAlert, lexColumns, navigator, sorter, t, tc, toast]);
	const donePickingAndSaving = useCallback(() => {
		if(savedWords.length > 0) {
			// Attempt to save
			saveToLexicon(savedWords);
		} else {
			// Just stop saving
			setPickAndSave(false);
		}
	}, [saveToLexicon, savedWords]);
	const doPickAndSave = useCallback(() => {
		if (pickAndSave) {
			// Stop saving
			return donePickingAndSaving();
		}
		setPickAndSave(true);
		return toaster({
			message: t("tapToSaveMsg"),
			duration: 2500,
			position: "top",
			toast
		});
	}, [donePickingAndSaving, pickAndSave, t, toast]);
	const saveEverything = useCallback(() => {
		const words = shown.map(word => ({id: word.id, word: t(word.word)}));
		if(showingCombos) {
			combinations.forEach((combo: ConceptCombo) => {
				const { id, parts } = combo;
				words.push({
					id,
					word: parts.map((w: Concept) => t(w.word)).join("; ")
				})
			});
		}
		saveToLexicon(words);
	}, [combinations, saveToLexicon, showingCombos, shown, t]);
	const maybeSaveThisWord = useCallback((id: string, text: string, isCombo?: Concept[]) => {
		// Returns a function that can be slotted into an onClick or whatever.
		return () => {
			if(unlinking && !isCombo) {
				// Ignore
			} else if(pickAndSave || linking || unlinking) {
				const newObject = {...savedWordsObject};
				if(savedWordsObject[id]) {
					setSavedWords(savedWords.filter(word => word.id !== id));
					delete newObject[id];
				} else {
					const inserting: SavedWord = { id, word: text };
					isCombo && (inserting.parts = isCombo);
					setSavedWords([...savedWords, inserting]);
					newObject[id] = true;
				}
				setSavedWordsObject(newObject);
			}
		};
	}, [savedWords, savedWordsObject, pickAndSave, linking, unlinking]);

	// // //
	// Combine Into New Meaning
	// // //

	const saveNewMeaning = useCallback((makeToast: boolean = true) => {
		const final: Concept[] = [];
		savedWords.forEach(obj => {
			if(obj.parts) {
				final.push(...obj.parts);
			} else {
				final.push(obj);
			}
		});
		dispatch(addCustomHybridMeaning(final));
		makeToast && toaster({
			message: t("CombinationSaved"),
			duration: 2500,
			position: "top",
			color: "success",
			toast
		});
	}, [dispatch, savedWords, t, toast]);
	const toggleLinking = useCallback(() => {
		if(linking) {
			if(savedWords.length > 0) {
				// We have information left over. Do we want to keep it?
				const handler = () => {
					setSavedWords([]);
					setSavedWordsObject({});
					setLinking(false);
				};
				if(!disableConfirms) {
					return doAlert({
						header: t("StopLinking"),
						cssClass: "danger",
						message: t(
							"meaningsStillSelected",
							{ count: savedWords.length }
						),
						buttons: [
							{
								text: tc("Cancel"),
								role: "cancel",
								cssClass: "cancel"
							},
							{
								text: t("YesSaveThem"),
								cssClass: "submit",
								handler: () => {
									saveNewMeaning();
									handler();
								}
							},
							{
								text: t("NoDiscardThem"),
								cssClass: "cancel",
								handler
							}
						]
					});
				}
				return handler();
			}
			// 0-1 meanings selected: just ignore and toggle off
			setLinking(false);
			setSavedWords([]);
			setSavedWordsObject({});
			return;
		}
		setLinking(true);
		return toaster({
			message: t("tapToLinkMsg"),
			duration: 5000,
			position: "top",
			toast
		})
	}, [disableConfirms, doAlert, linking, saveNewMeaning, savedWords.length, t, tc, toast]);
	const doneLinking = useCallback(() => {
		saveNewMeaning();
		setSavedWords([]);
		setSavedWordsObject({});
	}, [saveNewMeaning]);
	const toggleUnlinking = useCallback(() => {
		if(!unlinking) {
			toaster({
				message: t("tapToUnlinkMsg"),
				duration: 3000,
				position: "top",
				color: "warning",
				toast
			});
		} else if (savedWords.length > 0) {
			const handler = () => {
				dispatch(deleteCustomHybridMeanings(savedWords.map(word => word.id)));
				setSavedWords([]);
				setSavedWordsObject({});
				setUnlinking(false);
			};
			if(!disableConfirms) {
				return yesNoAlert({
					header: t("delMeanings", { count: savedWords.length }),
					cssClass: "danger",
					message: t("delMeaningsMessage", { count: savedWords.length }),
					submit: tc("confirmDel", { count: savedWords.length }),
					handler,
					doAlert
				});
			}
			return handler();
		}
		setUnlinking(!unlinking);
	}, [disableConfirms, dispatch, doAlert, savedWords, t, tc, toast, unlinking]);

	// // //
	// Memoize display
	// // //

	const header = useMemo(
		() => <InnerHeader textCenter={textCenter} pickAndSave={pickAndSave} modalPropsMaker={modalPropsMaker} />,
		[ textCenter, pickAndSave, modalPropsMaker ]
	);
	const wordsShowing = useMemo(
		() => getItems(shown, savedWordsObject, maybeSaveThisWord),
		[ shown, savedWordsObject, maybeSaveThisWord ]
	);
	const combosShowing = useMemo(
		() => getItems(combinations, savedWordsObject, maybeSaveThisWord),
		[ combinations, savedWordsObject, maybeSaveThisWord ]
	);
	const chips = useMemo(
		() => getChips(ConceptsSources, display, toggleChars),
		[ display, toggleChars ]
	);
	const [
		tDisplay,
		tMyCombinations,
		tSaveAll,
		tSaveSelected,
		tCurrentCombo,
		tSave
	] = useMemo(() => [
		tc("Display"),
		t("MyCombinations"),
		t("SaveAllMeanings"),
		t("SaveSelectedMeanings"),
		t("CurrentCombo"),
		tc("Save")
	], [ t, tc ]);

	const toggleBool = useCallback(() => dispatch(toggleConceptsBoolean("showingCombos")), [dispatch]);
	const savedWordsList = useMemo(() => savedWords.map(word => word.word).join("; "), [savedWords]);

	return (
		<IonPage>
			{header}
			<IonContent>
				<IonList lines="none">
					<IonItem className="conceptsChips">
						<div className="chips">
							<span>{tDisplay}</span>
							{chips}
							<IonChip
								key="combinations"
								outline={!showingCombos}
								onClick={toggleBool}
								className={showingCombos ? "active" : undefined}
							>
								<IonLabel>{tMyCombinations}</IonLabel>
							</IonChip>
						</div>
						<div className="controls">
							<IonButton
								disabled={linking || unlinking}
								fill={pickAndSave ? "solid" : "outline"}
								onClick={doPickAndSave}
							>
								<LexiconIcon slot="icon-only" />
							</IonButton>
							<IonButton
								disabled={pickAndSave || unlinking}
								fill={linking ? "solid" : "outline"}
								color="secondary"
								onClick={toggleLinking}
							>
								<IonIcon slot="icon-only" src="svg/link.svg" />
							</IonButton>
							{showingCombos &&
								<IonButton
									disabled={combinations.length === 0 || linking || pickAndSave}
									fill={unlinking ? "solid" : "outline"}
									color="secondary"
									onClick={toggleUnlinking}
								>
									<IonIcon slot="icon-only" src="svg/unlink.svg" />
								</IonButton>
							}
						</div>
					</IonItem>
					<IonItem className={pickAndSave ? "" : "hide"}>
						<IonButton
							strong={true}
							color="tertiary"
							onClick={saveEverything}
						>
							<IonIcon icon={saveOutline} className="conceptIcons" /> {tSaveAll}
						</IonButton>
					</IonItem>
					<IonItem className={pickAndSave ? "" : "hide"}>
						<IonButton
							strong={true}
							color="secondary"
							onClick={donePickingAndSaving}
						>
							<IonIcon icon={checkmarkDoneOutline} className="conceptIcons" /> {tSaveSelected}
						</IonButton>
					</IonItem>
					<IonItem className={linking ? "" : "hide"}>
						<IonLabel className="ion-text-wrap">
							{tCurrentCombo} {savedWordsList}
						</IonLabel>
						<IonButton
							disabled={savedWords.length <= 1}
							slot="end"
							strong={true}
							color="success"
							onClick={doneLinking}
						>
							<IonIcon icon={saveOutline} className="conceptIcons" /> {tSave}
						</IonButton>
					</IonItem>
					<div
						id="outputPaneConcepts"
						className={
							"concepts"
							+ (pickAndSave || linking ? " pickAndSave" : "")
							+ (unlinking ? " removingCombos" : "")
							+ (textCenter ? " centering" : "")
						}
					>
						{showingCombos && combosShowing}
						{wordsShowing}
					</div>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default ConceptsPage;

const info = [ "info.basic", "info.controlLexicon", "info.controlJoin", "info.controlUnjoin", "info.theLists" ];
const joiner = { joinArrays: "\n" };
export const ConceptCard = () => {
	const [ tc ] = useTranslator('common');
	const tConcepts = useMemo(() => tc("Concepts"), [tc]);
	const [ tiBasic, tiCtrlLex, tiCtrlJoin, tiUnjoin, tiLists ] = useI18Memo(info, 'concepts', joiner)
	return (
		<IonCard>
			<IonItem lines="full">
				<ConceptsOutlineIcon slot="start" color="primary" />
				<IonLabel>{tConcepts}</IonLabel>
			</IonItem>
			<IonCardContent>
				<Markdown>{tiBasic}</Markdown>
				<hr />
				<h2>{tConcepts}</h2>
				<div className="ion-text-center"><LexiconOutlineIcon color="tertiary" size="large" /></div>
				<Markdown>{tiCtrlLex}</Markdown>
				<div className="ion-text-center"><IonIcon color="tertiary" size="large" src="svg/link.svg" /></div>
				<Markdown>{tiCtrlJoin}</Markdown>
				<div className="ion-text-center"><IonIcon color="tertiary" size="large" src="svg/unlink.svg" /></div>
				<Markdown>{tiUnjoin}</Markdown>
				<hr />
				<Markdown>{tiLists}</Markdown>
			</IonCardContent>
		</IonCard>
	);
}
