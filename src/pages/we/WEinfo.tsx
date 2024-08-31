import React, { FC, useCallback, useMemo } from 'react';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonPage
} from '@ionic/react';
import {
	enterOutline,
	exitOutline,
	gridOutline,
	bookOutline,
	settingsOutline,
	reorderTwo,
	helpCircle
} from 'ionicons/icons';
import Markdown, { ExtraProps } from 'react-markdown';

import { PageData, SetBooleanState } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import ltr from '../../components/LTR';
import Header from '../../components/Header';
import { SoundChangesIcon, TransformationsIcon, WordEvolveIcon } from '../../components/icons';
import { RegularExpressions } from '../../components/regularExpressionsInfo';
import { Block, BlockStorage, parseBlock } from '../../components/infoBlocks';

interface CardProps {
	hideOverview?: boolean
	setIsOpenInfo?: SetBooleanState
}

const OverviewButton: FC<CardProps> = (props) => {
	const { hideOverview, setIsOpenInfo } = props;
	const [ tc ] = useTranslator('common');
	const tHelp = useMemo(() => hideOverview ? "" : tc("Help"), [tc, hideOverview]);
	const maybeClose = useCallback(() => setIsOpenInfo && setIsOpenInfo(false), [setIsOpenInfo]);
	if(hideOverview) {
		return <></>;
	}
	return (
		<IonButton
			color="secondary"
			slot="end"
			routerLink="/we/overview"
			routerDirection="forward"
			aria-label={tHelp}
			onClick={maybeClose}
		>
			<IonIcon icon={helpCircle} />
		</IonButton>
	);
};

export const InpCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('we');
	const main = useMemo(() => t("info.input", { joinArrays: "\n"}), [t]);
	const tInput = useMemo(() => t("InputTab"), [t]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={enterOutline} slot="start" color="primary" />
				<IonLabel>{tInput}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown>{main}</Markdown>
			</IonCardContent>
		</IonCard>
	);
};

export const CharGroupCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tw ] = useTranslator('wgwe');
	const main = useMemo(() => t("info.charGroups", { joinArrays: "\n"}), [t]);
	const tCG = useMemo(() => tw("CharacterGroupsTab"), [tw]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={gridOutline} slot="start" color="primary" />
				<IonLabel>{tCG}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown>{main}</Markdown>
			</IonCardContent>
		</IonCard>
	);
};

const transComponents = {
	code: (props: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps) => {
		return <IonIcon icon={reorderTwo} color="tertiary" size="small" />;
	}
};
export const TraCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tw ] = useTranslator('wgwe');
	const main = useMemo(() => t("info.transformations", { joinArrays: "\n"}), [t]);
	const tTransformations = useMemo(() => tw("TransformationsTab"), [tw]);
	return (
		<IonCard>
			<IonItem lines="full">
				<TransformationsIcon slot="start" color="primary" />
				<IonLabel>{tTransformations}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown components={transComponents}>{main}</Markdown>
			</IonCardContent>
		</IonCard>
	);
};

export const SChCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('we');
	const main = useMemo(() => t("info.soundChanges", { joinArrays: "\n"}), [t]);
	const tSound = useMemo(() => t("SoundChangesTab"), [t]);
	const components = useMemo(() => {
		const arrow = (ltr() ? "⟶" : "⟵");
		const blockStorage: BlockStorage = {};
		Object.entries(t("info.soundChangesBlocks", { returnObjects: true })).forEach(([label, info]: [string, Block]) => {
			blockStorage[label] = parseBlock(info, arrow);
		});
		return {
			code: (props: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps) => {
				const { children } = props;
				return (
					typeof(children) === "string"
					&& blockStorage[children]
				) || <IonIcon icon={reorderTwo} color="tertiary" size="small" />;
			}
		}
	}, [t]);
	return (
		<IonCard>
			<IonItem lines="full">
				<SoundChangesIcon slot="start" color="primary" />
				<IonLabel>{tSound}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown components={components}>{main}</Markdown>
				<RegularExpressions />
			</IonCardContent>
		</IonCard>
	);
};

export const OutCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tw ] = useTranslator('wgwe');
	const main = useMemo(() => t("info.outputMain", { joinArrays: "\n"}), [t]);
	const settings = useMemo(() => t("info.outputSettings", { joinArrays: "\n"}), [t]);
	const lexicon = useMemo(() => t("info.outputLexicon", { joinArrays: "\n"}), [t]);
	const tOutput = useMemo(() => tw("OutputTab"), [tw]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={exitOutline} slot="start" color="primary" />
				<IonLabel>{tOutput}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown>{main}</Markdown>
				<p className="center pad-top-rem">
					<IonIcon icon={settingsOutline} color="tertiary" size="large" />
				</p>
				<Markdown>{settings}</Markdown>
				<p className="center pad-top-rem">
					<IonIcon icon={bookOutline} color="tertiary" size="large" />
				</p>
				<Markdown>{lexicon}</Markdown>
			</IonCardContent>
		</IonCard>
	);
};

const WEinfo: FC<PageData> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const main = useMemo(() => t("info.overview", { joinArrays: "\n"}), [t]);
	const tWhat = useMemo(() => t("WhatIsWE"), [t]);
	const tOverview = useMemo(() => tc("Overview"), [tc]);
	return (
		<IonPage>
			<IonHeader>
				<Header title={tOverview} />
			</IonHeader>
			<IonContent className="overview">
				<IonCard>
					<IonItem lines="full">
						<WordEvolveIcon slot="start" color="primary" />
						<IonLabel>{tWhat}</IonLabel>
					</IonItem>
					<IonCardContent>
						<Markdown>{main}</Markdown>
					</IonCardContent>
				</IonCard>
				<InpCard hideOverview />
				<CharGroupCard hideOverview />
				<TraCard hideOverview />
				<SChCard hideOverview />
				<OutCard hideOverview />
			</IonContent>
		</IonPage>
	);
};

export default WEinfo;
