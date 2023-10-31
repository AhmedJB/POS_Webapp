import React,{useContext, useEffect,useState} from 'react'
import { toast } from 'react-toastify'
import { UserContext } from '../../../contexts/user';
import styles from "../../../styles/modular/Checker/checker.module.css"
import { isLogged } from '../../../utils/helper';
import Loader from '../Loader';
import Router from "next/router"
import { PosContext } from '../../../contexts/points';


export default function Checker(props){
	const [loading,setLoading] = useState(true);
	const {user,setUser} = useContext(UserContext);
	const {selectedPos,setSelectedPos} = useContext(PosContext);

	const CheckUser = async () => {
		if (user){
			if (user.logged){
				return user;
			}
			console.log(Router.pathname)
			let resp = await isLogged();
			if (resp){
				
				let temp = {...user}
				temp.logged = true
				temp.role = resp.role
				temp.nom = resp.nom
				temp.prenom = resp.prenom
				temp.id = resp.id
				setUser(temp)
				return temp.logged
			}else{
				
				return false
			}
		}
		
	}


	useEffect(() => {
		setLoading(true);
		CheckUser().then((res) => {
			if (res) {
				if (props.login || !selectedPos){
					toast.success("Logged in");
					Router.push("/app/overview")
				}
			}else{
				if (!props.login){
					Router.push("/app/login")
				}else{
					toast.error("Need login")
				}
			}
			setLoading(false);
		})
	} , [user])


	return  <>
		{loading && <div className="fullpage flex items-center justify-center">
			<Loader />
		</div> }

		{!loading && props.children}
	</>


}