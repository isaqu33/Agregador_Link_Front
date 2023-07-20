import { observable, action } from "mobx";

const AppState = observable({
    counter: "",
    incrementCounter: action(function (item: string) {
        console.log(item);
        this.counter = item;
    }),
    descricao: "",
    incrementDescricao: action(function (item: string) {
        console.log(item);
        this.descricao = item;
    }),
    formato:"",
    incrementFormato: action(function(item: string){
        console.log(item);
        this.formato = item;
    }),
    corFundo:"",
    incrementcorFundo: action(function(item: string){
        console.log(item);
        this.corFundo = item;
    })
});

export default AppState;