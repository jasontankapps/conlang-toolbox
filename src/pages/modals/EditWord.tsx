import React, { FC, useCallback, useMemo, useState } from 'react';
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
	IonInput,
	IonFooter,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	closeCircleOutline,
	saveOutline,
	trashOutline,
	globeOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { deleteLexiconItem, doEditLexiconItem } from '../../store/lexiconSlice';
import { ExtraCharactersModalOpener, Lexicon, LexiconColumn, SorterFunc, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import { $i } from '../../components/DollarSignExports';
import useI18Memo from '../../components/useI18Memo';

interface LexItemProps extends ExtraCharactersModalOpener {
	itemToEdit: Lexicon | null
	columnInfo: LexiconColumn[]
	sorter: SorterFunc
}

function garble () {
	const e = Math.floor(Math.random() * 10) + 15;
	let output = "";
	for (let x = 0; x < e; x++) {
		output += "qwrtpsdfghjklzxcvbnm!"[Math.floor(Math.random() * 20)];
	}
	return output;
};
const nonsense = garble();

const translations = [
	"ExitWOSave",
	"exitWithoutSavingMsg",
	"noInfoProvided", "EditLexiconItem",
	"DeleteItem", "SaveItem", "ItemDeleted",
	"ItemSaved"
];

const commons = [
	"deleteThisCannotUndo", "Close", "error",
	"ExtraChars", "Ok", "areYouSure"
];

const EditLexiconItemModal: FC<LexItemProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tExit, tUnsavedChanges, tNoInfo, tEditLexicon,
		tDelThing, tSaveThing, tThingDel, tThingSaved
	] = useI18Memo(translations, "lexicon");
	const [ tYouSure, tClose, tError, tExChar, tOk, tRUSure ] = useI18Memo(commons);

	const { isOpen, setIsOpen, openECM, itemToEdit, columnInfo, sorter } = props;
	const dispatch = useDispatch();
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [ id, setId ] = useState<string>("");
	const [ cols, setCols ] = useState<string[]>([]);
	const [ originalString, setOriginalString ] = useState<string>("");
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const onLoad = useCallback(() => {
		const id = (itemToEdit ? itemToEdit.id : "");
		const cols = (itemToEdit ? [...itemToEdit.columns] : []);
		cols.forEach((col: string, i: number) => {
			const el = $i<HTMLInputElement>(`edit_lex_input_${id}_${i}`);
			el && (el.value = col);
		});
		setOriginalString(cols.join(nonsense));
		setId(id);
		setCols(cols);
	}, [itemToEdit]);
	const currentInfo = useCallback(() => {
		const cols = (itemToEdit ? [...itemToEdit.columns] : []);
		return cols.map((col: string, i: number) => {
			const el = $i<HTMLInputElement>(`edit_lex_input_${id}_${i}`);
			return el ? el.value.trim() : "";
		});
	}, [id, itemToEdit]);
	const cancelEditing = useCallback(() => {
		// If we're "open" and being closed by some other means, check and see if
		//   1) we have disabled confirms
		//   2) we haven't changed anything
		// and exit silently if both are true
		if(disableConfirms || currentInfo().join(nonsense) === originalString) {
			setIsOpen(false);
			return;
		}
		// Otherwise, doublecheck
		yesNoAlert({
			header: tExit,
			cssClass: "warning",
			message: tUnsavedChanges,
			submit: tClose,
			handler: () => setIsOpen(false),
			doAlert
		});
	}, [currentInfo, disableConfirms, doAlert, originalString, setIsOpen, tExit, tUnsavedChanges, tClose]);
	const maybeSaveNewInfo = useCallback(() => {
		const cols = currentInfo();
		if(cols.join("") === "") {
			doAlert({
				header: tError,
				message: tNoInfo,
				cssClass: "danger",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
			return;
		}
		// Everything ok!
		setIsOpen(false);
		dispatch(doEditLexiconItem([{id, columns: cols}, sorter]));
		toaster({
			message: tThingSaved,
			color: "success",
			duration: 2500,
			toast
		})
	}, [currentInfo, dispatch, doAlert, id, setIsOpen, sorter, tError, tNoInfo, tOk, tThingSaved, toast]);
	const delFromLex = useCallback(() => {
		const handler = () => {
			setIsOpen(false);
			dispatch(deleteLexiconItem(id));
			toaster({
				message: tThingDel,
				duration: 2500,
				color: "danger",
				toast
			})
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tRUSure,
				cssClass: "danger",
				message: tYouSure,
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, id, setIsOpen, tc, tRUSure, tThingDel, tYouSure, toast]);
	const opener = useCallback(() => openECM(true), [openECM]);
	const columnarInfo = useMemo(() => columnInfo.map((col: LexiconColumn, i: number) => {
		return (
			<React.Fragment key={`${id}:fragment:${i}`}>
				<IonItem className="labelled">
					<IonLabel>{col.label}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={`${col.label} input`}
						id={`edit_lex_input_${id}_${i}`}
						className="ion-margin-top serifChars"
						value={cols[i]}
					></IonInput>
				</IonItem>
			</React.Fragment>
		);
	}), [cols, id, columnInfo]);
	return (
		<IonModal isOpen={isOpen} backdropDismiss={false} onIonModalDidPresent={onLoad}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tEditLexicon}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={opener} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={cancelEditing} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="hasSpecialLabels">
				<IonList lines="none">
					{columnarInfo}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="tertiary" slot="end" onClick={maybeSaveNewInfo}>
						<IonIcon icon={saveOutline} slot="start" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonButton>
					<IonButton color="danger" slot="start" onClick={delFromLex}>
						<IonIcon icon={trashOutline} slot="start" />
						<IonLabel>{tDelThing}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditLexiconItemModal;
