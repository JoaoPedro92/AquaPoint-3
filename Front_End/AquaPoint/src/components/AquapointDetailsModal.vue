<template>
    <div v-if="visible" class="modal-overlay" @click="ChangeVisibility()">
        <div class="modal-box" @click.stop>
            <button class="btn-close" @click="ChangeVisibility()"></button>

            <!-- Aquapoint image and infos -->
            <div class="text-center">
                <img :src="aquapoint.image" height="300" width="370" alt="Imagem do bebedouro" class="point-image">
            </div>
            <br><br>

            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <h4>{{ aquapoint.point_name }}</h4>
                    <i v-if="aquapoint.state_name == 'Inativo'" class="bi bi-exclamation-octagon-fill text-danger mb-1"
                        title="Estado Inativo"></i>
                    <i v-if="aquapoint.state_name == 'Necessita manutenção'"
                        class="bi bi-exclamation-octagon-fill text-warning mb-1"
                        title="Estado Necessita manutenção"></i>
                    <!-- Favorite Button -->
                    <i :class="isFavorite ? 'bi bi-heart-fill text-danger' : 'bi bi-heart text-danger'"
                        v-on:click="ChangeFavoriteState()" class="mb-1 ms-2"
                        style="font-size: 20px; cursor: pointer"></i>


                </div>
                <!-- Google Maps Directions and Report Flag -->
                <div class="d-flex align-items-center gap-2 mb-2">
                    <a v-if="aquapoint?.latitude && aquapoint?.longitude" :href="GetAquapointGoogleMapsDirections(aquapoint.latitude, aquapoint.longitude)"
                        target="_blank">
                        <i class="bi bi-geo-alt-fill ms-2"
                            style="font-size: 20px; cursor: pointer; color: var(--aquapoint-marker-blue);"></i>
                    </a>
                    <div class="hex-bg">
                        <i class="bi bi-flag-fill text-white" style="font-size: 0.7rem" title="Reportar"
                            v-on:click="ReportProblem"></i>
                    </div>
                </div>
                <!------------------->
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi bi-star-fill text-warning"></i>
                    <span class="ms-1">{{ aquapoint.ratingAVG || 0.0 }}</span> <span class="ms-1"
                        style="font-size:0.8rem"> - {{ aquapoint.ratingsAmount || 0.0 }} opiniões</span>
                </div>
                <span>{{ GetPointDistance(aquapoint.latitude, aquapoint.longitude) }}</span>
            </div>
            <!----------------------------------------->

            <!-- Nivel de Credibilidade -->
            <div class="mt-3">
                <span style="font-size: 0.8rem">Nivel de Credibilidade: <strong>({{ aquapoint.trust_name
                }})</strong></span>
                <div class="d-flex">
                    <div class="progress" style="height: 12px; width: 30%; cursor:pointer;"
                        title="Clicar para votar na credibilidade" v-on:click="ShowVoteTrustLevel">
                        <div class="progress-bar" :class="{
                            'bg-orange': aquapoint?.point_trust === 2,
                            'bg-warning': aquapoint?.point_trust === 3,
                            'bg-success': aquapoint?.point_trust === 4
                        }" style="width: 100%;">
                        </div>
                    </div>

                    <div v-if="showTrustLevelVote" class="vote-trustLevelBox">
                        <div class="d-flex gap-2 ms-2">
                            <button class="btn btn-sm btn-success btn-trustLevelVote" v-on:click="VoteTrustLevel(true)">
                                <i class="bi bi-hand-thumbs-up-fill me-1"></i>Existe</button>
                            <button class="btn btn-sm btn-danger btn-trustLevelVote" v-on:click="VoteTrustLevel(false)">
                                <i class="bi bi-hand-thumbs-down-fill me-1"></i>Não Existe</button>

                        </div>
                    </div>
                </div>
                <small v-if="!showTrustLevelVote" class="text-muted" style="font-size: 11px;">
                    <i class="bi bi-cursor-fill me-1"></i>Clica para votar
                </small>
            </div>
            <!----------------------------->


            <!-- Opinião dos Utilizadores -->
            <h5 class="mt-4">Opinião dos Utilizadores</h5>

            <template v-if="reviews.length === 0">
                <p class="text-muted">Ainda não há opiniões para este aquapoint.</p>
            </template>
            <template v-else>
                <div style="max-height: 400px; overflow-y: auto;">
                    <div v-for="review in reviews" :key="review.id">
                        <div class="user-review-card position-relative" @mouseover="reviewHover = review.id" @mouseleave="editMode = null">
                             <!-- Header -->
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <div class="d-flex align-items-center gap-2">
                                    <img :src="review.profilePicture || '/src/assets/images/user_image.png'" 
                                        width="28" height="28"
                                        style="border-radius: 50%; object-fit: cover;">
                                    <span style="font-size: 14px; font-weight: 00;">{{ review.name }}</span>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                                    <span style="font-size: 12px; color: gray;">{{ formatDate(review.createdAt) }}</span>

                                    <!-- Confirm/Cancel buttons -->
                                    <div v-if="editMode && edittingReviewId === review.id" class="d-flex gap-1">
                                        <button class="btn btn-sm btn-success d-flex align-items-center justify-content-center" @click="ApplyCommentChanges(review)"
                                            style="width: 28px; height: 28px; padding: 0; border-radius: 50%;">
                                            <i class="bi bi-check-lg" style="font-size: 14px;"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" @click="CancelEdit"
                                            style="width: 28px; height: 28px; padding: 0; border-radius: 50%;">
                                            <i class="bi bi-x" style="font-size: 14px;"></i>
                                        </button>
                                    </div>

                                    <!-- 3 points vertical, options -->
                                    <div v-if="(Auth.isAdmin || review.user_id == Auth.user?.id) && reviewHover === review.id && edittingReviewId !== review.id" style="position: relative;">                                        
                                        <div>
                                            <i class="bi bi-three-dots-vertical" style="cursor: pointer;" @click.stop="toggleReviewDropdown(review.id)"></i>
                                            <div v-if="openReviewDropdown === review.id" class="review-dropdown">
                                                <div @click.prevent="EditReview(review)" style="cursor: pointer; padding: 8px 12px; font-size: 14px;">
                                                    <i class="bi bi-pencil me-2"></i>Editar
                                                </div>
                                                <div class="text-danger" @click.prevent="DeleteReview(review.id)" style="cursor: pointer; padding: 8px 12px; font-size: 14px;">
                                                    <i class="bi bi-trash me-2"></i>Apagar
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Stars Rating -->
                            <span :title="review.rating + ' estrelas'">
                                <StarsRating v-model:rating="review.rating" :isReadonly="editMode && review.id === edittingReviewId ? false : true"></StarsRating>
                            </span>
                            
                            <div v-if="editMode && review.id === edittingReviewId">
                                <input v-model="edittingComment" class="form-control form-control-sm" style="border-radius: 8px; font-size: 14px;" >
                            </div>
                            <div v-else>
                                <p class="mb-0">{{ review.comment }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <!------------------------------------->

            <!-- Nova avaliação do bebedouro -->
            <h5 class="mt-5 mb-0">AVALIA ESTE BEBEDOURO</h5>
            <p class="mb-1" style="font-size: 0.9rem; color:gray;">Partilha a tua experiência</p>

            <StarsRating v-model:rating="newReviewNumber"></StarsRating>

            <br>

            <textarea v-model="reviewText" class="form-control mt-3" placeholder="Escreve um comentário" id="exampleFormControlTextarea1" rows="4"></textarea>
            <button class="btn btn-primary mt-3" style="width:100%; background-color: var(--aquapoint-logo-blue); border: none;"
                v-on:click="SubmitReview">SUBMETER</button>
            <!---------------------------------->
            
            <ReportProblemModal v-model:visible="showReportProblemModal" :aquapoint="aquapoint?.id" />

        </div>
    </div>


</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { aquapointService } from '../services/aquapointService';
import { useModalStore } from '../utilities/modal';
import { favoriteService } from '../services/favoriteService';
import { reviewsService } from '../services/reviewsService';
import { trustLogsService } from '../services/trustLogsService';
import { useAuth } from '../utilities/useAuth';
import { useToast } from 'vue-toastification';
import StarsRating from '../components/StarsRating.vue'
import ReportProblemModal from '../components/ReportProblemModal.vue'
import { imageUrlToBase64, GetAquapointGoogleMapsDirections, formatDate } from '../utilities/tools';
import { Interaction } from 'chart.js';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    aquapoint: {
        type: Object,
        default: () => null
    }
})

