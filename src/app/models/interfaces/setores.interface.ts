import { SensoInterface } from "./senso.interface";

export interface SetorInterface{
  id : number,
  nome : string
  ativo: boolean;
  descricao?: string;
  dataDeCriacao?: string;
  dataDeModificacao?: string;
  itens: { descricao: string }[];
  planoDeAvaliacao: SensoInterface [];
}
