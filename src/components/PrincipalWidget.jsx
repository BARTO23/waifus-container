export const PrincipalWidget = ({ name, image, description }) => {
  return (
    <div className="relative group flex items-center bg-white border border-gray-200 rounded-lg shadow w-[340px] dark:border-DarkRed dark:bg-LightDarkRed hover:border-white min-h-[120px] overflow-hidden mb-5">
      {/* Imagen que se expande y se mueve hacia arriba */}
      <img
        className="object-cover w-full h-full rounded-lg transition-transform duration-500 ease-in-out transform group-hover:opacity-40 group-hover:scale-110 group-hover:-translate-y-5"
        src={image}
        alt={name}
      />
      
      {/* Contenedor del texto que aparece al hacer hover */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 leading-normal opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
        <h1 className="mb-2 text-lg font-bold tracking-tight text-white">
          {name}
        </h1>
        <p className="mb-3 text-xs font-normal text-gray-200">
          {description}
        </p>
      </div>
    </div>
  );
};
