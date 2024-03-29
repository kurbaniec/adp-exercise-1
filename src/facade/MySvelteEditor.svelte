<script lang="ts">
	import { writable } from 'svelte/store';
	import { executeCommand, undo, redo } from '$lib/MyEditor/Invoker';
	import {
		FormattingMarkerCommand,
		FormattingSpecialCommand,
		HeaderCommand, LinkCommand,
		ListCommand,
		TextChangedCommand
	} from '$lib/MyEditor/Commands';
	import { type EditorContent, type EditorCursor, TextEditor } from '$lib/MyEditor/Editor';
	import type { Writable } from 'svelte/store';
	import { marked } from 'marked';
	import { TaskScheduler } from '$lib/MySvelteEditor/TaskScheduler';
	import { onMount } from 'svelte';
	import { FormattingMarkers, FormattingSpecial } from '$lib/MyEditor/Constants';

	//region Store textarea & its lifecycle management
	let textArea: HTMLTextAreaElement
	const selectionStart: Writable<number> = writable(0);
	const selectionEnd: Writable<number> = writable(0);

	function updateSelection() {
		$selectionStart = textArea.selectionStart;
		$selectionEnd = textArea.selectionEnd;
	}

	onMount(() => {
		textArea.addEventListener('input', updateSelection);
		textArea.addEventListener('click', updateSelection);
		textArea.addEventListener('keyup', updateSelection);
	});
	//endregion

	//region Create editor
	const text: Writable<string> = writable(''); // Current text
	const textContent = new class implements EditorContent {
		get(): string { return $text; }
		set(content: string): void { $text = content; }
	};
	const cursor = new class implements EditorCursor {
		selectionStart(): number { return $selectionStart }
		selectionEnd(): number { return $selectionEnd }
	}
	const editor = new TextEditor(textContent, cursor);
	//endregion

	//region Parse markdown as a feature
	let htmlContent = '';
	$: htmlContent = marked($text) as string;
	//endregion

	//region Events
	const textChangedScheduler = new TaskScheduler(
		() => executeCommand(new TextChangedCommand(), editor),
		1600
	)

	function onInput(event: Event & { currentTarget: EventTarget & HTMLTextAreaElement; }) {
		textChangedScheduler.scheduleTask();
	}

	function header(depth: number) {
		executeCommand(new HeaderCommand(depth), editor)
	}

	function formattingMarker(marker: string) {
		executeCommand(new FormattingMarkerCommand(marker), editor)
	}

	function list(ordered: boolean) {
		executeCommand(new ListCommand(ordered), editor)
	}

	function formattingSpecial(special: string) {
		executeCommand(new FormattingSpecialCommand(special), editor)
	}

	let linkUrlInput: HTMLInputElement
	let linkValueInput: HTMLInputElement
	onMount(() => {
		linkUrlInput.value = "";
		linkValueInput.value = "";
	});
	function link() {
		const url = linkUrlInput.value
		const value = linkValueInput.value
		executeCommand(new LinkCommand(url, value), editor)
	}

	//endregion
</script>

<style>
    header {
        display: flex;
        flex-wrap: wrap; /* Enable wrapping */
        justify-content: flex-start;
        background-color: #f5f5f5;
        padding: 10px;
        border-bottom: 2px solid #e1e1e1;
    }

    button, input {
        background-color: #fff;
        border: 1px solid #ddd;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 5px;
        font-size: 14px; /* Smaller text size */
    }

    button:hover, input:hover {
        background-color: #e1e1e1;
    }

    .spacer {
        display: inline-block;
        width: 20px; /* Adjust the width as needed for spacing */
    }

    .editor-container {
        display: flex;
        height: 90vh; /* Adjust based on header height */
    }

    .markdown-input, .preview {
        flex: 1;
        padding: 10px;
        border: none;
        outline: none;
    }

    .markdown-input {
        border-right: 1px solid #e1e1e1;
    }

    @media (max-width: 600px) {
        .editor-container {
            flex-direction: column;
        }

        .markdown-input {
            border-right: none;
            border-bottom: 1px solid #e1e1e1;
        }
    }
</style>

<header>
	<button on:click="{() => undo(editor)}">Undo</button>
	<button on:click="{() => redo(editor)}">Redo</button>
	<div class="spacer"></div>
	{#each Array.from({ length: 4}, (_, i) => i + 1) as number}
		<button on:click="{() => header(number)}">H{number}</button>
	{/each}
	<button on:click={() => formattingMarker(FormattingMarkers.Bold)}><strong>B</strong></button>
	<button on:click={() => formattingMarker(FormattingMarkers.Italic)}><em>I</em></button>
	<button on:click={() => formattingMarker(FormattingMarkers.Code)}>Code</button>
	<button on:click="{() => list(false)}">Itemize</button>
	<button on:click="{() => list(true)}">Enumerate</button>
	<button on:click="{() => formattingSpecial(FormattingSpecial.Rule)}">Rule</button>
	<button on:click="{() => formattingSpecial(FormattingSpecial.Quote)}">Quote</button>
	<input style="width: 125px;" bind:this={linkUrlInput} placeholder="https://link-url-here.org">
	<input style="width: 85px;" bind:this={linkValueInput} placeholder="link-value">
	<button on:click={() => link()}>Link</button>
</header>

<div class="editor-container">
	<textarea
		class="markdown-input"
		bind:this={textArea}
		bind:value={$text}
		on:input="{(event) => onInput(event)}"
		placeholder="Write your markdown here..."
	/>
	<div class="preview">{@html htmlContent}</div>
</div>
