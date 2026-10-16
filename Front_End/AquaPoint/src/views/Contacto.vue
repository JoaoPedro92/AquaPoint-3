<template>
  <section class="main-container">
    <div class="container">

      <!-- Título -->
      <div class="text-center mb-5">
        <h1 class="page-title">Contato</h1>
        <p class="subtitle">
          Estamos disponíveis para esclarecer dúvidas, receber sugestões e ajudar na gestão dos bebedouros.
        </p>
      </div>

      <div class="row">

        <!-- contt -->
        <div class="col-lg-6 mb-4">
          <div class="info-card">
            <h3 class="main-titles">CONTACTOS</h3>

            <div class="contact-item">
              <strong>Morada</strong>
              <p>Rua Umdois, 2222-222 Lisboa</p>
            </div>

            <div class="contact-item">
              <strong>Telemóvel</strong>
              <p>+351 900 000 000</p>
            </div>

            <div class="contact-item">
              <strong>Email</strong>
              <p>contacto@aquapoint.pt</p>
            </div>
          </div>
        </div>

        <!-- FORMULÁRIO -->
        <div class="col-lg-6 mb-4">
          <div class="form-card">
            <h3 class="main-titles">FORMULÁRIO</h3>

            <form @submit.prevent="SubmitContactForm">
                <div class="row">

                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Nome</label>
                        <input
                        id="name"
                        name="name"
                        v-model="nameValue"
                        type="text"
                        class="form-control contact-form"
                        placeholder="O seu nome"
                        required
                        >
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Telemóvel</label>
                        <input
                        id="phone"
                        name="phone"
                        v-model="phoneValue"
                        type="tel"
                        class="form-control contact-form"
                        placeholder="O seu telemóvel"
                        required
                        >
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input
                        id="email"
                        name="email"
                        v-model="emailValue"
                        type="email"
                        class="form-control contact-form"
                        placeholder="O seu email"
                        required
                        >
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="localization" class="form-label">Localidade</label>
                        <input
                        id="localization"
                        name="localization"
                        v-model="localizationValue"
                        type="text"
                        class="form-control contact-form"
                        placeholder="A sua localidade"
                        required
                        >
                    </div>

                    <div class="col-md-12 mb-3">
                        <label for="message" class="form-label">Mensagem</label>
                        <textarea
                        id="message"
                        name="message"
                        v-model="messageValue"
                        class="form-control contact-form"
                        rows="5"
                        placeholder="Descreva a sua dúvida ou necessidade"
                        required 
                        style ="resize: none; width: 97% !important; height: 10vh !important;"
                        ></textarea>
                    </div>

                    <!-- Botão Enviar -->
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-form w-100">
                          Enviar mensagem
                        </button>
                    </div>

                </div>
            </form>
          </div>
        </div>
      </div>

      <!-- mp -->
      <div class="mt-5">
        <h3 class="main-titles text-center">Localização</h3>

        <div class="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.2102738604317!2d-9.105085123639652!3d38.78181365351522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1934838cfa1033%3A0x36de966c91888246!2sIADE!5e0!3m2!1spt-PT!2spt!4v1772317445933!5m2!1spt-PT!2spt"
            width="100%"
            height="450"
            style="border:0;"
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const nameValue = ref('')
const phoneValue = ref('')
const emailValue = ref('')
const localizationValue = ref('')
const messageValue = ref('')

function SubmitContactForm() {
  console.log(`
    Nome: ${nameValue.value}
    Telemóvel: ${phoneValue.value}
    Email: ${emailValue.value}
    Localidade: ${localizationValue.value}
    Mensagem: ${messageValue.value}
  `)

  nameValue.value = ''
  phoneValue.value = ''
  emailValue.value = ''
  localizationValue.value = ''
  messageValue.value = ''
}
</script>

<style scoped>
.main-container {
  padding: 60px 0;
  background: #f8fafc;
  min-height: 100vh;
}

.page-title {
  font-size: 42px;
  font-weight: bold;
  color: var(--aquapoint-logo-blue);
}

.subtitle {
  color: #6b7280;
  max-width: 700px;
  margin: auto;
}

.info-card,
.form-card {
  background: white;
  border-radius: 18px;
  padding: 35px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: 0.3s;
}

.info-card:hover,
.form-card:hover {
  transform: translateY(-5px);
}

.main-titles {
  color: var(--aquapoint-logo-blue);
  font-weight: bold;
  margin-bottom: 25px;
}

.contact-item {
  margin-bottom: 25px;
}

.contact-item p {
  margin-top: 8px;
  color: #4b5563;
}

.contact-form {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 12px 15px;
  margin-bottom: 15px;
  transition: 0.3s;
}

.contact-form:focus {
  border-color: var(--aquapoint-logo-blue);
  box-shadow: 0 0 0 0.2rem rgba(99, 125, 164, 0.2);
}

.btn-form {
  margin-top: 10px;
  height: 48px;
  border-radius: 10px;
  font-weight: 600;
  background-color: var(--aquapoint-logo-blue);
  color: white;
  border: none;
  transition: 0.3s;
}

.btn-form:hover {
  background-color: #637da4;
  transform: translateY(-2px);
}

.map-wrapper {
  margin-top: 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
</style>
