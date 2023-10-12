<!-- <script>
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
</script> -->

<script>
	import { onMount } from 'svelte'
	import ChatMessage from './chat-message.svelte'

	let messages = []
	let inputMessage = ''
	let isWaitingForResponse = false

	const handleUserMessage = () => {
		const userMessage = {
			role: 'user',
			content: inputMessage,
		}

		if (inputMessage) {
			messages = messages.concat([userMessage])
			inputMessage = '' // Clear the input field
			isWaitingForResponse = true

			handleChatCompletion()
		}
	}

	const handleChatCompletion = async () => {
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

		// Add the server response to the messages array
		messages = messages.concat(response)
		isWaitingForResponse = false
	}
</script>

<div class="header"><h1>BertilChat</h1></div>

<div class="container">
	<div class="messages">
		{#if messages.length > 0}
			{#each messages as message}
				<ChatMessage role={message.role} message={message.content} />
			{/each}
		{/if}
		{#if isWaitingForResponse}
			<div class="loading-indicator" />
		{/if}
	</div>

	<form class="inputbox" on:submit={handleUserMessage}>
		<div>
			<input bind:value={inputMessage} type="text" name="search" id="search" />
			<button class="enter" type="submit">
				<kbd>Skicka</kbd>
			</button>
		</div>
	</form>
</div>

<style>
	.header {
		font-family: monospace;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-indicator {
		width: 16px;
		height: 16px;
		margin-top: 50px;
		background-color: #969696;
		border-radius: 50%;
		animation: loading 1s infinite;
	}

	@keyframes loading {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
		100% {
			opacity: 1;
		}
	}

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
		height: 65vh;
		overflow: scroll;
	}

	.inputbox {
		padding-bottom: 50px;
	}

	input[type='text'] {
		width: 560px;
		height: 40px;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px;
		font-size: 18px;
	}

	.enter {
		height: 60px;
		width: 100px;
		border-radius: 5px;
		background-color: rgb(242, 197, 120);
		border: none;
	}

	@media (max-width: 768px) {
		.container {
			padding: 10px; /* Add some padding for better spacing on small screens */
		}

		.messages {
			width: 90vw; /* Adjust the width for smaller screens */
		}

		.inputbox {
			padding: 10px; /* Add some padding for better spacing on small screens */
			width: 300px;
		}

		input[type='text'] {
			width: 100%; /* Make the input field full width on small screens */
		}
	}
</style>
