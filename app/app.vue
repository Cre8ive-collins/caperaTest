<template>
  <div class="min-h-screen bg-white text-gray-900">
    <header class="border-b border-gray-200">
      <nav class="mx-auto flex max-w-3xl gap-6 p-4">
        <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
        <NuxtLink to="/transactions" class="hover:underline">Transactions</NuxtLink>
      </nav>
    </header>

    <main class="mx-auto max-w-3xl p-6">
      <NuxtPage />
    </main>
  </div>
</template>
