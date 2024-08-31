import React, { useCallback, FC } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonFooter,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	addCircleOutline,
	checkmarkCircleOutline,
	removeCircleOutline,
	trashOutline,
	saveOutline,
	codeDownloadOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { loadStateLex, updateLexiconNumber, updateLexiconText } from '../../store/lexiconSlice';
import { Lexicon, LexiconState, ModalProperties, SetBooleanState, SetState, StateObject } from '../../store/types';
import blankAppState from '../../store/blankAppState';
import useTranslator from '../../store/translationHooks';

import { LexiconStorage } from '../../components/PersistentInfo';
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import useI18Memo from '../../components/useI18Memo';

// load, delete, export
interface StorageModalProps extends ModalProperties {
	openLoad: SetBooleanState,
	openDelete: SetBooleanState,
	openExport: SetBooleanState,
	setLoading: SetBooleanState,
	setLexInfo: SetState<[string, LexiconState][]>
}

const translations = [
	"LexiconStorage", "LexCleared",
	"NothingToClear", "LexSavedAsNew",
	"needWordsMsg",
	"needLexiconTitleMsg",
	"needTitleMsg", "deleteEverythingMessage",
	"ClearLexicon", "DeleteStoredLexicon",
	"ExportLex", "LoadLexicon", "SaveLexicon",
	"LexiconSaved"
]

const commons = [ "DeleteEverythingQ", "Done", "Ok", "SaveAsNew", "error" ];


