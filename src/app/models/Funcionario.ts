export interface Funcionario{
  matricula: number;
  nome: string;
  setor: string;
  turno: string;
  ativo: boolean;
  dataDeCriacao?: string;
  dataDeModificacao?: string;
}
