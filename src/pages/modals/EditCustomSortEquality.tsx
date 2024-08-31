import React, { useCallback, useState, FC } from 'react';
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
	globeOutline,
	trashOutline
} from 'ionicons/icons';

import { ExtraCharactersModalOpener, EqualityObject, SortSeparator, SetState } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import toaster from '../../components/toaster';
import { $i } from '../../components/DollarSignExports';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';

interface CustomSortModal extends ExtraCharactersModalOpener {
	incomingEquality: EqualityObject | null
	setOutgoingEquality: SetState<EqualityObject | null | string>
}

const translations = [
	"Basecharacter", "CharsEqual",
	"CharsToBeEqual", "Comma", "NoSeparator", "Period",
	"Semicolon", "Space", "TheBaseCharacter",
	"noBaseCharMsg",
	"noEqualCharMsg",
	"BaseChar", "BaseEqual", "EqualsSeparator",
	"DeleteEquality", "EqualityEdited", "EditEquality"
]

const commons = [
	"Close", "Delete", "ExtraChars", "Ok", "Save",
	"areYouSure", "emphasizedError"
];

const EditCustomSortEquality: FC<CustomSortModal> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tClose, tDelete, tExChar, tOk, tSave, tRUSure, tError
	] = useI18Memo(commons);
	const [
		tBase, tCharEqual, tCharsToBeEqual, tComma, tNoSep, tPeriod,
		tSemi, tSpace, tTheBase, tNoBase, tNoEqual, tpBase, tpEqual,
		tpSep, tDelThing, tThingEdited, tEditThing
	] = useI18Memo(translations, "settings");

	const { isOpen, setIsOpen, openECM, incomingEquality, setOutgoingEquality } = props;
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [_base, setBase] = useState<HTMLInputElement | null>(null);
	const [_equals, setEquals] = useState<HTMLInputElement | null>(null);
	const onLoad = useCallback(() => {
		const {
			separator = ",",
			base = tError,
			equals = [tError]
		} = incomingEquality || {};
		setSeparator(separator);
		const _base = $i<HTMLInputElement>("editBaseEquality");
		const _equals = $i<HTMLInputElement>("editEqualsEquality");
		setBase(_base);
		setEquals(_equals);
		_base && (_base.value = base);
		_equals && (_equals.value = equals.join(separator));
	}, [incomingEquality, tError]);
	const close = useCallback(() => {
		_base && (_base.value = "");
		_equals && (_equals.value = "");
		setIsOpen(false);
	}, [setIsOpen, _base, _equals]);
	const maybeSaveEquality = useCallback(() => {
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
		const equals = _equals && _equals.value ? _equals.value.split(separator) : [];
		if(equals.length === 0) {
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
		const equality: EqualityObject = { id: incomingEquality!.id, base, equals, separator };
		setOutgoingEquality(equality);
		close();
		toaster({
			message: tThingEdited,
			position: "top",
			color: "success",
			duration: 2000,
			toast
		});
	}, [_base, _equals, close, doAlert, incomingEquality, separator, setOutgoingEquality, tNoBase, tNoEqual, tOk, tThingEdited, toast]);
	const maybeDelete = useCallback(() => {
		const handler = () => {
			setOutgoingEquality(incomingEquality!.id);
			close();
		};
		yesNoAlert({
			header: tDelThing,
			message: tRUSure,
			submit: tc("confirmDel", { count: 1 }),
			cssClass: "danger",
			handler,
			doAlert
		});
	}, [close, doAlert, incomingEquality, setOutgoingEquality, tc, tDelThing, tRUSure]);
	const openEx = useCallback(() => openECM(true), [openECM]);
	const doSetSep = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	return (
		<IonModal isOpen={isOpen} backdropDismiss={false} onIonModalDidPresent={onLoad}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tEditThing}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openEx} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={close} aria-label={tClose}>
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
							id="editBaseEquality"
							placeholder={tTheBase}
						/>
					</IonItem>
					<IonItem
						className="labelled"
						lines="none"
					>
						<IonLabel>{tpEqual}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tCharEqual}
							id="editEqualsEquality"
							placeholder={tCharsToBeEqual}
						/>
					</IonItem>
					<IonItem className="wrappableInnards">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpSep}
							value={separator}
							onIonChange={doSetSep}
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
						color="danger"
						slot="start"
						onClick={maybeDelete}
					>
						<IonIcon icon={trashOutline} slot="end" />
						<IonLabel>{tDelete}</IonLabel>
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

export default EditCustomSortEquality;
