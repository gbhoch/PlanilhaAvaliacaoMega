import { ItemAvaliacaoInterface } from "./item-avaliacao.interface";

export interface SensoInterface {
  id : number,
  descricao?: string;
  nome : string,
  ativo: boolean;
  dataDeCriacao?: string;
  dataDeModificacao?: string;
  itens?: ItemAvaliacaoInterface[] ;  // Perguntas do agrupador
}
