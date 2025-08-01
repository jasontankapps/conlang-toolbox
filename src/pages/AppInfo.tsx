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
	IonButton,
	IonTextarea,
	IonToggle
} from '@ionic/react';
import { useSelector } from "react-redux";
import Markdown from 'react-markdown';
import { useWindowWidth } from '@react-hook/window-size/throttled';

import { PageData, StateObject, ThemeNames } from '../store/types';

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
	"BugReports", "Changelog",
	"CreditsAcknowledgements",
	"EntireState", "HideOlderChanges",
	"ShowOlderChanges"
];
const markdowns = [ "credit1", "credit2", "credit3", "bugReportMsg" ];
const commons = [ "Copy", "Ok", "AppInfo", "CopyToClipboard" ];
const changelog = [
	"changelog.v094", "changelog.v095", "changelog.v0101",
	"changelog.v0113", "changelog.v0120", "changelog.v0130"
];
const context = { joinArrays: "\n" };

const AppInfo: FC<PageData> = (props) => {
	const width = useWindowWidth();
	const [
		tBugRep, tCLog, tCredits,
		tEntire, tHide, tShow
	] = useI18Memo(translations, 'appInfo');
	const [ tCopy, tOk, tAppInfo, tCopyClipboard ] = useI18Memo(commons);
	const [ tCL94, tCL95, tCL101, tCL113, tCL120, tCL130 ] = useI18Memo(changelog, 'appInfo', context);
	const [ tCr1, tCr2, tCr3, tBugRepMsg ] = useI18Memo(markdowns, "appInfo", context);

	const state = useSelector(
		(state: StateObject) => state
	);
	const originalTheme: ThemeNames = state.appSettings.theme;
	const { wg, we, ms, dj, lexicon, internals } = state;
	const [debug, setDebug] = useState<number>(1);
	const [showOlder, setShowOlder] = useState<boolean>(false);
	const [showWG, setShowWG] = useState<boolean>(false);
	const [showWE, setShowWE] = useState<boolean>(false);
	const [showMS, setShowMS] = useState<boolean>(false);
	const [showDJ, setShowDJ] = useState<boolean>(false);
	const [showLex, setShowLex] = useState<boolean>(false);
	const [errorLogInfo, setErrorLogInfo] = useState<string>(JSON.stringify({internals}));
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const theme = originalTheme.replace(/ /g, "") + "Theme";

	const modLog = (which: 0 | 1 | 2 | 3 | 4) => {
		const log: Partial<StateObject> = { internals };
		const array = [showWG, showWE, showMS, showDJ, showLex];
		const setters = [setShowWG, setShowWE, setShowMS, setShowDJ, setShowLex];
		setters[which](array[which] = !array[which]);
		array[0] && (log.wg = wg);
		array[1] && (log.we = we);
		array[2] && (log.ms = ms);
		array[3] && (log.dj = dj);
		array[4] && (log.lexicon = lexicon);
		setErrorLogInfo(JSON.stringify(log));
	};

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
									<div>
										<IonToggle checked={showWG} onIonChange={() => modLog(0)}>WordGen</IonToggle>
									</div>
									<div>
										<IonToggle checked={showWE} onIonChange={() => modLog(1)}>WordEvolve</IonToggle>
									</div>
									<div>
										<IonToggle checked={showMS} onIonChange={() => modLog(2)}>MorphoSyntax</IonToggle>
									</div>
									<div>
										<IonToggle checked={showDJ} onIonChange={() => modLog(3)}>Declenjugator</IonToggle>
									</div>
									<div>
										<IonToggle checked={showLex} onIonChange={() => modLog(4)}>Lexicon</IonToggle>
									</div>
									<div className="logTextArea">
										<IonTextarea
											disabled={true}
											fill="outline"
											value={errorLogInfo}
										></IonTextarea>
									</div>
									<div className="ion-text-center">
										<IonButton size="small" onClick={() => copyText(errorLogInfo, toast)} color="warning" fill="outline">{tCopyClipboard}</IonButton>
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
									<h2 className="ion-text-center" onClick={maybeDebug}><strong>v.0.13.0</strong></h2>
									<Markdown>{tCL130}</Markdown>
									<h2 className="ion-text-center"><strong>v.0.12.0</strong></h2>
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
