import React, { useCallback, useState, FC } from 'react';
import {
	IonPage,
	IonGrid,
	IonRow,
	IonCol,
	IonLabel,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonContent,
	IonList,
	IonItem,
	IonCardTitle,
	useIonAlert,
	useIonToast,
	IonButton
} from '@ionic/react';
import { useDispatch, useSelector } from "react-redux";
import Markdown from 'react-markdown';
import { useWindowWidth } from '@react-hook/window-size/throttled';

import { InternalState, PageData, StateObject, ThemeNames } from '../store/types';
import { clearLogs } from '../store/internalsSlice';

import yesNoAlert from '../components/yesNoAlert';
import toaster from '../components/toaster';
import Header from '../components/Header';
import copyText from '../components/copyText';
import useI18Memo from '../components/useI18Memo';

function getBannerDimensions (windowWidth: number) {
	// original banner size: 545x153
	// original reduced banner size: 144x40 (which is about 26.422%x26.144%, for some reason)
	const w = 545;
	const h = 153;
	let width = w;
	let ratio = 1;
	// Max should be half the width or a quarter of the banner size, whichever is greater
	const max = Math.max(w / 4, windowWidth / 2);
	while(width > max) {
		ratio -= 0.05;
		width = w * ratio;
	}
	return {width: `${Math.round(width)}px`, height: `${Math.round(h * ratio)}px`};
}

const translations =  [
	"BugReports", "Changelog", "ClearLogs", "CopyLogs",
	"CreditsAcknowledgements", "DebugInfo", "DelThemNow",
	"EntireState", "GetErrLog", "HideOlderChanges",
	"logsClearedMsg", "ShowOlderChanges",
	"logDeletionMsg"
];
const markdowns = [ "credit1", "credit2", "credit3", "bugReportMsg" ];
const commons = [ "Close", "Copy", "Ok", "areYouSure", "AppInfo" ];
const changelog = [ "changelog.v094", "changelog.v095", "changelog.v0101", "changelog.v0113", "changelog.v0120" ];
const context = { joinArrays: "\n" };

