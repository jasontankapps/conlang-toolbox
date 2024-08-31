import React, { FC, useCallback, useMemo } from 'react';
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
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { closeCircleSharp } from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import WGPresets from '../../../store/wgPresets';
import { Base_WG, ModalProperties, StateObject, WGPresetArray } from '../../../store/types';
import { loadStateWG } from '../../../store/wgSlice';
import useTranslator from '../../../store/translationHooks';

import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

const getSpecialValue: (x: string) => [string, ...[string, string][]] | [string] = (input) => {
	let m = input.match(/^(.+?)((?:\[[^=]+=[^\]]+\])+)$/);
	if(m) {
		const key = m[1];
		let remains = m[2];
		const options: [string, string][] = [];
		while((m = remains.match(/^\[([^=]+)=([^\]]+)\](.*)/))) {
			options.push([m[1], m[2]]);
			remains = m[3];
		}
		return [key, ...options];
	}
	return [input];
};

interface PresetItemProps {
	title: string
	onClick: () => void
}
const PresetItem: FC<PresetItemProps> = (props) => {
	const { title, onClick } = props;
	return (
		<IonItem button={true} onClick={onClick}>
			<IonLabel>{title}</IonLabel>
		</IonItem>

	);
};

const commons = [ "Cancel", "LoadPreset", "confirmLoad" ];

const MaybeLoadPresetModal: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tc ] = useTranslator('common');
	const [ tCancel, tLoadPre, tConfLoad ] = useI18Memo(commons);
	const tClearAll = useMemo(() => t("clearAllThingsMsg"), [t]);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const {disableConfirms} = useSelector((state: StateObject) => state.appSettings);
	const maybeLoadPreset = useCallback((preset: string, object: Base_WG) => {
		const handler = () => {
			const copy = {...object};
			copy.characterGroups = object.characterGroups.map(group => {
				const { title, ...etc } = group;
				const [value, ...pairs] = getSpecialValue(title);
				const options: {[key: string]: string} = {};
				pairs.forEach(([prop, v]) => {
					options[prop] = t(v);
				});
				return {
					...etc,
					title: t(value, options)
				};
			});
			copy.transforms = object.transforms.map(group => {
				const { description, ...etc } = group;
				const [value, ...pairs] = getSpecialValue(description);
				const options: {[key: string]: string} = {};
				pairs.forEach(([prop, v]) => {
					options[prop] = t(v);
				});
				return {
					...etc,
					description: value && t(value, options)
				};
			});
			dispatch(loadStateWG(copy));
			toaster({
				message: tc("titleLoaded", { title: preset }),
				duration: 2500,
				color: "success",
				position: "top",
				toast
			});
			setIsOpen(false);
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tc("loadTitleQ", { title: preset }),
				message: tClearAll,
				cssClass: "warning",
				submit: tConfLoad,
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, setIsOpen, t, tc, toast, tConfLoad, tClearAll]);
	const presets = useMemo(() => WGPresets.map((pair: WGPresetArray[number]) => {
		const [ title, object ] = pair;
		const tTitle = t(title);
		return <PresetItem title={tTitle} key={title} onClick={() => maybeLoadPreset(tTitle, object)} />;
	}), [maybeLoadPreset, t]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tLoadPre} closeModal={setIsOpen} />
			<IonContent>
				<IonList lines="none" className="buttonFilled">
					{isOpen ? presets : <></>}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="danger" slot="end" onClick={closer}>
						<IonIcon icon={closeCircleSharp} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default MaybeLoadPresetModal;
