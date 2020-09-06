import ICacheProvider from '../models/ICacheProvider';

//Simulando estrutura do Redis:
interface ICacheData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {

  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void>{
    //Salvando informação dentro do fake redis:
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null>{
    //Buscando informação dentro do fake redis:
    const data = this.cache[key];

    if(!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  //Deletando objeto do redis fake:
  public async invalidate(key: string): Promise<void>{
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void>{
    //Buscando todos os caches que iniciam com o prefixo passado:
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`)
    );

    //Deletando todos os caches que iniciam com o prefixo passado:
    keys.forEach(key => {
      delete this.cache[key]
    });
  }

}
