<template>
  <div>

    <!-- <h1>Home</h1> -->

    <section id="carousel-main" class="m-0 p-0">
      <div id="carouselExampleCaptions" class="carousel slide">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/src/assets/images/home-page/bebed_principal_img.png" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
              <h5>AquaPoint</h5>
              <p>Consulte bebedouros em tempo real.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img src="/src/assets/images/defaultPointImage.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
              <h5>AquaPoint</h5>
              <p>Avalie e comente sobre os bebedouros.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img src="/src/assets/images/home-page/bebed_3.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
              <h5>AquaPoint</h5>
              <p>Descubra novos bebedouros na sua área.</p>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <!-- Secção O que é Aquapoint -->

      <section class="py-5 bg-light">
        <div class="container text-center">

          <h2 class="mb-4">O que é a Aquapoint?</h2>

          <p class="mx-auto" style="max-width: 700px;">
            A <strong>AquaPoint</strong> é uma plataforma web que permite 
            aos utilizadores localizar bebedouros públicos próximos através 
            de um mapa interativo, visualizar informações sobre o seu estado 
            e contribuir com avaliações e feedback
          </p>

          <router-link to="./sobre-nos" class="btn btn-primary mt-3">
            Saber mais
          </router-link>

        </div>
      </section>

      <!-- Secção O que é Aquapoint fim -->


      <!-- Secção Funcionalidades -->

      <section class="py-5">
        <div class="container text-center">

          <h2 class="mb-5">Funcionalidades</h2>

          <div class="row">

            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body">
                  <h2 class="card-emoji">🔍</h2>
                  <h4 class="card-title">Monitorização</h4>
                  <p class="card-text">
                    Com o AquaPoint, acompanhe e contribua para uma gestão mais eficiente dos bebedouros 
                    da sua cidade, ajudando a reduzir o tempo de procura por água potável e a facilitar 
                    o acesso a pontos de hidratação..
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body">

                  <h2 class="card-emoji">📈</h2>
                  <h4 class="card-title">Estatísticas</h4>

                  <p class="card-text">
                    Visualize relatórios claros e gráficos que ajudam a identificar
                    a disponibilidade e o estado dos teus bebedouros favoritos.
                  </p>

                  <!-- CAIXA DENTRO -->
                  <div class="mini-stats mt-3">
                      <div v-html="bestAquaPointDiv"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body">
                  <h2 class="card-emoji">⚠️</h2>
                  <h4 class="card-title">Alertas</h4>
                  <p class="card-text">
                    Receba alerta quando houver um bebedouro fora do anormal
                    ou fora de uso.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- Secção Funcionalidades fim -->

      <!-- Secção Estatísticas -->

      <section class="py-5 bg-light">
        <div class="container text-center">

          <div class="row">

            <div class="col-md-4">
              <h2 class="stat-number">{{ usersCount }}+</h2>
              <p class="stat-text">Utilizadores Registados</p>
            </div>

            <div class="col-md-4">
              <h2 class="stat-number">{{ aquapointsCount }}+</h2>
              <p class="stat-text">Bebedouros Disponiveis</p>
            </div>

            <div class="col-md-4">
              <h2 class="stat-number">{{ localizationsCount }}+</h2>
              <p class="stat-text">Localizações</p>
            </div>

          </div>

        </div>
      </section>

      <!-- Secção Estatísticas fim -->


    </section>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { userService } from '../services/userService'
  import { aquapointService } from '../services/aquapointService'
  import { localsService } from '../services/localsService'

  const usersCount = ref(null)
  const aquapointsCount = ref(null)
  const localizationsCount = ref(null)
  const bestAquaPointDiv = ref(null)

  onMounted(async () => {
    try {
      const users = await userService.getAll()
      const aquapoints = await aquapointService.getAll()
      const localizations = await localsService.getAll()

      usersCount.value = users?.data?.length || 0
      aquapointsCount.value = aquapoints?.data?.length || 0
      localizationsCount.value = localizations?.data?.length || 0

      GetBestAquaPoint(aquapoints?.data)
    } catch (err) {
      console.error('Erro a carregar estatísticas:', err)
    }
  })

  function GetBestAquaPoint(aquapoints) {
    let bestRating = 0

    if (!aquapoints || aquapoints.length === 0) {
      return null
    }

    for (let index = 0; index < aquapoints.length; index++) {
      const element = aquapoints[index];
      
      if (element.ratingAVG > bestRating) {
        bestRating = element.ratingAVG
        bestAquaPointDiv.value = '<p> Melhor e mais avaliado</p><strong>' + element.point_name + '</strong><p> ⭐ ' + element.ratingsAmount + ' avaliações</p>'
      }
    }
  }
</script>


<style scoped>

.btn-primary {
  background-color: var(--aquapoint-logo-blue);
  border-color: var(--aquapoint-logo-blue);
}

.btn-primary:hover {
  background-color: #637da4;
  border-color: #637da4;
}

.card {
  border: none;
  border-radius: 12px;
  padding: 20px;

  background: linear-gradient(
    135deg,
    var(--aquapoint-logo-blue),
    #637da4
  );

  background-image: linear-gradient(
      135deg,
      var(--aquapoint-logo-blue),
      #637da4
    ),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.05) 0,
      rgba(255, 255, 255, 0.05) 2px,
      transparent 2px,
      transparent 6px
    );

  color: white;
  transition: 0.3s;
}

  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }

  .card-text {
    text-align: justify;
  }

  .card-title{
    margin-bottom: 30px;
    text-align: left;
  }

  .card-emoji{
    text-align: left;
    margin-bottom: 40px;
  }
  .card-emoji:hover {
    transform: translateY(-8px);
  }

  .mini-stats {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 10px;
    font-size: 13px;
    margin-top: 15px;
  }

  .mini-stats p {
    margin: 0;
  }

  .mini-stats strong {
    display: block;
    font-size: 14px;
    margin-top: 10PX;
    margin-bottom: 10PX;
  }


  .stat-number {
    font-size: 48px;
    font-weight: bold;
    color: var(--aquapoint-logo-blue);
    /** color: #0d6efd;   */
    margin-bottom: 10px;
  }

  .stat-text {
    /** color: #6b7280; */
    font-size: 16px;
  }

  
  
</style>