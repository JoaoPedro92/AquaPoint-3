<template>

    <div class="container py-4">
    <h1>Dashboard Users</h1>

    <!-- Loading -->
    <div v-if="loading">A carregar...</div>
    
    <div v-else>

        <!-- Mobile: Cards -->
        <div class="d-md-none d-flex flex-column gap-3">
            <div v-for="user in users" :key="user.id" class="bg-white border rounded-3 p-3" >

                <div class="d-flex align-items-center gap-3 mb-3">
                    <img :src="user.profilePicture || '/src/assets/images/user_image.png'" width="44" height="44"
                        class="rounded-2 object-fit-cover flex-shrink-0"/>
                    <div class="flex-grow-1 overflow-hidden">
                        <p class="fw-medium mb-0 small text-dark">{{ user.name }}</p>
                        <p class="text-muted mb-0" style="font-size: 12px;">{{ user.email }}</p>
                    </div>
                    <span class="badge rounded-2 text-nowrap" :class="user.isAdmin ? 'bg-success' : 'bg-secondary'">
                        {{ user.isAdmin ? 'Admin' : 'User' }}
                    </span>
                </div>

                <!-- Botões -->
                <div class="d-flex gap-2 flex-wrap">
                    <button @click="editUser(user)" class="btn btn-sm btn-primary flex-fill">Editar</button>
                    <button @click="selectedUser = user" data-bs-toggle="modal" data-bs-target="#deleteUserModal" class="btn btn-sm btn-danger flex-fill">Eliminar</button>
                    <button v-if="!user.isAdmin" @click="markUserAsAdmin(user.id, user.isAdmin)" class="btn btn-sm btn-success w-100">
                        Marcar como Admin
                    </button>
                    <button  v-else-if="user.isAdmin && user.id !== Auth.user.id" @click="markUserAsAdmin(user.id, user.isAdmin)" class="btn btn-sm btn-warning w-100">
                        Remover como Admin
                    </button>
                </div>
            </div>
        </div>

        <!-- Desktop: Users table-->
        <table class="d-none d-md-table table table-striped table-hover mt-3">
            <thead>
                <tr>
                <th scope="col" class="text-center">Imagem Perfil</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Função</th>
                <th scope="col" class="text-center" style="width:380px">
                    <i class="bi bi-gear me-1"></i>Opções
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td class="text-center"><img :src="user.profilePicture || '/src/assets/images/user_image.png'" class="rounded-circle" width="40" height="40"></td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.isAdmin ? 'Admin' : 'User' }}</td>
                    <td class="text-start ps-5">
                        <button class="btn btn-sm btn-primary mt-1 me-2" @click="editUser(user)">Editar</button>
                        <button class="btn btn-sm btn-danger mt-1 me-2" @click="selectedUser = user"  data-bs-toggle="modal" data-bs-target="#deleteUserModal">Eliminar</button>
                        <button v-if="!user.isAdmin" class="btn btn-sm btn-success mt-1" @click="markUserAsAdmin(user.id, user.isAdmin)">Marcar como Admin</button>
                        <button v-else-if="user.isAdmin && user.id !== Auth.user.id" class="btn btn-sm btn-warning mt-1" @click="markUserAsAdmin(user.id, user.isAdmin)">Remover como admin</button>
                    </td>
                </tr>                
            </tbody>
        </table>
    </div>
    </div>

    <!-- Delete User Confirmation Modal -->
    <div class="modal fade" id="deleteUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Eliminar Utilizador</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            Tem a certeza que pretende eliminar o utilizador {{ selectedUser?.name }}?
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="deleteUser(selectedUser.id)">Sim</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Não</button>
        </div>
        </div>
    </div>
    </div>

    

    <EditUserModal v-model:visible="showEditModal" :viewOnly="editUserViewOnly" :user="selectedUser" @user-updated="loadAllUsers"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification';
import { userService } from '../../services/userService' 
import { useAuth } from '../../utilities/useAuth'
import EditUserModal from '../../components/EditUserModal.vue'

const users = ref([])
const toast = useToast()
const loading = ref(true)
const Auth = useAuth()
const selectedUser = ref(null)
const showEditModal = ref(false)
const editUserViewOnly = ref(false)

onMounted(async () => {
    await loadAllUsers()
    loading.value = false
})

async function loadAllUsers(){
    users.value = (await userService.getAll()).data;
}

function editUser(user){
    selectedUser.value = {...user}
    showEditModal.value = true
}

async function deleteUser(userId){
    try{
        await userService.delete(userId)
        toast.success('Utilizador eliminado com sucesso.')        
    }
    catch(err){
        toast.error(`Erro ao eliminar utilizador: ${err.message}`)
    }

    try{
        users.value = (await userService.getAll()).data
    }
    catch(err){
        toast.error(`Erro ao carregar utilizadores: ${err.message}`)
    }
}

async function markUserAsAdmin(userId, userIsAdmin){
    try{
        await userService.changeIsAdmin(userId, { isAdmin: !userIsAdmin });        
        toast.success('Permissões alteradas com sucesso.')
        users.value = (await userService.getAll()).data
    }
    catch(err){
        toast.error('Erro ao alterar as permissões.')
    }

}
</script>

