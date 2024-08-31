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
	helpCircle,
	logInOutline,
	logOutOutline,
	reorderThree
} from 'ionicons/icons';
import Markdown, { ExtraProps } from 'react-markdown';

import { PageData, SetBooleanState } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import Header from '../../components/Header';
import { DJGroupsIcon, DeclenjugatorIcon } from '../../components/icons';
import { RegularExpressions } from '../../components/regularExpressionsInfo';

type CodeProps = React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps;
interface CardProps {
	hideOverview?: boolean
	setIsOpenInfo?: SetBooleanState
}
const OverviewButton: FC<CardProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const { hideOverview, setIsOpenInfo } = props;
	const clicker = useCallback(() => setIsOpenInfo && setIsOpenInfo(false), [setIsOpenInfo]);
	const tHelp = useMemo(() => tc("Help"), [tc]);
	if(hideOverview) {
		return <></>;
	}
	return (
		<IonButton
			color="secondary"
			slot="end"
			routerLink="/dj/overview"
			routerDirection="forward"
			onClick={clicker}
			aria-label={tHelp}
		>
			<IonIcon icon={helpCircle} />
		</IonButton>
	);
};

export const InputCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('dj');
	const main = useMemo(() => t("info.input", { joinArrays: "\n"}), [t]);
	const tInputTab = useMemo(() => t("InputTab"), [t]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={logInOutline} slot="start" color="primary" />
				<IonLabel>{tInputTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown>{main}</Markdown>
			</IonCardContent>
		</IonCard>
	);
};

export const GroupCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('dj');
	const main = useMemo(() => t("info.groups", { joinArrays: "\n"}), [t]);
	const example = useMemo(() => t("info.groupsExample", { returnObjects: true}), [t]);
	const examples = useMemo(() => (example as {title: string, content: string[]}[]).map((obj, i) => {
		const {title, content} = obj;
		return (
			<React.Fragment key={`DJexample/${title}/${i}`}>
				<div className="title">{t(title)}</div>
				<Markdown>{content.join("\n")}</Markdown>
			</React.Fragment>
		);
	}), [example, t]);
	const codeComps = useMemo(() => ({
		code(props: CodeProps) {
			return <IonIcon icon={reorderThree} color="tertiary" size="small" />;
		}
	}), []);
	const tGroupsTab = useMemo(() => t("GroupsTab"), [t]);
	return (
		<IonCard>
			<IonItem lines="full">
				<DJGroupsIcon slot="start" color="primary" />
				<IonLabel>{tGroupsTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown
					components={codeComps}
				>{main}</Markdown>
				<div className="example">
					{examples}
				</div>
				<RegularExpressions />
			</IonCardContent>
		</IonCard>
	);
}

export const OutputCard: FC<CardProps> = (props) => {
	const [ t ] = useTranslator('dj');
	const main = useMemo(() => t("info.output", { joinArrays: "\n"}), [t]);
	const tOutputTab = useMemo(() => t("OutputTab"), [t]);
	return (
		<IonCard>
			<IonItem lines="full">
				<IonIcon icon={logOutOutline} slot="start" color="primary" />
				<IonLabel>{tOutputTab}</IonLabel>
				<OverviewButton {...props} />
			</IonItem>
			<IonCardContent>
				<Markdown>{main}</Markdown>
			</IonCardContent>
		</IonCard>
	);
}

const DJinfo: FC<PageData> = (props) => {
	const [ t ] = useTranslator('dj');
	const [ tc ] = useTranslator('common');
	const main = useMemo(() => t("info.overview", { joinArrays: "\n"}), [t]);
	const tOverview = useMemo(() => tc("overviewOf", { what: tc("Declenjugator") }), [tc]);
	const tWhat = useMemo(() => t("WhatIsDJ"), [t]);

	return (
		<IonPage>
			<IonHeader>
				<Header title={tOverview} />
			</IonHeader>
			<IonContent className="overview">
				<IonCard>
					<IonItem lines="full">
						<DeclenjugatorIcon slot="start" color="primary" />
						<IonLabel>{tWhat}</IonLabel>
					</IonItem>
					<IonCardContent>
						<Markdown>{main}</Markdown>
					</IonCardContent>
				</IonCard>
				<InputCard hideOverview />
				<GroupCard hideOverview />
				<OutputCard hideOverview />
			</IonContent>
		</IonPage>
	);
};

export default DJinfo;
