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

import { ModalProperties, RelationObject, SetState, SortSeparator } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface CustomSortModal extends ModalProperties {
	incomingRelation: RelationObject | null
	setOutgoingRelation: SetState<RelationObject | null | string>
}


const translations = [
	"Basecharacter", "CharsPostBase",
	"CharsPreBase", "Comma",
	"charsPreBaseMsg", "NoSeparator", "Period",
	"Semicolon", "Space", "charsPostBaseMsg",
	"TheBaseCharacter", "noBaseCharMsg",
	"noPostPreCharMsg",
	"BaseChar", "PrePostSeparator", "SortedAfterBase",
	"SortedBeforeBase", "DeleteRelation",
	"RelationEdited", "EditRelation"
];

const commons = [
	"Ok", "areYouSure", "emphasizedError"
];

const EditCustomSortRelation: FC<CustomSortModal> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tOk, tRUSure, tError ] = useI18Memo(commons);
	const [
		tBase, tAfterBase, tBeforeBase, tComma, tEndBefore, tNoSep, tPeriod,
		tSemi, tSpace, tStartAfter, tTheBase, tNoBase, tNoPrePost, tpBase,
		tpPrePost, tpAfter, tpBefore, tDelThing, tThingEdited, tEditThing
	] = useI18Memo(translations, "settings");

	const { isOpen, setIsOpen, incomingRelation, setOutgoingRelation } = props;
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [editBaseRelation, editBaseRelationRef] = useElement<HTMLIonInputElement>();
	const [editPreRelation, editPreRelationRef] = useElement<HTMLIonInputElement>();
	const [editPostRelation, editPostRelationRef] = useElement<HTMLIonInputElement>();
	const onLoad = useCallback(() => {
		const error = tError;
		const {
			separator = ",",
			base = error,
			pre = [error],
			post = [error]
		} = incomingRelation || {};
		setSeparator(separator);
		getSetValue(editBaseRelation, base);
		getSetValue(editPreRelation, pre.join(separator));
		getSetValue(editPostRelation, post.join(separator));
	}, [incomingRelation, tError, editBaseRelation, editPreRelation, editPostRelation]);
	const close = useCallback(() => {
		getSetValue(editBaseRelation, "");
		getSetValue(editPreRelation, "");
		getSetValue(editPostRelation, "");
		setIsOpen(false);
	}, [editBaseRelation, editPreRelation, editPostRelation, setIsOpen]);
	const maybeSaveRelation = useCallback(() => {
		const base = getSetValue(editBaseRelation);
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
		const pre = getSetValue(editPreRelation).split(separator);
		const post = getSetValue(editPostRelation).split(separator);
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
		const relation: RelationObject = { id: incomingRelation!.id, base, pre, post, separator };
		setOutgoingRelation(relation);
		close();
		toaster({
			message: tThingEdited,
			position: "top",
			color: "success",
			duration: 2000,
			toast
		});
	}, [
		editBaseRelation, editPostRelation, editPreRelation,
		close, doAlert, incomingRelation, separator,
		setOutgoingRelation, tNoBase, tNoPrePost, tOk,
		tThingEdited, toast
	]);
	const maybeDelete = useCallback(() => {
		const handler = () => {
			setOutgoingRelation(incomingRelation!.id);
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
	}, [close, doAlert, incomingRelation, setOutgoingRelation, tc, tDelThing, tRUSure]);
	const doSetSep = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	return (
		<Modal
			isOpen={isOpen}
			closeFunc={close}
			enclosed
			onIonModalDidPresent={onLoad}
			title={tEditThing}
			bottomEnd={[{button: "save", action: maybeSaveRelation}]}
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
						id="editBaseRelation"
						placeholder={tTheBase}
						ref={editBaseRelationRef}
					/>
				</IonItem>
				<IonItem className="labelled" lines="none">
					<IonLabel>{tpBefore}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tBeforeBase}
						id="editPreRelation"
						helperText={tEndBefore}
						ref={editPreRelationRef}
					/>
				</IonItem>
				<IonItem className="labelled" lines="none">
				<IonLabel>{tpAfter}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tAfterBase}
						id="editPostRelation"
						helperText={tStartAfter}
						ref={editPostRelationRef}
					/>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tpPrePost}
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

export default EditCustomSortRelation;
