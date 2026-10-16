<template>
    <div v-if="loginModal.loginModalOpen" class="modal-overlay" @click="loginModal.closeLoginModal()">
        <div class="container py-5 h-100" >
            <div class="row d-flex justify-content-center align-items-center h-100">                
                <div class="col-12 col-md-8 col-lg-6 col-xl-5" style="max-height: 90vh;" @click.stop>                    
                    <div class="card bg-dark text-white" style="border-radius: 1rem; height: auto; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.5);">

                        <button class="btn-close" style="filter: invert(1);" @click="loginModal.closeLoginModal()"></button>

                        <div class="card-body p-5 pb-0 text-center">                           

                            <div class="mb-md-3 mt-md-4 pb-4">
                                <img src="../assets/images/aqua_point_logo_white.png" class="me-2" style="width: 200px">
                                <h2 class="fw-bold mt-5 mb-2 text-uppercase">Login</h2>
                                <p class="text-white-50 mb-5">Por favor, insira o email e palavra-passe!</p>

                                <div data-mdb-input-init class="form-outline form-white mb-4 w-75 mx-auto">
                                    <label class="form-label" for="typeEmailX">Email</label>
                                    <input v-model="emailUser" :class="{'is-invalid': errors.email }" type="email" id="typeEmailX" class="form-control " />
                                    <div class="invalid-feedback">{{ errors.email }}</div>
                                </div>

                                <div data-mdb-input-init class="form-outline form-white mb-4 w-75 mx-auto">
                                    <label class="form-label" for="typePasswordX">Palavra-Passe</label>
                                    <input v-model="passwordUser" :class="{'is-invalid': errors.password }" type="password" id="typePasswordX" class="form-control " />
                                    <div class="invalid-feedback">{{ errors.password }}</div>
                                </div>

                                <!--<p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>-->

                                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5 mb-5" type="submit" v-on:click="ProcessLogin">Login</button>

                                <!--<div class="d-flex justify-content-center text-center mt-4 pt-1">
                                    <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                                    <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                    <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                                </div>-->
                                <p class="mb-0 mt-5" style="color: rgba(255,255,255,0.4); font-size: 1rem">
                                    Não tem conta registada? 
                                    <a href="#!" class="fw-bold" style="color: var(--aquapoint-marker-blue);" @click="GoToRegistNewAccount">Registar</a>
                                </p>

                            </div>
                        <div>
                            
                    </div>

                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFormValidation } from '../utilities/useFormValidation';
import { useAuth } from '../utilities/useAuth';
import { useModalStore } from '../utilities/modal';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService.js'


    defineProps({
        visible: {
            type: Boolean,
            default: false
        }
    })

    const router = useRouter()
    const loginModal = useModalStore()
    const Auth = useAuth()
    const { errors, validate, validateEmail, clearErrors } = useFormValidation()
    const emailUser = ref('')
    const passwordUser = ref('')
   

    onMounted(() => {
        const modal = document.getElementById('loginModal')
        if(!modal) return
        modal.addEventListener('show.bs.modal', () => {
            emailUser.value = ''
            passwordUser.value = ''
        })
    })

    async function ProcessLogin(){
        clearErrors()
        
        const emailError = validateEmail(emailUser.value)
        if(emailError) errors.value.email = emailError

        const isPasswordFilled = validate({
            password: passwordUser.value
        })

        if(!isPasswordFilled || emailError) return

        try {
            const response = await authService.authenticateUser({ email: emailUser.value, password: passwordUser.value })

            const loggedUser = response.data.user
            Auth.login(
                {id: loggedUser.id, name: loggedUser.name, email: loggedUser.email, isAdmin: loggedUser.isAdmin },
                response.data.token
            )

            router.push("/mapa")
            loginModal.closeLoginModal()
        }

        catch (e){
            errors.value.email = ' '
            errors.value.password = 'Email ou password incorretos'
            console.log(e.message)
        }
    }

    function GoToRegistNewAccount(){
       loginModal.closeLoginModal()

       router.push("/register")
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