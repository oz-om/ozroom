export const Pagination = () => {
  return (
    <div className='pagination flex justify-center items-center p-1 mt-2 rounded-xl bg-violet-700/25 lg:justify-center bottom-0 w-full'>
      <div id='pagination' className='flex items-center gap-x-3'>
        <div id='pagination-total'>
          <span id='current'>1 </span>
          of
          <span id='total'> 321</span>
        </div>
        <div id='arrows' className='text-4xl flex'>
          <div id='start' className=''>
            <i className='bx bx-chevrons-left cursor-pointer rounded-full hover:bg-indigo-300'></i>
          </div>
          <div id='back'>
            <i className='bx bx-chevron-left cursor-pointer rounded-full ml-3 hover:bg-indigo-300'></i>
          </div>
          <div id='front'>
            <i className='bx bx-chevron-right cursor-pointer rounded-full ml-3 hover:bg-indigo-300'></i>
          </div>
          <div id='end'>
            <i className='bx bx-chevrons-right cursor-pointer rounded-full ml-3 hover:bg-indigo-300'></i>
          </div>
        </div>
      </div>
    </div>
  );
};
