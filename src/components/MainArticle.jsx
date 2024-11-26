import Marin from "../assets/marin-kitagawa-sucubo.png";
import Rias from "../assets/RiasGremory.png";
import Stella from "../assets/Stella-Vermillion.png";
import Yinling from "../assets/yinlin-principal.png";
import Steph from '../assets/steph-ngnl.png'
import Eris from '../assets/Eris.png'
import { PrincipalWidget } from "./PrincipalWidget";

export const MainArticle = () => {
  return (
    <main className="bg-DarkRed w-full min-h-screen flex flex-col px-10"> {/* Ajusta el padding aquí */}
      <div className="flex flex-col items-center">
        <h1 className="text-white text-7xl font-mono m-10 text-center">
          Readhead Waifus.
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <button className="text-white bg-red-600 p-5 rounded-lg text-xl font-mono mb-10 hover:bg-LightDarkRed">
          Añadir Waifu
        </button>
      </div>

      {/* Contenedor para los widgets con gap modificado y centrado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto"> {/* Agrega mx-auto para centrar el grid */}
        <PrincipalWidget
          name="Yin ling"
          image={Yinling}
          description="Anteriormente conocida como una destacada patrullera de Jinzhou, Yinlin es firme y fiable, pero esconde profundos secretos.Destaca en la explotación de los recursos a su disposición para descubrir los crímenes que la acechan.Bajo su exterior distante y extravagante, Yinlin posee un corazón de oro, reservado sólo para aquellos a los que considera dignos de confianza."
        />
        <PrincipalWidget
          name="Marin Kitagawa"
          image={Marin}
          description="Marin usa una peluca de color rojo burdeos con dos colas e incluso flequillo que le llega hasta los hombros, su cabello de la espalda está atado en coletas con cintas negras e hinchadas que tienen cuernos. También lleva orejas puntiagudas que se pueden acoplar."
        />
        <PrincipalWidget
          name="Rias Gremory"
          image={Rias}
          description="Demonio de Clase Alta, miembro de la familia Gremory una de las 3 familias mas importantes del inframundo, posee una fuerza increible superior a la de otros demonios gracias a ser la hija del Clan Gremory y el Clan Abel, aparece en Kenja No Ishi cuando Raiser queria volver a ganarse su mano en matrimonio por la fuerza."
        />
        <PrincipalWidget
          name="Stella Vermillion"
          image={Stella}
          description="Es la protagonista femenina del anime, novelas y manga Rakudai Kishi no Eiyuutan. Es un caballero en aprendizaje de rango A y la segunda princesa del reino Vermillion. Es la única Desperado de su nación."
        />
        <PrincipalWidget
          name="Steph"
          image={Steph}
          description="Stephanie es expresiva y emocional, al punto en que no puede ocultarlos durante un juego de póquer. Ella amaba a su abuelo querido y se enoja cuando la gente llama a su abuelo un tonto."
        />
        <PrincipalWidget
          name='Eris Boreas Greyrat'
          image={Eris}
          description="Eris Boreas Greyrat es una chica noble y prima segunda de Rudeus. Es un personaje tsundere con poco temperamento, pero tiene potencial en el estilo Sword-God. Durante su viaje de regreso a casa tras el incidente del teletransporte, llega a amar a Rudeus."
        />
      </div>
    </main>
  );
};

