type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
	timeout: number;
};
type RequestIdleCallbackDeadline = {
	readonly didTimeout: boolean;
	timeRemaining: (() => number);
};

declare global {
	interface Window {
		requestIdleCallback?: ((
			callback: ((deadline: RequestIdleCallbackDeadline) => void),
			opts?: RequestIdleCallbackOptions,
		) => RequestIdleCallbackHandle);
		cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
	}
}

export default function requestIdleCallback(task: () => void): () => void {
	if (window.requestIdleCallback) {
		const handle = window.requestIdleCallback(task);
		return () => window.cancelIdleCallback(handle);
	} else if (window.requestAnimationFrame) {
		const handle = window.requestAnimationFrame(task);
		return () => window.cancelAnimationFrame(handle);
	} else {
		const handle = window.setTimeout(task, 100);
		return () => window.clearTimeout(handle);
	}
}
