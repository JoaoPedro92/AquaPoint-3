<template>
    <div v-if="loading" class="text-center mt-5">
        <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="dashboard-root">

        <div class="dash-header">
            <br>
            <h1 class="dash-title">Dashboard Geral</h1>
            <p class="dash-subtitle">Visão geral da rede</p>
        </div>

        <div class="row g-4 mb-4">

            <div class="col-md-4">
                <div class="dash-card h-100">
                    <div class="card-icon-row">
                        <div class="card-icon icon-blue">
                            <i class="bi bi-people"></i>
                        </div>
                        <span class="card-label">Utilizadores</span>
                    </div>
                    <div class="card-number">{{ totalUsers }}</div>
                    <p class="card-desc">Registados na plataforma</p>
                    <router-link to="/admin/dashboard-users" class="dash-btn mt-auto">
                        Gerir <i class="bi bi-arrow-right"></i>
                    </router-link>
                </div>
            </div>

            <div class="col-md-4">
                <div class="dash-card h-100">
                    <div class="card-icon-row">
                        <div class="card-icon icon-blue">
                            <i class="bi bi-droplet"></i>
                        </div>
                        <span class="card-label">Bebedouros</span>
                    </div>
                    <div class="card-number">{{ totalFountains }}</div>
                    <p class="card-desc">Registados na plataforma</p>
                    <router-link to="/admin/dashboard-bebedouros" class="dash-btn mt-auto">
                        Gerir <i class="bi bi-arrow-right"></i>
                    </router-link>
                </div>
            </div>

            <div class="col-md-4">
                <div class="dash-card h-100">
                    <div class="chart-section-title mb-3">
                        <span class="dot dot-blue"></span>
                        <strong>Estado dos bebedouros</strong>
                    </div>
                    <div class="d-flex align-items-center gap-4">
                        <div class="donut-wrap flex-shrink-0">
                            <canvas id="statusChart"></canvas>
                            <div class="donut-center">
                                <span class="donut-total">{{ totalFountains }}</span>
                                <span class="donut-label">TOTAL</span>
                            </div>
                        </div>
                        <div class="legend-list flex-grow-1">
                            <div class="legend-item">
                                <span class="dot dot-green"></span>
                                <span class="legend-name">Ativos</span>
                                <span class="legend-count">{{ active }}</span>
                                <span class="legend-pct">{{ calculatePercentage(active) }}%</span>
                            </div>
                            <div class="legend-item">
                                <span class="dot dot-red"></span>
                                <span class="legend-name">Inativos</span>
                                <span class="legend-count">{{ inactive }}</span>
                                <span class="legend-pct">{{ calculatePercentage(inactive) }}%</span>
                            </div>
                            <div class="legend-item">
                                <span class="dot dot-yellow"></span>
                                <span class="legend-name">Avariados</span>
                                <span class="legend-count">{{ maintenance }}</span>
                                <span class="legend-pct">{{ calculatePercentage(maintenance) }}%</span>
                            </div>
                            <div class="legend-item">
                                <span class="dot dot-orange"></span>
                                <span class="legend-name">Pendentes</span>
                                <span class="legend-count">{{ pending }}</span>
                                <span class="legend-pct">{{ calculatePercentage(pending) }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-12">
                <div class="dash-card">
                    <div class="chart-header">
                        <div>
                            <div class="chart-section-title mb-1">
                                <span class="dot dot-blue"></span>
                                <strong>Bebedouros por cidade</strong>
                            </div>
                            <p class="chart-meta">{{ cityLabels.length }} cidades · {{ totalFountains }} bebedouros</p>
                            <div class="chart-legend-inline">
                                <span class="dot dot-green"></span><span>Ativos · {{ active }}</span>
                                <span class="dot dot-red ms-3"></span><span>Inativos · {{ inactive }}</span>
                            </div>
                        </div>
                        <div class="filter-tabs">
                            <button v-for="tab in cityTabs" :key="tab.value"
                                :class="['filter-tab', { active: cityFilter === tab.value }]"
                                @click="onCityFilterChange(tab.value)">{{ tab.label }}</button>
                        </div>
                    </div>
                    <canvas id="cityChart" style="max-height: 450px;"></canvas>
                </div>
            </div>
        </div>

        <div class="row g-4 mb-4">

            <div class="col-md-4">
                <div class="dash-card text-center">
                    <div class="chart-section-title mb-1">
                        <span class="dot dot-green"></span>
                        <strong>Bebedouro maior rating</strong>
                    </div>
                    <div class="fountain-img-wrap mt-3 mb-3">
                        <div v-if="bestFountain.city" class="fountain-city-badge">
                            <i class="bi bi-geo-alt-fill"></i> {{ bestFountain.city }}
                        </div>
                        <img v-if="bestFountain.image" :src="bestFountain.image" class="fountain-img" alt="Bebedouro" />
                        <div v-else class="fountain-img-placeholder">
                            <i class="bi bi-image"></i>
                            <span>SEM IMAGEM</span>
                        </div>
                    </div>
                    <p class="fw-bold mb-1 fs-5">{{ bestFountain.name }}</p>
                    <p class="mb-1"><span class="star-icon">★</span> <strong>{{ bestFountain.rating }}</strong> / 5</p>
                    <small class="text-muted d-block mb-3">
                        {{ bestFountain.reviews ?? 0 }} {{ bestFountain.reviews === 1 ? 'review' : 'reviews' }}
                    </small>
                    <span class="badge-custom badge-success d-block mb-3">🏆 Melhor avaliado</span>
                </div>
            </div>

            <div class="col-md-4">
                <div class="dash-card text-center">
                    <div class="chart-section-title mb-1">
                        <span class="dot dot-red"></span>
                        <strong>Bebedouro menor rating</strong>
                    </div>
                    <div class="fountain-img-wrap mt-3 mb-3">
                        <div v-if="worstFountain.city" class="fountain-city-badge">
                            <i class="bi bi-geo-alt-fill"></i> {{ worstFountain.city }}
                        </div>
                        <img v-if="worstFountain.image" :src="worstFountain.image" class="fountain-img"
                            alt="Bebedouro" />
                        <div v-else class="fountain-img-placeholder">
                            <i class="bi bi-image"></i>
                            <span>SEM IMAGEM</span>
                        </div>
                    </div>
                    <p class="fw-bold mb-1 fs-5">{{ worstFountain.name }}</p>
                    <p class="mb-1"><span class="star-icon">★</span> <strong>{{ worstFountain.rating }}</strong> / 5</p>
                    <small class="text-muted d-block mb-3">
                        {{ worstFountain.reviews ?? 0 }} {{ worstFountain.reviews === 1 ? 'review' : 'reviews' }}
                    </small>
                    <span class="badge-custom badge-warning d-block mb-3">⚠ Precisa de atenção</span>
                </div>
            </div>

            <div class="col-md-4">
                <div class="dash-card">
                    <div class="chart-section-title mb-1">
                        <span class="dot dot-blue"></span>
                        <strong>Top 5 bebedouros</strong>
                    </div>
                    <p class="chart-meta mb-3">Baseado em reviews e rating</p>
                    <div v-for="(item, index) in topFountains" :key="item.id" class="top5-row">
                        <span :class="['top5-rank', `rank-${index + 1}`]">{{ index + 1 }}</span>
                        <div class="top5-info">
                            <span class="top5-name">{{ item.name }}</span>
                            <span class="top5-city"><i class="bi bi-geo-alt"></i> {{ item.city }}</span>
                            <div class="top5-bar-wrap">
                                <div class="top5-bar"
                                    :style="{ width: (item.rating / 5 * 100) + '%', background: rankColor(index) }">
                                </div>
                            </div>
                        </div>
                        <div class="top5-score">
                            <span class="star-icon">★</span> {{ item.rating }}
                            <span class="top5-reviews">{{ item.reviews }} reviews</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-12">
                <div class="dash-card">
                    <div class="chart-header">
                        <div class="chart-section-title">
                            <span class="dot dot-blue"></span>
                            <strong>Top 5 utilizadores</strong>
                        </div>
                        <div class="filter-tabs">
                            <button v-for="tab in userTabs" :key="tab.value"
                                :class="['filter-tab', { active: userFilter === tab.value }]"
                                @click="onUserFilterChange(tab.value)">{{ tab.label }}</button>
                        </div>
                    </div>
                    <div v-if="topUsers.length === 0" class="text-muted small">Sem dados disponíveis.</div>
                    <div v-for="(user, index) in topUsers" :key="user.id" class="user-row">
                        <span class="rank-badge">{{ index + 1 }}</span>
                        <img v-if="user.avatar" :src="user.avatar" class="user-avatar-img" :alt="user.name" />
                        <div v-else class="user-avatar" :style="{ background: user.color }">{{ user.initials }}</div>
                        <div class="user-info">
                            <span class="user-name">{{ user.name }}</span>
                        </div>
                        <div class="user-stat">
                            <i :class="userFilter === 'comentarios' ? 'bi bi-chat' : 'bi bi-star'"></i>
                            <span
                                class="user-count">{{ userFilter === 'comentarios' ? user.comments : user.ratings }}</span>
                            <span
                                class="user-stat-label">{{ userFilter === 'comentarios' ? 'coment.' : 'aval.' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { userService } from "../../services/userService.js"
import { aquapointService } from "../../services/aquapointService.js"
import { localsService } from "../../services/localsService.js"
import { reviewsService } from "../../services/reviewsService.js"

import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'

const totalUsers = ref(0)
const totalFountains = ref(0)
const active = ref(0)
const inactive = ref(0)
const maintenance = ref(0)
const pending = ref(0)

const loading = ref(true)

let pieChart = null
let cityChart = null

const points = ref([])
const allUsers = ref([])

const bestFountain = ref({})
const worstFountain = ref({})
const topFountains = ref([])
const topUsers = ref([])

const cityLabels = ref([])
const cityDataActive = ref([])
const cityDataInactive = ref([])

const cityFilter = ref('todos')
const cityTabs = [
    { label: 'Todos', value: 'todos' },
    { label: 'Ativos', value: 'ativos' },
    { label: 'Inativos', value: 'inativos' },
]

const userFilter = ref('comentarios')
const userTabs = [
    { label: 'Comentários', value: 'comentarios' },
    { label: 'Avaliações', value: 'avaliacoes' },
]

const avatarColors = ['#14b8a6', '#22c55e', '#ef4444', '#a855f7', '#ec4899', '#f97316', '#3b82f6', '#eab308']

onMounted(async () => {
    await Promise.all([
        getAllUsers(),
        getAllAquapoints(),
    ])
    await getTopUsers()
    loading.value = false
    await nextTick()
    createPieChart()
    createCityChart()
})

async function getAllUsers() {
    try {
        const response = await userService.getAll()
        allUsers.value = response.data
        totalUsers.value = response.data.length
    } catch (error) {
        console.error("Erro ao buscar utilizadores", error)
    }
}

async function getAllAquapoints() {
    try {
        const response = await aquapointService.getAll()
        points.value = response.data

        active.value = points.value.filter(p => p.state_id === 2 && p.isPending !== 1).length
        inactive.value = points.value.filter(p => p.state_id === 3 && p.isPending !== 1).length
        maintenance.value = points.value.filter(p => p.state_id === 1 && p.isPending !== 1).length
        pending.value = points.value.filter(p => p.isPending === 1).length
        totalFountains.value = points.value.filter(p => p.isPending === 0).length

        await buildCityData()
        ratingFountains()
    } catch (error) {
        console.error("Erro ao buscar aquapoints:", error)
    }
}

async function buildCityData() {
    try {
        const localsRes = await localsService.getAll()
        const locals = localsRes.data

        const cities = {}

        points.value.forEach(point => {
            const local = locals.find(l => Number(l.id) === Number(point.local_id))
            if (!local) {
                return
            }

            if (point.isPending === 1) {
                return
            }

            const cityName = local.zone_name
            if (!cities[cityName]) {
                cities[cityName] = { active: 0, inactive: 0 }
            }

            if (point.state_id === 2) {
                cities[cityName].active++
            } else {
                cities[cityName].inactive++
            }
        })

        cityLabels.value = Object.keys(cities)
        cityDataActive.value = cityLabels.value.map(c => cities[c].active)
        cityDataInactive.value = cityLabels.value.map(c => cities[c].inactive)
    } catch (error) {
        console.error("Erro ao construir dados das cidades:", error)
    }
}

async function getTopUsers() {
    try {
        const reviewsRes = await reviewsService.getAll()
        const reviews = reviewsRes.data

        const statsMap = {}
        reviews.forEach(review => {
            const uid = review.user_id
            if (!statsMap[uid]) {
                statsMap[uid] = { comments: 0, ratings: 0 }
            }
            if (review.comment) {
                statsMap[uid].comments++
            }
            if (review.rating) {
                statsMap[uid].ratings++
            }
        })

        topUsers.value = allUsers.value
            .filter(u => statsMap[u.id])
            .map((u, index) => ({
                id: u.id,
                name: u.name,
                initials: u.name.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join(''),
                avatar: u.profilePicture || null,
                color: avatarColors[index % avatarColors.length],
                comments: statsMap[u.id].comments,
                ratings: statsMap[u.id].ratings,
            }))
            .sort((a, b) => b.comments - a.comments)
            .slice(0, 5)
    } catch (error) {
        console.error("Erro ao buscar top 5 utilizadores:", error)
    }
}

function ratingFountains() {
    const validPoints = points.value.filter(p => p.ratingAVG !== null)
    if (validPoints.length === 0) {
        return
    }

    const sorted = [...validPoints].sort((p1, p2) =>
        (p2.ratingAVG - p1.ratingAVG) || (p2.ratingsAmount - p1.ratingsAmount)
    )

    const best = sorted[0]
    bestFountain.value = {
        id: best.id,
        name: best.point_name,
        rating: Number(best.ratingAVG).toFixed(1),
        reviews: best.ratingsAmount,
        city: best.zone_name || null,
        image: best.image || null,
    }

    const worst = sorted[sorted.length - 1]
    worstFountain.value = {
        id: worst.id,
        name: worst.point_name,
        rating: Number(worst.ratingAVG).toFixed(1),
        reviews: worst.ratingsAmount,
        city: worst.zone_name || null,
        image: worst.image || null,
    }

    topFountains.value = sorted.slice(0, 5).map(p => ({
        id: p.id,
        name: p.point_name,
        rating: Number(p.ratingAVG).toFixed(1),
        reviews: p.ratingsAmount ?? 0,
        city: p.zone_name || null,
    }))
}

function createPieChart() {
    if (pieChart) {
        pieChart.destroy()
    }

    pieChart = new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
            labels: ['Ativos', 'Inativos', 'Avariados', 'Pendentes'],
            datasets: [{
                data: [active.value, inactive.value, maintenance.value, pending.value],
                backgroundColor: ['#22c55e', '#ef4444', '#eab308', '#f97316'],
                borderWidth: 0,
                hoverOffset: 6,
            }]
        },
        options: {
            cutout: '72%',
            plugins: { legend: { display: false } },
        }
    })
}

