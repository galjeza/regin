<script lang="ts">
  import { onMount } from 'svelte';

  interface Phone {
    phoneId: string;
    ip: string;
    lastSeen: number;
    status: 'online' | 'offline';
    successCount: number;
    failureCount: number;
  }

  let phones: Phone[] = [];
  let loading = true;
  let error: string | null = null;

  async function fetchPhones() {
    try {
      const response = await fetch('http://192.168.174.96:8080/phones');
      if (!response.ok) throw new Error('Failed to fetch phones');
      phones = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchPhones();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPhones, 30000);
    return () => clearInterval(interval);
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Phone Dashboard</h1>
  
  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each phones as phone}
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">{phone.phoneId}</h2>
            <span class={`px-2 py-1 rounded-full text-sm ${
              phone.status === 'online' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {phone.status}
            </span>
          </div>
          
          <div class="space-y-2">
            <p class="text-gray-600">
              <span class="font-medium">IP:</span> {phone.ip}
            </p>
            <p class="text-gray-600">
              <span class="font-medium">Last Seen:</span> {new Date(phone.lastSeen).toLocaleString()}
            </p>
            <div class="flex justify-between mt-4">
              <div class="text-center">
                <p class="text-sm text-gray-500">Success</p>
                <p class="text-lg font-semibold text-green-600">{phone.successCount}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-500">Failures</p>
                <p class="text-lg font-semibold text-red-600">{phone.failureCount}</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 