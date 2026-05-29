import React, { useCallback, useState, FC } from 'react';
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

import { EqualityObject, SortSeparator, SetState, ModalProperties } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface CustomSortModal extends ModalProperties {
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
	"Ok", "areYouSure", "emphasizedError"
];

const EditCustomSortEquality: FC<CustomSortModal> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tOk, tRUSure, tError
	] = useI18Memo(commons);
	const [
		tBase, tCharEqual, tCharsToBeEqual, tComma, tNoSep, tPeriod,
		tSemi, tSpace, tTheBase, tNoBase, tNoEqual, tpBase, tpEqual,
		tpSep, tDelThing, tThingEdited, tEditThing
	] = useI18Memo(translations, "settings");

	const { isOpen, setIsOpen, incomingEquality, setOutgoingEquality } = props;
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [editBaseEquality, editBaseEqualityRef] = useElement<HTMLIonInputElement>();
	const [editEqualsEquality, editEqualsEqualityRef] = useElement<HTMLIonInputElement>();
	const onLoad = useCallback(() => {
		const {
			separator = ",",
			base = tError,
			equals = [tError]
		} = incomingEquality || {};
		setSeparator(separator);
		getSetValue(editBaseEquality, base);
		getSetValue(editEqualsEquality, equals.join(separator));
	}, [incomingEquality, tError, editBaseEquality, editEqualsEquality]);
	const close = useCallback(() => {
		getSetValue(editBaseEquality, "");
		getSetValue(editEqualsEquality, "");
		setIsOpen(false);
	}, [setIsOpen, editBaseEquality, editEqualsEquality]);
	const maybeSaveEquality = useCallback(() => {
		const base = getSetValue(editBaseEquality);
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
		const equals = getSetValue(editEqualsEquality).split(separator);
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
	}, [
		close, doAlert, incomingEquality, separator,
		setOutgoingEquality, tNoBase, tNoEqual, tOk,
		tThingEdited, toast, editBaseEquality, editEqualsEquality
	]);
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
	const doSetSep = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	return (
		<Modal
			isOpen={isOpen}
			closeFunc={close}
			enclosed
			onIonModalDidPresent={onLoad}
			title={tEditThing}
			bottomEnd={[{button: "save", action: maybeSaveEquality}]}
			bottomStart={[{button: "delete", action: maybeDelete}]}
			footerClass="modalBorderTop"
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
						id="editBaseEquality"
						placeholder={tTheBase}
						ref={editBaseEqualityRef}
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
						ref={editEqualsEqualityRef}
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
		</Modal>
	);
};

export default EditCustomSortEquality;
