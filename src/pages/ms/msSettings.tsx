import React, { FC, useState, useMemo, useCallback } from 'react';
import {
	IonPage,
	IonContent,
	IonList,
	IonItem,
	useIonViewDidEnter,
	IonLoading,
	IonIcon,
	IonLabel,
	IonInput,
	IonTextarea,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	addCircleOutline,
	codeDownloadOutline,
	removeCircleOutline,
	saveOutline,
	trashOutline
} from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { Action, Dispatch } from 'redux';
import { useDispatch, useSelector } from "react-redux";

import { PageData, MSState, StateObject, SetBooleanState } from '../../store/types';
import { loadStateMS, setMorphoSyntaxNum, setMorphoSyntaxText } from '../../store/msSlice';
import { setLastViewMS } from '../../store/internalsSlice';
import blankAppState from '../../store/blankAppState';
import useTranslator from '../../store/translationHooks';

import { MorphoSyntaxStorage } from '../../components/PersistentInfo';
import debounce from '../../components/Debounce';
import { $i } from '../../components/DollarSignExports';
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import useI18Memo from '../../components/useI18Memo';

import { SyntaxHeader } from './MorphoSyntaxElements';
import LoadMS from './modals/LoadSyntaxDoc';
import DeleteMS from './modals/DeleteSyntaxDoc';
import ExportMS from './modals/ExportSyntaxDoc';

const translations = [
	"ShortDescriptionMsg", "MorphoSyntaxSettings",
	"noInfoToClearMsg", "msTitle",
	"needInfoToExportMsg", "confirmClear",
	"UsuallyLangName", "clearMSInfo", "clearedMS",
	"clearAllMS", "DeleteSavedMorphoSyntaxInfo", "ExportMorphoSyntaxInfo",
	"LoadMorphoSyntaxInfo", "SaveMorphoSyntaxInfo"
];

const commons = [
	"Cancel", "DeleteEverythingQ", "Ok", "PleaseWait",
	"SaveAsNew", "error", "Description", "missingTitleMsg"
];

