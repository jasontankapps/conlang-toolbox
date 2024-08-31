import React, { FC, useCallback, useMemo } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonNote,
	IonList,
	IonContent,
	IonToolbar,
	IonButton,
	IonModal,
	IonFooter,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	closeCircleOutline
} from 'ionicons/icons';
import { useSelector } from "react-redux";

import { MSState, MSBool, ModalProperties, StateObject, SetBooleanState, SetState } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import { MorphoSyntaxStorage } from '../../../components/PersistentInfo';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import ModalHeader from '../../../components/ModalHeader';

interface OldStyleSave extends MSState {
	boolStrings?: MSBool[]
}
interface MSmodalProps extends ModalProperties {
	setLoadingScreen: SetBooleanState
	storedInfo: [string, OldStyleSave][]
	setStoredInfo: SetState<[string, OldStyleSave][]>
}

const DeleteSyntaxDocModal: FC<MSmodalProps> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const tTitle = useMemo(() => t("DeleteMorphoSyntaxDocument"), [t]);
	const tCancel = useMemo(() => tc("Cancel"), [tc]);

	const { isOpen, setIsOpen, setLoadingScreen, storedInfo, setStoredInfo } = props;
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();

	const data = useMemo(() => (storedInfo && storedInfo.length > 0) ? storedInfo : [], [storedInfo]);;
	const doClose = useCallback(() => {
		setStoredInfo([]);
		setIsOpen(false);
	}, [setIsOpen, setStoredInfo]);
	const savedDocs = useMemo(() => data.length > 0 ? data.map((pair: [string, OldStyleSave]) => {
		const key = pair[0];
		const ms = pair[1];
		const time = new Date(ms.lastSave);
		const deleteThis = (key: string, title: string) => {
			const handler = () => {
				setLoadingScreen(true);
				MorphoSyntaxStorage.removeItem(key).then(() => {
					setLoadingScreen(false);
					setStoredInfo([]);
					setIsOpen(false);
					toaster({
						message: t("SavedMorphoSyntaxInfoDeleted"),
						duration: 2500,
						position: "top",
						toast
					});
				});
			};
			if(disableConfirms) {
				handler();
			} else {
				yesNoAlert({
					header: tc("deleteTitleQ", { title }),
					message: tc("cannotUndo"),
					cssClass: "danger",
					submit: tc("confirmDel", { count: 1 }),
					handler,
					doAlert
				});
			}
		};
		return (
			<IonItem
				key={key}
				button={true}
				onClick={() => deleteThis(key, ms.title)}
			>
				<IonLabel className="ion-text-wrap">{ms.title}</IonLabel>
				<IonNote
					className="ion-text-wrap ital"
					slot="end"
				>{tc("SavedAt", { time: time.toLocaleString() })}</IonNote>
			</IonItem>
		);
	}) : (
		<h1>{t("NoSavedMorphoSyntaxDocuments")}</h1>
	), [data, tc, disableConfirms, doAlert, setIsOpen, setLoadingScreen, setStoredInfo, t, toast]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose}>
			<ModalHeader title={tTitle} closeModal={doClose} />
			<IonContent>
				<IonList lines="none" className="buttonFilled">
					{savedDocs}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar className={data.length > 0 ? "" : "hide"}>
					<IonButton color="warning" slot="end" onClick={doClose}>
						<IonIcon icon={closeCircleOutline} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default DeleteSyntaxDocModal;
