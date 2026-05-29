import React, { useCallback, useMemo, useState, FC } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonButton,
	IonInput,
	IonToggle,
	IonRange,
	useIonAlert,
	useIonToast,
	RangeCustomEvent
} from '@ionic/react';
import {
	chevronBackOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { WGCharGroupObject, Zero_Fifty, StateObject, SetState, ModalProperties } from '../../../store/types';
import { editCharacterGroupWG, deleteCharGroupWG } from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

interface ModalProps extends ModalProperties {
	editing: null | WGCharGroupObject
	setEditing: SetState<null | WGCharGroupObject>
}

const commons = [ "deleteThisCannotUndo", "Cancel", "error" ];

const translations = [
	"OneCharOnly", "enterCharsInGroupHere",
	"LettersCharacters", "noLabelMsg", "noRunMsg",
	"noTitleMsg", "ShortLabel", "Suggest", "TitleOrDesc",
	"cantMakeLabelMsg", "EditCharGroup",
	"CharGroupDeleted", "CharGroupSaved"
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
		tShort, tSuggest, tTitleDesc, tNoSuggest,
		tEditThing, tThingDel, tThingSaved
	] = useI18Memo(translations, 'wgwe');
	const [ tpTitleDesc, tpShort, tpLettChar ] = useI18Memo(presentations, 'wgwe', context);

	const { isOpen, setIsOpen, editing, setEditing } = props;
	const dispatch = useDispatch();
	const { characterGroups, characterGroupDropoff } = useSelector((state: StateObject) => state.wg);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [hasDropoff, setHasDropoff] = useState<boolean>(false);
	const [dropoff, setDropoff] = useState<Zero_Fifty>(characterGroupDropoff);
	const [charGroupMap, setCharGroupMap] = useState<{ [ key: string]: boolean }>({});
	const [titleLabel, titleLabelRef] = useElement<HTMLIonLabelElement>();
	const [labelLabel, labelLabelRef] = useElement<HTMLDivElement>();
	const [runLabel, runLabelRef] = useElement<HTMLIonLabelElement>();
	const [editingWGCharGroupTitle, editingWGCharGroupTitleRef] = useElement<HTMLIonInputElement>();
	const [editingWGShortLabel, editingWGShortLabelRef] = useElement<HTMLIonInputElement>();
	const [editingWGCharGroupRun, editingWGCharGroupRunRef] = useElement<HTMLIonInputElement>();
	const onLoad = useCallback(() => {
		if(editing) {
			const { title, run, dropoffOverride, label } = editing;
			getSetValue(editingWGCharGroupTitle, title);
			getSetValue(editingWGShortLabel, label);
			getSetValue(editingWGCharGroupRun, run);
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
			getSetValue(editingWGCharGroupTitle, "");
			getSetValue(editingWGShortLabel, "");
			getSetValue(editingWGCharGroupRun, "");
		}
	}, [characterGroupDropoff, characterGroups, editing, editingWGCharGroupTitle, editingWGShortLabel, editingWGCharGroupRun]);

	const generateLabel = useCallback(() => {
		//let invalid = "^$\\[]{}.*+()?|";
		const words = getSetValue(editingWGCharGroupTitle) // Get the title/description
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
			getSetValue(editingWGShortLabel, label);
			labelLabel && labelLabel.classList.remove("invalidValue");
		}
	}, [
		charGroupMap, editing, labelLabel, toast, tNoSuggest,
		editingWGCharGroupTitle, editingWGShortLabel
	]);
	const cancelEditing = useCallback(() => {
		setIsOpen(false);
		setEditing(null);
	}, [setEditing, setIsOpen]);
	const maybeSaveNewInfo = useCallback(() => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the editingWGCharGroup
		const title = getSetValue(editingWGCharGroupTitle).trim(),
			label = getSetValue(editingWGShortLabel).trim(),
			run = getSetValue(editingWGCharGroupRun).trim();
		if(title === "") {
			if(titleLabel) { titleLabel.classList.add("invalidValue"); }
			err.push(tNoTitle);
		}
		if(!label) {
			if(labelLabel) { labelLabel.classList.add("invalidValue"); }
			err.push(tNoLabel);
		} else if (editing!.label !== label && charGroupMap[label]) {
			if(labelLabel) { labelLabel.classList.add("invalidValue"); }
			err.push(tw("duplicateLabel", { label }));
		} else {
			const invalid = "^$\\[]{}.*+()?|";
			if (invalid.indexOf(label as string) !== -1) {
				if(labelLabel) { labelLabel.classList.add("invalidValue"); }
				err.push(tw("invalidLabel", { label }));
			}
		}
		if(run === "") {
			if(runLabel) { runLabel.classList.add("invalidValue"); }
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
		editing, hasDropoff, labelLabel, runLabel, titleLabel, toast, tw,
		tCancel, tError, tNoLabel, tNoRun, tNoTitle, tThingSaved,
		editingWGCharGroupTitle, editingWGShortLabel, editingWGCharGroupRun
	]);
	const maybeDeleteCharGroup = useCallback(() => {
		const title = getSetValue(editingWGCharGroupTitle).trim(),
			label = getSetValue(editingWGShortLabel).trim(),
			run = getSetValue(editingWGCharGroupRun).trim();
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
	}, [
		cancelEditing, disableConfirms, dispatch, doAlert,
		dropoff, hasDropoff, editingWGCharGroupTitle,
		editingWGCharGroupRun, editingWGShortLabel, toast, tc,
		tThingDel, tYouSure
	]);
	const toggleDropoff = useCallback(() => setHasDropoff(!hasDropoff), [hasDropoff]);
	const doDropoff = useCallback((e: RangeCustomEvent) => {setDropoff(e.detail.value as Zero_Fifty)}, []);
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
			<IonList lines="none" class="hasSpecialLabels">
				<IonItem className="labelled">
					<IonLabel className="titleLabelEdit" ref={titleLabelRef}>{tpTitleDesc}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitleDesc}
						id="editingWGCharGroupTitle"
						ref={editingWGCharGroupTitleRef}
						className="ion-margin-top"
						onIonChange={() => titleLabel && titleLabel.classList.remove("invalidValue")}
						autocomplete="on"
					/>
				</IonItem>
				<IonItem className="margin-top-quarter">
					<div
						slot="start"
						className="ion-margin-end labelLabel"
						ref={labelLabelRef}
					>{tpShort}</div>
					<IonInput
						aria-label={tShort}
						id="editingWGShortLabel"
						ref={editingWGShortLabelRef}
						className="serifChars"
						helperText={t1Char}
						onIonChange={() => labelLabel && labelLabel.classList.remove("invalidValue")}
						maxlength={1}
					/>
					<IonButton slot="end" onClick={generateLabel}>
						<IonIcon icon={chevronBackOutline} />{tSuggest}
					</IonButton>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="runLabelEdit" ref={runLabelRef}>{tpLettChar}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tLettChar}
						id="editingWGCharGroupRun"
						ref={editingWGCharGroupRunRef}
						className="ion-margin-top serifChars"
						helperText={tEnterHere}
						onIonChange={() => runLabel && runLabel.classList.remove("invalidValue")}
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
		</Modal>
	);
};

export default EditCharGroupModal;
