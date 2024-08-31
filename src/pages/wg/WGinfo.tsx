import React, { FC, ReactElement, useCallback, useMemo } from 'react';
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
	optionsOutline,
	documentTextOutline,
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
import IPA from '../../components/IPA';
import Header from '../../components/Header';
import {
	SyllablesIcon,
	TransformationsIcon,
	WordGenIcon
} from '../../components/icons';
import { RegularExpressions } from '../../components/regularExpressionsInfo';
import { Block, BlockStorage, parseBlock } from '../../components/infoBlocks';
import useI18Memo, { useI18MemoObject } from '../../components/useI18Memo';

type CodeProps = React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps;

interface CardProps {
	isOverview?: boolean
	setIsOpenInfo?: SetBooleanState
}
const OverviewButton: FC<CardProps> = (props) => {
	const { isOverview, setIsOpenInfo } = props;
	const [ tc ] = useTranslator('common');
	const tHelp = useMemo(() => tc('Help'), [tc]);
	const clicker = useCallback(() => setIsOpenInfo && setIsOpenInfo(false), [setIsOpenInfo]);
	if(isOverview) {
		return <></>;
	}
	return (
		<IonButton
			color="secondary"
			slot="end"
			routerLink="/wg/overview"
			routerDirection="forward"
			onClick={clicker}
			aria-label={tHelp}
		>
			<IonIcon icon={helpCircle} />
		</IonButton>
	);
};

const joinArrays = { joinArrays: "\n"};

const charGroupInfo = [
	"info.charGroups", "info.charGroupsNotOverview",
	"info.charGroupsIsOverview"
];
export const CharGroupCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tw ] = useTranslator('wgwe');
	const example = useMemo(() => t("info.charGroupExample", { returnObjects: true }), [t]);
	const tCharGroupTab = useMemo(() => tw("CharacterGroupsTab"), [tw]);
	const [ plainText, endNotOverview, endIsOverview ] = useI18Memo(charGroupInfo, 'wg', joinArrays);
	const codeProps = useMemo(() => ({
		code: (props: CodeProps) => {
			const { children } = props;
			if(children === "example") {
				const inner: ReactElement[] = [];
				(example as string[]).forEach((bit, i) => {
					inner.push(
						<strong key={`charGroupExample/${bit}/${i}`}>{bit}</strong>,
						<br key={`charGroupExample/linebreak-${i}`} />
					)
				});
				return <span className="emphasizedSection">{inner}</span>;
			}
			return <IPA>{children}</IPA>;
		}
	}), [example]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={gridOutline} slot="start" color="primary" />
				<IonLabel>{tCharGroupTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown components={codeProps}>{plainText}</Markdown>
				<Markdown>{props.isOverview ? endIsOverview : endNotOverview}</Markdown>
			</IonCardContent>
		</IonCard>
	);
}

const syllExamples = [ "info.charGroupExample", "info.syllablesExample" ];
const syllInfo = [
	"info.syllablesStartIsOverview", "info.syllablesStart",
	"info.syllables", "info.syllablesEndIsOverview",
	"info.syllablesEnd"
];
export const SylCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('wg');
	const { isOverview } = props;
	const [ charGroupExample, example ] = useI18MemoObject(syllExamples, 'wg');
	const [
		startIsOverview, startNotOverview,
		plainText, endIsOverview, endNotOverview
	] = useI18Memo(syllInfo, 'wg', joinArrays);
	const tSyllTab = useMemo(() => t("SyllablesTab"), [t]);
	const codeProps = useMemo(() => ({
		code(props: CodeProps) {
			const { children } = props;
			if(children === "charGroup example") {
				const inner: ReactElement[] = [];
				(charGroupExample as string[]).forEach((bit, i) => {
					inner.push(
						<strong key={`syllCharGroupExample/${bit}/${i}`}>{bit}</strong>
					);
					(i + 1 !== (charGroupExample as string[]).length)
						&& inner.push(<br key={`syllCharGroupExample/linebreak-${i}`} />);
				});
				return <span className="emphasizedSection">{inner}</span>;
			}
			return <></>;
		}
	}), [charGroupExample])
	const emphasis = useMemo(() => (
		<div className="emphasizedSection">
			{(example as string[]).map((bit, i) => {
				const inner: ReactElement[] = [];
				inner.push(
					<strong key={`syllExample/${bit}/${i}`}>{bit}</strong>
				);
				(i + 1 !== (example as string[]).length)
					&& inner.push(<br key={`syllExample/linebreak-${i}`} />);
				return <React.Fragment key={`syllExampleGroup/${bit}/${i}`}>{inner}</React.Fragment>
			})}
		</div>
	), [example]);
	return (
		<IonCard>
			<IonItem lines="full">
				<SyllablesIcon slot="start" color="primary" />
				<IonLabel>{tSyllTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown components={codeProps}>{isOverview ? startIsOverview : startNotOverview}</Markdown>

				{emphasis}

				<Markdown>{plainText}</Markdown>

				<Markdown>{isOverview ? endIsOverview : endNotOverview}</Markdown>

			</IonCardContent>
		</IonCard>
	);
}

