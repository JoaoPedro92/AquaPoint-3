import { ref } from "vue";

export function useFormValidation(){
    const errors = ref({})

    function validate(fields){

        Object.entries(fields).forEach(([key, value]) => {
            if(!value || value.toString().trim() === ''){
                errors.value[key] = 'O campo é obrigatório'
            }
        })

        return Object.keys(errors.value).length === 0
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!email || email.trim() === ''){
            return 'O email é obrigatório'
        }

        if(!regex.test(email)) {
            return 'O email não é válido'
        }

        return null
    }

    function validatePassword(password){
        if(!password) return 'A password é obrigatória'
        if(password.length < 6) return 'A password deve ter pelo o menos 6 caracteres.'
        if(!/[A-Z]/.test(password)) return 'A password deve ter pelo menos uma maiúscula.'
        if(!/[0-9]/.test(password)) return 'A password deve ter pelo menos um número.'
        if(!/[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/.test(password)) return 'A password deve ter pelo menos um carácter especial.'

        return null
    }

    function clearErrors(){
        errors.value = {}
    }

    return { errors, validate, validateEmail, clearErrors }
}