import React, { FC, ReactElement, Ref, useContext, useMemo, useState } from "react";
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
import { ModalMakingContext } from '../components/contexts';

import ExtraCharactersModal from "../pages/modals/ExtraCharacters";

interface ModalProperties {
	title: string
	extraChars?: boolean
	startButtons?: ReactElement[]
	preEndButtons?: ReactElement[]
	endButtons?: ReactElement[]
	id?: string
	color?: string
	menu?: boolean
	ref?: Ref<HTMLIonHeaderElement>
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
		color,
		ref
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
	const modalPropsMaker = useContext(ModalMakingContext);
	return (
		<IonHeader id={id} ref={ref}>
			{extraChars ? <ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} /> : <></>}
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