function createCityChart() {
    if (cityChart) {
        cityChart.destroy()
    }

    const datasets = []

    if (cityFilter.value !== 'inativos') {
        datasets.push({
            label: 'Ativos',
            data: cityDataActive.value,
            backgroundColor: '#22c55e',
            borderRadius: 4,
            barPercentage: 0.45,
        })
    }
    if (cityFilter.value !== 'ativos') {
        datasets.push({
            label: 'Inativos',
            data: cityDataInactive.value,
            backgroundColor: '#ef4444',
            borderRadius: 4,
            barPercentage: 0.45,
        })
    }

    cityChart = new Chart(document.getElementById('cityChart'), {
        type: 'bar',
        data: { labels: cityLabels.value, datasets },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        stepSize: 1,
                        callback: value => Number.isInteger(value) ? value : null
                    },
                    border: { display: false },
                    title: {
                        display: true,
                        text: 'Nº de Bebedouros',
                        color: '#94a3b8',
                        font: { size: 12 }
                    }
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    title: {
                        display: true,
                        text: 'Cidades',
                        color: '#94a3b8',
                        font: { size: 12 }
                    }
                }
            }
        }
    })
}

function onCityFilterChange(val) {
    cityFilter.value = val
    createCityChart()
}

function onUserFilterChange(val) {
    userFilter.value = val
    topUsers.value = [...topUsers.value].sort((a, b) =>
        val === 'comentarios' ? b.comments - a.comments : b.ratings - a.ratings
    )
}

