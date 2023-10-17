<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
    <div class="daisy-navbar min-h-0 bg-neutral py-0.5 text-neutral-content">
        <div class="daisy-navbar-start"></div>
        <div class="daisy-navbar-center">
            <a class="daisy-btn daisy-btn-ghost text-xl normal-case">Chord Dictionary</a>
        </div>
        <div class="daisy-navbar-end">
            <a
                href="https://github.com/ashcolor/chord-dictionary"
                target="_blank"
                class="daisy-btn daisy-btn-circle daisy-btn-ghost"
            >
                <Icon icon="mdi:github" width="24"></Icon>
            </a>
            <a
                href="https://twitter.com/ashcolor06"
                target="_blank"
                class="daisy-btn daisy-btn-circle daisy-btn-ghost"
            >
                <Icon icon="mdi:twitter" width="24"></Icon>
            </a>
        </div>
    </div>
</template>
