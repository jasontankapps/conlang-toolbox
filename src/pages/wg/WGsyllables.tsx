import React, { useState, useEffect, ReactElement, Fragment, FC, useCallback, useMemo } from 'react';
import {
	IonContent,
	IonPage,
	IonButton,
	IonIcon,
	IonList,
	IonItem,
	IonLabel,
	IonTextarea,
	IonToggle,
	IonRange,
	useIonToast,
	useIonAlert,
	RangeCustomEvent,
	TextareaCustomEvent
} from '@ionic/react';
import {
	helpCircleOutline,
	globeOutline,
	saveSharp,
	trashBinOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { PageData, SetState, StateObject, SyllableTypes, Zero_Fifty } from '../../store/types';
import { setSyllables, setSyllableBoxDropoff, setMultipleSyllableTypes, clearSyllables } from '../../store/wgSlice';
import useTranslator from '../../store/translationHooks';

import useI18Memo from '../../components/useI18Memo';
import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import ModalWrap from "../../components/ModalWrap";
import { $i } from '../../components/DollarSignExports';
import Header from '../../components/Header';
import ExtraCharactersModal from '../modals/ExtraCharacters';
import { SylCard } from "./WGinfo";

const addLinebreaks = (input: string) => {
	const output: ReactElement[] = [];
	const split = input.split(/\s+/);
	output.push(<Fragment key={`${input}/-1`}>{split.shift()!}</Fragment>)
	split.forEach((bit, i) => {
		output.push(
			<br key={`${input}/br/${i}`} />,
			<Fragment key={`${input}/frag/${i}`}>{bit}</Fragment>
		);
	});
	return output;
};
const calculateRows = (input: string) => Math.min(Math.max(4, input.split(/\n/).length), 12);

interface SyllableButtonProps {
	prop: SyllableTypes
	dropoff: Zero_Fifty | null
	isEditing: SyllableTypes | null
	setIsEditing: SetState<SyllableTypes | null>
	save: string
	edit: string
}

const SyllableButton: FC<SyllableButtonProps> = (props) => {
	const { prop, dropoff, isEditing, setIsEditing, save, edit } = props;
	const dispatch = useDispatch();
	const startEdit = useCallback(() => setIsEditing(prop), [prop, setIsEditing]);
	const doSave = useCallback(() => {
		const el = $i<HTMLInputElement>("Syl-" + prop);
		const value = (el && el.value) || "";
		dispatch(setSyllables({syllables: prop, value, override: dropoff }));
		setIsEditing(null);
	}, [dispatch, dropoff, prop, setIsEditing]);
	if (isEditing === prop) {
		return (
			<IonButton
				color="success"
				fill="solid"
				onClick={doSave}
				aria-label={save}
			>
				<IonIcon icon={saveSharp} />
			</IonButton>
		);
	}
	return (
		<IonButton
			color="primary"
			fill="clear"
			disabled={!!isEditing}
			onClick={startEdit}
			aria-label={edit}
		>
			<IonIcon src="svg/edit.svg" />
		</IonButton>
	);
};

// Translations
const commons = [
	"Save", "Edit", "Delete", "Help"
];
const formals = [
	"wiSyllables",
	"mwSyllables", "wfSyllables"
];
const formal = { context: "formal" };
const translations = [
	"Syllables",
	"From0To50",
	"UseMultiSyllTypes",
	"useLabelsToMakeSyllables",
	"useSepDropoffRate",
	"wiSyllables",
	"usedToBeginWords",
	"mwSyllables",
	"usedInMiddleOfWords",
	"wfSyllables",
	"usedToEndWords",
	"syllableDropoffExplanation",
	"swSyllables",
	"dropoffRate"
];

const WGSyl: FC<PageData> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tc ] = useTranslator('common');
	const [tSave, tEdit, tDelete, tHelp] = useI18Memo(commons);
	const [
		tWiSyllFormal, tMwSyllFormal, tWfSyllFormal
	] = useI18Memo(formals, "wg", formal);
	const [
		tSyllablesTitle, tFromZeroFifty, tUseMultiSyll, tUseCharLabel,
		tUseDrop, tWiSyll, tWiSyllExpl, tMwSyll, tMwSyllExpl, tWeSyll,
		tWeSyllExpl, tSyllableDropoffExplanation, tSwSyllFormal,
		tDropoffFormal
	] = useI18Memo(translations, "wg");

	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<SyllableTypes | null>(null);
	const [swDropoff, setSwDropoff] = useState<Zero_Fifty | null>(null);
	const [wiDropoff, setWiDropoff] = useState<Zero_Fifty | null>(null);
	const [wmDropoff, setWmDropoff] = useState<Zero_Fifty | null>(null);
	const [wfDropoff, setWfDropoff] = useState<Zero_Fifty | null>(null);
	const [sw, setSw] = useState<string>("");
	const [wi, setWi] = useState<string>("");
	const [wm, setWm] = useState<string>("");
	const [wf, setWf] = useState<string>("");
	const {
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		syllableBoxDropoff,
		multipleSyllableTypes,
		syllableDropoffOverrides
	} = useSelector((state: StateObject) => state.wg);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	useEffect(() => {
		setSwDropoff(syllableDropoffOverrides.singleWord);
	}, [syllableDropoffOverrides.singleWord]);
	useEffect(() => {
		setWiDropoff(syllableDropoffOverrides.wordInitial);
	}, [syllableDropoffOverrides.wordInitial]);
	useEffect(() => {
		setWmDropoff(syllableDropoffOverrides.wordMiddle);
	}, [syllableDropoffOverrides.wordMiddle]);
	useEffect(() => {
		setWfDropoff(syllableDropoffOverrides.wordFinal);
	}, [syllableDropoffOverrides.wordFinal]);
	useEffect(() => {
		setSw(singleWord);
	}, [singleWord]);
	useEffect(() => {
		setWi(wordInitial);
	}, [wordInitial]);
	useEffect(() => {
		setWm(wordMiddle);
	}, [wordMiddle]);
	useEffect(() => {
		setWf(wordFinal);
	}, [wordFinal]);
	const toggleSeparateDropoff = useCallback((value: Zero_Fifty | null, func: SetState<Zero_Fifty | null>) => {
		func(value === null ? syllableBoxDropoff : null);
	}, [syllableBoxDropoff]);
	const firstBox = multipleSyllableTypes ? tSwSyllFormal : tSyllablesTitle;

	const [boxTitle1, boxTitle2, boxTitle3, boxTitle4] = useMemo(() => {
		return [firstBox, tWiSyllFormal, tMwSyllFormal, tWfSyllFormal].map(title => addLinebreaks(title))
	}, [firstBox, tWiSyllFormal, tMwSyllFormal, tWfSyllFormal]);

	const maybeClearEverything = useCallback(() => {
		const count = wi.length + wm.length + wf.length + sw.length;
		const handler = () => {
			dispatch(clearSyllables());
			toaster({
				message: t("syllablesDeleted", { count }),
				duration: 2500,
				color: "danger",
				position: "top",
				toast
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: t("DeleteAllSyllables"),
				message: t("delAllSyllables"),
				cssClass: "warning",
				submit: tc("confirmDel", { count }),
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, sw.length, t, tc, toast, wf.length, wi.length, wm.length]);

	const openEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const openInfo = useCallback(() => setIsOpenInfo(true), []);
	const doSyllDropoff = useCallback((e: RangeCustomEvent) => dispatch(setSyllableBoxDropoff(e.target.value as Zero_Fifty)), [dispatch]);
	const doMultiSyll = useCallback(() => dispatch(setMultipleSyllableTypes(!multipleSyllableTypes)), [dispatch, multipleSyllableTypes]);

	const doSetSw = useCallback((e: TextareaCustomEvent) => setSw(e.target.value as string), []);
	const doToggleSwDropoff = useCallback(() => toggleSeparateDropoff(swDropoff, setSwDropoff), [toggleSeparateDropoff, swDropoff]);
	const doSetSwDropoff = useCallback((e: RangeCustomEvent) => setSwDropoff(e.target.value as Zero_Fifty), []);

	const doSetWi = useCallback((e: TextareaCustomEvent) => setWi(e.target.value as string), []);
	const doToggleWiDropoff = useCallback(() => toggleSeparateDropoff(wiDropoff, setWiDropoff), [toggleSeparateDropoff, wiDropoff]);
	const doSetWiDropoff = useCallback((e: RangeCustomEvent) => setWiDropoff(e.target.value as Zero_Fifty), []);

	const doSetWm = useCallback((e: TextareaCustomEvent) => setWm(e.target.value as string), []);
	const doToggleWmDropoff = useCallback(() => toggleSeparateDropoff(wmDropoff, setWmDropoff), [toggleSeparateDropoff, wmDropoff]);
	const doSetWmDropoff = useCallback((e: RangeCustomEvent) => setWmDropoff(e.target.value as Zero_Fifty), []);

	const doSetWf = useCallback((e: TextareaCustomEvent) => setWf(e.target.value as string), []);
	const doToggleWfDropoff = useCallback(() => toggleSeparateDropoff(wfDropoff, setWfDropoff), [toggleSeparateDropoff, wfDropoff]);
	const doSetWfDropoff = useCallback((e: RangeCustomEvent) => setWfDropoff(e.target.value as Zero_Fifty), []);

	const endButtons = useMemo(() => {
		const buttons: ReactElement[] = [];
		if(singleWord || wordInitial || wordMiddle || wordFinal) {
			buttons.push(
				<IonButton key="wgSyllbutton-0" onClick={maybeClearEverything} aria-label={tDelete}>
					<IonIcon icon={trashBinOutline} />
				</IonButton>
			);
		}
		return [
			...buttons,
			<IonButton key="wgSyllbutton-1" onClick={openEx}>
				<IonIcon icon={globeOutline} />
			</IonButton>,
			<IonButton key="wgSyllbutton-2" onClick={openInfo} aria-label={tHelp}>
				<IonIcon icon={helpCircleOutline} />
			</IonButton>
		];
	}, [maybeClearEverything, openEx, openInfo, singleWord, tDelete, tHelp, wordFinal, wordInitial, wordMiddle]);

	return (
		<IonPage>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<SylCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<Header
				title={tSyllablesTitle}
				endButtons={endButtons}
			/>
			<IonContent fullscreen className="evenBackground disappearingHeaderKludgeFix">
				<IonList lines="none">
					<IonItem className="nonUnit">
						<IonLabel className="wrappableInnards belongsToBelow">
							<div><strong>{tDropoffFormal}</strong></div>
							<div className="minor ion-text-wrap">{tSyllableDropoffExplanation}</div>
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonRange
							aria-label={tFromZeroFifty}
							min={0} max={50}
							value={syllableBoxDropoff}
							pin={true}
							onIonChange={doSyllDropoff}
						>
							<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
							<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
						</IonRange>
					</IonItem>
					<IonItem className="ion-text-end">
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							justify="start"
							disabled={!!isEditing}
							checked={multipleSyllableTypes}
							onClick={doMultiSyll}
						>{tUseMultiSyll}</IonToggle>
					</IonItem>
				</IonList>
				<IonList className="syllables units" lines="none">
					<IonItem className="nonUnit">
						<div className="header">
							<div className="title">{boxTitle1}</div>
							{swDropoff !== null ?
								<div className="percentage">{swDropoff}%</div>
							:
								<></>
							}
						</div>
						<IonTextarea
							aria-label={firstBox}
							disabled={isEditing !== "singleWord"}
							className="serifChars"
							id="Syl-singleWord"
							value={sw}
							rows={calculateRows(singleWord)}
							onIonChange={doSetSw}
							inputmode="text"
							placeholder={tUseCharLabel}
						/>
						<div className="button">
							<SyllableButton
								prop="singleWord"
								dropoff={swDropoff}
								isEditing={isEditing}
								setIsEditing={setIsEditing}
								save={tSave}
								edit={tEdit}
							/>
						</div>
					</IonItem>
					<IonItem
						className={multipleSyllableTypes && isEditing === "singleWord" ? "" : "hide"}
					>
						<IonList lines="none" className="sublist">
							<IonItem className="nonUnit ion-text-end">
								<IonToggle
									enableOnOffLabels
									onClick={doToggleSwDropoff}
									labelPlacement="start"
									checked={swDropoff !== null}
								>{tUseDrop}</IonToggle>
							</IonItem>
							<IonItem
								id="singleWordDropoff"
								className={swDropoff === null ? "hide" : "nonUnit"}
							>
								<IonRange
									aria-label={tFromZeroFifty}
									min={0} max={50}
									pin={true}
									value={(swDropoff || 0)}
									onIonChange={doSetSwDropoff}
								>
									<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
									<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
								</IonRange>
							</IonItem>
						</IonList>
					</IonItem>
					<IonItem className={multipleSyllableTypes ? "nonUnit" : "hide"}>
						<div className="header">
							<div className="title">{boxTitle2}</div>
							{wiDropoff !== null ?
								<div className="percentage">{wiDropoff}%</div>
							:
								<></>
							}
						</div>
						<IonTextarea
							aria-label={tWiSyll}
							disabled={isEditing !== "wordInitial"}
							className="serifChars"
							id="Syl-wordInitial"
							value={wi}
							rows={calculateRows(wordInitial)}
							onIonChange={doSetWi}
							inputmode="text"
							placeholder={tWiSyllExpl}
						/>
						<div className="button">
							<SyllableButton
								prop="wordInitial"
								dropoff={swDropoff}
								isEditing={isEditing}
								setIsEditing={setIsEditing}
								save={tSave}
								edit={tEdit}
							/>
						</div>
					</IonItem>
					<IonItem className={isEditing === "wordInitial" ? "" : "hide"}>
						<IonList lines="none" className="sublist">
							<IonItem className="nonUnit ion-text-end">
								<IonToggle
									enableOnOffLabels
									onClick={doToggleWiDropoff}
									labelPlacement="start"
									checked={wiDropoff !== null}
								>{tUseDrop}</IonToggle>
							</IonItem>
							<IonItem
								id="wordInitialDropoff"
								className={wiDropoff === null ? "hide" : "nonUnit"}
							>
								<IonRange
									aria-label={tFromZeroFifty}
									min={0} max={50}
									pin={true}
									value={(wiDropoff || 0)}
									onIonChange={doSetWiDropoff}
								>
									<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
									<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
								</IonRange>
							</IonItem>
						</IonList>
					</IonItem>
					<IonItem className={multipleSyllableTypes ? "nonUnit" : "hide"}>
						<div className="header">
							<div className="title">{boxTitle3}</div>
							{wmDropoff !== null ?
								<div className="percentage">{wmDropoff}%</div>
							:
								<></>
							}
						</div>
						<IonTextarea
							aria-label={tMwSyll}
							disabled={isEditing !== "wordMiddle"}
							className="serifChars"
							id="Syl-wordMiddle"
							value={wm}
							rows={calculateRows(wordMiddle)}
							onIonChange={doSetWm}
							inputmode="text"
							placeholder={tMwSyllExpl}
						/>
						<div className="button">
							<SyllableButton
								prop="wordMiddle"
								dropoff={swDropoff}
								isEditing={isEditing}
								setIsEditing={setIsEditing}
								save={tSave}
								edit={tEdit}
							/>
						</div>
					</IonItem>
					<IonItem className={isEditing === "wordMiddle" ? "" : "hide"}>
						<IonList lines="none" className="sublist">
							<IonItem className="nonUnit ion-text-end">
								<IonToggle
									enableOnOffLabels
									onClick={doToggleWmDropoff}
									labelPlacement="start"
									checked={wmDropoff !== null}
								>{tUseDrop}</IonToggle>
							</IonItem>
							<IonItem
								id="wordMiddleDropoff"
								className={wmDropoff === null ? "hide" : "nonUnit"}
							>
								<IonRange
									aria-label={tFromZeroFifty}
									min={0} max={50}
									pin={true}
									value={(wmDropoff || 0)}
									onIonChange={doSetWmDropoff}
								>
									<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
									<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
								</IonRange>
							</IonItem>
						</IonList>
					</IonItem>
					<IonItem className={multipleSyllableTypes ? "nonUnit" : "hide"}>
						<div className="header">
							<div className="title">{boxTitle4}</div>
							{wfDropoff !== null ?
								<div className="percentage">{wfDropoff}%</div>
							:
								<></>
							}
						</div>
						<IonTextarea
							aria-label={tWeSyll}
							disabled={isEditing !== "wordFinal"}
							className="serifChars"
							id="Syl-wordFinal"
							value={wf}
							rows={calculateRows(wordFinal)}
							onIonChange={doSetWf}
							inputmode="text"
							placeholder={tWeSyllExpl}
						/>
						<div className="button">
							<SyllableButton
								prop="wordFinal"
								dropoff={swDropoff}
								isEditing={isEditing}
								setIsEditing={setIsEditing}
								save={tSave}
								edit={tEdit}
							/>
						</div>
					</IonItem>
					<IonItem className={isEditing === "wordFinal" ? "" : "hide"}>
						<IonList lines="none" className="sublist">
							<IonItem className="nonUnit ion-text-end">
								<IonToggle
									enableOnOffLabels
									onClick={doToggleWfDropoff}
									labelPlacement="start"
									checked={wfDropoff !== null}
								>{tUseDrop}</IonToggle>
							</IonItem>
							<IonItem
								id="wordFinalDropoff"
								className={wfDropoff === null ? "hide" : "nonUnit"}
							>
								<IonRange
									aria-label={tFromZeroFifty}
									min={0} max={50}
									pin={true}
									value={(wfDropoff || 0)}
									onIonChange={doSetWfDropoff}
								>
									<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
									<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
								</IonRange>
							</IonItem>
						</IonList>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default WGSyl;
