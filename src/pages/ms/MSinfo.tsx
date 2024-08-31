import React, { FC, useMemo } from 'react';
import {
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonPage
} from '@ionic/react';
import { informationCircle, settings } from 'ionicons/icons';
import Markdown from 'react-markdown';

import { PageData } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import Header from '../../components/Header';
import { MorphoSyntaxIcon } from '../../components/icons';
import useI18Memo from '../../components/useI18Memo';

const translations = [
	"overviewInfo", "overviewMain", "overviewSettings", "overviewTopics"
];

const joiner = { joinArrays: "\n" };

const MSinfo: FC<PageData> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const tWhat = useMemo(() => t("WhatIsMS"), [t]);
	const tOverview = useMemo(() => tc("overviewOf", { what: tc("MorphoSyntax")}), [tc]);
	const [ tInfo, tMain, tSett, tTopic ] = useI18Memo(translations, "ms", joiner);

	return (
		<IonPage>
			<IonHeader>
				<Header title={tOverview} />
			</IonHeader>
			<IonContent className="overview">
				<IonCard>
					<IonItem lines="full">
						<MorphoSyntaxIcon slot="start" color="primary" />
						<IonLabel>{tWhat}</IonLabel>
					</IonItem>
					<IonCardContent>

						<Markdown>{tMain}</Markdown>

						<p className="center pad-top-rem">
							<IonIcon icon={settings} size="large" color="tertiary" />
						</p>
						<Markdown>{tSett}</Markdown>

						<p className="center pad-top-rem">
							<IonIcon icon={informationCircle} size="large" color="tertiary" />
						</p>
						<Markdown>{tInfo}</Markdown>

						<hr />

						<Markdown>{tTopic}</Markdown>

					</IonCardContent>
				</IonCard>
			</IonContent>
		</IonPage>
	);
};

export default MSinfo;
