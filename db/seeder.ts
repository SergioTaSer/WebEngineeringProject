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
    name: 'Earthen Bottle',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    description: 'What a bottle!',
  },
  {
    name: 'Nomad Tumbler',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    description: 'Yet another item',
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
















