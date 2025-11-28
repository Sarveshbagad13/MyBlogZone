import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import { login, logout } from './store/authSlice'
import {Header, Footer} from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  useEffect(() => {
    authService.getCurrentUser()
    .then((userdata) => {
      if(userdata) {
        dispatch(login({userdata}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  return !loading ? (
    <div className='min-h-screen w-screen flex flex-col bg-[#CFFCFF]'>
      <header className='w-full'>
        <Header/>
      </header>
      <main className='flex-1 w-full px-4 py-3'>
        <Outlet/>
      </main>
      <footer className='w-full mt-auto'>
        <Footer/>
      </footer>
    </div>
  ) : null
}

export default App
