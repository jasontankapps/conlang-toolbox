import React, { FC, useCallback, useMemo } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonToolbar,
	IonButton,
	IonModal,
	IonFooter,
	IonItemGroup,
	IonItemDivider,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	closeCircleSharp,
	trashOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { DJCustomInfo, ExtraCharactersModalOpener, SetState, StateObject } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';
import { loadStateDJ } from '../../../store/declenjugatorSlice';

import escape from '../../../components/EscapeForHTML';
import { $i } from '../../../components/DollarSignExports';
import { DeclenjugatorStorage } from '../../../components/PersistentInfo';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

interface ExtraInfo extends ExtraCharactersModalOpener {
	titles: string[] | null
	setTitles: SetState<string[] | null>
}

const translations = [
	"needTitleOrDescriptionMsg",
	"clearEverythingMsg",
	"willClearOverwriteMsg"
];

const commons = [
	"deleteThisCannotUndo", "Cancel", "Delete", "LoadError",
	"Load", "ManageCustomInfo", "NameOfSave", "NameYourInfo",
	"NoSavedInfo", "Ok", "Save", "YesOverwriteIt", "confirmLoad",
	"LoadSavedInfo", "SaveCurrentInfo"
];

const ManageCustomInfo: FC<ExtraInfo> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tYouSure, tCancel, tDel, tLoadErr, tLoad, tManage,
		tNameSave, tNameInfo, tNoSaved, tOk, tSave, tYes,
		tConfLoad, tLoadInfo, tSaveThings
	] = useI18Memo(commons);
	const [ tNoTitle, tClearEverything, tOverwritePrev ] = useI18Memo(translations, "dj");

	const { isOpen, setIsOpen, openECM, titles, setTitles } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const {
		declensions,
		conjugations,
		other
	} = useSelector((state: StateObject) => state.dj);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const customInfo: string[] = useMemo(() => titles || [], [titles]);
	const doCleanClose = useCallback(() => {
		setTitles(null);
		setIsOpen(false);
	}, [setIsOpen, setTitles]);
	const maybeSaveInfo = useCallback(() => {
		const el = $i<HTMLInputElement>("currentDJInfoSaveName");
		const title = (el && escape(el.value).trim()) || "";
		if(title === "") {
			return doAlert({
				message: tNoTitle,
				cssClass: "warning",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
		}
		const doSave = (title: string, msg: string = "titleSaved") => {
			const save: DJCustomInfo = {
				declensions,
				conjugations,
				other
			};
			DeclenjugatorStorage.setItem(title, save).then(() => {
				toaster({
					message: tc(msg, { title }),
					duration: 2500,
					position: "top",
					toast
				});
			}).finally(() => doCleanClose());
		};
		// Check if overwriting
		DeclenjugatorStorage.getItem<DJCustomInfo>(title).then((value) => {
			if(!value) {
				doSave(title);
			} else if (disableConfirms) {
				doSave(title, "titleOverwritten");
			} else {
				yesNoAlert({
					header: tc("titleAlreadyExists", { title }),
					message: tOverwritePrev,
					cssClass: "warning",
					submit: tYes,
					handler: () => doSave(title, "titleOverwritten"),
					doAlert
				});
			}
		});
	}, [conjugations, declensions, disableConfirms, doAlert, doCleanClose, other, tNoTitle, tOk, tOverwritePrev, tYes, tc, toast]);
	const maybeLoadInfo = useCallback((title: string) => {
		const handler = () => {
			DeclenjugatorStorage.getItem<DJCustomInfo>(title).then((value) => {
				if(value) {
					dispatch(loadStateDJ(value));
					toaster({
						message: tc("titleLoaded", { title }),
						duration: 2500,
						color: "success",
						position: "top",
						toast
					});
					doCleanClose();
				} else {
					doAlert({
						header: tLoadErr,
						cssClass: "danger",
						message: tc("titleNotFound", { title }),
						buttons: [
							{
								text: tOk,
								role: "cancel",
								cssClass: "cancel"
							}
						]
					});
				}
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header:  tc("loadTitleQ", { title }),
				message: tClearEverything,
				cssClass: "warning",
				submit: tConfLoad,
				handler,
				doAlert
			});
	}
	}, [disableConfirms, dispatch, doAlert, doCleanClose, tConfLoad, tLoadErr, tOk, tClearEverything, tc, toast]);
	const maybeDeleteInfo = useCallback((title: string) => {
		const handler = () => {
			const newCustom = customInfo.filter(ci => ci !== title);
			setTitles(newCustom.length > 0 ? newCustom : null);
			DeclenjugatorStorage.removeItem(title).then(() => {
				toaster({
					message: tc("titleDeleted", { title }),
					duration: 2500,
					color: "danger",
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
				message: tYouSure,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [customInfo, disableConfirms, doAlert, setTitles, tYouSure, tc, toast]);
	const customInfoItems = useMemo(() => customInfo.map((title: string) => {
		return (
			<IonItem key={title}>
				<IonLabel className="ion-text-wrap">{title}</IonLabel>
				<IonButton
					className="loadButton"
					slot="end"
					color="warning"
					onClick={() => maybeLoadInfo(title)}
					strong={true}
				>{tLoad}</IonButton>
				<IonButton
					className="ion-no-margin"
					slot="end"
					color="danger"
					aria-label={tDel}
					onClick={() => maybeDeleteInfo(title)}
				>
					<IonIcon icon={trashOutline} />
				</IonButton>
			</IonItem>
		);
	}), [customInfo, maybeDeleteInfo, maybeLoadInfo, tDel, tLoad]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={doCleanClose}>
			<ModalHeader title={tManage} openECM={openECM} closeModal={doCleanClose} />
			<IonContent>
				<IonList lines="none">
					<IonItemGroup>
						<IonItemDivider>
							<IonLabel>{tSaveThings}</IonLabel>
						</IonItemDivider>
						<IonItem>
							<IonInput
								aria-label={tNameSave}
								id="currentDJInfoSaveName"
								inputmode="text"
								placeholder={tNameInfo}
								type="text"
							/>
							<IonButton
								slot="end"
								onClick={maybeSaveInfo}
								strong={true}
								color="success"
							>{tSave}</IonButton>
						</IonItem>
					</IonItemGroup>
					<IonItemGroup className="buttonFilled">
						<IonItemDivider>
							<IonLabel>{tLoadInfo}</IonLabel>
						</IonItemDivider>
						{customInfoItems}
						{
							(customInfo.length === 0) ?
								<IonItem color="warning"><IonLabel>{tNoSaved}</IonLabel></IonItem>
							:
								<></>
						}
					</IonItemGroup>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="danger" slot="end" onClick={doCleanClose}>
						<IonIcon icon={closeCircleSharp} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default ManageCustomInfo;