function calculatePercentage(val) {
    if (!totalFountains.value) {
        return 0
    }
    return Math.round((val / totalFountains.value) * 100)
}

function rankColor(index) {
    return ['#f59e0b', '#94a3b8', '#f97316', '#3b82f6', '#14b8a6'][index] || '#94a3b8'
}
</script>

<style scoped>
.dashboard-root {
    background: #f1f5f9;
    min-height: 100vh;
    padding: 0 2rem 2rem 2rem;
}

.dash-header {
    margin-bottom: 1.75rem;
}

.dash-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
}

.dash-subtitle {
    font-size: 0.875rem;
    color: #94a3b8;
    margin: 0.2rem 0 0;
}

.dash-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    height: 100%;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
}

.card-icon-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.icon-blue {
    background: #e0f2fe;
    color: #0ea5e9;
}

.card-label {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
}

.card-number {
    font-size: 3rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
    margin-bottom: 0.2rem;
}

.card-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-bottom: 1rem;
}

.dash-btn {
    display: block;
    width: 100%;
    padding: 0.7rem;
    background: #4DA6AC;
    color: #fff;
    border-radius: 10px;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: opacity 0.2s;
}

.dash-btn:hover {
    background: #4DA6AC;
    color: #fff;
    opacity: 0.85;
}

