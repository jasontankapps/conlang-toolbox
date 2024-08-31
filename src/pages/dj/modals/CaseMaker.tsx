import React, { useCallback, useState, FC, Fragment, useMemo } from 'react';
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
	useIonToast,
	IonItemDivider
} from '@ionic/react';
import {
	closeCircleOutline,
	saveOutline
} from 'ionicons/icons';

import {
	ExtraCharactersModalOpener,
	SetState
} from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import toaster from '../../../components/toaster';
import yesNoAlert from '../../../components/yesNoAlert';
import ModalHeader from '../../../components/ModalHeader';
import useI18Memo from '../../../components/useI18Memo';

interface CaseMakerModal extends ExtraCharactersModalOpener {
	setSavedTitle: SetState<string>
}

type caseBit = string | [string, string];

interface CaseObject {
	header: string
	content: caseBit[],
	extended?: caseBit[]
}
interface CaseItemProps {
	caseObject: CaseObject
	add: (x: caseBit) => void
	toggleTitleGroup: (c: string) => void
	titleGroup: {[key: string]: boolean}
}

const CaseItem: FC<CaseItemProps> = (props) => {
	const { caseObject, add, toggleTitleGroup, titleGroup } = props;
	const { header, content, extended } = caseObject;
	const [ t ] = useTranslator('dj');
	const tHideOrShow = useMemo(() => t(titleGroup[header] ? "Hide" : "ShowMore"), [t, header, titleGroup]);

	const contents = useMemo(() => content.map((option) => {
		const title = Array.isArray(option) ? option[0] : option;
		return (
			<div
				key={`opt:${header}:${title}`}
				onClick={() => add(option)}
				className="option"
			>{title}</div>
		)
	}), [add, content, header]);

	const maybeExtended = useMemo(() => extended ? (
		<Fragment key={`opt-extra:${header}`}>
			<div
				className="toggleButton option"
				onClick={() => toggleTitleGroup(header)}
			>{tHideOrShow}</div>
			<div
				className={
					"toggleGroup " +
					(titleGroup[header]
						? "active"
						: "inactive")
				}
			>
				{extended.map((option) => {
					const title = Array.isArray(option) ? option[0] : option;
					return (
						<div
							key={`opt:${header}:${title}`}
							onClick={() => add(option)}
							className="option"
						>{title}</div>
					);
				})}
			</div>
		</Fragment>
	) : <></>, [add, extended, header, tHideOrShow, titleGroup, toggleTitleGroup]);

	return (
		<IonItem className="wrappableInnards">
			<div className="caseObjects">
				<div className="title">{header}</div>
				<div className="options">
					{contents}
					{maybeExtended}
				</div>
			</div>
		</IonItem>
	);
};

const translations = [
	"caseMakerInstructions", "declenjugatorTitle", "TitleSaved"
];

const commons =  [
	"MaybeDiscardThing", "Cancel", 
	"NothingToSave", "Save", "UnsavedInfo", "YesDiscard"
];


const CaseMaker: FC<CaseMakerModal> = (props) => {
	const [ t ] = useTranslator('dj');
	const [ tYouSure, tCancel, tNoSave, tSave, tUnsaved, tYes ] = useI18Memo(commons);
	const [ tInstructions, tTitle, tThingSaved ] = useI18Memo(translations, "dj");
	const caseObjects = useMemo(() => t("cases", { returnObjects: true }), [t]) as CaseObject[];

	const {
		isOpen,
		setIsOpen,
		openECM,
		setSavedTitle
	} = props;
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [titleParts, setTitleParts] = useState<caseBit[]>([]);
	const [titleGroup, setTitleGroup] = useState<{[key: string]: boolean}>({});
	const onLoad = useCallback(() => {
		setTitleParts([]);
		setTitleGroup({});
	}, []);
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setTitleParts([]);
		setTitleGroup({});
	}, [setIsOpen]);

	const toggleTitleGroup = useCallback((group: string) => {
		setTitleGroup({
			...titleGroup,
			[group]: !titleGroup[group]
		});
	}, [titleGroup]);
	const maybeSaveTitle = () => {
		if(titleParts.length === 0) {
			closeModal();
			return toaster({
				message: tNoSave,
				position: "middle",
				color: "warning",
				duration: 2000,
				toast
			});
		}
		setSavedTitle(titleParts.map(part => Array.isArray(part) ? part.join("") : part + " ").join("").trim());
		closeModal();
		toaster({
			message: tThingSaved,
			position: "middle",
			color: "success",
			duration: 2500,
			toast
		});
	};

	const maybeCancel = () => {
		if(titleParts.length > 0) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSure,
				cssClass: "warning",
				submit: tYes,
				handler: closeModal,
				doAlert
			});
		}
		closeModal();
	};

	const add = useCallback((what: caseBit) => {
		setTitleParts([...titleParts, what]);
	}, [titleParts]);

	const remove = useCallback((what: number) => {
		setTitleParts(titleParts.filter((str, i) => i !== what));
	}, [titleParts]);

	const allObjects = useMemo(() => caseObjects.map((group) => {
		return (
			<CaseItem
				key={`grouping:${group.header}`}
				caseObject={group}
				add={add}
				toggleTitleGroup={toggleTitleGroup}
				titleGroup={titleGroup}
			/>
		);
	}), [add, caseObjects, titleGroup, toggleTitleGroup]);
	const titleInParts = useMemo(() => titleParts.map((part: caseBit, i: number) => {
		const title = Array.isArray(part) ? part[0] : part;
		return <div onClick={() => remove(i)} key={`title-output:${title}:${i}`}>{title}</div>
	}), [remove, titleParts]);

	return (
		<IonModal isOpen={isOpen} backdropDismiss={false} onIonModalDidPresent={onLoad}>
			<ModalHeader title={tTitle} closeModal={maybeCancel} openECM={openECM} />
			<IonContent>
				<IonList lines="full" id="makingTitle" className="hasSpecialLabels">
					<IonItem>
						<IonLabel className="ion-text-wrap ion-text-center">{tInstructions}</IonLabel>
					</IonItem>
					<IonItemDivider sticky>
						<div id="titleOutput">
							{titleInParts}
						</div>
					</IonItemDivider>
					{allObjects}
				</IonList>
			</IonContent>
			<IonFooter className="modalBorderTop">
				<IonToolbar>
					<IonButton
						color="warning"
						slot="start"
						onClick={maybeCancel}
					>
						<IonIcon icon={closeCircleOutline} slot="end" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={maybeSaveTitle}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tSave}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default CaseMaker;