const AppInfo: FC<PageData> = (props) => {
	const width = useWindowWidth();
	const [
		tBugRep, tCLog, tClearLogs, tCopyLogs, tCredits, tDebug, tDelNow,
		tEntire, tGetLog, tHide, tLogsCleared, tShow, tLogs
	] = useI18Memo(translations, 'appInfo');
	const [ tClose, tCopy, tOk, tRUSure, tAppInfo ] = useI18Memo(commons);
	const [ tCL94, tCL95, tCL101, tCL113, tCL120 ] = useI18Memo(changelog, 'appInfo', context);
	const [ tCr1, tCr2, tCr3, tBugRepMsg ] = useI18Memo(markdowns, "appInfo", context);

	const [originalTheme, internals, state]: [ThemeNames, InternalState, StateObject] = useSelector(
		(state: StateObject) => [state.appSettings.theme, state.internals, state]
	);
	const dispatch = useDispatch();
	const [debug, setDebug] = useState<number>(1);
	const [showOlder, setShowOlder] = useState<boolean>(false);
	const [doAlert, undoAlert] = useIonAlert();
	const toast = useIonToast();
	const theme = originalTheme.replace(/ /g, "") + "Theme";

	const maybeDebug = () => {
		if(debug < 7) {
			setDebug(debug + 1);
			return;
		}
		setDebug(1);
		const info = JSON.stringify(state);
		doAlert({
			header: tEntire,
			message: info,
			cssClass: "warning",
			buttons: [
				{
					text: tCopy,
					cssClass: "submit",
					handler: () => copyText(info, toast)
				},
				{
					text: tOk,
					role: "cancel",
					cssClass: "cancel"
				}
			]
		});
	};

	const showLogs = () => {
		const info = JSON.stringify(internals);
		doAlert({
			header: tDebug,
			message: info,
			cssClass: "warning",
			buttons: [
				{
					text: tCopyLogs,
					cssClass: "submit",
					handler: () => copyText(info, toast)
				},
				{
					text: tClearLogs,
					cssClass: "danger",
					handler: () => {
						undoAlert().then(() => yesNoAlert({
							header: tRUSure,
							message: tLogs,
							submit: tDelNow,
							cssClass: "danger",
							handler: () => {
								dispatch(clearLogs());
								toaster({
									message: tLogsCleared,
									duration: 3500,
									color: "danger",
									toast
								});
							},
							doAlert
						}))
					}
				},
				{
					text: tClose,
					role: "cancel",
					cssClass: "cancel"
				}
			]
		});
	};

	const toggleShowOlder = useCallback(() => {setShowOlder(!showOlder)}, [showOlder]);

	return (
		<IonPage className={theme}>
			<Header title={tAppInfo} />
			<IonContent className="containedCards">
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonCard>
								<IonCardHeader className="ion-text-center">
									<IonCardTitle className="ion-text-center ion-text-wrap">{tCredits}</IonCardTitle>
								</IonCardHeader>
								<IonCardContent>
									<IonList className="ion-text-center" lines="full">
										<IonItem>
											<IonLabel className="ion-text-center ion-text-wrap overrideMarkdown">
												<Markdown>{tCr1}</Markdown>
											</IonLabel>
										</IonItem>
										<IonItem>
											<IonLabel className="ion-text-center ion-text-wrap overrideMarkdown">
												<Markdown>{tCr2}</Markdown>
											</IonLabel>
										</IonItem>
										<IonItem>
											<IonLabel className="ion-text-center ion-text-wrap overrideMarkdown">
												<Markdown>{tCr3}</Markdown>
											</IonLabel>
										</IonItem>
									</IonList>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonCard>
								<IonCardHeader className="ion-text-center">
									<IonCardTitle>{tBugRep}</IonCardTitle>
								</IonCardHeader>
								<IonCardContent id="bugReport">
									<div className="ion-text-center overrideMarkdown">
										<Markdown>{tBugRepMsg}</Markdown>
									</div>
									<div className="ion-text-center">
										<IonButton size="small" onClick={showLogs} color="warning" fill="outline">{tGetLog}</IonButton>
									</div>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonCard id="changelog">
								<IonCardHeader className="ion-text-center">
									<IonCardTitle>{tCLog}</IonCardTitle>
								</IonCardHeader>
								<IonCardContent className="ion-padding-start changelog">
									<h2 className="ion-text-center" onClick={maybeDebug}><strong>v.0.12.0</strong></h2>
									<Markdown>{tCL120}</Markdown>
									<div id="changelogButtonContainer" className="ion-text-center">
										<IonButton
											onClick={toggleShowOlder}
											fill="outline"
											color={showOlder ? "secondary" : "tertiary"}
										>
											<IonLabel>{showOlder ? tHide : tShow}</IonLabel>
										</IonButton>
									</div>
									<div className={showOlder ? "" : "hide"}>
										<h2 className="ion-text-center"><strong>v.0.11.3</strong></h2>
										<Markdown>{tCL113}</Markdown>
										<h2 className="ion-text-center"><strong>v.0.10.1</strong></h2>
										<Markdown>{tCL101}</Markdown>
										<h2 className="ion-text-center"><strong>v.0.9.5</strong></h2>
										<Markdown>{tCL95}</Markdown>
										<h2 className="ion-text-center"><strong>v.0.9.4</strong></h2>
										<Markdown>{tCL94}</Markdown>
									</div>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<div id="coffee" className="ion-text-center">
								<a href="https://www.buymeacoffee.com/jasontank">
									<img
										src="default-blue.webp"
										alt="Buy Me A Coffee"
										style={ getBannerDimensions(width) }
									/>
								</a>
							</div>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default AppInfo;
