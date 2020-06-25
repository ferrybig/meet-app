export default function composeEffectHandlers(...handlers: (() => void)[]): () => void;
export default function composeEffectHandlers(...handlers: ((() => void) | null)[]): (() => void) | null;
export default function composeEffectHandlers(...handlers: ((() => void) | null)[]): (() => void) | null {
	if (handlers.length === 0) {
		return null;
	}
	return () => {
		for (const handler of handlers) {
			if (handler) {
				handler();
			}
		}
	};
}
