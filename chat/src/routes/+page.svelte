<script lang="ts">
	import { onMount } from 'svelte'

	import ChatMessage from './chat-message.svelte'

	let messages = []
	let inputMessage = ''

	onMount(async () => {
		await handleChatCompletion()
	})

	const handleChatCompletion = async () => {
		const userMessage = {
			role: 'user',
			content: inputMessage,
		}

		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				isInitializing: messages.length === 0,
				priorMessages: messages,
				message: inputMessage,
			}),
		}).then((res) => res.json())

		if (inputMessage) {
			messages = messages.concat([userMessage])
		}

		messages = messages.concat(response)
		inputMessage = ''

		return response
	}
</script>

<ul>
	{#if messages.length > 0}
		{#each messages as message}
			<ChatMessage role={message.role} message={message.content} />
		{/each}
	{/if}
</ul>

<form>
	<div>
		<input bind:value={inputMessage} type="text" name="search" id="search" />
		<button on:click={handleChatCompletion} type="submit">
			<kbd>Enter</kbd>
		</button>
	</div>
</form>
