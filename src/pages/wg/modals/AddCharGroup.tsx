import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
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
	addOutline,
	chevronBackOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { ExtraCharactersModalOpener, StateObject, WGCharGroupObject, Zero_Fifty } from '../../../store/types';
import { addCharGroupWG } from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import { $q, $i, $a } from '../../../components/DollarSignExports';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

function resetError(prop: string) {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q("." + prop + "Label");
	where && where.classList.remove("invalidValue");
}

const presentations = ["LettersCharacters", "ShortLabel", "TitleOrDesc" ];
const context = { context: "presentation" };


const commons = [ "AddAndClose", "error", "Cancel" ];

const wgweWords = [
	"OneCharOnly", "AddCharGroup", "enterCharsInGroupHere",
	"LettersCharacters", "noRunMsg", "noTitleMsg", "ShortLabel",
	"Suggest", "TitleOrDesc", "noLabelMsg",
	"cantMakeLabelMsg", "CharGroupSaved"
];

const AddCharGroupModal: FC<ExtraCharactersModalOpener> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tw ] = useTranslator('wgwe');
	const [ tpLettChar, tpShort, tpTitleDesc ] = useI18Memo(presentations, 'wgwe', context);
	const [ tAddClose, tError, tCancel ] = useI18Memo(commons);
	const tUseDrop = useMemo(() => t("useSepDropoffRate"), [t]);
	const [
		t1Char, tAddThing, tEnterChar, tLettChar, tNoRun, tNoTitle,
		tShort, tSuggest, tTitleDesc, tNoLabel, tNoSuggest, tThingAdd		
	] = useI18Memo(wgweWords, 'wgwe');
	const { isOpen, setIsOpen, openECM } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { characterGroups, characterGroupDropoff } = useSelector((state: StateObject) => state.wg);
	const [hasDropoff, setHasDropoff] = useState<boolean>(false);
	const [dropoff, setDropoff] = useState<Zero_Fifty>(characterGroupDropoff);
	const [charGroupMap, setCharGroupMap] = useState<{ [key: string]: boolean }>({});

	useEffect(() => {
		const newMap: { [key: string]: boolean } = {};
		characterGroups.forEach((cg: WGCharGroupObject) => {
			newMap[cg.label] = true;
		});
		setCharGroupMap(newMap);
	}, [characterGroups]);

	const resetLabel = useCallback(() => resetError("label"), []);
	const resetTitle = useCallback(() => resetError("title"), []);
	const resetRun = useCallback(() => resetError("run"), []);

	const generateLabel = useCallback(() => {
		const el = $i<HTMLInputElement>("newWGCharGroupTitle");
		const words = (el ? el.value as string : "") // Get the title/description
			.trim() // trim leading/trailing whitespace
			.replace(/[$\\[\]{}.*+()?^|]/g, "") // remove invalid characters
			.toUpperCase() // uppercase everything
			.split(/[-\s_/]+/) // split along word and word-ish boundaries
		// Create an array of single character strings starting with the first characters
		//   of every word, followed by the remaining characters of every word
		const potentials = words.map(word => word[0]).concat(...words.map(word => word.slice(1).split('')));
		let label: string = "";
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
			const el = $i<HTMLInputElement>("newWGShortLabel");
			el && (el.value = label);
			resetError("label");
		}
	}, [charGroupMap, toast, tNoSuggest]);

	const maybeSaveNewCharGroup = useCallback((close: boolean = true) => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the newCharGroup
		const titleEl = $i<HTMLInputElement>("newWGCharGroupTitle");
		const title = titleEl ? titleEl.value.trim() : "";;
		const labelEl = $i<HTMLInputElement>("newWGShortLabel");
		const label = labelEl ? labelEl.value.trim() : "";;
		const runEl = $i<HTMLInputElement>("newWGCharGroupRun");
		const run = runEl ? runEl.value.trim() : "";;
		if(title === "") {
			const el = $q(".titleLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoTitle);
		}
		if(!label) {
			const el = $q(".labelLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoLabel);
		} else if (charGroupMap[label]) {
			const el = $q(".labelLabel");
			el && el.classList.add("invalidValue");
			err.push(tw("duplicateLabel", { label }));
		} else {
			const invalid = "^$\\[]{}.*+()?|";
			if (invalid.indexOf(label) !== -1) {
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
		close && setIsOpen(false);
		dispatch(addCharGroupWG({
			title,
			label,
			run,
			dropoffOverride: hasDropoff ? dropoff : undefined
		}));
		$a<HTMLInputElement>("ion-list.addWGCharGroup ion-input").forEach((input) => input.value = "");
		setHasDropoff(false);
		setDropoff(characterGroupDropoff);
		toaster({
			message: tThingAdd,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [
		charGroupMap, characterGroupDropoff, dispatch, doAlert, dropoff,
		hasDropoff, setIsOpen, tError, tCancel, toast, tw, tNoTitle,
		tNoRun, tThingAdd, tNoLabel
	]);
	const maybeSaveAndAdd = useCallback(() => maybeSaveNewCharGroup(false), [maybeSaveNewCharGroup]);
	const maybeSaveAndClose = useCallback(() => maybeSaveNewCharGroup(), [maybeSaveNewCharGroup]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const toggleDropoff = useCallback(() => setHasDropoff(!hasDropoff), [hasDropoff]);

	const doDropoff = useCallback((e: RangeCustomEvent) => setDropoff(e.detail.value as Zero_Fifty), []);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tAddThing} openECM={openECM} closeModal={setIsOpen} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels addWGCharGroup">
					<IonItem className="labelled">
						<IonLabel className="titleLabel">{tpTitleDesc}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitleDesc}
							id="newWGCharGroupTitle"
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
							id="newWGShortLabel"
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
						<IonLabel className="runLabel">{tpLettChar}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tLettChar}
							id="newWGCharGroupRun"
							className="ion-margin-top serifChars"
							helperText={tEnterChar}
							onIonChange={resetRun}
						/>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							justify="space-between"
							onIonChange={toggleDropoff}
							checked={hasDropoff}
						>{tUseDrop}</IonToggle>
					</IonItem>
					<IonItem id="charGroupDropoffAddCWG" className={hasDropoff ? "" : "hide"}>
						<IonRange
							min={0}
							max={50}
							pin={true}
							value={dropoff}
							onIonChange={doDropoff}
							debounce={250}
						>
							<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
							<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
						</IonRange>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="secondary"
						slot="end"
						onClick={maybeSaveAndAdd}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddThing}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={maybeSaveAndClose}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddClose}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddCharGroupModal;
