<script lang="ts">
  let to = '';
  let msg = '';
  let loading = false;
  let error: string | null = null;
  let success = false;

  async function handleSubmit() {
    loading = true;
    error = null;
    success = false;

    try {
      const response = await fetch('http://192.168.1.12:8080/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, msg }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send SMS');
      }

      const data = await response.json();
      success = true;
      to = '';
      msg = '';
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 mb-8">
  <h2 class="text-2xl font-semibold mb-4">Send SMS</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="to" class="block text-sm font-medium text-gray-700">Phone Number</label>
      <input
        type="tel"
        id="to"
        bind:value={to}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter phone number"
      />
    </div>

    <div>
      <label for="msg" class="block text-sm font-medium text-gray-700">Message</label>
      <textarea
        id="msg"
        bind:value={msg}
        required
        rows="4"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your message"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if loading}
        <span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </span>
      {:else}
        Send SMS
      {/if}
    </button>
  </form>

  {#if error}
    <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      SMS sent successfully!
    </div>
  {/if}
</div> 