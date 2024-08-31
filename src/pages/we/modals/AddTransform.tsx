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
	IonItemDivider,
	IonRadioGroup,
	IonRadio,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { WETransformDirection, ExtraCharactersModalOpener } from '../../../store/types';
import { addTransformWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import { $q, $a, $i } from '../../../components/DollarSignExports';
import toaster from '../../../components/toaster';
import ModalHeader from '../../../components/ModalHeader';
import useI18Memo from '../../../components/useI18Memo';

function resetError() {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q(".seekLabel");
	where && where.classList.remove("invalidValue");
}

const commons = [
	"AddAndClose", "Cancel", "error", "optional"
];
const translations = [
	"DescOfTheTransformation", "noSearchMsg",
	"WhatItChangesTo", "WhatToChange",
	"TransformationAdded", "AddTransformation"
];
const formals = [
	"atInputAtOutput", "atInput",
	"atInputUndoOutput", "atOutput"
];
const presentations = [
	"InputExpression", "OutputExpression"
];
const formal = { context: "formal" };
const context = { context: "presentation" };

const AddTransformModal: FC<ExtraCharactersModalOpener> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tw ] = useTranslator('wgwe');
	const [ tAddClose, tCancel, tError, tOptional ] = useI18Memo(commons);
	const [ tDesc, tNoSeek, tReplace, tSeek, tThingAdd, tAddThing ] = useI18Memo(translations, "wgwe");
	const tpTrDir = useMemo(() => t("TransformationDirection"), [t]);
	const [ tInOut, tIn, tInUnOut, tOut ] = useI18Memo(formals, "we", formal);
	const [ tInEx, tOutEx ] = useI18Memo(presentations, "we");
	const [ tpInEx, tpOutEx ] = useI18Memo(presentations, "we", context);
	const tpDesc = useMemo(() => tw("DescOfTheTransformation", context), [tw]);

	const { isOpen, setIsOpen, openECM } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [ direction, setDirection ] = useState<WETransformDirection>("both");

	const maybeSaveNewTransform = useCallback((close: boolean = true) => {
		const err: string[] = [];
		const seekEl = $i<HTMLInputElement>("searchExWE");
		const seek = seekEl ? seekEl.value : "";
		// Test info for validness, then save if needed and reset the newTransform
		if(seek === "") {
			const el = $q(".seekLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoSeek);
		}
		try {
			new RegExp(seek);
		} catch(e) {
			err.push(`${e}`);
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
		const replaceEl = $i<HTMLInputElement>("replaceExWE");
		const replace = replaceEl ? replaceEl.value : "";
		const descriptionEl = $i<HTMLInputElement>("optDescWE");
		const description = descriptionEl ? descriptionEl.value : "";
		close && setIsOpen(false);
		dispatch(addTransformWE({
			id: uuidv4(),
			seek,
			replace,
			direction,
			description
		}));
		$a<HTMLInputElement>("ion-list.weAddTransform ion-input").forEach((input) => input.value = "");
		const el = $q<HTMLInputElement>("ion-list.weAddTransform ion-radio-group");
		el && (el.value = "both");
		toaster({
			message: tThingAdd,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [direction, dispatch, doAlert, setIsOpen, tCancel, tError, tNoSeek, tThingAdd, toast]);
	const saveClose = useCallback(() => maybeSaveNewTransform(), [maybeSaveNewTransform]);
	const saveAdd = useCallback(() => maybeSaveNewTransform(false), [maybeSaveNewTransform]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tAddThing} openECM={openECM} closeModal={setIsOpen} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels weAddTransform">
					<IonItem className="labelled">
						<IonLabel className="seekLabel">{tpInEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tInEx}
							id="searchExWE"
							className="ion-margin-top serifChars"
							helperText={tSeek}
							onIonChange={resetError}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="replaceLabel">{tpOutEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tOutEx}
							id="replaceExWE"
							className="ion-margin-top serifChars"
							helperText={tReplace}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel>{tpDesc}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tDesc}
							id="optDescWE"
							className="ion-margin-top"
							placeholder={tOptional}
						></IonInput>
					</IonItem>
					<IonItemDivider>
						<IonLabel>{tpTrDir}</IonLabel>
					</IonItemDivider>
					<IonRadioGroup
						value={direction}
						onIonChange={e => setDirection(e.detail.value as WETransformDirection)}
					>
						<IonItem>
							<IonRadio
								value="both"
								labelPlacement="end"
								justify="start"
							>{tInUnOut}</IonRadio>
						</IonItem>
						<IonItem>
							<IonRadio
								value="double"
								labelPlacement="end"
								justify="start"
							>{tInOut}</IonRadio>
						</IonItem>
						<IonItem>
							<IonRadio
								value="in"
								labelPlacement="end"
								justify="start"
							>{tIn}</IonRadio>
						</IonItem>
						<IonItem>
							<IonRadio
								value="out"
								labelPlacement="end"
								justify="start"
							>{tOut}</IonRadio>
						</IonItem>
					</IonRadioGroup>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="tertiary"
						slot="end"
						onClick={saveAdd}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddThing}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={saveClose}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddClose}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddTransformModal;
