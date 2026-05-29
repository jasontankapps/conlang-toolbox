import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
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

import { ModalProperties, StateObject, WGCharGroupObject, Zero_Fifty } from '../../../store/types';
import { addCharGroupWG } from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

const presentations = ["LettersCharacters", "ShortLabel", "TitleOrDesc" ];
const context = { context: "presentation" };


const commons = [ "error", "Cancel" ];

const wgweWords = [
	"OneCharOnly", "AddCharGroup", "enterCharsInGroupHere",
	"LettersCharacters", "noRunMsg", "noTitleMsg", "ShortLabel",
	"Suggest", "TitleOrDesc", "noLabelMsg",
	"cantMakeLabelMsg", "CharGroupSaved"
];

const AddCharGroupModal: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tw ] = useTranslator('wgwe');
	const [ tpLettChar, tpShort, tpTitleDesc ] = useI18Memo(presentations, 'wgwe', context);
	const [ tError, tCancel ] = useI18Memo(commons);
	const tUseDrop = useMemo(() => t("useSepDropoffRate"), [t]);
	const [
		t1Char, tAddThing, tEnterChar, tLettChar, tNoRun, tNoTitle,
		tShort, tSuggest, tTitleDesc, tNoLabel, tNoSuggest, tThingAdd		
	] = useI18Memo(wgweWords, 'wgwe');
	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { characterGroups, characterGroupDropoff } = useSelector((state: StateObject) => state.wg);
	const [hasDropoff, setHasDropoff] = useState<boolean>(false);
	const [dropoff, setDropoff] = useState<Zero_Fifty>(characterGroupDropoff);
	const [charGroupMap, setCharGroupMap] = useState<{ [key: string]: boolean }>({});
	const [titleLabel, titleLabelRef] = useElement<HTMLIonLabelElement>();
	const [labelLabel, labelLabelRef] = useElement<HTMLDivElement>();
	const [runLabel, runLabelRef] = useElement<HTMLIonLabelElement>();
	const [newWGCharGroupTitle, newWGCharGroupTitleRef] = useElement<HTMLIonInputElement>();
	const [newWGShortLabel, newWGShortLabelRef] = useElement<HTMLIonInputElement>();
	const [newWGCharGroupRun, newWGCharGroupRunRef] = useElement<HTMLIonInputElement>();

	useEffect(() => {
		const newMap: { [key: string]: boolean } = {};
		characterGroups.forEach((cg: WGCharGroupObject) => {
			newMap[cg.label] = true;
		});
		setCharGroupMap(newMap);
	}, [characterGroups]);

	const generateLabel = useCallback(() => {
		const words = getSetValue(newWGCharGroupTitle) // Get the title/description
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
			getSetValue(newWGShortLabel, label);
			labelLabel && labelLabel.classList.remove("invalidValue")
		}
	}, [charGroupMap, toast, tNoSuggest, newWGCharGroupTitle, newWGShortLabel, labelLabel]);

	const maybeSaveNewCharGroup = useCallback((close: boolean = true) => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the newCharGroup
		const title = getSetValue(newWGCharGroupTitle).trim();
		const label = getSetValue(newWGShortLabel).trim();
		const run = getSetValue(newWGCharGroupRun).trim();
		if(title === "") {
			if(titleLabel) { titleLabel.classList.add("invalidValue"); }
			err.push(tNoTitle);
		}
		if(!label) {
			if(labelLabel) { labelLabel.classList.add("invalidValue"); }
			err.push(tNoLabel);
		} else if (charGroupMap[label]) {
			if(labelLabel) { labelLabel.classList.add("invalidValue"); }
			err.push(tw("duplicateLabel", { label }));
		} else {
			const invalid = "^$\\[]{}.*+()?|";
			if (invalid.indexOf(label) !== -1) {
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
		if(close) { setIsOpen(false); }
		dispatch(addCharGroupWG({
			title,
			label,
			run,
			dropoffOverride: hasDropoff ? dropoff : undefined
		}));
		getSetValue(newWGCharGroupTitle, "");
		getSetValue(newWGShortLabel, "");
		getSetValue(newWGCharGroupRun, "");
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
		tNoRun, tThingAdd, tNoLabel, titleLabel, labelLabel, runLabel,
		newWGCharGroupRun, newWGCharGroupTitle, newWGShortLabel
	]);
	const maybeSaveAndAdd = useCallback(() => maybeSaveNewCharGroup(false), [maybeSaveNewCharGroup]);
	const maybeSaveAndClose = useCallback(() => maybeSaveNewCharGroup(), [maybeSaveNewCharGroup]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const toggleDropoff = useCallback(() => setHasDropoff(!hasDropoff), [hasDropoff]);

	const doDropoff = useCallback((e: RangeCustomEvent) => setDropoff(e.detail.value as Zero_Fifty), []);

	return (
		<Modal
			isOpen={isOpen}
			closeFunc={closer}
			extraChars
			title={tAddThing}
			bottomEnd={[
				{ button: "add", action: maybeSaveAndAdd, color: "secondary" },
				{ button: "add+close", action: maybeSaveAndClose }
			]}
		>
			<IonList lines="none" className="hasSpecialLabels addWGCharGroup">
				<IonItem className="labelled">
					<IonLabel className="titleLabel" ref={titleLabelRef}>{tpTitleDesc}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitleDesc}
						id="newWGCharGroupTitle"
						ref={newWGCharGroupTitleRef}
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
						id="newWGShortLabel"
						ref={newWGShortLabelRef}
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
					<IonLabel className="runLabel" ref={runLabelRef}>{tpLettChar}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tLettChar}
						id="newWGCharGroupRun"
						ref={newWGCharGroupRunRef}
						className="ion-margin-top serifChars"
						helperText={tEnterChar}
						onIonChange={() => runLabel && runLabel.classList.remove("invalidValue")}
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
		</Modal>
	);
};

export default AddCharGroupModal;
