import { observable, action } from "mobx";

// Rascunho da aba Aparência: a prévia reage a isto antes de salvar
const AppState = observable({
  counter: "",
  incrementCounter: action(function (this: any, item: string) {
    this.counter = item;
  }),
  descricao: "",
  incrementDescricao: action(function (this: any, item: string) {
    this.descricao = item;
  }),
  formato: "",
  incrementFormato: action(function (this: any, item: string) {
    this.formato = item;
  }),
  corFundo: "",
  incrementcorFundo: action(function (this: any, item: string) {
    this.corFundo = item;
  }),
  fonte: "",
  incrementFonte: action(function (this: any, item: string) {
    this.fonte = item;
  }),
  botao: "",
  incrementBotao: action(function (this: any, item: string) {
    this.botao = item;
  }),
  // "" = não mexeu (vale o salvo). Em fundoMidia, "remover" apaga o fundo salvo.
  texto: "",
  incrementTexto: action(function (this: any, item: string) {
    this.texto = item;
  }),
  fundoMidia: "",
  incrementFundoMidia: action(function (this: any, item: string) {
    this.fundoMidia = item;
  }),
  // "" = não mexeu, "sim" = mostrar, "nao" = esconder
  marca: "",
  incrementMarca: action(function (this: any, item: string) {
    this.marca = item;
  }),
});

export default AppState;
