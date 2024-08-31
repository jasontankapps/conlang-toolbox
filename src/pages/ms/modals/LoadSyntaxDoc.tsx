import React, { useCallback, useMemo, FC } from 'react';
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
} from '@ionic/react';
import {
	closeCircleOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { MSState, MSBool, ModalProperties, StateObject, SetState } from '../../../store/types';
import { loadStateMS } from '../../../store/msSlice';
import useTranslator from '../../../store/translationHooks';

import yesNoAlert from '../../../components/yesNoAlert';
import ModalHeader from '../../../components/ModalHeader';


interface MSmodalProps extends ModalProperties {
	storedInfo: [string, MSState][]
	setStoredInfo: SetState<[string, MSState][]>
}
interface OldStyleSave extends MSState {
	boolStrings?: MSBool[]
}

const LoadMSModal: FC<MSmodalProps> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const tLoadDoc = useMemo(() => t("LoadMorphoSyntaxInfo"), [t]);
	const tCancel = useMemo(() => tc("Cancel"), [tc]);

	const { isOpen, setIsOpen, storedInfo, setStoredInfo } = props;
	const dispatch = useDispatch();
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [doAlert] = useIonAlert();
	const data = useMemo(() => (storedInfo && storedInfo.length > 0) ? storedInfo : [], [storedInfo]);
	const doClose = useCallback(() => {
		setStoredInfo([]);
		setIsOpen(false);
	}, [setStoredInfo, setIsOpen]);
	const loadThis = useCallback((key: string) => {
		data.every((pair: [string, OldStyleSave]) => {
			if(pair[0] !== key) {
				// Continue the loop
				return true;
			}
			const handler = () => {
				const {boolStrings, ...newObj} = pair[1];
				boolStrings && boolStrings.forEach((s) => (newObj[s as MSBool] = true));
				dispatch(loadStateMS(newObj));
				setIsOpen(false);
			};
			if(disableConfirms) {
				handler();
			} else {
				yesNoAlert({
					header: tc("areYouSure"),
					message: t("clearMSInfoMsg"),
					cssClass: "warning",
					submit: tc("confirmLoad"),
					handler,
					doAlert
				});
			}
			// End loop
			return false;
		});
	}, [data, disableConfirms, dispatch, doAlert, setIsOpen, t, tc]);
	const savedDocs = useMemo(() => data.length > 0 ? data.map((pair: [string, MSState]) => {
		const key = pair[0];
		const ms = pair[1];
		const time = new Date(ms.lastSave);
		return (
			<IonItem key={key} button={true} onClick={() => loadThis(key)}>
				<IonLabel className="ion-text-wrap">{ms.title}</IonLabel>
				<IonNote
					className="ion-text-wrap ital"
					slot="end"
				>{tc("SavedAt", { time: time.toLocaleString() })}</IonNote>
			</IonItem>
		);
	}) : (
		<h1>{t("NoSavedMorphoSyntaxDocuments")}</h1>
	), [data, loadThis, t, tc]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose}>
			<ModalHeader title={tLoadDoc} closeModal={doClose} />
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

export default LoadMSModal;
