import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';
import Users, { User } from '@/models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
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
  };
  const res = await Users.create(user);
  console.log(JSON.stringify(res, null, 2));
  const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' })
  .populate('cartItems.product');
console.log(JSON.stringify(retrievedUser, null, 2));




  await conn.disconnect();
}

const orders: Order[] = [
   
    
];






async function seed1() {
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
const order: Order = {
 
      address  : ' Unnamed Street 123 , 12345 London , UK' ,
      date  : new Date('1970 -01 -01 T00 :00:00.000 Z'),
      cardHolder : 'Foo Bar'  ,
      cardNumber  : '0000111122223333',
    

  orderItems: [
    {
      product: insertedProducts[0]._id,
      qty: 2,
      price:3,
    },
    {
      product: insertedProducts[1]._id,
      qty: 5,
      price:3,
    },
  ]
};
const res = await Users.create(order);
console.log(JSON.stringify(res, null, 2));
const retrievedUser = await Users
.findOne({ address: ' Unnamed Street 123 , 12345 London , UK'  })
.populate('orderItems.product');
console.log(JSON.stringify(retrievedUser, null, 2));

await conn.disconnect();
};

seed().catch(console.error);
seed1().catch(console.error);