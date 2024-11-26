export const NavBar = () => {
  return (
    <div className="bg-LightDarkRed flex flex-col w-52 text-white items-center text-2xl gap-5 pt-10 rounded-s-lg">
      <ul className="flex flex-col items-center gap-5 hover:cursor-pointer">
        <li className="hover:text-gray-500">Inicio</li>
        <li className="hover:text-gray-500">Galeria</li>
        <li className="hover:text-gray-500">Categorias</li>
        <li className="hover:text-gray-500">Etiquetas</li>
      </ul>
    </div>
  );
};
