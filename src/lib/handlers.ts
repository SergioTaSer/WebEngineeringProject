import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import { Types } from 'mongoose';

export interface UserResponse {
    email: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
  }
  
  export async function getUser(userId: string): Promise<UserResponse | null>  {
    await connect();
  
    const userProjection = {
      email: true,
      name: true,
      surname: true,
      address: true,
      birthdate: true,
    };
    const user = await Users.findById(userId, userProjection);
  
    if (user === null) {
      return null;
    }
  
    return user;
  }
export interface ProductsResponse {
  products: Product[];
}

export interface CreateUserResponse {
    _id: Types.ObjectId | string;
  }
  
  export async function createUser(user: {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
  }): Promise <CreateUserResponse | null>{
    await connect();
  
    const prevUser = await Users.find({ email: user.email });
  
    if (prevUser.length !== 0) {
      return null;
    }
  
    const doc: User = {
      ...user,
      birthdate: new Date(user.birthdate),
      cartItems: [],
      orders: [],
    };
  
    const newUser = await Users.create(doc);
  
    return {
      _id: newUser._id,
    };
  }
export async function getProducts(): Promise<ProductsResponse>{
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
  };

  
  const products = await Products.find({}, productProjection);
  
  return {
    products: products,
  };
  

}


export interface CreateOrderResponse {
  _id: Types.ObjectId | string;
}

export async function createOrder(order: {
  date:Date,
  address:string;
  cardHolder: string;
  cardNumber: string;
}): Promise <CreateOrderResponse | null>{
  await connect();

  

  const doc1: Order = {
    ...order,
    //date://fecha actual,
    orderItems: [],
  };

  const newOrder = await Orders.create(doc1);

  return {
    _id: newOrder._id,
  };
}

  export interface OrderResponse {
    address: string;
    date: Date;
    cardHolder: string;
    cardNumber: string;
    }
    export async function getOrder(orderId: string): Promise<OrderResponse | null> {
    await connect();
    const userProjection = {
      address: true,
      date: true,
      cardHolder: true,
      cardNumber: true
    };
    const order = await Orders.findById(orderId, userProjection);
    if (order === null) {
    return null;
    }
    return order;
    }
