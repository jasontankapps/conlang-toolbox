import React, { useState, useCallback, FC, useContext } from 'react';
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
	useIonAlert
} from '@ionic/react';
import {
	helpCircleOutline,
	enterOutline,
	trashBinOutline,
	globeOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { StateObject } from '../../store/types';
import { setInputWE } from '../../store/weSlice';

import ModalWrap from "../../components/ModalWrap";
import { ExCharContext, ModalMakingContext } from '../../components/contexts';
import debounce from '../../components/Debounce';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import ExtraCharactersModal from '../modals/ExtraCharacters';
import LexiconImporterModal from '../modals/ImportFromLexicon';
import { InpCard } from "./WEinfo";

const commons = [
	"MaybeClearEntireInput",
	"Clear", "ExtraChars", "Help",
	"Input", "YesClear", "ImportFromLexicon"
];

const translations = [
	"WordsToEvolve", "EnterWordsHere", "ClearInput"
];

const WEInput: FC = () => {
	const [ tWordsToEvolve, tOnePerLine, tClearInput ] = useI18Memo(translations, "we");
	const [ tYouSure, tClear, tExChar, tHelp, tInput, tYesClear, tImpFromLex ] = useI18Memo(commons);

	const modalPropsMaker = useContext(ModalMakingContext);
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenLexImport, setIsOpenLexImport] = useState<boolean>(false);
	const [doAlert] = useIonAlert();
	const { lexicon } = useSelector((state: StateObject) => state.lexicon);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const { input } = useSelector((state: StateObject) => state.we);
	const [weInput, weInputRef] = useElement<HTMLTextAreaElement>();
	const updateInput = useCallback((value: string) => {
		const trimmed = value.replace(/(?:\s*\r?\n\s*)+/g, "\n").trim();
		dispatch(setInputWE(trimmed));
	}, [dispatch]);
	const inputUpdated = useCallback(() => {
		const value = (weInput ? weInput.value : "").replace(/(?:\s*\r?\n\s*)+/g, "\n").trim();
		debounce<(x: string) => void, string>(updateInput, [value], 100, "WEinput");
	}, [updateInput, weInput]);
	const acceptImport = useCallback((value: string) => {
		weInput && (weInput.value = value);
		updateInput(value);
	}, [updateInput, weInput]);
	const clearInput = useCallback(() => {
		const handler = () => {
			weInput && (weInput.value = "");
			updateInput("");
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tClearInput,
				message: tYouSure,
				cssClass: "danger",
				submit: tYesClear,
				handler,
				doAlert
			});
		}
	}, [disableConfirms, doAlert, tClearInput, tYesClear, tYouSure, updateInput, weInput]);

	const openExChar = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const openInfo = useCallback(() => setIsOpenInfo(true), [setIsOpenInfo]);
	const openLexImport = useCallback(() => setIsOpenLexImport(true), []);
	const doOpenEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	return (
		<IonPage>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<InpCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<ExCharContext value={doOpenEx}>
				<LexiconImporterModal
					{...modalPropsMaker(isOpenLexImport, setIsOpenLexImport)}
					currentInput={input}
					importFunc={acceptImport}
				/>
			</ExCharContext>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{tInput}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openExChar} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={openInfo} aria-label={tHelp}>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="evenBackground">
				<div className="hasMaxTextArea">
					<textarea
						spellCheck={false}
						aria-label={tWordsToEvolve}
						id="weInput"
						placeholder={tOnePerLine}
						defaultValue={input}
						onChange={inputUpdated}
						ref={weInputRef}
					/>
				</div>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton
							onClick={clearInput}
							disabled={!input}
							color="warning"
							fill="solid"
							shape="round"
						><IonIcon icon={trashBinOutline} slot="start" /> {tClear}</IonButton>
					</IonButtons>
					<IonButtons slot="end">
						<IonButton
							onClick={openLexImport}
							disabled={lexicon.length === 0}
							color="primary"
							fill="solid"
							shape="round"
						><IonIcon icon={enterOutline} slot="start" /> {tImpFromLex}</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonContent>
		</IonPage>
	);
};

export default WEInput;
