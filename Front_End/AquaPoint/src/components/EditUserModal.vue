<template>
    <!-- Modal User Edit -->
    <div v-if="visible" class="modal-overlay" @click="ChangeVisibility(!visible)">
        <div class="modal-box" @click.stop>
            <button class="btn-close" @click="ChangeVisibility(!visible)"></button>
            <div class="d-flex justify-content-center">
            <!-- FORMULÁRIO -->
            <div class="register-form-area">
                <div class="register-form-wrapper">
                <h3 class="main-titles mb-4">EDITAR UTILIZADOR</h3>

                <form @submit.prevent="EditUser">

                    <!-- Imagem Perfil -->
                    <div v-if="user" class="form-group text-center mb-4" >
                    <label for="upload-image" style="cursor: pointer;">
                        <img :src="user.profilePicture" alt="userimage" @click="openFileInput" class="user-profile-image" width="250px" id="preview">
                        </label>

                        <input type="file" id="upload-image" accept="image/jpeg, image/png"
                            style="display: none;" ref="fileInput" @change="onProfileImageChange">

                        <button type="button" class="btn btn-outline-secondary btn-file-input w-100" @click="fileInput.click()">
                        <i class="bi bi-upload me-2"></i>Escolher ficheiro
                        </button>
                    </div>
                    <!-- Nome -->
                    <div class="form-group mb-3">
                    <label class="form-label">Nome</label>
                    <input v-model="user.name" type="text" class="form-input form-control contact-form"
                        placeholder="Introduza o seu nome" required>
                    </div>

                    <!-- Email -->
                    <div class="form-group mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="user.email" type="email" class="form-input form-control contact-form" 
                        placeholder="Introduza o seu email" required>
                    </div>

                    <!-- Data Nascimento -->
                    <div class="form-group mb-3">
                        <label>Data de Nascimento</label>
                        <div style="width: 95%;" :class="{ 'is-invalid': !user.dateBirth }" class="form-input">
                            <VueDatePicker v-model="user.dateBirth" :ui="{ input: 'form-control '}" :max-date="new Date()" :time-config="{ enableTimePicker: false }" text-input></VueDatePicker>
                        </div>
                    </div>

                    <!-- Cidade -->
                    <div class="form-group mb-3">
                    <label class="form-label">Cidade</label>
                    <input v-model="user.city" type="text" class="form-input form-control contact-form"
                        placeholder="Introduza o seu nome" required>
                    </div>

                    <!-- Password -->
                    <div class="form-group mb-3">
                        <label class="form-label">Nova Password</label>
                        <div class="password-wrapper">
                            <input v-model="newPassword" :type="showPassword ? 'text' : 'password'"
                            class="form-control password-input" placeholder="Introduza uma nova password">
                            <i class="toggle-password" :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" @click="showPassword = !showPassword"></i>
                        </div>
                    </div>

                    <div class="w-100 d-flex justify-content-center">
                        <input type="submit" value="Editar" class="btn btn-edit">
                    </div>
                </form>

                </div>

            </div>          
        </div>
    </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useToast } from 'vue-toastification'
    import { userService } from '../services/userService'

    const props = defineProps({
        visible: {
            type: Boolean,
            default: false
        },
        viewOnly: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: () => null
        }
    })

    const emit = defineEmits(['update:visible', 'userUpdated'])

    const toast = useToast()
    const fileInput = ref(null)
    const showPassword = ref(false)
    const newPassword = ref(null)

    function ChangeVisibility(value){
        emit('update:visible', value)
    }

    async function EditUser(){
        props.user.passwordHash = newPassword.value
        try{
            await userService.update(props.user.id, props.user)
            emit('userUpdated')
            emit('update:visible', false)
            toast.success('Utilizador editado com sucesso')
        }
        catch(err){
            toast.error(`Erro ao editar utlizador: ${err.message}`)
        }
    }

    function openFileInput() {
        fileInput.value?.click()
    }

    function onProfileImageChange(event) {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            props.user.profilePicture = e.target.result
        }
        reader.readAsDataURL(file)
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

.register-section{
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.register-image-area{
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-image{
  width: 60%;
  max-width: 320px;
}

.register-form-area{
  display: flex;
  justify-content: center;
  width: 100%;
}

.register-form-wrapper{
  width: 100%;
}

.form-input{
    width: 100% !important;
}

.form-label{
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.password-wrapper{
  position: relative;
  width: 100%;
}

.password-input{
  width: 100% !important;
  height: 40px;
  padding: 0 45px 0 0.5vh;
}

.toggle-password{
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
}

.toggle-password:hover{
  color: var(--aquapoint-logo-blue);
}

.btn-edit{
  width: 70%;
  height: 40px;
  margin: 20px auto 0 auto;
  background-color: var(--aquapoint-logo-blue);
  color: white;
  border: none;
}

.btn-edit:hover{
  background-color: var(--aquapoint-marker-blue);
}
</style>