import axios from "axios";
import { userKey } from "@/global";

const success = res => res;
const error = err => {
  if (400 === err.response.status) {
    alert("Não foi possível salvar o registro.\nCertifique-se de que não esteja tentando inserir um dado já existente.")
  } else {
    return Promise.reject(err);
  }
  if (403 === err.response.status) {
    localStorage.removeItem(userKey);
    window.location = '/';
    alert("A sessão expirou.\nVocê será redirecionado à tela de login.")
  } else {
    return Promise.reject(err);
  }
};

axios.interceptors.response.use(success, error);
