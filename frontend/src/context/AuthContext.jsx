import {createContext,useContext,useState} from 'react';
import {auth} from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('nexushr_user')||'null'));
 const login=async(credentials)=>{const {data}=await auth.login(credentials);localStorage.setItem('nexushr_token',data.token);localStorage.setItem('nexushr_user',JSON.stringify(data));setUser(data);return data};
 const logout=()=>{localStorage.clear();setUser(null)}; return <C.Provider value={{user,login,logout}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
