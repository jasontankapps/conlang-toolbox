import React, { useCallback, useState, FC, useMemo } from 'react';
import {
	IonPage,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonContent,
	IonCardTitle,
	IonButton,
	IonLabel
} from '@ionic/react';
//import { globeOutline } from 'ionicons/icons';
import { helpCircle } from 'ionicons/icons';
import { useSelector } from "react-redux";

import { PageData, StateObject } from '../store/types';
import { currentVersion } from '../store/blankAppState';

import {
	ConceptsIcon,
	LexiconIcon,
	WordEvolveIcon,
	WordGenIcon,
	MorphoSyntaxIcon,
	DeclenjugatorIcon
} from '../components/icons';
import Header from '../components/Header';
import { AppPage, appPagesObject } from '../components/appPagesInfo';
import ModalWrap from '../components/ModalWrap';
import useI18Memo from '../components/useI18Memo';
import ExtraCharactersModal from './modals/ExtraCharacters';
import { ConceptCard } from './Concepts';
import { LexCard } from './Lex';

const subPages = (objs: AppPage[], prefix: string) => objs.filter(obj => !obj.hidden).map((obj, i) => {
	const { url, tab, icon, Icon, noIcon } = obj;
	return (
		<IonButton routerLink={url} routerDirection="forward" key={`${prefix}Btn-${tab}`}>
			{Icon ? <Icon /> : (icon ? <IonIcon icon={icon} /> : <IonLabel>p.{noIcon || i}</IonLabel>)}
		</IonButton>
	);
});

const translations =  [
	"AppInfo", "Concepts", "appTitle", "Declenjugator", "Help",
	"Lexicon", "MorphoSyntax", "WordEvolve", "WordGen"
];

const Home: FC<PageData> = (props) => {
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenConcepts, setIsOpenConcepts] = useState<boolean>(false);
	const [isOpenLexicon, setIsOpenLexicon] = useState<boolean>(false);
	const originalTheme = useSelector((state: StateObject) => state.appSettings.theme);
	const lastViewMS = useSelector((state: StateObject) => state.internals.lastViewMS);
	const theme = originalTheme.replace(/ /g, "") + "Theme";
	const [
		tAppInfo, tConcepts, tConlangToolbox, tDeclenjugator, tHelp,
		tLexicon, tMorphoSyntax, tWordEvolve, tWordGen
	] = useI18Memo(translations);
	const openLex = useCallback(() => setIsOpenLexicon(true), []);
	const openConcepts = useCallback(() => setIsOpenConcepts(true), []);

	const msLinks = useMemo(() => subPages(appPagesObject.ms, "ms"), []);
	const weLinks = useMemo(() => subPages(appPagesObject.we, "we"), []);
	const wgLinks = useMemo(() => subPages(appPagesObject.wg, "wg"), []);
	const djLinks = useMemo(() => subPages(appPagesObject.dj, "dj"), []);

	return (
		<IonPage className={theme}>
			<ExtraCharactersModal {...props.modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...props.modalPropsMaker(isOpenConcepts, setIsOpenConcepts)}><ConceptCard /></ModalWrap>
			<ModalWrap {...props.modalPropsMaker(isOpenLexicon, setIsOpenLexicon)}><LexCard /></ModalWrap>
			<Header title={tConlangToolbox} />
			<IonContent className="containedCards" id="about">
				<IonGrid>

					<IonRow className="major">
						<IonCol>
							<IonButton size="large" routerLink={"/ms/" + lastViewMS} routerDirection="forward">
								<MorphoSyntaxIcon slot="start" />
								<IonLabel>{tMorphoSyntax}</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							{msLinks}
							<IonButton routerLink="/ms/overview" aria-label={tHelp} className="help" routerDirection="forward">
								<IonIcon icon={helpCircle} />
							</IonButton>
						</IonCol>
					</IonRow>

					<IonRow className="major">
						<IonCol>
							<IonButton size="large" routerLink="/wg/overview" routerDirection="forward">
								<WordGenIcon slot="start" />
								<IonLabel>{tWordGen}</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							{wgLinks}
							<IonButton routerLink="/wg/overview" aria-label={tHelp} className="help" routerDirection="forward">
								<IonIcon icon={helpCircle} />
							</IonButton>
						</IonCol>
					</IonRow>

					<IonRow className="major">
						<IonCol>
							<IonButton size="large" routerLink="/we/overview" routerDirection="forward">
								<WordEvolveIcon slot="start" />
								<IonLabel>{tWordEvolve}</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							{weLinks}
							<IonButton routerLink="/we/overview" aria-label={tHelp} className="help" routerDirection="forward">
								<IonIcon icon={helpCircle} />
							</IonButton>
						</IonCol>
					</IonRow>

					<IonRow className="major">
						<IonCol>
							<IonButton size="large" routerLink="/dj/overview" routerDirection="forward">
								<DeclenjugatorIcon slot="start" />
								<IonLabel>{tDeclenjugator}</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							{djLinks}
							<IonButton routerLink="/dj/overview" aria-label={tHelp} className="help" routerDirection="forward">
								<IonIcon icon={helpCircle} />
							</IonButton>
						</IonCol>
					</IonRow>

					<IonRow className="major">
						<IonCol>
							<IonButton size="large" routerLink="/lex" routerDirection="forward">
								<LexiconIcon slot="start" />
								<IonLabel>{tLexicon}</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonButton className="help" aria-label={tHelp} onClick={openLex}>
								<IonIcon icon={helpCircle} />
							</IonButton>
						</IonCol>
					</IonRow>

					<IonRow className="major">
						<IonCol>
							<IonButton size="large" routerLink="/wordlists" routerDirection="forward">
								<ConceptsIcon slot="start" />
								<IonLabel>{tConcepts}</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonButton className="help" aria-label={tHelp} onClick={openConcepts}>
								<IonIcon icon={helpCircle} />
							</IonButton>
						</IonCol>
					</IonRow>

					<IonRow className="final">
						<IonCol>
							<IonCard
								button={true}
								routerLink="/appinfo"
								routerDirection="forward"
							>
								<IonCardHeader className="ion-text-center">
									<IonCardTitle
										className="ion-align-self-start"
									>{tAppInfo}</IonCardTitle>
								</IonCardHeader>
								<IonCardContent>
									<div className="ion-text-center">v.{currentVersion}</div>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Home;
