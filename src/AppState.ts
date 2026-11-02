import { observable, action } from "mobx";

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
    })
});

export default AppState;