import React, { MouseEvent, useCallback, useMemo, useState, FC } from 'react';
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
	useIonToast,
	IonToggle
} from '@ionic/react';
import {
	closeCircleOutline,
	codeOutline,
	documentOutline,
	documentTextOutline
} from 'ionicons/icons';
import { useDispatch, useSelector } from "react-redux";
import Markdown from 'react-markdown';

import { ModalProperties, SetBooleanState, StateObject } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import ModalHeader from '../../../components/ModalHeader';
import logger from '../../../components/Logging';
import doExport from '../../../components/ExportServices';
import doText from './Ex-Text';
import doDocx from './Ex-Docx';
import doXML from './Ex-XML';
import doJSON from './Ex-JSON';
//import doODT from './Ex-ODT';

// FOR BROWSER TESTING ONLY
import { saveAs } from 'file-saver';
import { isPlatform } from "@ionic/react";
import toaster from "../../../components/toaster";
import useI18Memo from '../../../components/useI18Memo';
// FOR BROWSER TESTING ONLY

interface ExportModalProps extends ModalProperties {
	setLoading: SetBooleanState
}

type IonItemEvent = MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>;

const commons = [
	"Cancel", "fileJson", "fileMd", "filePlain",
	"fileDocx", "fileXml", "Untitled"
];

const ExportSyntaxModal: FC<ExportModalProps> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const [ tCancel, tJSON, tMD, tPlain, tDocx, tXML, tUntitled ] = useI18Memo(commons);
	const tUnusedDesc = useMemo(() => t("showUnused", { joinArrays: "\n" }), [t]);
	const tChooseFormat = useMemo(() => tc("ChooseFormat", { context: "presentation" }), [tc]);

	const { isOpen, setIsOpen, setLoading } = props;
	const [showUnused, setShowUnused] = useState<boolean>(true);
	const toast = useIonToast();
	const msInfo = useSelector((state: StateObject) => state.ms);
	const { title = tUntitled } = msInfo;
	const tExportTitle = useMemo(() => t("ExportMorphoSyntaxInfo"), [t]);
	const dispatch = useDispatch();
	const doClose = useCallback(() => {
		setIsOpen(false);
		setLoading(false);
	}, [setIsOpen, setLoading]);
	const log = useCallback((info: string[]) => logger(dispatch, info), [dispatch]);
	const doDownload = useCallback((e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>, output: string, extension: string) => {
		e.preventDefault();
		const filename =  tc("fileFormat", { title, date: (new Date()).toDateString(), extension });

		// FOR BROWSER TESTING ONLY
		//i18n not needed here
		if(!isPlatform("android")) {
			var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
			saveAs(blob, filename);
			toast && toaster({
				message: `${filename} exported`,
				color: "success",
				duration: 5000,
				toast
			});
			doClose();
			return;
		}
		// FOR BROWSER TESTING ONLY

		setLoading(true);
		doExport(output, filename, toast, dispatch)
			.catch((e = "Error doexport") => {
				log(["ExportModal / doDownload", e]);
				doClose();
			})
			.then(doClose);
	}, [tc, doClose, dispatch, log, setLoading, title, toast]);
	const toggleUnused = useCallback(() => setShowUnused(!showUnused), [showUnused]);
	const doPlainText = useCallback(
		(e: IonItemEvent) => doText(e, msInfo, doDownload, showUnused),
		[msInfo, doDownload, showUnused]
	);
	const doMarkdown = useCallback(
		(e: IonItemEvent) => doText(e, msInfo, doDownload, showUnused, true),
		[msInfo, doDownload, showUnused]
	);
	const doExJSON = useCallback(
		(e: IonItemEvent) => doJSON(e, msInfo, doDownload),
		[msInfo, doDownload]
	);
	const doExXML = useCallback(
		(e: IonItemEvent) => doXML(e, msInfo, doDownload),[msInfo, doDownload]
	);
	const doExDocx = useCallback(
		(e: IonItemEvent) => doDocx(e, msInfo, showUnused, doClose, setLoading, toast, log),
		[msInfo, showUnused, doClose, setLoading, toast, log]
	);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose}>
			<ModalHeader title={tExportTitle} closeModal={doClose} />
			<IonContent id="exportSyntaxModal">
				<IonList lines="none" className="buttonFilled multiLinePossible">
					<IonItem lines="full" className="wrappableInnards">
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={showUnused}
							onIonChange={toggleUnused}
						>
							<Markdown>{tUnusedDesc}</Markdown>
						</IonToggle>
					</IonItem>
					<IonItem>{tChooseFormat}</IonItem>
					<IonItem
						button={true}
						onClick={doPlainText}
						className="striped"
					>
						<IonIcon icon={documentTextOutline} className="ion-padding-start" slot="start" />
						<IonLabel className="ion-text-wrap">{tPlain}</IonLabel>
					</IonItem>
					<IonItem
						button={true}
						onClick={doMarkdown}
					>
						<IonIcon icon={documentTextOutline} className="ion-padding-start" slot="start" />
						<IonLabel className="ion-text-wrap">{tMD}</IonLabel>
					</IonItem>
					<IonItem
						button={true}
						onClick={doExDocx}
						className="striped"
					>
						<IonIcon icon={documentOutline} className="ion-padding-start" slot="start" />
						<IonLabel className="ion-text-wrap">{tDocx}</IonLabel>
					</IonItem>
					<IonItem
						button={true}
						onClick={doExJSON}
					>
						<IonIcon icon={codeOutline} className="ion-padding-start" slot="start" />
						<IonLabel className="ion-text-wrap">{tJSON}</IonLabel>
					</IonItem>
					<IonItem
						button={true}
						onClick={doExXML}
						className="striped"
					>
						<IonIcon icon={codeOutline} className="ion-padding-start" slot="start" />
						<IonLabel className="ion-text-wrap">{tXML}</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="warning" slot="end" onClick={doClose}>
						<IonIcon icon={closeCircleOutline} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default ExportSyntaxModal;
