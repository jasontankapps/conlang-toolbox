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

import { EqualityObject, ModalProperties, SetState, SortSeparator } from '../../store/types';

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface CustomSortModal extends ModalProperties {
	setSavedEquality: SetState<EqualityObject | null>
}

const translations = [
	"Basecharacter", "CharsEqual", "EqualityAdded",
	"CharsToBeEqual", "Comma", "NoSeparator", "Period",
	"Semicolon", "Space", "TheBaseCharacter",
	"noBaseCharMsg",
	"noEqualCharMsg", "BaseChar",
	"CharsSeparator", "BaseEqual", "AddEquality"
];

const commons = [
	"MaybeDiscardThing", "Cancel", "Close",
	"ExtraChars", "Ok", "Save", "UnsavedInfo", "YesDiscard"
];

const AddCustomSortEquality: FC<CustomSortModal> = (props) => {
	const [
		tBase, tCharBase, tThingAdded, tCharEqual, tComma, tNoSep, tPeriod,
		tSemi, tSpace, tTheBase, tNoBase, tNoEqual, tpBase, tpSep, tpEqual,
		tAddThing
	] = useI18Memo(translations, "settings");
	const [ tYouSure, tOk, tUnsaved, tYesDisc ] = useI18Memo(commons);

	const { isOpen, setIsOpen, setSavedEquality } = props;
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [addBaseEquality, addBaseEqualityRef] = useElement<HTMLIonInputElement>();
	const [addEquality, addEqualityRef] = useElement<HTMLIonInputElement>();
	const maybeSaveEquality = useCallback(() => {
		const base = getSetValue(addBaseEquality);
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
		const equals = getSetValue(addEquality).split(separator);
		if(!equals.length) {
			doAlert({
				message: tNoEqual,
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
		const equality: EqualityObject = { id: uuidv4(), base, equals, separator };
		setSavedEquality(equality);
		getSetValue(addBaseEquality, "");
		getSetValue(addEquality, "");
		setIsOpen(false);
		toaster({
			message: tThingAdded,
			position: "top",
			color: "success",
			duration: 2500,
			toast
		});
	}, [
		setIsOpen, doAlert, separator, setSavedEquality,
		tNoBase, tNoEqual, tOk, tThingAdded, toast,
		addBaseEquality, addEquality
	]);
	const maybeCancel = useCallback(() => {
		if(getSetValue(addBaseEquality) || getSetValue(addEquality)) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSure,
				submit: tYesDisc,
				cssClass: "warning",
				handler: () => {
					getSetValue(addBaseEquality, "");
					getSetValue(addEquality, "");
					setIsOpen(false);
				},
				doAlert
			});
		}
		getSetValue(addBaseEquality, "");
		getSetValue(addEquality, "");
		setIsOpen(false);
	}, [setIsOpen, doAlert, tUnsaved, tYesDisc, tYouSure, addBaseEquality, addEquality]);
	const saveSep = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	return (
		<Modal
			isOpen={isOpen}
			closeFunc={maybeCancel}
			enclosed
			title={tAddThing}
			bottomEnd={[{button: "add", action: maybeSaveEquality}]}
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
						id="addBaseEquality"
						placeholder={tTheBase}
						ref={addBaseEqualityRef}
					/>
				</IonItem>
				<IonItem className="labelled" lines="none">
					<IonLabel>{tpEqual}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tCharBase}
						id="addEquality"
						placeholder={tCharEqual}
						ref={addEqualityRef}
					/>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tpSep}
						value={separator}
						onIonChange={saveSep}
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

export default AddCustomSortEquality;