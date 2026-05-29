import React, { useCallback, useMemo, FC } from 'react';
import {
	IonList,
	IonItem,
	IonRadioGroup,
	IonRadio,
	IonToggle,
	IonSelectOption,
	IonSelect,
	ToggleCustomEvent,
	SelectCustomEvent,
	RadioGroupCustomEvent
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import useTranslator from '../../../store/translationHooks';
import { WEOutputTypes, ModalProperties, StateObject } from '../../../store/types';
import { setCustomSort, setFlag, setOutputWE } from '../../../store/weSlice';
import PermanentInfo from '../../../components/PermanentInfo';
import useI18Memo from '../../../components/useI18Memo';
import Modal from '../../../components/Modal';

const translations = [
	"ConvertToLowercase", "InputThenOutput",
	"OutputOnly", "OutputAndSCRules", "OutputThenInput",
	"SortBeforehand"
];

const commons = [ "defaultSort", "SortMethod" ];

const OutputOptionsModal: FC<ModalProperties> = (props) => {
	const [ tw ] = useTranslator('wgwe');
	const tOutOpt = useMemo(() => tw("OutputOptions"), [tw]);
	const [ tDefault, tMethod ] = useI18Memo(commons);
	const [ tConvert, tInOut, tOut, tOutSC, tOutIn, tSortIn ] = useI18Memo(translations, "we");

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const {
		outputStyle,
		inputLower,
		inputAlpha,
		customSort
	} = useSelector((state: StateObject) => state.we);
	const { customSorts } = useSelector((state: StateObject) => state.sortSettings);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const toggleLower = useCallback((e: ToggleCustomEvent) => dispatch(setFlag(["inputLower", e.detail.checked])), [dispatch]);
	const toggleAlpha = useCallback((e: ToggleCustomEvent) => dispatch(setFlag(["inputAlpha", e.detail.checked])), [dispatch]);
	const doSetMethod = useCallback((e: SelectCustomEvent) => dispatch(setCustomSort(e.detail.value)), [dispatch]);
	const setDisplayMethod = useCallback(
		(e: RadioGroupCustomEvent) => dispatch(setOutputWE(e.detail.value as WEOutputTypes)),
		[dispatch]
	);

	return (
		<Modal
			isOpen={isOpen}
			title={tOutOpt}
			closeFunc={closer}
			bottomEnd={[{button: "done"}]}
		>
			<IonList lines="none">
				<IonItem lines="full">
					<IonToggle
						enableOnOffLabels
						labelPlacement="start"
						checked={inputLower}
						onIonChange={toggleLower}
					>{tConvert}</IonToggle>
				</IonItem>
				<IonItem lines={inputAlpha ? "none" : undefined}>
					<IonToggle
						enableOnOffLabels
						labelPlacement="start"
						checked={inputAlpha}
						onIonChange={toggleAlpha}
					>{tSortIn}</IonToggle>
				</IonItem>
				<IonItem className={inputAlpha ? "" : "hide"} lines="full">
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tMethod}
						value={customSort || null}
						onIonChange={doSetMethod}
					>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value={null}
						>{tDefault}</IonSelectOption>
						{customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).map(sorter => (
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								key={`inputSortChooser:${sorter.id}:${sorter.title}`}
								value={sorter.id}
							>{sorter.title}</IonSelectOption>
						))}
					</IonSelect>
				</IonItem>
				<IonRadioGroup
					value={outputStyle}
					onIonChange={setDisplayMethod}
				>
					<IonItem className="ion-text-wrap">
						<IonRadio
							value="outputOnly"
							labelPlacement="end"
							justify="start"
						>{tOut}</IonRadio>
					</IonItem>
					<IonItem className="ion-text-wrap">
						<IonRadio
							value="rulesApplied"
							labelPlacement="end"
							justify="start"
						>{tOutSC}</IonRadio>
					</IonItem>
					<IonItem className="ion-text-wrap">
						<IonRadio
							value="inputFirst"
							labelPlacement="end"
							justify="start"
						>{tInOut}</IonRadio>
					</IonItem>
					<IonItem className="ion-text-wrap" lines="full">
						<IonRadio
							value="outputFirst"
							labelPlacement="end"
							justify="start"
						>{tOutIn}</IonRadio>
					</IonItem>
				</IonRadioGroup>
			</IonList>
		</Modal>
	);
};

export default OutputOptionsModal;
