import React, { ReactElement, useEffect, useMemo, useState, FC, useCallback } from 'react';
import {
	IonContent,
	IonPage,
	IonList,
	IonItem,
	IonSelect,
	IonSelectOption,
	IonToggle,
	IonButton,
	IonIcon,
	useIonToast,
	useIonAlert,
	AlertInput,
	SelectCustomEvent,
	ToggleCustomEvent
} from '@ionic/react';
import { useDispatch, useSelector } from "react-redux";
import {
	caretForwardCircleOutline,
	codeDownloadOutline,
	helpCircleOutline,
	copyOutline
} from 'ionicons/icons';

import { DJCustomInfo, PageData, SortObject, StateObject } from '../../store/types';
//import { addItemsToLexiconColumn } from '../../store/lexiconSlice';

//import { $a, $i } from '../../components/DollarSignExports';
import toaster from '../../components/toaster';
//import { LexiconOutlineIcon } from '../../components/icons';
//import PermanentInfo from '../../components/PermanentInfo';
import {
	DJDisplayData,
	DJDisplayMethods,
	DJFormatTypes,
	DJTypeObject,
	display,
	exporter,
	findCommons
} from '../../components/DJOutputFormat';
import copyText from '../../components/copyText';
import makeSorter from '../../components/stringSorter';
import PermanentInfo from '../../components/PermanentInfo';
import Header from '../../components/Header';
import ModalWrap from '../../components/ModalWrap';
import useI18Memo from '../../components/useI18Memo';
import { OutputCard } from './DJinfo';

const translations = [
	"ChartSideHeaders", "ChartTopHeaders", "Declensions",
	"showUnmatchedMsg",
	"showDeclenjugationsInInputMsg",
	"includeGeneralInfoMsg", "includeGenericMsg",
	"oneMatchMsg", "OneMatch", "Other",
	"noDisplayGroupMsg", "ShowExamples",
	"ShowGroupInfo", "ShowUnmatchedWords", "SortInput", "Text",
	"UnmatchedWords", "UseInput", "noFormatMsg",
	"Conjugations", "Export", "DisplayAs"
];

const commons = [
	"Cancel", "ChooseFormat", "CopyToClipboard", "Generate",
	"Help", "Output", "fileCsv", "fileText", "fileDocx"
];

