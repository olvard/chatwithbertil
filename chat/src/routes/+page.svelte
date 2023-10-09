<script>
	import { onMount } from 'svelte'
	import ChatMessage from './chat-message.svelte'

	let messages = []
	let inputMessage = ''
	let isWaitingForResponse = false

	// onMount(async () => {
	//   await handleChatCompletion()
	// })

	const handleChatCompletion = async () => {
		const userMessage = {
			role: 'user',
			content: inputMessage,
		}

		// Generate a unique ID for the user message
		userMessage.id = Date.now() + Math.random().toString(36).substring(7)

		// Display user's message immediately
		messages = [...messages, userMessage]
		inputMessage = ''
		isWaitingForResponse = true

		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				isInitializing: messages.length === 1,
				priorMessages: messages,
				message: inputMessage,
			}),
		}).then((res) => res.json())

		// Generate unique IDs for the response messages
		response.forEach((message) => {
			message.id = Date.now() + Math.random().toString(36).substring(7)
		})

		// Display the response when it arrives
		messages = [...messages, ...response]
		isWaitingForResponse = false
		console.log(response)
		return response
	}
</script>

<div class="container">
	<div class="messages">
		{#if messages.length > 0}
			{#each messages as message (message.id)}
				{#if message.role === 'user'}
					<div class="user-bubble">
						<ChatMessage role={message.role} message={message.content} />
					</div>
				{:else}
					<div class="response-bubble">
						<ChatMessage role={message.role} message={message.content} />
					</div>
				{/if}
			{/each}
		{/if}
	</div>

	<form class="inputbox" on:submit={handleChatCompletion}>
		<div>
			<input bind:value={inputMessage} type="text" name="search" id="search" />
			<button type="submit" disabled={isWaitingForResponse}>
				<kbd>Enter</kbd>
			</button>
		</div>
	</form>
</div>

<style>
	.container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.messages {
		padding-bottom: 100px;
		font-family: monospace;
		font-size: 20px;
		width: 50vw;
	}

	/* Style user chat bubble to the right */
	.user-bubble {
		display: flex;
		justify-content: flex-end;
		width: 50%;
		background-color: #007aff; /* Set user bubble background color */
		color: white; /* Set text color */
		border-radius: 10px;
		padding: 10px;
	}

	/* Style response chat bubble to the left */
	.response-bubble {
		display: flex;
		justify-content: flex-start;
		width: 70%;
		background-color: #f0f0f0; /* Set response bubble background color */
		border-radius: 10px;
		padding: 10px;
	}

	/* Style chat bubbles */
	.user-bubble,
	.response-bubble {
		margin: 5px; /* Add margin for spacing between bubbles */
	}

	.inputbox {
		padding-bottom: 50px;
	}

	input[type='text'] {
		width: 600px;
		height: 40px;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px;
	}
</style>
