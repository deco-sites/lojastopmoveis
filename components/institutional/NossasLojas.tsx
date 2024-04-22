/** @titleBy cidade */
export interface Lojas {
    cidade: string;
    cep: string;
    endereco: string;
    telefone: string;
    estado: string;
}

export interface Props {
    lojas: Lojas[];
}

export default function NossasLojas({ lojas }: Props) {
    
    return (
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {lojas.map((loja) => (
            <div class="card card-bordered">
                <div class="card-body">
                    <div class="card-title">
                        {loja.cidade} - {loja.estado}
                    </div>
                    <p>{loja.cep}</p>
                    <p>{loja.endereco}</p>
                    <p>{loja.telefone}</p>
                    <div class="card-actions justify-end">
                        <a class="btn btn-secondary" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${loja.cidade}+${loja.endereco}+${loja.estado}+${loja.cep.replace("-", "")}`}>
                            Veja no mapa
                        </a>
                    </div>
                    
                </div>
            </div>
        ))}
      </div>
)};