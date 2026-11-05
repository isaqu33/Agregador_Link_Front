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
    formato:"",
    incrementFormato: action(function(this: any, item: string){
        this.formato = item;
    }),
    corFundo:"",
    incrementcorFundo: action(function(this: any, item: string){
        this.corFundo = item;
    }),
    fonte: "",
    incrementFonte: action(function (this: any, item: string) {
        this.fonte = item;
    }),
    botao: "",
    incrementBotao: action(function (this: any, item: string) {
        this.botao = item;
    })
});

export default AppState;