const emit = defineEmits(['update:visible', 'update:aquapoint', 'favoriteChanged', 'reviewChanged'])


const Auth = useAuth()
const toast = useToast()
const useModal = useModalStore()
const reviews = ref([])
const isFavorite = ref(false)
const userFavoritePoints = ref([])
const newReviewNumber = ref(0)
const reviewText = ref('')
const showTrustLevelVote = ref(false)
const showReportProblemModal = ref(false)
const reviewHover = ref(null)
const openReviewDropdown = ref(null)
const editMode = ref(false)
const edittingReviewId = ref(null)
const edittingComment = ref('')
const userSpeed = 5 // 5 metros por segundo

watch(() => props.visible, async (newValue) => {
    if (newValue) {
        await GetReviewsByPointId(props.aquapoint.id)
        userFavoritePoints.value = await GetUserFavoritePoints() || []
        isFavorite.value = userFavoritePoints.value.some(p => p.point_id === props.aquapoint.id)
    }
})

function toggleReviewDropdown(id){
    openReviewDropdown.value = openReviewDropdown.value === id ? null : id
}

function ChangeVisibility() {
    emit('update:visible', !props.visible)
}

async function ChangeFavoriteState() {
    if (!Auth.isLoggedIn) {
        useModal.openLoginModal()
        return
    }

    if (props.aquapoint.isPending == 1) {
        toast.error('O bebedouro ainda está pendente de aprovação.')
        return
    }

    if (isFavorite.value) {
        await favoriteService.delete({ user_id: Auth.user.id, point_id: props.aquapoint.id })
        toast.info('Bebedouro removido dos favoritos.')
    } else {
        await favoriteService.create({ user_id: Auth.user.id, point_id: props.aquapoint.id })
        toast.success('Bebedouro adicionado aos favoritos.')
    }

    emit('favoriteChanged')
    isFavorite.value = !isFavorite.value
}

