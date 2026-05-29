import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonLabel,
	IonNote,
	IonList,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { useSelector } from "react-redux";

import { LexiconState, ModalProperties, SetBooleanState, SetState, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import { LexiconStorage } from '../../components/PersistentInfo';
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import useI18Memo from '../../components/useI18Memo';
import Modal from '../../components/Modal';

interface SavedLexProperties extends ModalProperties {
	lexInfo: [string, LexiconState][]
	setLexInfo: SetState<[string, LexiconState][]>
	setLoadingScreen: SetBooleanState
}

const commons = [
	"deleteThisCannotUndo"
];
const lexicons = [
	"NoSavedLexicons", "DeleteStoredLexicon", "LexiconDeleted"
];

const DeleteLexiconModal: FC<SavedLexProperties> = (props) => {
	const [ t ] = useTranslator('lexicon');
	const [ tc ] = useTranslator('common');
	const [tNoSaved, tDeleteLexicon, tLexiconDeleted] = useI18Memo(lexicons, 'lexicon');
	const [ tYouSure ] = useI18Memo(commons);

	const { isOpen, setIsOpen, lexInfo, setLexInfo, setLoadingScreen } = props;
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const data = useMemo(() => (lexInfo && lexInfo.length > 0) ? lexInfo : [], [lexInfo]);
	const doClose = useCallback(() => {
		setLexInfo([]);
		setIsOpen(false);
	}, [setIsOpen, setLexInfo]);
	const deleteThis = useCallback((key: string, title: string) => {
		const handler = () => {
			setLoadingScreen(true);
			LexiconStorage.removeItem(key).then(() => {
				setLoadingScreen(false);
				setLexInfo([]);
				setIsOpen(false);
				toaster({
					message: tLexiconDeleted,
					duration: 2500,
					toast
				});
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tc("deleteTitleQ", { title }),
				cssClass: "danger",
				message: tYouSure,
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [
		disableConfirms, doAlert, setIsOpen, setLexInfo,
		setLoadingScreen, tYouSure, tc, toast, tLexiconDeleted
	]);
	const listOfLexicons = useMemo(() => data.map((pair: [string, LexiconState]) => {
		const key = pair[0];
		const lex = pair[1];
		const time = new Date(lex.lastSave);
		return (
			<IonItem
				key={key}
				button={true}
				onClick={() => deleteThis(key, lex.title)}
			>
				<IonLabel
					className="ion-text-wrap"
				>
					{t("storedLexItems", { count: lex.lexicon.length, title: lex.title })}
				</IonLabel>
				<IonNote
					className="ion-text-wrap ital"
					slot="end"
				>{tc("SavedAt", { time: time.toLocaleString() })}</IonNote>
			</IonItem>
		);
	}), [data, deleteThis, t, tc]);
	return (
		<Modal
			title={tDeleteLexicon}
			closeFunc={doClose}
			isOpen={isOpen}
			bottomEnd={[{button: "cancel"}]}
			extraChars
			footerToolbarClass={data.length > 0 ? "" : "hide"}
		>
			<IonList lines="none" className="buttonFilled">
				{data.length > 0 ? listOfLexicons : <h1>{tNoSaved}</h1> }
			</IonList>
		</Modal>
	);
};

export default DeleteLexiconModal;
