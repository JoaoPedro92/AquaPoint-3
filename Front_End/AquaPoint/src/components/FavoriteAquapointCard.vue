<template>
    <div>
    <div class="featured-product-card" @click="showPointDetailsModal = true">
        <div class="featured-product-image">
            <img :src="aquapoint.image" alt="Imagem do bebedouro favorito"/>
        </div>
        <div class="featured-product-details">
            <h5 class="fw-bold mb-1">{{ aquapoint.point_name }}</h5>
            <p class="mb-2">
                <span class="text-dark fw-medium">{{ aquapoint.zone_name }}</span>
                <span class="text-muted">, {{ aquapoint.local_name }}</span>
            </p>

            <!-- Rating -->
             <p class="mt-4 mb-1" title="Classificação geral">
                <StarsRating :rating="Number(aquapoint.ratingAVG)" :is-readonly="true" /><span class="ms-2">{{ aquapoint.ratingAVG }}</span>
            </p>

            <span class="badge rounded-2 text-nowrap mb-4" :style="GetPointStateStyles(aquapoint)" title="Estado do bebedouro">
                <i :class="GetPointStateIcon(aquapoint.state_name)"></i>
                {{ aquapoint.state_name }}
            </span>
            
            <div class="d-flex justify-content-between align-items-center">
                <a class="btn btn-primary flex-grow-1 btn-sm me-4" @click="showPointDetailsModal = true">Ver detalhes</a>

                <i class="bi bi-heart-fill text-danger" style="cursor: pointer; font-size: 20px;" @click.stop data-bs-toggle="modal" :data-bs-target="`#deleteFavoriteModal-${aquapoint.id}`" title="Remover favorito"></i>         
            </div>
        </div>
    </div>

    <!-- Delete Aquapoints Favorite Confirmation Modal -->
    <div class="modal fade" :id="`deleteFavoriteModal-${aquapoint.id}`" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Eliminar Favorito</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Tem a certeza que pretende tirar como favorito o bebedouro <strong>"{{ aquapoint?.point_name }}"</strong>?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="RemoveFavoritePoint">Sim</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Não</button>
            </div>
            </div>
        </div>
    </div>

    <AquapointDetailsModal v-model:visible="showPointDetailsModal" :title="'DETALHES DO BEBEDOURO'" :aquapoint="aquapoint" :view-only="true" />
</div>
</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import { GetPointStateIcon, GetPointStateStyles } from '../utilities/tools';
    import { favoritesService } from '../services/favoritesService';
    import StarsRating from './StarsRating.vue';
    import AquapointDetailsModal from '../components/EditAquaPointsModal.vue'
    import { useToast } from 'vue-toastification';
    import { useAuth } from '../utilities/useAuth';

    const props = defineProps({
        aquapoint: {
            type: Object,
            default: () => null
        }
    })

    const emit = defineEmits(['favoriteChanged'])

    const Auth = useAuth()
    const toast = useToast()
    const showPointDetailsModal = ref(false)

    async function RemoveFavoritePoint(){
        try{
            await favoritesService.deleteByUserAndPointId({user_id: Auth.user.id, point_id: props.aquapoint.id})
            emit('favoriteChanged')
            toast.success('Favorito apagado com sucesso')
        }
        catch(err){
            toast.error(`Erro ao apagar bebedouro favorito ${err.message}`)
        }
    }
</script>

<style scoped>
.featured-product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
     
 }
 .featured-product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

 .featured-product-image {
     height: 200px;
     background-color: #f1f1f1;
     overflow: hidden;
 }

 .featured-product-image img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     object-position: center;
 }

 .featured-product-details {
     padding: 20px;
 }
</style>