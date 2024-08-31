import React, { useCallback, useState, FC } from 'react';
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonMenuButton,
	IonButtons,
	IonTitle,
	IonList,
	IonItem,
	IonRange,
	IonLabel,
	IonItemDivider,
	IonIcon,
	IonToggle,
	IonInput,
	IonButton,
	IonLoading,
	RangeCustomEvent,
	InputCustomEvent
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";
import {
	helpCircleOutline,
	globeOutline
} from 'ionicons/icons';

import {
	Zero_OneHundred,
	Two_Fifteen,
	Zero_Fifty,
	PageData,
	StateObject
} from '../../store/types';
import {
	setMonosyllablesRate,
	setMaxSyllablesPerWord,
	setCharacterGroupDropoff,
	setSyllableBoxDropoff,
	setCapitalizeSentences,
	setDeclarativeSentencePre,
	setDeclarativeSentencePost,
	setInterrogativeSentencePre,
	setInterrogativeSentencePost,
	setExclamatorySentencePre,
	setExclamatorySentencePost
} from '../../store/wgSlice';

import { CustomStorageWG } from '../../components/PersistentInfo';
import ModalWrap from "../../components/ModalWrap";
import useI18Memo from '../../components/useI18Memo';
import log from '../../components/Logging';

import ExtraCharactersModal from '../modals/ExtraCharacters';
import MaybeLoadPreset from './modals/MaybeLoadPreset';
import ManageCustomInfo from './modals/CustomInfo';
import { OptCard } from "./WGinfo";

// TO-DO: Introduce other sentence types? Adjust ratios?
// [pre] sentence label [post] weight: [number]
//   []  declarative     [.]   weight: [9]
//   []  interrogative   [?]   weight: [2]
//   []  exclamatory     [!]   weight: [1]

const commons = [ "Help", "LoadPreset", "PleaseWait", "Settings" ];
const translations =  [
	"Always", "CapSentences", "CharGroupRunDropoff",
	"From0To50", "From0To100", "From2To15",
	"MaxSyllPerWord", "Never", "PresetsStoredInfo",
	"PseudoTextControls", "RateOfMonos",
	"SaveLoadCustomInfo", "SyllableBoxDropoff", "WordGenControls"
];
const sentences = [ "sentenceBeginning", "sentenceEnding" ];
const declarative = { context: "declarative" };
const interrogative = { context: "interrogative" };
const exclamatory = { context: "exclamatory" };

