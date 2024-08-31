import React, { useState, FC, useCallback, useMemo, ReactElement } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonPage,
	IonButton,
	IonFab,
	IonFabButton,
	IonRange,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	useIonAlert,
	useIonToast,
	RangeCustomEvent
} from '@ionic/react';
import {
	addOutline,
	helpCircleOutline,
	trash,
	trashBinOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import {
	setCharacterGroupDropoff,
	deleteCharGroupWG,
	copyCharacterGroupsFromElsewhere
} from '../../store/wgSlice';
import {
	WGCharGroupObject,
	Zero_Fifty,
	PageData,
	StateObject
} from '../../store/types';
import useTranslator from '../../store/translationHooks';

import { $q } from '../../components/DollarSignExports';
import ModalWrap from "../../components/ModalWrap";
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import { CopyFromOtherIcon } from '../../components/icons';
import useI18Memo from '../../components/useI18Memo';
import Header from '../../components/Header';
import AddCharGroupModal from './modals/AddCharGroup';
import EditCharGroupModal from './modals/EditCharGroup';
import ExtraCharactersModal from '../modals/ExtraCharacters';
import { CharGroupCard } from "./WGinfo";

interface CharGroupProps {
	charGroup: WGCharGroupObject
	editCharGroup: (x: WGCharGroupObject) => void
	maybeDeleteCharGroup: (x: string, y: WGCharGroupObject) => void
	tDelete: string
}

const CharGroup: FC<CharGroupProps> = (props) => {
	const { charGroup, editCharGroup, maybeDeleteCharGroup, tDelete } = props;
	const { label = "", title, run } = charGroup;
	const editor = useCallback(() => editCharGroup(charGroup), [charGroup, editCharGroup]);
	const deleter = useCallback(() => maybeDeleteCharGroup(label, charGroup), [maybeDeleteCharGroup, label, charGroup]);
	return (
		<IonItemSliding>
			<IonItemOptions>
				<IonItemOption
					color="primary"
					onClick={editor}
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
				<IonLabel className="wrappableInnards">
					<div className="charGroupRun serifChars">
						<span
							className="label importantElement"
						>{label}</span>
						<span
							className="run"
						>{run}</span>
					</div>
					<div
						className="charGroupLongName"
					>{title}</div>
				</IonLabel>
				<IonIcon
					size="small"
					slot="end"
					src="svg/slide-indicator.svg"
				/>
			</IonItem>
		</IonItemSliding>
	);
};

const commons = [
	"AddNew", "Copy", "Delete", "Help",
	"deleteThisCannotUndo", "yesImport",
];

const translations = [ "dropoffRate", "characterDropoffExplanation" ];

const WGCharGroup: FC<PageData> = (props) => {
	const [ t ] = useTranslator('wg');
	const [ tw ] = useTranslator('wgwe');
	const [ tc ] = useTranslator('common');
	const [ tDropoffFormal, tDropExpl ] = useI18Memo(translations, "wg");
	const tCharGroups = useMemo(() => tw("CharGroups"), [tw]);
	const [ tAddNew, tCopy, tDelete, tHelp, tYouSure, tYes ] = useI18Memo(commons);

	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenAddCharGroup, setIsOpenAddCharGroup] = useState<boolean>(false);
	const [isOpenEditCharGroup, setIsOpenEditCharGroup] = useState<boolean>(false);
	const [editing, setEditing] = useState<WGCharGroupObject | null>(null);
	const { characterGroups, characterGroupDropoff } = useSelector((state: StateObject) => state.wg);
	const { characterGroups: weCharatcterGroups } = useSelector((state: StateObject) => state.we);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const editCharGroup = useCallback((charGroup: WGCharGroupObject) => {
		const groups = $q<HTMLIonListElement>(".charGroups");
		groups && groups.closeSlidingItems();
		setIsOpenEditCharGroup(true);
		setEditing(charGroup);
	}, []);
	const allGroups = useMemo(() => characterGroups.map(
		(charGroup: WGCharGroupObject) =>
			<CharGroup
				key={`WG-CharGroup-${charGroup.label}`}
				charGroup={charGroup}
				editCharGroup={editCharGroup}
				maybeDeleteCharGroup={(label: string, charGroup: WGCharGroupObject) => {
					const groups = $q<HTMLIonListElement>((".charGroups"));
					groups && groups.closeSlidingItems();
					const handler = () => {
						dispatch(deleteCharGroupWG(charGroup));
						toaster({
							message: tw("CharGroupDeleted"),
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
							header: `${label}=${charGroup.run}`,
							message: tYouSure,
							cssClass: "danger",
							submit: tc("confirmDel", { count: 1 }),
							handler,
							doAlert
						});
					}
				}}
				tDelete={tDelete}
			/>
		),
		[characterGroups, editCharGroup, tDelete, dispatch, tc, tw, toast, disableConfirms, doAlert, tYouSure]
	);
	const openHelp = useCallback(() => setIsOpenInfo(true), []);
	const openAddCG = useCallback(() => setIsOpenAddCharGroup(true), []);
	const setDropoff = useCallback(
		(e: RangeCustomEvent) => dispatch(setCharacterGroupDropoff(e.target.value as Zero_Fifty)),
		[dispatch]
	);
	const endButtons = useMemo(() => {
		const buttons: ReactElement[] = [];
		if(characterGroups.length > 0) {
			buttons.push(
				<IonButton
					aria-label={tDelete}
					key="wgCGbutton-1"
					onClick={() => {
						const count = characterGroups.length;
						const handler = () => {
							dispatch(deleteCharGroupWG(null));
							toaster({
								message: tw("charGroupsDeleted", { count }),
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
								header: tw("DeleteAll"),
								message: tw("delAllCharGroups", { count }),
								cssClass: "warning",
								submit: tc("confirmDel", { count }),
								handler,
								doAlert
							});
						}
					}}
				>
					<IonIcon icon={trashBinOutline} />
				</IonButton>
			)
		}
		if(weCharatcterGroups.length > 0) {
			buttons.push(
				<IonButton
					aria-label={tCopy}
					key="wgCGbutton-2"
					onClick={() => {
						const handler = () => {
							dispatch(copyCharacterGroupsFromElsewhere(weCharatcterGroups));
							toaster({
								message: tw("importCharGroups", { count: weCharatcterGroups.length }),
								duration: 2500,
								color: "success",
								position: "top",
								toast
							});
						};
						if(disableConfirms) {
							handler();
						} else {
							yesNoAlert({
								header: t("ImportFromWE"),
								message: tw("importOverwriteCG"),
								cssClass: "warning",
								submit: tYes,
								handler,
								doAlert
							});
						}
					}}
				>
					<CopyFromOtherIcon />
				</IonButton>
			);
		}
		return [
			...buttons,
			(
				<IonButton key="wgCGbutton-3" onClick={openHelp} aria-label={tHelp}>
					<IonIcon icon={helpCircleOutline} />
				</IonButton>
			)
		];
	}, [
		tDelete, characterGroups.length, disableConfirms, tc, t, toast, tw,
		tCopy, dispatch, tYes, doAlert, weCharatcterGroups, openHelp, tHelp
	]);
	return (
		<IonPage>
			<AddCharGroupModal
				{...props.modalPropsMaker(isOpenAddCharGroup, setIsOpenAddCharGroup)}
				openECM={setIsOpenECM}
			/>
			<EditCharGroupModal
				{...props.modalPropsMaker(isOpenEditCharGroup, setIsOpenEditCharGroup)}
				openECM={setIsOpenECM}
				editing={editing}
				setEditing={setEditing}
			/>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<CharGroupCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<Header
				title={tCharGroups}
				endButtons={endButtons}
			/>
			<IonContent fullscreen className="hasFabButton">
				<IonList className="charGroups units" lines="none">
					<IonItem className="nonUnit">
						<IonLabel className="wrappableInnards belongsToBelow">
							<div><strong>{tDropoffFormal}</strong></div>
							<div className="minor ion-text-wrap">{tDropExpl}</div>
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonRange
							min={0}
							max={50}
							value={characterGroupDropoff}
							pin={true}
							onIonChange={setDropoff}
						>
							<IonIcon size="small" slot="start" src="svg/flatAngle.svg" />
							<IonIcon size="small" slot="end" src="svg/steepAngle.svg" />
						</IonRange>
					</IonItem>
					{allGroups}
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						title={tAddNew}
						onClick={openAddCG}
					>
						<IonIcon icon={addOutline} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default WGCharGroup;
