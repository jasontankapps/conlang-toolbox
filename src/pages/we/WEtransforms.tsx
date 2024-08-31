import React, { useState, FC, useCallback, useMemo } from 'react';
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonMenuButton,
	IonButtons,
	IonFab,
	IonFabButton,
	IonTitle,
	IonIcon,
	IonList,
	IonItem,
	IonLabel,
	IonButton,
	IonReorderGroup,
	IonReorder,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	addOutline,
	helpCircleOutline,
	reorderTwo,
	trash,
	globeOutline,
	trashBinOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { PageData, StateObject, WETransformObject } from '../../store/types';
import { deleteTransformWE, rearrangeTransformsWE } from '../../store/weSlice';
import useTranslator from '../../store/translationHooks';

import ModalWrap from "../../components/ModalWrap";
import { $q } from '../../components/DollarSignExports';
import ltr from '../../components/LTR';
import ExtraCharactersModal from '../modals/ExtraCharacters';
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import reorganize from '../../components/reorganizer';
import useI18Memo from '../../components/useI18Memo';
import AddTransformModal from './modals/AddTransform';
import EditTransformModal from './modals/EditTransform';
import { TraCard } from "./WEinfo";

const makeArrow = (dir: string) => {
	if(dir === "double") {
		return ltr() ? "⟹" : "⟸";
	} else if (ltr()) {
		return "⟶";
	}
	return "⟵";
};

interface TransformProps {
	trans: WETransformObject
	editTransform: (x: WETransformObject) => void
	maybeDeleteTransform: (x: WETransformObject) => void
}

const TransformItem: FC<TransformProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const tDelete = useMemo(() => tc("Delete"), [tc]);

	const { trans, editTransform, maybeDeleteTransform } = props;
	const { id, seek, direction, replace, description } = trans;
	const changer = useCallback(() => editTransform(trans), [trans, editTransform]);
	const deleter = useCallback(() => maybeDeleteTransform(trans), [trans, maybeDeleteTransform]);
	const arrow = makeArrow(direction);
	const directionDescription = useMemo(() => {
		switch(direction) {
			case "both":
				return t("atInputUndoOutput");
			case "double":
				return t("atInputAtOutput");
			case "in":
				return t("atInput");
			case "out":
				return t("atOutput");
		}
		return "Error";
	}, [t, direction]);
	return (
		<IonItemSliding key={id}>
			<IonItemOptions>
				<IonItemOption
					color="primary"
					onClick={changer}
				>
					<IonIcon slot="icon-only" src="svg/edit.svg" />
				</IonItemOption>
				<IonItemOption
					color="danger"
					onClick={deleter}
					aria-label={tDelete}
				>
					<IonIcon slot="icon-only" icon={trash} />
				</IonItemOption>
			</IonItemOptions>
			<IonItem>
				<IonReorder className="dragHandle ion-margin-end">
					<IonIcon icon={reorderTwo} className="dragHandle" />
				</IonReorder>
				<IonLabel className="wrappableInnards">
					<div className="importantElement serifChars">
						<span
							className="seek importantUnit"
						>{seek}</span>
						<span
							className="arrow unimportantUnit"
						>{arrow}</span>
						<span
							className="replace importantUnit"
						>{replace || String.fromCharCode(160)}</span>
						<span
							className="unimportantUnit"
						>{directionDescription}</span>
					</div>
					<div className="description">{description}</div>
				</IonLabel>
				<IonIcon size="small" slot="end" src="svg/slide-indicator.svg" />
			</IonItem>
		</IonItemSliding>
	);
};

const commons = [
	"AddNew", "Delete", "ExtraChars", "Help",
	"DeleteEverythingQ", "deleteThisCannotUndo"
];

const WERew: FC<PageData> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const tTransformations = useMemo(() => tw("Transformations"), [tw]);
	const [ tAddNew, tDelete, tExChar, tHelp, tClearAll, tYouSure ] = useI18Memo(commons);
	
	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenAddTransform, setIsOpenAddTransform] = useState<boolean>(false);
	const [isOpenEditTransform, setIsOpenEditTransform] = useState<boolean>(false);
	const [ editing, setEditing ] = useState<WETransformObject | null>(null);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const { transforms } = useSelector((state: StateObject) => state.we);
	const editTransform = useCallback((transform: WETransformObject) => {
		const groups = $q<HTMLIonListElement>((".transforms"));
		groups && groups.closeSlidingItems();
		setEditing(transform);
		setIsOpenEditTransform(true);
	}, []);
	const maybeDeleteTransform = useCallback((trans: WETransformObject) => {
		const groups = $q<HTMLIonListElement>((".transforms"));
		groups && groups.closeSlidingItems();
		const handler = () => {
			dispatch(deleteTransformWE(trans.id));
			toaster({
				message: tw("transDeleted", { count: 1 }),
				duration: 2500,
				color: "danger",
				position: "top",
				toast
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			const { seek, direction, replace } = trans;
			yesNoAlert({
				header: `${seek} ${makeArrow(direction)} ${replace}`,
				message: tYouSure,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [dispatch, tc, tw, toast, doAlert, disableConfirms, tYouSure]);
	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		const reorganized = reorganize<WETransformObject>(transforms, ed.from, ed.to);
		dispatch(rearrangeTransformsWE(reorganized));
		ed.complete();
	}, [transforms, dispatch]);
	const maybeClearEverything = useCallback(() => {
		const count = transforms.length;
		const handler = () => {
			dispatch(deleteTransformWE(null));
			toaster({
				message: tw("transDeleted", { count: 1 }),
				duration: 2500,
				color: "danger",
				position: "top",
				toast
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tClearAll,
				message: tw("delAllTransforms", { count }),
				cssClass: "warning",
				submit: tc("confirmDel", { count }),
				handler,
				doAlert
			});
		}
	}, [tc, tw, dispatch, transforms.length, disableConfirms, doAlert, toast, tClearAll]);
	const transformItems = useMemo(() => transforms.map((input: WETransformObject) =>
		<TransformItem
			key={input.id}
			trans={input}
			editTransform={editTransform}
			maybeDeleteTransform={maybeDeleteTransform}
		/>
	), [editTransform, maybeDeleteTransform, transforms]);

	const doOpenEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const doHelp = useCallback(() => setIsOpenInfo(true), [setIsOpenInfo]);
	const doAddTr = useCallback(() => setIsOpenAddTransform(true), []);
	return (
		<IonPage>
			<AddTransformModal
				{...props.modalPropsMaker(isOpenAddTransform, setIsOpenAddTransform)}
				openECM={setIsOpenECM}
			/>
			<EditTransformModal
				{...props.modalPropsMaker(isOpenEditTransform, setIsOpenEditTransform)}
				openECM={setIsOpenECM}
				editing={editing}
				setEditing={setEditing}
			/>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<TraCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{tTransformations}</IonTitle>
					<IonButtons slot="end">
						{transforms.length > 0 ?
							<IonButton onClick={maybeClearEverything} aria-label={tDelete}>
								<IonIcon icon={trashBinOutline} />
							</IonButton>
						:
							<></>
						}
						<IonButton onClick={doOpenEx} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={doHelp} aria-label={tHelp}>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="hasFabButton">
				<IonList className="transforms units dragArea" lines="none">
					<IonReorderGroup
						disabled={false}
						className="hideWhileAdding"
						onIonItemReorder={doReorder}
					>
						{transformItems}
					</IonReorderGroup>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="tertiary"
						title={tAddNew}
						onClick={doAddTr}
					>
						<IonIcon icon={addOutline} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default WERew;
