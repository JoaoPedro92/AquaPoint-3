<template>

    <div class="container py-4">
        <h1>Dashboard Bebedouros</h1>

        <!-- Loading -->
        <div v-if="loading">A carregar...</div>

        <div v-else>
            <button v-if="!showPendingOnly" type="button" class="btn btn-warning mb-4"
                @click="showPendingAquapoints">({{ pendingPointsCount }}) Bebedouros Pendentes</button>
            <button v-else type="button" class="btn btn-warning mb-4" @click="showNotPendingAquapoints">Todos Bebedouros</button>

            <!-- Mobile: Cards -->
            <div class="d-md-none d-flex flex-column gap-3">
                <div v-for="aquapoint in aquapoints" :key="aquapoint.id" class="border rounded-3 p-3">
                    <!-- Nome + tipo + estado -->
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <img :src="aquapoint.image" width="44" height="44"
                            class="rounded-2 object-fit-cover flex-shrink-0" />
                        <div class="flex-grow-1 overflow-hidden">
                            <p class="fw-medium mb-0 small">{{ aquapoint.point_name }}</p>
                            <p class="text-muted mb-0" style="font-size: 12px;">{{ aquapoint.type_name }}</p>
                        </div>
                        <span class="badge rounded-2 text-nowrap" :style="GetPointStateStylesFromList(allStates, aquapoint)">
                            <i :class="GetPointStateIcon(aquapoint.state_name)"></i>
                            {{ aquapoint.state_name }}
                        </span>
                    </div>

                    <!-- Pontuaçao + Reviews + Credibilidade -->
                    <div class="row g-2 mb-3">
                        <div class="col-4">
                            <div class="text-center bg-light rounded-2 p-2">
                                <p class="text-muted mb-0" style="font-size: 11px;">Pontuação</p>
                                <p class="mb-0 small fw-medium">{{ aquapoint.ratingAVG ?? 0.0 }}</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center bg-light rounded-2 p-2">
                                <p class="text-muted mb-0" style="font-size: 11px;">Reviews</p>
                                <p class="mb-0 small fw-medium">{{ aquapoint.ratingsAmount }}</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center bg-light rounded-2 p-2">
                                <p class="text-muted mb-0" style="font-size: 11px;">Credibilidade</p>
                                <p class="mb-0 small fw-medium">{{ aquapoint.trust_name }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div class="d-flex gap-2 justify-content-center">
                        <div v-if="!showPendingOnly">
                            <button @click="editAquaPoint(aquapoint)"
                                class="btn btn-sm btn-primary flex-fill me-2">Editar</button>
                            <button @click="selectedAquaPoint = aquapoint"  data-bs-toggle="modal" data-bs-target="#deleteAquapointModal" class="btn btn-sm btn-danger flex-fill me-2">
                                Eliminar
                            </button>
                            <button @click="changePointState(aquapoint)" class="btn btn-sm flex-fill text-white me-2" :class="{
                                'bg-success': aquapoint.state_id === 3,
                                'bg-secondary': aquapoint.state_id !== 3
                            }">
                                {{ aquapoint.state_id !== 3 ? 'Marcar como Inativo' : 'Marcar como Ativo' }}
                            </button>
                        </div>
                        <div v-else >
                            <button class="btn btn-sm btn-success mt-1 me-2"
                                @click="acceptPendingPoint(aquapoint)">Aceitar</button>
                            <button class="btn btn-sm btn-danger mt-1 me-2"
                                @click="declinePendingPoint(aquapoint.id)">Recusar</button>
                        </div>

                    </div>
                </div>
            </div>


        <!-- DESKTOP -->
        <table class="d-none d-md-table table table-striped table-hover mt-3">
            <thead>
                <tr>
                    <th scope="col" class="text-center">Imagem</th>
                    <th scope="col">Nome</th>
                    <th scope="col" class="text-center">Tipo</th>
                    <th scope="col" class="text-center" style="width:60px">Pontuação Média</th>
                    <th scope="col" class="text-center">Nº Reviews</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Credibilidade</th>
                    <th scope="col" class="text-center">
                        <i class="bi bi-gear me-1"></i>Opções
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aquapoint in aquapoints" :key="aquapoint.id">
                    <td class="text-center">
                        <img :src="aquapoint.image" class="rounded-circle"
                            width="40" height="40">
                    </td>
                    <td>{{ aquapoint.point_name }}</td>
                    <td class="text-center">{{ aquapoint.point_type }}</td>
                    <td class="text-center">{{ aquapoint.ratingAVG || 0.0 }}</td>
                    <td class="text-center">{{ aquapoint.ratingsAmount }}</td>
                    <td>
                        <span class="badge rounded-2 text-nowrap" :style="GetPointStateStylesFromList(allStates, aquapoint)">
                            <i :class="GetPointStateIcon(aquapoint.state_name)"></i>
                            {{ aquapoint.state_name }}
                        </span>
                    </td>
                    <td>{{ aquapoint.trust_name }}</td>

                    <!-- Options Buttons -->
                    <td class="text-center">
                        <div v-if="showPendingOnly">
                            <button class="btn btn-sm btn-secondary mt-1 me-2" @click="editAquaPoint(aquapoint, true)">
                                <i class="bi bi-search me-1"></i>Ver
                            </button>
                            <button class="btn btn-sm btn-success mt-1 me-2"
                                @click="acceptPendingPoint(aquapoint)">
                                <i class="bi bi-check2 me-1"></i>Aceitar</button>
                            <button class="btn btn-sm btn-danger mt-1 me-2"
                                @click="declinePendingPoint(aquapoint.id)">
                                <i class="bi bi-x-lg me-1"></i>Recusar</button>
                        </div>
                        <div v-else>
                            <button class="btn btn-sm btn-primary mt-1 me-2"
                                @click="editAquaPoint(aquapoint)">Editar</button>
                            <button class="btn btn-sm btn-danger mt-1 me-2"
                                @click="selectedAquaPoint = aquapoint"  data-bs-toggle="modal" data-bs-target="#deleteAquapointModal">Eliminar</button>

                            <button v-if="aquapoint.isPending == 1 || aquapoint.state_id == 3"
                                class="btn btn-sm btn-success mt-1" @click="changePointState(aquapoint)">Marcar como
                                ativo</button>
                            <button v-else class="btn btn-sm btn-warning mt-1"
                                @click="changePointState(aquapoint)">Marcar como inativo</button>
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
        <!-- Delete Aquapoints Confirmation Modal -->
        <div class="modal fade" id="deleteAquapointModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Eliminar Bebedouro</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Tem a certeza que pretende eliminar o bebedouro <strong>"{{ selectedAquaPoint?.point_name }}"</strong>?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="deleteAquaPoint(selectedAquaPoint.id)">Sim</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Não</button>
            </div>
            </div>
        </div>
        </div>
    </div>
    <!-- Aquapoints table -->
    </div>

    <EditModal v-model:visible="showEditModal" :viewOnly="editAquapointViewOnly" :aquapoint="selectedAquaPoint" @pointUpdated="loadAquapoints()"></EditModal>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification';