const LexiconStorageModal: FC<StorageModalProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tDelEverything, tDone, tOk, tSaveNew, tError
	] = useI18Memo(commons);
	const [
		tLexStor, tLexClear, tNoClear, tLexNew,
		tNoWords, tNoTitleEx, tNoTitle, tDelAll,
		tClearLex, tDelThing, tExThing, tLoadThing,
		tSaveThing, tThingSaved
	] = useI18Memo(translations, "lexicon");

	const {
		isOpen,
		setIsOpen,
		openLoad,
		openDelete,
		openExport,
		setLoading,
		setLexInfo
	} = props;
	const dispatch = useDispatch();
	const [disableConfirms, stateLexicon]: [boolean, LexiconState] = useSelector(
		(state: StateObject) => [state.appSettings.disableConfirms, state.lexicon]
	);
	const {
		id,
		title,
		description,
		lexicon
	} = stateLexicon;
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const clearLexicon = useCallback(() => {
		const handler = () => {
			const newLex: LexiconState = {
				...blankAppState.lexicon
			};
			dispatch(loadStateLex(newLex));
			setIsOpen(false);
			toaster({
				message: tLexClear,
				duration: 4000,
				toast
			});
		};
		if(!(title || id || description || lexicon.length > 0)) {
			toaster({
				message: tNoClear,
				color: "danger",
				duration: 3000,
				position: "top",
				toast
			});
		} else if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tDelEverything,
				cssClass: "danger",
				message: tDelAll,
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [
		description, disableConfirms, dispatch, doAlert, id, lexicon.length,
		setIsOpen, tc, tDelAll, tDelEverything, tLexClear, tNoClear,
		title, toast
	]);
	const openLexiconModal = useCallback((whichToOpen: SetBooleanState) => {
		const info: [string, LexiconState][] = [];
		setLoading(true);
		LexiconStorage.iterate((value: LexiconState, key: string) => {
			info.push([key, value]);
			return; // Blank return keeps the loop going
		}).then(() => {
			info.length > 0 && setLexInfo(info);
			setLoading(false);
			setIsOpen(false);
			whichToOpen(true);
		});
	}, [setIsOpen, setLexInfo, setLoading]);
	const lexiconSaveError = useCallback(() => {
		doAlert({
			header: tError,
			message: tNoTitle,
			cssClass: "danger",
			buttons: [
				{
					text: tOk,
					role: "cancel",
					cssClass: "cancel"
				}
			]
		});
	}, [doAlert, tError, tNoTitle, tOk]);
	const saveLexicon = useCallback((
		announce: string = tThingSaved,
		saveKey: string = id,
		overwrite: boolean = true
	) => {
		// Save original key
		const firstKey = saveKey;
		// Save 'now'
		const now = Date.now();
		if(!title) {
			return lexiconSaveError();
		} else if(!saveKey) {
			saveKey = uuidv4();
			dispatch(updateLexiconText(["id", saveKey]));
		}
		// Dispatch to state
		dispatch(updateLexiconNumber(["lastSave", now]));
		setLoading(true);
		// These dispatches will NOT be ready by the time Storage loads and saves
		//  so we will need to do some creative variable work
		const lex: LexiconState = {...stateLexicon};
		// Use possibly-new key
		lex.id = saveKey;
		// Use 'now'
		lex.lastSave = now;
		// Deep copy lex.lexicon
		lex.lexicon = lexicon.map((lx: Lexicon) => {
			const { id, columns } = lx;
			return {
				id,
				columns: [...columns]
			};
		});
		// Deep copy column info
		lex.sortPattern = [...lex.sortPattern];
		lex.columns = lex.columns.map(lx => ({...lx}));
		LexiconStorage.setItem(saveKey, lex).then(
			() => {
				// If we're overwriting, and it's a new key, delete the old one
				if(overwrite && saveKey !== firstKey) {
					LexiconStorage.removeItem(firstKey);
				}
				setLoading(false);
				setIsOpen(false);
				toaster({
					message: announce,
					duration: 2500,
					toast
				});
			}
		);
	}, [dispatch, id, lexicon, lexiconSaveError, setIsOpen, setLoading, stateLexicon, tThingSaved, title, toast]);
	const saveLexiconNew = useCallback(() => {
		if(!title) {
			return lexiconSaveError();
		}
		const newKey = uuidv4();
		dispatch(updateLexiconText(["id", newKey]));
		saveLexicon(tLexNew, newKey, false);
	}, [dispatch, lexiconSaveError, saveLexicon, tLexNew, title]);
	const maybeExportLexicon = useCallback(() => {
		if(!title) {
			return doAlert({
				header: tError,
				message: tNoTitleEx,
				cssClass: "warning",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
		} else if (lexicon.length < 1) {
			return doAlert({
				header: tError,
				message: tNoWords,
				cssClass: "warning",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
		}
		setIsOpen(false);
		openExport(true);
	}, [doAlert, lexicon.length, openExport, setIsOpen, tError, tNoTitleEx, tNoWords, tOk, title]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const openLoadModal = useCallback(() => openLexiconModal(openLoad), [openLexiconModal, openLoad]);
	const openDeleteModal = useCallback(() => openLexiconModal(openDelete), [openLexiconModal, openDelete]);
	const saveBasic = useCallback(() => saveLexicon(), [saveLexicon]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tLexStor}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="none">
					<IonItem button={true} onClick={clearLexicon}>
						<IonIcon icon={removeCircleOutline} className="ion-padding-end" />
						<IonLabel>{tClearLex}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={openLoadModal}>
						<IonIcon icon={addCircleOutline} className="ion-padding-end" />
						<IonLabel>{tLoadThing}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={saveBasic}>
						<IonIcon icon={saveOutline} className="ion-padding-end" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={saveLexiconNew}>
						<IonIcon icon={saveOutline} className="ion-padding-end" />
						<IonLabel>{tSaveNew}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={maybeExportLexicon}>
						<IonIcon icon={codeDownloadOutline} className="ion-padding-end" />
						<IonLabel>{tExThing}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={openDeleteModal}>
						<IonIcon icon={trashOutline} className="ion-padding-end" />
						<IonLabel>{tDelThing}</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar className="ion-text-wrap">
					<IonButtons slot="end">
						<IonButton
							onClick={closer}
							slot="end"
							fill="solid"
							color="success"
						>
							<IonIcon icon={checkmarkCircleOutline} slot="start" />
							<IonLabel>{tDone}</IonLabel>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default LexiconStorageModal;
