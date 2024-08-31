import React, { useCallback, FC } from 'react';
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
import { addOutline } from 'ionicons/icons';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { addTransformWG } from '../../../store/wgSlice';
import { ExtraCharactersModalOpener } from '../../../store/types';

import { $q, $a, $i } from '../../../components/DollarSignExports';
import repairRegexErrors from '../../../components/RepairRegex';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

function resetError() {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q(".seekLabel");
	where && where.classList.remove("invalidValue");
}

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
	"AddAndClose", "Cancel", "error", "optional"
];

const AddTransformModal: FC<ExtraCharactersModalOpener> = (props) => {
	const [ tAddClose, tCancel, tError, tOptional ] = useI18Memo(commons);
	const [ tTransDesc, tNoSearch, tRepl, tSrch, tThingAdd, tAddThing ] = useI18Memo(wgweWords, "wgwe");
	const [ tpTrandDesc, tpRepl, tpSrch ] = useI18Memo(presentational, "wgwe", context);

	const { isOpen, setIsOpen, openECM } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();

	const maybeSaveNewTransform = useCallback((close: boolean = true) => {
		const searchEl = $i<HTMLInputElement>("searchEx");
		const err: string[] = [];
		// Test info for validness, then save if needed and reset the newTransform
		const seek = (searchEl && searchEl.value) || "";
		if(seek === "") {
			const el = $q(".seekLabel");
			el && el.classList.add("invalidValue");
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
		const descEl = $i<HTMLInputElement>("optDesc");
		const replaceEl = $i<HTMLInputElement>("replaceEx");
		const replace = repairRegexErrors((replaceEl && replaceEl.value) || "");
		const description = (descEl && descEl.value) || "";
		close && setIsOpen(false);
		dispatch(addTransformWG({
			id: uuidv4(),
			seek: repairRegexErrors(seek),
			replace,
			description
		}));
		$a<HTMLInputElement>("ion-list.wgAddTransform ion-input").forEach((input) => input.value = "");
		toaster({
			message: tThingAdd,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [dispatch, doAlert, setIsOpen, toast, tThingAdd, tCancel, tError, tNoSearch]);
	const maybeSaveAndAdd = useCallback(() => maybeSaveNewTransform(false), [maybeSaveNewTransform]);
	const maybeSaveAndClose = useCallback(() => maybeSaveNewTransform(), [maybeSaveNewTransform]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tAddThing} openECM={openECM} closeModal={setIsOpen} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels wgAddTransform">
					<IonItem className="labelled">
						<IonLabel className="seekLabel">{tpSrch}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tSrch}
							id="searchEx"
							className="ion-margin-top serifChars"
							onIonChange={resetError}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="replaceLabel">{tpRepl}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tRepl}
							id="replaceEx"
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
							className="ion-margin-top"
							placeholder={tOptional}
						></IonInput>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="tertiary"
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

export default AddTransformModal;