async function GetReviewsByPointId(pointId) {
    var pointReviews = await reviewsService.getByPointId(pointId)

    if (pointReviews) {
        return reviews.value = pointReviews.data
    }

    return null
}

async function GetUserFavoritePoints() {
    var favorites = await favoriteService.getByUserId(Auth.user.id)
    if (favorites) {
        return favorites.data
    }

    return null
}

async function SubmitReview() {
    if (!Auth.isLoggedIn) {
        useModal.openLoginModal()
        return
    }

    if (props.aquapoint.isPending == 1) {
        toast.error('O bebedouro ainda está pendente de aprovação.')
        return
    }

    if (reviewText.value.trim() === '') {
        toast.error('Por favor, escreva um comentário antes de submeter a sua opinião.')
        return
    }

    try {
        await reviewsService.create({
            user_id: Auth.user.id,
            point_id: props.aquapoint.id,
            rating: newReviewNumber.value,
            comment: reviewText.value
        })

        toast.success('Obrigado pela sua opinião!')

        // Refresh das reviews para mostrar a nova review submetida
        reviews.value = await GetReviewsByPointId(props.aquapoint.id)
        emit('reviewChanged')

    } catch (error) {
        toast.error('Ocorreu um erro ao submeter a sua opinião. Por favor, tente novamente.')
    }

    newReviewNumber.value = 0
    reviewText.value = ''
}

function ReportProblem() {
    console.log('Report Problem clicked')

    if (props.aquapoint.isPending == 1) {
        toast.error('O bebedouro ainda está pendente de aprovação.')
        return
    }
    
    showReportProblemModal.value = true
}

async function ShowVoteTrustLevel() {
    try{
        const isUserValidToVote = (await trustLogsService.isVoteEnableByUserAndAquapointId(Auth.user.id, props.aquapoint.id)).data
        if(!isUserValidToVote.valid){
            toast.warning(isUserValidToVote.error)
            return;
        }

        showTrustLevelVote.value = !showTrustLevelVote.value
    }
    catch(err){
        toast.error('Erro ao verificar validade da votação.')
    }
}

