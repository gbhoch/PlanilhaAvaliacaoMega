import { ItemAvaliacaoInterface } from "./item-avaliacao.interface";

export interface SensoInterface {
  id : number,
  nome : string
  ativo: boolean;
  descricao?: string;
  dataDeCriacao?: string;
  dataDeModificacao?: string;
  itens?: ItemAvaliacaoInterface[] ;  // Perguntas do agrupador
}
