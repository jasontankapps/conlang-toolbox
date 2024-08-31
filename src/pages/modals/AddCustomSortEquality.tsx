import React, { FC, useCallback, useState } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonInput,
	IonFooter,
	useIonAlert,
	useIonToast,
	IonSelect,
	IonSelectOption,
	SelectCustomEvent
} from '@ionic/react';
import {
	closeCircleOutline,
	saveOutline,
	globeOutline
} from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';

import { EqualityObject, ExtraCharactersModalOpener, SetState, SortSeparator } from '../../store/types';

import toaster from '../../components/toaster';
import { $i } from '../../components/DollarSignExports';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';

interface CustomSortModal extends ExtraCharactersModalOpener {
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
	const [ tYouSure, tCancel, tClose, tExChar, tOk, tSave, tUnsaved, tYesDisc ] = useI18Memo(commons);

	const { isOpen, setIsOpen, openECM, setSavedEquality } = props;
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const maybeSaveEquality = useCallback(() => {
		const _base = $i<HTMLInputElement>("addBaseEquality");
		const base = (_base && _base.value) || "";
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
		const _equals = $i<HTMLInputElement>("addEquality");
		const equals = _equals && _equals.value ? _equals.value.split(separator) : [];
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
		_base && (_base.value = "");
		_equals && (_equals.value = "");
		setIsOpen(false);
		toaster({
			message: tThingAdded,
			position: "top",
			color: "success",
			duration: 2500,
			toast
		});
	}, [setIsOpen, doAlert, separator, setSavedEquality, tNoBase, tNoEqual, tOk, tThingAdded, toast]);
	const maybeCancel = useCallback(() => {
		const _base = $i<HTMLInputElement>("addBaseEquality");
		const _equals = $i<HTMLInputElement>("addEquality");
		if(_base && _equals && (_base.value + _equals.value)) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSure,
				submit: tYesDisc,
				cssClass: "warning",
				handler: () => {
					_base && (_base.value = "");
					_equals && (_equals.value = "");
					setIsOpen(false);
				},
				doAlert
			});
		}
		_base && (_base.value = "");
		_equals && (_equals.value = "");
		setIsOpen(false);
	}, [setIsOpen, doAlert, tUnsaved, tYesDisc, tYouSure]);
	const openEx = useCallback(() => openECM(true), [openECM]);
	const saveSep = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	return (
		<IonModal isOpen={isOpen} backdropDismiss={false}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tAddThing}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openEx} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={maybeCancel} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
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
			</IonContent>
			<IonFooter className="modalBorderTop">
				<IonToolbar>
					<IonButton
						color="warning"
						slot="start"
						onClick={maybeCancel}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={maybeSaveEquality}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tSave}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddCustomSortEquality;