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



export default function OrderComponent(props){
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
    const [selectedClient,setSelectedClient] = useState("all");


    const fetchData = async () => {
        let resp = await req("order/?pov="+selectedPos.id+"&start="+props.from.getTime()+"&to="+props.to.getTime());
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
        let temp2 = []
        data.forEach((e) => {
            if (!temp1.filter((t) => t.id === e.user.id).length > 0){
                temp1.push(e.user)
            }
            if (!temp2.filter((t) => t.id === e.client.id).length > 0){
                temp2.push(e.client)
            }
        })
        setUsers(temp1);
        setClients(temp2);
    },[data])
    
    useEffect(() => {
        let temp = [...data];
        if (selectedUser !== "all"){
            temp = temp.filter((e) => e.user.id === selectedUser)
        }
        if (selectedClient !== "all"){
            temp = temp.filter((e) => e.client.id === selectedClient)
        }
        setFiltered(temp);
    },[selectedUser,selectedClient])

    function handleUserChange(e,value){
		console.log(e);
		console.log(value);
		setSelectedUser(value.props.value);
	}

    function handleClientChange(e,value){
		console.log(e);
		console.log(value);
		setSelectedClient(value.props.value);
	}



    const html = <>
    <h1 className={"sectionTitle mb-4 ml-4" }>Orders</h1>

    <div className={styles.container}>
        <div className={styles.filterSection}>
        <Box sx={boxStyle}>
			<FormControl sx={formStyle} fullWidth>
				<InputLabel sx={labelStyle} id="poslabel">Users</InputLabel>
				<Select
				labelId="poslabel"
				id="demo-simple-select"
				sx={selectStyle}
				value={selectedUser}
				label="Users"
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
            <Box sx={boxStyle}>
			<FormControl sx={formStyle} fullWidth>
				<InputLabel sx={labelStyle} id="poslabel">Clients</InputLabel>
				<Select
				labelId="poslabel"
				id="demo-simple-select"
				sx={selectStyle}
				value={selectedClient}
				label="Clients"
				onChange={handleClientChange}
				>
                    <MenuItem key={-1} value={"all"}>All</MenuItem>
				{   

					clients.map((e,i) => {
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
								<Th>User</Th>
								<Th>Client</Th>
								<Th>Total</Th>
                                <Th>Paid</Th>
                                <Th>Reste</Th>
                                <Th>Date</Th>
							</Tr>
						</Thead>
						<Tbody>
                            {filtered.map((e,i) => {
                                return <Tr key={i}>
                                            <Td>{e.user.nom + " " + e.user.prenom}</Td>
                                            <Td>{e.client.nom + " " + e.client.prenom}</Td>
                                            <Td>{e.total}</Td>
                                            <Td>{e.paid}</Td>
                                            <Td>{e.reste}</Td>
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