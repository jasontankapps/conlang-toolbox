import React, { FC, useCallback, useMemo } from 'react';
import {
	IonItem,
	IonLabel,
	IonNote,
	IonList,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { useSelector } from "react-redux";

import { MSState, MSBool, ModalProperties, StateObject, SetBooleanState, SetState } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import { MorphoSyntaxStorage } from '../../../components/PersistentInfo';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import Modal from '../../../components/Modal';

interface OldStyleSave extends MSState {
	boolStrings?: MSBool[]
}
interface SavedDocProps extends Omit<ModalProperties, "isOpen"> {
	setLoadingScreen: SetBooleanState
	pair: [string, OldStyleSave]
	setStoredInfo: SetState<[string, OldStyleSave][]>
}
interface MSmodalProps extends ModalProperties {
	setLoadingScreen: SetBooleanState
	storedInfo: [string, OldStyleSave][]
	setStoredInfo: SetState<[string, OldStyleSave][]>
}

const SavedDoc: FC<SavedDocProps> = ({setLoadingScreen, pair, setStoredInfo, setIsOpen}) => {
	const key = pair[0];
	const ms = pair[1];
	const time = new Date(ms.lastSave);
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
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
};

const DeleteSyntaxDocModal: FC<MSmodalProps> = (props) => {
	const [ t ] = useTranslator('ms');
	const tTitle = useMemo(() => t("DeleteMorphoSyntaxDocument"), [t]);

	const { isOpen, setIsOpen, setLoadingScreen, storedInfo, setStoredInfo } = props;

	const data = useMemo(() => (storedInfo && storedInfo.length > 0) ? storedInfo : [], [storedInfo]);;
	const doClose = useCallback(() => {
		setStoredInfo([]);
		setIsOpen(false);
	}, [setIsOpen, setStoredInfo]);

	return (
		<Modal
			isOpen={isOpen}
			title={tTitle}
			closeFunc={doClose}
			footerToolbarClass={data.length > 0 ? "" : "hide"}
			bottomEnd={[{button: "cancel"}]}
		>
			<IonList lines="none" className="buttonFilled">
				{data.length > 0 ? data.map((pair: [string, OldStyleSave]) =>
					<SavedDoc
						key={pair[0]}
						pair={pair}
						setLoadingScreen={setLoadingScreen}
						setStoredInfo={setStoredInfo}
						setIsOpen={setIsOpen}
					/>
				) : (
					<h1>{t("NoSavedMorphoSyntaxDocuments")}</h1>
				)}
			</IonList>
		</Modal>
	);
};

export default DeleteSyntaxDocModal;
