import React, { FC, useCallback, useMemo, useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonList,
	IonInput,
	IonRadioGroup,
	IonRadio,
	IonItemDivider,
	useIonAlert,
	useIonToast,
	RadioGroupCustomEvent
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import { ModalProperties, SetState, StateObject, WETransformDirection, WETransformObject } from '../../../store/types';
import { editTransformWE, deleteTransformWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import ltr from '../../../components/LTR';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

interface ModalProps extends ModalProperties {
	editing: null | WETransformObject
	setEditing: SetState<null | WETransformObject>
}

const commons = [
	"Cancel", "error", "optional"
];
const translations = [
	"DescOfTheTransformation", "noSearchMsg",
	"WhatItChangesTo", "WhatToChange",
	"TransSaved", "EditTrans",
	"TransDeleted"
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
		tDesc, tNoSeek, tReplace, tSeek,
		tThingSave, tEditThing, tThingDel
	] = useI18Memo(translations, "wgwe");
	const tpTrDir = useMemo(() => t("TransformationDirection"), [t]);
	const [ tInOut, tIn, tInUnOut, tOut ] = useI18Memo(formals, "we", formal);
	const [ tInEx, tOutEx ] = useI18Memo(presentations, "we");
	const [ tpInEx, tpOutEx ] = useI18Memo(presentations, "we", context);
	const tpDesc = useMemo(() => tw("DescOfTheTransformation", context), [tw]);
	const [seekLabel, seekLabelRef] = useElement<HTMLIonLabelElement>();
	const [editSearchExWE, editSearchExWERef] = useElement<HTMLIonInputElement>();
	const [editReplaceExWE, editReplaceExWERef] = useElement<HTMLIonInputElement>();
	const [editOptDescWE, editOptDescWERef] = useElement<HTMLIonInputElement>();

	const { isOpen, setIsOpen, editing, setEditing } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();

	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings)
	const [ direction, setDirection ] = useState<WETransformDirection>("both");
	const onLoad = useCallback(() => {
		if(editing) {
			const { seek, replace, description, direction } = editing;
			getSetValue(editSearchExWE, seek);
			getSetValue(editReplaceExWE, replace);
			getSetValue(editOptDescWE, description);
			setDirection(direction);
		} else {
			getSetValue(editSearchExWE, "");
			getSetValue(editReplaceExWE, "");
			getSetValue(editOptDescWE, "");
		}
	}, [editing, editSearchExWE, editReplaceExWE, editOptDescWE]);

	const cancelEditing = useCallback(() => {
		setIsOpen(false);
		setEditing(null);
	}, [setEditing, setIsOpen]);
	const maybeSaveNewTransformInfo = useCallback(() => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the editingTransform
		const seek = getSetValue(editSearchExWE);
		if(seek === "") {
			seekLabel && seekLabel.classList.add("invalidValue");
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
		const replace = getSetValue(editReplaceExWE);
		const description = getSetValue(editOptDescWE).trim();
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
	}, [
		cancelEditing, direction, dispatch, doAlert,
		editing, tCancel, tError, tNoSeek, tThingSave,
		toast, editSearchExWE, editReplaceExWE,
		editOptDescWE, seekLabel
	]);
	const maybeDeleteTransform = useCallback(() => {
		const makeArrow = (dir: string) => (
			dir === "both" ?
				"⟷"
			:
				((ltr() ? dir === "in" : dir === "out") ? "⟶" : "⟵")
		);
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
		<Modal
			isOpen={isOpen}
			title={tEditThing}
			closeFunc={cancelEditing}
			onIonModalDidPresent={onLoad}
			bottomStart={[{button: "delete", action: maybeDeleteTransform}]}
			bottomEnd={[{button: "save", action: maybeSaveNewTransformInfo}]}
			extraChars
		>
			<IonList lines="none" className="hasSpecialLabels">
				<IonItem className="labelled">
					<IonLabel className="seekLabel" ref={seekLabelRef}>{tpInEx}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tInEx}
						helperText={tSeek}
						id="editSearchExWE"
						ref={editSearchExWERef}
						className="ion-margin-top serifChars"
						onIonChange={() => seekLabel && seekLabel.classList.remove("invalidValue")}
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
						ref={editReplaceExWERef}
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
						ref={editOptDescWERef}
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
		</Modal>
	);
};

export default EditTransformModal;