.chart-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
}

.donut-wrap {
    position: relative;
    width: 130px;
    height: 130px;
    flex-shrink: 0;
}

.donut-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
}

.donut-total {
    display: block;
    font-size: 1.6rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
}

.donut-label {
    font-size: 0.65rem;
    color: #94a3b8;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.legend-list {
    margin-top: 0.5rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    color: #374151;
}

.legend-item:last-child {
    border-bottom: none;
}

.legend-name {
    flex: 1;
}

.legend-count {
    font-weight: 700;
    color: #0f172a;
    min-width: 28px;
    text-align: right;
}

.legend-pct {
    color: #94a3b8;
    font-size: 0.78rem;
    min-width: 36px;
    text-align: right;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.dot-blue {
    background: #0ea5e9;
}

.dot-green {
    background: #22c55e;
}

.dot-red {
    background: #ef4444;
}

.dot-yellow {
    background: #eab308;
}

.dot-orange {
    background: #f97316;
}

.chart-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.25rem;
}

.chart-meta {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 0.1rem 0 0.5rem;
}

.chart-legend-inline {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #374151;
}

.filter-tabs {
    display: flex;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
}

.filter-tab {
    padding: 0.4rem 0.9rem;
    font-size: 0.82rem;
    font-weight: 500;
    border: none;
    background: #fff;
    color: #64748b;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.filter-tab:not(:last-child) {
    border-right: 1px solid #e2e8f0;
}

