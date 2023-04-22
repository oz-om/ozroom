export const TitlesBar = () => {
  return (
    <div id='titlesBar' className='hidden md:block rounded-t-lg my-2 py-1 bg-indigo-800'>
      <ul className='grid grid-cols-[auto_1fr_1fr] gap-x-2 items-center justify-around'>
        <li className='w-16'></li>
        <li className='grid grid-cols-[1fr_auto]'>
          <p>name</p>
          <p className='w-16'>status</p>
        </li>
        <li className='grid grid-cols-3'>
          <p className='text-center'>members</p>
          <p className='text-center'>max</p>
          <p className='text-center'>join</p>
        </li>
      </ul>
    </div>
  );
};
