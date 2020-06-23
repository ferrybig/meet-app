import {useState, useLayoutEffect, RefCallback} from "react";
import onEvent from "../../common/utils/onEvent";

export default function useSizeCapture(): [RefCallback<HTMLElement>, number, number] {
	const [{width, height}, setSize] = useState({ width: 0, height: 0 });
	const [ref, setRef] = useState<HTMLElement | null>(null);
	useLayoutEffect(() => {
		if (ref) {
			const updateSize = () => {
				setSize({
					width: ref.offsetWidth,
					height: ref.offsetHeight,
				});
			}
			updateSize();
			return onEvent(window, {
				resize: updateSize,
			});
		}
	}, [ref])
	return [setRef, width, height];
}