async function VoteTrustLevel(vote) {
    if (vote === true) {
        if (props.aquapoint.point_trust < 4) {
            await aquapointService.changeTrustLevel(props.aquapoint.id, { point_trust: props.aquapoint.point_trust + 1 })
            await trustLogsService.create({
                user_id: Auth.user.id,
                point_id: props.aquapoint.id,
                trust_vote: props.aquapoint.point_trust + 1
            })
        }
    }
    else {
        if (props.aquapoint.point_trust > 1) {
            await aquapointService.changeTrustLevel(props.aquapoint.id, { point_trust: props.aquapoint.point_trust - 1 })
            await trustLogsService.create({
                user_id: Auth.user.id,
                point_id: props.aquapoint.id,
                trust_vote: props.aquapoint.point_trust - 1
            })
        }
    }

    toast.info('Voto realizado com sucesso. Obrigado pelo contributo.')
    showTrustLevelVote.value = false;
    const updatedData = (await aquapointService.getById(props.aquapoint.id)).data
    updatedData.distanceMeters = props.aquapoint.distanceMeters
    emit('update:aquapoint', updatedData)
}

async function DeleteReview(id){
    try{
        await reviewsService.delete(id)
        reviews.value = await GetReviewsByPointId(props.aquapoint.id)
        emit('reviewChanged')
        toast.success('Comentário removido com sucesso')
    }
    catch(err){
        toast.error(err.message)
    }
}

function GetPointDistance(pointLat, pointLng) {
    if (!navigator.geolocation) {
        return 'Estimativa indisponível'
    }

    if (!props.aquapoint.distanceMeters) {
        return 'A calcular distância...'
    }

    const distanceMeters = props.aquapoint.distanceMeters
    const distanceKm = distanceMeters / 1000

    const timeHours = distanceKm / userSpeed
    const timeMinutes = timeHours * 60
    const timeSeconds = timeMinutes * 60

  
    let distanceStr
    if (distanceKm < 1) {
        distanceStr = Math.round(distanceMeters) + ' m'
    } else {
        distanceStr = distanceKm.toFixed(2) + ' km'
    }

    let timeStr
    if (timeMinutes < 1) {
        timeStr = Math.round(timeSeconds) + ' s'
    } else if (timeMinutes < 60) {
        timeStr = Math.round(timeMinutes) + ' min'
    } else {
        const hours = Math.floor(timeHours)
        const minutes = Math.round(timeMinutes % 60)
        timeStr = `${hours}h ${minutes}min`
    }

    return `${timeStr} - ${distanceStr}`
}

function EditReview(review){
    editMode.value = true
    edittingReviewId.value = review.id
    edittingComment.value = review.comment
    openReviewDropdown.value = null
}

function CancelEdit(){
    editMode.value = false
    edittingReviewId.value = null
}

async function ApplyCommentChanges(review){
    review.comment = edittingComment.value

    try{
        await reviewsService.update(review.id, review)
        emit('reviewChanged')
        editMode.value = false
        edittingReviewId.value = null
        toast.success('Comentario alterado com sucesso')
    }
    catch(err){
        toast.error(`Erro ao gravar alteração do comentário.\nErro: ${err.message}`)
    }
}

</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 600px;
    max-height: 95%;
    position: relative;
    overflow-y: auto;
}

.btn-close {
    position: absolute;
    top: 5px;
    right: 5px;
}

.user-review-card {
    background-color: rgb(216, 216, 216);
    padding: 10px;
    margin: 10px 0px 10px 0px;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: box-shadow 0.2s;
}

.user-review-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-trustLevelVote {
    padding: 2px 5px;
    font-size: 0.7rem;
}

.aquapoint-image-preview {
    position: relative;
    margin-bottom: 10px;
    width: 50%;
    left: 25%;
    border-radius: 8px;
    object-fit: contain;
}

.image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 14rem;
    background-color: red;
}

.modal-box>img {
    object-fit: cover;
}

.point-image {
    border-radius: 12px 12px 0 0;
    /* Ou 16px */
    object-fit: cover;
    /* Ou fill */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.review-dropdown {
    position: absolute; 
    right: 0; 
    top: 20px; 
    background: white; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
    min-width: 130px; 
    z-index: 999; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>