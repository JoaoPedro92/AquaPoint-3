<template>
    <template v-if="isReadonly === true">
        <span v-for="n in 5" :key="n">
            <i :class="n <= rating ? 'bi bi-star-fill text-warning ms-1' : 'bi bi-star ms-1 text-warning'"></i>
        </span>
    </template>
    <template v-else>
        <span v-for="n in 5" :key="n">
            <i :class="n <= (starHovered || rating) ? 'bi bi-star-fill text-warning ms-1' : 'bi bi-star ms-1'" 
            v-on:mouseover="starHovered = n" 
            v-on:mouseleave="starHovered = 0"
            v-on:click="selectRatingNumber(n)"></i>
        </span>
    </template>
</template>

<script setup>
import { ref } from 'vue'

    defineProps({
        rating: {
            type: Number,
            default: 0
        },
        isReadonly: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['update:rating'])
    const starHovered = ref(0)

    function selectRatingNumber(number){
        emit('update:rating', number)
    }
</script>