<template>
    <footer class="footer">
      
    <div class="container">
      <div class="footer-content">

        <div class="footer-right">
          <h4>Aquapoint</h4>
          <p>A procura de água tornou se mais facíl do que nunca</p>

          <h4>Links</h4>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/">Sobre</a></li>
            <li><a href="/">Mapa</a></li>
            <li><a href="/">Contactos</a></li>
          </ul>
        </div>

        <div class="footer-left">
          <h4>Contacto</h4>
          <p>Email: contacto@aquapoint.pt</p>
          <p>Tel: +351 900 000 000</p>
          <p>Lisboa, Portugal</p>

          <h4>Redes Sociais</h4>
          <div class="socials">
            <a href="/">LinkedIn</a>
            <a href="/">Instagram</a>
            <a href="/">Facebook</a>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <p>© 2026 AquaPoint - Todos os direitos reservados</p>
      </div>
    
    </div>
    
  </footer>
</template>

<script>
  export default {
    name: 'Footer'
}
</script>

<style scoped>

.container {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  /*border: solid #29aae1;*/
}

.footer {
  background-color: #0f172a;
  color: white;
  padding: 40px 0;
}

.container {
  width: 90%;
  margin: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer-right,
.footer-left {
  width: 50%;
}

.footer ul {
  list-style: none;
  padding: 0;
}

.footer a {
  color: white;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.socials a {
  margin-right: 10px;
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  border-top: 1px solid #334155;
  padding-top: 15px;
  font-size: 14px;
}

</style>