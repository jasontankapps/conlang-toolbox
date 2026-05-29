import React, { FC, useCallback, useMemo } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonButton,
	IonItemGroup,
	IonItemDivider,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	trashOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { Base_WG, ModalProperties, SetState, StateObject, WGState } from '../../../store/types';
import { loadStateWG } from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import escape from '../../../components/EscapeForHTML';
import { CustomStorageWG } from '../../../components/PersistentInfo';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

interface ExtraInfo extends ModalProperties {
	titles: string[] | null
	setTitles: SetState<string[] | null>
}

interface SavedItemProps {
	title: string
	maybeLoadInfo: (x:string) => void
	maybeDeleteInfo: (x:string) => void
	tLoad: string
	tDelete: string
}
const SavedItem: FC<SavedItemProps> = (props) => {
	const { title, maybeLoadInfo, maybeDeleteInfo, tLoad, tDelete } = props;
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
				aria-label={tDelete}
				className="ion-no-margin"
				slot="end"
				color="danger"
				onClick={() => maybeDeleteInfo(title)}
			>
				<IonIcon icon={trashOutline} />
			</IonButton>
		</IonItem>
	)
};

const commons = [
	"Delete", "LoadError", "Load", "ManageCustomInfo",
	"NameOfSave", "NameYourInfo", "NoSavedInfo", "Ok", "Save",
	"YesOverwriteIt", "cannotUndo", "confirmLoad", "ClearOverwritePrevSave",
	"SaveCurrentInfo", "LoadSavedInfo", "missingTitleMsg"
];

const ManageCustomInfo: FC<ExtraInfo> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tc ] = useTranslator('common');
	const [
		tDelete, tLoadError, tLoad, tManage, tNameSave,
		tNameCustom, tNoSaved, tOk, tSave, tYesOverwrite, tCannotUndo,
		tConfirmLoad, tClearPrevSave, tSaveInfo, tLoadInfo, tMissingTitle
	] = useI18Memo(commons);
	const tClearAll = useMemo(() => { return t("clearAllThingsMsg"); }, [t]);
	const [currentInfoSaveNameWG, currentInfoSaveNameWGRef] = useElement<HTMLIonInputElement>();

	const { isOpen, setIsOpen, titles, setTitles } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const wg = useSelector((state: StateObject) => state.wg);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const customInfo: string[] = useMemo(() => titles || [], [titles]);
	const doCleanClose = useCallback(() => {
		setTitles(null);
		setIsOpen(false);
	}, [setIsOpen, setTitles]);
	const maybeSaveInfo = useCallback(() => {
		const title = escape(getSetValue(currentInfoSaveNameWG)).trim();
		if(title === "") {
			return doAlert({
				header: tMissingTitle,
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
		const doSave = (title: string, msg: string) => {
			// Remove props we aren't saving
			const save: Partial<WGState> = {...wg};
			delete save.output;
			delete save.showSyllableBreaks;
			delete save.sentencesPerText;
			delete save.capitalizeWords;
			delete save.sortWordlist;
			delete save.wordlistMultiColumn;
			delete save.wordsPerWordlist;
			CustomStorageWG.setItem(title, save).then(() => {
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
		CustomStorageWG.getItem<Base_WG>(title).then((value) => {
			if(!value) {
				doSave(title, "titleSaved");
			} else if (disableConfirms) {
				doSave(title, "titleOverwritten");
			} else {
				yesNoAlert({
					header: tc("titleAlreadyExists", { title }),
					message: tClearPrevSave,
					cssClass: "warning",
					submit: tYesOverwrite,
					handler: () => doSave(title, "titleOverwritten"),
					doAlert
				});
			}
		});
	}, [
		disableConfirms, doAlert, doCleanClose, tc,
		toast, wg, tOk, tYesOverwrite, tClearPrevSave,
		tMissingTitle, currentInfoSaveNameWG
	]);
	const maybeLoadInfo = useCallback((title: string) => {
		const handler = () => {
			CustomStorageWG.getItem<Base_WG>(title).then((value) => {
				if(value) {
					dispatch(loadStateWG(value));
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
						header: tLoadError,
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
				message: tClearAll,
				cssClass: "warning",
				submit: tConfirmLoad,
				handler,
				doAlert
			});
		}
	}, [
		disableConfirms, dispatch, doAlert, doCleanClose,
		tc, tClearAll, toast, tConfirmLoad, tOk, tLoadError
	]);
	const maybeDeleteInfo = useCallback((title: string) => {
		const handler = () => {
			const newCustom = customInfo.filter(ci => ci !== title);
			setTitles(newCustom.length > 0 ? newCustom : null);
			CustomStorageWG.removeItem(title).then(() => {
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
				message: tCannotUndo,
				cssClass: "warning",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [customInfo, disableConfirms, doAlert, setTitles, tc, toast, tCannotUndo]);
	return (
		<Modal
			isOpen={isOpen}
			title={tManage}
			closeFunc={doCleanClose}
			bottomEnd={[{button: "cancel"}]}
			extraChars
		>
			<IonList lines="none">
				<IonItemGroup>
					<IonItemDivider>
						<IonLabel>{tSaveInfo}</IonLabel>
					</IonItemDivider>
					<IonItem>
						<IonInput
							aria-label={tNameSave}
							id="currentInfoSaveNameWG"
							inputmode="text"
							placeholder={tNameCustom}
							type="text"
							ref={currentInfoSaveNameWGRef}
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
					{(customInfo.length === 0) ?
						<IonItem color="warning"><IonLabel>{tNoSaved}</IonLabel></IonItem>
					:
						customInfo.map((title: string, i: number) => (
							<SavedItem
								title={title}
								maybeDeleteInfo={maybeDeleteInfo}
								maybeLoadInfo={maybeLoadInfo}
								tLoad={tLoad}
								tDelete={tDelete}
								key={`wgPreset/1/${i}::${title}`}
							/>
						))
					}
				</IonItemGroup>
			</IonList>
		</Modal>
	);
};

export default ManageCustomInfo;
