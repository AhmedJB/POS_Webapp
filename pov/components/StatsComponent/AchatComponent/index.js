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



export default function AchatComponent(props){
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
    const [users,setUsers] = useState([]);
    const [clients,setClients] = useState([]);

    // selects state
    const [selectedUser,setSelectedUser] = useState("all");



    const fetchData = async () => {
        let resp = await req("achat/?pov="+selectedPos.id+"&start="+props.from.getTime()+"&to="+props.to.getTime());
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

    useEffect(() => {
        let temp1 = []
        data.forEach((e) => {
            if (!temp1.filter((t) => t.id === e.fournisseur.id).length > 0){
                temp1.push(e.fournisseur)
            }
            
        })
        setUsers(temp1);
    },[data])
    
    useEffect(() => {
        let temp = [...data];
        if (selectedUser !== "all"){
            temp = temp.filter((e) => e.fournisseur.id === selectedUser)
        }
        
        setFiltered(temp);
    },[selectedUser])

    function handleUserChange(e,value){
		console.log(e);
		console.log(value);
		setSelectedUser(value.props.value);
	}




    const html = <>
    <h1 className={"sectionTitle mb-4 ml-4" }>Achats</h1>

    <div className={styles.container}>
        <div className={styles.filterSection}>
        <Box sx={boxStyle}>
			<FormControl sx={formStyle} fullWidth>
				<InputLabel sx={labelStyle} id="poslabel">Fournisseur</InputLabel>
				<Select
				labelId="poslabel"
				id="demo-simple-select"
				sx={selectStyle}
				value={selectedUser}
				label="Fournisseur"
				onChange={handleUserChange}
				>
                    <MenuItem key={-1} value={"all"}>All</MenuItem>
				{   

					users.map((e,i) => {
						return <MenuItem key={i} value={e.id}>{e.nom + " " + e.prenom}</MenuItem>
					})
				}
				
				</Select>
			</FormControl>
			</Box>
        </div>

        <div className={styles.tableSection}>
        <Table>
						<Thead>
							<Tr>
								<Th>Product</Th>
								<Th>Fournisseur</Th>
								<Th>Quantity</Th>
                                <Th>Total</Th>
                                <Th>Date</Th>
							</Tr>
						</Thead>
						<Tbody>
                            {filtered.map((e,i) => {
                                return <Tr key={i}>
                                            <Td>{e.product.name}</Td>
                                            <Td>{e.fournisseur.nom + " " + e.fournisseur.prenom}</Td>
                                            <Td>{e.quantity}</Td>
                                            <Td>{e.total}</Td>
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