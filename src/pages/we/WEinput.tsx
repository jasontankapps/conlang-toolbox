import React, { useState, useCallback, ChangeEventHandler, FC } from 'react';
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

import { PageData, StateObject } from '../../store/types';
import { setInputWE } from '../../store/weSlice';

import ModalWrap from "../../components/ModalWrap";
import { $i } from '../../components/DollarSignExports';
import debounce from '../../components/Debounce';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
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

const WEInput: FC<PageData> = (props) => {
	const [ tWordsToEvolve, tOnePerLine, tClearInput ] = useI18Memo(translations, "we");
	const [ tYouSure, tClear, tExChar, tHelp, tInput, tYesClear, tImpFromLex ] = useI18Memo(commons);

	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenLexImport, setIsOpenLexImport] = useState<boolean>(false);
	const [doAlert] = useIonAlert();
	const { lexicon } = useSelector((state: StateObject) => state.lexicon);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const { input } = useSelector((state: StateObject) => state.we);
	const updateInput = useCallback((value: string) => {
		const trimmed = value.replace(/(?:\s*\r?\n\s*)+/g, "\n").trim();
		dispatch(setInputWE(trimmed));
	}, [dispatch]);
	const inputUpdated: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		let value: string;
		if(e.target && e.target.value !== undefined) {
			value = (e.target.value);
		} else {
			const el = $i<HTMLInputElement>("weInput");
			value = el ? el.value : "";
		}
		debounce<(x: string) => void, string>(updateInput, [value], 500, "WEinput");
	}, [updateInput]);
	const acceptImport = useCallback((value: string) => {
		const el = $i<HTMLInputElement>("weInput");
		el && (el.value = value);
		updateInput(value);
	}, [updateInput]);
	const clearInput = useCallback(() => {
		const handler = () => {
			const el = $i<HTMLInputElement>("weInput");
			el && (el.value = "");
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
	}, [disableConfirms, doAlert, tClearInput, tYesClear, tYouSure, updateInput]);

	const openExChar = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const openInfo = useCallback(() => setIsOpenInfo(true), [setIsOpenInfo]);
	const openLexImport = useCallback(() => setIsOpenLexImport(true), []);
	return (
		<IonPage>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<InpCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<LexiconImporterModal
				{...modalPropsMaker(isOpenLexImport, setIsOpenLexImport)}
				openECM={setIsOpenECM}
				currentInput={input}
				importFunc={acceptImport}
			/>
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
