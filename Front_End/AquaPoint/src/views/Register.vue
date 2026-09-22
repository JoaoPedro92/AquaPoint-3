<template>

<div class="spacer"></div>

<section class="register-section">

  <div class="container">

    <div class="row align-items-center">

      <div class="col-lg-6 register-image-area">

        <img
          src="/src/assets/images/aqua_point_logo.png"
          class="register-image"
          alt="Register User">

      </div>

      <!-- FORMULÁRIO -->
      <div class="col-lg-6 register-form-area">
        <div class="register-form-wrapper">
          <h3 class="main-titles mb-4">REGISTAR UTILIZADOR</h3>

          <form @submit.prevent="RegisterUser">

            <!-- Imagem Perfil -->
            <div v-if="newUser" class="form-group text-center mb-4" >
              <label for="upload-image" style="cursor: pointer;">
                <img :src="newUser.profilePicture" alt="userimage" class="user-profile-image" width="250px" id="preview">
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
              <input v-model="newUser.name" type="text" class="form-control contact-form"
                placeholder="Introduza o seu nome" required>
            </div>

            <!-- Email -->
            <div class="form-group mb-3">
              <label class="form-label">Email</label>
              <input v-model="newUser.email" type="email" class="form-control contact-form" 
                placeholder="Introduza o seu email" required>
            </div>

            <!-- Data Nascimento -->
            <div class="form-group mb-3">
                <label>Data de Nascimento</label>
                <div style="width: 95%;" :class="{ 'is-invalid': !newUser.dateBirth }">
                    <VueDatePicker v-model="newUser.dateBirth" :ui="{ input: 'form-control '}" :max-date="new Date()" :time-config="{ enableTimePicker: false }" text-input></VueDatePicker>
                </div>
            </div>

            <!-- Cidade -->
            <div class="form-group mb-3">
              <label class="form-label">Cidade</label>
              <input v-model="newUser.city" type="text" class="form-control contact-form"
                placeholder="Introduza o seu nome" required>
            </div>

            <!-- Password -->
            <div class="form-group mb-3">
              <label class="form-label">Password</label>
              <div class="password-wrapper">
                <input v-model="newUser.password" :type="showPassword ? 'text' : 'password'"
                  class="form-control password-input" placeholder="Introduza uma password" required>
                <i class="toggle-password" :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" @click="showPassword = !showPassword"></i>
              </div>
            </div>

            <!-- Repetir Password -->
            <div class="form-group mb-3">
              <label class="form-label">Repetir Password</label>
              <div class="password-wrapper">
                <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control password-input" placeholder="Introduza uma password" required>
                <i class="toggle-password" :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" @click="showConfirmPassword = !showConfirmPassword"></i>
              </div>
            </div>

            <input type="submit" value="Registar" class="btn btn-register">

          </form>

        </div>

      </div>

    </div>

  </div>

</section>

</template>

<script setup>

import { ref, onMounted } from 'vue'
import { imageUrlToBase64 } from '../utilities/tools';
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification';
import { useAuth } from '../utilities/useAuth';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import userImageDefault from '../assets/images/user_image.png'

const newUser = ref({
    name: '',
    email: '',
    password: '',
    city: '',
    profilePicture: userImageDefault,
    dateBirth: null,
    isAdmin: 0
})
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const toast = useToast()
const router = useRouter()
const Auth = useAuth()
const fileInput = ref(null)

onMounted(async () => {
  newUser.value.profilePicture = await imageUrlToBase64(userImageDefault)
})

async function RegisterUser(){

  const isPasswordsMatching = newUser.value.password === confirmPassword.value
  if(!isPasswordsMatching){
    toast.error('As passwords não coincidem.')
    return
  }
  
  try{
    console.log(newUser.value)
    const response = await userService.create(newUser.value)
    if(response.data.id){
      //toast.info('Utilizador criado com sucesso')

      const userAuth = await authService.authenticateUser({ email: newUser.value.email, password: newUser.value.password })

      Auth.login(
        {id: userAuth.data.user.id, name: userAuth.data.user.name, email: userAuth.data.user.email, isAdmin: userAuth.data.user.isAdmin },
        userAuth.data.token
      )
      router.push("/")
      
    }
    
  }
  catch(err){
  console.error(err)

  if (err.response) {
    console.error(err.response.data)
    toast.error(err.response.data.message || 'Erro no servidor')
  } else if (err.message) {
    toast.error(err.message)
  } else {
    toast.error('Erro ao criar novo utilizador')
  }
}

}

function onProfileImageChange(e) {
        const file = e.target.files[0]
        if(!file) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
            newUser.value.profilePicture = e.target.result
        }
        reader.readAsDataURL(file)

    }

</script>

<style scoped>

@import "/src/assets/css/style.css";

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
}

.register-form-wrapper{
  width: 100%;
  max-width: 420px;
}

.form-label{
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.password-wrapper{
  position: relative;
  width: 95%;
}

.password-input{
  width: 100%;
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

.btn-register{
  width: 95%;
  max-width: 220px;
  height: 40px;
  margin: 20px auto 0 auto;
  background-color: var(--aquapoint-logo-blue);
  color: white;
  border: none;
}

.btn-register:hover{
  background-color: var(--aquapoint-marker-blue);
}

/* MOBILE */
@media (max-width: 992px){

.register-section{
  text-align:center;
}

.register-image-area{
  margin-bottom: 30px;
}

.register-image{
  width: 40%;
}

}

</style>