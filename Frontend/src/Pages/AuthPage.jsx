import React from 'react'
import LoginCard from '../component/LoginPage.jsx'
import SignupCard from '../component/Signup.jsx'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import authScreenAtom  from "../Atoms/AuthAtom.js"

function AuthPage() {
    const authSceeenState = useRecoilValue( authScreenAtom )
    console.log(authSceeenState);
    
    useSetRecoilState(authScreenAtom,"login");
  return (
    <div>
        {authSceeenState === "login"?<LoginCard/>:<SignupCard/>}
    </div>
  )
}

export default AuthPage