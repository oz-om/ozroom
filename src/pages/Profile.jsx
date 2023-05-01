export default function Profile() {
  return (
    <div id='profile' className='px-4 h-[calc(100vh_-_70px)]'>
      <div className='grid place-content-center p-3'>
        <img src='https://avatars.dicebear.com/api/bottts/ro.svg?background=%23A3D521' alt='photo profile' className='w-36 h-36 border-4 border-indigo-50 rounded-full' />
        <div id='change'>
          <label htmlFor='change-photo' className='grid place-content-center'>
            <i className='bx bx-cloud-upload text-3xl'></i>
          </label>
          <input type='file' id='change-photo' className='hidden' />
        </div>
      </div>
      <div id='details' className='md:flex md:justify-center md:gap-x-4'>
        <div id='user-info' className='mb-4 rounded-md p-4 min-h-[215px] bg-indigo-700/25'>
          <div id='name'>
            <p className='text-white/70'>full name:</p>
            <span>Adnane aberahim</span>
          </div>
          <div id='email'>
            <p className='text-white/70'>email:</p>
            <span>Adnane_aberahim@mail.com</span>
          </div>
        </div>
        <div id='reset-pass' className='rounded-md p-4 min-h-[215px] bg-indigo-700/25'>
          <div id='old'>
            <label htmlFor='old-pass'>current password:</label>
            <input type='password' name='old' id='old-pass' placeholder='old password' className='input' />
          </div>
          <div id='new' className='mt-2'>
            <label htmlFor='new-pass'>new password:</label>
            <input type='password' name='new' id='new-pass' placeholder='new password' className='input' />
          </div>
          <div id='update' className='mt-2'>
            <button className='bg-indigo-400 py-1 px-4 rounded-md ml-10 mt-3 cursor-pointer'>update</button>
          </div>
        </div>
      </div>
    </div>
  );
}
