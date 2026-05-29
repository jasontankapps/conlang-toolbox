import React, { useState, useCallback, ChangeEventHandler, FC, useMemo, useContext } from 'react';
import {
	IonContent,
	IonPage,
	IonToolbar,
	IonButtons,
	IonButton,
	IonIcon,
	useIonAlert
} from '@ionic/react';
import {
	enterOutline,
	trashBinOutline,
	globeOutline,
	helpCircleOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { StateObject } from '../../store/types';
import { setInput } from '../../store/declenjugatorSlice';

import debounce from '../../components/Debounce';
import yesNoAlert from '../../components/yesNoAlert';
import ModalWrap from '../../components/ModalWrap';
import { ExCharContext, ModalMakingContext } from '../../components/contexts';
import useI18Memo from '../../components/useI18Memo';
import Header from '../../components/Header';
import useElement from '../../components/useElement';

import ExtraCharactersModal from '../modals/ExtraCharacters';
import LexiconImporterModal from '../modals/ImportFromLexicon';
import { InputCard } from './DJinfo';

const translations = [ "EnterWordsOnePerLine", "WordsToGiveDJ" ];

const commons = [
	"Clear", "ExtraChars", "Help", "Input", "YesClear",
	"MaybeClearEntireInput", "ImportFromLexicon"
];

const DJInput: FC = () => {
	const [ tClear, tExChar, tHelp, tInput, tYes, tYouSure, tImportFrom ] = useI18Memo(commons);
	const [ tEnterHere, tWords ] = useI18Memo(translations, "dj");

	const modalPropsMaker = useContext(ModalMakingContext);
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenLexImport, setIsOpenLexImport] = useState<boolean>(false);
	const [doAlert] = useIonAlert();
	const { input } = useSelector((state: StateObject) => state.dj);
	const { lexicon } = useSelector((state: StateObject) => state.lexicon);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [djInput, djInputRef] = useElement<HTMLTextAreaElement>();

	const updateInput = useCallback((value: string) => {
		const trimmed = value.replace(/(?:\s*\r?\n\s*)+/g, "\n").trim();
		dispatch(setInput(trimmed));
	}, [dispatch]);
	const inputUpdated: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		let value: string;
		if(e.target && e.target.value) {
			value = String(e.target.value);
		} else {
			value = djInput ? djInput.value! : "";
		}
		debounce<(x: string) => void, string>(updateInput, [value], 500, "DJInput");
	}, [updateInput, djInput]);
	const acceptImport = useCallback((value: string) => {
		if(djInput) { djInput.value = value; }
		updateInput(value);
	}, [updateInput, djInput]);
	const clearInput = useCallback(() => {
		const handler = () => {
			if(djInput) { djInput.value = ""; }
			updateInput("");
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tClear,
				message: tYouSure,
				cssClass: "danger",
				submit: tYes,
				handler,
				doAlert
			});
		}
	}, [disableConfirms, doAlert, updateInput, tClear, tYes, tYouSure, djInput]);
	const openLex = useCallback(() => setIsOpenLexImport(true), []);
	const openEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const endButtons = useMemo(() => [
		<IonButton key="dj-endbutton1" onClick={() => setIsOpenECM(true)} aria-label={tExChar}>
			<IonIcon icon={globeOutline} />
		</IonButton>,
		<IonButton key="dj-endbutton2" onClick={() => setIsOpenInfo(true)} aria-label={tHelp}>
			<IonIcon icon={helpCircleOutline} />
		</IonButton>
	], [tExChar, tHelp]);
	return (
		<IonPage>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<InputCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<ExCharContext value={openEx}>
				<LexiconImporterModal
					{...modalPropsMaker(isOpenLexImport, setIsOpenLexImport)}
					currentInput={input}
					importFunc={acceptImport}
				/>
			</ExCharContext>
			<Header
				title={tInput}
				endButtons={endButtons}
			/>
			<IonContent fullscreen className="evenBackground">
				<div className="hasMaxTextArea">
					<textarea
						spellCheck={false}
						aria-label={tWords}
						id="djInput"
						ref={djInputRef}
						placeholder={tEnterHere}
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
							onClick={openLex}
							disabled={lexicon.length === 0}
							color="primary"
							fill="solid"
							shape="round"
						><IonIcon icon={enterOutline} slot="start" /> {tImportFrom}</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonContent>
		</IonPage>
	);
};

export default DJInput;
