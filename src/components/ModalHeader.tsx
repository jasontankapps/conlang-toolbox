import React, { FC, ReactElement, useMemo } from "react";
import {
	IonButton,
	IonButtons,
	IonHeader,
	IonIcon,
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { closeCircleOutline, globeOutline } from "ionicons/icons";
import useTranslator from "../store/translationHooks";

interface ModalProperties {
	title: string
	preEndButtons?: ReactElement[]
	endButtons?: ReactElement[]
	id?: string
	color?: string
	closeModal: (x: boolean) => void
	openECM?: (x: boolean) => void
}

const ModalHeader: FC<ModalProperties> = (props) => {
	const {
		title,
		preEndButtons = [],
		endButtons = [],
		id,
		color = "primary",
		closeModal,
		openECM
	} = props;
	const [ tc ] = useTranslator('common');
	const maybeButton = useMemo(() => (
		openECM ?
			<IonButton onClick={() => openECM(true)} aria-label={tc("ExtraChars")}>
				<IonIcon icon={globeOutline} />
			</IonButton>
		: <></>
	), [openECM, tc]);
	const closeButton = useMemo(() => (
		<IonButton onClick={() => closeModal(false)} aria-label={tc("Close")}>
			<IonIcon icon={closeCircleOutline} />
		</IonButton>
	), [closeModal, tc]);
	return (
		<IonHeader id={id}>
			<IonToolbar color={color}>
				<IonTitle>{title}</IonTitle>
				<IonButtons slot="end">
					{preEndButtons}
					{maybeButton}
					{endButtons}
					{closeButton}
				</IonButtons>
			</IonToolbar>
		</IonHeader>
	);
};

export default ModalHeader;
