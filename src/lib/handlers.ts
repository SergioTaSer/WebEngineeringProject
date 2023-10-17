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

export async function getProducts1(productId: string): Promise<ProductsResponse>{
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
    description:true,
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
  address: string;
  cardHolder: string;
  cardNumber: string;
}): Promise<CreateOrderResponse | null> {
  await connect();

  const doc1: Order = {
    ...order,
    date: new Date(), // Agrega la fecha actual
    orderItems: [],
  };

  const newOrder = await Orders.create(doc1);

  return {
    _id: newOrder._id.toString(), // Convierte el ObjectId a una cadena
  };
}




export interface OrderItem {
  _id: string;
  address: string;
  date: string; 
  cardHolder: string;
  cardNumber: string;
}

export interface OrderResponse {
  orders: OrderItem[]; 
}

export async function getOrder(userId: string): Promise<OrderResponse | null> {
  await connect();

  const orderProjection = {
    _id: true,
    address: true,
    date: true,
    cardHolder: true,
    cardNumber: true,
  };
  if (userId === null) {
    return null;
  }
  const orders = await Orders.find({}, orderProjection);
  if (orders === null) {
    return null;
  }

  return {
    orders: orders.map((order) => ({
      _id: order._id.toString(),
      address: order.address,
      date: order.date.toISOString(), // Formatea la fecha como ISOString
      cardHolder: order.cardHolder,
      cardNumber: order.cardNumber,
    })),
  };
}



    //UpdateCartItem function to perform PUT operation

    export interface UpdateCartItemResponse {
      cartItems: User['cartItems'],
      created: boolean;
    }
    
export async function updateCartItem(
  userId: string,
  productId: string,
  qty: number
): Promise<UpdateCartItemResponse | null> {
  await connect();
  var created;

  const product = await Products.findById(productId);
  if (product === null) return null;

  const user = await Users.findById(userId);
  if (user === null) return null;

  const cartItem = user.cartItems.find(
    (cartItem: any) =>
      cartItem.product._id.equals(productId)
  );

  if (cartItem) {
    //TRUE: Cambiamos la cantidad
    cartItem.qty = qty
    created = false
  } else {
    //cambiamos la cantidad
    const newCartItem = {
      product: new Types.ObjectId(productId),
      qty: qty
    }

    user.cartItems.push(newCartItem);
    created = true
  }

  await user.save();

  const userProjection = {
    _id: false,
    cartItems: true
  }

  const productProjection = {
    name: true,
    price: true
  };

  const updatedUser = await Users
    .findById(userId, userProjection).populate("cartItems.product", productProjection)

  const output = {
    cartItems: updatedUser,
    created: created
  };

  return output; //// tenemos que devolver un boolean tambien
}








export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  qty: number;
}

export interface CartResponse {
  cartItems: CartItem[];
}

export async function getCart(userId: string): Promise<CartResponse | null> {
  await connect();

  const cartProjection = {
    'cartItems.product': true,
    'cartItems.qty': true,
  };

  const cartResponse = await Users.findById(userId, cartProjection);

  if (cartResponse === null) {
    return null;
  }

 
  const cartItemsDetails = await Promise.all(
    cartResponse.cartItems.map(async (item: any) => {
      const productDetails = await Products.findById(item.product);
      return {
        product: {
          _id: productDetails._id,
          name: productDetails.name,
          price: productDetails.price,
        },
        qty: item.qty,
      };
    })
  );

  
  const cart1Response: CartResponse = {
    cartItems: cartItemsDetails,
  };

  return cart1Response;
}



export async function removeFromCart(userId: string, productId: string): Promise<CartResponse | {}> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
    return { status: 400, message: 'Invalid userId or productId' };
  }

  await connect();

  try {
    // Obtiene el carrito actual del usuario
    const cartResponse = await getCart(userId);

    if (!cartResponse) {
      return { status: 404, message: 'Cart not found' };
    }

    // Encuentra el índice del producto que se va a eliminar en el carrito
    const productIndex = cartResponse.cartItems.findIndex(
      (item: CartItem) => item.product._id === productId
    );

    if (productIndex === -1) {
      return { status: 404, message: 'Product not found in cart' };
    }

    // Elimina el producto del carrito
    cartResponse.cartItems.splice(productIndex, 1);

    // Actualiza el carrito en la base de datos
    const updatedCart = await Users.findByIdAndUpdate(
      userId,
      { 'cartItems': cartResponse.cartItems },
      { new: true }
    );

    if (!updatedCart) {
      return { status: 404, message: 'Failed to update cart' };
    }

    // Retorna el carrito actualizado
    const cartResponseDetails = await Promise.all(
      updatedCart.cartItems.map(async (item: any) => {
        const productDetails = await Products.findById(item.product);
        return {
          product: {
            _id: productDetails._id,
            name: productDetails.name,
            price: productDetails.price,
          },
          qty: item.qty,
        };
      })
    );

    const updatedCartResponse: CartResponse = {
      cartItems: cartResponseDetails,
    };

    return updatedCartResponse;
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'Internal server error' };
  }
}



export async function getOrder1(userId: string): Promise<OrderResponse | null> {
  await connect();

  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }

  const order = await Orders.findOne({ _id: userId });

  if (!order) {
    return null;
  }

  // Obtén los detalles de la orden y los elementos de la orden
  const orderDetails = {
    _id: order._id.toString(),
    address: order.address,
    date: order.date.toISOString(),
    cardHolder: order.cardHolder,
    cardNumber: order.cardNumber,
    orderItems: order.orderItems.map((orderItem:any) => ({
      product: orderItem.product.toString(),
      qty: orderItem.qty,
      price: orderItem.price,
    })),
  };

  return {
    orders: [orderDetails],
  };
}
