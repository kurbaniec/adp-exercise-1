<script lang="ts">
	import { onMount } from 'svelte';

	type Cursor = {
		start: number,
		end: number,
	}

	let textarea: HTMLTextAreaElement;
	let lastValue = '';

	let insertText = '';

	let insertCursor: Cursor = { start: 0, end: 0 };
	let deleteCursor: Cursor = { start: 0, end: 0 };

	let insertTimeoutId: ReturnType<typeof setTimeout> | undefined;
	let deleteTimeoutId: ReturnType<typeof setTimeout> | undefined;

	const logInsertion = () => {
		console.log(`Text inserted at position: ${insertCursor.start}, Text: '${insertText}'`);
		insertTimeoutId = undefined;
		insertText = '';
	};

	const logDeletion = () => {
		console.log(`Text deleted, ${deleteCursor.start} - ${deleteCursor.end}`);
		deleteTimeoutId = undefined;
	};

	const handleInput = () => {
		// clearTimeout(timeoutId);
		const currentValue = textarea.value;
		const currentCursorPos = textarea.selectionStart;

		// console.log('hello', insertTimeoutId, currentCursorPos);

		if (currentValue.length > lastValue.length) { // Insertion detected
			const insertedText = currentValue.substring(currentCursorPos - 1, currentCursorPos);
			insertText += insertedText;

			if (insertTimeoutId === undefined) {
				insertCursor.start = currentCursorPos-1;
				insertTimeoutId = setTimeout(() => logInsertion(), 1800);
			} else {
				insertCursor.end = currentCursorPos;
			}

		} else if (currentValue.length < lastValue.length) { // Deletion detected
			if (deleteTimeoutId === undefined) {
				deleteCursor.start = currentCursorPos;
				deleteCursor.end = currentCursorPos;
				deleteTimeoutId = setTimeout(() => logDeletion(), 1800);
			} else {
				deleteCursor.start = currentCursorPos;
			}
		}

		lastValue = currentValue;
	};

	// const handleKeyDown = (event: KeyboardEvent) => {
	// 	if (event.key === 'Backspace' || event.key === 'Delete') {
	// 		insertStartCursorPos = textarea.selectionStart;
	// 		lastValue = textarea.value; // Update lastValue in case of immediate deletion
	// 	} else {
	// 		// For other keys, capture the start position before the change
	// 		insertStartCursorPos = textarea.selectionStart;
	// 	}
	// };

	onMount(() => {
		textarea.value = '';
		textarea.addEventListener('input', handleInput);
		// textarea.addEventListener('keydown', handleKeyDown);
	});
</script>

<textarea bind:this={textarea}></textarea>
