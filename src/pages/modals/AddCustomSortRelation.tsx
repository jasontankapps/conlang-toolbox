import React, { FC, useCallback, useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonList,
	IonInput,
	useIonAlert,
	useIonToast,
	IonSelect,
	IonSelectOption,
	SelectCustomEvent
} from '@ionic/react';
import { v4 as uuidv4 } from 'uuid';

import { ModalProperties, RelationObject, SetState, SortSeparator } from '../../store/types';

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface CustomSortModal extends ModalProperties {
	setSavedRelation: SetState<RelationObject | null>
}

const translations = [
	"Basecharacter", "CharsPostBase",
	"CharsPreBase", "Comma", "RelationAdded",
	"charsPreBaseMsg", "NoSeparator", "Period",
	"Semicolon", "Space", "charsPostBaseMsg",
	"TheBaseCharacter", "noBaseCharMsg",
	"noPostPreCharMsg",
	"BaseChar", "PrePostSeparator", "SortedAfterBase",
	"SortedBeforeBase", "AddRelation"
];
const commons = [
	"MaybeDiscardThing", "Cancel", "Close",
	"ExtraChars", "Ok", "Save", "UnsavedInfo", "YesDiscard"
];

const AddCustomSortRelation: FC<CustomSortModal> = (props) => {
	const [ tYouSure, tOk, tUnsaved, tYesDisc ] = useI18Memo(commons);
	const [
		tBase, tAfterBase, tBeforeBase, tComma, tThingAdded, tEndBefore, tNoSep,
		tPeriod, tSemi, tSpace, tStartAfter, tTheBase, tNoBase, tNoPrePost,
		tpBase, tpSep, tpAfter, tpBefore, tAddThing
	] = useI18Memo(translations, "settings");

	const { isOpen, setIsOpen, setSavedRelation } = props;
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [addBaseRelation, addBaseRelationRef] = useElement<HTMLIonInputElement>();
	const [addPreRelation, addPreRelationRef] = useElement<HTMLIonInputElement>();
	const [addPostRelation, addPostRelationRef] = useElement<HTMLIonInputElement>();
	const maybeSaveRelation = useCallback(() => {
		const base = getSetValue(addBaseRelation);
		if(!base) {
			doAlert({
				message: tNoBase,
				cssClass: "danger",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "submit"
					}
				]
			})
			return;
		}
		const pre = getSetValue(addPreRelation).split(separator);
		const post = getSetValue(addPostRelation).split(separator);
		if(!(pre.length + post.length)) {
			doAlert({
				message: tNoPrePost,
				cssClass: "danger",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "submit"
					}
				]
			})
			return;
		}
		const relation: RelationObject = { id: uuidv4(), base, pre, post, separator };
		setSavedRelation(relation);
		getSetValue(addBaseRelation, "");
		getSetValue(addPreRelation, "");
		getSetValue(addPostRelation, "");
		setIsOpen(false);
		toaster({
			message: tThingAdded,
			position: "top",
			color: "success",
			duration: 2500,
			toast
		});
	}, [
		doAlert, separator, setIsOpen, setSavedRelation,
		tNoBase, tNoPrePost, tOk, tThingAdded, toast,
		addBaseRelation, addPreRelation, addPostRelation
	]);
	const maybeCancel = useCallback(() => {
		if(getSetValue(addBaseRelation) || getSetValue(addPreRelation) || getSetValue(addPostRelation)) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSure,
				submit: tYesDisc,
				cssClass: "warning",
				handler: () => {
					getSetValue(addBaseRelation, "");
					getSetValue(addPreRelation, "");
					getSetValue(addPostRelation, "");
					setIsOpen(false);
				},
				doAlert
			});
		}
		getSetValue(addBaseRelation, "");
		getSetValue(addPreRelation, "");
		getSetValue(addPostRelation, "");
		setIsOpen(false);
	}, [
		doAlert, setIsOpen, tUnsaved, tYesDisc, tYouSure,
		addBaseRelation, addPreRelation, addPostRelation
	]);
	const doSetSeparator = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);

	return (
		<Modal
			isOpen={isOpen}
			closeFunc={maybeCancel}
			enclosed
			title={tAddThing}
			bottomEnd={[{button: "add", action: maybeSaveRelation}]}
			bottomStart={[{button: "cancel"}]}
			extraChars
		>
			<IonList lines="full" className="hasSpecialLabels">
				<IonItem>
					<div
						slot="start"
						className="ion-margin-end"
					>{tpBase}</div>
					<IonInput
						aria-label={tBase}
						id="addBaseRelation"
						placeholder={tTheBase}
						ref={addBaseRelationRef}
					/>
				</IonItem>
				<IonItem className="labelled" lines="none">
					<IonLabel>{tpBefore}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tBeforeBase}
						id="addPreRelation"
						helperText={tEndBefore}
						ref={addPreRelationRef}
					/>
				</IonItem>
				<IonItem className="labelled" lines="none">
					<IonLabel>{tpAfter}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tAfterBase}
						id="addPostRelation"
						helperText={tStartAfter}
						ref={addPostRelationRef}
					/>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tpSep}
						value={separator}
						onIonChange={doSetSeparator}
					>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value=""
						>{tNoSep}</IonSelectOption>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value=" "
						>{tSpace}</IonSelectOption>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value=","
						>{tComma}</IonSelectOption>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value="."
						>{tPeriod}</IonSelectOption>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value=";"
						>{tSemi}</IonSelectOption>
					</IonSelect>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default AddCustomSortRelation;
