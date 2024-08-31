import React, { useCallback, useMemo, FC } from 'react';
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
	addOutline,
	chevronBackOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { WECharGroupObject, ExtraCharactersModalOpener, StateObject } from '../../../store/types';
import { addCharacterGroupWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import { $q, $a, $i } from '../../../components/DollarSignExports';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

function resetError(prop: string) {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q(`.${prop}Label`);
	where && where.classList.remove("invalidValue");
}
const resetTitle = () => resetError("title");
const resetLabel = () => resetError("label");
const resetRun = () => resetError("run");

const presentations = [ "LettersCharacters", "ShortLabel", "TitleOrDesc" ];
const context = { context: "presentation" };

const commons = [ "AddAndClose", "Cancel", "error" ];

const translations = [
	"OneCharOnly", "enterCharsInGroupHere", "LettersCharacters",
	"noLabelMsg", "noRunMsg", "noTitleMsg", "ShortLabel",
	"Suggest", "TitleOrDesc", "cantMakeLabelMsg", "AddCharGroup",
	"CharGroupSaved"
];

const AddCharGroupWEModal: FC<ExtraCharactersModalOpener> = (props) => {
	const [ tw ] = useTranslator('wgwe');
	const [ tAddClose, tCancel, tError ] = useI18Memo(commons);
	const [
		t1Char, tEnter, tLetChar, tNoLabel, tNoRun, tNoTitle,
		tShort, tSuggest, tTitle, tNoSuggest, tAdding, tCGSaved
	] = useI18Memo(translations, "wgwe");
	const [ tpLetChar, tpShort, tpTitle ] = useI18Memo(presentations, "wgwe", context);

	const { isOpen, setIsOpen, openECM } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { characterGroups } = useSelector((state: StateObject) => state.we);
	const charGroupMap = useMemo(() => {
		const charGroupMap: { [key: string]: boolean } = {};
		characterGroups.forEach((cg: WECharGroupObject) => {
			charGroupMap[cg.label || ""] = true;
		});
		return charGroupMap
	}, [characterGroups]);
	const generateLabel = useCallback(() => {
		const el = $i<HTMLInputElement>("newWECharGroupTitle");
		const words = (el ? el.value as string : "") // Get the title/description
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
			const el = $i<HTMLInputElement>("newWEShortLabel");
			el && (el.value = label);
			resetError("label");
		}
	}, [charGroupMap, toast, tNoSuggest]);
	const maybeSaveNewCharGroup = useCallback((close: boolean = true) => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the info
		const titleEl = $i<HTMLInputElement>("newWECharGroupTitle");
		const title = titleEl ? titleEl.value.trim() : "";;
		const labelEl = $i<HTMLInputElement>("newWEShortLabel");
		const label = labelEl ? labelEl.value.trim() : "";;
		const runEl = $i<HTMLInputElement>("newWECharGroupRun");
		const run = runEl ? runEl.value.trim() : "";;
		if(title === "") {
			const el = $q(".titleLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoTitle);
		}
		if(label === "") {
			const el = $q(".labelLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoLabel);
		} else if (charGroupMap[label]) {
			const el = $q(".labelLabel");
			el && el.classList.add("invalidValue");
			err.push(tw("duplicateLabel", { label }));
		} else {
			const invalid = "^$\\[]{}.*+()?|";
			if (invalid.indexOf(label as string) !== -1) {
				const el = $q(".labelLabel");
				el && el.classList.add("invalidValue");
				err.push(tw("invalidLabel", { label }));
			}
		}
		if(run === "") {
			const el = $q(".runLabel");
			el && el.classList.add("invalidValue");
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
		close && setIsOpen(false);
		dispatch(addCharacterGroupWE({title, label, run}));
		$a<HTMLInputElement>("ion-list.addWECharGroup ion-input").forEach(
			(input) => input.value = ""
		);
		toaster({
			message: tCGSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [charGroupMap, dispatch, doAlert, setIsOpen, tCancel, tError, tNoLabel, tNoRun, tNoTitle, toast, tw, tCGSaved]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const adder = useCallback(() => maybeSaveNewCharGroup(false), [maybeSaveNewCharGroup]);
	const addAndCloser = useCallback(() => maybeSaveNewCharGroup(), [maybeSaveNewCharGroup]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tAdding} closeModal={setIsOpen} openECM={openECM} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels addWECharGroup">
					<IonItem className="labelled">
						<IonLabel className="titleLabel">{tpTitle}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitle}
							id="newWECharGroupTitle"
							className="ion-margin-top"
							autocomplete="on"
							onIonChange={resetTitle}
						></IonInput>
					</IonItem>
					<IonItem className="margin-top-quarter">
						<div
							slot="start"
							className="ion-margin-end labelLabel"
						>{tpShort}</div>
						<IonInput
							id="newWEShortLabel"
							aria-label={tShort}
							labelPlacement="start"
							className="serifChars labelLabel"
							helperText={t1Char}
							maxlength={1}
							onIonChange={resetLabel}
						></IonInput>
						<IonButton slot="end" onClick={generateLabel}>
							<IonIcon icon={chevronBackOutline} />{tSuggest}
						</IonButton>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="runLabel">{tpLetChar}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							id="newWECharGroupRun"
							aria-label={tLetChar}
							className="importantElement ion-margin-top serifChars"
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
						onClick={adder}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAdding}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={addAndCloser}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddClose}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddCharGroupWEModal;
