<template>
    <div v-if="visible" class="modal-overlay" @click="ChangeVisibility(!visible)">
        <div class="modal-box col-lg-6" @click.stop>
            <button class="btn-close" @click="ChangeVisibility(!visible)"></button>

            <section class="main-container container-spacer">
                <div class="container">
                    <div class="spacer"></div>
                    <h1 class="main-titles">{{props.title}}</h1>
                    <div class="spacer"></div>

                    <div class="row">
                        <div class="col-lg-6 mt-5 mt-lg-0">
                            <img :src="newAquapointImage" alt="defaultPointImage" class="edit-zone-image" @click="openFileInput" :style="{ cursor: props.viewOnly ? 'default' : 'pointer' }">

                            <input v-if="!viewOnly" type="file" ref="fileInput" style="display:none" @change="onFileChange" accept="image/*">
                        </div>
                       
                        <div class="col-lg-6">
                            <form @submit.prevent="UpdateAquaPointData()">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="label" for="name">Nome do bebedouro</label>
                                            <input v-model="nameValue" :disabled="viewOnly" type="text" class="form-control edit-form" name="name" id="name" placeholder="Nome do bebedouro" tabindex="0" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6"> 
                                        <div class="form-group">
                                            <label class="label" for="state">Estado do bebedouro</label>
                                            <v-select v-model="stateValue" :options="allStates" :disabled="viewOnly"  label="state_name" :reduce="state => state.id" placeholder="Seleciona um estado">
                                                <template #option="option">
                                                    <i class="me-2" :class="GetPointStateIcon(option.state_name, true)"></i>{{ option.state_name }}
                                                </template>
                                                <template #selected-option="option">
                                                    <i :class="GetPointStateIcon(option.state_name, true)" class="me-2"></i>
                                                    {{ option.state_name }}
                                                </template>
                                            </v-select>                                            
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6" style="margin-top: 1vh;">
                                        <div class="form-group">
                                            <label class="label" for="trust">Nível de confiança</label>
                                            <v-select v-model="trustValue" :options="allTrustLevels" :disabled="viewOnly" label="trust_name" :reduce="trust => trust.id" placeholder="Seleciona um nivel">
                                                <template #option="option">
                                                    <i class="me-2" :class="GetTrustLevelIcon(option.trust_name)"></i>{{ option.trust_name }}
                                                </template>
                                                <template #selected-option="option">
                                                    <i class="me-2" :class="GetTrustLevelIcon(option.trust_name)"></i>
                                                    {{ option.trust_name }}
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6" style="margin-top: 1vh;"> 
                                        <div class="form-group">
                                            <label class="label" for="zone">Localização do bebedouro</label>
                                            <input v-model="localValue" type="text" disabled class="form-control edit-form" name="zone" id="zone" placeholder="Zona" tabindex="0" required>
                                        </div>
                                    </div>

                                    <div class="col-md-6" style="margin-top: 1vh;"> 
                                        <div class="form-group">
                                            <label class="label" for="latitude">Latitude</label>
                                            <input v-model="latitudeValue" type="text" disabled class="form-control edit-form" name="latitude" id="latitude" placeholder="Latitude" tabindex="0" required>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6" style="margin-top: 1vh;"> 
                                        <div class="form-group">
                                            <label class="label" for="longitude">Longitude</label>
                                            <input v-model="longitudeValue" type="text" disabled class="form-control edit-form" name="longitude" id="longitude" placeholder="Longitude" tabindex="0" required>
                                        </div>
                                    </div>

                                    
                                    <div v-if="!viewOnly" class="col-md-12">
                                        <div class="form-group">
                                            <input type="submit" value="Submeter" class="btn btn-form bg-primary" style="width: 100% !important; height: 40px !important; margin-top: 4%; color: white;" tabindex="0">
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="form-group">
                                            <button type="button" class="btn btn-outline-primary w-100" style="height: 40px; margin-top: 4%;" @click="OpenGoogleMapsInOtherTabWithDirections(aquapoint.latitude, aquapoint.longitude)">
                                                <i class="bi bi-geo-alt me-2"></i>Obter direções
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div><!-- Col end -->

                        
                    </div><!-- Content row end -->

                </div><!-- Container end -->
            </section>

            <div style="position: relative">
                <div id="mapa" style="height: 40vh; width: 100%"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
    import { aquapointService } from '../services/aquapointService' 
    import { localsService } from '../services/localsService'
    import { zonesService } from '../services/zonesService'  
    import { trustLevelService } from '../services/trustLevelsService'
    import { statesService } from '../services/statesService'
    import { useToast } from 'vue-toastification';
    import { GetPointStateIcon, GetTrustLevelIcon, OpenGoogleMapsInOtherTabWithDirections } from '../utilities/tools'
    import vSelect from 'vue3-select'
    import 'vue3-select/dist/vue3-select.css'

    const toast = useToast()
    const fileInput = ref(null)
    const mapaRef = ref(null)
    let newAquapointImage = ref(null)

    const props = defineProps({
        visible: {
            type: Boolean,
            default: false
        },
        viewOnly: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'EDITAR BEBEDOURO'
        },
        aquapoint: {
            type: Object,
            default: () => null
        }
    })

    const emit = defineEmits(['update:visible', 'pointUpdated'])

    const nameValue = ref('')
    const stateValue = ref('')
    const trustValue = ref('')
    const allTrustLevels = ref(null)
    const allStates = ref(null)
    const latitudeValue = ref('')
    const longitudeValue = ref('')
    const localValue = ref('')
    let marker = null

    function ChangeVisibility(value) {
        emit('update:visible', value)
    }

    onMounted(async () => {
        allTrustLevels.value = (await trustLevelService.getAll()).data
        allStates.value = (await statesService.getAll()).data
    })

    watch(
        () => props.aquapoint,
        (newValue) => {
            if (newValue) {
                nameValue.value = newValue.point_name ?? ''
                stateValue.value = newValue.state_id ?? ''
                trustValue.value = newValue.point_trust ?? ''
                latitudeValue.value = newValue.latitude ?? ''
                longitudeValue.value = newValue.longitude ?? ''
                localValue.value = newValue.zone_name ?? ''
                newAquapointImage.value = newValue.image ?? '/src/assets/images/defaultPointImage.jpg'
            } else {
                nameValue.value = ''
                stateValue.value = ''
                trustValue.value = ''
                latitudeValue.value = ''
                longitudeValue.value = ''
                localValue.value = ''
                newAquapointImage.value = '/src/assets/images/defaultPointImage.jpg'
            }
        },
        { immediate: true }
    )

    watch(
        () => props.visible, // on value change basicamente
        async (isVisible) => {
            if (isVisible) {
                await nextTick() // esperar que o DOM dê load
                LoadMap()
            } else {
                DestroyMap()
            }
        }
    )

    function openFileInput() {
        fileInput.value?.click()
    }

    function onFileChange(event) {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            newAquapointImage.value = e.target.result
        }
        reader.readAsDataURL(file)
    }

    function LoadMap() {
        if (mapaRef.value) return

        mapaRef.value = L.map('mapa').setView([38.781558, -9.102584], 13)

        L.tileLayer('https://tile.jawg.io/jawg-lagoon/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
            attribution: '© Jawg Maps',
            accessToken: 'BumVzniBYxFsvv2lUwvsZ8fQMn6WdPC2sS5bAqyeSyDrROwuULnZrt0lE1uKPHrT'
        }).addTo(mapaRef.value)

        mapaRef.value.on('click', async (e) => {
            const map = mapaRef.value
            if (!map) return

            if(!props.viewOnly){
                const { lat, lng } = e.latlng

                latitudeValue.value = lat
                longitudeValue.value = lng

                if (marker) {
                    marker.setLatLng([lat, lng])
                } else {
                    marker = L.marker([lat, lng]).addTo(map)
                }

                map.setView([lat, lng], 16, { animate: false })

                const localData = await GetPlaceDataByCoords(lat, lng)

                if (!mapaRef.value || mapaRef.value !== map) return

                localValue.value = localData.zone
                marker.bindPopup(localValue.value || 'Bebedouro').openPopup()
            }
        })

        setTimeout(() => {
            mapaRef.value?.invalidateSize()

            if (latitudeValue.value && longitudeValue.value) {
                marker = L.marker([latitudeValue.value, longitudeValue.value]).addTo(mapaRef.value)
                marker.bindPopup(props.aquapoint.point_name || 'Bebedouro').openPopup()

                mapaRef.value.setView([latitudeValue.value, longitudeValue.value], 13)
            }
        }, 100)
    }

    function DestroyMap() {
        if (marker) {
            marker.remove()
            marker = null
        }

        if (mapaRef.value) {
            mapaRef.value.remove()
            mapaRef.value = null
        }
    }

    function GetPlaceDataByCoords(lat, lng) {
        return fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        .then(response => response.json())
        .then(data => {
            return {
                city: data.address.city || data.address.town || '',
                zone: data.address.village || data.address.town || data.address.neighbourhood || data.address.hamlet || data.display_name || ''
            }
        })
        .catch(error => {
            console.error("Erro ao obter dados de zona:", error)
            return ''
        })
    }

    async function UpdateAquaPointData() {
        var zoneData = await GetLocalFromBackEnd(localValue.value)
        var localId = null

        if (!zoneData || !zoneData.id) {
            const coordsData = await GetPlaceDataByCoords(latitudeValue.value, longitudeValue.value)
            let cityName = coordsData?.city || 'Desconhecido'

            var zoneId = await GetZoneByName(cityName)

            if (!zoneId) {
                zoneId = await CreateNewZone(cityName)
            }

            localId = await CreateNewLocal(localValue.value, zoneId)
        } else {
            localId = zoneData.id
        }

        if (localId) {           
            aquapointService.update(props.aquapoint.id, {
                point_name: nameValue.value,
                state_id: stateValue.value,
                point_trust: trustValue.value,
                latitude: latitudeValue.value,
                longitude: longitudeValue.value,
                local_id: localId,
                image: newAquapointImage.value
            }).then(() => {
                emit('pointUpdated')
                ChangeVisibility(false)
                toast.success('Dados atualizados com sucesso.')

            }).catch(error => {
                console.error("Erro ao atualizar bebedouro:", error)
            })
        }
    }   

    async function GetLocalFromBackEnd(local) {
        try {

            const { data } = await localsService.getByName(local)

            return data

        } catch (error) {

            if (error.response?.status === 404) {
                return false
            }

            return false
        }
    }

    async function CreateNewLocal(local_name, zone_id) {
        try {
            const { data } = await localsService.create({ name: local_name, zone_id: zone_id })

            return data.id
        } catch (error) {
            return null
        }
    }

    async function GetZoneByName(name) {
        try {
            const { data } = await zonesService.getByName(name)

            return data.id
        } catch (error) {
            return null
        }
    }

    async function CreateNewZone(zone_name) {
        try {
            const { data } = await zonesService.create({ name: zone_name })

            return data.id
        } catch (error) {
            return null
        }
    }

    onBeforeUnmount(() => {
        DestroyMap()
    })

    
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
        z-index: 1000;
    }
    .modal-box {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-height: 95%;
        position: relative;
        overflow-y: auto;
    }

    .btn-close {
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .text-orange {
        color: #fd7e14;
    }

    .edit-zone-image{
        max-height: 300px;
    }
</style>