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

import { WEPresetObject, ExtraCharactersModalOpener, StateObject, SetState } from '../../../store/types';
import { loadStateWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import escape from '../../../components/EscapeForHTML';
import { $i } from '../../../components/DollarSignExports';
import { CustomStorageWE } from '../../../components/PersistentInfo';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

interface CustomInfoModalProps extends ExtraCharactersModalOpener {
	titles: string[]
	setTitles: SetState<string[]>
}

interface SavedItemProps {
	title: string
	maybeLoad: () => void
	maybeDelete: () => void
	tLoad: string
	tDel: string
}
const SavedItem: FC<SavedItemProps> = (props) => {
	const { title, maybeLoad, maybeDelete, tLoad, tDel } = props;
	return (
		<IonItem key={title}>
			<IonLabel className="ion-text-wrap">{title}</IonLabel>
			<IonButton
				className="loadButton"
				slot="end"
				color="warning"
				onClick={maybeLoad}
				strong={true}
			>{tLoad}</IonButton>
			<IonButton
				aria-label={tDel}
				className="ion-no-margin"
				slot="end"
				color="danger"
				onClick={maybeDelete}
			>
				<IonIcon icon={trashOutline} />
			</IonButton>
		</IonItem>
	)
};

const commons = [
	"Cancel", "LoadError", "ManageCustomInfo", "NameOfSave",
	"NameYourInfo", "NoSavedInfo", "Ok", "Save",
	"YesOverwriteIt", "cannotUndo", "confirmLoad",
	"Load", "Delete", "missingTitleMsg", "SaveCurrentInfo",
	"ClearOverwritePrevSave", "LoadSavedInfo"
];

const ManageCustomInfoWE: FC<CustomInfoModalProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const [
		tCancel, tLoadErr, tManage, tNameSave, tNameInfo,
		tNoInfo, tOk, tSave, tYes, tCannot, tConfLoad, tLoad, tDel,
		tMissing, tSaveThing, tClearSave, tLoadThing
	] = useI18Memo(commons);
	const tClearThings = useMemo(() => t("clearAllThingsMsg"), [t]);

	const { isOpen, setIsOpen, openECM, titles, setTitles } = props;
	const dispatch = useDispatch();
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const { characterGroups, transforms, soundChanges } = useSelector((state: StateObject) => state.we)
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const doCleanClose = useCallback(() => {
		setTitles([]);
		setIsOpen(false);
	}, [setIsOpen, setTitles]);
	const maybeSaveInfo = useCallback(() => {
		const el = $i<HTMLInputElement>("currentInfoSaveName");
		const title = el ? escape(el.value).trim() : "";
		if(title === "") {
			return doAlert({
				header: tMissing,
				cssClass: "warning",
				buttons: [
					{
						text: tCancel,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
		}
		const doSave = (title: string, msg: string) => {
			const save: WEPresetObject = {
				characterGroups,
				transforms,
				soundChanges
			}
			CustomStorageWE.setItem(title, save).then(() => {
				toaster({
					message: tc(msg, { title }),
					duration: 2500,
					color: "success",
					position: "top",
					toast
				});
			}).finally(() => doCleanClose());
		};
		// Check if overwriting
		CustomStorageWE.getItem<WEPresetObject>(title).then((value) => {
			if(!value) {
				doSave(title, "titleSaved");
			} else if (disableConfirms) {
				doSave(title, "titleOverwritten");
			} else {
				yesNoAlert({
					header: tc("titleAlreadyExists", { title }),
					message: tClearSave,
					cssClass: "warning",
					submit: tYes,
					handler: () => doSave(title, "titleOverwritten"),
					doAlert
				});
			}
		});
	}, [characterGroups, disableConfirms, doAlert, doCleanClose, soundChanges, toast, transforms, tCancel, tClearSave, tMissing, tYes, tc]);
	const maybeLoadInfo = useCallback((title: string) => {
		const handler = () => {
			CustomStorageWE.getItem<WEPresetObject>(title).then((value) => {
				if(value) {
					dispatch(loadStateWE(value));
					toaster({
						message: tc("titleLoaded", { title }),
						duration: 2500,
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
				header: tc("loadTitleQ", { title }),
				message: tClearThings,
				cssClass: "warning",
				submit: tConfLoad,
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, doCleanClose, toast, tClearThings, tConfLoad, tLoadErr, tOk, tc]);
	const maybeDeleteInfo = useCallback((title: string) => {
		const handler = () => {
			setTitles(titles.filter(ci => ci !== title));
			CustomStorageWE.removeItem(title).then(() => {
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
				message: tCannot,
				cssClass: "warning",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [disableConfirms, doAlert, setTitles, titles, toast, tCannot, tc]);
	const allTitles = useMemo(() => 
		titles.map((title: string, i: number) => <SavedItem
			key={`${i}:weCustomInfo:${title}`}
			title={title}
			maybeDelete={() => maybeDeleteInfo(title)}
			maybeLoad={() => maybeLoadInfo(title)}
			tLoad={tLoad}
			tDel={tDel}
		/>
	), [maybeDeleteInfo, maybeLoadInfo, tLoad, tDel, titles]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={doCleanClose}>
			<ModalHeader title={tManage} openECM={openECM} closeModal={doCleanClose} />
			<IonContent>
				<IonList lines="none">
					<IonItemGroup>
						<IonItemDivider>
							<IonLabel>{tSaveThing}</IonLabel>
						</IonItemDivider>
						<IonItem>
							<IonInput
								aria-label={tNameSave}
								id="currentInfoSaveName"
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
							<IonLabel>{tLoadThing}</IonLabel>
						</IonItemDivider>
						{(titles.length === 0) ?
							<IonItem color="warning"><IonLabel>{tNoInfo}</IonLabel></IonItem>
						:
							allTitles
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

export default ManageCustomInfoWE;
