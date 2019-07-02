import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3500,
    position: "top-right",
    theme: "bubble"
})

Vue.toasted.register(
    'defaultSuccess', 
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'defaultError', 
    payload => !payload.msg ? 'Oops... Erro inesperdado.' : payload.msg,
    { type: 'error', icon: 'times' }
)

Vue.toasted.register(
    'defaultConfirm', 
    payload => !payload.msg ? 'Tudo certo! Pode prosseguir.' : payload.msg,
    { type: 'info', icon: 'info' }
)
