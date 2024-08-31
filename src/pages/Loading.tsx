import React from 'react';
import {
	IonPage,
	IonContent,
	IonSpinner,
	IonText
} from '@ionic/react';
import useI18Memo from '../components/useI18Memo';

const loading = ["Loading"];
const Loading = () => {
	const [ tLoading ] = useI18Memo(loading)
	return (
		<IonPage>
			<IonContent id="loadingPage">
				<div>
					<IonText color="primary"><h1>{tLoading}</h1></IonText>
					<IonSpinner name="bubbles" color="secondary" />
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Loading;
