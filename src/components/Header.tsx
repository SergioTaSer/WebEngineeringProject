

export default function Header() {

    const headerStyle = {
      backgroundImage: `url(${'/img/cine.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.8,
    };


    return (
      <header style={headerStyle} className='mx-auto w-full bg-violet-950 px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32'>
        <div className='mx-auto max-w-2xl'>
          <h1 className='text-6xl font-bold text-gray-200 sm:text-7xl lg:text-8xl'>
            FilmShop
          </h1>
          <p className='mt-4 text-sm leading-8 text-gray-100 sm:mt-6 sm:text-base lg:text-lg'>
            The best films of the moment here.
          </p>
        </div>
      </header>
    );
  }