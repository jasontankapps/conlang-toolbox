import React, { useCallback, useMemo, useState, FC } from 'react';
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
	IonToggle,
	IonRange,
	useIonAlert,
	useIonToast,
	RangeCustomEvent
} from '@ionic/react';
import {
	chevronBackOutline,
	saveOutline,
	trashOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { WGCharGroupObject, Zero_Fifty, ExtraCharactersModalOpener, StateObject, SetState } from '../../../store/types';
import { editCharacterGroupWG, deleteCharGroupWG } from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import { $q, $i } from '../../../components/DollarSignExports';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

interface ModalProps extends ExtraCharactersModalOpener {
	editing: null | WGCharGroupObject
	setEditing: SetState<null | WGCharGroupObject>
}

function resetError (prop: keyof WGCharGroupObject) {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q("." + prop + "LabelEdit");
	where && where.classList.remove("invalidValue");
}


const commons = [ "deleteThisCannotUndo", "Cancel", "error" ];

const translations = [
	"OneCharOnly", "enterCharsInGroupHere",
	"LettersCharacters", "noLabelMsg", "noRunMsg",
	"noTitleMsg", "ShortLabel", "Suggest", "TitleOrDesc",
	"cantMakeLabelMsg", "DeleteCharGroup", "EditCharGroup",
	"SaveCharGroup", "CharGroupDeleted", "CharGroupSaved"
];

const presentations = [
	"TitleOrDesc", "ShortLabel", "LettersCharacters"
];
const context = { context: "presentation" };

const EditCharGroupModal: FC<ModalProps> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tw ] = useTranslator('wgwe');
	const [ tc ] = useTranslator('common');
	const tUseSep = useMemo(() => t("useSepDropoffRate"), [t]);
	const [ tYouSure, tCancel, tError ] = useI18Memo(commons);
	const [
		t1Char, tEnterHere, tLettChar, tNoLabel, tNoRun, tNoTitle,
		tShort, tSuggest, tTitleDesc, tNoSuggest, tDelThing,
		tEditThing, tSaveThing, tThingDel, tThingSaved
	] = useI18Memo(translations, 'wgwe');
	const [ tpTitleDesc, tpShort, tpLettChar ] = useI18Memo(presentations, 'wgwe', context);

	const { isOpen, setIsOpen, openECM, editing, setEditing } = props;
	const dispatch = useDispatch();
	const { characterGroups, characterGroupDropoff } = useSelector((state: StateObject) => state.wg);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [hasDropoff, setHasDropoff] = useState<boolean>(false);
	const [dropoff, setDropoff] = useState<Zero_Fifty>(characterGroupDropoff);
	const [charGroupMap, setCharGroupMap] = useState<{ [ key: string]: boolean }>({});
	const [titleEl, setTitleEl] = useState<HTMLInputElement | null>(null);
	const [labelEl, setLabelEl] = useState<HTMLInputElement | null>(null);
	const [runEl, setRunEl] = useState<HTMLInputElement | null>(null);
	const onLoad = useCallback(() => {
		const _titleEl = $i<HTMLInputElement>("editingWGCharGroupTitle");
		const _labelEl = $i<HTMLInputElement>("editingWGShortLabel");
		const _runEl = $i<HTMLInputElement>("editingWGCharGroupRun");
		if(editing) {
			const { title, run, dropoffOverride, label } = editing;
			_titleEl && (_titleEl.value = title);
			_labelEl && (_labelEl.value = label);
			_runEl && (_runEl.value = run);
			if(dropoffOverride !== undefined) {
				setHasDropoff(true);
				setDropoff(dropoffOverride);
			} else {
				setHasDropoff(false);
				setDropoff(characterGroupDropoff);
			}
			const newMap: { [ key: string]: boolean } = {};
			characterGroups.forEach((item: WGCharGroupObject) => {
				newMap[item.label] = true;
			});
			setCharGroupMap(newMap);
		} else {
			_titleEl && (_titleEl.value = "");
			_labelEl && (_labelEl.value = "");
			_runEl && (_runEl.value = "");
		}
		setTitleEl(_titleEl);
		setLabelEl(_labelEl);
		setRunEl(_runEl);
	}, [characterGroupDropoff, characterGroups, editing]);

	const resetLabel = useCallback(() => resetError("label"), []);
	const resetTitle = useCallback(() => resetError("title"), []);
	const resetRun = useCallback(() => resetError("run"), []);

	const generateLabel = useCallback(() => {
		//let invalid = "^$\\[]{}.*+()?|";
		const words = (titleEl!.value as string) // Get the title/description
			.trim() // trim leading/trailing whitespace
			.replace(/[$\\[\]{}.*+()?^|]/g, "") // remove invalid characters
			.toUpperCase() // uppercase everything
			.split(/[-\s_/]+/) // split along word and word-ish boundaries
		// Create an array of single character strings starting with the first characters
		//   of every word, followed by the remaining characters of every word
		const potentials = words.map(word => word[0]).concat(...words.map(word => word.slice(1).split('')));
		// Now check every character one at a time to see if it's a good candidate
		let label: string = "";
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
				message: tNoSuggest,
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
	}, [charGroupMap, editing, labelEl, titleEl, toast, tNoSuggest]);
	const cancelEditing = useCallback(() => {
		setIsOpen(false);
		setEditing(null);
	}, [setEditing, setIsOpen]);
	const maybeSaveNewInfo = useCallback(() => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the editingWGCharGroup
		const title = titleEl!.value.trim(),
			label = labelEl!.value.trim(),
			run = runEl!.value.trim();
		if(title === "") {
			const el = $q(".titleLabelEdit");
			el && el.classList.add("invalidValue");
			err.push(tNoTitle);
		}
		if(!label) {
			const el = $q(".labelLabelEdit");
			el && el.classList.add("invalidValue");
			err.push(tNoLabel);
		} else if (editing!.label !== label && charGroupMap[label]) {
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
		cancelEditing();
		dispatch(editCharacterGroupWG({
			old: editing!,
			edited: {
				title,
				label,
				run,
				dropoffOverride: hasDropoff ? dropoff : undefined
			}
		}));
		toaster({
			message: tThingSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [cancelEditing, charGroupMap, dispatch, doAlert, dropoff,
		editing, hasDropoff, labelEl, runEl, titleEl, toast, tw,
		tCancel, tError, tNoLabel, tNoRun, tNoTitle, tThingSaved
	]);
	const maybeDeleteCharGroup = useCallback(() => {
		const title = titleEl!.value.trim(),
			label = labelEl!.value.trim(),
			run = runEl!.value.trim();
		const handler = () => {
			cancelEditing();
			dispatch(deleteCharGroupWG({
				title,
				label,
				run,
				dropoffOverride: hasDropoff ? dropoff : undefined
			}));
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
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [cancelEditing, disableConfirms, dispatch, doAlert, dropoff, hasDropoff,
		labelEl, runEl, titleEl, toast, tc, tThingDel, tYouSure]);
	const toggleDropoff = useCallback(() => setHasDropoff(!hasDropoff), [hasDropoff]);
	const doDropoff = useCallback((e: RangeCustomEvent) => {setDropoff(e.detail.value as Zero_Fifty)}, []);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={cancelEditing} onIonModalDidPresent={onLoad}>
			<ModalHeader title={tEditThing} openECM={openECM} closeModal={cancelEditing} />
			<IonContent>
				<IonList lines="none" class="hasSpecialLabels">
					<IonItem className="labelled">
						<IonLabel className="titleLabelEdit">{tpTitleDesc}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitleDesc}
							id="editingWGCharGroupTitle"
							className="ion-margin-top"
							onIonChange={resetTitle}
							autocomplete="on"
						/>
					</IonItem>
					<IonItem className="margin-top-quarter">
						<div
							slot="start"
							className="ion-margin-end labelLabel"
						>{tpShort}</div>
						<IonInput
							aria-label={tShort}
							id="editingWGShortLabel"
							className="serifChars"
							helperText={t1Char}
							onIonChange={resetLabel}
							maxlength={1}
						/>
						<IonButton slot="end" onClick={generateLabel}>
							<IonIcon icon={chevronBackOutline} />{tSuggest}
						</IonButton>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="runLabelEdit">{tpLettChar}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tLettChar}
							id="editingWGCharGroupRun"
							className="ion-margin-top serifChars"
							helperText={tEnterHere}
							onIonChange={resetRun}
						/>
					</IonItem>
					<IonItem>
						<IonToggle enableOnOffLabels
							onClick={toggleDropoff}
							labelPlacement="start"
							checked={hasDropoff}
						>{tUseSep}</IonToggle>
					</IonItem>
					<IonItem id="charGroupDropoffEditC" className={hasDropoff ? "" : "hide"}>
						<IonRange
							min={0}
							max={50}
							pin={true}
							value={dropoff}
							onIonChange={doDropoff}
						>
							<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
							<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
						</IonRange>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="secondary" slot="end" onClick={maybeSaveNewInfo}>
						<IonIcon icon={saveOutline} slot="start" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonButton>
					<IonButton color="danger" slot="start" onClick={maybeDeleteCharGroup}>
						<IonIcon icon={trashOutline} slot="start" />
						<IonLabel>{tDelThing}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditCharGroupModal;
