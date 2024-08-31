import React, { FC, useCallback, useMemo, useState } from 'react';
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
	IonRadioGroup,
	IonRadio,
	IonItemDivider,
	useIonAlert,
	useIonToast,
	RadioGroupCustomEvent
} from '@ionic/react';
import {
	saveOutline,
	trashOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { ExtraCharactersModalOpener, SetState, StateObject, WETransformDirection, WETransformObject } from '../../../store/types';
import { editTransformWE, deleteTransformWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import { $i, $q } from '../../../components/DollarSignExports';
import ltr from '../../../components/LTR';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

interface ModalProps extends ExtraCharactersModalOpener {
	editing: null | WETransformObject
	setEditing: SetState<null | WETransformObject>
}

function resetError() {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q(".seekLabel");
	where && where.classList.remove("invalidValue");
}

const commons = [
	"Cancel", "error", "optional"
];
const translations = [
	"DescOfTheTransformation", "noSearchMsg",
	"WhatItChangesTo", "WhatToChange",
	"SaveTrans", "TransSaved", "EditTrans",
	"DeleteTrans", "TransDeleted"
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

const EditTransformModal: FC<ModalProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const [ tCancel, tError, tOptional ] = useI18Memo(commons);
	const [
		tDesc, tNoSeek, tReplace, tSeek, tSaveThing,
		tThingSave, tEditThing, tDelThing, tThingDel
	] = useI18Memo(translations, "wgwe");
	const tpTrDir = useMemo(() => t("TransformationDirection"), [t]);
	const [ tInOut, tIn, tInUnOut, tOut ] = useI18Memo(formals, "we", formal);
	const [ tInEx, tOutEx ] = useI18Memo(presentations, "we");
	const [ tpInEx, tpOutEx ] = useI18Memo(presentations, "we", context);
	const tpDesc = useMemo(() => tw("DescOfTheTransformation", context), [tw]);

	const { isOpen, setIsOpen, openECM, editing, setEditing } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();

	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings)
	const [ direction, setDirection ] = useState<WETransformDirection>("both");
	const [searchEl, setSearchEl] = useState<HTMLInputElement | null>(null);
	const [replaceEl, setReplaceEl] = useState<HTMLInputElement | null>(null);
	const [descEl, setDescEl] = useState<HTMLInputElement | null>(null);
	const onLoad = useCallback(() => {
		const _searchEl = $i<HTMLInputElement>("editSearchExWE");
		const _replaceEl = $i<HTMLInputElement>("editReplaceExWE");
		const _descEl = $i<HTMLInputElement>("editOptDescWE");
		if(editing) {
			const { seek, replace, description, direction } = editing;
			_searchEl && (_searchEl.value = seek);
			_replaceEl && (_replaceEl.value = replace);
			_descEl && (_descEl.value = description);
			setDirection(direction);
		} else {
			_searchEl && (_searchEl.value = "");
			_replaceEl && (_replaceEl.value = "");
			_descEl && (_descEl.value = "");
		}
		setSearchEl(_searchEl);
		setReplaceEl(_replaceEl);
		setDescEl(_descEl);
	}, [editing]);

	const cancelEditing = useCallback(() => {
		setIsOpen(false);
		setEditing(null);
	}, [setEditing, setIsOpen]);
	const maybeSaveNewTransformInfo = useCallback(() => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the editingTransform
		const seek = (searchEl && searchEl.value) || "";
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
		const replace = (replaceEl && replaceEl.value) || "";
		const description = (descEl && descEl.value.trim()) || "";
		dispatch(editTransformWE({
			id: editing!.id,
			seek,
			replace,
			direction,
			description
		}));
		cancelEditing();
		toaster({
			message: tThingSave,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [cancelEditing, descEl, direction, dispatch, doAlert, editing, replaceEl, searchEl, tCancel, tError, tNoSeek, tThingSave, toast]);
	const maybeDeleteTransform = useCallback(() => {
		const makeArrow = (dir: string) => (
			dir === "both" ?
				"⟷"
			:
				((ltr() ? dir === "in" : dir === "out") ? "⟶" : "⟵")
		);
		const groups = $q<HTMLIonListElement>((".transforms"));
		groups && groups.closeSlidingItems();
		const handler = () => {
			dispatch(deleteTransformWE(editing!.id));
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
			const { seek, direction, replace } = editing!;
			yesNoAlert({
				header: `${seek} ${makeArrow(direction)} ${replace}`,
				message: tc("deleteThisCannotUndo"),
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [cancelEditing, disableConfirms, dispatch, doAlert, editing, tThingDel, tc, toast]);
	const setDir = useCallback((e: RadioGroupCustomEvent) => setDirection(e.detail.value as WETransformDirection), []);

	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={cancelEditing}
			onIonModalDidPresent={onLoad}
		>
			<ModalHeader title={tEditThing} openECM={openECM} closeModal={cancelEditing} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels">
					<IonItem className="labelled">
						<IonLabel className="seekLabel">{tpInEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tInEx}
							helperText={tSeek}
							id="editSearchExWE"
							className="ion-margin-top serifChars"
							onIonChange={resetError}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="replaceLabel">{tpOutEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tOutEx}
							helperText={tReplace}
							id="editReplaceExWE"
							className="ion-margin-top serifChars"
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel>{tpDesc}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tDesc}
							id="editOptDescWE"
							className="ion-margin-top"
							placeholder={tOptional}
						></IonInput>
					</IonItem>
					<IonItemDivider>
						<IonLabel>{tpTrDir}</IonLabel>
					</IonItemDivider>
					<IonRadioGroup
						value={direction}
						onIonChange={setDir}
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
						onClick={maybeSaveNewTransformInfo}
					>
						<IonIcon icon={saveOutline} slot="start" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonButton>
					<IonButton
						color="danger"
						slot="start"
						onClick={maybeDeleteTransform}
					>
						<IonIcon icon={trashOutline} slot="start" />
						<IonLabel>{tDelThing}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditTransformModal;
