import { Head } from "$fresh/runtime.ts";


interface Props {
  /**
   * @title Cor
   * @format color
   * @default #be1a1a
   * */
  color?: string;
}

export default function ThemeColorSection({ color = "#be1a1a" }: Props) {
  return (
    <Head>
      <meta name="theme-color" content={color} />
    </Head>
  );
}