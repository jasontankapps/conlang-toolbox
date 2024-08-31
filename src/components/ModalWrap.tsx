import React, { PropsWithChildren, useCallback, FC } from 'react';
import {
	IonIcon,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal
} from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { SetBooleanState } from '../store/types';
import useI18Memo from './useI18Memo';

const translations = ["Info", "Close"];

const ModalWrap: FC<PropsWithChildren<{isOpen: boolean, setIsOpen: SetBooleanState}>> = (props) => {
	const {
		isOpen,
		setIsOpen,
		children
	} = props;
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const [tInfo, tClose] = useI18Memo(translations);
	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={closer}
		>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tInfo}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={closer} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{children}
			</IonContent>
		</IonModal>
	);
};

export default ModalWrap;
