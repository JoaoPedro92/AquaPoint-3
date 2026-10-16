<template>
    <div v-if="visible" class="modal-overlay" @click="ChangeVisibility(!visible)">
        <div class="modal-box col-lg-6" @click.stop>
            <button class="btn-close" @click="ChangeVisibility(!visible)"></button>
            <section class="main-container container-spacer">
                    <h1 class="main-titles">{{props.title}}</h1>
                    <div class="spacer"></div>

                    <div class="12 pe-3 mb-3" v-for="aquapoint in favoritePointsList" :key="aquapoint.id">
                        <FavoriteAquapointCard :aquapoint="aquapoint" @favoriteChanged="LoadAllUserFavoritePoints"/>
                    </div>
            </section>    
        </div>
    </div>
</template>

<script setup>
    import FavoriteAquapointCard from './FavoriteAquapointCard.vue';
    import { useAuth } from '../utilities/useAuth';
    import { useModalStore } from '../utilities/modal';
    import { aquapointService } from '../services/aquapointService';

    const props = defineProps({
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'BEBEDOUROS FAVORITOS'
        },
        favoritePointsList: {
            type: Array,
            default: []
        }
    })

    const Auth = useAuth()
    const useModal = useModalStore()
    const emit = defineEmits(['update:visible', 'pointUpdated'])

    function ChangeVisibility(value) {
        emit('update:visible', value)        
    }

    async function LoadAllUserFavoritePoints(){
        emit('pointUpdated')
        useModal.triggerRemovedFavorite()
        
    }
</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    .modal-box {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-height: 95%;
        width: 24%;
        min-width:400px;
        position: relative;
        overflow-y: auto;
    }

    .btn-close {
        position: absolute;
        top: 5px;
        right: 5px;
    }
</style>