<template>
    <div v-if="visible" class="modal-overlay" @click="ChangeVisibility(!visible)">
        <div class="modal-box" @click.stop>
            <button class="btn-close" @click="ChangeVisibility(!visible)"></button>

            <div class="d-flex align-items-center">
                <div class="hex-bg mb-1 me-2">
                    <i class="bi bi-flag-fill text-white" style="font-size: 0.7rem" title="Reportar" v-on:click="ReportProblem"></i>
                </div>
                <h5>Reportar Problema</h5>
            </div>
            <br>

            <!--<div class="form-floating mb-3 mt-4">
                <input v-model="userEmail" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" id="floatingInput" placeholder="name@example.com">
                <label for="floatingInput">Email</label>
                <div class="invalid-feedback">{{  errors.email }}</div>
            </div>-->
            <div class="form-floating">
                <textarea v-model="reportDescription" class="form-control" :class="{ 'is-invalid': errors.description}" id="floatingPassword" placeholder="Descrição" rows="6" style="min-height: 150px;"></textarea>
                <label for="floatingPassword">Dê-nos mais informações</label>
                <div class="invalid-feedback">{{  errors.description }}</div>
            </div>
            <br>

            <div class="form-floating">
                <input type="file" class="form-control" id="floatingFile" placeholder="Anexar imagem" @change="onFileChange" accept="image/*">
                <label for="floatingFile">Anexar imagem</label>
            </div>

            <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-success shadow-sm" style="width: 60%;" v-on:click="ReportProblem">SUBMETER</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import { useFormValidation } from '../utilities/useFormValidation'
    import { reportsService } from '../services/reportsService';
    import { useAuth } from '../utilities/useAuth';
    import { useToast } from 'vue-toastification';

    const { errors, validate, validateEmail, clearErrors } = useFormValidation()
    //const userEmail = ref('')
    const reportDescription = ref('')
    const Auth = useAuth()
    const toast = useToast()
    const pointId = ref(null)
    const reportImage = ref(null)

    const props = defineProps({
        visible: {
            type: Boolean,
            default: false
        },
        aquapoint: {
            type: Number,
            default: null
        }
    })

    watch(
        () => props.aquapoint,
        (newValue) => {
            pointId.value = newValue ?? null
        },
        { immediate: true }
    )

    const emit = defineEmits(['update:visible'])

    function ChangeVisibility(value){
        emit('update:visible', value)
    }

    function onFileChange(e) {
        const file = e.target.files[0]
        if(!file) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
            reportImage.value = e.target.result
        }
        reader.readAsDataURL(file)
        
    }

    async function ReportProblem(){
        clearErrors()
        //const emailError = validateEmail(userEmail.value)
       // if(emailError) errors.value.email = emailError

        const isValid = validate({
            description: reportDescription.value
        })

        //if(!isValid || emailError) return
        if(!isValid) return

        if (!Auth.isLoggedIn) {
            loginModal.openLoginModal()
            return
        }

        if (!pointId.value) {
            toast.error('Ponto de água não identificado. Por favor, tente novamente.')
            return
        }
       
        if (!reportImage.value) {
            toast.error('Por favor, anexe uma imagem ao seu report.')
            return
        }

        try {
            await reportsService.create({
                user_id: Auth.user.id,
                point_id: pointId.value,
                comment: reportDescription.value,
                image: reportImage.value, 
            })

            toast.success('Report enviado com sucesso!')

            ChangeVisibility(false)
        } catch (error) {
            toast.error('Ocorreu um erro ao submeter o seu report. Por favor, tente novamente.')
        }

        //console.log(`Email: ${userEmail.value}\nDescrição: ${reportDescription.value}`)
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
        z-index: 1000;
    }
    .modal-box {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 550px;
        max-height: 95%;
        position: relative;
        overflow-y: auto;
    }

    .btn-close {
        position: absolute;
        top: 5px;
        right: 5px;
    }
</style>