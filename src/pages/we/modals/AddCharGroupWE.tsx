import React, { useCallback, useMemo, FC } from 'react';
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
	chevronBackOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { WECharGroupObject, StateObject, ModalProperties } from '../../../store/types';
import { addCharacterGroupWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

const presentations = [ "LettersCharacters", "ShortLabel", "TitleOrDesc" ];
const context = { context: "presentation" };

const commons = [ "Cancel", "error" ];

const translations = [
	"OneCharOnly", "enterCharsInGroupHere", "LettersCharacters",
	"noLabelMsg", "noRunMsg", "noTitleMsg", "ShortLabel",
	"Suggest", "TitleOrDesc", "cantMakeLabelMsg", "AddCharGroup",
	"CharGroupSaved"
];

const AddCharGroupWEModal: FC<ModalProperties> = (props) => {
	const [ tw ] = useTranslator('wgwe');
	const [ tCancel, tError ] = useI18Memo(commons);
	const [
		t1Char, tEnter, tLetChar, tNoLabel, tNoRun, tNoTitle,
		tShort, tSuggest, tTitle, tNoSuggest, tAdding, tCGSaved
	] = useI18Memo(translations, "wgwe");
	const [ tpLetChar, tpShort, tpTitle ] = useI18Memo(presentations, "wgwe", context);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { characterGroups } = useSelector((state: StateObject) => state.we);
	const [newWECharGroupTitle, newWECharGroupTitleRef] = useElement<HTMLIonInputElement>();
	const [newWEShortLabel, newWEShortLabelRef] = useElement<HTMLIonInputElement>();
	const [newWECharGroupRun, newWECharGroupRunRef] = useElement<HTMLIonInputElement>();
	const [titleLabel, titleLabelRef] = useElement<HTMLIonLabelElement>();
	const [runLabel, runLabelRef] = useElement<HTMLIonLabelElement>();
	const [labelLabel, labelLabelRef] = useElement<HTMLDivElement>();
	const charGroupMap = useMemo(() => {
		const charGroupMap: { [key: string]: boolean } = {};
		characterGroups.forEach((cg: WECharGroupObject) => {
			charGroupMap[cg.label || ""] = true;
		});
		return charGroupMap
	}, [characterGroups]);
	const generateLabel = useCallback(() => {
		const words = getSetValue(newWECharGroupTitle) // Get the title/description
			.trim() // trim leading/trailing whitespace
			.replace(/[$\\[\]{}.*+()?^|]/g, "") // remove invalid characters
			.toUpperCase() // uppercase everything
			.split(/[-\s_/]+/); // split along word and word-ish boundaries
		// Create an array of single character strings starting with the first characters
		//   of every word, followed by the remaining characters of every word
		const potentials = words.map(word => word[0]).concat(...words.map(word => word.slice(1).split('')));
		let label: string | undefined;
		potentials.every(char => {
			if(!charGroupMap[char]) {
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
			getSetValue(newWEShortLabel, label);
			labelLabel && labelLabel.classList.remove("invalidValue");
		}
	}, [charGroupMap, toast, tNoSuggest, newWECharGroupTitle, newWEShortLabel, labelLabel]);
	const maybeSaveNewCharGroup = useCallback((close: boolean = true) => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the info
		const title = getSetValue(newWECharGroupTitle).trim();
		const label = getSetValue(newWEShortLabel).trim();
		const run = getSetValue(newWECharGroupRun).trim();
		if(title === "") {
			if(titleLabel) { titleLabel.classList.add("invalidValue"); }
			err.push(tNoTitle);
		}
		if(label === "") {
			if(labelLabel) { labelLabel.classList.add("invalidValue"); }
			err.push(tNoLabel);
		} else if (charGroupMap[label]) {
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
				message: err.join("; "),
				cssClass: "danger",
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
		if(close) { setIsOpen(false); }
		dispatch(addCharacterGroupWE({title, label, run}));
		getSetValue(newWECharGroupTitle, "");
		getSetValue(newWEShortLabel, "");
		getSetValue(newWECharGroupRun, "");
		toaster({
			message: tCGSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [
		charGroupMap, dispatch, doAlert, setIsOpen,
		tCancel, tError, tNoLabel, tNoRun, tNoTitle,
		toast, tw, tCGSaved,
		newWECharGroupTitle, newWEShortLabel, newWECharGroupRun,
		titleLabel, runLabel, labelLabel
	]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const adder = useCallback(() => maybeSaveNewCharGroup(false), [maybeSaveNewCharGroup]);
	const addAndCloser = useCallback(() => maybeSaveNewCharGroup(), [maybeSaveNewCharGroup]);
	return (
		<Modal
			isOpen={isOpen}
			closeFunc={closer}
			extraChars
			title={tAdding}
			bottomEnd={[
				{ button: "add", action: adder, color: "secondary" },
				{ button: "add+close", action: addAndCloser }
			]}
		>
			<IonList lines="none" className="hasSpecialLabels addWECharGroup">
				<IonItem className="labelled">
					<IonLabel className="titleLabel" ref={titleLabelRef}>{tpTitle}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitle}
						id="newWECharGroupTitle"
						className="ion-margin-top"
						autocomplete="on"
						onIonChange={() => titleLabel && titleLabel.classList.remove("invalidValue")}
						ref={newWECharGroupTitleRef}
					></IonInput>
				</IonItem>
				<IonItem className="margin-top-quarter">
					<div
						slot="start"
						className="ion-margin-end labelLabel"
						ref={labelLabelRef}
					>{tpShort}</div>
					<IonInput
						id="newWEShortLabel"
						aria-label={tShort}
						labelPlacement="start"
						className="serifChars labelLabel"
						helperText={t1Char}
						maxlength={1}
						onIonChange={() => labelLabel && labelLabel.classList.remove("invalidValue")}
						ref={newWEShortLabelRef}
					></IonInput>
					<IonButton slot="end" onClick={generateLabel}>
						<IonIcon icon={chevronBackOutline} />{tSuggest}
					</IonButton>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="runLabel" ref={runLabelRef}>{tpLetChar}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						id="newWECharGroupRun"
						aria-label={tLetChar}
						className="importantElement ion-margin-top serifChars"
						helperText={tEnter}
						onIonChange={() => runLabel && runLabel.classList.remove("invalidValue")}
						ref={newWECharGroupRunRef}
					></IonInput>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default AddCharGroupWEModal;
