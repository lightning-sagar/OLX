import React, { useState } from 'react'
import userAtom from '../Atoms/userAtom'
import useShowToast from './useshowtoast';

function uselogout() {
   const [user,setuser] = useState(userAtom);
   const toast = useShowToast();
   const logout = async() => {
    try {
        const res = await fetch('/api/user/logout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        if(!res.ok) {
            const errordata = await res.json();
            toast("Error", errordata.err, "error");
            return;
        }
        const data = await res.json();
        console.log(data,"logout");
        localStorage.removeItem('user');
        setuser(null);
        window.location.reload();
    } catch (error) {
        console.log(error)
        toast("Error", error, "error");
    }
   }
   return logout;

}

export default uselogout