.filter-tab.active {
    background: #f8fafc;
    color: #0f172a;
    font-weight: 700;
}

.fountain-img-wrap {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    height: 180px;
    background: #f1f5f9;
}

.fountain-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.fountain-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    gap: 0.5rem;
    font-size: 0.8rem;
}

.fountain-img-placeholder i {
    font-size: 2rem;
}

.fountain-city-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    background: rgba(15, 23, 42, 0.75);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    border-radius: 20px;
    backdrop-filter: blur(4px);
}

.badge-custom {
    display: block;
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
}

.badge-success {
    background: #dcfce7;
    color: #16a34a;
}

.badge-warning {
    background: #fef9c3;
    color: #b45309;
}

.star-icon {
    color: #f59e0b;
}

.top5-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.top5-row:last-child {
    border-bottom: none;
}

.top5-rank {
    font-size: 1.4rem;
    font-weight: 900;
    min-width: 28px;
    text-align: center;
    flex-shrink: 0;
}

.rank-1 {
    color: #f59e0b;
}

.rank-2 {
    color: #94a3b8;
}

.rank-3 {
    color: #f97316;
}

.rank-4 {
    color: #3b82f6;
}

.rank-5 {
    color: #14b8a6;
}

.top5-info {
    flex: 1;
}

.top5-name {
    display: block;
    font-weight: 600;
    font-size: 0.88rem;
    color: #0f172a;
}

.top5-city {
    display: block;
    font-size: 0.75rem;
    color: #94a3b8;
    margin-bottom: 0.3rem;
}

.top5-bar-wrap {
    height: 4px;
    background: #f1f5f9;
    border-radius: 99px;
    width: 100%;
}

.top5-bar {
    height: 4px;
    border-radius: 99px;
    transition: width 0.4s ease;
}

.top5-score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: 700;
    font-size: 0.88rem;
    color: #0f172a;
    flex-shrink: 0;
}

.top5-reviews {
    font-size: 0.72rem;
    font-weight: 400;
    color: #94a3b8;
}

.rank-badge {
    min-width: 26px;
    height: 26px;
    border-radius: 7px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.user-row:last-child {
    border-bottom: none;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.user-avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
}

.user-name {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    color: #0f172a;
}

.user-stat {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: #0ea5e9;
    font-size: 0.88rem;
}

.user-count {
    font-weight: 700;
    color: #0f172a;
}

.user-stat-label {
    color: #94a3b8;
    font-size: 0.78rem;
}
</style>