const Syntax: FC<PageData> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const [
		tCancel, tDelAll, tOk, tPlease, tSaveNew,
		tError, tDesc, tMissingTitle
	] = useI18Memo(commons);
	const [
		tShortDesc, tMSett, tNoInfo, tTitle, tAddFirst, tConfDel,
		tName, tClearThings, tClearedThings, tClearAll, tDelSavedInfo,
		tExportThing, tLoadThing, tSaveThing
	] = useI18Memo(translations, "ms");
	const tpTitle = useMemo(() => t("msTitle", { context: "presentation" }), [t]);
	const tpDesc = useMemo(() => tc("Description", { context: "presentation" }), [tc]);

	const [isOpenLoadMS, setIsOpenLoadMS] = useState<boolean>(false);
	const [isOpenExportMS, setIsOpenExportMS] = useState<boolean>(false);
	const [isOpenDelMS, setIsOpenDelMS] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [storedInfo, setStoredInfo] = useState<[string, MSState][]>([]);
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const {
		title,
		description,
		id,
		lastSave,
		...msRemainder
	} = useSelector((state: StateObject) => state.ms);
	const allProps = Object.keys(msRemainder).length;
	useIonViewDidEnter(() => {
		dispatch(setLastViewMS("msSettings"));
	});
	const clearMS = useCallback(() => {
		const handler = () => {
			dispatch(loadStateMS(blankAppState.ms));
			toaster({
				message: tClearedThings,
				duration: 2500,
				color: "warning",
				position: "top",
				toast
			});
		};
		if(!(title || id || description || (allProps > 0))) {
			toaster({
				message: tNoInfo,
				duration: 2500,
				color: "warning",
				position: "top",
				toast
			});
		} else if(!disableConfirms) {
			yesNoAlert({
				header: tDelAll,
				message: tClearAll,
				cssClass: "danger",
				submit: tConfDel,
				handler,
				doAlert
			});
		} else {
			handler();
		}
	}, [allProps, description, disableConfirms, tClearedThings, dispatch, doAlert, id, tClearAll, tConfDel, tDelAll, tNoInfo, title, toast]);
	const openMSModal = useCallback((modalOpener: SetBooleanState) => {
		const info: [string, MSState][] = [];
		setIsLoading(true);
		MorphoSyntaxStorage.iterate((value: MSState, key: string) => {
			info.push([key, value]);
			return; // Blank return keeps the loop going
		}).then(() => {
			setStoredInfo(info);
			setIsLoading(false);
			modalOpener(true);
		});
	}, []);
	const maybeExportMS = useCallback(() => {
		if(!title) {
			return doAlert({
				header: tError,
				message: tMissingTitle,
				cssClass: "warning",
				buttons: [
					{
						text: tCancel,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
		} else if (allProps < 1) {
			return doAlert({
				header: tError,
				message: tAddFirst,
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
		setIsOpenExportMS(true);
	}, [allProps, doAlert, tAddFirst, tCancel, tError, tMissingTitle, title]);
	const MSSaveError = useCallback(() => {
		doAlert({
			header: tError,
			message: tMissingTitle,
			cssClass: "danger",
			buttons: [
				{
					text: tOk,
					role: "cancel",
					cssClass: "cancel"
				}
			]
		});
	}, [doAlert, tError, tMissingTitle, tOk]);
	const saveMSDoc = useCallback((
		key: string = id,
		overwrite: boolean = true
	) => {
		// Save original id
		const firstKey = key;
		// Save 'now'
		const now = Date.now();
		if(!title) {
			return MSSaveError();
		} else if(!key) {
			key = uuidv4();
			dispatch(setMorphoSyntaxText(["id", key]));
		}
		// Dispatch to state
		dispatch(setMorphoSyntaxNum(["lastSave", now]));
		setIsLoading(true);
		// These dispatches will NOT be ready by the time Storage loads and saves
		//  so we will need to do some creative variable work
		const ms: MSState = {
			// Use possibly-new key
			id: key,
			// Use 'now'
			lastSave: now,
			title,
			description,
			...msRemainder
		};
		MorphoSyntaxStorage.setItem(key, ms)
			.then(() => {
				// If we're overwriting, and it's a new key, delete the old one
				if(overwrite && key !== firstKey) {
					MorphoSyntaxStorage.removeItem(firstKey);
				}
				setIsLoading(false);
				toaster({
					message: t("MorphoSyntaxInfoSaved"),
					duration: 2500,
					position: "top",
					toast
				});
			});
	}, [MSSaveError, description, dispatch, id, msRemainder, t, title, toast]);
	const saveMSNew = useCallback(() => {
		if(!title) {
			return MSSaveError();
		}
		const key = uuidv4();
		dispatch(setMorphoSyntaxText(["id", key]));
		saveMSDoc(key, false);
	}, [MSSaveError, dispatch, saveMSDoc, title]);
	const saveMSDocPlain = useCallback(() => saveMSDoc(), [saveMSDoc]);
	const setNewInfo = useCallback((id: string, prop: "description" | "title") => {
		const el = $i<HTMLInputElement>(id);
		const value = el ? el.value.trim() : "";
		debounce<Dispatch, Action>(
			dispatch,
			[setMorphoSyntaxText([prop, value])],
			(prop === "description" ? 2000 : 1000),
			"saveMS"
		);
	}, [dispatch]);
	const closeLoading = useCallback(() => setIsLoading(false), [setIsLoading]);
	const openLoad = useCallback(() => openMSModal(setIsOpenLoadMS), [openMSModal]);
	const openDel = useCallback(() => openMSModal(setIsOpenDelMS), [openMSModal]);
	const changeTitle = useCallback(() => setNewInfo("msTitle", "title"), [setNewInfo]);
	const changeDesc = useCallback(() => setNewInfo("msTitle", "description"), [setNewInfo]);
	return (
		<IonPage>
			<IonLoading
				cssClass='loadingPage'
				isOpen={isLoading}
				onDidDismiss={closeLoading}
				message={tPlease}
				spinner="bubbles"
				/*duration={300000}*/
				duration={1000}
			/>
			<LoadMS
				{...props.modalPropsMaker(isOpenLoadMS, setIsOpenLoadMS)}
				storedInfo={storedInfo}
				setStoredInfo={setStoredInfo}
			/>
			<ExportMS
				{...props.modalPropsMaker(isOpenExportMS, setIsOpenExportMS)}
				setLoading={setIsLoading}
			/>
			<DeleteMS
				{...props.modalPropsMaker(isOpenDelMS, setIsOpenDelMS)}
				storedInfo={storedInfo}
				setStoredInfo={setStoredInfo}
				setLoadingScreen={setIsLoading}
			/>
			<SyntaxHeader title={tMSett} {...props} />
			<IonContent fullscreen
				className="evenBackground disappearingHeaderKludgeFix"
				id="morphoSyntaxPage"
			>
				<IonList lines="none" className="hasSpecialLabels">
					<IonItem className="labelled">
						<IonLabel>{tpTitle}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitle}
							value={title}
							id="msTitle"
							className="ion-margin-top"
							placeholder={tName}
							onIonChange={changeTitle}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel>{tpDesc}</IonLabel>
					</IonItem>
					<IonItem>
						<IonTextarea
							aria-label={tDesc}
							value={description}
							id="msDesc"
							className="ion-margin-top"
							placeholder={tShortDesc}
							rows={3}
							onIonChange={changeDesc}
						/>
					</IonItem>
				</IonList>
				<IonList lines="none" className="ion-float-end aside">
					<IonItem button={true} onClick={clearMS}>
						<IonIcon icon={removeCircleOutline} className="ion-padding-end" />
						<IonLabel>{tClearThings}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={openLoad}>
						<IonIcon icon={addCircleOutline} className="ion-padding-end" />
						<IonLabel>{tLoadThing}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={saveMSDocPlain}>
						<IonIcon icon={saveOutline} className="ion-padding-end" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={saveMSNew}>
						<IonIcon icon={saveOutline} className="ion-padding-end" />
						<IonLabel>{tSaveNew}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={maybeExportMS}>
						<IonIcon icon={codeDownloadOutline} className="ion-padding-end" />
						<IonLabel>{tExportThing}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={openDel}>
						<IonIcon icon={trashOutline} className="ion-padding-end" />
						<IonLabel>{tDelSavedInfo}</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default Syntax;
