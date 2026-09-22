export async function imageUrlToBase64(url){
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

export function GetPointStateStylesFromList(statesList, aquapoint){
    if (!statesList || statesList.length === 0) return { background: '#ccc', color: 'white' }

    // Returning pending point style (background and color)
    /*if (aquapoint?.isPending === 1) {
        return { backgroundColor: '#fef9c3', color: '#854d0e' }
    }*/

    const state = statesList.find(e => e.state_name === aquapoint.state_name)
    return { backgroundColor: state.backgroundColor || '#ccc', color: state.color }
}

export function GetStateStylesFromStateName(statesList, stateName){
    if (!statesList || statesList.length === 0) return { background: '#ccc', color: 'white' }

    const state = statesList.find(e => e.state_name === stateName)
    return { backgroundColor: state.backgroundColor || '#ccc', color: state.color }
}

export function GetPointStateStyles(aquapoint) {
    const styles = {
        'Funcional': { backgroundColor: '#166534', color: '#c1ebbc' },
        'Necessita manutenção': { backgroundColor: '#f97316', color: '#ffff' },
        'Inativo': { backgroundColor: '#b91c1c', color: '#fee2e2' },
        'Pendente': { backgroundColor: '#fef9c3', color: '#854d0e' }
    }

    /*if (aquapoint?.isPending === 1) {
        return styles["Pendente"] || {}
    } */

    return styles[aquapoint?.state_name] || {}
}

export function GetPointStateColor(aquapoint){
    const styles = {
        'Funcional': '#166534',
        'Pendente': '#fef9c3',
        'Necessita manutenção': '#f97316',
        'Inativo': '#b91c1c'
    }

    /*if (aquapoint?.isPending === 1) {
        return styles["Pendente"] || {}
    }*/

    return styles[aquapoint?.state_name] || {}
}

export function GetPointStateIcon(stateName, changeBgColor = false){
    console.log(stateName)
    const icons = {
        'Inativo': 'bi-slash-circle-fill',
        'Necessita manutenção': 'bi-exclamation-triangle-fill text-warning',
        'Funcional': 'bi-check2',
        'Pendente': 'bi-clock-fill'
    }

    const colors = {
        'Inativo': 'text-danger',
        'Funcional': 'text-success',
        'Pendente': 'text-warning'
    }

    /*if (aquapoint?.isPending === 1) {
        return `bi ${icons["Pendente"] || 'bi-question-circle'} ${changeBgColor ? (colors["Pendente"] || '') : ''}`.trim()
    }*/

    const baseIcon = icons[stateName] || 'bi-question-circle'
    const colorClass = changeBgColor ? (colors[stateName] || '') : ''

    return `bi ${baseIcon} ${colorClass}`.trim()
}

export function GetTrustLevelIcon(trust){
    const trustLevel = {
        'Alta': 'bi bi-check-circle-fill text-success',
        'Média': 'bi bi-clock-fill text-warning',
        'Baixa': 'bi bi-slash-circle-fill text-danger',
        'Apagado': 'bi bi-x-octagon'
    }

    return trustLevel[trust] || ''
}

export function GetAquapointGoogleMapsDirections(latitude, longitude){
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`
}

export function OpenGoogleMapsInOtherTabWithDirections(latitude, longitude){
    window.open(GetAquapointGoogleMapsDirections(latitude, longitude), '_blank')
}

export function formatDateExtense(date) {
  return new Date(date).toLocaleDateString('pt-PT', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-PT', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}