const DJOutput: FC<PageData> = (props) => {
	const [
		tCancel, tChooseFormat, tCopy, tGen,
		tHelp, tOut, tCSV, tTxt, tDocx
	] = useI18Memo(commons);
	const [
		tChartSide, tChartTop, tDecl, tShowNotMatched, tShowDeclConj,
		tIncludeInfo, tIncludeGeneric, tOneMethod, tOneMatch, tOther,
		tChooseOne, tShowExamples, tShowGroupInfo, tShowUnmatchedWords,
		tSortInput, tText, tUnmatchedWords, tUseInput, tNoFormat, tConj,
		tExport, tpDisplayAs
	] = useI18Memo(translations, "dj");

//	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
//	const navigator = useIonRouter();
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);

	// Settings
	const [displayType, setDisplayType] = useState<DJDisplayMethods>("chartTH");
	const [usingInput, setUsingInput] = useState<boolean>(false);
	const [showUnmatched, setShowUnmatched] = useState<boolean>(false);
	const [showGroupInfo, setShowGroupInfo] = useState<boolean>(true);
	const [sortInput, setSortInput] = useState<boolean>(false);
	const [showExamples, setShowExamples] = useState<boolean>(true);
	const [wordsMatchOneTimeOnly, setWordsMatchOneTimeOnly] = useState<boolean>(false);

	// Display
	const [type, setType] = useState<(keyof DJCustomInfo)[]>([]);
	const [typeObj, setTypeObj] = useState<DJTypeObject>({});
	const [displayOutput, setDisplayOutput] = useState<ReactElement[]>([]);
	const [displayUnmatched, setDisplayUnmatched] = useState<ReactElement[]>([]);
	const [copyStrings, setCopyStrings] = useState<string[]>([]);
	const { declensions, conjugations, other, input } = useSelector((state: StateObject) => state.dj);
	const numberOfTypes =
		(declensions.length > 0 ? 1 : 0)
		+ (conjugations.length > 0 ? 1 : 0)
		+ (other.length > 0 ? 1 : 0);
	const {
		sortLanguage,
		sensitivity,
		defaultCustomSort,
		customSorts
	} = useSelector((state: StateObject) => state.sortSettings);
	const defaultSortLanguage = useSelector((state: StateObject) => state.internals.defaultSortLanguage);

	useEffect(() => {
		const types: (keyof DJCustomInfo)[] = [];
		declensions.length > 0 && types.push("declensions");
		conjugations.length > 0 && types.push("conjugations");
		other.length > 0 && types.push("other");
		setType(types);
	}, [declensions, conjugations, other]);
	useEffect(() => {
		const obj: DJTypeObject = {};
		type.forEach(key => (obj[key] = true));
		setTypeObj(obj);
	}, [type]);

	// Memoized stuff
	const sortObject = useMemo(() => {
		let defaultCustomSortObj: SortObject | undefined;
		customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).every(obj => {
			if (obj.id === defaultCustomSort) {
				defaultCustomSortObj = obj;
			}
			return !(defaultCustomSortObj);
		});
		return makeSorter(
			sortLanguage || defaultSortLanguage,
			sensitivity,
			defaultCustomSortObj
		);
	}, [customSorts, defaultCustomSort, defaultSortLanguage, sensitivity, sortLanguage]);
	const data: DJDisplayData = useMemo(() => {
		if(usingInput) {
			// Grab input, removing duplicates
			const newInput = [...(new Set(input.split(/\n/)))];
			//
			// Handle alphabetization
			if(sortInput) {
				newInput.sort(sortObject);
			}
			// Return data
			return {
				input: newInput,
				showGroupInfo,
				showExamples,
				wordsMatchOneTimeOnly
			};
		}
		// Not using input? Leave as null.
		return null;
	}, [usingInput, input, sortInput, sortObject, showGroupInfo, showExamples, wordsMatchOneTimeOnly]);

	const maybeDoExport = useCallback(() => {
		if(type.length === 0) {
			return toaster({
				message: tChooseOne,
				color: "danger",
				toast
			});
		}
		const inputs: AlertInput[] = [
			{
				label: tDocx,
				type: "radio",
				value: "docx"
			},
			{
				label: tTxt,
				type: "radio",
				value: "text"
			}
		];
		displayType !== "text" && inputs.unshift({
			label: tCSV,
			type: "radio",
			value: "csv"
		});
		doAlert({
			header: tChooseFormat,
			inputs,
			buttons: [
				{
					text: tCancel,
					role: "cancel",
					cssClass: "cancel"
				},
				{
					text: tExport,
					cssClass: "submit",
					handler: (format: null | "" | undefined | DJFormatTypes) => {
						if(!format) {
							return toaster({
								message: tNoFormat,
								color: "danger",
								duration: 3000,
								toast
							});
						}
						exporter(
							typeObj,
							declensions,
							conjugations,
							other,
							data,
							displayType,
							format,
							data ? showUnmatched : null,
							dispatch,
							toast
						);
					}
				}
			]
		});
	}, [conjugations, data, declensions, dispatch, displayType, doAlert, other, showUnmatched, tCSV, tCancel, tChooseFormat, tChooseOne, tDocx, tExport, tNoFormat, tTxt, toast, type.length, typeObj]);

	const doGenerate = useCallback(() => {
		if(type.length === 0) {
			return toaster({
				message: tChooseOne,
				color: "danger",
				toast
			});
		}
		const output: ReactElement[] = [];
		const toCopy: string[] = [];
		const unmatched: string[][] = [];
		const {declensions: dec, conjugations: con, other: oth} = typeObj;
		let newData: DJDisplayData = data && {...data};
		function handleRemainder (data: DJDisplayData, remainder: string[]) {
			if(data && data.wordsMatchOneTimeOnly) {
				newData = {
					...data,
					input: remainder
				};
				return;
			}
			unmatched.push(remainder);
		}
		if (dec) {
			const [els, remainder, copy] = display(declensions, newData, displayType, "declensions");
			output.push(...els);
			toCopy.push(copy);
			handleRemainder(newData, remainder);
		}
		if (con) {
			const [els, remainder, copy] = display(conjugations, newData, displayType, "conjugations");
			output.push(...els);
			toCopy.push(copy);
			handleRemainder(newData, remainder);
		}
		if (oth) {
			const [els, remainder, copy] = display(other, newData, displayType, "other");
			output.push(...els);
			toCopy.push(copy);
			handleRemainder(newData, remainder);
		}
		setCopyStrings(toCopy);
		setDisplayOutput(output);
		// Handle unmatched
		if(showUnmatched) {
			const unfound: string[] = (newData && newData.wordsMatchOneTimeOnly) ? newData.input : findCommons(unmatched);
			setDisplayUnmatched(unfound.length > 0 ? [
				<div className="unmatchedWords" key="unmatched:all">
					<div className="title">{tUnmatchedWords}</div>
					<div className="contents">{
						unfound.map((word, i) => <span key={`unmatched:${word}:${i}`}>{word}</span>)
					}</div>
				</div>
			] : []);
		} else {
			setDisplayUnmatched([]);
		}
	}, [conjugations, data, declensions, displayType, other, showUnmatched, tChooseOne, tUnmatchedWords, toast, type.length, typeObj]);

	const endButtons = useMemo(() => [
		<IonButton key="djOutputHelpButton" aria-label={tHelp} onClick={() => setIsOpenInfo(true)}>
			<IonIcon icon={helpCircleOutline} />
		</IonButton>
	], [tHelp]);
	const saveDisplayType = useCallback((e: SelectCustomEvent) => setDisplayType(e.detail.value), []);

	const groupSelector = useMemo(() => numberOfTypes > 1 ? (
		<IonItem>
			<IonSelect
				color="primary"
				className="ion-text-wrap settings"
				label="Group(s):"
				value={type}
				onIonChange={(e) => setType(e.detail.value)}
				multiple
			>
				{
					declensions.length > 0 ?
						(
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="declensions"
							>{tDecl}</IonSelectOption>
						)
					:
						<></>
				}
				{
					conjugations.length > 0 ?
						(
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="conjugations"
							>{tConj}</IonSelectOption>
						)
					:
						<></>
				}
				{
					other.length > 0 ?
						(
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="other"
							>{tOther}</IonSelectOption>
						)
					:
						<></>
				}
			</IonSelect>
		</IonItem>
	) : <></>, [conjugations.length, declensions.length, numberOfTypes, other.length, tConj, tDecl, tOther, type]);
	const doSetInputUse = useCallback((e: ToggleCustomEvent) => setUsingInput(!usingInput), [usingInput]);
	const doSetShowingInfo = useCallback((e: ToggleCustomEvent) => setShowGroupInfo(!showGroupInfo), [showGroupInfo]);
	const doSetShowingExamples = useCallback((e: ToggleCustomEvent) => setShowExamples(!showExamples), [showExamples]);
	const doSetSorting = useCallback((e: ToggleCustomEvent) => setSortInput(!sortInput), [sortInput]);
	const setMatchOnce = useCallback((e: ToggleCustomEvent) => setWordsMatchOneTimeOnly(!wordsMatchOneTimeOnly), [wordsMatchOneTimeOnly]);
	const setShowingUnmatched = useCallback((e: ToggleCustomEvent) => setShowUnmatched(!showUnmatched), [showUnmatched]);
	const doCopy = useCallback(() => copyText(copyStrings.filter(line => line).join("\n\n\n"), toast), [toast, copyStrings]);

	return (
		<IonPage>
			<ModalWrap {...props.modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<OutputCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<Header
				title={tOut}
				endButtons={endButtons}
			/>
			<IonContent className="hasFabButton">
				<IonList lines="full" className="djOutput hasToggles">
					<IonItem>
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpDisplayAs}
							value={displayType}
							onIonChange={saveDisplayType}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="chartTH"
							>{tChartTop}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="chartSH"
							>{tChartSide}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="text"
							>{tText}</IonSelectOption>
						</IonSelect>
					</IonItem>
					{groupSelector}
					<IonItem className="wrappableInnards">
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={usingInput}
							onIonChange={doSetInputUse}
						>
							<h2>{tUseInput}</h2>
							<p>{tShowDeclConj}</p>
						</IonToggle>
					</IonItem>
					<IonItem
						className={"wrappableInnards toggleable" + (usingInput ? "" : " toggled")}
					>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={showGroupInfo}
							onIonChange={doSetShowingInfo}
						>
							<h2>{tShowGroupInfo}</h2>
							<p>{tIncludeInfo}</p>
						</IonToggle>
					</IonItem>
					<IonItem
						className={"wrappableInnards toggleable" + (usingInput ? "" : " toggled")}
					>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={showExamples}
							onIonChange={doSetShowingExamples}
						>
							<h2>{tShowExamples}</h2>
							<p>{tIncludeGeneric}</p>
						</IonToggle>
					</IonItem>
					<IonItem
						className={"wrappableInnards toggleable" + (usingInput ? "" : " toggled")}
					>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={sortInput}
							onIonChange={doSetSorting}
						>
							<h2>{tSortInput}</h2>
						</IonToggle>
					</IonItem>
					<IonItem
						className={"wrappableInnards toggleable" + (usingInput ? "" : " toggled")}
					>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={wordsMatchOneTimeOnly}
							onIonChange={setMatchOnce}
						>
							<h2>{tOneMatch}</h2>
							<p>{tOneMethod}</p>
						</IonToggle>
					</IonItem>
					<IonItem className={"wrappableInnards toggleable" + (usingInput ? "" : " toggled")}>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={showUnmatched}
							onIonChange={setShowingUnmatched}
						>
							<h2>{tShowUnmatchedWords}</h2>
							<p>{tShowNotMatched}</p>
						</IonToggle>
					</IonItem>
				</IonList>
				<div id="DJOutputButtons">
					<IonButton
						strong={true}
						size="small"
						color="tertiary"
						onClick={maybeDoExport}
					>
						{tExport}
						<IonIcon icon={codeDownloadOutline} />
					</IonButton>
					<IonButton
						strong={true}
						size="small"
						color="success"
						onClick={doGenerate}
					>
						{tGen}
						<IonIcon icon={caretForwardCircleOutline} />
					</IonButton>
				</div>
				<div id="DJOutput" className="selectable">
					{displayOutput}
					{displayUnmatched}
				</div>
				<div className={(displayOutput.length + displayUnmatched.length) > 0 ? "ion-padding-start ion-padding-bottom" : "hide"}>
					<IonButton
						color="primary"
						onClick={doCopy}
					>
						{tCopy}
						<IonIcon icon={copyOutline} slot="start" />
					</IonButton>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default DJOutput;
