export interface Props {
  /**
   * @title Copy Right
   * @default Agência N1 - Todos os Direitos Reservados
   * @format html
   */
  copyRight?: string;
}

export default function CopryRight(props: Props) {
  if (!props?.copyRight) {
    return null;
  }

  return (
    <div
      class="text-center mt-12 py-5 text-base-300 text-xs font-normal max-md:mt-4"
      dangerouslySetInnerHTML={{ __html: props.copyRight }}
    />
  );
}
