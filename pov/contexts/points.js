import {createContext,useState} from 'react'

export const PosContext = createContext();




export const PosProvider = ({children}) => {

	const [data,setData] = useState([]);
	const [selectedPos,setSelectedPos] = useState(null);


	return <PosContext.Provider value={{data,setData,selectedPos,setSelectedPos}}>
		{children}
	</PosContext.Provider>


}