import { aquapointService } from '../../services/aquapointService'
import { statesService } from '../../services/statesService';
import { GetPointStateIcon, GetPointStateStylesFromList, GetTrustLevelIcon } from '../../utilities/tools';
import EditModal from '/src/components/EditAquaPointsModal.vue'

const allAquapoints = ref([])
const aquapoints = ref([])
const loading = ref(true)
const showEditModal = ref(false)
const editAquapointViewOnly = ref(false)
const selectedAquaPoint = ref(null)
const pendingPointsCount = ref(0)
const showPendingOnly = ref(false)
const toast = useToast()
const allStates = ref([])

onMounted(async () => {
    loadAquapoints()
    allStates.value = (await statesService.getAll()).data
})

function GetInactiveAquaPoints() {
    return aquapoints.value.filter(a => a.state_id === 3)
}

async function GetPendingAquaPointsCount() {
    pendingPointsCount.value = (await aquapointService.getPendingCount()).data.total_pending
}

function editAquaPoint(aquapoint, modalViewOnly = false) {
    selectedAquaPoint.value = { ...aquapoint }
    editAquapointViewOnly.value = modalViewOnly
    showEditModal.value = true
}

async function deleteAquaPoint(pointId) {
    if (pointId) {
        try {
            await aquapointService.delete(pointId)
            loadAquapoints()
        } catch (error) {
            console.error("Erro ao eliminar bebedouro:", error)
        }
    }
}

async function changePointState(aquapoint) {
    if (aquapoint) {
        if (aquapoint.state_id !== 3) {
            aquapoint.state_id = 3
        } else {
            aquapoint.state_id = 2
        }

        try {
            await aquapointService.update(aquapoint.id, aquapoint)

            loadAquapoints()
        } catch (error) {
            console.error("Erro ao atualizar estado:", error)
        }
    }
}

async function loadAquapoints() {
    loading.value = true
    allAquapoints.value = (await aquapointService.getAll()).data
    pendingPointsCount.value = allAquapoints.value.filter(a => a.isPending === 1).length
    if(showPendingOnly.value){ aquapoints.value = allAquapoints.value.filter(a => a.isPending === 1) }
    else{ aquapoints.value = allAquapoints.value.filter(a => a.isPending !== 1) }

    loading.value = false
}

async function showPendingAquapoints() {
    showPendingOnly.value = true
    aquapoints.value = allAquapoints.value.filter(a => a.isPending === 1)
}

async function showNotPendingAquapoints() {
    showPendingOnly.value = false
    aquapoints.value = allAquapoints.value.filter(a => a.isPending !== 1)
}

async function acceptPendingPoint(aquapoint){
    try{
        aquapoint.isPending = 0
        await aquapointService.update(aquapoint.id, aquapoint)
        toast.info('Bebedouro foi aprovado com sucesso')
        await loadAquapoints()

    }
    catch(err){
        toast.error(`Erro ao aprovar bebedouro pendente: ${err.message}`)

    }
}

async function declinePendingPoint(id){
    try{
        await aquapointService.delete(id)
        toast.info('Bebedouro foi reprovado com sucesso')
        await loadAquapoints()
    }
    catch(err){
        toast.error(`Erro ao recusar bebedouro pendente: ${err.message}`)
    }
}
</script>