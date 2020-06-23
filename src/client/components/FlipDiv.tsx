import React, {FC, useRef, ReactNode, useLayoutEffect} from 'react';

interface Props {
	position: {
		width: number,
		height: number,
		left: number,
		top: number,
	},
	className: string,
	duration?: number,
	children: ReactNode,
}

function updateStyle(position: Props['position'], element: HTMLDivElement | null) {
	if (element) {
		element.style.left = `${position.left}px`;
		element.style.top = `${position.top}px`;
		element.style.width = `${position.width}px`;
		element.style.height = `${position.height}px`;
	}
}

const FlipDiv: FC<Props> = ({
	position,
	className,
	children,
	duration = 500,
}): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		updateStyle({
			top: position.top + position.height / 2,
			left: position.left + position.width / 2,
			width: 0,
			height: 0,
		}, ref.current);
		// The other deps are used for an init-state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);
	useLayoutEffect(() => {
		if (ref.current) {
			// FLIP transition:
			// First: get the current bounds
			const first = ref.current.getBoundingClientRect();
			// execute the script that causes layout change
			updateStyle(position, ref.current);
			// Last: get the final bounds
			const last = ref.current.getBoundingClientRect();
			// Invert: determine the delta between the
			// first and last bounds to invert the element
			const deltaX = first.left - last.left;
			const deltaY = first.top - last.top;
			const deltaW = first.width / last.width;
			const deltaH = first.height / last.height;

			// Play: animate the final element from its first bounds
			// to its last bounds (which is no transform)
			ref.current.animate([{
				transformOrigin: 'top left',
				transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
			}, {
				transformOrigin: 'top left',
				transform: 'none',
			}], {
				duration,
				easing: 'ease-in-out',
				fill: 'both',
			});
		}

	}, [ref, position, duration]);
	return (
		<div className={className} ref={ref}>
			{children}
		</div>
	);
}

export default FlipDiv;
