import React, { useCallback, useMemo, FC } from 'react';
import {
	IonContent,
	IonToolbar,
	IonList,
	IonButton,
	IonItemDivider,
	IonItem,
	IonLabel,
	IonToggle,
	IonRange,
	IonModal,
	IonIcon,
	IonFooter,
	IonSelect,
	IonSelectOption,
	ToggleCustomEvent,
	RangeCustomEvent,
	SelectCustomEvent
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";
import {
	checkmarkCircleOutline,
	ellipseOutline
} from 'ionicons/icons';

import {
	Fifty_OneThousand,
	Five_OneHundred,
	ModalProperties,
	StateObject
} from '../../../store/types';
import {
	setOutputTypeWG,
	setSyllableBreaksWG,
	setSentencesPerTextWG,
	setCapitalizeWordsWG,
	setSortWordlistWG,
	setWordlistMulticolumnWG,
	setWordsPerWordlistWG,
	setCustomSort
} from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import PermanentInfo from '../../../components/PermanentInfo';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

const translations = [
	"AllPossibleSyllables", "CapitalizeWords", "Default",
	"MultiColumnLayout", "NumberOfSentences", "PseudoText",
	"ShowSyllableBreaks", "SortOutput", "WhatToGenerate",
	"WordlistSize", "Wordlist", "PseudoTextControls",
	"WordListSyllListControls"
];

const OutputOptionsModal: FC<ModalProperties> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const tOutOpts = useMemo(() => tw("OutputOptions"), [tw]);
	const tSortMethod = useMemo(() => tc("SortMethod"), [tc]);
	const [
		tAllSyll, tCap, tDefault, tMulti, tNumSent,
		tPseudo, tSyllBr, tSort, tWhat, tWLSize, tWL,
		tPsCtrl, tWLSyllCtrl
	] = useI18Memo(translations, 'wg');
	const tDone = useMemo(() => tc("Done"), [tc]);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const {
		output,
		showSyllableBreaks,
		sentencesPerText,
		capitalizeWords,
		sortWordlist,
		wordlistMultiColumn,
		wordsPerWordlist,
		customSort
	} = useSelector((state: StateObject) => state.wg);
	const { customSorts } = useSelector((state: StateObject) => state.sortSettings);
	const onChangeWordsWordlist = useCallback(
		(e: RangeCustomEvent) => dispatch(setWordsPerWordlistWG(e.detail.value as Fifty_OneThousand)),
		[dispatch]
	);
	const onChangeSentencesWordlist = useCallback(
		(e: RangeCustomEvent) => dispatch(setSentencesPerTextWG(e.detail.value as Five_OneHundred)),
		[dispatch]
	);
	const onChangeCustomSort = useCallback(
		(e: SelectCustomEvent) => dispatch(setCustomSort(e.detail.value)),
		[dispatch]
	);
	const setSylBreak = useCallback((e: ToggleCustomEvent) => dispatch(setSyllableBreaksWG(e.detail.checked)), [dispatch]);
	const setCapWords = useCallback((e: ToggleCustomEvent) => dispatch(setCapitalizeWordsWG(e.detail.checked)), [dispatch]);
	const setSortList = useCallback((e: ToggleCustomEvent) => dispatch(setSortWordlistWG(e.detail.checked)), [dispatch]);
	const setWLMultiC = useCallback((e: ToggleCustomEvent) => dispatch(setWordlistMulticolumnWG(e.detail.checked)), [dispatch]);

	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const toText = useCallback(() => dispatch(setOutputTypeWG('text')), [dispatch]);
	const toWL = useCallback(() => dispatch(setOutputTypeWG('wordlist')), [dispatch]);
	const toSyll = useCallback(() => dispatch(setOutputTypeWG('syllables')), [dispatch]);

	const sortOptions = useMemo(() => customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).map(sorter => (
		<IonSelectOption
			className="ion-text-wrap ion-text-align-end"
			key={`customSortChooser:${sorter.id}:${sorter.title}`}
			value={sorter.id}
		>{sorter.title}</IonSelectOption>
	)), [customSorts]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tOutOpts} closeModal={setIsOpen} />
			<IonContent>
				<IonList lines="full" className="hasSpecialLabels">
					<IonItem>
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							checked={showSyllableBreaks}
							onIonChange={setSylBreak}
						>{tSyllBr}</IonToggle>
					</IonItem>
					<IonItemDivider>{tWhat}</IonItemDivider>
					<IonItem button={true} onClick={toText}>
						<IonLabel>{tPseudo}</IonLabel>
						<IonIcon
							icon={output === "text" ? checkmarkCircleOutline : ellipseOutline}
						/>
					</IonItem>
					<IonItem button={true} onClick={toWL}>
						<IonLabel>{tWL}</IonLabel>
						<IonIcon
							icon={output === "wordlist" ? checkmarkCircleOutline : ellipseOutline}
						/>
					</IonItem>
					<IonItem button={true} onClick={toSyll}>
						<IonLabel>{tAllSyll}</IonLabel>
						<IonIcon
							icon={output === "syllables" ? checkmarkCircleOutline : ellipseOutline}
						/>
					</IonItem>
					<IonItemDivider>{output === "text" ? tPsCtrl : tWLSyllCtrl}</IonItemDivider>
					<IonItem className={(output === "text" ? "" : "hide") + " labelled"}>
						<IonLabel>{tNumSent}</IonLabel>
					</IonItem>
					<IonItem className={output === "text" ? "" : "hide"}>
						<IonRange
							debounce={250}
							min={5} max={100}
							value={sentencesPerText}
							pin={true}
							onIonChange={onChangeSentencesWordlist}
						>
							<div slot="start">5</div>
							<div slot="end">100</div>
						</IonRange>
					</IonItem>
					<IonItem className={output === "text" ? "hide" : ""}>
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							checked={capitalizeWords}
							onIonChange={setCapWords}
						>{tCap}</IonToggle>
					</IonItem>
					<IonItem className={output === "text" ? "hide" : ""}>
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							checked={sortWordlist}
							onIonChange={setSortList}
						>{tSort}</IonToggle>
					</IonItem>
					<IonItem className={(output === "text" || !sortWordlist) ? "hide" : ""}>
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tSortMethod}
							value={customSort || null}
							onIonChange={onChangeCustomSort}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value={null}
							>{tDefault}</IonSelectOption>
							{sortOptions}
						</IonSelect>
					</IonItem>
					<IonItem className={output === "text" ? "hide" : ""}>
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							checked={wordlistMultiColumn}
							onIonChange={setWLMultiC}
						>{tMulti}</IonToggle>
					</IonItem>
					<IonItem className={(output === "text" ? "hide" : "") + " labelled"}>
						<IonLabel>{tWLSize}</IonLabel>
					</IonItem>
					<IonItem className={output === "text" ? "hide" : ""}>
						<IonRange
							debounce={250}
							min={50} max={1000}
							value={wordsPerWordlist}
							pin={true}
							onIonChange={onChangeWordsWordlist}
						>
							<div slot="start">50</div>
							<div slot="end">1000</div>
						</IonRange>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="success" slot="end" onClick={closer}>
						<IonLabel>{tDone}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default OutputOptionsModal;
