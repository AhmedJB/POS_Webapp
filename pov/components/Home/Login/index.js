import { useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../contexts/user";
import loginStyles from "../../../styles/modular/Login/Login.module.css"
import { get_token } from "../../../utils/helper";

export default function Login(props){   
    
    const {user,setUser} = useContext(UserContext);

    const login = async () => {
        toast.info("Login in");
        let pin = document.getElementById("field").value;
        console.log(pin);
        let resp = await get_token(pin);
        if (resp){
			let temp = {...user}
			temp.logged = true
			temp.role = resp.role
			temp.nom = resp.nom
			temp.prenom = resp.prenom
			setUser(temp)
        }else{
            toast.error("Login Failed")
        }
    }


    const activenumber =(val) =>{
        val = "" + val;
        console.log("here")
        console.log(val);
        let a=document.querySelector('#field');
        if (val.length > 0){
            
        
            a.value+=val;
        }else{
            a.value = "";
        }
        
        
    }

 
    return(
    <div className={loginStyles.login}>
        <div className={loginStyles.container}>
            <div className={loginStyles.pin}>
                <h2> PIN </h2>
                <input id='field' type="password" />
            </div>

            <div className={loginStyles.numbers}>
                 <button value="1" onClick={() =>  {activenumber(1)} }>1</button>
                <button value="2" onClick={() =>  {activenumber(2)} }>2</button>
                <button value="3"onClick={ () => { activenumber(3)} }>3</button>
                <button value="4"onClick={ () => {activenumber(4)} }>4</button>
                <button value="5"onClick={ () => {activenumber(5)} }>5</button>
                <button value="6"onClick={ () => {activenumber(6)} }>6</button>
                <button value="7"onClick={ () => {activenumber(7)} }>7</button>
                <button value="8"onClick={ () => {activenumber(8)} }>8</button>
                <button value="9"onClick={ () => {activenumber(9)} }>9</button>
                <button value=","onClick={ () => {activenumber(',')} }>,</button>
                <button value="0"onClick={ () => {activenumber(0)} }>0</button>
                <button value="×" onClick={ () => {activenumber('')} }>×</button>
            </div>

            <div className={loginStyles.btn}>
                <button className={loginStyles.btnlogin} onClick={login}> LOGIN </button>
                {/* <button className={loginStyles.advlogin}> Advanced Login </button> */}
            </div>
        </div>
    </div>
    );
}
