import { useMutation, useQueryClient } from "react-query";
import InputeTipoFundo from "../componentes/InputeTipoFundo";
import InputeTitulo from "../componentes/InputeTitulo";
import { observer } from "mobx-react";
import AppState from "../AppState";
import InputTexto from "../componentes/InputTexto";
import { MutableRefObject, useRef, useState } from "react";
import InputFormato from "../componentes/InputFormato";
import InputEstilo from "../componentes/InputEstilo";
import { lerTemplate } from "../perfilEstilo";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import useApi from "../server/api";
import useMe, { ME_KEY } from "../hooks/useMe";

const Appearance = observer(() => {
  const { editProfile } = useApi();

  const client = useQueryClient();
  const { data: me } = useMe();

  // remonta o formulário depois de salvar, para limpar os campos digitados
  const [formKey, setFormKey] = useState(0);
  const { mutate: mutateChangeProfile } = useMutation((data: any) => editProfile(data), {
    onSuccess: async () => {
      await client.invalidateQueries(ME_KEY);
      AppState.incrementCounter("");
      AppState.incrementDescricao("");
      AppState.incrementFormato("");
      AppState.incrementcorFundo("");
      AppState.incrementFonte("");
      AppState.incrementBotao("");
      setFormKey((k) => k + 1);
    },
  });

  const atual = lerTemplate(me?.template);

  const formRef = useRef() as MutableRefObject<FormHandles>;
  const handleFormSubmit = async (data: any) => {
    // campo que o usuário não mexeu mantém o valor salvo (antes sobrescrevia com vazio)
    let text = {
      template: JSON.stringify({
        cor: AppState.corFundo || data.cor || atual.cor || "",
        formato: AppState.formato || data.formato || atual.formato || "",
        fonte: AppState.fonte || atual.fonte,
        botao: AppState.botao || atual.botao,
      }),
      title: data.title || me?.title,
      about: data.about || me?.about,
    };

    if (text) {
      mutateChangeProfile(text);
    }
  };
  return (
    <div className="flex flex-col min-h-[560px]">
      <Form key={formKey} ref={formRef} onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Aparência</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Personalize o tema, o fundo, a fonte, o título e o estilo dos botões da sua página.
        </p>

        <div className="mt-6 flex flex-col gap-6">
          <InputEstilo fonteSalva={atual.fonte} botaoSalvo={atual.botao} />

          <div>
            <InputeTipoFundo estado={AppState.corFundo} name="cor" cor={atual.cor ?? ""} />
          </div>

          <div>
            <InputeTitulo name="title" tituloUser={me?.title as string} />
          </div>

          <div>
            <InputTexto name="about" />
          </div>

          <div>
            <InputFormato name="formato"></InputFormato>
          </div>

          <div className="w-full flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="submit"
              className="h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
});

export default Appearance;
