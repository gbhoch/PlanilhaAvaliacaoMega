export interface Agrupadores{
  nomeAgrup : string
  ativo: boolean;
  descricao?: string;
  dataDeCriacao?: string;
  dataDeModificacao?: string;
  itens?: { nome: string }[] ;  // Perguntas do agrupador
}
