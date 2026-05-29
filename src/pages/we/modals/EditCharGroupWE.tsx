import React, { FC, useCallback, useState } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonButton,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	chevronBackOutline,
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { deleteCharacterGroupWE, editCharacterGroupWE } from '../../../store/weSlice';
import { ModalProperties, SetState, StateObject, WECharGroupObject } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

interface ModalProps extends ModalProperties {
	editing: null | WECharGroupObject
	setEditing: SetState<null | WECharGroupObject>
}

const presentations = [ "LettersCharacters", "ShortLabel", "TitleOrDesc" ];
const context = { context: "presentation" };

const commons =  [
	"deleteThisCannotUndo", "Cancel", "error"
];

const translations = [
	"OneCharOnly", "enterCharsInGroupHere", "LettersCharacters",
	"noLabelMsg", "noRunMsg", "noTitleMsg", "ShortLabel",
	"Suggest", "TitleOrDesc", "cantMakeLabelMsg",
	"EditCharGroup",
	"CharGroupDeleted", "CharGroupSaved"
];

const EditCharGroupWEModal: FC<ModalProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const [ tYouSure, tCancel, tError ] = useI18Memo(commons);
	const [
		t1Char, tEnter, tLettChar, tNoLabel, tNoRun,
		tNoTitle, tShort, tSuggest, tTitle, tUnable,
		tEditThing, tThingDel, tThingSaved
	] = useI18Memo(translations, "wgwe");
	const [ tpLetChar, tpShort, tpTitle ] = useI18Memo(presentations, "wgwe", context);

	const { isOpen, setIsOpen, editing, setEditing } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { characterGroups } = useSelector((state: StateObject) => state.we);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [charGroupMap, setCharGroupMap] = useState<{ [key: string]: WECharGroupObject }>({});
	const [editingWECharGroupTitle, editingWECharGroupTitleRef] = useElement<HTMLIonInputElement>();
	const [editingWEShortLabel, editingWEShortLabelRef] = useElement<HTMLIonInputElement>();
	const [editingWECharGroupRun, editingWECharGroupRunRef] = useElement<HTMLIonInputElement>();
	const [titleLabelEdit, titleLabelEditRef] = useElement<HTMLIonLabelElement>();
	const [labelLabelEdit, labelLabelEditRef] = useElement<HTMLDivElement>();
	const [runLabelEdit, runLabelEditRef] = useElement<HTMLIonLabelElement>();

	const onLoad = useCallback(() => {
		if(editing) {
			const { label, title, run } = editing;
			getSetValue(editingWECharGroupTitle, title);
			getSetValue(editingWEShortLabel, label || "");
			getSetValue(editingWECharGroupRun, run);
			const cgm: { [key: string]: WECharGroupObject } = {};
			characterGroups.forEach((chg: WECharGroupObject) => {
				cgm[chg.label || ""] = chg;
			});
			setCharGroupMap(cgm);
		} else {
			getSetValue(editingWECharGroupTitle, "");
			getSetValue(editingWEShortLabel, "");
			getSetValue(editingWECharGroupRun, "");
		}
	}, [
		characterGroups, editing, editingWECharGroupTitle,
		editingWEShortLabel, editingWECharGroupRun
	]);

	const generateLabel = useCallback(() => {
		//let invalid = "^$\\[]{}.*+()?|";
		const words = getSetValue(editingWECharGroupTitle) // Get the title/description
			.trim() // trim leading/trailing whitespace
			.replace(/[$\\[\]{}.*+()?^|]/g, "") // remove invalid characters
			.toLocaleUpperCase() // uppercase everything
			.split(/[-\s_/]+/) // split along word and word-ish boundaries
		// Create an array of single character strings starting with the first characters
		//   of every word, followed by the remaining characters of every word
		const potentials = words.map(word => word[0]).concat(...words.map(word => word.slice(1).split('')));
		// Now check every character one at a time to see if it's a good candidate
		let label: string | undefined;
		potentials.every(char => {
			if(editing!.label === char || !charGroupMap[char]) {
				label = char;
				return false;
			}
			return true;
		});
		if(!label) {
			// No suitable label found
			toaster({
				message: tUnable,
				color: "warning",
				duration: 4000,
				position: "top",
				toast
			});
		} else {
			// Suitable label found
			getSetValue(editingWEShortLabel, label);
			labelLabelEdit && labelLabelEdit.classList.remove("invalidValue");
		}
	}, [
		charGroupMap, editing, toast, tUnable,
		editingWECharGroupTitle, editingWEShortLabel,
		labelLabelEdit
	]);
	const cancelEditing = useCallback(() => {
		setEditing(null);
		setIsOpen(false);
	}, [setEditing, setIsOpen]);
	const maybeSaveNewInfo = useCallback(() => {
		const err: string[] = [];
		const title = getSetValue(editingWECharGroupTitle).trim();
		const label = getSetValue(editingWEShortLabel).trim();
		const run = getSetValue(editingWECharGroupRun).trim();
		// Test info for validness, then save if needed and reset the editingCharGroup
		if(title === "") {
			editingWECharGroupTitle && editingWECharGroupTitle.classList.add("invalidValue");
			err.push(tNoTitle);
		}
		if(label === "") {
			editingWEShortLabel && editingWEShortLabel.classList.add("invalidValue");
			err.push(tNoLabel);
		} else if (editing!.label !== label && charGroupMap[label!]) {
			editingWEShortLabel && editingWEShortLabel.classList.add("invalidValue");
			err.push(tw("duplicateLabel", { label }));
		} else {
			const invalid = "^$\\[]{}.*+()?|";
			if (invalid.indexOf(label as string) !== -1) {
				editingWEShortLabel && editingWEShortLabel.classList.add("invalidValue");
				err.push(tw("invalidLabel", { label }));
			}
		}
		if(run === "") {
			editingWECharGroupRun && editingWECharGroupRun.classList.add("invalidValue");
			err.push(tNoRun);
		}
		if(err.length > 0) {
			// Errors found.
			doAlert({
				header: tError,
				cssClass: "danger",
				message: err.join("; "),
				buttons: [
					{
						text: tCancel,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
			return;
		}
		// Everything ok!
		dispatch(editCharacterGroupWE({
			label: (editing && editing.label) || "",
			edited: {
				title,
				label,
				run
			}
		}));
		cancelEditing();
		toaster({
			message: tThingSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [cancelEditing, charGroupMap, dispatch, doAlert,
		editing, toast, tw, tCancel, tError, tNoLabel,
		tNoRun, tNoTitle, tThingSaved,
		editingWECharGroupRun, editingWECharGroupTitle,
		editingWEShortLabel
	]);
	const maybeDeleteCharGroup = useCallback(() => {
		const { label = "", run } = editing!;
		const handler = () => {
			dispatch(deleteCharacterGroupWE(editing!));
			cancelEditing();
			toaster({
				message: tThingDel,
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
				header: `${label}=${run}`,
				message: tYouSure,
				cssClass: "warning",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [cancelEditing, disableConfirms, dispatch, doAlert, editing, toast, tc, tThingDel, tYouSure]);
	return (
		<Modal
			isOpen={isOpen}
			title={tEditThing}
			closeFunc={cancelEditing}
			onIonModalDidPresent={onLoad}
			bottomStart={[{button: "delete", action: maybeDeleteCharGroup}]}
			bottomEnd={[{button: "save", action: maybeSaveNewInfo}]}
			extraChars
		>
			<IonList lines="none" className="hasSpecialLabels">
				<IonItem className="labelled">
					<IonLabel className="titleLabelEdit" ref={titleLabelEditRef}>{tpTitle}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitle}
						id="editingWECharGroupTitle"
						ref={editingWECharGroupTitleRef}
						className="ion-margin-top"
						onIonChange={() => titleLabelEdit && titleLabelEdit.classList.remove("invalidValue")}
						autocomplete="on"
					></IonInput>
				</IonItem>
				<IonItem className="margin-top-quarter">
					<div
						slot="start"
						className="ion-margin-end labelLabelEdit"
						ref={labelLabelEditRef}
					>{tpShort}</div>
					<IonInput
						aria-label={tShort}
						id="editingWEShortLabel"
						ref={editingWEShortLabelRef}
						className="serifChars"
						helperText={t1Char}
						onIonChange={() => labelLabelEdit && labelLabelEdit.classList.remove("invalidValue")}
						maxlength={1}
					></IonInput>
					<IonButton slot="end" onClick={generateLabel}>
						<IonIcon icon={chevronBackOutline} />{tSuggest}
					</IonButton>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="runLabelEdit" ref={runLabelEditRef}>{tpLetChar}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						id="editingWECharGroupRun"
						ref={editingWECharGroupRunRef}
						aria-label={tLettChar}
						className="ion-margin-top serifChars"
						helperText={tEnter}
						onIonChange={() => runLabelEdit && runLabelEdit.classList.remove("invalidValue")}
					></IonInput>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default EditCharGroupWEModal;