export const TransCard: FC<CardProps> = (props) => {
	const arrow = useMemo(() => (ltr() ? "⟶" : "⟵"), []);
	const [ t ] = useTranslator('wg');
	const [ tw ] = useTranslator('wgwe');
	const plainText = useMemo(() => t("info.trans", { arrow, joinArrays: "\n"}), [t, arrow]);
	const tTransTab = useMemo(() => tw("TransformationsTab"), [tw]);
	const codeProps = useMemo(() => {
		const blocks = t("info.transBlocks", { returnObjects: true });
		const blockStorage: BlockStorage = {};
		Object.entries(blocks).forEach(([label, info]: [string, Block]) => {
			blockStorage[label] = parseBlock(info, arrow);
		});
		return {
			code(props: CodeProps) {
				const { children } = props;
				return (
					(typeof(children) === "string" && blockStorage[children])
					|| <IonIcon icon={reorderTwo} color="tertiary" size="small" />
				);
			}
		};
	}, [t, arrow]);
	return (
		<IonCard>
			<IonItem lines="full">
				<TransformationsIcon slot="start" color="primary" />
				<IonLabel>{tTransTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown components={codeProps}>{plainText}</Markdown>
				<RegularExpressions />
			</IonCardContent>
		</IonCard>
	);
}

const outInfo = [ "info.outputMain", "info.outputSettings", "info.outputLexicon" ];
export const OutCard: FC<CardProps> = (props) => {
	const [ tw ] = useTranslator('wgwe');
	const [ main, settings, lexicon ] = useI18Memo(outInfo, 'wg', joinArrays);
	const tOutTab = useMemo(() => tw("OutputTab"), [tw]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={documentTextOutline} slot="start" color="primary" />
				<IonLabel>{tOutTab}</IonLabel>
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
}

export const OptCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('wg');
	const main = t("info.settings", { joinArrays: "\n"});
	const tSettTab = useMemo(() => t("SettingsTab"), [t]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={optionsOutline} slot="start" color="primary" />
				<IonLabel>{tSettTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown>{main}</Markdown>
			</IonCardContent>
		</IonCard>
	);
}

const WGinfo: FC<PageData> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tc ] = useTranslator('common');
	const main = useMemo(() => t("info.overview", { joinArrays: "\n"}), [t]);
	const tOverview = useMemo(() => {
		return tc("overviewOf", { what: tc("WordGen") });
	}, [tc]);
	const tWhatIsWG = useMemo(() => t("WhatIsWordGen"), [t]);
	return (
		<IonPage>
			<IonHeader>
				<Header title={tOverview} />
			</IonHeader>
			<IonContent className="overview">
				<IonCard>
					<IonItem lines="full">
						<WordGenIcon slot="start" color="primary" />
						<IonLabel>{tWhatIsWG}</IonLabel>
					</IonItem>
					<IonCardContent>
						<Markdown>{main}</Markdown>
					</IonCardContent>
				</IonCard>
				<CharGroupCard isOverview />
				<SylCard isOverview />
				<TransCard isOverview />
				<OutCard isOverview />
				<OptCard isOverview />
			</IonContent>
		</IonPage>
	);
};

export default WGinfo;
