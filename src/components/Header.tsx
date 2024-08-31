import React, { FC, ReactElement, useMemo, useState } from "react";
import {
	IonButton,
	IonButtons,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { globeOutline } from "ionicons/icons";
import useTranslator from "../store/translationHooks";

import ExtraCharactersModal from "../pages/modals/ExtraCharacters";
import { ModalPropsMaker } from "../store/types";

interface ModalProperties {
	title: string
	extraChars?: ModalPropsMaker
	startButtons?: ReactElement[]
	preEndButtons?: ReactElement[]
	endButtons?: ReactElement[]
	id?: string
	color?: string
	menu?: boolean
}

const Header: FC<ModalProperties> = (props) => {
	const {
		title,
		extraChars,
		menu = true,
		startButtons = [],
		preEndButtons = [],
		endButtons = [],
		id,
		color
	} = props;
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [ tc ] = useTranslator('common');
	const maybeExCharButton = useMemo(() => (
		extraChars ?
			<IonButton onClick={() => setIsOpenECM(true)} aria-label={tc("ExtraChars")}>
				<IonIcon icon={globeOutline} />
			</IonButton>
		: <></>),
	[extraChars, tc]);
	return (
		<IonHeader id={id}>
			{extraChars ? <ExtraCharactersModal {...extraChars(isOpenECM, setIsOpenECM)} /> : <></>}
			<IonToolbar color={color}>
				<IonButtons slot="start">
					{menu ? <IonMenuButton /> : <></>}
					{startButtons}
				</IonButtons>
				<IonTitle>{title}</IonTitle>
				<IonButtons slot="end">
					{preEndButtons}
					{maybeExCharButton}
					{endButtons}
				</IonButtons>
			</IonToolbar>
		</IonHeader>
	);
};

export default Header;
