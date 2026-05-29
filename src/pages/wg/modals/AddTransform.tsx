import React, { useCallback, FC } from 'react';
import {
	IonItem,
	IonLabel,
	IonList,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { addTransformWG } from '../../../store/wgSlice';
import { ModalProperties } from '../../../store/types';

import repairRegexErrors from '../../../components/RepairRegex';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';


const wgweWords = [
	"DescOfTheTransformation", "noSearchMsg",
	"replacementExpression", "searchExpression",
	"TransformationAdded", "AddTransformation"
];

const presentational = [
	"DescOfTheTransformation",
	"replacementExpression", "searchExpression"
];
const context = { context: "presentation" };

const commons = [
	"Cancel", "error", "optional"
];

const AddTransformModal: FC<ModalProperties> = (props) => {
	const [ tCancel, tError, tOptional ] = useI18Memo(commons);
	const [ tTransDesc, tNoSearch, tRepl, tSrch, tThingAdd, tAddThing ] = useI18Memo(wgweWords, "wgwe");
	const [ tpTrandDesc, tpRepl, tpSrch ] = useI18Memo(presentational, "wgwe", context);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [seekLabel, seekLabelRef] = useElement<HTMLIonLabelElement>();
	const [searchEx, searchExRef] = useElement<HTMLIonInputElement>();
	const [replaceEx, replaceExRef] = useElement<HTMLIonInputElement>();
	const [optDesc, optDescRef] = useElement<HTMLIonInputElement>();

	const maybeSaveNewTransform = useCallback((close: boolean = true) => {
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the newTransform
		const seek = getSetValue(searchEx);
		if(seek === "") {
			if(seekLabel) { seekLabel.classList.add("invalidValue"); }
			err.push(tNoSearch);
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
		const replace = repairRegexErrors(getSetValue(replaceEx));
		const description = getSetValue(optDesc);
		if(close) { setIsOpen(false); }
		dispatch(addTransformWG({
			id: uuidv4(),
			seek: repairRegexErrors(seek),
			replace,
			description
		}));
		getSetValue(searchEx, "");
		getSetValue(replaceEx, "");
		getSetValue(optDesc, "");
		toaster({
			message: tThingAdd,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [
		dispatch, doAlert, setIsOpen, toast, tThingAdd,
		tCancel, tError, tNoSearch, searchEx, replaceEx,
		optDesc, seekLabel
	]);
	const maybeSaveAndAdd = useCallback(() => maybeSaveNewTransform(false), [maybeSaveNewTransform]);
	const maybeSaveAndClose = useCallback(() => maybeSaveNewTransform(), [maybeSaveNewTransform]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);

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
			<IonList lines="none" className="hasSpecialLabels wgAddTransform">
				<IonItem className="labelled">
					<IonLabel className="seekLabel" ref={seekLabelRef}>{tpSrch}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tSrch}
						id="searchEx"
						ref={searchExRef}
						className="ion-margin-top serifChars"
						onIonChange={() => seekLabel && seekLabel.classList.remove("invalidValue")}
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="replaceLabel">{tpRepl}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tRepl}
						id="replaceEx"
						ref={replaceExRef}
						className="ion-margin-top serifChars"
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel>{tpTrandDesc}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTransDesc}
						id="optDesc"
						ref={optDescRef}
						className="ion-margin-top"
						placeholder={tOptional}
					></IonInput>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default AddTransformModal;