const WGSet: FC<PageData> = (props) => {
	const [ tHelp, tLoad, tWait, tSettings ] = useI18Memo(commons);
	const [
		tAlways, tCap, tCGRD, tF050, tF0100, tF215, tMax, tNever, tPresets,
		tPseudo, tRate, tSaveLoad, tSyllDrop, tWordGenCon
	] = useI18Memo(translations, 'wg');
	const [ tDeclarStart, tDeclarEnd ] = useI18Memo(sentences, 'wg', declarative);
	const [ tInterStart, tInterEnd ] = useI18Memo(sentences, 'wg', interrogative);
	const [ tExclStart, tExclEnd ] = useI18Memo(sentences, 'wg', exclamatory);
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [loadingOpen, setLoadingOpen] = useState<boolean>(false);
	const [isOpenLoadPreset, setIsOpenLoadPreset] = useState<boolean>(false);
	const [isOpenManageCustom, setIsOpenManageCustom] = useState<boolean>(false);
	const [infoModalTitles, setInfoModalTitles] = useState<string[] | null>(null);
	const { modalPropsMaker } = props;
	const {
		monosyllablesRate,
		maxSyllablesPerWord,
		characterGroupDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost
	} = useSelector((state: StateObject) => state.wg);
	const openCustomInfoModal = useCallback(() => {
		const titles: string[] = [];
		CustomStorageWG.iterate((value: unknown, title: string) => {
			titles.push(title);
			return; // Blank return keeps the loop going
		}).then(() => {
			setInfoModalTitles(titles);
			setLoadingOpen(false);
			setIsOpenManageCustom(true);
		}).catch((err: any) => {
			log(dispatch, ["WG Custom Info Modal", err]);
		});
		setLoadingOpen(true);
	}, [dispatch]);
	const openEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const openInfo = useCallback(() => setIsOpenInfo(true), []);
	const closeLoader = useCallback(() => setLoadingOpen(false), []);
	const openLoader = useCallback(() => setIsOpenLoadPreset(true), []);
	const doSetMonosyllablesRate = useCallback((e: RangeCustomEvent) => dispatch(setMonosyllablesRate(e.target.value as Zero_OneHundred)), [dispatch]);
	const doSetMaxSyllablesPerWord = useCallback((e: RangeCustomEvent) => dispatch(setMaxSyllablesPerWord(e.target.value as Two_Fifteen)), [dispatch]);
	const doSetCharacterGroupDropoff = useCallback((e: RangeCustomEvent) => dispatch(setCharacterGroupDropoff(e.target.value as Zero_Fifty)), [dispatch]);
	const doSetSyllableBoxDropoff = useCallback((e: RangeCustomEvent) => dispatch(setSyllableBoxDropoff(e.target.value as Zero_Fifty)), [dispatch]);
	const doSetDeclarativeSentencePre = useCallback((e: InputCustomEvent) => dispatch(setDeclarativeSentencePre(e.target.value as string)), [dispatch]);
	const doSetDeclarativeSentencePost = useCallback((e: InputCustomEvent) => dispatch(setDeclarativeSentencePost(e.target.value as string)), [dispatch]);
	const doSetInterrogativeSentencePre = useCallback((e: InputCustomEvent) => dispatch(setInterrogativeSentencePre(e.target.value as string)), [dispatch]);
	const doSetInterrogativeSentencePost = useCallback((e: InputCustomEvent) => dispatch(setInterrogativeSentencePost(e.target.value as string)), [dispatch]);
	const doSetExclamatorySentencePre = useCallback((e: InputCustomEvent) => dispatch(setExclamatorySentencePre(e.target.value as string)), [dispatch]);
	const doSetExclamatorySentencePost = useCallback((e: InputCustomEvent) => dispatch(setExclamatorySentencePost(e.target.value as string)), [dispatch]);
	return (
		<IonPage>
			<MaybeLoadPreset {...modalPropsMaker(isOpenLoadPreset, setIsOpenLoadPreset)} />
			<ManageCustomInfo
				{...modalPropsMaker(isOpenManageCustom, setIsOpenManageCustom)}
				openECM={setIsOpenECM}
				titles={infoModalTitles}
				setTitles={setInfoModalTitles}
			/>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<OptCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<IonLoading
				cssClass='loadingPage'
				isOpen={loadingOpen}
				onDidDismiss={closeLoader}
				message={tWait}
				spinner="bubbles"
				/*duration={300000}*/
				duration={1000}
			/>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{tSettings}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openEx}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={openInfo} aria-label={tHelp}>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonList className="hasSpecialLabels" lines="full">
					<IonItemDivider>{tPresets}</IonItemDivider>
					<IonItem lines="none" id="presetsSection">
						<div>
							<IonButton
								onClick={openLoader}
								strong={true}
								color="secondary"
								shape="round"
							>{tLoad}</IonButton>
							<IonButton
								onClick={openCustomInfoModal}
								strong={true}
								color="tertiary"
								shape="round"
							>{tSaveLoad}</IonButton>
						</div>
					</IonItem>
					<IonItemDivider>{tWordGenCon}</IonItemDivider>
					<IonItem className="labelled">
						<IonLabel>{tRate}</IonLabel>
					</IonItem>
					<IonItem>
						<IonRange
							aria-label={tF0100}
							debounce={250}
							min={0}
							max={100}
							value={monosyllablesRate}
							pin={true}
							onIonChange={doSetMonosyllablesRate}
						>
							<div slot="start">{tNever}</div>
							<div slot="end">{tAlways}</div>
						</IonRange>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel>{tMax}</IonLabel>
					</IonItem>
					<IonItem>
						<IonRange
							aria-label={tF215}
							debounce={250}
							min={2}
							max={15}
							value={maxSyllablesPerWord}
							pin={true}
							snaps={true}
							ticks={true}
							step={1}
							onIonChange={doSetMaxSyllablesPerWord}
						>
							<div slot="start">2</div>
							<div slot="end">15</div>
						</IonRange>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tCGRD}</IonLabel>
					</IonItem>
					<IonItem>
						<IonRange
							aria-label={tF050}
							debounce={250}
							min={0}
							max={50}
							value={characterGroupDropoff}
							pin={true}
							onIonChange={doSetCharacterGroupDropoff}
						>
							<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
							<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
						</IonRange>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tSyllDrop}</IonLabel>
					</IonItem>
					<IonItem>
						<IonRange
							aria-label={tF050}
							debounce={250}
							min={0}
							max={50}
							value={syllableBoxDropoff}
							pin={true}
							onIonChange={doSetSyllableBoxDropoff}
						>
							<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
							<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
						</IonRange>
					</IonItem>
					<IonItemDivider>{tPseudo}</IonItemDivider>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={capitalizeSentences}
							onIonChange={e => dispatch(setCapitalizeSentences(e.detail.checked))}
						>{tCap}</IonToggle>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tDeclarStart}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tDeclarStart}
							inputmode="text"
							maxlength={5}
							minlength={0}
							size={3}
							value={declarativeSentencePre}
							onIonChange={doSetDeclarativeSentencePre}
						/>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tDeclarEnd}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tDeclarEnd}
							inputmode="text"
							maxlength={5}
							minlength={0}
							size={3}
							value={declarativeSentencePost}
							onIonChange={doSetDeclarativeSentencePost}
						/>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tInterStart}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tInterStart}
							inputmode="text"
							maxlength={5}
							minlength={0}
							size={3}
							value={interrogativeSentencePre}
							onIonChange={doSetInterrogativeSentencePre}
						/>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tInterEnd}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tInterEnd}
							inputmode="text"
							maxlength={5}
							minlength={0}
							size={3}
							value={interrogativeSentencePost}
							onIonChange={doSetInterrogativeSentencePost}
						/>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tExclStart}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tExclStart}
							inputmode="text"
							maxlength={5}
							minlength={0}
							size={3}
							value={exclamatorySentencePre}
							onIonChange={doSetExclamatorySentencePre}
						/>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-padding-bottom">{tExclEnd}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tExclEnd}
							inputmode="text"
							maxlength={5}
							minlength={0}
							size={3}
							value={exclamatorySentencePost}
							onIonChange={doSetExclamatorySentencePost}
						/>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default WGSet;
