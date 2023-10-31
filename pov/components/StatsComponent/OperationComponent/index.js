import React, { useContext, useEffect, useState } from 'react';
import styles from "../../../styles/modular/StatsTable/StatsTable.module.css"
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from '../../../contexts/user';
import { PosContext } from '../../../contexts/points';
import { formatDate, req } from '../../../utils/helper';
import { toast } from 'react-toastify';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';



export default function OperationComponent(props){
    const {user,setUser} = useContext(UserContext);
	const {selectedPos,setSelectedPos} = useContext(PosContext);

    // select styles
    const boxStyle = {
		width:"100%",
		maxWidth:"300px",
        margin:"10px 5px",
		bgcolor:"var(--main-dark)",
		borderRadius: 3
	}

	const labelStyle = {
		
		"& .Mui-focused" : {
			color:"var(--orange)"
		}
	}

	const selectStyle = {
		borderRadius:3,
		"& .MuiSvgIcon-root":{
			color:"white"
		},
		"& .Mui-focused" : {
			borderColor:"var(--orange)"
		}
	}

	const formStyle = {
		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline" : {
			borderColor:"var(--orange)"
		},
		"& .MuiInputLabel-root" : {
			color:"var(--orange)"
		},
		"& .MuiSelect-select" : {
			color: "white"
		},
		"& .MuiInputLabel-root.Mui-focused" : {
			color:"var(--orange)"
		}
	}

    // component state

    const [data,setData] = useState([]);
    const [filtered,setFiltered] = useState([]);






    const fetchData = async () => {
        let resp = await req("operation/?pov="+selectedPos.id+"&start="+props.from.getTime()+"&to="+props.to.getTime());
        if (resp){
            toast.success("loaded data")
            setData(resp);
            setFiltered(resp);
        }else{
            toast.error("failed loading data")
        }
    }

    useEffect(() => {
        fetchData().then(() => console.log("loaded orders"))
    },[props.from,props.to,selectedPos])

    



    const html = <>
    <h1 className={"sectionTitle mb-4 ml-4" }>Operations</h1>

    <div className={styles.container}>

        <div className={styles.tableSection}>
        <Table>
						<Thead>
							<Tr>
								<Th>Mouvement</Th>
								<Th>Amount</Th>
                                <Th>Date</Th>
							</Tr>
						</Thead>
						<Tbody>
                            {filtered.map((e,i) => {
                                return <Tr key={i}>
                                            <Td className="capitalize">{e.mvt_type}</Td>
                                            <Td className={ e.mvt_type == "credit" ? styles.red : styles.green }>{(e.mvt_type == "credit" ? "-" : "+") + (e.montant)}</Td>
                                            <Td>{formatDate(new Date(e.date))}</Td>
                                        </Tr>
                            })}
							
						</Tbody>
					</Table>
        </div>

        

    </div>


    </>


    return html;
}