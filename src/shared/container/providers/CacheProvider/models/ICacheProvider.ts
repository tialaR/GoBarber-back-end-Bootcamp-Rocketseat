export default interface ICacheProvider {
  //Salvar no cache
  save(key: string, value: any): Promise<void>;
  //Buscar do cache
  recover<T>(key: string): Promise<T | null>;
  //Invalidar (deletar) no cache
  invalidate(key: string): Promise<void>;
  //Invalidar (deletar) todo o cache que começa com algum tipo de texto:
  invalidatePrefix(prefix: string): Promise<void>;
}
