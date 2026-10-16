<template>
    <div class="spacer"></div>
    <section class="main-container container-spacer">
        <div class="container">
            <div class="spacer"></div>
            <h1 class="main-titles">ÁREA PESSOAL</h1>
            <div class="spacer"></div>
            <div class="spacer"></div>

            <div class="row">
                <div v-if="user" class="col-lg-6 mt-5 mt-lg-0 d-flex flex-column justify-content-center align-items-center position-relative">
                    <label for="upload-image" style="cursor: pointer;">
                        <img :src="user.profilePicture"
                            alt="userimage" 
                            class="user-profile-image" 
                            id="preview">
                    </label>

                    <input type="file" 
                            id="upload-image"
                            accept="image/jpeg, image/png"
                            style="display: none;" @change="onProfileImageChange">
                </div>

                <div class="col-lg-6">
                    <form v-if="user" @submit.prevent="UpdateProfileData">
                        <!-- Nome -->
                        <div class="form-group">
                            <label for="exampleInputEmail1">O seu nome</label>
                            <input type="text" v-model="user.name" class="form-control contact-form" id="exampleInputEmail1" required>
                        </div>
                        <br>

                        <!-- Email -->
                        <div class="form-group">
                            <label for="exampleInputEmail1">O seu email</label>
                            <input type="email" v-model="user.email" class="form-control contact-form" id="exampleInputEmail1" aria-describedby="emailHelp" required>
                            <small id="emailHelp" class="form-text text-muted">Esta informação nunca será partilhada com ninguém.</small>
                        </div>
                        <br>

                        <!-- Data Nascimento -->
                        <div class="form-group">
                            <label>Data de Nascimento</label>
                            <div style="width: 95%;" :class="{ 'is-invalid': !user.dateBirth }">
                                <VueDatePicker v-model="user.dateBirth" :ui="{ input: 'form-control '}" :max-date="new Date()" :time-config="{ enableTimePicker: false }" text-input></VueDatePicker>
                            </div>
                        </div>
                        <br>

                        <!-- Cidade -->
                        <div class="form-group">
                            <label for="exampleInputPassword1">Cidade</label>
                            <input type="text" v-model="user.city" class="form-control contact-form" id="exampleInputEmail1" required="">
                        </div>
                        <br>

                        <!-- Password Atual -->
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password Atual</label>
                            <input type="password" v-model="actualPassword" class="form-control contact-form" id="exampleInputPassword1" placeholder="Password">
                        </div>
                        <br>

                        <!-- Nova Password -->
                        <div class="form-group">
                            <label for="exampleInputPassword1">Nova Password</label>
                            <input type="password" v-model="newPassword" class="form-control contact-form" id="exampleInputPassword1" placeholder="Password">
                        </div>
                        <br>                       
                        
                        <!-- Botão Submit -->
                        <div class="col-md-12">
                            <div class="form-group">
                                <input type="submit" value="Atualizar" class="btn btn-form" style="width: 95% !important; height: 40px !important; margin-top: 4%; background-color: var(--aquapoint-logo-blue); color: white;" tabindex="0">
                            </div>
                        </div>
                    </form>
                </div><!-- Col end -->

                
            </div><!-- Content row end -->

        </div><!-- Container end -->
    </section>

    <section class="main-container container-spacer">
        <!-- Favorite Aquapoints -->
        <div class="container">
            <div class="spacer"></div>
            <h1 class="main-titles">BEBEDOUROS FAVORITOS</h1>
            <div class="spacer"></div>

            <div class="row g-3 ">
                <div class="col-md-4 pe-3 mb-3" v-for="aquapoint in userPointsFavorite" :key="aquapoint.id">
                    <FavoriteAquapointCard :aquapoint="aquapoint" @favoriteChanged="LoadAllUserFavoritePoints"/>
                </div>
                
            </div><!-- Content row end -->

        </div><!-- Container end -->
        <div class="container">
            <div class="spacer"></div>
            <div class="spacer"></div>
            
            <h1 class="main-titles">INTERAÇÕES RECENTES</h1>
                <div class="spacer"></div>
            
                <div class="row g-3">
                    <div class="col-md-4 pe-3 mb-3" v-for="interaction in userInteractions" :key="interaction.id">
                        <InteractionDetailsCard :interaction="interaction" />
                    </div>                
                </div><!-- Content row end -->
                

        </div><!-- Container end -->
    </section>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useAuth } from '/src/utilities/useAuth';
    import { useToast } from 'vue-toastification';
    import { userService } from '../services/userService';
    import { aquapointService } from '../services/aquapointService'
    import { reviewsService } from '../services/reviewsService'
    import { VueDatePicker } from '@vuepic/vue-datepicker';
    import { useFormValidation } from '../utilities/useFormValidation';
    import FavoriteAquapointCard from '../components/FavoriteAquapointCard.vue';
    import InteractionDetailsCard from '../components/InteractionDetailsCard.vue';

    const Auth = useAuth()
    const toast = useToast()
    const { errors, validate, validateEmail, clearErrors } = useFormValidation()
    const user = ref(null)
    const actualPassword = ref('')
    const newPassword = ref('')
    const userPointsFavorite = ref(null)
    const userInteractions = ref(null)


   onMounted(async () => {
        user.value = (await userService.getById(Auth.user.id)).data
        await LoadAllUserFavoritePoints()
        await LoadAllUserInteractions()
    })

    async function LoadAllUserFavoritePoints(){
        userPointsFavorite.value = (await aquapointService.getUserFavoritePoints(Auth.user.id)).data
    }

    async function LoadAllUserInteractions() {
        userInteractions.value = (await reviewsService.getByUserId(Auth.user.id)).data
    }

    async function UpdateProfileData(){
        clearErrors()

        try{
            const updatedUser = { ...user.value }

            if(actualPassword.value){
                const response = await userService.comparePasswords(actualPassword.value, user.value.passwordHash)
                if(!response.data.isValid){
                    toast.error('A password atual está errada.')
                    return
                }

                if(!newPassword.value){ 
                    toast.error('Insira uma nova password.')
                    return
                }

                updatedUser.passwordHash = newPassword.value
            }
            
            const emailError = validateEmail(updatedUser.email)
            if(emailError) errors.value.email = emailError

            const requiredFieldsFilled = validate({
                name: updatedUser.name,
                dateBirth: updatedUser.dateBirth,
                city: updatedUser.city
            })

        
            if(!requiredFieldsFilled || emailError) return
            await userService.update(Auth.user.id, updatedUser)

            console.log('Updated user')
            actualPassword.value = ''
            newPassword.value = ''
            toast.success('Dados atualizados com sucesso.')
        }

        catch(err){
            toast.error(`Erro ao atualizar dados do utilizador: ${err.message}`)
        }
    }

    function onProfileImageChange(e) {
        const file = e.target.files[0]
        if(!file) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
            user.value.profilePicture = e.target.result
        }
        reader.readAsDataURL(file)
    }
</script>

<style scoped>
    @import "/src/assets/css/style.css";
</style>    