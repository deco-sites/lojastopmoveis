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
    console.log(lojas)
    return (
      <>
        
      </>
)};