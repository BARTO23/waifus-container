import YinlingImg from '../assets/yinlin-principal.png';
import MarinImg from '../assets/marin-kitagawa-sucubo.png';
import RiasImg from '../assets/RiasGremory.png';
import StellaImg from '../assets/Stella-Vermillion.png';
import StephImg from '../assets/steph-ngnl.png';
import ErisImg from '../assets/Eris.png';

export const localWaifus = [
  {
    id: 'local-1',
    name: 'Yin ling',
    image: YinlingImg,
    description: 'Anteriormente conocida como una destacada patrullera de Jinzhou, Yinlin es firme y fiable, pero esconde profundos secretos. Destaca en la explotación de los recursos a su disposición para descubrir los crímenes que la acechan. Bajo su exterior distante y extravagante, Yinlin posee un corazón de oro, reservado sólo para aquellos a los que considera dignos de confianza.',
    dominantColor: '#B85C38',
    source: 'Local',
    tags: ['patrollera', 'Jinzhou'],
    fromApi: false,
  },
  {
    id: 'local-2',
    name: 'Marin Kitagawa',
    image: MarinImg,
    description: 'Marin usa una peluca de color rojo burdeos con dos colas e incluso flequillo que le llega hasta los hombros, su cabello de la espalda está atado en coletas con cintas negras e hinchadas que tienen cuernos. También lleva orejas puntiagudas que se pueden acoplar.',
    dominantColor: '#8B0000',
    source: 'Local',
    tags: ['cosplay', 'My Dress-Up Darling'],
    fromApi: false,
  },
  {
    id: 'local-3',
    name: 'Rias Gremory',
    image: RiasImg,
    description: 'Demonio de Clase Alta, miembro de la familia Gremory una de las 3 familias mas importantes del inframundo, posee una fuerza increible superior a la de otros demonios gracias a ser la hija del Clan Gremory y el Clan Abel.',
    dominantColor: '#8B0000',
    source: 'Local',
    tags: ['High School DxD', 'demonio'],
    fromApi: false,
  },
  {
    id: 'local-4',
    name: 'Stella Vermillion',
    image: StellaImg,
    description: 'Es la protagonista femenina del anime, novelas y manga Rakudai Kishi no Eiyuutan. Es un caballero en aprendizaje de rango A y la segunda princesa del reino Vermillion. Es la única Desperado de su nación.',
    dominantColor: '#A52A2A',
    source: 'Local',
    tags: ['caballero', 'Rakudai Kishi'],
    fromApi: false,
  },
  {
    id: 'local-5',
    name: 'Steph',
    image: StephImg,
    description: 'Stephanie es expresiva y emocional, al punto en que no puede ocultarlos durante un juego de póquer. Ella amaba a su abuelo querido y se enoja cuando la gente llama a su abuelo un tonto.',
    dominantColor: '#A52A2A',
    source: 'Local',
    tags: ['No Game No Life', 'elfa'],
    fromApi: false,
  },
  {
    id: 'local-6',
    name: 'Eris Boreas Greyrat',
    image: ErisImg,
    description: 'Eris Boreas Greyrat es una chica noble y prima segunda de Rudeus. Es un personaje tsundere con poco temperamento, pero tiene potencial en el estilo Sword-God. Durante su viaje de regreso a casa tras el incidente del teletransporte, llega a amar a Rudeus.',
    dominantColor: '#8B4513',
    source: 'Local',
    tags: ['Mushoku Tensei', 'nobles'],
    fromApi: false,
  },
];

export function getLocalWaifus() {
  return localWaifus;
}