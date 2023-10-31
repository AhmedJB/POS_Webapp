import {createContext,useState} from 'react'

export const UserContext = createContext();




export const UserProvider = ({children}) => {

	const [user,setUser] = useState({
		logged : false,
		role : '',
		nom : "",
		prenom : "",
		id : null,
	});


	return <UserContext.Provider value={{user,setUser}}>
		{children}
	</UserContext.Provider>


}