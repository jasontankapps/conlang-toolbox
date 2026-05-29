import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonLabel,
	IonNote,
	IonList,
	useIonAlert,
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import { MSState, MSBool, ModalProperties, StateObject, SetState } from '../../../store/types';
import { loadStateMS } from '../../../store/msSlice';
import useTranslator from '../../../store/translationHooks';

import yesNoAlert from '../../../components/yesNoAlert';
import Modal from '../../../components/Modal';


interface MSmodalProps extends ModalProperties {
	storedInfo: [string, MSState][]
	setStoredInfo: SetState<[string, MSState][]>
}
interface OldStyleSave extends MSState {
	boolStrings?: MSBool[]
}

const SavedDoc: FC<{ pair: [string, MSState], loadThis: (x: string) => void}> = ({ pair, loadThis }) => {
	const [key, ms] = pair;
	const time = new Date(ms.lastSave);
	const [ tc ] = useTranslator('common');
	return (
		<IonItem key={key} button={true} onClick={() => loadThis(key)}>
			<IonLabel className="ion-text-wrap">{ms.title}</IonLabel>
			<IonNote
				className="ion-text-wrap ital"
				slot="end"
			>{tc("SavedAt", { time: time.toLocaleString() })}</IonNote>
		</IonItem>
	);
};

const LoadMSModal: FC<MSmodalProps> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const tLoadDoc = useMemo(() => t("LoadMorphoSyntaxInfo"), [t]);

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
				if(boolStrings) { boolStrings.forEach((s) => (newObj[s as MSBool] = true)); }
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
	return (
		<Modal
			title={tLoadDoc}
			closeFunc={doClose}
			isOpen={isOpen}
			footerToolbarClass={data.length > 0 ? "" : "hide"}
			bottomEnd={[{button: "cancel"}]}
		>
			<IonList lines="none" className="buttonFilled">
				{data.length > 0 ? data.map((pair: [string, MSState]) => 
					<SavedDoc key={pair[0]} pair={pair} loadThis={loadThis} />
				) : (
					<h1>{t("NoSavedMorphoSyntaxDocuments")}</h1>
				)}
			</IonList>
		</Modal>
	);
};

export default LoadMSModal;
