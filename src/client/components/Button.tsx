import React, { FC, ReactNode, useMemo, MouseEvent as ReactMouseEvent } from 'react';
import classes from './Button.module.css';
import classNames from 'classnames';
import SvgIcon from '@material-ui/core/SvgIcon';

const colorMap = {
	aqua: classes.colorAqua,
	red: classes.colorRed,
	normal: classes.colorNormal,
	green: classes.colorGreen,
}

export type ButtonColor = keyof typeof colorMap

interface Props {
	icon?: typeof SvgIcon;
	children?: ReactNode;
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	onClick?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
	color?: ButtonColor;
}

const Button: FC<Props> = ({
	icon: Icon,
	iconLeft,
	children,
	iconRight,
	onClick,
	color = 'aqua',
}): JSX.Element => {
	const hasIcon = !!Icon;
	const hasLeftIcon = !!iconLeft;
	const hasRightIcon = !!iconRight;
	const rootClassName = useMemo(() => classNames(classes.root, colorMap[color], {
		[classes.rootIcon]: hasIcon,
	}), [hasIcon, color]);
	const textClassName = useMemo(() => classNames(classes.text, {
		[classes.textMarginLeft]: !hasLeftIcon && !hasIcon,
		[classes.textMarginRight]: !hasRightIcon && !hasIcon,
	}), [hasLeftIcon, hasRightIcon, hasIcon]);
	return (
		<button className={rootClassName} onClick={onClick}>
			{iconLeft}
			<div className={textClassName}>
				{ children || (Icon && <Icon/>)}
			</div>
			{iconRight}
		</button>
	);
}

export default Button;
