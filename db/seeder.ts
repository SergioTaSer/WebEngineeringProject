import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';
import Users, { User } from '@/models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'García y García',
    price: 7.00,
    img: 'https://i0.wp.com/www.audiovisual451.com/wp-content/uploads/2021/05/GarciayGarcia_FotoGrupo_Logo.jpg?fit=1920%2C1357&ssl=1',
    description: 'Dos Javier García son confundidos e intercambian sus papeles: Javier García, mecánico en paro, debe diseñar una estrategia de empresa low cost, y Javier García, asesor internacional, arreglarles un avión. Aambos se van enfrentando a los cometidos del otro, hasta que una fiesta en una loca persecución por las pistas del aeropuerto deciden en el último momento sus destinos!',
  },
  {
    name: 'Barbie',
    price: 20.25,
    img: 'https://phantom-marca-mx.unidadeditorial.es/c6054dd457af5723685de9e985971eed/resize/828/f/jpg/mx/assets/multimedia/imagenes/2023/07/18/16896920030084.jpg',
    description: 'Vivir en Barbie Land consiste en ser un ser perfecto en un lugar perfecto. A menos que tengas una crisis existencial total. O seas un Ken.',
  },
  {
    name: 'Joker',
    price: 14.50,
    img: 'https://www.pikaramagazine.com/wp-content/uploads/2019/11/2-870x399.jpg',
    description: 'Joker es una historia original independiente sobre Arthur Fleck (Joaquin Phoenix), repudiado por la sociedad. Además de analizar el personaje, también es una historia con moraleja.',
  },
  {
    name: 'Escuadrón suicida',
    price: 5.30,
    img: 'https://as02.epimg.net/meristation/imagenes/2021/08/04/videos/1628065109_694590_1628065154_noticia_normal.jpg',
    description: 'Una agencia gubernamental secreta recluta a algunos de los más peligrosos supervillanos encarcelados para formar un grupo de trabajo defensivo. Su primera misión: salvar al mundo del apocalipsis.',
  },
  {
    name: 'Los Japón',
    price: 11.20,
    img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2019/06/japon_2.jpg',
    description: 'Tras la muerte del emperador de Japón, su legítimo heredero, Paco Japón de Coria del Río y su familia emprenden una cómica aventura para convertirse en los nuevos Emperadores.',
  },
  {
    name: 'Campeones',
    price: 8.65,
    img: 'https://valentiahuesca.org/wp-content/uploads/2018/05/campeones-portada.jpg',
    description: 'Marco, un entrenador profesional de baloncesto, se encuentra un día, en medio de una crisis personal, entrenando a un equipo compuesto por personas con discapacidad intelectual. Lo que comienza como un problema se acaba convirtiendo en una lección de vida.',
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();

  const insertedProducts = await Products.insertMany(products);

  const users: User[] = [
    {
      email: 'johndoe@example.com',
      password: await bcrypt.hash('1234', 10),
      name: 'John',
      surname: 'Doe',
      address: '123 Main St, 12345 New York, United States',
      birthdate: new Date('1970-01-01'),
      cartItems: [
        {
          product: insertedProducts[0]._id,
          qty: 2,
        },
        {
          product: insertedProducts[1]._id,
          qty: 5,
        },
      ],
      orders: [],
    },
    {
      email: 'sandramendoza@example.com',
      password: await bcrypt.hash('5678', 10),
      name: 'Sandra',
      surname: 'Mendoza',
      address: '456 Elm St, 54321 Los Angeles, United States',
      birthdate: new Date('1985-03-15'),
      cartItems: [],
      orders: [],
    },
    {
      email: 'sergiotarraga@example.com',
      password: await bcrypt.hash('3456', 10),
      name: 'Sergio',
      surname: 'Tarraga',
      address: '789 Oak St, 67890 Chicago, United States',
      birthdate: new Date('1992-08-22'),
      cartItems: [],
      orders: [],
    },
  ];

  await Orders.createCollection();

  for (const user of users) {
    const res = await Users.create(user);
    console.log(JSON.stringify(res, null, 2));
  }

  const retrievedUser = await Users
    .findOne({ email: 'johndoe@example.com' })
    .populate('cartItems.product');
  console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);
















