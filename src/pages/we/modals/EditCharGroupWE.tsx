import React, { FC, useCallback, useState } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonToolbar,
	IonButton,
	IonModal,
	IonInput,
	IonFooter,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	chevronBackOutline,
	saveOutline,
	trashOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { deleteCharacterGroupWE, editCharacterGroupWE } from '../../../store/weSlice';
import { ExtraCharactersModalOpener, SetState, StateObject, WECharGroupObject } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import { $q, $i } from '../../../components/DollarSignExports';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

interface ModalProps extends ExtraCharactersModalOpener {
	editing: null | WECharGroupObject
	setEditing: SetState<null | WECharGroupObject>
}
function resetError (prop: keyof WECharGroupObject) {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q(`.${prop}LabelEdit`);
	where && where.classList.remove("invalidValue");
}
const resetTitle = () => resetError("title");
const resetLabel = () => resetError("label");
const resetRun = () => resetError("run");

const presentations = [ "LettersCharacters", "ShortLabel", "TitleOrDesc" ];
const context = { context: "presentation" };

const commons =  [
	"deleteThisCannotUndo", "Cancel", "error"
];

const translations = [
	"OneCharOnly", "enterCharsInGroupHere", "LettersCharacters",
	"noLabelMsg", "noRunMsg", "noTitleMsg", "ShortLabel",
	"Suggest", "TitleOrDesc", "cantMakeLabelMsg",
	"DeleteCharGroup", "EditCharGroup",
	"SaveCharGroup", "CharGroupDeleted", "CharGroupSaved"
];

const EditCharGroupWEModal: FC<ModalProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const [ tYouSure, tCancel, tError ] = useI18Memo(commons);
	const [
		t1Char, tEnter, tLettChar, tNoLabel, tNoRun,
		tNoTitle, tShort, tSuggest, tTitle, tUnable, tDelThing,
		tEditThing, tSaveThing, tThingDel, tThingSaved
	] = useI18Memo(translations, "wgwe");
	const [ tpLetChar, tpShort, tpTitle ] = useI18Memo(presentations, "wgwe", context);

	const { isOpen, setIsOpen, openECM, editing, setEditing } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { characterGroups } = useSelector((state: StateObject) => state.we);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [charGroupMap, setCharGroupMap] = useState<{ [key: string]: WECharGroupObject }>({});
	const [titleEl, setTitleEl] = useState<HTMLInputElement | null>(null);
	const [labelEl, setLabelEl] = useState<HTMLInputElement | null>(null);
	const [runEl, setRunEl] = useState<HTMLInputElement | null>(null);
	const onLoad = useCallback(() => {
		const _titleEl = $i<HTMLInputElement>("editingWECharGroupTitle");
		const _labelEl = $i<HTMLInputElement>("editingWEShortLabel");
		const _runEl = $i<HTMLInputElement>("editingWECharGroupRun");
			if(editing) {
			const { label, title, run } = editing;
			_titleEl && (_titleEl.value = title);
			_labelEl && (_labelEl.value = label || "");
			_runEl && (_runEl.value = run);
			const cgm: { [key: string]: WECharGroupObject } = {};
			characterGroups.forEach((chg: WECharGroupObject) => {
				cgm[chg.label || ""] = chg;
			});
			setCharGroupMap(cgm);
		} else {
			_titleEl && (_titleEl.value = "");
			_labelEl && (_labelEl.value = "");
			_runEl && (_runEl.value = "");
		}
		setTitleEl(_titleEl);
		setLabelEl(_labelEl);
		setRunEl(_runEl);
	}, [characterGroups, editing]);

	const generateLabel = useCallback(() => {
		//let invalid = "^$\\[]{}.*+()?|";
		const words = (titleEl!.value as string) // Get the title/description
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
			labelEl!.value = label;
			resetError("label");
		}
	}, [charGroupMap, editing, labelEl, titleEl, toast, tUnable]);
	const cancelEditing = useCallback(() => {
		setEditing(null);
		setIsOpen(false);
	}, [setEditing, setIsOpen]);
	const maybeSaveNewInfo = useCallback(() => {
		const err: string[] = [];
		const title = titleEl!.value.trim();
		const label = labelEl!.value.trim();
		const run = runEl!.value.trim();
		// Test info for validness, then save if needed and reset the editingCharGroup
		if(title === "") {
			const el = $q(".titleLabelEdit");
			el && el.classList.add("invalidValue");
			err.push(tNoTitle);
		}
		if(label === "") {
			const el = $q(".labelLabelEdit");
			el && el.classList.add("invalidValue");
			err.push(tNoLabel);
		} else if (editing!.label !== label && charGroupMap[label!]) {
			const el = $q(".labelLabelEdit");
			el && el.classList.add("invalidValue");
			err.push(tw("duplicateLabel", { label }));
		} else {
			const invalid = "^$\\[]{}.*+()?|";
			if (invalid.indexOf(label as string) !== -1) {
				const el = $q(".labelLabelEdit");
				el && el.classList.add("invalidValue");
				err.push(tw("invalidLabel", { label }));
			}
		}
		if(run === "") {
			const el = $q(".runLabelEdit");
			el && el.classList.add("invalidValue");
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
	}, [cancelEditing, charGroupMap, dispatch, doAlert, editing, labelEl, runEl, titleEl, toast, tw, tCancel, tError, tNoLabel, tNoRun, tNoTitle, tThingSaved]);
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
		<IonModal isOpen={isOpen} onDidDismiss={cancelEditing} onIonModalDidPresent={onLoad}>
			<ModalHeader title={tEditThing} closeModal={cancelEditing} openECM={openECM} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels">
					<IonItem className="labelled">
						<IonLabel className="titleLabelEdit">{tpTitle}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitle}
							id="editingWECharGroupTitle"
							className="ion-margin-top"
							onIonChange={resetTitle}
							autocomplete="on"
						></IonInput>
					</IonItem>
					<IonItem className="margin-top-quarter">
						<div
							slot="start"
							className="ion-margin-end labelLabelEdit"
						>{tpShort}</div>
						<IonInput
							aria-label={tShort}
							id="editingWEShortLabel"
							className="serifChars"
							helperText={t1Char}
							onIonChange={resetLabel}
							maxlength={1}
						></IonInput>
						<IonButton slot="end" onClick={generateLabel}>
							<IonIcon icon={chevronBackOutline} />{tSuggest}
						</IonButton>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="runLabelEdit">{tpLetChar}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							id="editingWECharGroupRun"
							aria-label={tLettChar}
							className="ion-margin-top serifChars"
							helperText={tEnter}
							onIonChange={resetRun}
						></IonInput>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="secondary"
						slot="end"
						onClick={maybeSaveNewInfo}
					>
						<IonIcon icon={saveOutline} slot="start" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonButton>
					<IonButton
						color="danger"
						slot="start"
						onClick={maybeDeleteCharGroup}
					>
						<IonIcon icon={trashOutline} slot="start" />
						<IonLabel>{tDelThing}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditCharGroupWEModal;
