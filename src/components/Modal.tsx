import React, { PropsWithChildren, FC, ReactElement, useContext } from 'react';
import {
	IonIcon,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonFooter
} from '@ionic/react';
import {
	addOutline,
	arrowUpCircleOutline,
	checkmarkDoneCircleOutline,
	chevronDownCircleOutline,
	closeOutline,
	downloadOutline,
	globeOutline,
	saveOutline,
	trashOutline
} from 'ionicons/icons';
import i18n from "../i18n";
import useI18Memo from './useI18Memo';
import { ExCharContext } from './contexts';

type IonModalProps = Parameters<typeof IonModal>[0];
type IonContentProps = Parameters<typeof IonContent>[0];
type IonFooterProps = Parameters<typeof IonFooter>[0];
type IonToolbarProps = Parameters<typeof IonToolbar>[0];

type ButtonType = "save" | "load" | "export" | "delete" | "add" | "cancel" | "add+close" | "done" | "import";
interface ButtonBase {
	action?: () => void
	color?: string
}
interface TopButtonInfo extends Omit<ButtonBase, "color"> {
	icon: ButtonType | string
}
interface ButtonInfo1 extends ButtonBase {
	button: ButtonType
	icon?: ButtonType | string
	key?: never
	isText?: never
}
interface ButtonInfo2 extends ButtonBase {
	key: string
	isText?: boolean
	icon: ButtonType | string
	button?: never
}
type ButtonInfo = ButtonInfo1 | ButtonInfo2; // { key, icon, isText?, action? } || { button, icon?, action? }

type TopButtons = "close" | "extra";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
 	Pick<T, Exclude<keyof T, Keys>> 
	& {
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
	}[Keys]

interface BaseProps extends IonModalProps {
	isOpen: boolean
	closeFunc: () => void
	title: string
	enclosed?: boolean | (() => void)
	topEnd?: (TopButtons | TopButtonInfo)[] // If TopButtons omitted, becomes ["extra", ..., "close"]
	bottomStart?: ButtonInfo[]
	bottomEnd?: ButtonInfo[]
	extraChars?: boolean
	contentClass?: string
	contentProps?: IonContentProps
	footerToolbarClass?: string
	footerToolbarProps?: IonToolbarProps
	footerClass?: string
	footerProps?: IonFooterProps
}

type ModalProps = RequireAtLeastOne<BaseProps, "bottomStart" | "bottomEnd">;

const translations = ["Close", "ExtraChars"];

const getIcon = (input: ButtonType | string) => {
	switch(input) {
		case "save":
			return saveOutline;
		case "add":
		case "add+close":
			return addOutline;
		case "load":
			return chevronDownCircleOutline;
		case "export":
			return downloadOutline;
		case "import":
			return arrowUpCircleOutline;
		case "delete":
			return trashOutline;
		case "cancel":
			return closeOutline;
		case "done":
			return checkmarkDoneCircleOutline;
	}
	return input;
};

const getColor = (input: ButtonType | string) => {
	switch(input) {
		case "save":
		case "export":
		case "add":
		case "add+close":
		case "done":
			return "success";
		case "cancel":
		case "load":
		case "import":
			return "warning";
		case "delete":
			return "danger";
	}
	return input;
};

const getKey = (input: ButtonType | string) => {
	switch(input) {
		case "save":
			return "Save";
		case "add":
			return "Add";
		case "add+close":
			return "AddAndClose";
		case "load":
			return "Load";
		case "export":
			return "Export";
		case "import":
			return "Import";
		case "delete":
			return "Delete";
		case "cancel":
			return "Cancel";
		case "done":
			return "Done";
	}
	return input;
};

const BottomButtons: FC<{input?: ButtonInfo[], title: string, cancel: () => void, slot: "start" | "end"}> = (props) => {
	const { input, title, cancel, slot } = props;
	if(!input || input.length === 0) {
		return <></>;
	}
	return (
		<IonButtons slot={slot}>
			{
				input.map((buttoninfo, i) => {
					// { key, icon, isText?, action? } || { button, icon?, action? }
					const { key, icon, action, button, color, isText } = buttoninfo;
					const obj = {
						button: "",
						icon: "",
						color: ""
					};
					if(key !== undefined) {
						// key
						obj.button = isText ? key : i18n.t(key);
						obj.icon = getIcon(icon);
						obj.color = getColor(color || icon);
					} else {
						// button
						obj.button = i18n.t(getKey(button));
						obj.icon = getIcon(icon || button);
						obj.color = getColor(color || icon || button);
					}
					return (
						<IonButton onClick={action || cancel} color={obj.color} key={`modal-button-${i}-${title}-${obj.button}-${obj.icon}-${obj.color}`}>
							{obj.button}
							<IonIcon icon={obj.icon} slot="end" />
						</IonButton>
					);
				})
			}			
		</IonButtons>
	);
};

const TopButtons: FC<{input?: (TopButtons | TopButtonInfo)[], title: string, close: () => void, extra?: boolean}> = (props) => {
	const openEx = useContext(ExCharContext);
	const [tClose, tExChar] = useI18Memo(translations);
	const { input, title, close, extra } = props;
	const closebutton = (
		<IonButton onClick={close} key="closebutton-modal" aria-label={tClose}>
			<IonIcon icon={closeOutline} />
		</IonButton>
	);
	const extrabutton = (
		<IonButton onClick={openEx} key="extrabutton-modal" aria-label={tExChar}>
			<IonIcon icon={globeOutline} />
		</IonButton>
	);
	const output:ReactElement[] = [];
	let flagC = false, flagE = false;
	(input || []).forEach((button, i) => {
		if(button === "close") {
			output.push(closebutton);
			flagC = true;
		} else if (button === "extra") {
			extra && output.push(extrabutton);
			flagE = true;
		} else {
			// { key, icon, action? } || { button, icon?, action? }
			const { icon, action } = button;
			output.push(
				<IonButton onClick={action} key={`modal-button-top-${i}-${title}-${icon}`}>
					<IonIcon icon={getIcon(icon)} slot="icon-only" />
				</IonButton>
			);
		}
	});
	if(!flagC) {
		output.push(closebutton);
	}
	if(extra && !flagE) {
		output.unshift(extrabutton);
	}
	return (
		<IonButtons slot="end">
			{output}
		</IonButtons>
	);
};

const Modal: FC<PropsWithChildren<ModalProps>> = (props) => {
	const {
		isOpen,
		closeFunc,
		title,
		enclosed,
		topEnd,
		bottomStart,
		bottomEnd,
		children,
		extraChars,
		contentClass,
		contentProps,
		footerToolbarClass,
		footerToolbarProps,
		footerClass,
		footerProps,
		...rest
	} = props;
	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={enclosed === true ? undefined : (enclosed || closeFunc)}
			backdropDismiss={!enclosed}
			{...rest}
		>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{title}</IonTitle>
					<TopButtons input={topEnd} title={title} close={closeFunc} extra={extraChars} />
				</IonToolbar>
			</IonHeader>
			<IonContent className={contentClass} {...contentProps}>
				{children}
			</IonContent>
			<IonFooter className={footerClass} {...footerProps}>
				<IonToolbar className={footerToolbarClass} {...footerToolbarProps}>
					<BottomButtons slot="start" input={bottomStart} title={title} cancel={closeFunc} />
					<BottomButtons slot="end" input={bottomEnd} title={title} cancel={closeFunc} />
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default Modal;
