<template>
  <div id="app">
    <nav>
      <router-link to="/tasks"></router-link> <!-- Тестовая ссылка -->
    </nav>
    <router-view/> <!-- Должен быть ровно один -->
  </div>
</template>
<script setup lang="ts">
// Можно оставить пустым или добавить глобальную логику
</script>