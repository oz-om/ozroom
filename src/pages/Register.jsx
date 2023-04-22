import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <div id='register-container' className='grid place-content-center pt-32'>
      <div id='register' className='rounded-xl bg-indigo-600/25 px-10 py-2'>
        <div id='head' className='grid place-content-center py-4'>
          <i className='bx bxs-analyse text-6xl mx-auto mb-3 text-indigo-400'></i>
          <p>create new account</p>
        </div>
        <div id='inputs'>
          <div id='user'>
            <label className=''>full name:</label>
            <input type='text' name='user' placeholder='full name' className='input mb-4' />
          </div>
          <div id='email'>
            <label>email:</label>
            <input type='email' name='email' placeholder='email' className='input mb-4' />
          </div>
          <div id='pass'>
            <label className=''>password:</label>
            <input type='password' name='pass' placeholder='password' className='input mb-4' />
          </div>
          <div className='register'>
            <button className='px-4 py-1 bg-violet-500 rounded-md w-28 mx-auto my-5 block'>create one</button>
          </div>
        </div>
        <p className='text-indigo-100 py-3'>
          you already have one
          <Link to='/login' className='text-violet-300 ml-2'>
            login?
          </Link>
        </p>
      </div>
    </div>
  );
};
